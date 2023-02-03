import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import mongoose from 'mongoose';
import { Admin } from '../models/admin';
import { AdminRoleMapping } from '../models/admin-role-mapping';

import { BusinessCategory } from '../models/business-category';
import { BusinessSubCategory } from '../models/business-sub-category';
import { Product } from '../models/product';
import { ProductReview } from '../models/product-review';
import { ProductSubCategory } from '../models/product-sub-category';
import { natsWrapper } from '../nats-wrapper';

export class ProductReviewDatabaseLayer {

    static async createProductReview(req: any) {
        const { productId, rate, comment, imageURL, title } = req.body;
        const productCheck = await Product.findById(productId);
        //TODO:: customer order this product or not
        if (productCheck) {
            const data = ProductReview.build({
                productId: productId,
                rating: (rate),
                title: title,
                customerId: req.currentUser.id,
                comment: comment,
                imageURL: imageURL
            });
            await data.save();

            //product average rating count
            const productReviewCheck = await ProductReview.aggregate(
                [
                    { $match: { productId: productCheck._id } },
                    {
                        $group: {
                            _id: "$productId",
                            totalRating: { $avg: "$rating" }
                        }
                    }
                ])
            console.log('productReviewCheck', productReviewCheck);
            if (productReviewCheck) {
                await Product.findByIdAndUpdate(productId, { rating: productReviewCheck[0].totalRating });
                return data;
            } else {
                console.log('not worked');
            }
        } else {
            throw new BadRequestError('Provided productId is not valid');
        }
    }

    static async deleteProductReview(id: string) {
        const data = await ProductReview.findById(id);
        if (data) {
            try {
                await ProductReview.findByIdAndRemove(id);
                return;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided id is not valid');
        }
    }

    static async getProductReviewList(req: any) {
        const data = await ProductReview.find()
        // .populate({
        //     path: '', populate: {
        //         path: 'businessCategoryId'
        //     }
        // });
        return data;
    }

}