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

export const verifyCustomerToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt && !req.headers['authorization']) {
    throw new BadRequestError('Token/Session not provided');
  }

  var token;
  if (req.session?.jwt) {
    token = req.session?.jwt;
  } else {
    const accessToken = (req.headers.authorization as String).split(' ')[1];
    token = accessToken;
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

export const verifyAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt && !req.headers['authorization']) {
    throw new BadRequestError('Token/Session not provided');
  }

  var token;
  if (req.session?.jwt) {
    token = req.session?.jwt;
  } else {
    const accessToken = (req.headers.authorization as String).split(' ')[1];
    token = accessToken;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    if(payload.type != 'Admin'){
      throw new BadRequestError('Unauthorized Admin');
    } 
    req.currentUser = payload;
    console.log(`verifyAdminToken :: ${req.currentUser.email}`)
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestError(error.message);
    } else {
      throw new BadRequestError(error.message);
    }
  }
  next();
};