// src/mongo/connection.js
import { MongoClient } from 'mongodb';
import 'dotenv/config';

let client;
let db;

export const connectMongo = async () => {
    if (db) return db;

    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);

    console.log('✅ Conectado a MongoDB Atlas');
    return db;
};

export const getDb = () => {
    if (!db) {
        throw new Error('MongoDB no está conectado. Llama primero a connectMongo()');
    }
    return db;
};
