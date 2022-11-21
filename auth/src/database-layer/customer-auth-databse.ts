import { ObjectId } from 'mongodb';
import { BadRequestError } from '../errors/bad-request-error';
import { adminSwitches } from '../models/admin-switch';
import { Customer, CustomerAttrs } from '../models/customer';
import { invitionCode } from '../models/invition-code';
import { JwtService } from '../services/jwt';
import { Password } from '../services/password';

export class CustomerAuthDatabaseLayer {

    static async isExistingEmail(email: String) {
        const existingEmail = await Customer.findOne({ $and: [{ email }, { isDelete: false }] });
        console.log(existingEmail);

        return existingEmail;
    }
    static async isExistingPhone(phoneNumber: Number) {
        const existingPhone = await Customer.findOne({ $and: [{ phoneNumber }, { isDelete: false }] });
        return existingPhone;
    }

    static async updateRefreshToken(id: ObjectId, email: string, phoneNumber: Number) {
        const refreshToken =await JwtService.refreshToken({ email: email, id: id, phoneNumber:phoneNumber,userType:'Customer'});    
        const customer = await Customer.findByIdAndUpdate(id, { refreshToken: refreshToken });
        return customer?.refreshToken;
    }

    static async inviteOnlyGenralSwitch(req: any) {
        var res = await adminSwitches.find({ name: 'inviteOnly' });
        if (res.length != 0) {
            await adminSwitches.updateMany({ name: 'inviteOnly' }, { $set: { status: req.params.status } });
        } else {
            var admin = adminSwitches.build({ name: 'inviteOnly', status: Boolean(req.params.status) });
            await admin.save();
        }
        return req.params.status;
    }

    static async signUpUser(req: any, inviteCode: string) {

        const checkInviteCase = await adminSwitches.findOne({ name: 'inviteOnly' });

        console.log('invite check');
        console.log(checkInviteCase?.status);
        const { name, email, password, phoneNumber, refralCode, isWaiting } = req.body;

        var user: CustomerAttrs;

        user = { name, password, inviteCode };
        if (req.body.phoneNumber == null || req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
            console.log('phone not defined,\nSo email signup');
            user.email = email;
            user.phoneNumber = null;
        }
        if (req.body.phoneNumber != null || req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
            console.log('email not defined,\nSo phone signup');
            user.phoneNumber = phoneNumber;
            user.email = null;
        }

        if (checkInviteCase?.status == false) {
            console.log("Admin switch\'s off So directly Signin ");
            
            user.status = "New";
        } else if (checkInviteCase?.status && isWaiting == true) {
            console.log('isWaiting apply so directly in waiting list');
            
            user.status = "pending";
        } else if (checkInviteCase?.status && refralCode != null && refralCode != undefined) {
            console.log('invite code verify logic');

            //invite code verify
            const inviteCodeCheck = user.email ?
                await invitionCode.findOne({ $and: [{ email: user.email }, { type: 'email' }, { code: refralCode }, { isUsed: false }] }) :
                await invitionCode.findOne({ $and: [{ type: 'phoneNumber' }, { code: refralCode }, { phoneNumber: user.phoneNumber }, { isUsed: false }] });

            if (inviteCodeCheck) {

                const timeStamp: any = inviteCodeCheck?.updated_at;
                const diff = new Date().getTime() - timeStamp;
                var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
                // console.log(diffDays);
                // console.log(inviteCodeCheck?.expirationDays!);

                if (inviteCodeCheck?.expirationDays! > diffDays) {
                    //referalId
                    user.referalType = 'Admin';
                    user.referalId = inviteCodeCheck.created_By;
                    await invitionCode.updateOne({ _id: inviteCodeCheck.id }, { $set: { isUsed: true } });

                } else {

                    throw new BadRequestError('Ohh No!! Your invition code is exppired');
                }
            } else {

                //refer by customer
                const inviteCodeCheck = await Customer.findOne({ inviteCode: refralCode })

                if (inviteCodeCheck) {
                    user.referalType = 'Customer';
                    user.referalId = inviteCodeCheck._id;
                }
                //inviteCode not verified
                throw new BadRequestError('Your Invite Code is not verify');
            }
        } else {
            throw new BadRequestError('Invite Code is must needed');
        }
        const storeData = Customer.build(user);
        storeData.refreshToken = await JwtService.refreshToken({ email: storeData.email, id: storeData._id, phoneNumber:storeData.phoneNumber,userType: 'CustomerUser',})      
        await storeData.save();

        // var payload = {
        //     id: storeData.id,
        //     email: storeData.email,
        //     phoneNumber: storeData.phoneNumber,
        //     type: 'CustomerUser',
        // };

        // var userJwt = await JwtService.accessToken(payload);

        // // Store it on session object
        // req.session = { jwt: userJwt };
        return storeData;

    }

    static async checkPassword(existingPassword: string, password: string) {
        return await Password.compare(existingPassword, password);
    }

    static async getAllUsers() {
        return await Customer.find({ isDelete: false });
    }

    static async getUserById(id: any) {
        const customer = await Customer.findById(id);
        return customer;
    }

    static async deleteUserById(id: string) {
        const user = await Customer.updateOne({ _id: id }, { $set: { isDelete: true, } });
        return user;
    }

    static async getUserByName(name: string) {
        const user = await Customer.find({ $and: [{ name: { $regex: name + '.*', $options: 'i' } }, { isDelete: false }] });
        return user;
    }

    
}