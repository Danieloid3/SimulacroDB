// src/services/adminService.js
import { pool } from '../config/db.js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as patientService from './patientService.js';
import { upsertPatientHistory } from '../mongo/services/patientHistoryService.js';

export const resetSchema = async () => {
    const filePath = join(process.cwd(), 'sql', '01_schema.sql');
    const sql = await readFile(filePath, 'utf8');
    await pool.query(sql);
    return { message: 'Base de datos reseteada correctamente.' };
};

export const migrateData = async () => {
    const filePath = join(process.cwd(), 'sql', '02_normalize.sql');
    const sql = await readFile(filePath, 'utf8');
    await pool.query(sql);
    return { message: 'Migración de datos completada.' };
};

export const syncMongo = async () => {
    console.log('🔄 Iniciando sincronización masiva a Mongo...');

    // 1. Obtener todos los IDs de pacientes de Postgres
    const patientIds = await patientService.getAllPatientIds();

    let count = 0;
    // 2. Iterar y actualizar en Mongo uno por uno
    for (const id of patientIds) {
        const fullHistory = await patientService.getFullPatientHistory(id);
        if (fullHistory) {
            await upsertPatientHistory(fullHistory);
            count++;
        }
    }

    return { message: `Sincronización completada. ${count} pacientes actualizados en MongoDB.` };
};
