import { Request, Response } from 'express';
import { CountryDatabaseLayer } from '../database-layer/country-database';

export class CountryDomain {


    static async createCountry(req: Request, res: Response) {
        const address = await CountryDatabaseLayer.createCountry(req);
        res.status(201).send(address);
    }

    static async updateCountry(req: Request, res: Response) {
        await CountryDatabaseLayer.updateCountry(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteCountry(req: Request, res: Response) {
        await CountryDatabaseLayer.deleteCountry(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getCountryList(req: Request, res: Response) {
        const address =  await CountryDatabaseLayer.getCountryList(req);
        res.status(201).send(address);
    }

}