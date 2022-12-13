import express, { Request, Response, Router } from 'express';
import { CityDomain } from '../domain/city-domain';
import { CityValidation } from '../validations/city-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Country create
router.post('/api/users/city/create',CityValidation.CityCreateValidation,CityDomain.createCity);

// Country update
router.put('/api/users/city/update/:id',CityDomain.updateCity)
 
// delete Country
router.delete('/api/users/city/delete/:id',CityDomain.deleteCity);

// get all Country
router.get('/api/users/city/get',CityDomain.getCityList);

//get city based on stateId
router.get('/api/users/city/getstatebase/:id',CityDomain.getCityStateId);
export { router as cityRouter };
