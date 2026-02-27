import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController.js';

const router = Router();

router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getById);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.remove);

export default router;
