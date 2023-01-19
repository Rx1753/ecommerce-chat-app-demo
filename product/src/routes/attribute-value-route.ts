import express, { Request, Response, Router } from 'express';
import { AttributeValueDomain } from '../domain/attribute-value';
import { verifyToken } from '../middlewares/current-user';


const router = express.Router();

//ADMIN Middleware check pending

// Attribute create
router.post('/api/product/attributevalue/create',verifyToken,AttributeValueDomain.createAttributeValue);

// Attribute update
router.put('/api/product/attributevalue/update/:id',verifyToken,AttributeValueDomain.updateAttributeValue)
 
// delete Attribute
router.delete('/api/product/attributevalue/delete/:id',verifyToken,AttributeValueDomain.deleteAttributeValue);

// get all Attribute
router.get('/api/product/attributevalue/get',AttributeValueDomain.getAttributeValueList);

export { router as AttributeValueRouter };
