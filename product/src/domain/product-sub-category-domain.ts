import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductSubCategoryDatabaseLayer } from '../database-layer/product-sub-category-database';

export class ProductSubCategoryDomain {

    static async createProductSubCategory(req: Request, res: Response) {
        console.log('1');
        
        const permission = await ProductSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isCreate == true || permission.isSuperAdmin == true) {
            const ProductSubCategory = await ProductSubCategoryDatabaseLayer.createProductSubCategory(req);
            res.status(201).send(ProductSubCategory);
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async updateProductSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await ProductSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isUpdate == true || permission.isSuperAdmin == true) {
            const data = await ProductSubCategoryDatabaseLayer.updateProductSubCategory(req, req.params.id);
            res.status(201).send({ updated: true });
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async deleteProductSubCategory(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const permission = await ProductSubCategoryDatabaseLayer.categoryCheck(req);
        if (permission.isDelete == true || permission.isSuperAdmin == true) {
            await ProductSubCategoryDatabaseLayer.deleteProductSubCategory(req.params.id);
            res.status(201).send({ deleted: true });
        } else {
            throw new BadRequestError('You don\'t have rights to create category');
        }
    }

    static async getProductSubCategoryList(req: Request, res: Response) {
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.getProductSubCategoryList(req);
        res.status(201).send(ProductSubCategory);
    }
    
    static async getProductSubCategoryId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.getProductSubCategoryId(req,req.params.id);
        res.status(201).send(ProductSubCategory);
    }
    static async getProductCategoryIdList(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.getProductCategoryIdList(req, req.params.id);
        res.status(201).send(ProductSubCategory);
    }
    static async getProductSubCategoryActiveList(req: Request, res: Response) {
        const ProductSubCategory = await ProductSubCategoryDatabaseLayer.getProductSubCategoryActiveList(req);
        res.status(201).send(ProductSubCategory);
    }

}