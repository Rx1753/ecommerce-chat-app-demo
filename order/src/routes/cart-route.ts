import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express from 'express';
import { CartDomain } from '../domain/cart-domain';
import { verifyCustomerToken, verifyToken, verifyVendorToken } from '../middlewares/current-user';


const router = express.Router();

//ADMIN Middleware check pending

// cart create
router.post('/api/order/cart/create',verifyCustomerToken,validateRequest,CartDomain.createCart);

// delete cart
router.get('/api/order/cart/remove',verifyCustomerToken,CartDomain.removeCart);

// get all cart
router.get('/api/order/cart/get',verifyToken,CartDomain.getCart);



export { router as cartRouter };
