import { Request, Response } from 'express';
import { CityDatabaseLayer } from '../database-layer/city-database';

export class CityDomain {

    static async createCity(req: Request, res: Response) {
        const city = await CityDatabaseLayer.createCity(req);
        res.status(201).send(city);
    }

    static async updateCity(req: Request, res: Response) {
        await CityDatabaseLayer.updateCity(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteCity(req: Request, res: Response) {
        await CityDatabaseLayer.deleteCity(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getCityList(req: Request, res: Response) {
        const city =  await CityDatabaseLayer.getCityList(req);
        res.status(201).send(city);
    }
    
    static async getCityStateId(req: Request,res:Response){
        const city =  await CityDatabaseLayer.getCityStateId(req,req.params.id);
        res.status(201).send(city);
    }

}