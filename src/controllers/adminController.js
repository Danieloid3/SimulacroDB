// src/controllers/adminController.js
import * as adminService from '../services/adminService.js';

export const resetSchema = async (req, res) => {
    try {
        const result = await adminService.resetSchema();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const migrateData = async (req, res) => {
    try {
        const result = await adminService.migrateData();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const syncMongo = async (req, res) => {
    try {
        const result = await adminService.syncMongo();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
