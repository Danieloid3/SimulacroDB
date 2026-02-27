import { Router } from 'express';
import * as patientController from '../controllers/patientController.js';

const router = Router();

router.get('/', patientController.getAll);
router.get('/:id', patientController.getById);
router.post('/', patientController.create);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.remove);

export default router;
