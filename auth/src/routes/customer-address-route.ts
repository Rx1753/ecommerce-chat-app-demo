import express, { Request, Response, Router } from 'express';
import { CustomerAddressDomain } from '../domain/customer-address-domain';
import {verifyCustomerToken} from '../middlewares/current-user';

const router = express.Router();

// address create
router.post('/api/users/customeraddress/create',verifyCustomerToken,CustomerAddressDomain.createAddress);

//User address update
router.put('/api/users/customeraddress/updateaddress/:id',verifyCustomerToken,CustomerAddressDomain.updateAddress)
 
// user delete address
router.delete('/api/users/customeraddress/delete/:id',verifyCustomerToken,CustomerAddressDomain.deleteAddress );

//user get all addres
router.get('/api/users/customeraddress/get',verifyCustomerToken,CustomerAddressDomain.getCurrentUserAddress);

export { router as customerAddressRouter };
