import {
    createReminderController,
    remindersController,
    singleReminderController,
} from '@controllers/api/v1/reminder/reminderController';
import { authMiddleware } from '@middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware);

router.get('/', remindersController);
router.get('/:id', singleReminderController);
router.post('/', createReminderController);

export default router;
