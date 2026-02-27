import { pool } from '../config/db.js';

export const getAll = async () => {
    const { rows } = await pool.query('SELECT * FROM insurance ORDER BY insurance_provider_id ASC');
    return rows;
};

export const getById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM insurance WHERE insurance_provider_id = $1', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { name } = data;
    const { rows } = await pool.query(
        'INSERT INTO insurance (name) VALUES ($1) RETURNING *',
        [name]
    );
    return rows[0];
};

export const update = async (id, data) => {
    const { name } = data;
    const { rows } = await pool.query(
        'UPDATE insurance SET name = $1 WHERE insurance_provider_id = $2 RETURNING *',
        [name, id]
    );
    return rows[0];
};

export const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM insurance WHERE insurance_provider_id = $1', [id]);
    return rowCount > 0;
};
