import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import { Auth } from 'googleapis';
import mongoose from 'mongoose';
import { createVariableDeclaration } from 'typescript';
import { AuthDatabaseLayer } from '../database-layer/admin-auth-database';
import { AdminPermissionsAttrs } from '../models/admin-permissions';
import { AdminUserAttrs } from '../models/admin-user';
import { JwtService } from '../services/jwt';
import { PayloadType, Strings } from '../services/string-values';

export class AuthDomain {

  static async addAdmin(req: Request, res: Response) {
    const { email, phoneNumber } = req.body;
    var exitstingPhone: any;
    var existingUser: any;

    if (email != undefined || email != null) {
      existingUser = await AuthDatabaseLayer.isExistingEmail(email);
    }

    if (phoneNumber != undefined || phoneNumber != null) {
      exitstingPhone = await AuthDatabaseLayer.isExistingPhone(phoneNumber);
    }

    if (existingUser) {
      throw new BadRequestError('Email In Use');
    }

    if (exitstingPhone) {
      throw new BadRequestError('Phone is Already in use');
    }

    var user = await AuthDatabaseLayer.addAdminUser(req);
    return res.status(201).send(user);
  }

  ///--------------------
  // Add Permissions
  static async addPermissions(req: Request, res: Response) {
    const data: AdminPermissionsAttrs = req.body;
    var isPermissionAdded = await AuthDatabaseLayer.addPermission(data);
    if (isPermissionAdded) {
      return res
        .status(201)
        .send({ status: true, message: Strings.permissionAdded, permissionId: isPermissionAdded.id });
    }
  }

  // SIGNUP
  static async signUp(req: any, res: Response) {
    const { email, permissionId } = req.body;
    var superAdmin = await AuthDatabaseLayer.isSuperAdmin(req.currentUser.email);
    if (superAdmin) {
      const existingUser = await AuthDatabaseLayer.isExistingUser(email);
      if (existingUser) {
        throw new BadRequestError(Strings.emailInUse);
      }

      var userPermission = await AuthDatabaseLayer.findPermission(permissionId);
      if (userPermission) {
        const data: AdminUserAttrs = req.body;
        var jwtToken = await AuthDatabaseLayer.signUpUser(data);
        req.session = { jwt: jwtToken };
        return res
          .status(201)
          .send({ status: true, message: Strings.registrationSuccess });
      } else {
        throw new BadRequestError('Permission is not defined');
      }
    } else {
      throw new BadRequestError('UnAuthorized User');
    }
  }
  //-------------------

  // SIGNIN
  static async signIn(req: Request, res: Response) {

    const { password } = req.body;
    var email: string, phoneNumber: Number, isEmail = false;

    var exitstingEmail: any, existingPhone: any;

    if (req.body.phoneNumber == null && req.body.phoneNumber == undefined && req.body.email != null && req.body.email != undefined) {
      console.log('phone not defined,\nSo email signup');
      email = req.body.email;
      exitstingEmail = await AuthDatabaseLayer.isExistingEmail(email)
      console.log('exitstingEmail', exitstingEmail);

      isEmail = true;
    }
    if (req.body.phoneNumber != null && req.body.phoneNumber != undefined && req.body.email == null && req.body.email == undefined) {
      console.log('email not defined,\nSo phone signup');
      phoneNumber = req.body.phoneNumber;
      existingPhone = await AuthDatabaseLayer.isExistingPhone(phoneNumber)
      console.log('existingPhone', existingPhone);

    }


    if (isEmail && !exitstingEmail) {
      throw new BadRequestError('Invalid Email');
    }

    if (isEmail == false && !existingPhone) {
      throw new BadRequestError('Invalid PhoneNumber');
    }

    const passwordMatch = await AuthDatabaseLayer.checkPassword(
      isEmail ? exitstingEmail.password : existingPhone.password,
      password
    );
    console.log(passwordMatch);


    if (!passwordMatch) {
      throw new BadRequestError('Invalid Password');
    }

    if (exitstingEmail) {
      const accessToken = await JwtService.accessToken({ email: exitstingEmail.email, id: exitstingEmail.id, phoneNumber: exitstingEmail.phoneNumber, type: PayloadType.AdminType });
      const newRefreshToken = await AuthDatabaseLayer.updateRefreshToken(exitstingEmail.id, exitstingEmail.email, exitstingEmail.phoneNumber)
      req.session = { jwt: accessToken };
      console.log('session', req.session);
      return res.status(201).send({ accessToken: accessToken, refreshToken: newRefreshToken })
    } else if (existingPhone) {
      const accessToken = await JwtService.accessToken({ email: existingPhone.email, id: existingPhone.id, phoneNumber: existingPhone.phoneNumber, type: PayloadType.AdminType });
      const newRefreshToken = await AuthDatabaseLayer.updateRefreshToken(existingPhone.id, existingPhone.email, existingPhone.phoneNumber)
      req.session = { jwt: accessToken };
      console.log('session', req.session);
      return res.status(201).send({ accessToken: accessToken, refreshToken: newRefreshToken })
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    var users = await AuthDatabaseLayer.getAllUsers();
    res.status(200).send(users);
  }

  // //Get Single user detail
  static async getUserById(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Requested id is not id type');
    }
    const user = await AuthDatabaseLayer.getUserById(req.params.id);
    if (!user) {
      throw new BadRequestError(Strings.userDoesNotExist);
    }
    res.status(200).send(user);
  }

  // //Delete user by Id
  static async statusChangeId(req: Request, res: Response) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Requested id is not id type');
    } await AuthDatabaseLayer.statusChangeId(req, req.params.id);
    res.status(200).send({ 'status change': 'success' });
  }

  // // SIGN-OUT
  static async signOut(req: Request, res: Response) {
    req.session = null;
    res.status(200).send({});
  }

  // // CURRENT_USER
  static async currentUser(req: Request, res: Response) {
    if (req.currentUser?.id) {
      const data = await AuthDatabaseLayer.getCurrentUser(req.currentUser.id);
      res.status(200).send(data);
    } else {
      throw new BadRequestError('Token/session not founded')
    }
  }

  static async getAdminByName(req: Request, res: Response) {
    const adminData = await AuthDatabaseLayer.getAdminByName(req.params.name);
    res.status(200).send(adminData);
  }

  static async forgotPassword(req: Request, res: Response) {
    await AuthDatabaseLayer.forgotPasswordMailTrigger(req);
    res.status(200).send({"messgae": "Email trigger successfully"});
  }

  static async forgotPasswordCodeVerification(req: Request, res: Response) {
    const data = await AuthDatabaseLayer.forgotPasswordCodeVerification(req);
    res.status(200).send(data);
  }

  static async updateAdminRoles(req:Request,res:Response){
    const data = await AuthDatabaseLayer.updateAdminRoles(req);
    res.status(200).send(data);
  }

}
