import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { BusinessSubCategoryDomain } from '../domain/business-sub-category-domain';
import { BusinessSubCategoryValidation } from '../validations/business-sub-category-validation';

const router = express.Router();

//ADMIN Middleware check pending

// BusinessSubCategory create
router.post('/api/store/businesssubcategory/create',BusinessSubCategoryValidation.BusinessSubCategoryCreateValidation,validateRequest,BusinessSubCategoryDomain.createBusinessSubCategory);

// BusinessSubCategory update
router.put('/api/store/businesssubcategory/update/:id',BusinessSubCategoryValidation.BusinessSubCategoryCreateValidation,validateRequest,BusinessSubCategoryDomain.updateBusinessSubCategory)
 
// delete BusinessSubCategory
router.delete('/api/store/businesssubcategory/delete/:id',BusinessSubCategoryDomain.deleteBusinessSubCategory);

// get all BusinessSubCategory
router.get('/api/store/businesssubcategory/get',BusinessSubCategoryDomain.getBusinessSubCategoryList);

// get all BusinessSubCategory based on businessCategoryId
router.get('/api/store/businesssubcategory/getBusinessCategoryId/:id',BusinessSubCategoryDomain.getBusinessCategoryIdList);

export { router as BusinessSubCategoryRouter };
