import { ObjectId } from 'mongodb';
import { BadRequestError } from '@rx-ecommerce-chat/common_lib';

import { JwtService } from '../services/jwt';
import { BusinessUser, BusinessUserAttrs } from '../models/business-user';
import { Password } from '../services/password';
import shortid from 'shortid';
import { invitionCode } from '../models/invition-code';
import { MailService } from '../services/mail-services';
import { BusinessUserCreatedPublisher } from '../events/publisher/business-user-publisher';
import { natsWrapper } from '../nats-wrapper';
import { PayloadType } from '../services/string-values';
import { Store } from '../models/store';
import { BusinessRoleType, BusinessRoleTypeAttrs } from '../models/business-role-type';
import { BusinessRoleMapping, BusinessRoleMappingAttrs } from '../models/business-role-mapping';

export class BusinessUserAuthDatabaseLayer {

    static async isExistingEmail(email: String) {
        const existingEmail: any = await BusinessUser.findOne({ $and: [{ email }, { isDelete: false }] });
        console.log(existingEmail);
        return existingEmail;
    }
    static async isExistingPhone(phoneNumber: Number) {
        const existingPhone = await BusinessUser.findOne({ $and: [{ phoneNumber }, { isDelete: false }] });
        return existingPhone;
    }

    static async updateRefreshToken(id: ObjectId, email: string, phoneNumber: Number) {
        const refreshToken = await JwtService.refreshToken({ email: email, id: id, phoneNumber: phoneNumber, type: PayloadType.Vendor });
        const customer = await BusinessUser.findByIdAndUpdate(id, { refreshToken: refreshToken });
        return customer?.refreshToken;
    }

