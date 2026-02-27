import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';

const router = Router();

router.post('/reset-schema', adminController.resetSchema);
router.post('/migrate-data', adminController.migrateData);
// Agrega la ruta
router.post('/sync-mongo', adminController.syncMongo);


export default router;
