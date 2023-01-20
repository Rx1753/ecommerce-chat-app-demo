import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductReviewDatabaseLayer } from '../database-layer/product-review-database';

export class ProductReviewDomain {

    static async createProductReview(req: Request, res: Response) {       
        const ProductReview = await ProductReviewDatabaseLayer.createProductReview(req);
        res.status(201).send(ProductReview);

    }

    static async deleteProductReview(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductReviewDatabaseLayer.deleteProductReview(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getProductReviewList(req: Request, res: Response) {
        const ProductReview = await ProductReviewDatabaseLayer.getProductReviewList(req);
        res.status(201).send(ProductReview);
    }

}