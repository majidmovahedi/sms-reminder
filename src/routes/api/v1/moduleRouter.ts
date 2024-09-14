import { Router } from 'express';

import userRouter from './user/userRouter';
// import adminUserRouter from './user/adminUserRouter';

const router = Router();

router.use('/user', userRouter);
// router.use('/admin/user', adminUserRouter);

export default router;
