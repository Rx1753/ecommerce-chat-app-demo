import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessCategoryCreatedPublisher } from '../event/publisher/business-category-publisher';
import { BusinessCategory } from "../models/business-category";
import { natsWrapper } from '../nats-wrapper';

export class BusinessCategoryDatabaseLayer {

    static async createBusinessCategory(req: any) {
        const { name, description,isActive } = req.body;
        const data = BusinessCategory.build({
            name: name, 
            description: description,
            isActive: isActive
        });
        console.log(data);
        await data.save();
        await new BusinessCategoryCreatedPublisher(natsWrapper.client).publish({
            name:data.name,
            description:data.description,
            isActive:data.isActive,
            id:data.id.toString()
        })
        return data;

    }

    static async updateBusinessCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        try {
            await BusinessCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description,isActive:req.body.isActive, update_at: updatedAt });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteBusinessCategory(id: string) {
        try {
            await BusinessCategory.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getBusinessCategoryList(req: any) {
        const data = await BusinessCategory.find();
        return data;
    }

}