import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StoreHolidayDatabaseLayer } from '../database-layer/store-holiday-database';

export class StoreHolidayDomain {

    static async createStoreHoliday(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.body.storeId)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store = await StoreHolidayDatabaseLayer.createStoreHoliday(req);
        res.status(201).send(Store);
    }

    static async updateStoreHoliday(req: Request, res: Response) {
     
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreHolidayDatabaseLayer.updateStoreHoliday(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteStoreHoliday(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreHolidayDatabaseLayer.deleteStoreHoliday(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getStoreHolidayByStoreId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store =  await StoreHolidayDatabaseLayer.getStoreHolidayByStoreId(req,req.params.id);
        res.status(201).send(Store);
    }
    

}