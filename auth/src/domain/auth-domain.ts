import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';

export class AuthDomain {
  // SIGNUP
  static async signUp(req: Request, res: Response) {
    const { firstName, lastName, type, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email In Use');
    }

    const user = User.build({ firstName, lastName, type, email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
      // {expiresIn: '10s'}
    );

    // Store it on session object
    req.session = { jwt: userJwt };
    return res.status(201).send(user);
  }

  // SIGNIN
  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const exitstingUser = await User.findOne({ email });
    if (!exitstingUser) {
      throw new BadRequestError('Invalid email');
    }
    const passwordMatch = await Password.compare(
      exitstingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Password');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: exitstingUser.id,
        email: exitstingUser.email,
      },
      process.env.JWT_KEY!
      //{expiresIn: '10s'}
    );

    // Store it on session object
    req.session = { jwt: userJwt };
    return res.status(200).json({
      success: true,
      authorization: userJwt,
      user: exitstingUser,
    });
  }

  // GET ALL USERS
  static async getAllUsers(req: Request, res: Response) {
    const users = await User.find();
    res.status(200).send(users);
  }

  //Get Single user detail
  static async getUserById(req: Request, res: Response) {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      throw new BadRequestError("User doesn't exist");
    }
    res.status(200).send(user);
  }

  //Delete user by Id
  static async deleteUserById(req: Request, res: Response) {
    const user = await User.remove({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: `Deleted a count of ${user.deletedCount} user.`,
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
