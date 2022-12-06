import express, { Request, Response, Router } from 'express';
import { BusinessCategoryDomain } from '../domain/business-category-domain';

const router = express.Router();

//ADMIN Middleware check pending

// businesscategory create
router.post('/api/store/businesscategory/create',BusinessCategoryDomain.createBusinessCategory);

// businesscategory update
router.put('/api/store/businesscategory/update/:id',BusinessCategoryDomain.updateBusinessCategory)
 
// delete businesscategory
router.delete('/api/store/businesscategory/delete/:id',BusinessCategoryDomain.deleteBusinessCategory);

// get all businesscategory
router.get('/api/store/businesscategory/get',BusinessCategoryDomain.getBusinessCategoryList);

export { router as BusinessCategoryRouter };
