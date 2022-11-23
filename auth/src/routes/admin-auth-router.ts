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
router.post('/api/admin/permissions', AuthDomain.addPermissions);

// SIGN-UP Super Admin
router.post(
  '/api/admin/signup/superAdmin',
  Validation.signUpValidation,
  validateRequest,
  AuthDomain.signUpSuperAdmin
);

// SIGN-UP Admin
router.post(
  '/api/admin/signup',
  verifyAdminToken,
  Validation.signUpValidation,
  validateRequest,
  AuthDomain.signUpAdmin
);

// SIGN-IN
router.post(
  '/api/admin/signin',
  Validation.signInValidation,
  validateRequest,
  AuthDomain.signIn
);

// Update Profile
router.post(
  '/api/admin/updateProfile',
  verifyAdminToken,
  Validation.updateProfileValidation,
  validateRequest,
  AuthDomain.updateProfile
);

// MFA check
router.post(
  '/api/admin/mfa',
  verifyAdminToken,
  Validation.mfaValidation,
  validateRequest,
  AuthDomain.checkMFA
);

router.post(
  '/api/admin/verifyEmail',
  verifyAdminToken,
  Validation.verifyEmail,
  validateRequest,
  AuthDomain.verifyEmail
);

router.post(
  '/api/admin/verifyPhone',
  verifyAdminToken,
  Validation.verifyPhone,
  validateRequest,
  AuthDomain.verifyPhone
);

// /*
// Require Auth Verification
// */
//All User List
router.get('/api/admin/getAllUsers', verifyAdminToken, AuthDomain.getAllUsers);

//Single User Detail
router.get('/api/admin/user/:id', verifyAdminToken, AuthDomain.getUserById);

//Delete Single User
router.delete(
  '/api/admin/user/:id',
  verifyAdminToken,
  AuthDomain.deleteUserById
);

// SIGN-OUT
router.post('/api/admin/signout', verifyAdminToken, AuthDomain.signOut);

// CURRENT_USER
router.get('/api/admin/currentuser', verifyAdminToken, AuthDomain.currentUser);

export { router as adminAuthRouter };
