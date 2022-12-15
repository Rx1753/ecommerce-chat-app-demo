import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CityDatabaseLayer } from '../database-layer/city-database';

export class CityDomain {

    static async createCity(req: Request, res: Response) {
        const city = await CityDatabaseLayer.createCity(req);
        res.status(201).send(city);
    }

    static async updateCity(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CityDatabaseLayer.updateCity(req, req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteCity(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CityDatabaseLayer.deleteCity(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getCityList(req: Request, res: Response) {
        const city = await CityDatabaseLayer.getCityList(req);
        res.status(201).send(city);
    }

    static async getCityStateId(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const city = await CityDatabaseLayer.getCityStateId(req, req.params.id);
        res.status(201).send(city);
    }

    static async getCityNameBasedSerch(req: Request, res: Response) {

        const city = await CityDatabaseLayer.getCityNameBasedSerch(req.params.name);
        res.status(201).send(city);
    }

}