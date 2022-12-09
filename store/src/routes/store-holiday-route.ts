import express from 'express';
import { StoreHolidayDomain } from '../domain/store-holiday-domain';
import { verifyToken, verifyVendorToken } from '../middlewares/current-user';
import { StoreHolidayValidation } from '../validations/store-holiday-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Store create
router.post('/api/store/storeholiday/create',verifyVendorToken,StoreHolidayValidation.StoreHolidayCreateValidation,StoreHolidayDomain.createStoreHoliday);

// Store update
router.put('/api/store/storeholiday/update/:id',verifyVendorToken,StoreHolidayValidation.StoreHolidayUpdateValidation,StoreHolidayDomain.updateStoreHoliday)
 
// delete Store
router.delete('/api/store/storeholiday/delete/:id',verifyVendorToken,StoreHolidayDomain.deleteStoreHoliday);

// get all Store
router.get('/api/store/storeholiday/get/:id',verifyToken,StoreHolidayDomain.getStoreHolidayId);

export { router as StoreHolidayRouter };
