import express, { Request, Response, Router } from 'express';
import { ProductItemDomain } from '../domain/product-item-domain';
import { ProductItemValidation } from '../validations/product-item-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Product create
router.post('/api/product/productitem/create',ProductItemValidation.ProductItemCreateValidation,ProductItemDomain.createProductItem);

// Product update
router.put('/api/product/productitem/update/:id',ProductItemDomain.updateProductItem)
 
// delete Product
router.delete('/api/product/productitem/delete/:id',ProductItemDomain.deleteProductItem);

// get all Product
router.get('/api/product/productitem/get',ProductItemDomain.getProductItemList);


export { router as ProductItemRouter };
