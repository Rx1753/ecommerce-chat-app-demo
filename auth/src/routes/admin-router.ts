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
router.post('/api/users/admin/login',AuthDomain.signIn);

//add user
router.post('/api/users/addadmin',verifyAdminToken,validateRequest,AuthDomain.addAdmin);

// CURRENT_USER
router.get('/api/users/admin/currentuser', verifyAdminToken,validateRequest, AuthDomain.currentUser);
// /*
// Require Auth Verification
// */
//All User List
router.get('/api/users/getalladmin', AuthDomain.getAllUsers);

//Single User Detail
router.get('/api/users/admin/:id', AuthDomain.getUserById);

//Delete Single User
router.delete('/api/users/admin/:id',verifyAdminToken,validateRequest, AuthDomain.deleteUserById);

// SIGN-OUT
router.post('/api/users/admin/signout', AuthDomain.signOut);


export { router as adminAuthRouter };
