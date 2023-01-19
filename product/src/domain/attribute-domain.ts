import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AttributeDatabaseLayer } from '../database-layer/attribute-database';

export class AttributeDomain {

    static async createAttribute(req: Request, res: Response) {
        const Attribute = await AttributeDatabaseLayer.createAttribute(req);
        res.status(201).send(Attribute);
    }

    static async updateAttribute(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await AttributeDatabaseLayer.updateAttribute(req,req.params.id);
        res.status(201).send(data);
    }

    static async deleteAttribute(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await AttributeDatabaseLayer.deleteAttribute(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getAttributeList(req: Request, res: Response) {
        const Attribute =  await AttributeDatabaseLayer.getAttributeList(req);
        res.status(201).send(Attribute);
    }

}
