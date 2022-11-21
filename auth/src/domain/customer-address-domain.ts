import { BadRequestError } from '../errors/bad-request-error';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { CustomerAddressDatabaseLayer } from '../database-layer/customer-address-database';

export class CustomerAddressDomain {


    static async createAddress(req: Request, res: Response) {
        const address = await CustomerAddressDatabaseLayer.createAddress(req);
        res.status(201).send(address);
    }

    static async updateAddress(req: Request, res: Response) {
        await CustomerAddressDatabaseLayer.updateAddress(req,req.params.id);
        res.status(201).send({ updated: true });
    }

    static async deleteAddress(req: Request, res: Response) {
        await CustomerAddressDatabaseLayer.deleteAddress(req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getCurrentUserAddress(req: Request, res: Response) {
        const address =  await CustomerAddressDatabaseLayer.getCurrentUserAddress(req);
        res.status(201).send(address);
    }

}