    static async signUpUser(req: any) {
        const { name, email, password, phoneNumber, refralCode, isWaiting } = req.body;

        var user: BusinessUserAttrs;

        user = { name, password };
        if (req.body.phoneNumber == null && req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
            console.log('phone not defined,\nSo email signup');
            user.email = email;
            user.phoneNumber = null;
        }
        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
            console.log('email not defined,\nSo phone signup');
            user.phoneNumber = phoneNumber;
            user.email = null;
        }
        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email != null && req.body.email != undefined) {
            user.phoneNumber = phoneNumber;
            user.email = email;
        }

        const data = BusinessUser.build(user);
        data.refreshToken = await JwtService.refreshToken({ email: data.email, id: data._id, phoneNumber: data.phoneNumber, type: PayloadType.Vendor, })
        await data.save();
        await new BusinessUserCreatedPublisher(natsWrapper.client).publish({
            id: data.id,
            version: 0,
            email: data.email,
            phoneNumber: data.phoneNumber,
            name: data.name,
            isMFA: data.isMFA,
            isEmailVerified: data.isEmailVerified,
            isPhoneVerified: data.isPhoneVerified,
            isActive: true,
            createdBy: data.id.toString(),
            refreshToken: data.refreshToken
        })
        return data;
    }



    static async checkPassword(existingPassword: string, password: string) {
        return await Password.compare(existingPassword, password);
    }

    static async getAllUsers() {
        return await BusinessUser.find({ isDelete: false });
    }

    static async getUserById(id: any) {
        const customer = await BusinessUser.findById(id);
        return customer;
    }

    static async deleteUserById(id: string) {
        const user = await BusinessUser.updateOne({ _id: id }, { $set: { isDelete: true, } });
        return user;
    }

    static async getUserByName(name: string) {
        const user = await BusinessUser.find({ $and: [{ name: { $regex: name + '.*', $options: 'i' } }, { isDelete: false }] });
        return user;
    }

    static async currentLoginUser(req: any) {
        const user = await BusinessUser.findById({ _id: req.currentUser.id });
        return user;
    }

    static async updateUserInfo(req: any) {
        // try {
        //     const { customerId, name, imageUrl, isReadReceipt, isEmailVisible, isAddressVisible, isAllowToAddGroup, allowFriendsToAddGroup, isAllowToRecieveBrodcast, isLastSeenActive, isAllowToChatStranger } = req.body;
        //     const currentDate = new Date();
        //     const updated_at = currentDate.getTime();
        //     await Customer.findByIdAndUpdate(req.currentUser.id, {
        //         'name': name,
        //         'imageUrl': imageUrl,
        //         'isReadReceipt': isReadReceipt,
        //         'isEmailVisible': isEmailVisible,
        //         'isAddressVisible': isAddressVisible,
        //         'isAllowToAddGroup': isAllowToAddGroup,
        //         'allowFriendsToAddGroup': allowFriendsToAddGroup,
        //         'isAllowToRecieveBrodcast': isAllowToRecieveBrodcast,
        //         'isLastSeenActive': isLastSeenActive,
        //         'isAllowToChatStranger': isAllowToChatStranger,
        //         'updated_at': updated_at,
        //     });
        //     return;
        // } catch (err: any) {
        //     console.log(err.message);
        //     throw new BadRequestError(err.message)
        // }
    }

    static async emailVerification(req: any) {
        console.log('email verify');
        console.log(req.currentUser);

        if (req.currentUser.email != null && req.currentUser.email != undefined) {
            const customerData = await BusinessUser.findById(req.currentUser.id);
            if (customerData && customerData.isEmailVerified == false) {
                const code = shortid.generate();
                var createVerificationCode = invitionCode.build({
                    type: 'email',
                    email: customerData.email,
                    userId: req.currentUser.id,
                    code: code,
                    expirationDays: 8
                })
                await createVerificationCode.save();
                await MailService.mailTrigger(code, customerData.email, 'Email Verification', "<h1>Hello " + customerData.name + ",</h1><p>here, is your email verfication code,</br> pls enter it in email verification code field <B>" + code + "</B> . </p>");
                return;

            } else {
                throw new BadRequestError('Your email is already verified')
            }
        } else {
            throw new BadRequestError('You Login with PhoneNumber')
        }
    }

    static async emailCodeVerification(req: any) {
        const { code } = req.body;
        const inviteCodeCheck = await invitionCode.findOne({ $and: [{ code: code }, { userId: req.currentUser.id }, { email: req.currentUser.email }] })
        if (inviteCodeCheck) {
            const timeStamp: any = inviteCodeCheck?.updated_at;
            const diff = new Date().getTime() - timeStamp;
            var diffSecound = Math.ceil((diff / 1000) % 60);

            // console.log(diffDays);
            // console.log(inviteCodeCheck?.expirationDays!);

            console.log(diffSecound);
            console.log('hii');

            if (300000 > diffSecound) {
                await BusinessUser.findByIdAndUpdate(req.currentUser.id, { isMFA: true, isEmailVerified: true });
                return;
            } else {
                await invitionCode.findByIdAndDelete(inviteCodeCheck.id);
                throw new BadRequestError('Ohh No!! Your Verification code is exppired');
            }
        } else {
            throw new BadRequestError('Your Code is not matched');
        }

    }

    static async phoneVerification(req: any) {
        console.log('phone verify');

        if (req.currentUser.phoneNumber != null && req.currentUser.phoneNumber != undefined) {
            const customerData = await BusinessUser.findById(req.currentUser.id);
            if (customerData && customerData.isPhoneVerified == false) {
                const code = shortid.generate();
                var createVerificationCode = invitionCode.build({
                    type: 'phone',
                    phoneNumber: req.currentUser.phoneNumber,
                    userId: req.currentUser.id,
                    code: code,
                    expirationDays: 8
                })
                await createVerificationCode.save();
                //SMS trigger logic pending

                // return await MailService.mailTrigger(code, customerData.email, 'phone Verification', customerData.name);

            }
        } else {
            throw new BadRequestError('You Login with email address')
        }
        return;
    }

    static async phoneCodeVerification(req: any) {
        const { code } = req.body;
        const inviteCodeCheck = await invitionCode.findOne({ $and: [{ code: code }, { userId: req.currentUser.id }, { phoneNumber: req.currentUser.phoneNumber }] })
        if (inviteCodeCheck) {
            const timeStamp: any = inviteCodeCheck?.updated_at;
            const diff = new Date().getTime() - timeStamp;
            var diffSecound = Math.ceil((diff / 1000) % 60);

            // console.log(diffDays);
            // console.log(inviteCodeCheck?.expirationDays!);

            if (30000 > diffSecound) {
                await BusinessUser.findByIdAndUpdate(req.currentUser.id, { isMFA: true, isPhoneVerified: true });
                return;
            } else {
                await invitionCode.findByIdAndDelete(inviteCodeCheck.id);
                throw new BadRequestError('Ohh No!! Your Verification code is exppired');
            }
        } else {
            throw new BadRequestError('Your Code is not matched');
        }

    }

    static async forgotPasswordMailTrigger(req: any) {
        console.log('email verify');
        console.log(req.currentUser);

        if (req.currentUser.email != null && req.currentUser.email != undefined) {

            const code = shortid.generate();
            var createVerificationCode = invitionCode.build({
                type: 'email',
                email: req.currentUser.email,
                userId: req.currentUser.id,
                code: code,
                expirationDays: 1
            })
            await createVerificationCode.save();

            await MailService.mailTrigger(code, req.currentUser.email, 'Forgot Password ', "<h1>Hello,</h1><p>here, is your code,</br> pls enter it in forgot password code field <B>" + code + "</B> . </p>");
            return;
        } else {

            throw new BadRequestError('You Login with PhoneNumber')
        }

    }

    //forgot password with code verify  
    static async forgotPasswordCodeVerification(req: any) {
        const { code, password } = req.body;
        const inviteCodeCheck = await invitionCode.findOne({ $and: [{ code: code }, { userId: req.currentUser.id }, { email: req.currentUser.email }] })
        if (inviteCodeCheck) {
            const timeStamp: any = inviteCodeCheck?.updated_at;
            const diff = new Date().getTime() - timeStamp;
            var diffSecound = Math.abs(Math.ceil(diff / 1000) % 60);

            // console.log(diffDays);
            // console.log(inviteCodeCheck?.expirationDays!);
            console.log(diffSecound);

            if (12000 > diffSecound) {
                const hased = await Password.toHash(password);
                await BusinessUser.findByIdAndUpdate(req.currentUser.id, { password: hased });
                return;
            } else {
                await invitionCode.findByIdAndDelete(inviteCodeCheck.id);
                throw new BadRequestError('Ohh No!! Your Verification code is exppired');
            }

        } else {
            throw new BadRequestError('Your Code is not matched');
        }
    }

    static async createUser(req: any) {
        const { name, email, password, phoneNumber, isAllowChangePassword, storeId, refralCode, isWaiting } = req.body;
        const { tableName1, isRead1, isCreate1, isDelete1, isUpdate1 } = req.body;
        const { tableName2, isRead2, isCreate2, isDelete2, isUpdate2 } = req.body;
        const { tableName3, isRead3, isCreate3, isDelete3, isUpdate3 } = req.body;
        const { tableName4, isRead4, isCreate4, isDelete4, isUpdate4 } = req.body;
        var user: BusinessUserAttrs;
        user = { name, password };
        if (req.body.phoneNumber == null && req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
            console.log('phone not defined,\nSo email signup');
            user.email = email;
            user.phoneNumber = null;
        }
        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
            console.log('email not defined,\nSo phone signup');
            user.phoneNumber = phoneNumber;
            user.email = null;
        }
        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email != null && req.body.email != undefined) {
            user.phoneNumber = phoneNumber;
            user.email = email;
        }
        user.allowChangePassword = isAllowChangePassword;


        const storeCheck = await Store.findById(storeId);
        if (storeCheck) {
            user.store = storeId;
        } else {
            throw new BadRequestError('store id is not valid');
        }
        const userData = BusinessUser.build(user);
        await userData.save();

        //Mapping logic for first table
        // var roleMapping1: BusinessRoleMappingAttrs;
        // roleMapping1 = { businessRoleId: userData.id };
        // const table1Check = await BusinessRoleType.findOne({ $and: [{ tableName: tableName1 }, { isCreate: isCreate1 }, { isUpdate: isUpdate1 }, { isDelete: isDelete1 }, { isRead: isRead1 }] })
        // if (!table1Check) {
        //     const role1 = BusinessRoleType.build({ tableName: tableName1, isRead: isRead1, isCreate: isCreate1, isDelete: isDelete1, isUpdate: isUpdate1 });
        //     await role1.save();
        //     roleMapping1.businessRoleId = role1.id;
        // } else {
        //     roleMapping1.businessRoleId = table1Check.id;
        // }
        // const roleMappingData1=BusinessRoleMapping.build(roleMapping1);
        // await roleMappingData1.save();


        // //Mapping logic for secound table
        // var roleMapping2: BusinessRoleMappingAttrs;
        // roleMapping2 = { businessRoleId: userData.id };
        // const table2Check = await BusinessRoleType.findOne({ $and: [{ tableName: tableName2 }, { isCreate: isCreate2 }, { isUpdate: isUpdate2 }, { isDelete: isDelete2 }, { isRead: isRead2 }] })
        // if (!table2Check) {
        //     const role2 = BusinessRoleType.build({ tableName: tableName2, isRead: isRead2, isCreate: isCreate2, isDelete: isDelete1, isUpdate: isUpdate1 });
        //     await role2.save();
        //     roleMapping2.businessRoleId = role2.id;
        // } else {
        //     roleMapping2.businessRoleId = table2Check.id;
        // }
        // const roleMappingData2=BusinessRoleMapping.build(roleMapping2);
        // await roleMappingData2.save();

        // //Mapping logic for third table
        // var roleMapping3: BusinessRoleMappingAttrs;
        // roleMapping3 = { businessRoleId: userData.id };
        // const table3Check = await BusinessRoleType.findOne({ $and: [{ tableName: tableName3 }, { isCreate: isCreate3 }, { isUpdate: isUpdate3 }, { isDelete: isDelete3 }, { isRead: isRead3 }] })
        // if (!table3Check) {
        //     const role3 = BusinessRoleType.build({ tableName: tableName3, isRead: isRead3, isCreate: isCreate3, isDelete: isDelete3, isUpdate: isUpdate3 });
        //     await role3.save();
        //     roleMapping3.businessRoleId = role3.id;
        // } else {
        //     roleMapping3.businessRoleId = table3Check.id;
        // }
        // const roleMappingData3=BusinessRoleMapping.build(roleMapping3);
        // await roleMappingData3.save();

        // //Mapping logic for fourth table
        // var roleMapping4: BusinessRoleMappingAttrs;
        // roleMapping4 = { businessRoleId: userData.id };
        // const table4Check = await BusinessRoleType.findOne({ $and: [{ tableName: tableName4 }, { isCreate: isCreate4 }, { isUpdate: isUpdate4 }, { isDelete: isDelete4 }, { isRead: isRead4 }] })
        // if (!table4Check) {
        //     const role4 = BusinessRoleType.build({ tableName: tableName4, isRead: isRead4, isCreate: isCreate4, isDelete: isDelete4, isUpdate: isUpdate4 });
        //     await role4.save();
        //     roleMapping4.businessRoleId = role4.id;
        // } else {
        //     roleMapping4.businessRoleId = table4Check.id;
        // }
        // const roleMappingData4=BusinessRoleMapping.build(roleMapping4);
        // await roleMappingData4.save();
    }
}