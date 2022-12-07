import express, { Request, Response, Router } from 'express';
import { BusinessProfileKycDomain } from '../domain/business-profile-kyc-domain';
import { verifyAdminToken, verifyCustomerToken, verifyVendorToken } from '../middlewares/current-user';

const router = express.Router();

//ADMIN Middleware check pending

// BusinessProfileKyc create
router.post('/api/store/businessprofilekyc/create',verifyVendorToken,BusinessProfileKycDomain.createBusinessProfileKyc);

// BusinessProfileKyc update
router.put('/api/store/businessprofilekyc/update/:id',verifyVendorToken,BusinessProfileKycDomain.updateBusinessProfileKyc)
 
// delete BusinessProfileKyc
// router.delete('/api/store/businessprofilekyc/delete/:id',verifyCustomerToken,BusinessProfileKycDomain.deleteBusinessProfileKyc);

// get all BusinessProfileKyc
router.get('/api/store/businessprofilekyc/get',verifyVendorToken,BusinessProfileKycDomain.getBusinessProfileKycList);

// get all BusinessProfileKyc
router.get('/api/store/businessprofilekyc/getpending',verifyVendorToken,BusinessProfileKycDomain.getBusinessProfileKycPendingList);
 
// get all BusinessProfileIdBasedKyc
router.get('/api/store/businessprofilekyc/getbybusinessprofileid/:id',verifyVendorToken,BusinessProfileKycDomain.getBusinessProfileIdKycList);


export { router as BusinessProfileKycRouter };
