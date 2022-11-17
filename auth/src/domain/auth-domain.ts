import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';
import { AuthDatabaseLayer } from '../database-layer/auth-database';

export class AuthDomain {
  // SIGNUP
  static async signUp(req: Request, res: Response) {
    const { email } = req.body;
    const existingUser = await AuthDatabaseLayer.isExistingUser(email);
    if (existingUser) {
      throw new BadRequestError('Email In Use');
    }
    var user = await AuthDatabaseLayer.signUpUser(req);
    return res.status(201).send(user);
  }

  // SIGNIN
  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const exitstingUser = await AuthDatabaseLayer.isExistingUser(email);
    if (!exitstingUser) {
      throw new BadRequestError('Invalid email');
    }
    const passwordMatch = await AuthDatabaseLayer.checkPassword(
      exitstingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Invalid Password');
    }
    var jwtToken = await AuthDatabaseLayer.loginAndAccessToken(exitstingUser);
    // Store it on session object
    req.session = { jwt: jwtToken };
    return res.status(200).json({
      success: true,
      authorization: jwtToken,
      user: exitstingUser,
    });
  }

  // GET ALL USERS
  static async getAllUsers(req: Request, res: Response) {
    var users = await AuthDatabaseLayer.getAllUsers();
    res.status(200).send(users);
  }

  //Get Single user detail
  static async getUserById(req: Request, res: Response) {
    const user = await AuthDatabaseLayer.getUserById(req.params.id);
    if (!user) {
      throw new BadRequestError("User doesn't exist");
    }
    res.status(200).send(user);
  }

  //Delete user by Id
  static async deleteUserById(req: Request, res: Response) {
    const deletedCount = await AuthDatabaseLayer.deleteUserById(req.params.id);
    res.status(200).json({
      success: true,
      message: `Deleted a count of ${deletedCount} user.`,
    });
  }

  // SIGN-OUT
  static async signOut(req: Request, res: Response) {
    console.log('signOut-------');
    req.session = null;
    res.send({});
  }

  // CURRENT_USER
  static async currentUser(req: Request, res: Response) {
    res.send({ currentUser: req.currentUser || null });
  }
}
