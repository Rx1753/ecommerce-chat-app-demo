import express, { Request, Response, Router } from 'express';
import { StateDomain } from '../domain/state-domain';
import { StateValidation } from '../validations/state-validation';

const router = express.Router();

//ADMIN Middleware check pending

// Country create
router.post('/api/users/state/create',StateValidation.StateCreateValidation,StateDomain.createState);

// Country update
router.put('/api/users/state/update/:id',StateDomain.updateState)
 
// delete Country
router.delete('/api/users/state/delete/:id',StateDomain.deleteState);

// get all Country
router.get('/api/users/state/get',StateDomain.getStateList);

//get State based on stateId
router.get('/api/users/state/getcountrybase/:id',StateDomain.getStateCountryId);
export { router as stateRouter };
