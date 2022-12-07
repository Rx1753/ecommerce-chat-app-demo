import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { JwtService } from '../services/jwt';
import { BusinessUserAuthDatabaseLayer } from '../database-layer/business-user-auth-database';
import { PayloadType } from '../services/string-values';

// import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';
// import { natsWrapper } from '../nats-wrapper';

export class BusinessDomain {

    // SIGNUP
    static async signUp(req: Request, res: Response) {

        const { email, phoneNumber } = req.body;
        var exitstingPhone;
        var existingUser
        if (email != undefined || email != null) {
            existingUser = await BusinessUserAuthDatabaseLayer.isExistingEmail(email);
        }
        if (phoneNumber != undefined || phoneNumber != null) {
            exitstingPhone = await BusinessUserAuthDatabaseLayer.isExistingPhone(phoneNumber);
        }

        if (existingUser) {
            throw new BadRequestError('Email In Use');
        }
        if (exitstingPhone) {
            throw new BadRequestError('Phone is Already in use');
        }

        //nats publisher
        // await new UserCreatedPublisher(natsWrapper.client).publish({
        //     id: user.id,
        //     userId: user.id,
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     email: user.email,
        //     type: user.type,
        // });

        var user = await BusinessUserAuthDatabaseLayer.signUpUser(req);
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
            exitstingEmail = await BusinessUserAuthDatabaseLayer.isExistingEmail(email)
            isEmail = true;
        }
        if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
            console.log('email not defined,\nSo phone signup');
            phoneNumber = req.body.phoneNumber;
            existingPhone = await BusinessUserAuthDatabaseLayer.isExistingPhone(phoneNumber)
        }


        if (isEmail && !exitstingEmail) {
            throw new BadRequestError('Invalid Email');
        }
        if (isEmail == false && !existingPhone) {
            throw new BadRequestError('Invalid PhoneNumber');
        }
        const passwordMatch = await BusinessUserAuthDatabaseLayer.checkPassword(
            isEmail ? exitstingEmail.password : existingPhone.password,
            password
        );

        if (!passwordMatch) {
            throw new BadRequestError('Invalid Password');
        }

        if (exitstingEmail) {
            const accessToken = await JwtService.accessToken({ email: exitstingEmail.email, id: exitstingEmail.id, phoneNumber: exitstingEmail.phoneNumber, type: PayloadType.Vendor });
            const newRefreshToken = await BusinessUserAuthDatabaseLayer.updateRefreshToken(exitstingEmail.id, exitstingEmail.email, exitstingEmail.phoneNumber)
            return res.status(201).send({ accessToken: accessToken, refreshToken: newRefreshToken })
        } else if (existingPhone) {
            const accessToken = await JwtService.accessToken({ email: existingPhone.email, id: existingPhone.id, phoneNumber: existingPhone.phoneNumber, type: PayloadType.Vendor });
            const newRefreshToken = await BusinessUserAuthDatabaseLayer.updateRefreshToken(existingPhone.id, existingPhone.email, existingPhone.phoneNumber)
            return res.status(201).send({ accessToken: accessToken, refreshToken: newRefreshToken })
        }
    }


    //GET ALL USER DATA
    static async getAllUsers(req: Request, res: Response) {
        var customer = await BusinessUserAuthDatabaseLayer.getAllUsers();
        res.status(200).send(customer);
    }

    //GET USER BY ID
    static async getUserById(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const customer = await BusinessUserAuthDatabaseLayer.getUserById(req.params.id);
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

        const deletedCount = await BusinessUserAuthDatabaseLayer.deleteUserById(req.params.id);
        res.status(200).json({
            success: true,
            message: `Deleted a count of ${deletedCount} user.`,
        });
    }

    //Get User By name 
    static async getUserByName(req: Request, res: Response) {
        const customer = await BusinessUserAuthDatabaseLayer.getUserByName(req.params.name);
        res.status(200).send(customer);
    }

    //update personal info
    static async updateUserInfo(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.updateUserInfo(req);
        res.status(201).send({ updated: true });;
    }

    //currentLoginUSer
    static async currentLoginUser(req: Request, res: Response) {
        const currentUser = await BusinessUserAuthDatabaseLayer.currentLoginUser(req);
        res.status(200).send(currentUser);
    }

    //EmailVerification
    static async emailVerification(req: Request, res: Response) {
        const mailTrigger = await BusinessUserAuthDatabaseLayer.emailVerification(req);
        res.status(200).send({ mailTrigger: mailTrigger });
    }

    //mail verification code verify
    static async emailCodeVerification(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.emailCodeVerification(req);
        res.status(200).send({ emailVerification: true });
    }

    //Phone Verification
    static async phoneVerification(req: Request, res: Response) {
        const mailTrigger = await BusinessUserAuthDatabaseLayer.phoneVerification(req);
        res.status(200).send({ mailTrigger: mailTrigger });
    }

    //phone verification code verify
    static async phoneCodeVerification(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.phoneCodeVerification(req);
        res.status(200).send({ emailVerification: true });
    }

    //email trigger for forgot password
    static async forgotPasswordMailTrigger(req: Request, res: Response) {
        const mailTrigger = await BusinessUserAuthDatabaseLayer.forgotPasswordMailTrigger(req);
        res.status(200).send({ mailTrigger: mailTrigger });
    }

    //forgot password with code verify
    static async forgotPasswordCodeVerification(req: Request, res: Response) {
        await BusinessUserAuthDatabaseLayer.forgotPasswordCodeVerification(req);
        res.status(200).send({ passwordUpdated: true });
    }

}