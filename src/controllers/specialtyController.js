import * as specialtyService from '../services/specialtyService.js';

export const getAll = async (req, res) => {
    try {
        const specialties = await specialtyService.getAll();
        res.json(specialties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const specialty = await specialtyService.getById(req.params.id);
        if (!specialty) return res.status(404).json({ message: 'Especialidad no encontrada' });
        res.json(specialty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newSpecialty = await specialtyService.create(req.body);
        res.status(201).json(newSpecialty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updated = await specialtyService.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Especialidad no encontrada' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const success = await specialtyService.remove(req.params.id);
        if (!success) return res.status(404).json({ message: 'Especialidad no encontrada' });
        res.json({ message: 'Especialidad eliminada' });
    } catch (error) {
        // Error común: Intentar borrar una especialidad usada por un doctor
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar: Hay doctores asignados a esta especialidad.' });
        }
        res.status(500).json({ error: error.message });
    }
};
