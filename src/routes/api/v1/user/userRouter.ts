import {
    prfileController,
    loginController,
    registerController,
    verifyController,
    resendController,
    forgetPasswordController,
    newPasswordController,
    updateProfileController,
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
router.put('/new-password', newPasswordController);
// router.put('/change-password',authMiddleware , changePasswordController);
router.put('/update', authMiddleware, updateProfileController);

export default router;
