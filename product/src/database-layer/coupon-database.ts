import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import mongoose from 'mongoose';
import shortid from 'shortid';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessUser } from '../models/business-user';
import { Coupon } from '../models/coupon';
import { CouponMapping } from '../models/coupon-mapping';

import { Store } from '../models/store';
import { natsWrapper } from '../nats-wrapper';

export class CouponDatabaseLayer {

    static async createCoupon(req: any) {
        const { name,
            discountPercentage,
            repeatCoupon,
            maxUserLimit,
            maxDiscountAmount,
            createdFor,
            startDate,
            endDate,
            isMonthlyActive,
            couponAuthor,
            imageUrl, } = req.body;

        var permission = false;
        console.log('type', req.currentUser.id);

        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findOne({ $and: [{ _id: req.currentUser.id }, { isActive: true }] });

            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                    console.log(userRoleMapping);
                    userRoleMapping.forEach((e: any) => {
                        if (e.businessRoleId.tableName == 'Coupon' && e.businessRoleId.isCreate == true) {
                            permission = true;
                        }
                    })
                }
            }
        } else if (req.currentUser.type == "Admin") {
            permission = true;
        } else {
            throw new BadRequestError('User is not Valid');
        }
        if (permission) {
            const code = shortid.generate();
            const CouponData=Coupon.build({
                name: name,
                discountPercentage: discountPercentage,
                couponCode: code,
                repeatCoupon: repeatCoupon,
                maxUserLimit: maxUserLimit,
                maxDiscountAmount: maxDiscountAmount,
                createdFor: createdFor,
                startDate:startDate,
                endDate: endDate,
                isMonthlyActive: isMonthlyActive,
                couponAuthor: req.currentUser.type,
                imageUrl: imageUrl
            });
            CouponMapping.build({
                couponId: CouponData._id,
                isProduct: false,
                isCustomer: false,
                isStore: false,
                isProductCategory: false,
                isProductSubCategory: false,
                baseId: ''
            });

            
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async updateCoupon(req: any, id: string) {
        const { name, description, CouponSubCategoryId, imageUrl, storeId, brandName, warrenty, guaranty, basePrice, mrpPrice, addOns, quantity, isInvoiceAvailable, calculateOnBasePrice, isCancellation, relatableCoupons } = req.body;

        var permission = false;
        console.log('type', req.currentUser.type);

        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findById(req.currentUser.id);

            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                    console.log(userRoleMapping);
                    userRoleMapping.forEach((e: any) => {
                        if (e.businessRoleId.tableName == 'Coupon' && e.businessRoleId.isUpdate == true) {
                            permission = true;
                        }
                    })
                }
            }
        } else if (req.currentUser.type == "Admin") {
            permission = true;
        } else {
            throw new BadRequestError('User is not Valid');
        }
        if (permission) {
           
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async deleteCoupon(req: any, id: string) {

        var permission = false;
        console.log('type', req.currentUser.type);

        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findById(req.currentUser.id);

            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                    console.log(userRoleMapping);
                    userRoleMapping.forEach((e: any) => {
                        if (e.businessRoleId.tableName == 'Coupon' && e.businessRoleId.isDelete == true) {
                            permission = true;
                        }
                    })
                }
            }
        } else if (req.currentUser.type == "Admin") {
            permission = true;
        } else {
            throw new BadRequestError('User is not Valid');
        }
        if (permission) {

            try {
                const data = await Coupon.findById(id)
                if (data) {
                    const status = data.isActive ? false : true;
                    await Coupon.findByIdAndUpdate(id, { isActive: status });
                    return;

                }
                return data;
            } catch (error: any) {
                throw new BadRequestError(error.message);


            }
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async getCouponList(req: any) {
        const data = await Coupon.find()
        if (data) {
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }

    static async getCouponActiveList(req: any) {
        const data = await Coupon.find({isActive:true})
        if (data) {
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }

    static async getCouponDeactiveList(req: any) {
        const data = await Coupon.find({isActive:false})
        if (data) {
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }


}