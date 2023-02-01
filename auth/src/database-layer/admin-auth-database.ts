import { BadRequestError } from '@rx-ecommerce-chat/common_lib';

import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
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
import { AdminRole } from '../models/admin-role';
import { AdminRoleMapping } from '../models/admin-role-mapping';
import { AdminAttrs,Admin } from '../models/admin';
import { Customer } from '../models/customer';

export class AuthDatabaseLayer {


  static async checkPassword(existingPassword: string, password: string) {
    return await Password.compare(existingPassword, password);
  }

  static async addAdminUser(req: any) {

    try {

      const adminData = await Admin.findById({ _id: req.currentUser.id });


      if (adminData?.isSuperAdmin == true) {

        const { userName, email, password, phoneNumber, isAllowChangePassword, storeId, roleId } = req.body;
        const roleCheck = await AdminRole.findById(roleId);
        if (!roleCheck) {
          throw new BadRequestError('role id is wrong');
        }

        var user: AdminAttrs;
        const hashPassword = await Password.toHash(password);
        user = { userName: userName, password: hashPassword, allowChangePassword: isAllowChangePassword, roleId: roleId };
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



        /*

        //Role permission logic 

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
        */

        const adminData = Admin.build(user);
        await adminData.save();

        // await new AdminCreatedPublisher(natsWrapper.client).publish({
        //   id: adminData.id,
        //   userName: adminData.userName,
        //   allowChangePassword: adminData.allowChangePassword,
        //   phoneNumber: adminData.phoneNumber,
        //   permissionId: permissionRoleId,
        //   email: adminData.email
        // })

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
    const isSuperAdminUser = await Admin.find({
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
    const existingUser = await Admin.findOne({ email });
    return existingUser;
  }

  static async findUserByActiveEmails(email: string) {
    const adminUser = await Admin.find({ email: email, isActive: true });
    if (adminUser.length > 0) {
      return adminUser[0];
    }
  }

  static async isExistingEmail(email: String) {
    const existingEmail: any = await Admin.findOne({ $and: [{ email: email }, { isActive: true }] });
    return existingEmail;
  }

  static async isExistingPhone(phoneNumber: Number) {
    const existingPhone: any = await Admin.findOne({ $and: [{ phoneNumber: phoneNumber }, { isActive: true }] });
    console.log('DSSSSSS',existingPhone);
    
    return existingPhone;
  }

  //not in use
  static async signUpUser(data: AdminAttrs) {
    const hashPassword = await Password.toHash(data.password);
    const user = Admin.build(data);
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
    const admin = await Admin.findByIdAndUpdate(id, { refreshToken: refreshToken });
    return admin?.refreshToken;
  }

  static async getAllUsers() {
    return await Admin.find()
  }



  static async getUserById(id: any) {
    var data = await Admin.findOne({ _id: id })
    return data;
  }

  static async getUserRuleId(id: any) {
    var data = await Admin.findOne({ _id: id })
    if (data) {
      const res: {}[] = [];
      const roleData = await AdminRoleMapping.find({roleId:data.roleId}).populate('permissionId');
      if(roleData){ 
        const resData = JSON.parse(JSON.stringify(data));
        resData.permission=roleData;
        return resData;
      }
    } else {
      throw new BadRequestError('given id is not exist');
    }
  }
//-------------------------
// Due to role changes

  // static async updateUserRuleId(req: any, Id: any) {
  //   var data = await AdminUser.findOne({ _id: Id }).populate('permissionId._id').select('permissionId');

  //   console.log('req', req.body);
  //   const { id, tableName, isRead, isCreate, isUpdate, isDelete } = req.body;


  //   if (data) {
  //     const r: any = [];
  //     data.permissionId.forEach((element: any) => {
  //       r.push(element._id.id);
  //       console.log(element._id);
  //     });
  //     var permissionRoleId: { _id: string }[] = [];
  //     if (r.includes(id)) {
  //       const roleId = await AuthDatabaseLayer.checkRoleMapping(tableName, isCreate, isUpdate, isDelete, isRead);

  //       var permissionRoleId: { _id: string }[] = [];
  //       permissionRoleId.push(roleId);
  //       const adminUserData = await AdminUser.findById(Id).populate('permissionId._id');
  //       console.log('permissionRoleId', permissionRoleId);

  //       if (adminUserData) {
  //         await Promise.all(adminUserData.permissionId.map((e: any) => {
  //           if (tableName != (e._id.tableName)) {
  //             permissionRoleId.push(e);
  //           }
  //         }))

  //         await AdminUser.findByIdAndUpdate(Id, { permissionId: permissionRoleId });
  //         await new AdminUpdatedPublisher(natsWrapper.client).publish({
  //           id: Id,
  //           userName: adminUserData?.userName,
  //           allowChangePassword: adminUserData?.allowChangePassword,
  //           isActive: adminUserData?.isActive,
  //           permissionId: permissionRoleId,
  //           createdBy: adminUserData?.createdBy,
  //           email: adminUserData?.email,
  //           phoneNumber: adminUserData?.phoneNumber

  //         })
  //         const adminData = await AdminUser.findById(Id).populate('permissionId._id');
  //         return adminData;
  //       } else {
  //         throw new BadRequestError('given id is not exist');
  //       }
  //     } else {
  //       throw new BadRequestError('Passs id is not valid');
  //     }
  //   } else {
  //     throw new BadRequestError('given id is not exist');
  //   }
  // }

  //---------
  // static async addUserRuleId(req: any, Id: any) {

  //   const { tableName, isRead, isCreate, isUpdate, isDelete } = req.body;
  //   var permissionRoleId: { _id: string }[] = [];
  //   const roleId = await AuthDatabaseLayer.checkRoleMapping(tableName, isCreate, isUpdate, isDelete, isRead);

  //   var permissionRoleId: { _id: string }[] = [];
  //   permissionRoleId.push(roleId);
  //   const adminUserData = await AdminUser.findById(Id).populate('permissionId._id');
  //   console.log('permissionRoleId', permissionRoleId);

  //   if (adminUserData) {
  //     await Promise.all(adminUserData.permissionId.map((e: any) => {
  //       if (tableName != (e._id.tableName)) {
  //         permissionRoleId.push(e);
  //       }
  //     }))

  //     await AdminUser.findByIdAndUpdate(Id, { permissionId: permissionRoleId });
  //     await new AdminUpdatedPublisher(natsWrapper.client).publish({
  //       id: Id,
  //       userName: adminUserData?.userName,
  //       allowChangePassword: adminUserData?.allowChangePassword,
  //       isActive: adminUserData?.isActive,
  //       permissionId: permissionRoleId,
  //       createdBy: adminUserData?.createdBy,
  //       email: adminUserData?.email,
  //       phoneNumber: adminUserData?.phoneNumber

  //     })
  //     const adminData = await AdminUser.findById(Id).populate('permissionId._id');
  //     return adminData;
  //   } else {
  //     throw new BadRequestError('given id is not exist');
  //   }
  // }


  // static async deleteUserRuleId(id: any, ruleId: any) {
  //   var permissionRoleId: { _id: string }[] = [];
  //   const adminUserData = await AdminUser.findById(id).populate('permissionId._id');
  //   console.log('permissionRoleId', permissionRoleId);

  //   if (adminUserData) {
  //     await Promise.all(adminUserData.permissionId.map((e: any) => {
  //       if (ruleId != (e._id.id)) {
  //         permissionRoleId.push(e);
  //       }
  //     }))

  //     await AdminUser.findByIdAndUpdate(id, { permissionId: permissionRoleId });
  //     await new AdminUpdatedPublisher(natsWrapper.client).publish({
  //       id: id,
  //       userName: adminUserData?.userName,
  //       allowChangePassword: adminUserData?.allowChangePassword,
  //       isActive: adminUserData?.isActive,
  //       permissionId: permissionRoleId,
  //       createdBy: adminUserData?.createdBy,
  //       email: adminUserData?.email,
  //       phoneNumber: adminUserData?.phoneNumber

  //     })
  //     const adminData = await AdminUser.findById(id).populate('permissionId._id');
  //     return adminData;
  //   } else {
  //     throw new BadRequestError('given id is not exist');
  //   }

  // }
  //------------------------


  static async getCurrentUser(id: any) {
    var data = await Admin.findOne({ _id: id }).populate('roleId')
    console.log('(data?.roleId.id).toHexString()',data?.roleId.id);
    
    const roleData= await AdminRoleMapping.find({roleId:(data?.roleId.id)}).populate('permissionId');
    console.log('roleData',roleData);
    
    var resData = JSON.parse(JSON.stringify(data))
    resData.role=roleData;
    return resData;
  }

  static async statusChangeId(req: any, id: any) {

    const adminData = await Admin.findOne({ _id: req.currentUser.id });

    if (adminData) {
      if (adminData.isSuperAdmin == true) {
        const data = await Admin.findById({ _id: id });
        if (data) {
          var status = data.isActive ? false : true;
          await Admin.findByIdAndUpdate(id, { isActive: status });
        }
        return;
      }
    } else {
      throw new BadRequestError('you are not superAdmin so you don\'t have rights to create admin');
    }
  }

  static async getAdminByName(name: any) {
    console.log('name', name);

    var data = await Admin.find({ userName: { $regex: name + '.*', $options: 'i' } });
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


      const emailData = await Admin.findOne({ email: req.body.email });
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

          // await MailService.mailTrigger(req.body.email, 'Forgot Password ', "<h1>Hello,</h1><p>here, is your code,</br> pls enter it in forgot password code field <B>" + code + "</B> . </p>");
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
      const data = await Admin.findOneAndUpdate({ email: inviteCodeCheck.email }, { password: hased });
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

    // const roleData = req.body.rolesArray;
    // const roleDataArr: string[] = [];

    const roleId=req.body.roleId;

    // roleData.forEach((e: any) => {
    //   if (!roleDataArr.includes(e.tableName)) {
    //     roleDataArr.push(e.tableName);
    //   } else {
    //     throw new BadRequestError('Repeating table is not possible');
    //   }
    // });

    // var permissionRoleId: { _id: string }[] = [];

    // await Promise.all(roleData.map(async (e: any) => {
    //   const roleMapData = await AuthDatabaseLayer.checkRoleMapping(e.tableName, e.isCreate, e.isUpdate, e.isDelete, e.isRead);
    //   permissionRoleId.push(roleMapData);
    // }));

    const adminUserData = await Admin.findById(req.body.id);
    if (adminUserData) {

      // await Promise.all(adminUserData.permissionId.map((e: any) => {
      //   if (!roleDataArr.includes(e._id.tableName)) {
      //     permissionRoleId.push(e);
      //   }
      // }))

      await Admin.findByIdAndUpdate(req.body.id, { roleId: roleId });
      // await new AdminUpdatedPublisher(natsWrapper.client).publish({
      //   id: req.body.id,
      //   userName: adminUserData?.userName,
      //   allowChangePassword: adminUserData?.allowChangePassword,
      //   isActive: adminUserData?.isActive,
      //   permissionId: permissionRoleId,
      //   createdBy: adminUserData?.createdBy,
      //   email: adminUserData?.email,
      //   phoneNumber: adminUserData?.phoneNumber

      // })
      const adminData = await Admin.findById(req.body.id);
      return adminData;
    } else {
      throw new BadRequestError('sended id is not valid')
    }
  }


  static async addRole(req: any) {
    const { roleName, permissionId } = req.body;

    const data = AdminRole.build({
      name: roleName
    })
    await data.save();
    await Promise.all(permissionId.map(async (e: any) => {
      const permissionCheck = await AdminPermissions.findById(e);
      if (!permissionCheck) {
        throw new BadRequestError("Data not found");
      }
    }))
    await Promise.all(permissionId.map(async (e: any) => {
      const roleMappingData = AdminRoleMapping.build({
        roleId: data.id,
        permissionId: e
      });
      await roleMappingData.save();
    }))
    return data;
  }

  static async waitingListApprove(req:any){
    const {customerId,status}=req.body;
    const userCheck = await Customer.findById(customerId);
    if(userCheck){
      if(status == "Approved"){
       await Customer.findByIdAndUpdate(customerId,{status:status});
      }else if(status == "Rejected"){
        await Customer.findByIdAndDelete(customerId);
        //TODO Delete  
      }else{
        throw new BadRequestError("status is invalid");
      }
      return;
    }else{
      throw new BadRequestError('CustomerId is wrong');
    }
  }
}
