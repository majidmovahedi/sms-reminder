import {
    singleUser,
    login,
    register,
} from '@controllers/api/v1/userController';
import { authenticateJWT } from '@middlewares/authMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', authenticateJWT, singleUser);
router.post('/register', register);
router.post('/login', login);
export default router;
