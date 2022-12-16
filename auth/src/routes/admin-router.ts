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
router.post('/api/users/admin/login', Validation.signInValidation, validateRequest, AuthDomain.signIn);

//add user
router.post('/api/users/admin/addadmin', Validation.addAdminValidation, verifyAdminToken, validateRequest, AuthDomain.addAdmin);

// CURRENT_USER
router.get('/api/users/admin/currentuser', verifyAdminToken, validateRequest, AuthDomain.currentUser);

//Delete Single User
router.put('/api/users/admin/statuschange/:id', verifyAdminToken, validateRequest, AuthDomain.statusChangeId);

// /*
// Require Auth Verification
// */


//All User List
router.post('/api/users/admin/forgotpassword/mailtrigger', Validation.forgotPasswordValidation, validateRequest, AuthDomain.forgotPassword);

router.post('/api/users/admin/forgotpassword/codeverify', Validation.forgotCodeValidation, validateRequest, AuthDomain.forgotPasswordCodeVerification);

router.put('/api/users/admin/updatepermission', Validation.updateRoleValidation, verifyAdminToken, validateRequest, AuthDomain.updateAdminRoles);

router.get('/api/users/admin/getalladmin', AuthDomain.getAllUsers);

//Single User Detail
router.get('/api/users/admin/getadmindetail/:id', AuthDomain.getUserById);

// SIGN-OUT
router.post('/api/users/admin/signout', AuthDomain.signOut);

//get admin by name serch
router.get('/api/users/admin/getadminbyname/:name', AuthDomain.getAdminByName);



export { router as adminAuthRouter };
