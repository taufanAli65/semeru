import { Request, Response, NextFunction } from 'express';
import { userRole } from '@prisma/client';

export const authorize = (...allowedRoles: userRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Convert string role to enum value
    const userRoleValue = userRole[req.user.role as keyof typeof userRole];

    if (userRoleValue === undefined) {
      res.status(403).json({
        success: false,
        message: 'Invalid user role'
      });
      return;
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(userRoleValue)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};