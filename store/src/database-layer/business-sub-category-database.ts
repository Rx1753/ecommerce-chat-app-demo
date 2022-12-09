import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessSubCategoryCreatedPublisher } from '../event/publisher/business-sub-category-publisher';
import { BusinessCategory } from '../models/business-category';
import { BusinessSubCategory } from "../models/business-sub-category";
import { natsWrapper } from '../nats-wrapper';

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
            await new BusinessSubCategoryCreatedPublisher(natsWrapper.client).publish({
                id:data.id,
                name:data.name,
                description:data.description,
                isActive:data.isActive,
                businessCategoryId:data.businessCategoryId.toString()
            })
            return data;
        } else {
            throw new BadRequestError('Provided business Category is not valid');
        }
    }

    static async updateBusinessSubCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        const businessCategoryCheck = await BusinessCategory.findById(req.body.businessCategoryId);
        if (businessCategoryCheck) {
            try {
                await BusinessSubCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, businessCategoryId: req.body.businessCategoryId, update_at: updatedAt });
                return;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided business Category is not valid');
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
    
    static async getBusinessCategoryIdList(req: any,id:any) {
        const data = await BusinessSubCategory.find({businessCategoryId:id})
            .populate('businessCategoryId');
        return data;
    }

}