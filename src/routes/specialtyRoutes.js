import { Router } from 'express';
import * as specialtyController from '../controllers/specialtyController.js';

const router = Router();

router.get('/', specialtyController.getAll);
router.get('/:id', specialtyController.getById);
router.post('/', specialtyController.create);
router.put('/:id', specialtyController.update);
router.delete('/:id', specialtyController.remove);

export default router;
