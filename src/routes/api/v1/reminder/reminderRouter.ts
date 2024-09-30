import {
    createReminderController,
    deleteReminderController,
    remindersController,
    singleReminderController,
    updateReminderController,
} from '@controllers/api/v1/reminder/reminderController';
import { authMiddleware } from '@middlewares/authMiddleware';
import {
    CreateReminderSchema,
    UpdateReminderSchema,
} from '@utils/validation/reminderValidationSchema';
import { validate } from '@utils/validation/validate';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware);

router.get('/:id', singleReminderController);
router.get('/', remindersController);
router.post('/', validate(CreateReminderSchema), createReminderController);
router.put('/:id', validate(UpdateReminderSchema), updateReminderController);
router.delete('/:id', deleteReminderController);

export default router;
