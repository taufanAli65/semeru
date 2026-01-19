import { userRole } from '@prisma/client';
import { loginController, registerController, getUserByIdController, getAllUsersController, deleteUserController, updateUserRolesController, getUsersByRoleController, updateUserInfoController } from '../controllers/authentication.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import express from 'express';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/user/:userId', authenticate, getUserByIdController);
router.get('/users', authenticate, authorize(userRole.SuperAdmin), getAllUsersController);
router.delete('/user/:userId', authenticate, authorize(userRole.SuperAdmin), deleteUserController);
router.patch('/user/:userId/role', authenticate, authorize(userRole.SuperAdmin), updateUserRolesController);
router.get('/users/role/:role', authenticate, authorize(userRole.SuperAdmin), getUsersByRoleController);
router.put('/user/info', authenticate, updateUserInfoController);

export default router;