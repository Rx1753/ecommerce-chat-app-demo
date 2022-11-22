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

// Add permissions
router.post('/api/admin/permissions',AuthDomain.addPermissions);

// SIGN-UP
router.post('/api/admin/signup',verifyAdminToken,Validation.signUpValidation,validateRequest,AuthDomain.signUp);

// SIGN-IN
router.post('/api/admin/signin',Validation.signInValidation,validateRequest,AuthDomain.signIn);

// Update Profile
//router.post('/api/users/updateProfile',verifyAdminToken,AuthDomain.updateProfile);


// /*
// Require Auth Verification
// */
//All User List
router.get('/api/admin/getAllUsers', AuthDomain.getAllUsers);

//Single User Detail
router.get('/api/admin/user/:id', AuthDomain.getUserById);

//Delete Single User
router.delete('/api/admin/user/:id', AuthDomain.deleteUserById);

// SIGN-OUT
router.post('/api/admin/signout', AuthDomain.signOut);

// CURRENT_USER
router.get('/api/admin/currentuser', verifyAdminToken, AuthDomain.currentUser);

export { router as adminAuthRouter };
