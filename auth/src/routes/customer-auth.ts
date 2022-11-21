import express, { Request, Response, Router } from 'express';
import {currentUser} from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';
import { requireAuth } from '../middlewares/require-auth';
import { body, check } from 'express-validator';
import { CustomerDomain } from '../domain/customer-auth-domain';
import { CustomerAuthValidation } from '../validations/customer-auth-validation';

const router = express.Router();

// SIGN-UP
router.post('/api/users/customer/signup',CustomerAuthValidation.SigninValidation,validateRequest,CustomerDomain.signUp);

// SIGN-IN
router.post('/api/users/customer/signin',CustomerAuthValidation.signInValidation,validateRequest,CustomerDomain.signIn);
  
//All User List
router.get('/api/users/customer/getallusers', CustomerDomain.getAllUsers);

//Single User Detail
router.get('/api/users/customer/getuserbyid/:id', CustomerDomain.getUserById);

//Delete Single User
router.get('/api/users/customer/delete/:id', CustomerDomain.deleteUserById);

//User by name
router.get('/api/users/customer/getuserbyname/:name',CustomerDomain.getUserByName)


// SIGN-OUT
router.post('/api/users/signout', 
// AuthDomain.signOut
);
 
// CURRENT_USER
// router.get('/api/users/currentuser', currentUser,CustomerDomain.currentUser);
 

router.get('/api/users/customer/setinvitecode/:status',CustomerDomain.inviteOnlyGenralSwitch );
router.get('/api/users/customer/generatereferalcode',CustomerDomain.generateReferalCode );

export { router as customerRouter };
