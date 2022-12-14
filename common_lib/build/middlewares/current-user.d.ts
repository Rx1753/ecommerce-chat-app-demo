import { Request, Response, NextFunction } from 'express';
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
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const verifyCustomerToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const verifyAdminToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const verifyVendorToken: (req: Request, res: Response, next: NextFunction) => void;
export {};
