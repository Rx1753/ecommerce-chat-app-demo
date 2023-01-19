import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AttributeValueDatabaseLayer } from '../database-layer/attribute-value-database';

export class AttributeValueDomain {

    static async createAttributeValue(req: Request, res: Response) {
        const AttributeValue = await AttributeValueDatabaseLayer.createAttributeValue(req);
        res.status(201).send(AttributeValue);
    }

    static async updateAttributeValue(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await AttributeValueDatabaseLayer.updateAttributeValue(req,req.params.id);
        res.status(201).send(data);
    }

    static async deleteAttributeValue(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await AttributeValueDatabaseLayer.deleteAttributeValue(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getAttributeValueList(req: Request, res: Response) {
        const AttributeValue =  await AttributeValueDatabaseLayer.getAttributeValueList(req);
        res.status(201).send(AttributeValue);
    }

}
