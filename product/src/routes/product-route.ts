import express, { Request, Response, Router } from 'express';
import { ProductDomain } from '../domain/product-domain';
import { ProductValidation } from '../validations/product-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Product create
router.post('/api/product/create',ProductValidation.ProductCreateValidation,ProductDomain.createProduct);

// Product update
router.put('/api/product/update/:id',ProductDomain.updateProduct)
 
// delete Product
router.delete('/api/product/delete/:id',ProductDomain.deleteProduct);

// get all Product
router.get('/api/product/get',ProductDomain.getProductList);

// get all Product based on businessId
router.get('/api/product/getproductsubcategory/:id',ProductDomain.getProductSubCategoryIdList);

export { router as ProductRouter };
