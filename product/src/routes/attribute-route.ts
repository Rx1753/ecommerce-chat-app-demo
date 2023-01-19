import express, { Request, Response, Router } from 'express';
import { AttributeDomain } from '../domain/attribute-domain';
import { verifyToken } from '../middlewares/current-user';


const router = express.Router();

//ADMIN Middleware check pending

// Attribute create
router.post('/api/product/attribute/create',verifyToken,AttributeDomain.createAttribute);

// Attribute update
router.put('/api/product/attribute/update/:id',verifyToken,AttributeDomain.updateAttribute)
 
// delete Attribute
router.delete('/api/product/attribute/delete/:id',verifyToken,AttributeDomain.deleteAttribute);

// get all Attribute
router.get('/api/product/attribute/get',AttributeDomain.getAttributeList);

export { router as AttributeRouter };
