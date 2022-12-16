import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { AdminUser } from '../models/admin-user';
import { BusinessUser } from '../models/business-user';
import { Customer } from '../models/customer';

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
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt || !req.headers['token']) {
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
    if (req.currentUser.email) {
      if (req.currentUser.type == "Admin") {
        const data = await AdminUser.findOne({ $and: [{ email: req.currentUser.email }, { id: req.currentUser.id }, { isActive: true }] })
        if(data){
          next();
        }else{
          throw new BadRequestError('token/session you login is no more authorized');
        }
      }else if (req.currentUser.type == "Vendor") {
        const data = await BusinessUser.findOne({ $and: [{ email: req.currentUser.email }, { id: req.currentUser.id }, { isActive: true }] })
        if(data){
          next();
        }else{
          throw new BadRequestError('token/session you login is no more authorized');
        }
      }else if(req.currentUser.type=="Customer"){
        const data = await Customer.findOne({ $and: [{ email: req.currentUser.email }, { id: req.currentUser.id }, { isActive: true }] })
        if(data){
          next();
        }else{
          throw new BadRequestError('token/session you login is no more authorized');
        }
      }
    }
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestError(error.message);
    } else {
      throw new BadRequestError(error.message);
    }
  }
  next();
};
export const verifyCustomerToken = (
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
    if (payload.type != 'Customer') {
      throw new BadRequestError('Unauthorized Vendor');
    }
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
export const verifyAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('middleware');

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
 

    if (payload.type != 'Admin') {
      throw new BadRequestError('Unauthorized Admin');
    }
    const data = await AdminUser.findOne({ $and: [{ _id: payload.id }, { isActive: true }] })
    if(!data){
      throw new BadRequestError('token/session you login is no more authorized');
    }
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


export const verifyVendorToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt && !req.headers['token']) {
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
    if (payload.type != 'Vendor') {
      throw new BadRequestError('Unauthorized Vendor');
    }
    req.currentUser = payload;
    console.log(`verifyVendorToken :: ${req.currentUser.email}`)
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestError(error.message);
    } else {
      throw new BadRequestError(error.message);
    }
  }

  next();
};