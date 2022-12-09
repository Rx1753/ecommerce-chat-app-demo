import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessUser } from '../models/business-user';
import { Store } from "../models/store";
import { storeHoliday } from '../models/store-holiday';

export class StoreHolidayDatabaseLayer {

    static async createStoreHoliday(req: any) {
        const { storeId, startDate, endDate } = req.body;

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

        const startD = new Date(startDate);
        const endD = new Date(endDate);

        if (permission) {
            const storeCheck = await Store.findById(storeId);
            if (storeCheck) {
                if (startD <= endD) {
                    try {
                        const data = storeHoliday.build({
                            storeId: storeId,
                            startDate: startDate,
                            endDate: endDate
                        });
                        await data.save();
                        return data;
                    } catch (e: any) {
                        throw new BadRequestError(e.message);
                    }
                } else {
                    throw new BadRequestError('Start Date greter than end Date');
                }
            } else {
                throw new BadRequestError('Givien id is not valid');
            }
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }

    }

    static async updateStoreHoliday(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        var permission = false;
        const { startDate, endDate } = req.body;
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
                const startD = new Date(startDate);
                const endD = new Date(endDate);
                if (startD <= endD) {
                    await storeHoliday.findByIdAndUpdate(id, {

                        startDate: startDate,
                        endDate: endDate
                    })
                    return;
                    //update publisher pending
                }
                else {
                    throw new BadRequestError('Start Date greter than end Date');
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

    static async deleteStoreHoliday(req: any, id: string) {

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
                await storeHoliday.findByIdAndDelete(id);
                //delete listener pending
                return;
            } catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async getStoreHolidayById(req: any, id: string) {
        const data = await storeHoliday.findById(id);
        return data;
    }

}