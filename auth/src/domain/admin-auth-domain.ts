import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import { AuthDatabaseLayer } from '../database-layer/admin-auth-database';
import { AdminPermissionsAttrs } from '../models/admin-permissions';
import { AdminUserAttrs } from '../models/admin-user';
import { Strings } from '../services/string-values';

export class AuthDomain {
  // Add Permissions
  static async addPermissions(req: Request, res: Response) {
    const data: AdminPermissionsAttrs = req.body;
    var isAdded = await AuthDatabaseLayer.addPermission(data);
    if (isAdded) {
      return res
        .status(201)
        .send({ status: true, message: Strings.permissionAdded });
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

  // SIGNIN
  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    var adminUser = await AuthDatabaseLayer.verifyEmailAndPassword(
      email,
      password
    );
    if (adminUser) {
      var { newAccessToken, newRefreshToken } =
        await AuthDatabaseLayer.updateRefreshToken(
          adminUser.id,
          adminUser.email
        );
      // Store it on session object
      req.session = { jwt: newAccessToken };
      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        message: Strings.loginSuccess,
      });
    }
  }

  // // Update Profile
  // static async updateProfile(req: Request, res: Response) {
  //   const { email } = req.body;
  //   const existingUser = await AuthDatabaseLayer.isExistingUser(email);
  //   if (existingUser) {
  //     throw new BadRequestError('Email In Use');
  //   }
  //   const data: AdminUserAttrs = req.body;
  //   var jwtToken = await AuthDatabaseLayer.signUpUser(data);
  //   req.session = { jwt: jwtToken };
  //   return res
  //     .status(201)
  //     .send({ status: true, message: Strings.registrationSuccess });
  // }

  // // GET ALL USERS
  static async getAllUsers(req: Request, res: Response) {
    var users = await AuthDatabaseLayer.getAllUsers();
    res.status(200).send(users);
  }

  // //Get Single user detail
  static async getUserById(req: Request, res: Response) {
    const user = await AuthDatabaseLayer.getUserById(req.params.id);
    if (!user) {
      throw new BadRequestError(Strings.userDoesNotExist);
    }
    res.status(200).send(user);
  }

  // //Delete user by Id
  static async deleteUserById(req: Request, res: Response) {
    const deletedCount = await AuthDatabaseLayer.deleteUserById(req.params.id);
    res.status(200).json({
      success: true,
      message: `Deleted a count of ${deletedCount} user.`,
    });
  }

  // // SIGN-OUT
  static async signOut(req: Request, res: Response) {
    req.session = null;
    res.send({});
  }

  // // CURRENT_USER
  static async currentUser(req: Request, res: Response) {
    //res.send({ currentUser: req.currentUser || null });
    res.send({ currentUser: true });
  }
}
