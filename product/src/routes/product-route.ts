import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { ProductDomain } from '../domain/product-domain';
import { verifyToken } from '../middlewares/current-user';
import { ProductValidation } from '../validations/product-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Product create
router.post('/api/product/create',verifyToken,ProductValidation.ProductCreateValidation,validateRequest,ProductDomain.createProduct);

// Product update
router.put('/api/product/update/:id',verifyToken,ProductDomain.updateProduct)
 
// delete Product
router.delete('/api/product/delete/:id',verifyToken,ProductDomain.deleteProduct);

// get all Product
router.get('/api/product/get',ProductDomain.getProductList);

// get all Product based on businessId
router.get('/api/product/getproductsubcategory/:id',ProductDomain.getProductSubCategoryIdList);
router.get('/api/product/getproductwithaddonsandproductitem',ProductDomain.getProductWithAddOnsAndProductItem);

export { router as ProductRouter };
