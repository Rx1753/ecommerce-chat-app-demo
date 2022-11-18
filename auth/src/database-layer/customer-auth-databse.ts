import { ObjectId } from 'mongodb';
import { adminSwitches } from '../models/admin-switch';
import { Customer } from '../models/customer';
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

    static async updateRefreshToken(id: ObjectId, email: string, password: string) {

        const refreshToken =await JwtService.refreshToken({ email: email, password: password }, process.env.JWT_KEY!)
        const customer = await Customer.findByIdAndUpdate(id, { refreshToken: refreshToken });
        return customer?.refreshToken;

    }

    static async signUpUser(req: any, inviteCode: string) {

        const checkInviteCase = await adminSwitches.find({name:'inviteOnly'});

        console.log(checkInviteCase);
        

        const { name, email, password, phoneNumber } = req.body;
        const refreshToken = await JwtService.refreshToken({ email: email, password: password }, process.env.JWT_KEY!)
        const user = Customer.build({ name, email, password, phoneNumber, inviteCode,refreshToken });
        await user.save();

        var payload = {
            id: user.id,
            email: user.email,
            type: 'CustomerUser', 
        };

        var userJwt = await JwtService.accessToken(payload,process.env.JWT_KEY!);

        // Store it on session object
        req.session = { jwt: userJwt };

        return user;
        
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
        const user = await Customer.updateOne({ _id: id }, { $set: { isDelete: true,} });
        return user;
    }

    static async getUserByName(name: string) {
        const user = await Customer.find({ $and: [{ name: { $regex: name + '.*', $options: 'i' } }, { isDelete: false }] });
        return user;
    }


}