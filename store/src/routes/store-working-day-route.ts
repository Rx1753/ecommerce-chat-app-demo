import express from 'express';
import { StoreWorkingDayDomain } from '../domain/store-working-day-domain';
import { verifyToken, verifyVendorToken } from '../middlewares/current-user';

const router = express.Router();

//ADMIN Middleware check pending

// Store create
router.post('/api/store/storeworkingday/create',verifyVendorToken,StoreWorkingDayDomain.createStore);

// Store update
router.put('/api/store/storeworkingday/update/:id',verifyVendorToken,StoreWorkingDayDomain.updateStore)
 
// delete Store
router.delete('/api/store/storeworkingday/delete/:id',verifyVendorToken,StoreWorkingDayDomain.deleteStore);

// get all Store
router.get('/api/store/storeworkingday/get/:id',verifyToken,StoreWorkingDayDomain.getStoreId);



export { router as StoreRouter };
