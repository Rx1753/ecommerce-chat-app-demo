import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { BusinessCategoryDomain } from '../domain/business-category-domain';
import { BusinessCategoryValidation } from '../validations/business-category-validation';

const router = express.Router();

//ADMIN Middleware check pending

// businesscategory create
router.post('/api/store/businesscategory/create',BusinessCategoryValidation.BusinessCategoryCreateValidation,validateRequest,BusinessCategoryDomain.createBusinessCategory);

// businesscategory update
router.put('/api/store/businesscategory/update/:id',BusinessCategoryValidation.BusinessCategoryCreateValidation,validateRequest,BusinessCategoryDomain.updateBusinessCategory)
 
// delete businesscategory
router.delete('/api/store/businesscategory/delete/:id',BusinessCategoryDomain.deleteBusinessCategory);

// get all businesscategory
router.get('/api/store/businesscategory/get',BusinessCategoryDomain.getBusinessCategoryList);

export { router as BusinessCategoryRouter };
