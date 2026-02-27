// javascript
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

    const patientIds = await patientService.getAllPatientIds();
    console.log(`👥 Pacientes encontrados en Postgres: ${patientIds.length}`);

    let count = 0;
    const sampleHistories = [];

    for (const id of patientIds) {
        const fullHistory = await patientService.getFullPatientHistory(id);

        console.log(`➡️ Leyendo historial de paciente ${id} desde Postgres...`);
        console.log(JSON.stringify(fullHistory, null, 2));

        if (fullHistory) {
            await upsertPatientHistory(fullHistory);
            count++;

            // Guardar solo algunos ejemplos para la respuesta HTTP
            if (sampleHistories.length < 3) {
                sampleHistories.push(fullHistory);
            }
        }
    }

    console.log(`✅ Sincronización completada. ${count} pacientes actualizados en MongoDB.`);

    return {
        message: `Sincronización completada. ${count} pacientes actualizados en MongoDB.`,
        totalPatientsInPostgres: patientIds.length,
        updatedInMongo: count,
        sample: sampleHistories
    };
};
