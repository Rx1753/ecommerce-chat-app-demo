import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessCategoryDatabaseLayer } from '../database-layer/business-category-database';

export class BusinessCategoryDomain {

    static async createBusinessCategory(req: Request, res: Response) {
        const permission = await BusinessCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isCreate == true || permission.isSuperAdmin==true) {
            const BusinessCategory = await BusinessCategoryDatabaseLayer.createBusinessCategory(req);
            res.status(201).send(BusinessCategory);
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }

    }

    static async updateBusinessCategory(req: Request, res: Response) {

        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }

        const permission = await BusinessCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isUpdate == true ||  permission.isSuperAdmin==true) {
            await BusinessCategoryDatabaseLayer.updateBusinessCategory(req, req.params.id);
            res.status(201).send({ updated: true });
        } else {
            throw new BadRequestError('You don\'t have rights to update category');
        }
    }

    static async deleteBusinessCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await BusinessCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isDelete == true ||  permission.isSuperAdmin==true) {
            await BusinessCategoryDatabaseLayer.deleteBusinessCategory(req.params.id);
            res.status(201).send({ deleted: true });
        } else {
            throw new BadRequestError('You don\'t have rights to delete category');
        }
    }

    static async getBusinessCategoryList(req: Request, res: Response) {
        const BusinessCategory = await BusinessCategoryDatabaseLayer.getBusinessCategoryList(req);
        res.status(201).send(BusinessCategory);
    }
    
    static async getBusinessCategoryId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const BusinessCategory = await BusinessCategoryDatabaseLayer.getBusinessCategoryId(req,req.params.id);
        res.status(201).send(BusinessCategory);
    }

    static async getBusinessCategoryActiveList(req: Request, res: Response) {
        const BusinessCategory = await BusinessCategoryDatabaseLayer.getBusinessCategoryActiveList(req);
        res.status(201).send(BusinessCategory);
    }


}