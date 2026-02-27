// src/controllers/appointmentController.js
import * as appointmentService from './../services/appointmentService.js';
import * as patientService from './../services/patientService.js';
import { upsertPatientHistory } from '../mongo/services/patientHistoryService.js';

export const getAll = async (_req, res) => {
    try {
        const appointments = await appointmentService.getAll();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const appointment = await appointmentService.getById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        // 1. Crear en Postgres
        const newAppointment = await appointmentService.create(req.body);

        // 2. Reflejar Historial Completo en Mongo
        try {
            const fullHistory = await patientService.getFullPatientHistory(newAppointment.patient_id);
            if (fullHistory) await upsertPatientHistory(fullHistory);
        } catch (mongoError) {
            console.error('Error sincronizando con Mongo:', mongoError);
        }

        res.status(201).json(newAppointment);
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ error: 'Datos fk inválidos (Paciente, Doctor, Tratamiento...)' });
        }
        if (error.code === '23505') {
            return res.status(400).json({ error: 'ID de Cita duplicado' });
        }
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updated = await appointmentService.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Cita no encontrada' });

        // Actualizar Mongo también al editar
        try {
            const fullHistory = await patientService.getFullPatientHistory(updated.patient_id);
            if (fullHistory) await upsertPatientHistory(fullHistory);
        } catch (e) {
            console.error(e);
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        // Obtenemos la cita antes de borrarla para saber el patient_id
        const oldAppointment = await appointmentService.getById(req.params.id);
        const success = await appointmentService.remove(req.params.id);

        if (!success) return res.status(404).json({ message: 'Cita no encontrada' });

        // Actualizar Mongo (la cita desaparecerá del historial porque ya no está en SQL)
        if (oldAppointment) {
            try {
                const fullHistory = await patientService.getFullPatientHistory(oldAppointment.patient_id);
                if (fullHistory) await upsertPatientHistory(fullHistory);
            } catch (e) {
                console.error(e);
            }
        }

        res.json({ message: 'Cita eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
