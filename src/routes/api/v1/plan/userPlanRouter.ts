import { Router } from 'express';
import {
    plansController,
    singlePlanController,
} from '@controllers/api/v1/plan/adminPlanController';

const router = Router();

router.get('/:id', singlePlanController);
router.get('/', plansController);

export default router;
