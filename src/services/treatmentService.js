import { pool } from '../config/db.js';

export const getAll = async () => {
    const { rows } = await pool.query('SELECT * FROM treatment ORDER BY treatment_code ASC');
    return rows;
};

export const getByCode = async (code) => {
    const { rows } = await pool.query('SELECT * FROM treatment WHERE treatment_code = $1', [code]);
    return rows[0];
};

export const create = async (data) => {
    const { treatment_code, name, description, cost } = data;
    const { rows } = await pool.query(
        'INSERT INTO treatment (treatment_code, name, description, cost) VALUES ($1, $2, $3, $4) RETURNING *',
        [treatment_code, name, description, cost]
    );
    return rows[0];
};

export const update = async (code, data) => {
    const { name, description, cost } = data;
    const { rows } = await pool.query(
        'UPDATE treatment SET name = $1, description = $2, cost = $3 WHERE treatment_code = $4 RETURNING *',
        [name, description, cost, code]
    );
    return rows[0];
};

export const remove = async (code) => {
    const { rowCount } = await pool.query('DELETE FROM treatment WHERE treatment_code = $1', [code]);
    return rowCount > 0;
};
