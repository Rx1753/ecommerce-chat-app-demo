import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express from 'express';
import { CartDomain } from '../domain/cart-domain';
import { verifyCustomerToken, verifyToken, verifyVendorToken } from '../middlewares/current-user';
import { CartValidation } from "../validations/cart-validation";

const router = express.Router();

// cart create
router.post('/api/order/cart/create',verifyCustomerToken,CartValidation.CartCreateValidation,validateRequest,CartDomain.createCart);

//cart delete
router.post('/api/order/cart/remove',verifyCustomerToken,CartDomain.removeCart);


router.put('/api/order/cart/remove/product',verifyCustomerToken,CartDomain.removeProductCart);

// delete product from cart
router.post('/api/order/cart/removeproduct/:id',verifyCustomerToken,CartDomain.removeSignleCart);

// get all cart
router.get('/api/order/cart/get',verifyToken,CartDomain.getCart);



export { router as cartRouter };
