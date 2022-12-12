import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { ProductItemDomain } from '../domain/product-item-domain';
import { verifyToken } from '../middlewares/current-user';
import { ProductItemValidation } from '../validations/product-item-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Product create
router.post('/api/product/productitem/create',verifyToken,ProductItemValidation.ProductItemCreateValidation,validateRequest,ProductItemDomain.createProductItem);

// Product update
router.put('/api/product/productitem/update/:id',verifyToken,ProductItemDomain.updateProductItem)
 
// delete Product
router.delete('/api/product/productitem/delete/:id',verifyToken,ProductItemDomain.deleteProductItem);

// get all Product
router.get('/api/product/productitem/get',ProductItemDomain.getProductItemList);

//get product item list based on productId
router.get('/api/product/productitem/getproduct/:id',ProductItemDomain.getProductItemListProductId);


export { router as ProductItemRouter };
