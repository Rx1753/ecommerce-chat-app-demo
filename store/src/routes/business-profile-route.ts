import express, { Request, Response, Router } from 'express';
import { BusinessProfileDomain } from '../domain/business-profile-domain';
import { verifyCustomerToken } from '../middlewares/current-user';

const router = express.Router();

//ADMIN Middleware check pending

// BusinessProfile create
router.post('/api/store/businessprofile/create',verifyCustomerToken,BusinessProfileDomain.createBusinessProfile);

// BusinessProfile update
router.put('/api/store/businessprofile/update/:id',verifyCustomerToken,BusinessProfileDomain.updateBusinessProfile)
 
// delete BusinessProfile
router.delete('/api/store/businessprofile/delete/:id',verifyCustomerToken,BusinessProfileDomain.deleteBusinessProfile);

// get all BusinessProfile
router.get('/api/store/businessprofile/get/:id',BusinessProfileDomain.getBusinessProfileId);



export { router as BusinessProfileRouter };
