import express, { Request, Response, Router } from 'express';
import { BusinessProfileKycDomain } from '../domain/business-profile-kyc-domain';
import { verifyAdminToken, verifyVendorToken } from '../middlewares/current-user';
const FirebaseStorage = require('multer-firebase-storage')

const router = express.Router();

//ADMIN Middleware check pending
import * as admin from "firebase-admin";
import credential from '../nodejsauth-f12ae-firebase-adminsdk-e4myk-57e93cffc7.json';
import multer from 'multer';
import { BusinessProfileKYCValidation } from '../validations/business-profile-kyc-validation';

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(JSON.stringify(credential))),
    storageBucket: "gs://nodejsauth-f12ae.appspot.com/"
  });
const uploadMulter = multer({
    storage: FirebaseStorage({
      bucketName: "gs://nodejsauth-f12ae.appspot.com/",
      credentials: credential,
      public:true,
    },admin)
  }).single('file')

// BusinessProfileKyc create
router.post('/api/store/businessprofilekyc/create',BusinessProfileKYCValidation.BusinessProfileKYCCreateValidation,uploadMulter,verifyVendorToken,BusinessProfileKycDomain.createBusinessProfileKyc);

// BusinessProfileKyc update
router.put('/api/store/businessprofilekyc/update/:id',verifyAdminToken,BusinessProfileKycDomain.updateBusinessProfileKyc)
 
// delete BusinessProfileKyc
// router.delete('/api/store/businessprofilekyc/delete/:id',verifyCustomerToken,BusinessProfileKycDomain.deleteBusinessProfileKyc);

// get all BusinessProfileKyc
router.get('/api/store/businessprofilekyc/get',verifyAdminToken,BusinessProfileKycDomain.getBusinessProfileKycList);

// get all BusinessProfileKyc
router.get('/api/store/businessprofilekyc/getpending',verifyAdminToken,BusinessProfileKycDomain.getBusinessProfileKycPendingList);
 
// get all BusinessProfileIdBasedKyc
router.get('/api/store/businessprofilekyc/getbybusinessprofileid/:id',verifyVendorToken,BusinessProfileKycDomain.getBusinessProfileIdKycList);


export { router as BusinessProfileKycRouter };
