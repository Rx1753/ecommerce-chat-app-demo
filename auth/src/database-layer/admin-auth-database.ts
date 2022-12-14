import { BadRequestError } from '@rx-ecommerce-chat/common_lib';

import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
import { AdminUser, AdminUserAttrs } from '../models/admin-user';
import { PayloadType, Strings } from '../services/string-values';
import {
  AdminPermissions,
  AdminPermissionsAttrs,
} from '../models/admin-permissions';

export class AuthDatabaseLayer {


  static async checkPassword(existingPassword: string, password: string) {
    return await Password.compare(existingPassword, password);
  }

  static async addAdminUser(req: any) {

    try {

      const adminData = await AdminUser.findById({ _id: req.currentUser.id });

      if (adminData?.isSuperAdmin == true) {

        const { userName, email, password, phoneNumber, isAllowChangePassword, storeId } = req.body;

        var user: AdminUserAttrs;
        const hashPassword = await Password.toHash(password);
        user = { userName: userName, password: hashPassword, allowChangePassword: isAllowChangePassword };
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

        const roleData = req.body.rolesArray;
        const roleDataArr: string[] = [];

        roleData.forEach((e: any) => {
          if (!roleDataArr.includes(e.tableName)) {
            roleDataArr.push(e.tableName);
          } else {
            throw new BadRequestError('Repeating table is not possible');
          }
        });

        var permissionRoleId: { _id: string }[] = [];

        await Promise.all(roleData.map(async (e: any) => {
          const roleMapData = await AuthDatabaseLayer.checkRoleMapping(e.tableName, e.isCreate, e.isUpdate, e.isDelete, e.isRead);
          permissionRoleId.push(roleMapData);
        }));

        user.permissionId = permissionRoleId;
        user.createdBy = req.currentUser.id;
        const adminData = AdminUser.build(user);
        await adminData.save();

        return user;

      } else {
        throw new BadRequestError('you are not superAdmin so you don\'t have rights to create admin');
      }
    }
    catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }




  static async checkRoleMapping(tableName: string, isCreate: boolean, isUpdate: boolean, isDelete: boolean, isRead: boolean) {

    try {
      tableName = tableName.toLowerCase();
      const tableCheck = await AdminPermissions.findOne({ $and: [{ tableName: tableName }, { isCreate: isCreate }, { isUpdate: isUpdate }, { isDelete: isDelete }, { isRead: isRead }] })
      if (!tableCheck) {
        const role = AdminPermissions.build({ tableName: tableName, isRead: isRead, isCreate: isCreate, isDelete: isDelete, isUpdate: isUpdate });
        await role.save();
        return { _id: role.id.toString() }
      } else {

        return { _id: tableCheck.id.toString() };
      }

    }
    catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }

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

  static async isExistingEmail(email: String) {
    const existingEmail: any = await AdminUser.findOne({ $and: [{ email: email }, { isActive: true }] });
    return existingEmail;
  }

  static async isExistingPhone(phoneNumber: Number) {
    const existingPhone:any = await AdminUser.findOne({ $and: [{ phoneNumber: phoneNumber }, { isActive: true }] });
    return existingPhone;
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
      console.log('admin', adminUser);

      if (!checkPassword) {
        throw new BadRequestError(Strings.invalidPassword);
      }
      return adminUser;
    } else {
      throw new BadRequestError(Strings.invalidEmail);
    }
  }

  // update refresh token in admin user


  static async updateRefreshToken(id: string, email: string, phoneNumber: Number) {
    const refreshToken = await JwtService.refreshToken({ email: email, id: id, phoneNumber: phoneNumber, type: PayloadType.AdminType });
    const admin = await AdminUser.findByIdAndUpdate(id, { refreshToken: refreshToken });
    return admin?.refreshToken;
  }

  static async getAllUsers() {
    return await AdminUser.find().populate('permissionId._id');
  }

  static async getUserById(id: any) {
    var data = await AdminUser.findOne({ _id: id }).populate('permissionId._id');
    return data;
  }
  static async getCurrentUser(id: any) {
    var data = await AdminUser.findOne({ _id: id }).populate('permissionId._id');
    return data;
  }

  static async deleteUserById(req: any, id: string) {
    const adminData = await AdminUser.findById({ _id: req.currentUser.id });

    if (adminData?.isSuperAdmin == true) {
      await AdminUser.findByIdAndUpdate({ _id: id }, { $set: { isActive: false } });
      const user = await AdminUser.findById(id);
      return user;
    } else {
      throw new BadRequestError('you are not superAdmin so you don\'t have rights to create admin');
    }
  }
}
