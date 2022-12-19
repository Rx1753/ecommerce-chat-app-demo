import { BadRequestError } from '@rx-ecommerce-chat/common_lib';

import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
import { AdminUser, AdminUserAttrs } from '../models/admin-user';
import { PayloadType, Strings } from '../services/string-values';
import {
  AdminPermissions,
  AdminPermissionsAttrs,
} from '../models/admin-permissions';
import { MailService } from '../services/mail-services';
import shortid from 'shortid';
import { invitionCode } from '../models/invition-code';
import { natsWrapper } from '../nats-wrapper';
import { InviteCodeCreatedPublisher } from '../events/publisher/invite-code-publisher';
import { AdminPermissionCreatedPublisher } from '../events/publisher/admin-permission-publisher';
import { AdminCreatedPublisher } from '../events/publisher/admin-publisher';
import { AdminUpdatedPublisher } from '../events/publisher/admin-updated-publisher';

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

        await new AdminCreatedPublisher(natsWrapper.client).publish({
          id: adminData.id,
          userName: adminData.userName,
          allowChangePassword: adminData.allowChangePassword,
          phoneNumber: adminData.phoneNumber,
          permissionId: permissionRoleId,
          email: adminData.email
        })

        if (user.email != null) {
          // await MailService.mailTrigger(req.currentUser.email, 'Admin Credentials', "<h1>Hello,</h1><p>here, is your admin credentials,</br> pls enter it when you login to application as admin <B> Email:" + user.email + "</br>Password:" + user.password + "</B> . </p>")
        } else {
          //TODO sms trigger
        }

        return adminData;

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
        await new AdminPermissionCreatedPublisher(natsWrapper.client).publish({
          id: role.id,
          tableName: role.tableName,
          isCreate: role.isCreate,
          isDelete: role.isDelete,
          isUpdate: role.isUpdate,
          isRead: role.isRead
        })
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
    const existingPhone: any = await AdminUser.findOne({ $and: [{ phoneNumber: phoneNumber }, { isActive: true }] });
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

  static async statusChangeId(req: any, id: any) {

    const adminData = await AdminUser.findOne({ _id: req.currentUser.id });

    if (adminData) {
      if (adminData.isSuperAdmin == true) {
        const data = await AdminUser.findById({ _id: id });
        if (data) {
          var status=data.isActive ? false : true;
          await AdminUser.findByIdAndUpdate(id, { isActive: status });
        }
        return;
      }
    } else {
      throw new BadRequestError('you are not superAdmin so you don\'t have rights to create admin');
    }
  }

  static async getAdminByName(name: any) {
    console.log('name', name);

    var data = await AdminUser.find({ userName: { $regex: name + '.*', $options: 'i' } }).populate('permissionId._id');
    if (data) {
      return data;
    } else {
      return [];
    }

  }

  static async forgotPasswordMailTrigger(req: any) {
    console.log('forgot password mail trigger');


    try {
      const { email } = req.body;
      console.log(email);


      const emailData = await AdminUser.findOne({ email: req.body.email });
      console.log('emailData');

      if (emailData) {
        if (emailData.allowChangePassword == true) {
          const code = shortid.generate();
          var createVerificationCode = invitionCode.build({
            type: 'email',
            email: req.body.email,
            code: code,
          })

          await createVerificationCode.save();
          await new InviteCodeCreatedPublisher(natsWrapper.client).publish({
            id: createVerificationCode.id,
            type: createVerificationCode.type,
            code: createVerificationCode.code,
            email: createVerificationCode.email
          })

          await MailService.mailTrigger(req.body.email, 'Forgot Password ', "<h1>Hello,</h1><p>here, is your code,</br> pls enter it in forgot password code field <B>" + code + "</B> . </p>");
          return;

        } else {
          throw new BadRequestError('Given email has no rights to change password')
        }
      }
      else {
        throw new BadRequestError('Given email is not existing in our system')
      }
    } catch (e: any) {
      throw new BadRequestError(e.message)

    }

  }

  //forgot password with code verify  
  static async forgotPasswordCodeVerification(req: any) {
    const { code, password } = req.body;
    const inviteCodeCheck = await invitionCode.findOne({ code: code })
    if (inviteCodeCheck) {
      const hased = await Password.toHash(password);
      const data = await AdminUser.findOneAndUpdate({ email: inviteCodeCheck.email }, { password: hased });
      if (data) {
        console.log('password updated');
        const accessToken = await JwtService.accessToken({ email: data.email, id: data.id, phoneNumber: data.phoneNumber, type: PayloadType.AdminType });
        const newRefreshToken = await AuthDatabaseLayer.updateRefreshToken(data.id, data.email, data.phoneNumber)
        req.session = { jwt: accessToken };
        console.log('session', req.session);
        return { accessToken: accessToken, refreshToken: newRefreshToken }
      } else {
        throw new BadRequestError('Something wrong');
      }

    } else {
      throw new BadRequestError('Your Code is not matched');
    }
  }

  static async updateAdminRoles(req: any) {

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
    const adminUserData = await AdminUser.findById(req.body.id).populate('permissionId._id');
    
    if(adminUserData){
      await Promise.all(adminUserData.permissionId.map((e:any)=>{
        if(!roleDataArr.includes(e._id.tableName)){
          permissionRoleId.push(e);
        }
      }))
    
    await AdminUser.findByIdAndUpdate(req.body.id, { permissionId: permissionRoleId });
    await new AdminUpdatedPublisher(natsWrapper.client).publish({
      id: req.body.id,
      userName: adminUserData?.userName,
      allowChangePassword: adminUserData?.allowChangePassword,
      isActive: adminUserData?.isActive,
      permissionId:permissionRoleId,
      createdBy:adminUserData?.createdBy,
      email:adminUserData?.email,
      phoneNumber:adminUserData?.phoneNumber

    })
    const adminData =await AdminUser.findById(req.body.id).populate('permissionId._id');
    return adminData;
  }else{
    throw new BadRequestError('sended id is not valid')
  }
  }

}
