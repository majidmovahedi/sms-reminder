import {
    createReminderController,
    deleteReminderController,
    remindersController,
    singleReminderController,
    updateReminderController,
} from '@controllers/api/v1/reminder/reminderController';
import { authMiddleware } from '@middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware);

router.get('/:id', singleReminderController);
router.get('/', remindersController);
router.post('/', createReminderController);
router.put('/:id', updateReminderController);
router.delete('/:id', deleteReminderController);

export default router;
