import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CartDatabaseLayer } from '../database-layer/cart-database';

export class CartDomain {

    static async createCart(req: Request, res: Response) {
        const Cart = await CartDatabaseLayer.createCart(req);
        res.status(201).send(Cart);
    }


    static async removeSignleCart(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
          }
        const data=await CartDatabaseLayer.removeSignleCart(req,req.params.id);
        res.status(201).send(data);
    }
    
    static async removeCart(req: Request, res: Response) {
        await CartDatabaseLayer.removeCart(req);
        res.status(201).send({ deleted: true });
    }

    static async getCart(req: Request, res: Response) {
        const Cart =  await CartDatabaseLayer.getCart(req);
        res.status(201).send(Cart);
    }
    

}