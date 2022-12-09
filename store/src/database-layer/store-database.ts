import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { StoreCreatedPublisher } from '../event/publisher/store-publisher';
import { BusinessProfile } from '../models/business-profile';
import { BusinessRoleMapping } from '../models/business-role-mapping';
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
        var permission = false;

        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findById(req.currentUser.id);
            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                    console.log(userRoleMapping);
                    userRoleMapping.forEach((e: any) => {
                        if (e.businessRoleId.tableName == 'store' && e.businessRoleId.isCreate == true) {
                            permission = true;
                        }
                    })
                }
            }
        } else if (req.currentUser.type == "Admin") {
            permission = true;
        } else {
            throw new BadRequestError('User is not Valid');
        }
        if (permission) {
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
                    id: data.id,
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
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }


    }

    static async updateStore(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        var permission = false;
        const { name, description, imageUrl, BusinessSubCategoryId, BusinessProfileId, email, phoneNumber, cityId, stateId, countryId, lat, lon, welcomeMessage, pinCode, addressLine1 } = req.body;
        try {
            if (req.currentUser.type == 'Vendor') {
                const userData = await BusinessUser.findById(req.currentUser.id);
                if (userData) {
                    if (userData.id.toString() == userData.createdBy) {
                        console.log('both id is same so it\'s business profile user');
                        permission = true;
                    } else {
                        const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                        console.log(userRoleMapping);
                        userRoleMapping.forEach((e: any) => {
                            if (e.businessRoleId.tableName == 'store' && e.businessRoleId.isUpdate == true) {
                                permission = true;
                            }
                        })
                    }
                }
            } else if (req.currentUser.type == "Admin") {
                permission = true;
            } else {
                throw new BadRequestError('User is not Valid');
            }

            if (permission) {
                const BusinessSubCategoryCheck = await BusinessSubCategory.findById(BusinessSubCategoryId);
                const BusinessProfileCheck = await BusinessProfile.findById(BusinessProfileId);
                const countryCheck = await Country.findById(countryId);
                const stateCheck = await State.findOne({ $and: [{ id: stateId }, { country_id: countryId }] });
                const cityCheck = await City.findOne({ $and: [{ id: cityId }, { stateId: stateId }] });
                if (BusinessProfileCheck && BusinessSubCategoryCheck && countryCheck && stateCheck && cityCheck) {
                    await Store.findByIdAndUpdate(id, {
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
                        updateAt: updatedAt,
                    })
                    return;
                    //update publisher pending
                } else {
                    throw new BadRequestError('Givien id is not valid');
                }
            } else {
                throw new BadRequestError('Permission is not for current login user');
            }
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteStore(req: any, id: string) {

        var permission = false;

        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findById(req.currentUser.id);
            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');

                    userRoleMapping.forEach((e: any) => {
                        if (e.businessRoleId.tableName == 'store' && e.businessRoleId.isDelete == true) {
                            permission = true;
                            console.log('user has permission');
                            
                        }
                    })
                }
            }
        } else if (req.currentUser.type == "Admin") {
            permission = true;
        } else {
            throw new BadRequestError('User is not Valid');
        }

        if (permission) {
            try {
                await Store.findByIdAndDelete(id);
                //delete listener pensding
                return;
            } catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async getStoreById(req: any, id: string) {
        const data = await Store.findById(id);
        return data;
    }

}