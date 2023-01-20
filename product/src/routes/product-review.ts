import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { ProductReviewDomain } from '../domain/product-review-domain';
import { verifyCustomerToken, verifyToken } from '../middlewares/current-user';
const router = express.Router();

//ADMIN Middleware check pending

// Product create
router.post('/api/product/review/create',verifyCustomerToken,validateRequest,ProductReviewDomain.createProductReview);

// delete Product
router.delete('/api/product/review/delete/:id',verifyCustomerToken,ProductReviewDomain.deleteProductReview);

// get all Product
router.get('/api/product/review/get',verifyCustomerToken,ProductReviewDomain.getProductReviewList);

// // get all Product based on businessId
// router.get('/api/product/getproductsubcategory/:id',ProductDomain.getProductSubCategoryIdList);
// router.get('/api/product/getproductwithaddonsandproductitem',ProductDomain.getProductWithAddOnsAndProductItem);

export { router as ProductReviewRouter };
