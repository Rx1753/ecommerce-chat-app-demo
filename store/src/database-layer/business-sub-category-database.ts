import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessCategory } from '../models/business-category';
import { BusinessSubCategory } from "../models/business-sub-category";

export class BusinessSubCategoryDatabaseLayer {

    static async createBusinessSubCategory(req: any) {
        const { name, description, businessCategoryId } = req.body;
        const businessCategoryCheck = await BusinessCategory.findById(businessCategoryId);
        if (businessCategoryCheck) {
            const data = BusinessSubCategory.build({
                name: name,
                description: description,
                isActive: true,
                businessCategoryId: businessCategoryId
            });
            console.log(data);
            await data.save();
            return data;
        } else {
            throw new BadRequestError('Provided business Category is not valid');
        }
    }

    static async updateBusinessSubCategory(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            await BusinessSubCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, update_at: updated_at });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteBusinessSubCategory(id: string) {
        try {
            await BusinessSubCategory.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getBusinessSubCategoryList(req: any) {
        const data = await BusinessSubCategory.find()
        .populate('businessCategoryId');
        return data;
    }

}