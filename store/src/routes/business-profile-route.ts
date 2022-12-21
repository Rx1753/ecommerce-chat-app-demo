import express, { Request, Response, Router } from 'express';
import { BusinessProfileDomain } from '../domain/business-profile-domain';
import {  verifyAdminToken, verifyVendorToken } from '../middlewares/current-user';

const router = express.Router();

//ADMIN Middleware check pending

// BusinessProfile create
router.post('/api/store/businessprofile/create',verifyVendorToken,BusinessProfileDomain.createBusinessProfile);

// BusinessProfile update
router.put('/api/store/businessprofile/update/:id',verifyVendorToken,BusinessProfileDomain.updateBusinessProfile)
 
// delete BusinessProfile
router.delete('/api/store/businessprofile/byadmin/delete/:id',verifyAdminToken,BusinessProfileDomain.deleteBusinessProfile);
router.get('/api/store/businessprofile/get',BusinessProfileDomain.getBusinessProfile);
router.get('/api/store/businessprofile/getactive',BusinessProfileDomain.getActiveBusinessProfile);
router.get('/api/store/businessprofile/getdeactive',BusinessProfileDomain.getDeactiveBusinessProfile);
// get all BusinessProfile
router.get('/api/store/businessprofile/get/:id',BusinessProfileDomain.getBusinessProfileId);



export { router as BusinessProfileRouter };
 