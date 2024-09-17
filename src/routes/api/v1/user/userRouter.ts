import {
    singleUser,
    login,
    register,
    verify,
} from '@controllers/api/v1/userController';
import { authMiddleware } from '@middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', authMiddleware, singleUser);
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify);

export default router;
