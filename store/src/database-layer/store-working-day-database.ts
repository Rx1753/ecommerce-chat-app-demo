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
import { storeWorkingDay } from '../models/store-working-days';
import { natsWrapper } from '../nats-wrapper';

export class StoreWorkingDayDatabaseLayer {

    static async createStore(req: any) {
        const { storeId, startTime, closeTime,startBreakTime,endBreakTime, day } = req.body;

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
        var dayAlreadyExisit = false;
        if (permission) {
            const storeCheck = await Store.findById(storeId);

            if (storeCheck) {
                const storeData = await storeWorkingDay.find({ storeId: storeId });
                storeData.forEach((e: any) => {
                    if (e.day == day) {
                        dayAlreadyExisit = true;
                    }
                })
                if (dayAlreadyExisit == false) {
                    const startT=startTime.split(":");
                    const endT=closeTime.split(":");


                    const startB=startBreakTime.split(":");
                    const endB=endBreakTime.split(":");

                    if(startT[1]<59 && startT[1]>0 && endT[1]<59 && endT[1]>0 && startT[0]<23 && startT[0]>0 && endT[0]<23 && endT[0]>0 ){
                        if(startT[0]<endT[0]){
                            if(startB[1]<59 && startB[1]>0 && endB[1]<59 && endB[1]>0 && startB[0]<23 && startB[0]>0 && endB[0]<23 && endB[0]>0 ){
                                if(startB[0]<endB[0]){
                                    if(startB[0]>startT[0] && endT[0]<endB[0]){
                                        const data = storeWorkingDay.build({
                                            day: day,
                                            startTime: startTime,
                                            closeTime: closeTime,
                                            storeId: storeId,
                                            startBreakTime:startBreakTime,
                                            endBreakTime:endBreakTime,
                                        });
                                        console.log(data);
                                        await data.save();
                                        return data;
                                    }
                                }
                            }
                        }
                    }
                    throw new BadRequestError('Time is not Valid');
                } else {
                    throw new BadRequestError('Given Day data is already exisit pls update that')
                }
            } else {
                throw new BadRequestError('Givien id is not valid');
            }
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }


    }

    static async updateStore(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        var permission = false;
        const { storeId, startTime, closeTime, day } = req.body;
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
                const storeCheck = await Store.findById(storeId);

                if (storeCheck) {
                    await storeWorkingDay.findByIdAndUpdate(id, {
                        day: day,
                        startTime: startTime,
                        closeTime: closeTime,
                        storeId: storeId
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