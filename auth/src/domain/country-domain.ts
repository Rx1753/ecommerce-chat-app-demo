import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CountryDatabaseLayer } from '../database-layer/country-database';

export class CountryDomain {


    static async createCountry(req: Request, res: Response) {
        const address = await CountryDatabaseLayer.createCountry(req);
        res.status(201).send(address);
    }

    static async updateCountry(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CountryDatabaseLayer.updateCountry(req, req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteCountry(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CountryDatabaseLayer.deleteCountry(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getCountryList(req: Request, res: Response) {
        const address = await CountryDatabaseLayer.getCountryList(req);
        res.status(201).send(address);
    }
    
    static async getCountryNameBasedSerch(req: Request, res: Response) {
        const address = await CountryDatabaseLayer.getCountryNameBasedSerch(req.params.name);
        res.status(201).send(address);
    }

}