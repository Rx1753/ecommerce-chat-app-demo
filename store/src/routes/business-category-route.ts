import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { BusinessCategoryDomain } from '../domain/business-category-domain';
import { verifyAdminToken } from '../middlewares/current-user';
import { BusinessCategoryValidation } from '../validations/business-category-validation';

const router = express.Router();

//ADMIN Middleware check pending

// businesscategory create
router.post('/api/store/businesscategory/create',BusinessCategoryValidation.BusinessCategoryCreateValidation,verifyAdminToken,validateRequest,BusinessCategoryDomain.createBusinessCategory);

// businesscategory update
router.put('/api/store/businesscategory/update/:id',BusinessCategoryValidation.BusinessCategoryUpdateValidation,verifyAdminToken,validateRequest,BusinessCategoryDomain.updateBusinessCategory)
 
// delete businesscategory
router.put('/api/store/businesscategory/delete/:id',verifyAdminToken,BusinessCategoryDomain.deleteBusinessCategory);

// get all businesscategory
router.get('/api/store/businesscategory/get',BusinessCategoryDomain.getBusinessCategoryList);

// get businesscategoryId
router.get('/api/store/businesscategory/getid/:id',BusinessCategoryDomain.getBusinessCategoryId);

router.get('/api/store/businesscategory/getactive',BusinessCategoryDomain.getBusinessCategoryActiveList);

export { router as BusinessCategoryRouter };
