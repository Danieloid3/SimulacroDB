import * as insuranceService from '../services/insuranceService.js';

export const getAll = async (req, res) => {
    try {
        const insurances = await insuranceService.getAll();
        res.json(insurances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const insurance = await insuranceService.getById(req.params.id);
        if (!insurance) return res.status(404).json({ message: 'Aseguradora no encontrada' });
        res.json(insurance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newInsurance = await insuranceService.create(req.body);
        res.status(201).json(newInsurance);
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ error: 'El nombre de la aseguradora ya existe.' });
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updated = await insuranceService.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Aseguradora no encontrada' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const success = await insuranceService.remove(req.params.id);
        if (!success) return res.status(404).json({ message: 'Aseguradora no encontrada' });
        res.json({ message: 'Aseguradora eliminada' });
    } catch (error) {
        // Puede fallar si existen citas o coberturas ligadas a esta aseguradora
        if (error.code === '23503') return res.status(400).json({ error: 'No se puede eliminar: Esta aseguradora tiene citas o coberturas asociadas.' });
        res.status(500).json({ error: error.message });
    }
};
