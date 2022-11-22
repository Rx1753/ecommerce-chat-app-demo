import { Request, Response } from 'express';
import { StateDatabaseLayer } from '../database-layer/state-database';

export class StateDomain {

    static async createState(req: Request, res: Response) {
        const State = await StateDatabaseLayer.createState(req);
        res.status(201).send(State);
    }

    static async updateState(req: Request, res: Response) {
        await StateDatabaseLayer.updateState(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteState(req: Request, res: Response) {
        await StateDatabaseLayer.deleteState(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getStateList(req: Request, res: Response) {
        const State =  await StateDatabaseLayer.getStateList(req);
        res.status(201).send(State);
    }
    
    static async getStateCountryId(req: Request,res:Response){
        const State =  await StateDatabaseLayer.getStateCountryId(req,req.params.id);
        res.status(201).send(State);
    }

}