import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express from 'express';
import { StoreDomain } from '../domain/store-domain';
import { verifyToken, verifyVendorToken } from '../middlewares/current-user';
import { StoreValidation } from '../validations/store-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Store create
router.post('/api/store/create',verifyVendorToken,StoreValidation.StoreCreateValidation,validateRequest,StoreDomain.createStore);

// Store update
router.put('/api/store/update/:id',verifyVendorToken,StoreValidation.StoreUpdateValidation,validateRequest,StoreDomain.updateStore)
 
// delete Store
router.delete('/api/store/delete/:id',verifyVendorToken,StoreDomain.deleteStore);

// get all Store
router.get('/api/store/get/:id',verifyToken,StoreDomain.getStoreId);



export { router as StoreRouter };
