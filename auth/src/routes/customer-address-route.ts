import express, { Request, Response, Router } from 'express';
import { CustomerAddressDomain } from '../domain/customer-address-domain';
import {currentUser} from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

// address create
router.post('/api/users/customeraddress/create',currentUser,CustomerAddressDomain.createAddress);

//User address update
router.put('/api/users/customeraddress/updateaddress/:id',currentUser,CustomerAddressDomain.updateAddress)
 
// user delete address
router.delete('/api/users/customeraddress/delete/:id',currentUser,CustomerAddressDomain.deleteAddress );

//user get all addres
router.get('/api/users/customeraddress/get',currentUser,CustomerAddressDomain.getCurrentUserAddress);

export { router as customerAddressRouter };
