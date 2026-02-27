import * as patientService from '../services/patientService.js';

export const getAll = async (req, res) => {
    try {
        const patients = await patientService.getAll();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const patient = await patientService.getById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newPatient = await patientService.create(req.body);
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updatedPatient = await patientService.update(req.params.id, req.body);
        if (!updatedPatient) return res.status(404).json({ message: 'Paciente no encontrado' });
        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const success = await patientService.remove(req.params.id);
        if (!success) return res.status(404).json({ message: 'Paciente no encontrado' });
        res.json({ message: 'Paciente eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
