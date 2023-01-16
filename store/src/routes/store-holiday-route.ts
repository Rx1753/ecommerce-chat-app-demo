import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express from 'express';
import { StoreHolidayDomain } from '../domain/store-holiday-domain';
import { verifyToken, verifyVendorToken } from '../middlewares/current-user';
import { StoreHolidayValidation } from '../validations/store-holiday-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Store create
router.post('/api/store/storeholiday/create',verifyVendorToken,StoreHolidayValidation.StoreHolidayCreateValidation,validateRequest,StoreHolidayDomain.createStoreHoliday);

// Store update
router.put('/api/store/storeholiday/update/:id',verifyVendorToken,StoreHolidayValidation.StoreHolidayUpdateValidation,validateRequest,StoreHolidayDomain.updateStoreHoliday)
 
// delete Store
router.delete('/api/store/storeholiday/delete/:id',verifyVendorToken,StoreHolidayDomain.deleteStoreHoliday);

// get all Store
router.get('/api/store/storeholiday/get/:id',StoreHolidayDomain.getStoreHolidayByStoreId);

export { router as StoreHolidayRouter };
