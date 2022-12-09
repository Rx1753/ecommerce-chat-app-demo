import express, { Request, Response, Router } from 'express';
import { ProductCategoryDomain } from '../domain/product-category-domain';
import { ProductCategoryValidation } from '../validations/product-category-validation';

const router = express.Router();

//ADMIN Middleware check pending

// ProductCategory create
router.post('/api/product/productcategory/create',ProductCategoryValidation.ProductCategoryCreateValidation,ProductCategoryDomain.createProductCategory);

// ProductCategory update
router.put('/api/product/productcategory/update/:id',ProductCategoryValidation.ProductCategoryCreateValidation,ProductCategoryDomain.updateProductCategory)
 
// delete ProductCategory
router.delete('/api/product/productcategory/delete/:id',ProductCategoryDomain.deleteProductCategory);

// get all ProductCategory
router.get('/api/product/productcategory/get',ProductCategoryDomain.getProductCategoryList);

// get all ProductCategory based on businessCategoryId
router.get('/api/product/productcategory/getbusinesssubcategoryid/:id',ProductCategoryDomain.getBusinessCategoryIdList);

export { router as ProductCategoryRouter };
