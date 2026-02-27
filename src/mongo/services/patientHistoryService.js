// javascript
// src/mongo/services/patientHistoryService.js
import { getDb } from '../connection.js';

export const upsertPatientHistory = async (patientData) => {
    const db = getDb();
    const collection = db.collection('patients_history');

    await collection.updateOne(
        { patientId: patientData.patientId },
        { $set: patientData },
        { upsert: true }
    );

    console.log(
        `✅ Historial actualizado en Mongo para paciente ${patientData.patientId} ` +
        `(db: ${db.databaseName}, coll: ${collection.collectionName})`
    );
};

export const getAllPatientHistories = async () => {
    const db = getDb();
    const collection = db.collection('patients_history');

    const docs = await collection.find({}).toArray();

    console.log(
        `📄 Leídos ${docs.length} historiales desde Mongo ` +
        `(db: ${db.databaseName}, coll: ${collection.collectionName})`
    );

    return docs;
};
