import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express from 'express';
import { StoreDomain } from '../domain/store-domain';
import { verifyAdminToken, verifyToken, verifyVendorToken } from '../middlewares/current-user';
import { StoreValidation } from '../validations/store-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Store create
router.post('/api/store/create',verifyVendorToken,StoreValidation.StoreCreateValidation,validateRequest,StoreDomain.createStore);

// Store update
router.put('/api/store/update/:id',verifyVendorToken,StoreValidation.StoreUpdateValidation,validateRequest,StoreDomain.updateStore)
 
// delete Store
router.delete('/api/store/delete/:id',verifyAdminToken,StoreDomain.deleteStore);

// get all Store
router.get('/api/store/get',StoreDomain.getStore);
router.get('/api/store/getactive',StoreDomain.getActiveStore);
router.get('/api/store/getdeactive',StoreDomain.getDeactiveStore);
router.get('/api/store/get/:id',StoreDomain.getStoreId);



export { router as StoreRouter };
