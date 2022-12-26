import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express, { Request, Response, Router } from 'express';
import { CouponDomain } from '../domain/coupon-domain';
import { verifyToken } from '../middlewares/current-user';
import { CouponValidation } from '../validations/coupon-validation';


const router = express.Router();

//ADMIN Middleware check pending

// Coupon create
router.post('/api/product/coupon/create',verifyToken,CouponValidation.CouponCreateValidation,validateRequest,CouponDomain.createCoupon);

// Coupon update
router.put('/api/product/coupon/update/:id',verifyToken,CouponDomain.updateCoupon)
 
// delete Coupon
router.delete('/api/product/coupon/delete/:id',verifyToken,CouponDomain.deleteCoupon);

// get all Coupon
router.get('/api/product/coupon/get',CouponDomain.getCouponList);
router.get('/api/product/coupon/getactive',CouponDomain.getCouponActiveList);
router.get('/api/product/coupon/getdeactive',CouponDomain.getCouponDeactiveList);

export { router as CouponRouter };
