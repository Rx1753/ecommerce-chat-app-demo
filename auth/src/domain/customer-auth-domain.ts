import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import shortid from 'shortid';
import mongoose from 'mongoose';
import { CustomerAuthDatabaseLayer } from '../database-layer/customer-auth-databse';
import { JwtService } from '../services/jwt';
import { invitionCode } from '../models/invition-code';

// import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';
// import { natsWrapper } from '../nats-wrapper';

export class CustomerDomain {

    // SIGNUP
    static async signUp(req: Request, res: Response) {

        const { email, phoneNumber } = req.body;
        var exitstingPhone;
        var existingUser
        if (email != undefined || email != null) {
            existingUser = await CustomerAuthDatabaseLayer.isExistingEmail(email);
        }
        if (phoneNumber != undefined || phoneNumber != null) {
            exitstingPhone = await CustomerAuthDatabaseLayer.isExistingPhone(phoneNumber);
        }

        if (existingUser) {
            throw new BadRequestError('Email In Use');
        }
        if (exitstingPhone) {
            throw new BadRequestError('Phone is Already in use');
        }
        const inviteCode = shortid.generate();

        //nats publisher
        // await new UserCreatedPublisher(natsWrapper.client).publish({
        //     id: user.id,
        //     userId: user.id,
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     email: user.email,
        //     type: user.type,
        // });

        var user = await CustomerAuthDatabaseLayer.signUpUser(req, inviteCode);
        return res.status(201).send(user);
    }

    //SIGNIN 
    static async signIn(req: Request, res: Response) {

        const { password } = req.body;
        var email: string, phoneNumber: Number, isEmail = false;

        var exitstingEmail: any, existingPhone: any;

        if (req.body.phoneNumber == null && req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
            console.log('phone not defined,\nSo email signup');
            email = req.body.email;
            exitstingEmail = await CustomerAuthDatabaseLayer.isExistingEmail(email)
            isEmail = true;
        }
        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
            console.log('email not defined,\nSo phone signup');
            phoneNumber = req.body.phoneNumber;
            existingPhone = await CustomerAuthDatabaseLayer.isExistingPhone(phoneNumber)
        }
        // if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email != null && req.body.email != undefined) {
        //     phoneNumber = phoneNumber;
        //     email = email;
        // }


        if (isEmail && !exitstingEmail) {
            throw new BadRequestError('Invalid Email');
        }
        if (isEmail == false && !existingPhone) {
            throw new BadRequestError('Invalid PhoneNumber');
        }
        const passwordMatch = await CustomerAuthDatabaseLayer.checkPassword(
            isEmail ? exitstingEmail.password : existingPhone.password,
            password
        );

        if (!passwordMatch) {
            throw new BadRequestError('Invalid Password');
        }

        if (exitstingEmail) {
            const accessToken = await JwtService.accessToken({ email: exitstingEmail.email, id: exitstingEmail.id, phoneNumber: exitstingEmail.phoneNumber, userType: 'Customer' });
            const newRefreshToken = await CustomerAuthDatabaseLayer.updateRefreshToken(exitstingEmail.id, exitstingEmail.email, exitstingEmail.phoneNumber)
            return res.status(201).send({ accessToken: accessToken, refreshToken: newRefreshToken })
        } else if (existingPhone) {
            const accessToken = await JwtService.accessToken({ email: existingPhone.email, id: existingPhone.id, phoneNumber: existingPhone.phoneNumber, userType: 'Customer' });
            const newRefreshToken = await CustomerAuthDatabaseLayer.updateRefreshToken(existingPhone.id, existingPhone.email, existingPhone.phoneNumber)
            return res.status(201).send({ accessToken: accessToken, refreshToken: newRefreshToken })
        }
    }


    //GET ALL USER DATA
    static async getAllUsers(req: Request, res: Response) {
        var customer = await CustomerAuthDatabaseLayer.getAllUsers();
        res.status(200).send(customer);
    }

    //GET USER BY ID
    static async getUserById(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const customer = await CustomerAuthDatabaseLayer.getUserById(req.params.id);
        if (!customer) {
            throw new BadRequestError("customer doesn't exist");
        }
        res.status(200).send(customer);
    }

    //Delete user by Id
    static async deleteUserById(req: Request, res: Response) {

        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }

        const deletedCount = await CustomerAuthDatabaseLayer.deleteUserById(req.params.id);
        res.status(200).json({
            success: true,
            message: `Deleted a count of ${deletedCount} user.`,
        });
    }

    //Get User By name 
    static async getUserByName(req: Request, res: Response) {
        const customer = await CustomerAuthDatabaseLayer.getUserByName(req.params.name);
        res.status(200).send(customer);
    }

    //update personal info
    static async updateUserInfo(req: Request, res: Response) {
        await CustomerAuthDatabaseLayer.updateUserInfo(req);
        res.status(201).send({ updated: true });;
    }

    //currentLoginUSer
    static async currentLoginUser(req: Request, res: Response) {
        const currentUser = await CustomerAuthDatabaseLayer.currentLoginUser(req);
        res.status(200).send(currentUser);
    }

    //EmailVerification
    static async emailVerification(req: Request, res: Response) {
        const mailTrigger = await CustomerAuthDatabaseLayer.emailVerification(req);
        res.status(200).send({ mailTrigger: mailTrigger });
    }

    //mail verification code verify
    static async emailCodeVerification(req: Request, res: Response) {
        await CustomerAuthDatabaseLayer.emailCodeVerification(req);
        res.status(200).send({ emailVerification: true });
    }

    //Phone Verification
    static async phoneVerification(req: Request, res: Response) {
        const mailTrigger = await CustomerAuthDatabaseLayer.phoneVerification(req);
        res.status(200).send({ mailTrigger: mailTrigger });
    }

    //phone verification code verify
    static async phoneCodeVerification(req: Request, res: Response) {
        await CustomerAuthDatabaseLayer.phoneCodeVerification(req);
        res.status(200).send({ emailVerification: true });
    }

    //email trigger for forgot password
    static async forgotPasswordMailTrigger(req:Request,res:Response){
        const mailTrigger = await CustomerAuthDatabaseLayer.forgotPasswordMailTrigger(req);
        res.status(200).send({ mailTrigger: mailTrigger });
    }

    //forgot password with code verify
    static async forgotPasswordCodeVerification(req: Request, res: Response) {
        await CustomerAuthDatabaseLayer.forgotPasswordCodeVerification(req);
        res.status(200).send({ passwordUpdated: true });
    }
    //Switch Toogle
    static async inviteOnlyGenralSwitch(req: Request, res: Response) {
        var status = await CustomerAuthDatabaseLayer.inviteOnlyGenralSwitch(req);
        res.status(200).send({ status: status });
    }

    //reference Code creation
    static async generateReferalCode(req: Request, res: Response) {
        var createReferalCode = invitionCode.build({
            type: 'email',
            email: 'abc@gmail.com',
            code: '123456',
            expirationDays: 8
        })
        await createReferalCode.save();
        return createReferalCode;
    }


}