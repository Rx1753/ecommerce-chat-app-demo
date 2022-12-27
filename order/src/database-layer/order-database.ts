import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import e from 'express';
import { Cart } from '../models/cart';
import { Coupon } from '../models/coupon';
import { CouponMapping } from '../models/coupon-mapping';
import { customerAddress } from '../models/customer-address';
import { Order } from '../models/order';
import { OrderProduct } from '../models/order-product';
import { Product } from '../models/product';
import { ProductItem } from '../models/product-item';

export class OrderDatabaseLayer {

    static async createOrderBasedOnCart(req: any) {
        if (req.currentUser.id) {
            console.log('req.currentUser.id', req.currentUser.id);

            const cartData = await Cart.findOne({ customerId: req.currentUser.id });
            const cartStrData = JSON.parse(JSON.stringify(cartData));
            console.log('2');
            const OrderData: any[] = [];
            var payableAmount: any = 0;
            if (cartData) {
                const addressId = await customerAddress.findOne({ $and: [{ customerId: req.currentUser.id }, { isDefalultAddress: true }] })
                if (addressId) {


                    await Promise.all(cartStrData.cartList.map(async (element: any) => {
                        var pItem: boolean;
                        (element.productItemId === undefined || element.productItemId === null || element.productItemId.length == 0) ? pItem = false : pItem = true;
                        console.log('element', element);

                        if (pItem) {
                            const productItemData = await ProductItem.findById(element.productItemId).populate('productId');
                            if (productItemData) {
                                if (productItemData.quantity >= element.purchaseQuantity) {
                                    const q = productItemData.quantity - element.purchaseQuantity;
                                    await ProductItem.findByIdAndUpdate(element.productItemId, { quantity: q });
                                    const qty = productItemData.productId.quantity - element.purchaseQuantity;
                                    await Product.findByIdAndUpdate(element.productId, { quantity: qty });
                                    const amount = (element.purchaseQuantity * productItemData.mrpPrice);
                                    element.amount = amount;
                                    element.storeId = productItemData.productId.storeId;
                                    element.price = productItemData.mrpPrice;
                                    payableAmount = Number(payableAmount + amount);
                                    OrderData.push(element);
                                } else {
                                    throw new BadRequestError("quantity is high for this productItemId" + element.productItemId);
                                }
                            } else { throw new BadRequestError("Product Item not found"); }
                        } else {
                            const productData = await Product.findById(element.productId);
                            if (productData) {
                                if (productData.quantity >= element.purchaseQuantity) {
                                    const qty = productData.quantity - element.purchaseQuantity;
                                    await Product.findByIdAndUpdate(element.productId, { quantity: qty });
                                    const amount = (element.purchaseQuantity * productData.mrpPrice);
                                    element.amount = amount;
                                    element.storeId = productData.storeId;
                                    element.price = productData.mrpPrice;
                                    payableAmount = Number(payableAmount + amount);
                                    OrderData.push(element);
                                } else {
                                    throw new BadRequestError("quantity is high for this productId" + element.productId);
                                }
                            } else { throw new BadRequestError("Product Item not found"); }
                        }

                    }))

                    const { deliveryMode } = req.body;
                    // return OrderData;
                    const order = Order.build({
                        customerId: req.currentUser.id,
                        rewardPoints: 0,
                        addressId: addressId?._id.toString(),
                        zipCode: addressId?.zipCode,
                        deliveryMode: deliveryMode,
                        payableAmount: payableAmount,
                        discountPrice: 0,
                        totalPrice: payableAmount,
                        remarks: ''
                    });
                    OrderData.forEach((e: any) => {
                        const orderProductData = OrderProduct.build({
                            productId: e.productId,
                            productItemId: (e.productItemId === undefined || e.productItemId === null) ? e.productItemId : null,
                            addOnsId: null,
                            storeId: e.storeId,
                            quantity: e.purchaseQuantity,
                            orderId: order._id.toString(),
                            refundAmount: 0,
                            penaltyAmount: 0,
                            orderStatus: 'pending',
                            couponId: null,
                            discountPrice: 0,
                            price: e.price,
                            mrpPrice: e.price,
                        });
                        orderProductData.save();
                    })
                    order.save();
                    return;
                } else {
                    throw new BadRequestError("Address not found for current user pls write address first");
                }
            }
        }
    }

