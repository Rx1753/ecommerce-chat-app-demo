import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessSubCategoryDatabaseLayer } from '../database-layer/business-sub-category-database';

export class BusinessSubCategoryDomain {

    static async createBusinessSubCategory(req: Request, res: Response) {

        const permission = await BusinessSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isCreate == true) {
            const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.createBusinessSubCategory(req);
            res.status(201).send(BusinessSubCategory);
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async updateBusinessSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await BusinessSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isUpdate == true) {
            await BusinessSubCategoryDatabaseLayer.updateBusinessSubCategory(req, req.params.id);
            res.status(201).send({ updated: true });
        } else {
            throw new BadRequestError('You don\'t have rights to update category');
        }
    }

    static async deleteBusinessSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await BusinessSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isDelete == true) {
            await BusinessSubCategoryDatabaseLayer.deleteBusinessSubCategory(req.params.id);
            res.status(201).send({ deleted: true });
        } else {
            throw new BadRequestError('You don\'t have rights to delete category');
        }

    }

    static async getBusinessSubCategoryList(req: Request, res: Response) {
        const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.getBusinessSubCategoryList(req);
        res.status(201).send(BusinessSubCategory);
    }


    static async getBusinessSubCategoryActiveList(req: Request, res: Response) {
        const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.getBusinessSubCategoryActiveList(req);
        res.status(201).send(BusinessSubCategory);
    }

    static async getBusinessCategoryIdList(req: Request, res: Response) {
        const BusinessSubCategory = await BusinessSubCategoryDatabaseLayer.getBusinessCategoryIdList(req, req.params.id);
        res.status(201).send(BusinessSubCategory);
    }

}