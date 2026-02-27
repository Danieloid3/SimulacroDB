import { Router } from 'express';
import * as insuranceController from '../controllers/insuranceController.js';

const router = Router();

router.get('/', insuranceController.getAll);
router.get('/:id', insuranceController.getById);
router.post('/', insuranceController.create);
router.put('/:id', insuranceController.update);
router.delete('/:id', insuranceController.remove);

export default router;
