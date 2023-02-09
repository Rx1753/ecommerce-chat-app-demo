import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import e from 'express';
import { privateca } from 'googleapis/build/src/apis/privateca';
import mongoose from 'mongoose';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessSubCategory } from '../models/business-sub-category';
import { BusinessUser } from '../models/business-user';
import { Cart } from '../models/cart';
import { Coupon } from '../models/coupon';
import { CouponMapping } from '../models/coupon-mapping';
import { customerAddress } from '../models/customer-address';
import { Order } from '../models/order';
import { OrderProduct } from '../models/order-product';
import { Product } from '../models/product';
import { ProductItem } from '../models/product-item';
import { ProductReview } from '../models/product-review';
import { SKUS } from '../models/product-skus';
import { ProductVariantCombination } from '../models/product-variant-combination';
import { Store } from '../models/store';
interface Iresponse {
    message?: string,
    result?: any,
    page?: number,
    total?: number
}
export class OrderDatabaseLayer {

    static responseSuccess(data?: Iresponse) {
        return {
            success: true,
            page: data?.page,
            total: data?.total,
            message: data?.message || "success",
            data: data?.result,
        };
    }

    static async productOrder(req: any) {
        const { productId, productItemId, qty } = req.body;
        var discountedPrice = 0;
        var payableAmount = 0
        const addressId = await customerAddress.findOne({ $and: [{ customerId: req.currentUser.id }, { isDefalultAddress: true }] })
        if (addressId) {

            const productCheck = await Product.findById(productId);
            if (productCheck) {
                discountedPrice = productCheck.discountedValue * qty;
                if (productItemId != null || productItemId != undefined) {
                    const productSkusCheck = await SKUS.findById({ $and: [{ _id: new mongoose.Types.ObjectId(productItemId) }, { productId: new mongoose.Types.ObjectId(productId) }] });
                    if (productSkusCheck) {
                        if (productSkusCheck.qty >= qty) {
                            if (productSkusCheck.isVariantBasedPrice) {
                                payableAmount = ((productCheck.basePrice + productSkusCheck.price) * qty) - discountedPrice;
                            } else {
                                payableAmount = (productCheck.basePrice * qty) - discountedPrice
                            }
                        } else {
                            throw new BadRequestError("you ask for more qty");
                        }
                    } else {
                        throw new BadRequestError("productIteamId is not valid");
                    }
                } else {
                    console.log('productCheck.quantity', productCheck);

                    if (productCheck.quantity >= qty) {
                        payableAmount = (productCheck.basePrice * qty) - discountedPrice
                    } else {
                        throw new BadRequestError("you ask for more qty product");
                    }
                }
                const order = Order.build({
                    customerId: req.currentUser.id,
                    rewardPoints: 0,
                    addressId: addressId._id,
                    zipCode: addressId.zipCode,
                    deliveryMode: 'DeliveryMode',
                    payableAmount: payableAmount,
                    discountPrice: discountedPrice,
                    originalPrice: (productCheck.basePrice * qty),
                    remarks: '',
                    orderStatus: 'created',
                    couponDiscountPrice: 0
                })
                const orderProduct = OrderProduct.build({
                    productId: productId,
                    productItemId: productItemId,
                    storeId: productCheck.storeId,
                    quantity: qty,
                    orderId: order._id,
                    orderStatus: 'pending',
                    discountPrice: discountedPrice,
                    originalPrice: (productCheck.basePrice * qty),
                    payableAmount: payableAmount
                })
                await order.save();
                await orderProduct.save();
                return this.responseSuccess();
            } else {
                throw new BadRequestError("ProductId is not valid");
            }
        } else {
            throw new BadRequestError("Address not found for current user pls write address first");
        }
    }

