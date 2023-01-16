import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { ProductDomain } from '../domain/product-domain';
import { ProductWhishlistDomain } from '../domain/product-whislist-domain';
import { verifyCustomerToken, verifyToken } from '../middlewares/current-user';
import { ProductWhislistValidation } from '../validations/product-whislist-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Product create
router.post('/api/product/whislist/create',verifyCustomerToken,ProductWhislistValidation.ProductWhislistCreateValidation,validateRequest,ProductWhishlistDomain.createProductWhishlist);

// delete Product
router.delete('/api/product/whislist/delete/:id',verifyCustomerToken,ProductWhishlistDomain.deleteProductWhishlist);

// get all Product
router.get('/api/product/whislist/get',verifyCustomerToken,ProductWhishlistDomain.getProductWhishlistList);

// // get all Product based on businessId
// router.get('/api/product/getproductsubcategory/:id',ProductDomain.getProductSubCategoryIdList);
// router.get('/api/product/getproductwithaddonsandproductitem',ProductDomain.getProductWithAddOnsAndProductItem);

export { router as ProductWhishlistRouter };
