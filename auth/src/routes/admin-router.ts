import express, { Request, Response, Router } from 'express';
import {
  //currentUser,
  validateRequest,
  //requireAuth,
} from '@rx-ecommerce-chat/common_lib';
import { AuthDomain } from '../domain/admin-auth-domain';
import { Validation } from '../validations/admin-validation';
import { verifyAdminToken } from '../middlewares/current-user';

const router = express.Router();

// SIGN-IN
router.post('/api/users/admin/login',Validation.signInValidation,validateRequest,AuthDomain.signIn);

//add user
router.post('/api/users/addadmin',Validation.addAdminValidation,verifyAdminToken,validateRequest,AuthDomain.addAdmin);

// CURRENT_USER
router.get('/api/users/admin/currentuser', verifyAdminToken,validateRequest, AuthDomain.currentUser);
// /*
// Require Auth Verification
// */
//All User List
router.post('/api/users/admin/forgotpassword/mailtrigger',Validation.forgotPasswordValidation,validateRequest,AuthDomain.forgotPassword);

router.post('/api/users/admin/forgotpassword/codeverify',Validation.forgotCodeValidation,validateRequest,AuthDomain.forgotPasswordCodeVerification);

router.get('/api/users/getalladmin', AuthDomain.getAllUsers);

//Single User Detail
router.get('/api/users/admin/:id', AuthDomain.getUserById);

//Delete Single User
router.put('/api/users/admin/status/:id',verifyAdminToken,validateRequest, AuthDomain.statusChangeId);

// SIGN-OUT
router.post('/api/users/admin/signout', AuthDomain.signOut);

//get admin by name serch
router.get('/api/users/admin/getadminbyname/:name',AuthDomain.getAdminByName);



export { router as adminAuthRouter };
