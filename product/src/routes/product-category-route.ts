import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { ProductCategoryDomain } from '../domain/product-category-domain';
import { verifyAdminToken } from '../middlewares/current-user';
import { ProductCategoryValidation } from '../validations/product-category-validation';

const router = express.Router();

//ADMIN Middleware check pending

// ProductCategory create
router.post('/api/product/productcategory/create',ProductCategoryValidation.ProductCategoryCreateValidation,verifyAdminToken,validateRequest,ProductCategoryDomain.createProductCategory);

// ProductCategory update
router.put('/api/product/productcategory/update/:id',ProductCategoryValidation.ProductCategoryUpdateValidation,verifyAdminToken,validateRequest,ProductCategoryDomain.updateProductCategory)
 
// delete ProductCategory
router.put('/api/product/productcategory/delete/:id',verifyAdminToken,ProductCategoryDomain.deleteProductCategory);

// get all ProductCategory
router.get('/api/product/productcategory/get',ProductCategoryDomain.getProductCategoryList);

router.get('/api/product/productcategory/getid/:id',ProductCategoryDomain.getProductCategoryId);
// get all ProductCategory based on businessCategoryId
router.get('/api/product/productcategory/getbusinesssubcategoryid/:id',ProductCategoryDomain.getBusinessCategoryIdList);

router.get('/api/product/productcategory/getactive',ProductCategoryDomain.getProductCategoryActiveList);

export { router as ProductCategoryRouter };
