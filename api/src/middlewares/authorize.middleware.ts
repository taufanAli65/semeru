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

    // Check if user has any of the allowed roles
    const hasAllowedRole = req.user.roles.some((roleStr) => {
      const roleEnum = userRole[roleStr as keyof typeof userRole];
      return allowedRoles.includes(roleEnum);
    });

    if (!hasAllowedRole) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};