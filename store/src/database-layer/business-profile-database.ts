import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessProfile } from "../models/business-profile";

export class BusinessProfileDatabaseLayer {

    static async createBusinessProfile(req: any) {
        const { name, description, BusinessSubCategoryId, tagLine, phoneNumber, coverPhoto, lat, lon, welcomeMessage } = req.body;

        console.log(req.currentUser.id);
        
        const data = BusinessProfile.build({
            BusinessUsers: [req.currentUser.id],
            name: name,
            businessSubCategoryId: BusinessSubCategoryId,
            tagLine: tagLine,
            phoneNumber: phoneNumber,
            description: description,
            coverPhoto: coverPhoto,
            latitude: lat,
            longitude: lon,
            welcomeMessage: welcomeMessage
        });
        console.log(data);
        await data.save();
        return data;
    }

    static async updateBusinessProfile(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        try {
            await BusinessProfile.findOneAndUpdate({ $and: [{ id: id }, { 'BusinessUsers.BusinessUserId': req.currentUser.id }] }, { name: req.body.name, description: req.body.description, tagLine: req.body.tagLine, phoneNumber: req.body.phoneNumber, coverPhoto: req.body.coverPhoto, latitude: req.body.latitude, longitude: req.body.longitude, welcomeMessage: req.body.welcomeMessage, update_at: updatedAt });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteBusinessProfile(id: string) {
        try {
            await BusinessProfile.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getBusinessProfileById(req: any,id:string) {
        const data = await BusinessProfile.findById(id);
        return data;
    }

}