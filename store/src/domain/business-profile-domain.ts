import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessProfileDatabaseLayer } from '../database-layer/business-profile-database';

export class BusinessProfileDomain {

    static async createBusinessProfile(req: Request, res: Response) {
        const BusinessProfile = await BusinessProfileDatabaseLayer.createBusinessProfile(req);
        res.status(201).send(BusinessProfile);
    }

    static async updateBusinessProfile(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessProfileDatabaseLayer.updateBusinessProfile(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteBusinessProfile(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessProfileDatabaseLayer.deleteBusinessProfile(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getBusinessProfileId(req: Request, res: Response) {
        const BusinessProfile =  await BusinessProfileDatabaseLayer.getBusinessProfileById(req,req.params.id);
        res.status(201).send(BusinessProfile);
    }
    

}