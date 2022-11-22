import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { ObjectId } from 'mongodb';
import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
import { AdminUser, AdminUserAttrs } from '../models/admin-user';
import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { PayloadType, Strings } from '../services/string-values';
import {
  AdminPermissions,
  AdminPermissionsAttrs,
  AdminPermissionsDoc,
} from '../models/admin-permissions';

export class AuthDatabaseLayer {
  static async isSuperAdmin(email: String) {
    const isSuperAdminUser = await AdminUser.find({
      email: email,
      isActive: true,
      isSuperAdmin: true,
    });
    if (isSuperAdminUser.length > 0) {
      return isSuperAdminUser[0];
    }
  }

  static async addPermission(data: AdminPermissionsAttrs) {
    const permission = AdminPermissions.build(data);
    await permission.save();
    return permission;
  }

  static async findPermission(permissionId: any) {
    var permission = await AdminPermissions.findById(permissionId);
    if (!permission) {
      throw new BadRequestError('Permissions not found in Add permission');
    }
    return permission;
  }

  static async isExistingUser(email: String) {
    const existingUser = await AdminUser.findOne({ email });
    return existingUser;
  }

  static async findUserByActiveEmails(email: string) {
    const adminUser = await AdminUser.find({ email: email, isActive: true });
    if (adminUser.length > 0) {
      return adminUser[0];
    }
  }

  static async signUpUser(data: AdminUserAttrs) {
    const hashPassword = await Password.toHash(data.password);
    const user = AdminUser.build(data);
    var payload = {
      id: user.id,
      email: user.email,
      type: PayloadType.AdminType,
    };
    const jwtToken = await JwtService.accessToken(payload);
    user.password = hashPassword;
    user.refreshToken = jwtToken;
    user.isActive = true;
    user.isSuperAdmin = false;
    console.log(`SignUp User :: ${user.permissionId}`);
    await user.save();
    // await new UserCreatedPublisher(natsWrapper.client).publish({
    //   id: user.id,
    //   userId: user.id,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   email: user.email,
    //   type: user.type,
    // });
    return jwtToken;
  }

  // verify active email & password
  static async verifyEmailAndPassword(email: string, password: string) {
    const adminUser = await this.findUserByActiveEmails(email);
    if (adminUser) {
      const checkPassword = await Password.compare(
        adminUser.password,
        password
      );

      if (!checkPassword) {
        throw new BadRequestError(Strings.invalidPassword);
      }
      return adminUser;
    } else {
      throw new BadRequestError(Strings.invalidEmail);
    }
  }

  // update refresh token in admin user
  static async updateRefreshToken(id: string, email: string) {
    console.log(`Payload login Type :: ${PayloadType.AdminType}`);
    var payload = {
      id: id, //admin user id
      email: email,
      type: PayloadType.AdminType,
    };
    var newAccessToken = await JwtService.accessToken(payload);
    var newRefreshToken = await JwtService.refreshToken(payload);
    //update refresh token
    const adminUser = await AdminUser.findByIdAndUpdate(id, {
      refreshToken: newRefreshToken,
      updatedAt: new Date(Date.now()),
    });

    if (!adminUser) {
      throw Error('Error occur on Updating');
    }
    return { newAccessToken, newRefreshToken };
  }

  static async getAllUsers() {
    return await AdminUser.find().populate('permissionId');
  }

  static async getUserById(id: any) {
    var data = await AdminUser.findOne({ _id: id }).populate('permissionId');
    return data;
  }

  static async deleteUserById(id: string) {
    const user = await AdminUser.remove({ _id: id });
    return user.deletedCount;
  }
}
