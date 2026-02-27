// javascript
// src/mongo/connection.js
import { MongoClient } from 'mongodb';
import 'dotenv/config';

let client;
let db;

const {
    MONGODB_URI,
    MONGODB_DB,
    MONGOLOCAL_URI,
    MONGOLOCAL_DB
} = process.env;

const connectWithUri = async (uri, dbName, label) => {
    console.log(`🔌 Intentando conexión a MongoDB ${label}...`);
    const localClient = new MongoClient(uri);
    await localClient.connect();
    const localDb = localClient.db(dbName);
    console.log(`✅ Conectado a MongoDB ${label} (db: ${dbName})`);
    return { localClient, localDb };
};

export const connectMongo = async () => {
    if (db) return db;

    // 1\. Intentar CLOUD si hay URI
    if (MONGODB_URI && MONGODB_URI.trim() !== '') {
        try {
            const dbName = MONGODB_DB || 'simulacroBD';
            const { localClient, localDb } = await connectWithUri(
                MONGODB_URI,
                dbName,
                'CLOUD'
            );
            client = localClient;
            db = localDb;
            return db;
        } catch (err) {
            console.error('⚠️ Falló conexión a Mongo CLOUD, probando LOCAL. Detalle:', err.message);
        }
    }

    // 2\. Fallback a LOCAL
    const localUri = MONGOLOCAL_URI || 'mongodb://localhost:27017';
    const localDbName = MONGOLOCAL_DB || 'simulacroBD';

    try {
        const { localClient, localDb } = await connectWithUri(
            localUri,
            localDbName,
            'LOCAL'
        );
        client = localClient;
        db = localDb;
        return db;
    } catch (err) {
        console.error('❌ No se pudo conectar ni a Mongo CLOUD ni a LOCAL:', err.message);
        throw err;
    }
};

export const getDb = () => {
    if (!db) {
        throw new Error('MongoDB no está conectado. Llama primero a connectMongo()');
    }
    return db;
};
