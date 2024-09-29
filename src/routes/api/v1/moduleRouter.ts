import { Router } from 'express';

import userRouter from './user/userRouter';
import adminUserRouter from './user/adminUserRouter';
import reminderRouter from './reminder/reminderRouter';
import adminPlanRouter from './plan/adminPlanRouter';

const router = Router();

router.use('/user', userRouter);
router.use('/admin/user', adminUserRouter);
router.use('/admin/plan', adminPlanRouter);
router.use('/reminder', reminderRouter);

export default router;
