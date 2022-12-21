import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { StoreUpdatedPublisher } from '../event/publisher/store-updated-publisher';
import { BusinessProfile } from "../models/business-profile";
import { Store } from '../models/store';
import { natsWrapper } from '../nats-wrapper';

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
            const data = await BusinessProfile.findById(id);
            if (data) {
                const status = data.isActive ? false : true;
                await BusinessProfile.findByIdAndUpdate(id, { isActive: status });
                if (status == false) {
                    await Store.updateMany({ businessProfileId: id }, { $set: { isActive: status } });
                    const storeData = await Store.find({businessProfileId:id});
                    storeData.forEach((e:any)=>{
                        console.log('store publish');
                        
                        new StoreUpdatedPublisher(natsWrapper.client).publish({
                            id: e.id,
                            phoneNumber: e.phoneNumber,
                            email: e.email,
                            businessProfileId: e.businessProfileId,
                            businessSubCategoryId: e.businessSubCategoryId,
                            description: e.description,
                            name: e.name,
                            membershipId: e.membershipId,
                            createdBy: e.createdBy,
                            isActive: e.isActive
                        })
                    })
                }
                return;
            } else {
                throw new BadRequestError("given id is not found in DB");
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getBusinessProfile(req: any) {
        const data = await BusinessProfile.find();
        return data;
    }
    static async getActiveBusinessProfile(req: any) {
        const data = await BusinessProfile.find({ isActive: true });
        return data;
    }

    static async getDeactiveBusinessProfile(req: any) {
        const data = await BusinessProfile.find({ isActive: false });
        return data;
    }

    static async getBusinessProfileById(req: any, id: string) {
        const data = await BusinessProfile.findById(id);
        if (data) {
            return data;
        } else {
            throw new BadRequestError('data not found for given id')
        }
    }

}