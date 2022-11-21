import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { BadRequestError } from '@rx-ecommerce-chat/common_lib';

interface UserPayload {
  id: string;
  email: string;
  type: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt && !req.headers['token']) {
    console.log('token not wrote');    
    throw new BadRequestError('Token/Session not provided');
  }


  var token;
  if (req.session?.jwt) {
    token = req.session?.jwt;
  } else {
    token = req.headers['token'];
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestError(error.message);
    } else {
      throw new BadRequestError(error.message);
    }
  }
  next();
};
