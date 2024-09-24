import {
    prfileController,
    loginController,
    registerController,
    verifyController,
    resendController,
} from '@controllers/api/v1/userController';
import { authMiddleware } from '@middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', authMiddleware, prfileController);
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/verify', verifyController);
router.post('/resend', resendController);
router.post('/forget-password', forgetPasswordController);

export default router;
