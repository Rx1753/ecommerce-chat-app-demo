import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express from 'express';
import { CartDomain } from '../domain/cart-domain';
import { verifyCustomerToken, verifyToken, verifyVendorToken } from '../middlewares/current-user';


const router = express.Router();

//ADMIN Middleware check pending

// cart create
router.post('/api/order/cart/create',verifyCustomerToken,validateRequest,CartDomain.createCart);

//cart delete
router.get('/api/order/cart/remove',verifyCustomerToken,CartDomain.removeCart);

// delete product from cart
router.get('/api/order/cart/removeproduct/:id',verifyCustomerToken,CartDomain.removeSignleCart);

// get all cart
router.get('/api/order/cart/get',verifyToken,CartDomain.getCart);



export { router as cartRouter };
