// src/services/patientService.js
import { pool } from '../config/db.js';

// --- Funciones CRUD Básicas de SQL ---

export const getAll = async () => {
    const { rows } = await pool.query('SELECT * FROM patient ORDER BY id ASC');
    return rows;
};

export const getById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM patient WHERE id = $1', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { first_name, last_name, email, phone, address } = data;
    const { rows } = await pool.query(
        'INSERT INTO patient (first_name, last_name, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [first_name, last_name, email, phone, address]
    );
    return rows[0];
};

export const update = async (id, data) => {
    const { first_name, last_name, email, phone, address } = data;
    const { rows } = await pool.query(
        'UPDATE patient SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5 WHERE id = $6 RETURNING *',
        [first_name, last_name, email, phone, address, id]
    );
    return rows[0];
};

export const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM patient WHERE id = $1', [id]);
    return rowCount > 0;
};

// --- Funciones Nuevas para Sincronización con Mongo ---

// Obtiene todos los IDs para poder iterar sobre ellos en el proceso masivo
export const getAllPatientIds = async () => {
    const { rows } = await pool.query('SELECT id FROM patient');
    return rows.map(r => r.id);
};

// Construye el objeto completo (Paciente + Array de Citas)
export const getFullPatientHistory = async (patientId) => {
    // 1. Obtener datos del paciente
    const patientQuery = `SELECT * FROM patient WHERE id = $1`;
    const patientRes = await pool.query(patientQuery, [patientId]);
    const patientData = patientRes.rows[0];

    if (!patientData) return null;

    // 2. Obtener TODAS las citas de este paciente con joins para traer nombres
    const appointmentsQuery = `
        SELECT
            a.appointment_id,
            a.date,
            a.amount_paid,
            t.treatment_code,
            t.name            AS treatment_name,
            t.cost            AS treatment_cost,
            i.insurance_provider_id,
            i.name            AS insurance_name,
            ic.coverage_percentage,
            d.id              AS doctor_id,
            d.first_name      AS doctor_first_name,
            d.last_name       AS doctor_last_name,
            d.email           AS doctor_email,
            s.name            AS specialty_name
        FROM appointment a
        JOIN treatment t ON t.treatment_code = a.treatment_code
        JOIN insurance i ON i.insurance_provider_id = a.insurance_provider_id
        JOIN insurance_coverage ic
             ON ic.insurance_provider_id = a.insurance_provider_id
             AND ic.treatment_code = a.treatment_code
        JOIN doctor d ON d.id = a.doctor_id
        JOIN specialty s ON s.specialty_id = d.specialty_id
        WHERE a.patient_id = $1
        ORDER BY a.date DESC
    `;

    const appointmentsRes = await pool.query(appointmentsQuery, [patientId]);

    // 3. Mapear al formato JSON deseado
    const appointments = appointmentsRes.rows.map(r => ({
        appointment_id: r.appointment_id,
        date: r.date,
        amount_paid: Number(r.amount_paid),
        treatment: {
            code: r.treatment_code,
            name: r.treatment_name,
            cost: Number(r.treatment_cost)
        },
        insurance: {
            id: r.insurance_provider_id,
            name: r.insurance_name,
            coverage_percentage: Number(r.coverage_percentage)
        },
        doctor: {
            id: r.doctor_id,
            first_name: r.doctor_first_name,
            last_name: r.doctor_last_name,
            specialty: r.specialty_name
        }
    }));

    return {
        patientId: patientData.id,
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        email: patientData.email,
        phone: patientData.phone,
        address: patientData.address,
        history: appointments
    };
};
