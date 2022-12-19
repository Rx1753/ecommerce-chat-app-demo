import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { BusinessSubCategoryDomain } from '../domain/business-sub-category-domain';
import { verifyAdminToken } from '../middlewares/current-user';
import { BusinessSubCategoryValidation } from '../validations/business-sub-category-validation';

const router = express.Router();

//ADMIN Middleware check pending

// BusinessSubCategory create
router.post('/api/store/businesssubcategory/create',BusinessSubCategoryValidation.BusinessSubCategoryCreateValidation,verifyAdminToken,validateRequest,BusinessSubCategoryDomain.createBusinessSubCategory);

// BusinessSubCategory update
router.put('/api/store/businesssubcategory/update/:id',BusinessSubCategoryValidation.BusinessSubCategoryUpdateValidation,verifyAdminToken,validateRequest,BusinessSubCategoryDomain.updateBusinessSubCategory)
 
// delete BusinessSubCategory
router.put('/api/store/businesssubcategory/delete/:id',verifyAdminToken,BusinessSubCategoryDomain.deleteBusinessSubCategory);

// get all BusinessSubCategory
router.get('/api/store/businesssubcategory/get',BusinessSubCategoryDomain.getBusinessSubCategoryList);

// get all BusinessSubCategory
router.get('/api/store/businesssubcategory/getid/:id',BusinessSubCategoryDomain.getBusinessSubCategoryId);

// get active businessSubCategoryList with active status code
router.get('/api/store/businesssubcategory/getactive',BusinessSubCategoryDomain.getBusinessSubCategoryActiveList);

// get all BusinessSubCategory based on businessCategoryId
router.get('/api/store/businesssubcategory/getBusinessCategoryId/:id',BusinessSubCategoryDomain.getBusinessCategoryIdList);

export { router as BusinessSubCategoryRouter };
