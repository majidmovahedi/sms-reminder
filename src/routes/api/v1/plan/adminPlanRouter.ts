import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '@middlewares/authMiddleware';
import {
    plansController,
    singlePlanController,
} from '@controllers/api/v1/plan/adminPlanController';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/:id', singlePlanController);
router.get('/', plansController);
// router.post('/', createReminderController);
// router.put('/:id', updateReminderController);
// router.delete('/:id', deleteReminderController);

export default router;
