import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
  if (!req.session?.jwt && !req.headers['authorization']) {
    return next();
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
  } catch (error) {}
  next();
};