    static async couponSuggestion(req: any,) {
        if (req.currentUser.id) {
            const today: Date = new Date();
            const couponData = await Coupon.find({ $and: [{ startDate: { $lte: today } }, { endDate: { $gte: today } }, { isActive: true }] })

            const cartData = await Cart.findOne({ customerId: req.currentUser.id });

            const cartStrData = JSON.parse(JSON.stringify(cartData));

            const couponStrData = JSON.parse(JSON.stringify(couponData));

            const OrderData: any[] = [];

            var payableAmount: any = 0;

            if (cartData) {
                await Promise.all(cartStrData.cartList.map(async (element: any) => {
                    var pItem: boolean;
                    (element.productItemId === undefined || element.productItemId === null || element.productItemId.length == 0) ? pItem = false : pItem = true;
                    console.log('element', element);

                    if (pItem) {
                        const productItemData = await ProductItem.findById(element.productItemId).populate({
                            path: 'productId', populate: {
                                path: 'productSubCategoryId', populate: {
                                    path: 'productCategoryId'
                                }
                            }
                        });
                        console.log('productItemData', productItemData);

                        if (productItemData) {
                            if (productItemData.quantity >= element.purchaseQuantity) {
                                const q = productItemData.quantity - element.purchaseQuantity;
                                const qty = productItemData.productId.quantity - element.purchaseQuantity;
                                const amount = (element.purchaseQuantity * productItemData.mrpPrice);
                                element.amount = amount;
                                element.storeId = productItemData.productId.storeId;
                                element.price = productItemData.mrpPrice;
                                payableAmount = Number(payableAmount + amount);
                                const CouponProductArr: any[] = [];
                                await Promise.all(couponStrData.map(async (a: any) => {
                                    const couponMappingData = await CouponMapping.find(
                                        {
                                            $and: [{ couponId: a.CouponId },
                                            {
                                                $or: [{ $and: [{ isProduct: true }, { baseId: element.productId }] },
                                                      {$and: [ {isProductCategory:true},{baseId:productItemData.productId.productSubCategoryId.productCategoryId._id.toHexString()},
                                                      {$and: [ {isProductSubCategory:true},{baseId:productItemData.productId.productSubCategoryId._id.toHexString()}
                                                    ]}]
                                            }]
                                         }]
                                        }
                                        )
                                    if (couponMappingData.length != 0) {
                                        a.couponData = couponMappingData;
                                        CouponProductArr.push(a);
                                    }
                                }))
                                element.Coupon = CouponProductArr;

                                OrderData.push(element);
                            } else {
                                throw new BadRequestError("quantity is high for this productItemId" + element.productItemId);
                            }
                        } else { throw new BadRequestError("Product Item not found"); }
                    } else {
                        const productData = await Product.findById(element.productId).populate({
                            path: 'productSubCategoryId', populate: {
                                path: 'productCategoryId'
                            }
                        });
                        console.log('productData', productData);

                        if (productData) {
                            if (productData.quantity >= element.purchaseQuantity) {
                                const qty = productData.quantity - element.purchaseQuantity;
                                const amount = (element.purchaseQuantity * productData.mrpPrice);
                                element.amount = amount;
                                element.storeId = productData.storeId;
                                element.price = productData.mrpPrice;
                                payableAmount = Number(payableAmount + amount);
                                const CouponProductArr: any[] = [];
                                await Promise.all(couponStrData.map(async (a: any) => {
                                    const couponMappingData = await CouponMapping.find({
                                        $and: [{ couponId: a.CouponId },
                                        {
                                            $or: [{ $and: [{ isProduct: true }, { baseId: element.productId }] },
                                                  {$and: [ {isProductCategory:true},{baseId:productData.productSubCategoryId.productCategoryId._id.toHexString()},
                                                  {$and: [ {isProductSubCategory:true},{baseId:productData.productSubCategoryId._id.toHexString()}
                                                ]}]
                                        }]
                                     }]
                                    })
                                    if (couponMappingData.length != 0) {
                                        a.couponData = couponMappingData;
                                        // element.Coupon = a;
                                        CouponProductArr.push(a);
                                    }
                                }))
                                element.Coupon = CouponProductArr;

                                OrderData.push(element);
                            } else {
                                throw new BadRequestError("quantity is high for this productId" + element.productId);
                            }
                        } else { throw new BadRequestError("Product Item not found"); }
                    }

                }))

            }
            return OrderData;
        }
    }

    static async getSignleOrder(req: any, id: any) {
        const currentUserOrder = await Order.findOne({ customerId: req.currentUser.id });
        if (currentUserOrder) {
            return currentUserOrder;
        } else {
            throw new BadRequestError("Order Not Found");
        }
    }

    static async getOrder(req: any) {
        // const data = await Order.find({ customerId: req.currentUser.id });
        const data = await Order.aggregate([
            { $match: { customerId: req.currentUser.id } },
            { "$addFields": { "oId": { "$toString": "$_id" } } },
            {
                $lookup:
                {
                    from: "orderproducts",
                    localField: "oId",
                    foreignField: "orderId",
                    as: "orderID"
                }
            },
        ])
        return data;
    }

}