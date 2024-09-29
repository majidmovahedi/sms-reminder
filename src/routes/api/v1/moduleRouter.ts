import { Router } from 'express';

import userRouter from './user/userRouter';
import adminUserRouter from './user/adminUserRouter';
import reminderRouter from './reminder/reminderRouter';
import adminPlanRouter from './plan/adminPlanRouter';
import userPlanRouter from './plan/userPlanRouter';

const router = Router();

router.use('/user', userRouter);
router.use('/admin/user', adminUserRouter);
router.use('/admin/plan', adminPlanRouter);
router.use('/plan', userPlanRouter);
router.use('/reminder', reminderRouter);

export default router;
