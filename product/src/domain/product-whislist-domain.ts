import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductWhishlistDatabaseLayer } from '../database-layer/product-whislist-database';

export class ProductWhishlistDomain {

    static async createProductWhishlist(req: Request, res: Response) {       
        const ProductWhishlist = await ProductWhishlistDatabaseLayer.createProductWhishlist(req);
        res.status(201).send(ProductWhishlist);

    }

    static async deleteProductWhishlist(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductWhishlistDatabaseLayer.deleteProductWhishlist(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getProductWhishlistList(req: Request, res: Response) {
        const ProductWhishlist = await ProductWhishlistDatabaseLayer.getProductWhishlistList(req);
        res.status(201).send(ProductWhishlist);
    }

}