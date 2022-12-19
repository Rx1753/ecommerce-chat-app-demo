import express, { Request, Response, Router } from 'express';
import {verifyAdminToken, verifyCustomerToken, verifyToken, verifyVendorToken} from '../middlewares/current-user';
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
router.get('/api/users/businessuser/getallactiveusers', BusinessDomain.getAllActiveUsers);
router.get('/api/users/businessuser/getalldeactiveusers', BusinessDomain.getAllDeActiveUsers);

//Single User Detail
router.get('/api/users/businessuser/getuserbyid/:id', BusinessDomain.getUserById);

//Delete Single User
router.put('/api/users/businessuser/delete/:id',verifyAdminToken,validateRequest, BusinessDomain.deleteUserById);

//User by name
router.get('/api/users/businessuser/getuserbyname/:name',BusinessDomain.getUserByName)

//User persnol info update
router.put('/api/users/businessuser/updateuser',verifyVendorToken,BusinessDomain.updateUserInfo)
 
// CURRENT_USER
router.get('/api/users/businessuser/currentuser', verifyToken,BusinessDomain.currentLoginUser);

//MailTrigger for emailVerification
router.get('/api/users/businessuser/mailverifytrigger',verifyVendorToken,BusinessDomain.emailVerification);

//verify email code
router.post('/api/users/businessuser/mailverifycode',verifyVendorToken,BusinessDomain.emailCodeVerification);

//forgot password mail trigger
router.get('/api/users/businessuser/forgotpassword/mailtrigger',verifyVendorToken,BusinessDomain.forgotPasswordMailTrigger);

//forgot password with code verify
router.post('/api/users/businessuser/forgotpassword/codeverify',verifyVendorToken,BusinessDomain.forgotPasswordCodeVerification);

//add user
router.post('/api/users/businessuser/adduser',verifyVendorToken,BusinessDomain.createUser);

//getuser and thier roles
router.get('/api/users/businessuser/getuserrole/:id',BusinessDomain.userGetWithThirRoles);

//get user roles based on id 
router.get('/api/users/businessuser/role/:id',BusinessDomain.roleMapping);
// SIGN-OUT
router.post('/api/users/signout', 
// AuthDomain.signOut
);


export { router as BusinessUserRouter };
