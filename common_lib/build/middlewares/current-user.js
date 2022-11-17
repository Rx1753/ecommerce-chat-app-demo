"use strict";
// import { Request, Response, NextFunction } from 'express';
// import jwt, { TokenExpiredError } from 'jsonwebtoken';
// import { BadRequestError } from '..';
// interface UserPayload {
//   id: string;
//   email: string;
//   type: string;
// }
// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: UserPayload;
//     }
//   }
// }
// export const currentUser = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.session?.jwt && !req.headers['authorization']) {
//     throw new BadRequestError("Token/Session not provided");
//   }
//   var token;
//   if (req.session?.jwt) {
//     token = req.session?.jwt;
//   } else {
//     const accessToken = (req.headers.authorization as String).split(' ')[1];
//     token = accessToken;
//   }
//   try {
//     const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
//     req.currentUser = payload;
//   } catch (error: any) {
//     if (error instanceof TokenExpiredError) {
//       throw new BadRequestError(error.message);
//     } else {
//       throw new BadRequestError(error.message);
//     }
//   }
//   next();
// };
