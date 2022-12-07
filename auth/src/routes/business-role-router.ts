import express, { Request, Response, Router } from 'express';
import { BusinessRoleDomain } from '../domain/business-role-domain';

const router = express.Router();

//ADMIN Middleware check pending

// Country create
router.post('/api/users/businessrole/create',BusinessRoleDomain.createBusinessRole);

// Country update
router.put('/api/users/businessrole/update/:id',BusinessRoleDomain.updateBusinessRole)
 
// delete Country
router.delete('/api/users/businessrole/delete/:id',BusinessRoleDomain.deleteBusinessRole);

// get all Country
router.get('/api/users/businessrole/get',BusinessRoleDomain.getBusinessRoleList);

export { router as BusinessRoleRouter };