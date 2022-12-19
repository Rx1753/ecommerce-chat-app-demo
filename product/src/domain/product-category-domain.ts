import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductCategoryDatabaseLayer } from '../database-layer/product-category-database';

export class ProductCategoryDomain {

    static async createProductCategory(req: Request, res: Response) {
        const permission = await ProductCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isCreate == true || permission.isSuperAdmin == true) {
            const ProductCategory = await ProductCategoryDatabaseLayer.createProductCategory(req);
            res.status(201).send(ProductCategory);
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async updateProductCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await ProductCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isUpdate == true || permission.isSuperAdmin == true) {
            await ProductCategoryDatabaseLayer.updateProductCategory(req, req.params.id);
            res.status(201).send({ updated: true });
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async deleteProductCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await ProductCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isDelete == true || permission.isSuperAdmin == true) {
            await ProductCategoryDatabaseLayer.deleteProductCategory(req.params.id);
            res.status(201).send({ deleted: true });
        } else {
            throw new BadRequestError('You don\'t have rights to delete category');
        }
    }

    static async getProductCategoryList(req: Request, res: Response) {
        const ProductCategory = await ProductCategoryDatabaseLayer.getProductCategoryList(req);
        res.status(201).send(ProductCategory);
    }
    
    static async getProductCategoryId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const ProductCategory = await ProductCategoryDatabaseLayer.getProductCategoryId(req, req.params.id);
        res.status(201).send(ProductCategory);
    }

    static async getBusinessCategoryIdList(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const ProductCategory = await ProductCategoryDatabaseLayer.getBusinessCategoryIdList(req, req.params.id);
        res.status(201).send(ProductCategory);
    }
    static async getProductCategoryActiveList(req: Request, res: Response) {
        const ProductCategory = await ProductCategoryDatabaseLayer.getProductCategoryActiveList(req);
        res.status(201).send(ProductCategory);
    }

}