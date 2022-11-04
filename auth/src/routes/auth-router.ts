import express, { Request, Response, Router } from 'express';
import { currentUser, validateRequest, requireAuth } from '@rx-ecommerce-chat/common_lib';
import { body, check } from 'express-validator';
import { AuthDomain } from '../domain/auth-domain';

const router = express.Router();

// SIGN-UP
router.post(
  '/api/users/signup',
  [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a first name.'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a last name.'),
    body('type').trim().notEmpty().withMessage('Type can not be empty'),
    body('email').isEmail().withMessage('email must be valid -----'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 and 20 characters ----'),
  ],
  validateRequest,
  AuthDomain.signUp
);

// SIGN-IN
router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email Must Be Valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You Must supply a password'),
  ],
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
