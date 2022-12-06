import express, { Request, Response, Router } from 'express';
import { BusinessSubCategoryDomain } from '../domain/business-sub-category-domain';

const router = express.Router();

//ADMIN Middleware check pending

// BusinessSubCategory create
router.post('/api/store/businesssubcategory/create',BusinessSubCategoryDomain.createBusinessSubCategory);

// BusinessSubCategory update
router.put('/api/store/businesssubcategory/update/:id',BusinessSubCategoryDomain.updateBusinessSubCategory)
 
// delete BusinessSubCategory
router.delete('/api/store/businesssubcategory/delete/:id',BusinessSubCategoryDomain.deleteBusinessSubCategory);

// get all BusinessSubCategory
router.get('/api/store/businesssubcategory/get',BusinessSubCategoryDomain.getBusinessSubCategoryList);

export { router as BusinessSubCategoryRouter };
