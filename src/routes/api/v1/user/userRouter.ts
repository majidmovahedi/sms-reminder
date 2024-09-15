import { listUsers, login, register } from '@controllers/api/v1/userController';
import { Router } from 'express';

const router = Router();

router.get('/', listUsers);
router.post('/register', register);
router.post('/login', login);
export default router;
