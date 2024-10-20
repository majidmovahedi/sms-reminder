import {
    prfileController,
    loginController,
    registerController,
    verifyController,
    resendController,
    forgetPasswordController,
    newPasswordController,
    updateProfileController,
    changePasswordController,
    deleteProfileController,
    paymentController,
    verifyPaymentController,
} from '@controllers/api/v1/user/userController';
import { authMiddleware } from '@middlewares/authMiddleware';
import { validate } from '@utils/validation/validate';
import {
    UserChangePasswordSchema,
    UserForgetPasswordSchema,
    UserLoginSchema,
    UserNewPasswordSchema,
    UserRegisterSchema,
    UserResendSchema,
    UserUpdateProfileSchema,
    UserVerifySchema,
} from '@utils/validation/userValidationSchema';
import { Router } from 'express';

const router = Router();

router.get('/', authMiddleware, prfileController);
router.post('/register', validate(UserRegisterSchema), registerController);
router.post('/login', validate(UserLoginSchema), loginController);
router.post('/verify', validate(UserVerifySchema), verifyController);
router.post('/resend', validate(UserResendSchema), resendController);
router.post(
    '/forget-password',
    validate(UserForgetPasswordSchema),
    forgetPasswordController,
);
router.put(
    '/new-password',
    validate(UserNewPasswordSchema),
    newPasswordController,
);
router.put(
    '/change-password',
    validate(UserChangePasswordSchema),
    authMiddleware,
    changePasswordController,
);
router.put(
    '/update',
    authMiddleware,
    validate(UserUpdateProfileSchema),
    updateProfileController,
);
router.delete('/delete', authMiddleware, deleteProfileController);

// Payment

router.post('/pay', authMiddleware, paymentController);
router.post('/pay/verify', authMiddleware, verifyPaymentController);

export default router;
