import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '@rx-ecommerce-chat/common_lib';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};
