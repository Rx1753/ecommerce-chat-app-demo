import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { StoreCreatedPublisher } from '../event/publisher/store-publisher';
import { BusinessProfile } from '../models/business-profile';
import { BusinessSubCategory } from '../models/business-sub-category';
import { BusinessUser } from '../models/business-user';
import { City } from '../models/city';
import { Country } from '../models/country';
import { State } from '../models/state';
import { Store } from "../models/store";
import { natsWrapper } from '../nats-wrapper';

export class StoreDatabaseLayer {

    static async createStore(req: any) {
        const { name, description, imageUrl, BusinessSubCategoryId, BusinessProfileId, email, phoneNumber, cityId, stateId, countryId, lat, lon, welcomeMessage, pinCode, addressLine1 } = req.body;

        console.log(req.currentUser.id);
        const BusinessSubCategoryCheck = await BusinessSubCategory.findById(BusinessSubCategoryId);
        const BusinessProfileCheck = await BusinessProfile.findById(BusinessProfileId);
        const countryCheck = await Country.findById(countryId);
        const stateCheck = await State.findOne({ $and: [{ id: stateId }, { country_id: countryId }] });
        const cityCheck = await City.findOne({ $and: [{ id: cityId }, { stateId: stateId }] });
        if (BusinessProfileCheck && BusinessSubCategoryCheck && countryCheck && stateCheck && cityCheck) {
            const data = Store.build({
                phoneNumber: phoneNumber,
                email: email,
                businessProfileId: BusinessProfileCheck.id,
                businessSubCategoryId: BusinessSubCategoryCheck.id,
                description: description,
                name: name,
                latitude: lat,
                longitude: lon,
                city: cityCheck.id,
                state: stateCheck.id,
                country: countryCheck.id,
                pinCode: pinCode,
                addressLine1: addressLine1,
                imageUrl: imageUrl,
                welcomeMessage: welcomeMessage,
                createdBy: req.currentUser.id
            });
            console.log(data);
            await data.save();
            await new StoreCreatedPublisher(natsWrapper.client).publish({
                id:data.id,
                phoneNumber: phoneNumber,
                email: email,
                businessProfileId: BusinessProfileCheck.id,
                businessSubCategoryId: BusinessSubCategoryCheck.id,
                description: description,
                name: name,
                latitude: lat,
                longitude: lon,
                city: cityCheck.id,
                state: stateCheck.id,
                country: countryCheck.id,
                pinCode: pinCode,
                addressLine1: addressLine1,
                imageUrl: imageUrl,
                welcomeMessage: welcomeMessage,
                createdBy: req.currentUser.id
            })
            return data;

        } else {
            throw new BadRequestError('Givien id is not valid');
        }
    }

    static async  updateStore(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            if(req.currentUser.type=='Vendor'){
               const ownerStore=await Store.findOne({createdBy:req.currentUser.id}); 
               if(ownerStore){
                    console.log('owner Of store');
               }else{
                    console.log('not owner');
                    const userType = await BusinessUser.findById(req.currentUser.id);
                    // const userRoles = await Business
               }
                
            }else if(req.currentUser.type=="Admin"){
            }else{
                throw new BadRequestError('User is not Valid');
            }

            // await Store.findOneAndUpdate({ $and: [{ id: id }, { 'BusinessUsers.BusinessUserId': req.currentUser.id }] }, 
            // { name: req.body.name, description: req.body.description, tagLine: req.body.tagLine, phoneNumber: req.body.phoneNumber, coverPhoto: req.body.coverPhoto, latitude: req.body.latitude, longitude: req.body.longitude, welcomeMessage: req.body.welcomeMessage, update_at: updated_at });
            // return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteStore(id: string) {
        try {
            await Store.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getStoreById(req: any, id: string) {
        const data = await Store.findById(id);
        return data;
    }

}