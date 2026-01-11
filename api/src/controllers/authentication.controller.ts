import { Request, Response } from 'express';
import { getUserById, getAllUsers, deleteUserById, changeUserRole, getUserByRole, createUser, updateUserInformation, login } from '../services/authentication/user.service';
import { validate } from '../helpers/validator.helper';
import { loginSchema, registerSchema, updateUserInfoSchema, userIdSchema, roleSchema } from '../validators/authentication.validator';
import { userRole } from '@prisma/client';
import { UUID } from 'node:crypto';

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = validate(loginSchema, req.body);

    const user = await login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    });
  }
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, name, nim, nomor_whatsapp, program_studi, fakultas, semester, universitas } = validate(registerSchema, req.body);

    const user = await createUser(email, password, name, nim, nomor_whatsapp, program_studi, fakultas, semester, universitas);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = validate(userIdSchema, req.params);

    const user = await getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'User not found',
    });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user?.user_id;
    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const users = await getAllUsers(requesterId as UUID);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error instanceof Error ? error.message : 'Access denied',
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user?.user_id;
    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { userId } = validate(userIdSchema, req.params);

    await deleteUserById(requesterId as UUID, userId as UUID);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error instanceof Error ? error.message : 'Access denied',
    });
  }
};

export const changeUserRoleController = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user?.user_id;
    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { userId } = validate(userIdSchema, req.params);
    const { role } = validate(roleSchema, req.body);

    await changeUserRole(requesterId as UUID, userId as UUID, role as userRole);

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error instanceof Error ? error.message : 'Access denied',
    });
  }
};

export const getUsersByRoleController = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user?.user_id;
    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { role } = validate(roleSchema, req.body);

    const users = await getUserByRole(requesterId as UUID, role as userRole);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error instanceof Error ? error.message : 'Access denied',
    });
  }
};

export const updateUserInfoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const updatedInfo = validate(updateUserInfoSchema, req.body);

    const user = await updateUserInformation(userId, updatedInfo);

    res.status(200).json({
      success: true,
      message: 'User information updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Update failed',
    });
  }
};