    static async createOrderBasedOnCart(req: any) {
        var totalAmount = 0;
        var totalDiscountedPrice = 0;
        var totalBasePrice = 0;
        var deliverCharges = 0;
        if (req.currentUser.id) {

            const cartData = await Cart.findOne({ customerId: req.currentUser.id });
            const cartStrData = JSON.parse(JSON.stringify(cartData));

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
                            const productItemData = await SKUS.findById(element.productItemId)
                            if (productItemData) {
                                if (productItemData.qty >= element.purchaseQuantity) {
                                    //qty update logic
                                    console.log('lement.productId', element.productId);

                                    //price calculation
                                    const productData = await Product.aggregate([
                                        { $match: { _id: new mongoose.Types.ObjectId(element.productId) } }, {
                                            $project: {
                                                "productId": "$_id",
                                                "originalPrice": "$basePrice",
                                                "discountedPrice": "$discountedValue",
                                                "discountPercentage": "$discount",
                                                "storeId": 1,
                                                "_id": 0
                                            }
                                        }
                                    ]);
                                    console.log('productData', productData[0]);

                                    var productStrData = JSON.parse(JSON.stringify(productData[0]));
                                    console.log(' productStrData.discountedPrice', productStrData);
                                    productStrData.productItemId = productItemData._id;
                                    productStrData.discountedPrice = Number(productStrData.discountedPrice * element.purchaseQuantity);
                                    //attribute logic
                                    const attributeData = await ProductVariantCombination.aggregate([
                                        { $match: { productSKUsId: productItemData._id } },
                                        {
                                            "$lookup": {
                                                "from": "attributevalues",
                                                "let": { "avId": '$attributeValueId' },
                                                "pipeline": [
                                                    { "$match": { "$expr": { "$eq": ["$_id", "$$avId"] } } },
                                                    {
                                                        "$lookup": {
                                                            "from": "attributes",
                                                            "let": { "aId": '$attributeId' },
                                                            "pipeline": [
                                                                { "$match": { "$expr": { "$eq": ["$_id", "$$aId"] } } },

                                                            ],
                                                            "as": "attributeData"
                                                        }
                                                    }
                                                ],
                                                "as": "attributevaluesData"
                                            }
                                        },
                                        {
                                            $project: {

                                                "createdAt": 0,
                                                "updatedAt": 0,
                                                "__v": 0,
                                                "_id": 0,
                                                "productSKUsId": 0,
                                                "attributeId": 0,
                                                "attributevaluesData.__v": 0,
                                                "attributevaluesData.createdAt": 0,
                                                "attributevaluesData.updatedAt": 0,
                                                "attributevaluesData.isActive": 0,
                                                "attributevaluesData._id": 0,
                                                "attributevaluesData.attributeData.__v": 0,
                                                "attributevaluesData.attributeData.createdAt": 0,
                                                "attributevaluesData.attributeData.updatedAt": 0,
                                                "attributevaluesData.attributeData.isActive": 0,
                                                "attributevaluesData.attributeData._id": 0,
                                            }
                                        }
                                    ])

                                    var attributeArr: any[] = [];

                                    attributeData.map((c: any) => {
                                        attributeArr.push(c.attributevaluesData);
                                    })

                                    productStrData.attribute = attributeData;
                                    productStrData.qty = element.purchaseQuantity;
                                    if (productItemData.isVariantBasedPrice) {
                                        productStrData.originalPrice = Number((productStrData.originalPrice + productItemData.price) * element.purchaseQuantity);
                                    } else {
                                        productStrData.originalPrice = Number(productStrData.originalPrice * element.purchaseQuantity);
                                    }
                                    console.log(' productStrData.discountedPrice', productStrData);

                                    productStrData.payableAmount = Number(productStrData.originalPrice - productStrData.discountedPrice)
                                    totalDiscountedPrice = Number(totalDiscountedPrice + productStrData.discountedPrice);
                                    totalBasePrice = Number(totalBasePrice + productStrData.originalPrice)
                                    OrderData.push(productStrData);
                                } else {
                                    throw new BadRequestError("quantity is high for this productItemId" + element.productItemId);
                                }
                            } else { throw new BadRequestError("Product Item not found"); }
                        } else {
                            const productData = await Product.findById(element.productId);
                            if (productData) {
                                if (productData.quantity >= element.purchaseQuantity) {
                                    //qty logic pending
                                    const productStrData = JSON.parse(JSON.stringify(productData));
                                    productStrData.productId = productStrData._id;
                                    productStrData.productItemId = null;
                                    productStrData.attribute = null;
                                    productStrData.originalPrice = Number(productStrData.basePrice * element.purchaseQuantity);
                                    productStrData.discountedPrice = Number(productStrData.discountedValue * element.purchaseQuantity);
                                    totalDiscountedPrice = Number(totalDiscountedPrice + productStrData.discountedPrice);
                                    totalBasePrice = Number(totalBasePrice + productStrData.originalPrice)
                                    productStrData.qty = element.purchaseQuantity;
                                    productStrData.payableAmount = Number(productStrData.originalPrice - productStrData.discountedPrice)

                                    OrderData.push(productStrData);

                                } else {
                                    throw new BadRequestError("quantity is high for this productId" + element.productId);
                                }
                            } else { throw new BadRequestError("Product Item not found"); }
                        }

                    }))


                    const { deliveryMode } = req.body;
                    // return OrderData;
                    const order: any = Order.build({
                        customerId: req.currentUser.id,
                        rewardPoints: 0,
                        addressId: addressId._id,
                        zipCode: addressId.zipCode,
                        deliveryMode: deliveryMode,
                        payableAmount: Number(totalBasePrice - totalDiscountedPrice),
                        discountPrice: Number(totalDiscountedPrice),
                        originalPrice: Number(totalBasePrice),
                        remarks: '',
                        orderStatus: 'created',
                        couponDiscountPrice: 0
                    });
                    console.log('OrderData', OrderData);

                    await Promise.all(OrderData.map(async (e: any) => {
                        console.log('e.discountedPrice', e.discountedPrice);

                        const orderProductData = OrderProduct.build({
                            productId: e.productId,
                            productItemId: e.productItemId,
                            addOnsId: null,
                            storeId: e.storeId,
                            quantity: e.qty,
                            orderId: order._id,
                            refundAmount: 0,
                            penaltyAmount: 0,
                            orderStatus: 'pending',
                            couponId: null,
                            discountPrice: Number(e.discountedPrice),
                            originalPrice: Number(e.originalPrice),
                            payableAmount: Number(e.payableAmount)
                        });
                        await orderProductData.save();

                    }))
                    await order.save();
                    return this.responseSuccess({result:{orderId:order._id}});
                } else {
                    throw new BadRequestError("Address not found for current user pls write address first");
                }
            }
        }
    }


    static async couponSuggestion(req: any, id: any) {
        const order = await Order.findOne({ _id: new mongoose.Types.ObjectId(id) })
        const orderProductData = await OrderProduct.find({ orderId: new mongoose.Types.ObjectId(id) }).populate({
            path: 'productId', populate: {
                path: 'productSubCategoryId', populate: {
                    path: 'productCategoryId'
                }
            }
        })

        if (order) {
            var orderProductId: any[] = [];
            var orderProductSubId: any[] = [];
            var orderProductCatId: any[] = [];
            orderProductData.map((e: any) => {
                orderProductId.push(e.productId._id);
                if (e.productId.productSubCategoryId._id !== undefined) {
                    orderProductSubId.push(e.productId.productSubCategoryId._id);
                    if (e.productId.productSubCategoryId.productCategoryId._id !== undefined) {
                        orderProductCatId.push(e.productId.productSubCategoryId.productCategoryId._id);
                    }
                }
            })

            const price = order.payableAmount;
            if (price === undefined || price === null) {
                throw new BadRequestError('price is not defiend');
            }
            const couponMappingData = await CouponMapping.aggregate([
                {
                    $match:
                    {
                        $or: [
                            {
                                $and: [{ isCustomer: true }, { baseId: new mongoose.Types.ObjectId(req.currentUser.id) }]
                            },
                            {
                                $and: [{ isProduct: true }, { baseId: { $in: orderProductId } }]
                            },
                            {
                                $and: [{ isProductSubCategory: true }, { baseId: { $in: orderProductSubId } }]
                            },
                            {
                                $and: [{ isProductCategory: true }, { baseId: { $in: orderProductCatId } }]
                            }
                        ]
                    }
                },
                { $group: { _id: '$couponId' } }
            ]);

            var couponIdArr: any[] = []

            couponMappingData.map((e) => {
                couponIdArr.push(e._id);
            })

            const couponData = await Coupon.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                $or: [
                                    { _id: { $in: couponIdArr } },
                                    { $and: [{ minOrderAmount: { $lte: Number(price) } }, { createdFor: { $eq: 'isGeneral' } }] }]
                            },
                            { isActive: true }
                        ]
                    }
                },
                {
                    $project:
                    {
                        'couponId': '$_id',
                        '_id': 0,
                        'name': 1,
                        'description': 1,
                        "startDate": 1,
                        "endDate": 1,
                        "isRepeatCoupon": 1,
                        "maxUserLimit": 1,
                        "couponCode": 1,
                        "imageUrl": 1,
                        "isMonthlyActive": 1,
                        "expiryOfCoupon": {
                            "$cond": {
                                "if": { $and: [{ $lte: ['$startDate', new Date()] }, { $lte: ['$endDate', new Date()] }] },
                                "then": "expired",
                                "else": {
                                    "$cond": {
                                        "if": { $and: [{ $lte: ['$startDate', new Date()] }, { $gte: ['$endDate', new Date()] }] },
                                        "then": "ongoing",
                                        "else": "upcoming",
                                    }
                                }
                            }
                        }
                    }
                }]
            )
            var couponStrData = JSON.parse(JSON.stringify(couponData));
            var year = new Date().getFullYear();
            var month = new Date().getMonth();


            await Promise.all(couponStrData.map(async (e: any) => {
                if (e.isRepeatCoupon == false) {
                    var orderCouponData = await Order.find({ $and: [{ couponId: new mongoose.Types.ObjectId(e.couponId) }, { customerId: new mongoose.Types.ObjectId(req.currentUser.id) }] });


                    if (orderCouponData.length != 0) {
                        e.expiryOfCoupon = "Not Applicable, you already used this coupon.."
                    }
                } else {
                    var orderCouponData = await Order.find({ couponId: new mongoose.Types.ObjectId(e.couponId) });
                    if (e.maxUserLimit <= orderCouponData.length) {
                        e.expiryOfCoupon = "Oh No!! Coupon reached maximum usage limit"
                    }
                }
                if (e.isMonthlyActive == true) {
                    var orderCouponData = await Order.find({ $and: [{ couponId: new mongoose.Types.ObjectId(e.couponId) }, { createdAt: { "$gte": new Date(year, month, 1), "$lt": new Date(year, month + 1, 1) } }] });
                    if (orderCouponData.length != 0) {
                        e.expiryOfCoupon = "Not Applicable, Someone already used this coupon.."
                    }

                }
            }))

            return this.responseSuccess({ result: couponStrData });
        } else {
            throw new BadRequestError("order id is not right");
        }
    }

    static async applyCoupon(req: any) {
        const order = await Order.findOne({ _id: new mongoose.Types.ObjectId(req.body.orderId) })
        const orderProductData = await OrderProduct.find({ orderId: new mongoose.Types.ObjectId(req.body.orderId) }).populate({
            path: 'productId', populate: {
                path: 'productSubCategoryId', populate: {
                    path: 'productCategoryId'
                }
            }
        })

        if (order) {
            if(order.couponId==null){
            var orderProductId: any[] = [];
            var orderProductSubId: any[] = [];
            var orderProductCatId: any[] = [];
            orderProductData.map((e: any) => {
                orderProductId.push(e.productId._id);
                if (e.productId.productSubCategoryId._id !== undefined) {
                    orderProductSubId.push(e.productId.productSubCategoryId._id);
                    if (e.productId.productSubCategoryId.productCategoryId._id !== undefined) {
                        orderProductCatId.push(e.productId.productSubCategoryId.productCategoryId._id);
                    }
                }
            })

            const price = order.payableAmount;

            const couponData = await Coupon.findOne({
                $and: [
                    { _id: new mongoose.Types.ObjectId(req.body.couponId) },
                    { isActive: true },
                    { startDate: { "$lte": new Date() } },
                    { endDate: { '$gte': new Date() } }]
            });
            if (couponData) {
                const orderCheck = await Order.find({ couponId: new mongoose.Types.ObjectId(req.body.couponId) })
                if (couponData.isRepeatCoupon == false && orderCheck.length != 0) {
                    throw new BadRequestError("coupon repeation not possible");
                } else {
                    if (couponData.maxUserLimit <= orderCheck.length) {
                        throw new BadRequestError("coupon use accross maxUserLimit");
                    }
                    if (couponData.createdFor == "isGeneral") {
                        if (price < couponData.minOrderAmount) {
                            throw new BadRequestError("coupon is not applicable due to not match with minOrderAmount");
                        }
                    }
                    const couponMappingData = await CouponMapping.findOne({
                        $and:
                            [
                                { couponId: new mongoose.Types.ObjectId(req.body.couponId) },
                                {
                                    $or: [
                                        {
                                            $and: [{ isCustomer: true }, { baseId: new mongoose.Types.ObjectId(req.currentUser.id) }]
                                        },
                                        {
                                            $and: [{ isProduct: true }, { baseId: { $in: orderProductId } }]
                                        },
                                        {
                                            $and: [{ isProductSubCategory: true }, { baseId: { $in: orderProductSubId } }]
                                        },
                                        {
                                            $and: [{ isProductCategory: true }, { baseId: { $in: orderProductCatId } }]
                                        }
                                    ]

                                }
                            ]

                    })

                    if (couponMappingData) {

                        //APPly discount price in order

                       var couponDiscountPrice=( order.payableAmount*couponData.discountPercentage)/100;
                       couponDiscountPrice =  couponData.maxDiscountAmount>couponDiscountPrice ? couponDiscountPrice : couponData.maxDiscountAmount
                       
                       const data = await Order.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.orderId) }, {
                           
                            couponId: new mongoose.Types.ObjectId(req.body.couponId),
                            couponDiscountPrice:couponDiscountPrice,
                            payableAmount:(order.payableAmount-couponDiscountPrice)
                                
                       })
                       return this.responseSuccess();
                    } else {
                        throw new BadRequestError('coupon ID is not valid')
                    }
                }

            } else {
                throw new BadRequestError("CouponID is not exist");
            }
        }else{
            throw new BadRequestError("already one coupon is Applied");
        }
        }
        else {
            throw new BadRequestError("order id is not right");
        }
    }

    

    static async getSignleOrder(req: any, id: any) {
        const currentUserOrder = await Order.aggregate([
            { $match: { $and: [{ customerId: new mongoose.Types.ObjectId(req.currentUser.id) }, { _id: new mongoose.Types.ObjectId(id) }] } },
            {
                $lookup: {
                    from: 'orderproducts',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderProduct',
                    pipeline:[
                        {$addFields:{'orderProductId':"$_id"}}
                    ]
                },
            },
            {
                $lookup: {
                    from: 'customeraddresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'customerAddress',
                    pipeline:[
                        {$addFields:{'customerAddressId':"$_id"}}
                    ]
                }
            },
            {
                $lookup:{
                    from:"coupons",
                    localField:'couponId',
                    foreignField:'_id',
                    as:"couponData",
                    pipeline:[
                        {$addFields:{'couponId':"$_id"}}
                    ]
                }
            },
            {
                $project: {
                    "couponData.couponId":1,
                    "couponData.startDate":1,
                    "couponData.endDate":1,
                    "couponData.discountPercentage":1,
                    "couponData.name":1,
                    "couponData.imageUrl":1,
                    "couponData.couponCode":1,
                    "orderProduct.orderProductId": 1,
                    "orderProduct.productId": 1,
                    "orderProduct.productItemId": 1,
                    "orderProduct.quantity": 1,
                    "orderProduct.estimatedDeliverDate": 1,
                    "orderProduct.discountPrice": 1,
                    "orderProduct.orderProduct": 1,
                    "orderProduct.payableAmount": 1,
                    "orderProduct.addOnsId": 1,
                    "customerAddress.customerAddressId": 1,
                    "customerAddress.phoneNumber": 1,
                    "customerAddress.addressType": 1,
                    "customerAddress.addressLine1": 1,
                    "customerAddress.cityId": 1,
                    "customerAddress.stateId": 1,
                    "customerAddress.countryId": 1,
                    'orderId': '$_id',      
                    'deliveryMode': 1,
                    'payableAmount': 1,
                    'discountPrice': 1,
                    'totalPrice': 1,
                    "orderStatus":1,
                    "couponDiscountPrice":1,
                    'orderDate': '$createdAt',
                    '_id': 0,
                }
            }
        ]);
        if (currentUserOrder) {
            return this.responseSuccess({ result: currentUserOrder });
        } else {
            throw new BadRequestError("Order Not Found");
        }
    }

    static async getOrder(req: any) {
        const data = await Order.find({ customerId: req.currentUser.id });

        var orderId: any[] = [];
        data.map((e: any) => {
            orderId.push(e._id);
        })

        const orderProductData = await OrderProduct.find({ orderId: { $in: orderId } }, { _id: 1, estimatedDeliverDate: 1, productItemId: 1, productId: 1, orderStatus: 1, orderId: 1 });
        const orderProductStrData = JSON.parse(JSON.stringify(orderProductData));
        await Promise.all(orderProductStrData.map(async (e: any) => {
            e.orderProductId = e._id;
            delete e._id;
            e.orderProductStatus = e.orderStatus;
            delete e.orderStatus;
            e.orderProductDeliveredDate = e.estimatedDeliverDate;
            delete e.orderProductDeliveredDate;
            const productData = await Product.findById(e.productId);
            if (e.productItemId != null) {
                const skusData = await SKUS.findById(e.productItemId);
                if (skusData?.isVariantHasImage) {
                    e.productImage = skusData.imageUrl;
                } else {
                    e.productImage = productData?.imageUrl[0];
                }
            } else {
                e.productImage = productData?.imageUrl[0];
            }
            e.orderProductDescription = productData?.description;
            const rateData = await ProductReview.findOne({ customerId: new mongoose.Types.ObjectId(req.currentUser._id) })
            if (rateData) {
                e.isReviewByUser = true;
                e.ratingByUser = rateData.rating;
            } else {
                e.isReviewByUser = false;
                e.ratingByUser = 0;
            }

        }))
        return this.responseSuccess({ result: orderProductStrData });
    }

    static async revenue(req: any) {

        const data = await OrderProduct.aggregate([
            { $group: { _id: '$storeId' } },
        ])

        var storeData, price: number;
        var resData: { storeId: string, price: number }[] = [];
        await Promise.all(data.map(async (e: any) => {
            storeData = await OrderProduct.find({ storeId: e._id });
            price = 0;
            storeData.map((a: any) => {
                price = a.payableAmount + price;
            })
            resData.push({ storeId: e._id, price: price });
        }))
        return resData;
    }

    static async customer(req: any) {

        const data = await OrderProduct.aggregate([
            { $group: { _id: '$customerId' } },
        ])

        var storeData, price: number;
        var resData: { storeId: string, price: number }[] = [];
        await Promise.all(data.map(async (e: any) => {
            storeData = await OrderProduct.find({ storeId: e._id });
            price = 0;
            storeData.map((a: any) => {
                price = a.payableAmount + price;
            })
            resData.push({ storeId: e._id, price: price });
        }))
        return resData;
    }

    static async totalOrderFromEachBusinessCategory(req: any) {


        const data = await OrderProduct.aggregate([
            { $group: { _id: '$storeId' } },
        ])

        var storeData, count = 0;
        var storeId: string[] = [];
        var resData: any[] = [];

        //store logic 
        await Promise.all(data.map(async (e: any) => {
            storeData = await OrderProduct.find({ storeId: e._id });
            count = storeData.length;
            storeId.push(e._id);
            resData.push({ storeId: e._id, count: count });
        }))

        //business Sub category logic
        const sData = await Store.find({ _id: { $in: storeId } }).populate('businessSubCategoryId');
        var businessSubCat: any[] = [];
        var rData = JSON.parse(JSON.stringify(resData));
        await Promise.all(sData.map((e: any) => {
            rData.map((b: any) => {
                if (e._id.toHexString() == b.storeId) {
                    if (!businessSubCat.includes(e.businessSubCategoryId._id.toHexString())) {
                        businessSubCat.push(e.businessSubCategoryId._id.toHexString());
                        b.businessSubCategoryId = e.businessSubCategoryId._id.toHexString();
                    } else {
                        rData.map((a: any) => {
                            if (a.businessSubCategoryId == e.businessSubCategoryId._id.toHexString()) {
                                a.count = b.count + a.count;
                            }
                        })
                    }
                }
            })
        }))

        const removeDataArr: any[] = [];
        var counter = 0;
        rData.map((a: any) => {
            if (!a.businessSubCategoryId) {
                removeDataArr.push(counter);
            }
            counter = counter + 1;
        })

        const filterDeleteIndexOfItem = [... new Set(removeDataArr)] as any;
        const filterItemData = rData.filter(function (value: any, index: any) {
            return filterDeleteIndexOfItem.indexOf(index) == -1;
        })
        const newArr = filterItemData.map(({ storeId, ...rest }: { storeId: any }) => {
            return rest;
        });

        //business category logic
        const businessCatData = await BusinessSubCategory.find({ _id: { $in: businessSubCat } }).populate('businessCategoryId');
        var businessCat: any[] = [];
        var newResArr = JSON.parse(JSON.stringify(newArr));
        await Promise.all(businessCatData.map((e: any) => {
            newResArr.map((b: any) => {
                if (e._id.toHexString() == b.businessSubCategoryId) {
                    if (!businessCat.includes(e.businessCategoryId._id.toHexString())) {
                        businessCat.push(e.businessCategoryId._id.toHexString());
                        b.businessCategoryId = e.businessCategoryId;
                    } else {
                        newResArr.map((a: any) => {
                            if (a.businessCategoryId) {
                                if (a.businessCategoryId._id.toHexString() == e.businessCategoryId._id.toHexString()) {
                                    a.count = b.count + a.count;
                                }
                            }
                        })
                    }
                }
            })
        }))

        const removeDataArrCat: any[] = [];
        var counter1 = 0;
        newResArr.map((a: any) => {
            if (!a.businessCategoryId) {
                removeDataArrCat.push(counter1);
            }
            counter1 = counter1 + 1;
        })

        const filterDeleteIndexOfItem1 = [... new Set(removeDataArrCat)] as any;
        const filterItemData1 = newResArr.filter(function (value: any, index: any) {
            return filterDeleteIndexOfItem1.indexOf(index) == -1;
        })

        const newArrRes = filterItemData1.map(({ businessSubCategoryId, ...rest }: { businessSubCategoryId: any }) => {
            return rest;
        });
        return newArrRes;

    }

    static async totalRevnueFromEachBusinessCategory(req: any) {
        const data = await OrderProduct.aggregate([
            { $group: { _id: '$storeId' } },
        ])
        var storeIdArr: any[] = [];
        var storeData, price: number;
        var resData: { storeId: string, price: number }[] = [];
        await Promise.all(data.map(async (e: any) => {
            storeData = await OrderProduct.find({ storeId: e._id });
            price = 0;
            storeData.map((a: any) => {
                price = a.payableAmount + price;
            })
            resData.push({ storeId: e._id, price: price });
            storeIdArr.push(e._id);
        }))

        //business Sub category logic
        const sData = await Store.find({ _id: { $in: storeIdArr } }).populate('businessSubCategoryId');
        var businessSubCat: any[] = [];
        var rData = JSON.parse(JSON.stringify(resData));
        await Promise.all(sData.map((e: any) => {
            rData.map((b: any) => {
                if (e._id.toHexString() == b.storeId) {
                    if (!businessSubCat.includes(e.businessSubCategoryId._id.toHexString())) {
                        businessSubCat.push(e.businessSubCategoryId._id.toHexString());
                        b.businessSubCategoryId = e.businessSubCategoryId._id.toHexString();
                    } else {
                        rData.map((a: any) => {
                            if (a.businessSubCategoryId == e.businessSubCategoryId._id.toHexString()) {
                                a.price = b.price + a.price;
                            }
                        })
                    }
                }
            })
        }))

        const removeDataArr: any[] = [];
        var counter = 0;
        rData.map((a: any) => {
            if (!a.businessSubCategoryId) {
                removeDataArr.push(counter);
            }
            counter = counter + 1;
        })

        const filterDeleteIndexOfItem = [... new Set(removeDataArr)] as any;
        const filterItemData = rData.filter(function (value: any, index: any) {
            return filterDeleteIndexOfItem.indexOf(index) == -1;
        })
        const newArr = filterItemData.map(({ storeId, ...rest }: { storeId: any }) => {
            return rest;
        });

        //business category logic
        const businessCatData = await BusinessSubCategory.find({ _id: { $in: businessSubCat } }).populate('businessCategoryId');
        var businessCat: any[] = [];
        var newResArr = JSON.parse(JSON.stringify(newArr));
        await Promise.all(businessCatData.map((e: any) => {
            newResArr.map((b: any) => {
                if (e._id.toHexString() == b.businessSubCategoryId) {
                    if (!businessCat.includes(e.businessCategoryId._id.toHexString())) {
                        businessCat.push(e.businessCategoryId._id.toHexString());
                        b.businessCategoryId = e.businessCategoryId;
                    } else {
                        newResArr.map((a: any) => {
                            if (a.businessCategoryId) {
                                if (a.businessCategoryId._id.toHexString() == e.businessCategoryId._id.toHexString()) {
                                    a.price = b.price + a.price;
                                }
                            }
                        })
                    }
                }
            })
        }))

        const removeDataArrCat: any[] = [];
        var counter1 = 0;
        newResArr.map((a: any) => {
            if (!a.businessCategoryId) {
                removeDataArrCat.push(counter1);
            }
            counter1 = counter1 + 1;
        })

        const filterDeleteIndexOfItem1 = [... new Set(removeDataArrCat)] as any;
        const filterItemData1 = newResArr.filter(function (value: any, index: any) {
            return filterDeleteIndexOfItem1.indexOf(index) == -1;
        })

        const newArrRes = filterItemData1.map(({ businessSubCategoryId, ...rest }: { businessSubCategoryId: any }) => {
            return rest;
        });

        return newArrRes;
    }

    static async totalSaleBusinessUserBased(req: any, id: any) {

        const userData = await BusinessUser.findById(id);
        console.log("userData", userData);
        const userIdArr: any[] = [];
        const storeIdArr: any[] = [];
        var seal: number = 0;
        if (userData) {
            if (userData._id == userData.createdBy) {
                console.log('both are equal');
                const createdUser = await BusinessUser.find({ createdBy: id });
                console.log('createdUser', createdUser);

                if (createdUser) {
                    createdUser.map((e: any) => {
                        userIdArr.push(e.id);
                    })
                }
                console.log('userIdArr', userIdArr);
                const storeData = await Store.find({ createdBy: { $in: userIdArr } });
                storeData.map((e: any) => {
                    storeIdArr.push(e.id);
                })
                console.log('storeIdArr', storeIdArr);

                const orderData = await OrderProduct.find({ storeId: { $in: storeIdArr } });

                console.log('orderData', orderData);

                orderData.map((e: any) => {
                    seal = seal + Number(e.mrpPrice);
                })
                console.log('seal', seal);


            } else {

                const storeData = await Store.findById(userData.store);

                if (!storeData) {
                    throw new BadRequestError("Store Id is wrong");
                }
                const orderData = await OrderProduct.find({ storeId: storeData.id });
                orderData.map((e: any) => {
                    seal = seal + Number(e.mrpPrice);
                })
            }
            return { seal: seal };
        } else {
            throw new BadRequestError('Id is wrong');
        }

    }

    static async totalCustomerBasedBusinessUser(req: any, id: any) {
        const userData = await BusinessUser.findById(id);
        console.log("userData", userData);
        const userIdArr: any[] = [];
        const storeIdArr: any[] = [];
        const customerIdArr: any[] = [];
        if (userData) {
            if (userData._id == userData.createdBy) {
                console.log('both are equal');
                const createdUser = await BusinessUser.find({ createdBy: id });
                console.log('createdUser', createdUser);

                if (createdUser) {
                    createdUser.map((e: any) => {
                        userIdArr.push(e.id);
                    })
                }
                console.log('userIdArr', userIdArr);
                const storeData = await Store.find({ createdBy: { $in: userIdArr } });
                storeData.map((e: any) => {
                    storeIdArr.push(e.id);
                })
                console.log('storeIdArr', storeIdArr);

                const orderData = await OrderProduct.find({ storeId: { $in: storeIdArr } });

                console.log('orderData', orderData);

                orderData.map((e: any) => {
                    if (!customerIdArr.includes(e.customerId)) {
                        customerIdArr.push(e.customerId);
                    }
                })
                console.log('customerIdArr', customerIdArr);
                console.log('customerIdArr.length', customerIdArr.length);



            } else {

                const storeData = await Store.findById(userData.store);

                if (!storeData) {
                    throw new BadRequestError("Store Id is wrong");
                }
                const orderData = await OrderProduct.find({ storeId: storeData.id });
                orderData.map((e: any) => {
                    if (!customerIdArr.includes(e.customerId)) {
                        customerIdArr.push(e.customerId);
                    }
                })
                console.log('customerIdArr', customerIdArr);
                console.log('customerIdArr.length', customerIdArr.length);

            }
            return { customerCount: customerIdArr.length };
        } else {
            throw new BadRequestError('Id is wrong');
        }
    }

} 