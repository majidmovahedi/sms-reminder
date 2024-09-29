import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '@middlewares/authMiddleware';
import {
    createPlanController,
    deletePlanController,
    plansController,
    singlePlanController,
    updatePlanController,
} from '@controllers/api/v1/plan/adminPlanController';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/:id', singlePlanController);
router.get('/', plansController);
router.post('/', createPlanController);
router.put('/:id', updatePlanController);
router.delete('/:id', deletePlanController);

export default router;
