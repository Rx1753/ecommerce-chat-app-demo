import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderDatabaseLayer } from '../database-layer/order-database';

export class OrderDomain {

    static async createOrder(req: Request, res: Response) {
        const Order = await OrderDatabaseLayer.createOrderBasedOnCart(req);
        res.status(201).send({orderPlace:true});
    }

    static async getSignleOrder(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
          }
        const data=await OrderDatabaseLayer.getSignleOrder(req,req.params.id);
        res.status(201).send(data);
    }

    static async getOrder(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.getOrder(req);
        res.status(201).send(Order);
    }
    
    static async revenue(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.revenue(req);
        res.status(201).send(Order);
    }
    
    static async totalOrderFromEachBusinessCategory(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.totalOrderFromEachBusinessCategory(req);
        res.status(201).send(Order);
    }

    
    static async totalRevnueFromEachBusinessCategory(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.totalRevnueFromEachBusinessCategory(req);
        res.status(201).send(Order);
    }
    
    static async totalSaleBusinessUserBased(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.totalSaleBusinessUserBased(req,req.params.id);
        res.status(201).send(Order);
    }
    
    static async totalCustomerBasedBusinessUser(req: Request, res: Response) {
        const Order =  await OrderDatabaseLayer.totalCustomerBasedBusinessUser(req,req.params.id);
        res.status(201).send(Order);
    }
    static async couponSuggestion(req: Request, res: Response) {
        const Cart =  await OrderDatabaseLayer.couponSuggestion(req);
        res.status(201).send(Cart);
    }
    

}