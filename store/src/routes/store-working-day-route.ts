import express from 'express';
import { StoreWorkingDayDomain } from '../domain/store-working-day-domain';
import { verifyToken, verifyVendorToken } from '../middlewares/current-user';
import { StoreWorkingDayValidation } from '../validations/store-working-day-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Store create
router.post('/api/store/storeworkingday/create',verifyVendorToken,StoreWorkingDayValidation.StoreWorkingDayCreateValidation,StoreWorkingDayDomain.createStoreWorkingDay);

// Store update
router.put('/api/store/storeworkingday/update/:id',verifyVendorToken,StoreWorkingDayValidation.StoreWorkingDayUpdateValidation,StoreWorkingDayDomain.updateStoreWorkingDay)
 
// delete Store
router.delete('/api/store/storeworkingday/delete/:id',verifyVendorToken,StoreWorkingDayDomain.deleteStoreWorkingDay);

// get all Store
router.get('/api/store/storeworkingday/get/:id',verifyToken,StoreWorkingDayDomain.getStoreWorkingDayId);



export { router as StoreWorkingDayRouter };
