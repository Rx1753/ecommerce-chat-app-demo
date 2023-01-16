import express, { Request, Response, Router } from 'express';
import {verifyCustomerToken} from '../middlewares/current-user';
import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import { CustomerDomain } from '../domain/customer-auth-domain';
import { CustomerAuthValidation } from '../validations/customer-auth-validation';

const router = express.Router();

// SIGN-UP
router.post('/api/users/customer/signup',CustomerAuthValidation.SignupValidation,validateRequest,CustomerDomain.signUp);

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

//User persnol info update
router.put('/api/users/customer/updateuser',verifyCustomerToken,CustomerDomain.updateUserInfo)
 
// CURRENT_USER
router.get('/api/users/customer/currentuser', verifyCustomerToken,CustomerDomain.currentLoginUser);

//MailTrigger for emailVerification
// router.get('/api/users/customer/mailverifytrigger',verifyCustomerToken,CustomerDomain.emailVerification);

//verify email code
router.post('/api/users/customer/mailverifycode',verifyCustomerToken,CustomerDomain.emailCodeVerification);

//forgot password mail trigger
router.post('/api/users/customer/forgotpassword/mailtrigger',CustomerDomain.forgotPasswordMailTrigger);

//forgot password with code verify
router.post('/api/users/customer/forgotpassword/codeverify',CustomerDomain.forgotPasswordCodeVerification);

// SIGN-OUT
router.post('/api/users/signout', 
// AuthDomain.signOut
);

router.get('/api/users/customer/setinvitecode/:status',CustomerDomain.inviteOnlyGenralSwitch );
router.get('/api/users/customer/getinvitecode',CustomerDomain.getInviteOnlyGenralSwitch );
router.get('/api/users/customer/generatereferalcode',CustomerDomain.generateReferalCode );

export { router as customerRouter };
