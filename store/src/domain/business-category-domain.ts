import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessCategoryDatabaseLayer } from '../database-layer/business-category-database';

export class BusinessCategoryDomain {

    static async createBusinessCategory(req: Request, res: Response) {
        const BusinessCategory = await BusinessCategoryDatabaseLayer.createBusinessCategory(req);
        res.status(201).send(BusinessCategory);
    }

    static async updateBusinessCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessCategoryDatabaseLayer.updateBusinessCategory(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteBusinessCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessCategoryDatabaseLayer.deleteBusinessCategory(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getBusinessCategoryList(req: Request, res: Response) {
        const BusinessCategory =  await BusinessCategoryDatabaseLayer.getBusinessCategoryList(req);
        res.status(201).send(BusinessCategory);
    }
    

}