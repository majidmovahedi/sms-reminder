import {
    adminRegisterController,
    listUsersController,
    singleUserController,
} from '@controllers/api/v1/adminUserController';
import {
    forgetPasswordController,
    loginController,
    newPasswordController,
} from '@controllers/api/v1/userController';
import { adminMiddleware } from '@middlewares/authMiddleware';
import { authMiddleware } from '@middlewares/authMiddleware';
import {
    UserForgetPasswordSchema,
    UserNewPasswordSchema,
} from '@utils/validation/userValidationSchema';
import { validate } from '@utils/validation/validate';
import { Router } from 'express';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, listUsersController);
router.get('/:id', authMiddleware, adminMiddleware, singleUserController);
router.post('/login', loginController);
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
router.post(
    '/register',
    authMiddleware,
    adminMiddleware,
    adminRegisterController,
);

export default router;
