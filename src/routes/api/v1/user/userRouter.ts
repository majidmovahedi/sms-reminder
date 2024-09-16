import {
    singleUser,
    login,
    register,
} from '@controllers/api/v1/userController';
import { authMiddleware } from '@middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', authMiddleware, singleUser);
router.post('/register', register);
router.post('/login', login);

export default router;
