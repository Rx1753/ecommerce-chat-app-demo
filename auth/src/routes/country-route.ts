import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { CountryDomain } from '../domain/country-domain';
import { verifyAdminToken } from '../middlewares/current-user';
import { CountryValidation } from '../validations/county-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Country create
router.post('/api/users/country/create',CountryValidation.CountryCreateValidation,verifyAdminToken,validateRequest,CountryDomain.createCountry);

// Country update
router.put('/api/users/country/update/:id',verifyAdminToken,validateRequest,CountryDomain.updateCountry)
 
// delete Country
router.delete('/api/users/country/delete/:id',verifyAdminToken,validateRequest,CountryDomain.deleteCountry);

// get all Country
router.get('/api/users/country/get',CountryDomain.getCountryList);

router.get('/api/users/country/getcountrybasedonname/:name',CountryDomain.getCountryNameBasedSerch);

export { router as countryRouter };
