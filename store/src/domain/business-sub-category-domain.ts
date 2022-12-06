import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessSubCategoryDatabaseLayer } from '../database-layer/business-sub-category-database';

export class BusinessSubCategoryDomain {

    static async createBusinessSubCategory(req: Request, res: Response) {
        const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.createBusinessSubCategory(req);
        res.status(201).send(BusinessSubCategory);
    }

    static async updateBusinessSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessSubCategoryDatabaseLayer.updateBusinessSubCategory(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteBusinessSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessSubCategoryDatabaseLayer.deleteBusinessSubCategory(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getBusinessSubCategoryList(req: Request, res: Response) {
        const BusinessSubCategory =  await BusinessSubCategoryDatabaseLayer.getBusinessSubCategoryList(req);
        res.status(201).send(BusinessSubCategory);
    }
    

}