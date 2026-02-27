// src/services/appointmentService.js
import { pool } from '../config/db.js';

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const computeAmountPaid = async ({ insurance_provider_id, treatment_code }) => {
    const { rows } = await pool.query(
        `
        SELECT t.cost, ic.coverage_percentage
        FROM treatment t
        JOIN insurance_coverage ic
          ON ic.treatment_code = t.treatment_code
        WHERE ic.insurance_provider_id = $1
          AND ic.treatment_code = $2
        `,
        [insurance_provider_id, treatment_code]
    );

    if (!rows[0]) {
        const err = new Error('No existe cobertura para (insurance_provider_id, treatment_code)');
        err.statusCode = 400;
        throw err;
    }

    const cost = Number(rows[0].cost);
    const coverage = Number(rows[0].coverage_percentage);
    return round2(cost * (1 - coverage / 100));
};

export const getAll = async () => {
    const query = `
        SELECT a.*,
               p.first_name as patient_name,
               d.first_name as doctor_name
        FROM appointment a
                 JOIN patient p ON a.patient_id = p.id
                 JOIN doctor d ON a.doctor_id = d.id
        ORDER BY a.date DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
};

export const getById = async (id) => {
    const query = `SELECT * FROM appointment WHERE appointment_id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

export const create = async (data) => {
    const {
        appointment_id,
        doctor_id,
        patient_id,
        date,
        treatment_code,
        insurance_provider_id,
        amount_paid
    } = data;

    const finalAmountPaid =
        amount_paid === undefined || amount_paid === null
            ? await computeAmountPaid({ insurance_provider_id, treatment_code })
            : amount_paid;

    const { rows } = await pool.query(
        `INSERT INTO appointment (appointment_id, doctor_id, patient_id, date, treatment_code, insurance_provider_id, amount_paid)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [appointment_id, doctor_id, patient_id, date, treatment_code, insurance_provider_id, finalAmountPaid]
    );
    return rows[0];
};

export const update = async (id, data) => {
    const { doctor_id, patient_id, date, treatment_code, insurance_provider_id, amount_paid } = data;

    const finalAmountPaid =
        amount_paid === undefined || amount_paid === null
            ? await computeAmountPaid({ insurance_provider_id, treatment_code })
            : amount_paid;

    const { rows } = await pool.query(
        `UPDATE appointment
         SET doctor_id = $1, patient_id = $2, date = $3, treatment_code = $4, insurance_provider_id = $5, amount_paid = $6
         WHERE appointment_id = $7 RETURNING *`,
        [doctor_id, patient_id, date, treatment_code, insurance_provider_id, finalAmountPaid, id]
    );
    return rows[0];
};

export const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM appointment WHERE appointment_id = $1', [id]);
    return rowCount > 0;
};
