import { Router } from 'express';
import { getAllUsers, updateUserRoles } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { userRole } from '@prisma/client';

const router = Router();

// Protect all routes
router.use(authenticate);

// Only SuperAdmin can manage users
router.get('/', authorize(userRole.SuperAdmin), getAllUsers);
router.patch('/:id/role', authorize(userRole.SuperAdmin), updateUserRoles);

export default router;
