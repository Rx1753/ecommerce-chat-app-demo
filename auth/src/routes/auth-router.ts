import express, { Request, Response, Router } from 'express';
import {
  //currentUser,
  validateRequest,
  //requireAuth,
} from '@rx-ecommerce-chat/common_lib';
import { currentUser } from '../middlewares/current-user';
import { AuthDomain } from '../domain/auth-domain';
import { Validation } from '../validations/validation';

const router = express.Router();

// SIGN-UP
router.post('/api/users/signup', Validation.signUpValidation,validateRequest, AuthDomain.signUp);

// SIGN-IN
router.post(
  '/api/users/signin',
  Validation.signInValidation,
  validateRequest,
  AuthDomain.signIn
);

/*
Require Auth Verification
*/
//All User List
router.get('/api/users/getAllUsers', AuthDomain.getAllUsers);

// //Single User Detail
router.get('/api/users/user/:id', AuthDomain.getUserById);

// //Delete Single User
router.delete('/api/users/user/:id', AuthDomain.deleteUserById);

// SIGN-OUT
router.post('/api/users/signout', AuthDomain.signOut);

// CURRENT_USER
router.get('/api/users/currentuser', currentUser, AuthDomain.currentUser);

export { router as authRouter };
