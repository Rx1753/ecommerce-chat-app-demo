import express, { Request, Response, Router } from 'express';
import { ProductSubCategoryDomain } from '../domain/product-sub-category-domain';
import { ProductSubCategoryValidation } from '../validations/product-sub-category-validation';

const router = express.Router();

//ADMIN Middleware check pending

// ProductSubCategory create
router.post('/api/product/productsubcategory/create',ProductSubCategoryValidation.ProductSubCategoryCreateValidation,ProductSubCategoryDomain.createProductSubCategory);

// ProductSubCategory update
router.put('/api/product/productsubcategory/update/:id',ProductSubCategoryValidation.ProductSubCategoryCreateValidation,ProductSubCategoryDomain.updateProductSubCategory)
 
// delete ProductSubCategory
router.delete('/api/product/productsubcategory/delete/:id',ProductSubCategoryDomain.deleteProductSubCategory);

// get all ProductSubCategory
router.get('/api/product/productsubcategory/get',ProductSubCategoryDomain.getProductSubCategoryList);

// get all ProductSubCategory based on businessCategoryId
router.get('/api/product/productsubcategory/getbusinesssubcategoryid/:id',ProductSubCategoryDomain.getProductCategoryIdList);

export { router as ProductSubCategoryRouter };
