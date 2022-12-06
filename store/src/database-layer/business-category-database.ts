import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessCategory } from "../models/business-category";

export class BusinessCategoryDatabaseLayer {

    static async createBusinessCategory(req: any) {
        const { name, description } = req.body;
        const data = BusinessCategory.build({
            name: name, 
            description: description,
            isActive: true
        });
        console.log(data);
        await data.save();
        return data;
    }

    static async updateBusinessCategory(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            await BusinessCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description,isActive:req.body.isActive, update_at: updated_at });
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