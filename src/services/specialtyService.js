import { pool } from '../config/db.js';

export const getAll = async () => {
    const { rows } = await pool.query('SELECT * FROM specialty ORDER BY specialty_id ASC');
    return rows;
};

export const getById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM specialty WHERE specialty_id = $1', [id]);
    return rows[0];
};

export const create = async (data) => {
    const { name } = data;
    const { rows } = await pool.query(
        'INSERT INTO specialty (name) VALUES ($1) RETURNING *',
        [name]
    );
    return rows[0];
};

export const update = async (id, data) => {
    const { name } = data;
    const { rows } = await pool.query(
        'UPDATE specialty SET name = $1 WHERE specialty_id = $2 RETURNING *',
        [name, id]
    );
    return rows[0];
};

export const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM specialty WHERE specialty_id = $1', [id]);
    return rowCount > 0;
};
