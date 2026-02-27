import { pool } from '../config/db.js';

export const getAll = async () => {
    const query = `
        SELECT d.*, s.name as specialty_name
        FROM doctor d
                 JOIN specialty s ON d.specialty_id = s.specialty_id
        ORDER BY d.id ASC`;
    const { rows } = await pool.query(query);
    return rows;
};

export const getById = async (id) => {
    const query = `
        SELECT d.*, s.name as specialty_name
        FROM doctor d
        JOIN specialty s ON d.specialty_id = s.specialty_id
        WHERE d.id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

export const create = async (data) => {
    const { first_name, last_name, email, specialty_id } = data;
    const { rows } = await pool.query(
        'INSERT INTO doctor (first_name, last_name, email, specialty_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [first_name, last_name, email, specialty_id]
    );
    return rows[0];
};

export const update = async (id, data) => {
    const { first_name, last_name, email, specialty_id } = data;
    const { rows } = await pool.query(
        'UPDATE doctor SET first_name = $1, last_name = $2, email = $3, specialty_id = $4 WHERE id = $5 RETURNING *',
        [first_name, last_name, email, specialty_id, id]
    );
    return rows[0];
};

export const remove = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM doctor WHERE id = $1', [id]);
    return rowCount > 0;
};
