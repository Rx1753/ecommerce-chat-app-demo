import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { ObjectId } from 'mongodb';
import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
import { AdminUser, AdminUserAttrs } from '../models/admin-user';
import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { PayloadType, Strings } from '../services/string-values';
import { invitionCode } from '../models/invition-code';
import {
  AdminPermissions,
  AdminPermissionsAttrs,
  AdminPermissionsDoc,
} from '../models/admin-permissions';
//Added by Ravina Panchal

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

  static async isExistingUser(email: string) {
    const existingUser = await AdminUser.findOne({ email });
    return existingUser;
  }

  static async findUserByActiveEmails(email: string) {
    const adminUser = await AdminUser.find({ email: email, isActive: true });
    if (adminUser.length > 0) {
      return adminUser[0];
    }
  }

  // Add new admin and trigger email with credentials // Update the isEmailverified after successful trigger
  static async signUpUser(
    data: AdminUserAttrs,
    createdBy: string,
    isSuperAdmin: boolean
  ) {
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
    user.isSuperAdmin = isSuperAdmin;
    user.createdBy = createdBy;
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

  static async updateAdminProfile(data: any, updatedBy: string) {
    const isUserExist = await this.getUserById(data.userId);
    if (isUserExist) {
      const adminUser = await AdminUser.findByIdAndUpdate(data.userId, {
        userName: data.userName,
        phone: data.phone,
        imageUrl: data.imageUrl,
        updatedBy: updatedBy,
      });
      return adminUser;
    } else {
      throw new BadRequestError("User does't exist");
    }
  }

  // verify active email & password on signin
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

  //Create Otp for Email/Phone MFA
  static async updateAdminMFA(req: any) {
    var data = req.body;
    const isUserExist = await this.getUserById(data.userId);
    if (
      isUserExist &&
      data.type == 'email' &&
      isUserExist.email !== data.value
    ) {
      throw new BadRequestError("enter user's current email id");
    } else if (
      isUserExist &&
      data.type == 'phoneNumber' &&
      isUserExist.phone !== (data.value as number)
    ) {
      console.log(
        `isUserExist.phone --- ${isUserExist.phone} :: value :: ${data.value}`
      );
      throw new BadRequestError("enter user's valid phone no");
    } else if (
      isUserExist &&
      (!isUserExist.isEmailVerified || !isUserExist.isMobileVerified)
    ) {
      await AdminUser.findByIdAndUpdate(data.userId, {
        isMfa: true,
        updatedBy: req.currentUser.id,
      });
      var currentOTP = await this.generateOtpForMFA(data);
      if (data.type === 'email') {
        // Trigger Email with OTP
      } else if (data.type === 'phoneNumber') {
        // Trigger SMS with OTP
      }
      return currentOTP;
    } else {
      if (isUserExist?.isEmailVerified && isUserExist?.isMobileVerified) {
        throw new BadRequestError('email & phone already verified');
      } else {
        throw new BadRequestError("User doesn't exist");
      }
    }
  }

  static async verifyEmail(data: any) {
    const isUserExist = await this.getUserById(data.userId);
    if (isUserExist && !isUserExist?.isEmailVerified) {
      var lastOtp = await this.getOtpOnType('email', data.userId);
      if (data.code != lastOtp) {
        throw new BadRequestError('Invalid OTP');
      } else {
        const adminUser = await AdminUser.findByIdAndUpdate(data.userId, {
          isMfa: true,
          isEmailVerified: true,
        });
      }
      return true;
    } else {
      if (isUserExist?.isEmailVerified) {
        throw new BadRequestError('email is already verified');
      } else {
        throw new BadRequestError("User doesn't exist");
      }
    }
  }

  static async verifyPhone(data: any) {
    const isUserExist = await this.getUserById(data.userId);
    if (isUserExist && !isUserExist.isMobileVerified) {
      var lastOtp = await this.getOtpOnType('phoneNumber', data.userId);
      if (data.code != lastOtp) {
        throw new BadRequestError('Invalid OTP');
      } else {
        const adminUser = await AdminUser.findByIdAndUpdate(data.userId, {
          isMfa: true,
          isMobileVerified: true,
        });
      }
      return true;
    } else {
      if (isUserExist?.isMobileVerified) {
        throw new BadRequestError('phone no is already verified');
      } else {
        throw new BadRequestError("User doesn't exist");
      }
    }
  }

  static async getOtpOnType(type: string, userId: string) {
    const data = await invitionCode.find({
      userId: userId,
      type: type,
    });
    if (data.length > 0) {
      console.log(`OTP :: ${data[0].code} // type :: ${data[0].type}`);
      return data[0].code;
    }
  }
  static async generateOTP() {
    // Declare a digits variable
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  static async generateOtpForMFA(data: any) {
    var type = data.type;
    var userId = data.userId;
    var otpCode = await this.generateOTP();
    var createOtp;

    const checkIfDataExist = await invitionCode.find({
      userId: userId,
      type: type,
    });

    if (type == 'email') {
      createOtp = invitionCode.build({
        type: type,
        email: data.value,
        code: otpCode,
        expirationDays: 1,
        userId: userId,
      });
    } else {
      createOtp = invitionCode.build({
        type: type,
        phoneNumber: data.value,
        code: otpCode,
        expirationDays: 1,
        userId: userId,
      });
    }

    if (checkIfDataExist.length > 0) {
      //Update new code for existing entry with type
      console.log(`Check Existing Entry :: ${checkIfDataExist[0]}`);
      await invitionCode.findByIdAndUpdate(checkIfDataExist[0].id, {
        type: type,
        email: type == 'email' ? data.value : '',
        phoneNumber: type == 'phoneNumber' ? data.value : null,
        code: otpCode,
        expirationDays: 1,
        userId: userId,
      });
    } else {
      await createOtp.save();
    }

    return otpCode;
  }
}
