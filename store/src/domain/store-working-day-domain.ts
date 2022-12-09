import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StoreWorkingDayDatabaseLayer } from '../database-layer/store-working-day-database';

export class StoreWorkingDayDomain {

    static async createStoreWorkingDay(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.body.storeId)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store = await StoreWorkingDayDatabaseLayer.createStoreWorkingDay(req);
        res.status(201).send(Store);
    }

    static async updateStoreWorkingDay(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreWorkingDayDatabaseLayer.updateStoreWorkingDay(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteStoreWorkingDay(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreWorkingDayDatabaseLayer.deleteStoreWorkingDay(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getStoreWorkingDayId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store =  await StoreWorkingDayDatabaseLayer.getStoreWorkingDayById(req,req.params.id);
        res.status(201).send(Store);
    }
}