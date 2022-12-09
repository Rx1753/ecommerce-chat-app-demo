import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessCategory } from '../models/business-category';
import { BusinessSubCategory } from '../models/business-sub-category';
import { ProductCategory } from "../models/product-category";

export class ProductCategoryDatabaseLayer {

    static async createProductCategory(req: any) {
        const { name, description, businessSubCategoryId } = req.body;
        const businessSubCategoryCheck = await BusinessSubCategory.findById(businessSubCategoryId);
        if (businessSubCategoryCheck) {
            const data = ProductCategory.build({
                name: name,
                description: description,
                isActive: true,
                businessSubCategoryId:businessSubCategoryId
            });
            console.log(data);
            await data.save();
            return data;
        } else {
            throw new BadRequestError('Provided Business Sub Category is not valid');
        }
    }

    static async updateProductCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        const businessSubCategoryCheck = await BusinessSubCategory.findById(req.body.businessSubCategoryId);
        if (businessSubCategoryCheck) {
            try {
                await ProductCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, businessSubCategoryId: req.body.businessSubCategoryId, updateAt: updatedAt });
                return;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided Business Sub Category is not valid');
        }
    }

    static async deleteProductCategory(id: string) {
        try {
            await ProductCategory.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getProductCategoryList(req: any) {
        const data = await ProductCategory.find()
            .populate({
                path: 'businessSubCategoryId', populate: {
                    path: 'businessCategoryId'
                }
            });
        return data;
    }
    
    static async getBusinessCategoryIdList(req: any,id:any) {
        const data = await ProductCategory.find({businessSubCategoryId:id})
            .populate({
                path: 'businessSubCategoryId', populate: {
                    path: 'businessCategoryId'
                }
            });
        return data;
    }

}