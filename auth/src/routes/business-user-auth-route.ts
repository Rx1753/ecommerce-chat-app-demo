import express, { Request, Response, Router } from 'express';
import {verifyCustomerToken} from '../middlewares/current-user';
import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import { BusinessUserAuthValidation } from "../validations/business-user-auth-validation";
import { BusinessDomain } from '../domain/business-user-auth-domain';
const router = express.Router();

// SIGN-UP
router.post('/api/users/businessuser/signup',BusinessUserAuthValidation.SignupValidation,validateRequest,BusinessDomain.signUp);

// SIGN-IN
router.post('/api/users/businessuser/signin',BusinessUserAuthValidation.signInValidation,validateRequest,BusinessDomain.signIn);
  
//All User List
router.get('/api/users/businessuser/getallusers', BusinessDomain.getAllUsers);

//Single User Detail
router.get('/api/users/businessuser/getuserbyid/:id', BusinessDomain.getUserById);

//Delete Single User
router.get('/api/users/businessuser/delete/:id', BusinessDomain.deleteUserById);

//User by name
router.get('/api/users/businessuser/getuserbyname/:name',BusinessDomain.getUserByName)

//User persnol info update
router.put('/api/users/businessuser/updateuser',verifyCustomerToken,BusinessDomain.updateUserInfo)
 
// CURRENT_USER
router.get('/api/users/businessuser/currentuser', verifyCustomerToken,BusinessDomain.currentLoginUser);

//MailTrigger for emailVerification
router.get('/api/users/businessuser/mailverifytrigger',verifyCustomerToken,BusinessDomain.emailVerification);

//verify email code
router.post('/api/users/businessuser/mailverifycode',verifyCustomerToken,BusinessDomain.emailCodeVerification);

//forgot password mail trigger
router.get('/api/users/businessuser/forgotpassword/mailtrigger',verifyCustomerToken,BusinessDomain.forgotPasswordMailTrigger);

//forgot password with code verify
router.post('/api/users/businessuser/forgotpassword/codeverify',verifyCustomerToken,BusinessDomain.forgotPasswordCodeVerification);

// SIGN-OUT
router.post('/api/users/signout', 
// AuthDomain.signOut
);


export { router as BusinessUserRouter };
