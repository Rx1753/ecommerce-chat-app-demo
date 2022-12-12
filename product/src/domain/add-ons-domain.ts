import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AddOnsDatabaseLayer } from '../database-layer/add-ons-database';

export class AddOnsDomain {

    static async createAddOns(req: Request, res: Response) {
        const AddOns = await AddOnsDatabaseLayer.createAddOns(req);
        res.status(201).send(AddOns);
    }

    static async updateAddOns(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await AddOnsDatabaseLayer.updateAddOns(req,req.params.id);
        res.status(201).send(data);
    }

    static async deleteAddOns(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await AddOnsDatabaseLayer.deleteAddOns(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getAddOnsList(req: Request, res: Response) {
        const AddOns =  await AddOnsDatabaseLayer.getAddOnsList(req);
        res.status(201).send(AddOns);
    }
    
    static async getAddOnsListProductId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const AddOns =  await AddOnsDatabaseLayer.getAddOnsListProductId(req,req.params.id);
        res.status(201).send(AddOns);
    }

}