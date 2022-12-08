import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StoreWorkingDayDatabaseLayer } from '../database-layer/store-working-day-database';

export class StoreWorkingDayDomain {

    static async createStore(req: Request, res: Response) {
        const Store = await StoreWorkingDayDatabaseLayer.createStore(req);
        res.status(201).send(Store);
    }

    static async updateStore(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreWorkingDayDatabaseLayer.updateStore(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteStore(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreWorkingDayDatabaseLayer.deleteStore(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getStoreId(req: Request, res: Response) {
        const Store =  await StoreWorkingDayDatabaseLayer.getStoreById(req,req.params.id);
        res.status(201).send(Store);
    }
    

}