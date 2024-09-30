import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '@middlewares/authMiddleware';
import {
    createPlanController,
    deletePlanController,
    plansController,
    singlePlanController,
    updatePlanController,
} from '@controllers/api/v1/plan/adminPlanController';
import { validate } from '@utils/validation/validate';
import {
    CreatePlanSchema,
    UpdatePlanSchema,
} from '@utils/validation/planValidationSchema';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/:id', singlePlanController);
router.get('/', plansController);
router.post('/', validate(CreatePlanSchema), createPlanController);
router.put('/:id', validate(UpdatePlanSchema), updatePlanController);
router.delete('/:id', deletePlanController);

export default router;
