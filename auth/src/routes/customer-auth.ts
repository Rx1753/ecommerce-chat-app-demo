import express, { Request, Response, Router } from 'express';
import {currentUser} from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';
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

//User persnol info update
router.put('/api/users/customer/updateuser',currentUser,CustomerDomain.updateUserInfo)
 
// CURRENT_USER
router.get('/api/users/customer/currentuser', currentUser,CustomerDomain.currentLoginUser);

// SIGN-OUT
router.post('/api/users/signout', 
// AuthDomain.signOut
);

router.get('/api/users/customer/setinvitecode/:status',CustomerDomain.inviteOnlyGenralSwitch );
router.get('/api/users/customer/generatereferalcode',CustomerDomain.generateReferalCode );

export { router as customerRouter };
