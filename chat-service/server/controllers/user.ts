// utils
//import makeValidation from '@withvoid/make-validation';
// models
import { User, USER_TYPES } from '../models/User';
import express, { Request, Response } from 'express';

export default {
  onGetAllUsers: async (req: any, res: any) => {
    try {
      const users = await User.getUsers();
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onGetUserById: async (req: any, res: any) => {
    try {
      const user = await User.getUserById(req.params.id);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onCreateUser: async (req: Request, res: Response) => {
    try {
      // const validation = makeValidation(types => ({
      //   payload: req.body,
      //   checks: {
      //     firstName: { type: types.string },
      //     lastName: { type: types.string },
      //     type: { type: types.enum, options: { enum: USER_TYPES } },
      //   }
      // }));

      // if (!validation.success) return res.status(400).json({ ...validation });
      const { firstName, lastName, type, email, password } = req.body;
      const user = await User.createUser(
        firstName,
        lastName,
        type,
        email,
        password
      );
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(`User Created ERROR---> ${error}`);
      return res.status(500).json({ success: false, error: error });
    }
  },
  onDeleteUserById: async (req: any, res: any) => {
    try {
      const user = await User.deleteByUserById(req.params.id);
      return res.status(200).json({
        success: true,
        message: `Deleted a count of ${user.deletedCount} user.`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};
