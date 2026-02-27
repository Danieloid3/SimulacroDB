import { Router } from 'express';
import * as treatmentController from '../controllers/treatmentController.js';

const router = Router();

router.get('/', treatmentController.getAll);
router.get('/:code', treatmentController.getByCode);
router.post('/', treatmentController.create);
router.put('/:code', treatmentController.update);
router.delete('/:code', treatmentController.remove);

export default router;
