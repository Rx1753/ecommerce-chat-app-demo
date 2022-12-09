import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessUser } from '../models/business-user';
import { Store } from "../models/store";
import { storeWorkingDay } from '../models/store-working-days';

export class StoreWorkingDayDatabaseLayer {

    static async createStoreWorkingDay(req: any) {
        const { storeId, startTime, closeTime, startBreakTime, endBreakTime, day } = req.body;

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

                    if (startTime.includes(":") && closeTime.includes(":") && startBreakTime.includes(":") && startBreakTime.includes(":")) {

                        const startT = startTime.split(":");
                        const endT = closeTime.split(":");

                        const startB = startBreakTime.split(":");
                        const endB = endBreakTime.split(":");
                        var breakFlag = false;
                        if (startB[0] == 0 && startB[1] == 0 && endB[0] == 0 && endB[1] == 0) {
                            breakFlag = true;
                        }

                        if (startT.length == 2 && startB.length == 2 && endT.length == 2 && endB.length == 2) {
                            console.log('1');

                            if (Number(startT[1]) <= 59 && Number(startT[1]) >= 0 && Number(endT[1]) <= 59 && Number(endT[1]) >= 0 && Number(startT[0]) <= 23 && Number(startT[0]) >= 0 && Number(endT[0]) <= 23 && Number(endT[0]) >= 0) {
                                console.log('2');

                                if (Number(startT[0]) < Number(endT[0]) || (Number(startT[0]) == Number(endT[0]) && Number(startT[1]) < Number(endT[1]))) { //4<12 12<4
                                    console.log('3');

                                    if ((Number(startB[1]) <= 59 && Number(startB[1]) >= 0 && Number(endB[1]) <= 59 && Number(endB[1]) >= 0 && Number(startB[0]) <= 23 && Number(startB[0]) >= 0 && Number(endB[0]) <= 23 && Number(endB[0]) >= 0) || breakFlag) {
                                        console.log('4');

                                        if ((Number(startB[0]) < Number(endB[0]) || (Number(startB[0]) == Number(endB[0]) && Number(startB[1]) < Number(endB[1]))) || breakFlag) {
                                            console.log('5');

                                            if (((Number(startB[0]) > Number(startT[0]) && Number(endT[0]) > Number(endB[0])) || (Number(startB[0]) == Number(startT[0]) && Number(endT[0]) == Number(endB[0]) && (Number(startT[1]) < Number(endT[1]) && Number(endT[1]) > Number(startB[1]) && Number(startB[1]) < Number(endB[1]) && Number(endT[1]) > Number(endB[1])))) || breakFlag) {
                                                console.log('6');

                                                try {
                                                    const data = storeWorkingDay.build({
                                                        day: day,
                                                        startTime: startTime,
                                                        closeTime: closeTime,
                                                        storeId: storeId,
                                                        startBreakTime: startBreakTime,
                                                        endBreakTime: endBreakTime,
                                                    });
                                                    console.log(data);
                                                    await data.save();
                                                    return data;
                                                } catch (e: any) {
                                                    throw new BadRequestError(e.message);
                                                }
                                            }
                                        }
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

    static async updateStoreWorkingDay(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        var permission = false;
        const { startTime, closeTime, startBreakTime, endBreakTime } = req.body;
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


                if (startTime.includes(":") && closeTime.includes(":") && startBreakTime.includes(":") && startBreakTime.includes(":")) {

                    const startT = startTime.split(":");
                    const endT = closeTime.split(":");

                    const startB = startBreakTime.split(":");
                    const endB = endBreakTime.split(":");

                    if (startT.length == 2 && startB.length == 2 && endT.length == 2 && endB.length == 2) {
                        if (Number(startT[1]) <= 59 && Number(startT[1]) >= 0 && Number(endT[1]) <= 59 && Number(endT[1]) >= 0 && Number(startT[0]) <= 23 && Number(startT[0]) >= 0 && Number(endT[0]) <= 23 && Number(endT[0]) >= 0) {

                            if (Number(startT[0]) < Number(endT[0]) || (Number(startT[0]) == Number(endT[0]) && Number(startT[1]) < Number(endT[1]))) { //4<12 12<4

                                if (Number(startB[1]) <= 59 && Number(startB[1]) >= 0 && Number(endB[1]) <= 59 && Number(endB[1]) >= 0 && Number(startB[0]) <= 23 && Number(startB[0]) >= 0 && Number(endB[0]) <= 23 && Number(endB[0]) >= 0) {

                                    if (Number(startB[0]) < Number(endB[0]) || (Number(startB[0]) == Number(endB[0]) && Number(startB[1]) < Number(endB[1]))) {

                                        if ((Number(startB[0]) > Number(startT[0]) && Number(endT[0]) > Number(endB[0])) || (Number(startB[0]) == Number(startT[0]) && Number(endT[0]) == Number(endB[0]) && (Number(startT[1]) < Number(endT[1]) && Number(endT[1]) > Number(startB[1]) && Number(startB[1]) < Number(endB[1]) && Number(endT[1]) > Number(endB[1])))) {

                                            await storeWorkingDay.findByIdAndUpdate(id, {
                                                startTime: startTime,
                                                closeTime: closeTime,
                                                startBreakTime: startBreakTime,
                                                endBreakTime: endBreakTime,
                                            })
                                            return;
                                            //update publisher pending
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
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteStoreWorkingDay(req: any, id: string) {

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
                await storeWorkingDay.findByIdAndDelete(id);
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

    static async getStoreWorkingDayById(req: any, id: string) {
        const data = await storeWorkingDay.findById(id);
        return data;
    }

}