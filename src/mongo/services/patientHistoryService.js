// src/mongo/services/patientHistoryService.js
import { getDb } from '../connection.js';

export const upsertPatientHistory = async (patientData) => {
    const db = getDb();
    const collection = db.collection('patients_history');

    // Buscamos por patientId (que viene de Postgres) y reemplazamos/insertamos el documento entero
    // para asegurar que el array de historial esté siempre sincronizado.
    await collection.updateOne(
        { patientId: patientData.patientId },
        { $set: patientData },
        { upsert: true }
    );

    console.log(`✅ Historial actualizado en Mongo para paciente ${patientData.patientId}`);
};
