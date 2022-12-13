import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CartDatabaseLayer } from '../database-layer/cart-database';

export class CartDomain {

    static async createCart(req: Request, res: Response) {
        const Cart = await CartDatabaseLayer.createCart(req);
        res.status(201).send(Cart);
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