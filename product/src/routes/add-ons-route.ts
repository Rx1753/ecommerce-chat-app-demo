import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { AddOnsDomain } from '../domain/add-ons-domain';
import { verifyToken } from '../middlewares/current-user';
import { AddOnsValidation } from '../validations/add-ons-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Product create
router.post('/api/product/addons/create',verifyToken,AddOnsValidation.AddOnsCreateValidation,validateRequest,AddOnsDomain.createAddOns);

// Product update
router.put('/api/product/addons/update/:id',verifyToken,AddOnsDomain.updateAddOns)
 
// delete Product
router.delete('/api/product/addons/delete/:id',verifyToken,AddOnsDomain.deleteAddOns);

// get all Product
router.get('/api/product/addons/get',AddOnsDomain.getAddOnsList);

//get product item list based on productId
router.get('/api/product/addons/getproduct/:id',AddOnsDomain.getAddOnsListProductId);


export { router as AddOnsRouter };
