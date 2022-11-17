import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { ObjectId } from 'mongodb';
import { JwtService } from '../services/jwt';
import { Password } from '../services/password';
import { User } from '../models/user';
import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

export class AuthDatabaseLayer {
  static async isExistingUser(email: String) {
    const existingUser = await User.findOne({ email });
    return existingUser;
  }

  static async signUpUser(req: any) {
    const { firstName, lastName, type, email, password } = req.body;
    const user = User.build({ firstName, lastName, type, email, password });
    await user.save();
    var payload = {
      id: user.id,
      email: user.email,
      type: user.type,
    };
    var userJwt = await JwtService.accessToken(payload);
    // Store it on session object
    req.session = { jwt: userJwt };
    await new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: user.type,
    });
    return user;
  }

  static async checkPassword(existingPassword: string, password: string) {
    return await Password.compare(existingPassword, password);
  }

  static async loginAndAccessToken(existingUser: any) {
    var payload = {
      id: existingUser.id,
      email: existingUser.email,
      type: existingUser.type,
    };
    var userJwt = await JwtService.accessToken(payload);
    return userJwt;
  }

  static async getAllUsers() {
    return await User.find();
  }

  static async getUserById(id: any) {
    var data = await User.findOne({ _id: id });
    return data;
  }

  static async deleteUserById(id: string) {
    const user = await User.remove({ _id: id });
    return user.deletedCount;
  }
}
