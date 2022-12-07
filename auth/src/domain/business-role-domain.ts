import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessRoleDatabaseLayer } from '../database-layer/business-role-database';

export class BusinessRoleDomain {

    static async createBusinessRole(req: Request, res: Response) {
        const BusinessRole = await BusinessRoleDatabaseLayer.createBusinessRole(req);
        res.status(201).send(BusinessRole);
    }

    static async updateBusinessRole(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessRoleDatabaseLayer.updateBusinessRole(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteBusinessRole(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessRoleDatabaseLayer.deleteBusinessRole(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getBusinessRoleList(req: Request, res: Response) {
        const BusinessRole =  await BusinessRoleDatabaseLayer.getBusinessRoleList(req);
        res.status(201).send(BusinessRole);
    }
    
   

}