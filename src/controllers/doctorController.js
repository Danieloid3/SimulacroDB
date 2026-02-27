import * as doctorService from '../services/doctorService.js';

export const getAll = async (req, res) => {
    try {
        const doctors = await doctorService.getAll();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const doctor = await doctorService.getById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor no encontrado' });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newDoctor = await doctorService.create(req.body);
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updated = await doctorService.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Doctor no encontrado' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const success = await doctorService.remove(req.params.id);
        if (!success) return res.status(404).json({ message: 'Doctor no encontrado' });
        res.json({ message: 'Doctor eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
