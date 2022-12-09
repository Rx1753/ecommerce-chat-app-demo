import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductCategoryDatabaseLayer } from '../database-layer/product-category-database';

export class ProductCategoryDomain {

    static async createProductCategory(req: Request, res: Response) {
        const ProductCategory = await ProductCategoryDatabaseLayer.createProductCategory(req);
        res.status(201).send(ProductCategory);
    }

    static async updateProductCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductCategoryDatabaseLayer.updateProductCategory(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteProductCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductCategoryDatabaseLayer.deleteProductCategory(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getProductCategoryList(req: Request, res: Response) {
        const ProductCategory =  await ProductCategoryDatabaseLayer.getProductCategoryList(req);
        res.status(201).send(ProductCategory);
    }
    
    static async getBusinessCategoryIdList(req: Request, res: Response) {
        const ProductCategory =  await ProductCategoryDatabaseLayer.getBusinessCategoryIdList(req,req.params.id);
        res.status(201).send(ProductCategory);
    }

}