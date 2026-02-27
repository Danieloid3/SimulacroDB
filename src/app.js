// src/app.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Importar conexión a MongoDB
import { connectMongo } from './mongo/connection.js';

// Rutas
import adminRoutes from './routes/adminRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import specialtyRoutes from './routes/specialtyRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/insurances', insuranceRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/specialties', specialtyRoutes);

// Manejo de 404
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores (centralizado)
app.use((err, _req, res, _next) => {
    const status = err.statusCode || err.status || 500;
    console.error(err); // Es útil ver el error en consola
    res.status(status).json({
        error: err.message || 'Error interno del servidor'
    });
});

// Start Server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Conectar a Mongo antes de levantar el servidor
        await connectMongo();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

export default app;
