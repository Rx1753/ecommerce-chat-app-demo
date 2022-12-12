import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductItemDatabaseLayer } from '../database-layer/product-item-database';

export class ProductItemDomain {

    static async createProductItem(req: Request, res: Response) {
        const ProductItem = await ProductItemDatabaseLayer.createProductItem(req);
        res.status(201).send(ProductItem);
    }

    static async updateProductItem(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await ProductItemDatabaseLayer.updateProductItem(req,req.params.id);
        res.status(201).send(data);
    }

    static async deleteProductItem(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductItemDatabaseLayer.deleteProductItem(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getProductItemList(req: Request, res: Response) {
        const ProductItem =  await ProductItemDatabaseLayer.getProductItemList(req);
        res.status(201).send(ProductItem);
    }
    
    static async getProductItemListProductId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const ProductItem =  await ProductItemDatabaseLayer.getProductItemListProductId(req,req.params.id);
        res.status(201).send(ProductItem);
    }

}