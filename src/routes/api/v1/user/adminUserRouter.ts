import {
    listUsersController,
    singleUserController,
} from '@controllers/api/v1/adminUserController';
import { adminMiddleware } from '@middlewares/authMiddleware';
import { authMiddleware } from '@middlewares/authMiddleware';
import { validate } from '@utils/validation/validate';
import { Router } from 'express';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, listUsersController);
router.get('/:id', authMiddleware, adminMiddleware, singleUserController);

export default router;
