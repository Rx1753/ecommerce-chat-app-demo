import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CouponDatabaseLayer } from '../database-layer/coupon-database';

export class CouponDomain {

    static async createCoupon(req: Request, res: Response) {
        const Coupon = await CouponDatabaseLayer.createCoupon(req);
        res.status(201).send(Coupon);
    }

    static async updateCoupon(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await CouponDatabaseLayer.updateCoupon(req,req.params.id);
        res.status(201).send(data);
    }

    static async deleteCoupon(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await CouponDatabaseLayer.deleteCoupon(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getCouponList(req: Request, res: Response) {
        const Coupon =  await CouponDatabaseLayer.getCouponList(req);
        res.status(201).send(Coupon);
    }

    static async getCouponActiveList(req: Request, res: Response) {
        const Coupon =  await CouponDatabaseLayer.getCouponActiveList(req);
        res.status(201).send(Coupon);
    }
    static async getCouponDeactiveList(req: Request, res: Response) {
        const Coupon =  await CouponDatabaseLayer.getCouponDeactiveList(req);
        res.status(201).send(Coupon);
    }
}
