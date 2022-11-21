import { BadRequestError } from '../errors/bad-request-error';
import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import jwt from 'jsonwebtoken';
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
        if(email!=undefined || email!=null){
            existingUser = await CustomerAuthDatabaseLayer.isExistingEmail(email);    
        }
        if(phoneNumber!=undefined || phoneNumber!=null){
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
        const { email, password } = req.body;
        const exitstingEmail = await CustomerAuthDatabaseLayer.isExistingEmail(email);

        if (!exitstingEmail) {
            throw new BadRequestError('Invalid Email');
        }
        const passwordMatch = await CustomerAuthDatabaseLayer.checkPassword(
            exitstingEmail.password,
            password
        );

        if (!passwordMatch) {
            throw new BadRequestError('Invalid Password');
        }

        if (exitstingEmail) {
            const accessToken = await JwtService.accessToken({ email: exitstingEmail.email, id: exitstingEmail.id, phoneNumber:exitstingEmail.phoneNumber,userType:'Customer'});
            const newRefreshToken = await CustomerAuthDatabaseLayer.updateRefreshToken(exitstingEmail.id, exitstingEmail.email, exitstingEmail.phoneNumber)
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


    //Switch Toogle
    static async inviteOnlyGenralSwitch(req: Request, res: Response) {
        var status = await CustomerAuthDatabaseLayer.inviteOnlyGenralSwitch(req);
        res.status(200).send({ status: status });
    }

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



