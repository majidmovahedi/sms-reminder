import { listUsers } from './../../../../controllers/api/v1/userController';
import { Router } from 'express';

const router = Router();

router.get('/', listUsers);

export default router;
