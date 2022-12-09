import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { ProductCategory } from '../models/product-category';
import { ProductSubCategory } from "../models/product-sub-category";

export class ProductSubCategoryDatabaseLayer {

    static async createProductSubCategory(req: any) {
        const { name, description, productCategoryId } = req.body;
        const productCategoryCheck = await ProductCategory.findById(productCategoryId);
        if (productCategoryCheck) {
            const data = ProductSubCategory.build({
                name: name,
                description: description,
                isActive: true,
                productCategoryId: productCategoryId
            });
            console.log(data);
            await data.save();
            return data;
        } else {
            throw new BadRequestError('Provided Business Sub Category is not valid');
        }
    }

    static async updateProductSubCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        const productCategoryCheck = await ProductCategory.findById(req.body.productCategoryId);
        if (productCategoryCheck) {
            try {
                const data=await ProductSubCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, productCategoryId: req.body.productCategoryId, updateAt: updatedAt });
                return data;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided Business Sub Category is not valid');
        }
    }

    static async deleteProductSubCategory(id: string) {
        try {
            await ProductSubCategory.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getProductSubCategoryList(req: any) {
        const data = await ProductSubCategory.find()
            .populate({
                path: 'productCategoryId', populate: {
                    path: 'businessSubCategoryId', populate: {
                        path: 'businessCategoryId'
                    }
                }
            });
        return data;
    }

    static async getProductCategoryIdList(req: any, id: any) {
        const data = await ProductSubCategory.find({ businessSubCategoryId: id })
            .populate({
                path: 'productCategoryId', populate: {
                    path: 'businessSubCategoryId', populate: {
                        path: 'businessCategoryId'
                    }
                }
            });
        return data;
    }

}