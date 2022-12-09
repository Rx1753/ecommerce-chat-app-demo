import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductSubCategoryDatabaseLayer } from '../database-layer/product-sub-category-database';

export class ProductSubCategoryDomain {

    static async createProductSubCategory(req: Request, res: Response) {
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.createProductSubCategory(req);
        res.status(201).send(ProductSubCategory);
    }

    static async updateProductSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await ProductSubCategoryDatabaseLayer.updateProductSubCategory(req,req.params.id);
        res.status(201).send(data);
    }

    static async deleteProductSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductSubCategoryDatabaseLayer.deleteProductSubCategory(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getProductSubCategoryList(req: Request, res: Response) {
        const ProductSubCategory =  await ProductSubCategoryDatabaseLayer.getProductSubCategoryList(req);
        res.status(201).send(ProductSubCategory);
    }
    
    static async getProductCategoryIdList(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const ProductSubCategory =  await ProductSubCategoryDatabaseLayer.getProductCategoryIdList(req,req.params.id);
        res.status(201).send(ProductSubCategory);
    }

}