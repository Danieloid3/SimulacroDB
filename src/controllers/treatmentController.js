import * as treatmentService from '../services/treatmentService.js';

export const getAll = async (req, res) => {
    try {
        const treatments = await treatmentService.getAll();
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getByCode = async (req, res) => {
    try {
        const treatment = await treatmentService.getByCode(req.params.code);
        if (!treatment) return res.status(404).json({ message: 'Tratamiento no encontrado' });
        res.json(treatment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newTreatment = await treatmentService.create(req.body);
        res.status(201).json(newTreatment);
    } catch (error) {
        if(error.code === '23505') return res.status(400).json({ error: 'El código de tratamiento ya existe.' });
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updated = await treatmentService.update(req.params.code, req.body);
        if (!updated) return res.status(404).json({ message: 'Tratamiento no encontrado' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const success = await treatmentService.remove(req.params.code);
        if (!success) return res.status(404).json({ message: 'Tratamiento no encontrado' });
        res.json({ message: 'Tratamiento eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
