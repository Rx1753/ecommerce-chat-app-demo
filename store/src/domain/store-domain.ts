import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StoreDatabaseLayer } from '../database-layer/store-database';

export class StoreDomain {

    static async createStore(req: Request, res: Response) {
        const Store = await StoreDatabaseLayer.createStore(req);
        res.status(201).send(Store);
    }

    static async updateStore(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreDatabaseLayer.updateStore(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteStore(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await StoreDatabaseLayer.deleteStore(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getStoreId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Store =  await StoreDatabaseLayer.getStoreById(req,req.params.id);
        res.status(201).send(Store);
    }
    
    static async getStore(req: Request, res: Response) {
        const Store =  await StoreDatabaseLayer.getStore();
        res.status(201).send(Store);
    }

    static async getActiveStore(req: Request, res: Response) {
        const Store =  await StoreDatabaseLayer.getActiveStore();
        res.status(201).send(Store);
    }

    static async getDeactiveStore(req: Request, res: Response) {
        const Store =  await StoreDatabaseLayer.getDeactiveStore();
        res.status(201).send(Store);
    }

}