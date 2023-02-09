import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import e from 'express';
import mongoose from 'mongoose';
import { ProductCreatedPublisher } from '../event/publisher/product-publisher';
import { Attribute } from '../models/attribute';
import { AttributeValue } from '../models/attribute-value';
import { BusinessCategory } from '../models/business-category';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessSubCategory } from '../models/business-sub-category';
import { BusinessUser } from '../models/business-user';
import { Coupon } from '../models/coupon';
import { CouponMapping } from '../models/coupon-mapping';
import { Product } from "../models/product";
import { ProductCategory } from '../models/product-category';
import { ProductReview } from '../models/product-review';
import { SKUS } from '../models/product-skus';
import { ProductSubCategory } from '../models/product-sub-category';
import { ProductVariantCombination } from '../models/product-variant-combination';
import { Store } from '../models/store';
import { ProductWhishlist } from '../models/whislist-product';
import { natsWrapper } from '../nats-wrapper';

interface Iresponse {
    message?: string,
    result?: any,
    page?: number,
    total?: number
}

export class ProductDatabaseLayer {

    static responseSuccess(data: Iresponse) {
        return {
            success: true,
            page: data?.page,
            total: data?.total,
            message: data?.message || "success",
            data: data?.result,
        };
    }
    static async createProduct(req: any) {
        const { name, description, productSubCategoryId, imageUrl, storeId, brandName, warrenty, guaranty, basePrice, highlights, addOns, quantity, isInvoiceAvailable, isCancellation, relatableProducts, isDiscountPercentage, discount, maxDiscount, } = req.body;

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
                        if (e.businessRoleId.tableName == 'product' && e.businessRoleId.isCreate == true) {
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

            const ProductSubCategoryCheck = await ProductSubCategory.findOne({ $and: [{ _id: productSubCategoryId }, { isActive: true }] });
            const storeCheck = await Store.findOne({ $and: [{ _id: storeId }, { isActive: true }] });
            var productCheck = true;
            if (relatableProducts != null && relatableProducts != 'undefined' && relatableProducts) {
                await Promise.all(relatableProducts.map(async (e: any) => {

                    if (!mongoose.isValidObjectId(e)) {
                        throw new BadRequestError('Requested id is not id type');
                    }
                    const productData = await Product.findOne({ _id: e });
                    console.log('productData', productData);

                    if (!productData) {
                        productCheck = false;
                    }

                }))
            }
            if (ProductSubCategoryCheck && storeCheck && productCheck) {
                try {
                    var discountedValue: number;
                    if (isDiscountPercentage == true) {
                        discountedValue = basePrice - ((basePrice * discount) / 100);
                        if (((basePrice * discount) / 100) > maxDiscount) {
                            discountedValue = maxDiscount;
                        }
                    } else {
                        discountedValue = basePrice - (discount);
                    }

                    const data = Product.build({
                        name: name,
                        description: description,
                        productSubCategoryId: productSubCategoryId,
                        imageUrl: imageUrl,
                        storeId: storeId,
                        brandName: brandName,
                        basePrice: basePrice,
                        quantity: quantity,
                        warrenty: warrenty,
                        addOns: addOns,
                        isInvoiceAvailable: isInvoiceAvailable,
                        isCancellation: isCancellation,
                        relatableProducts: relatableProducts,
                        createdBy: req.currentUser.id,
                        isDiscountPercentage: isDiscountPercentage,
                        discount: discount,
                        discountedValue: discountedValue,
                        maxDiscount: maxDiscount,
                        highlights: highlights
                    })

                    await data.save();

                    var rProduct: string[] = [];

                    data.relatableProducts.forEach((e: any) => {
                        rProduct.push(e.toString());
                    })

                    //TODO discount add in publisher pending
                    await new ProductCreatedPublisher(natsWrapper.client).publish({
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        productSubCategoryId: data.productSubCategoryId.toString(),
                        //TODO publisher has to change string to Array
                        imageUrl: data.imageUrl[0],
                        storeId: data.storeId.toString(),
                        brandName: data.brandName,
                        basePrice: data.basePrice,
                        //TODO mrpPrice remove
                        mrpPrice: data.basePrice,
                        quantity: data.quantity,
                        createdBy: data.createdBy,
                        relatableProducts: rProduct,
                        isActive: true
                    });

                    return data;

                } catch (error: any) {
                    throw new BadRequestError(error.message);
                }
            } else {
                throw new BadRequestError("Given id is not valid");
            }
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async createProductVariant(req: any, id: string) {
        const { productId, attribute, qty, price, isVariantBasedPrice, isVariantHasImage, name, imageUrl, description } = req.body;
        var attributeArr: string[] = [];
        var attributeValueArrr: string[] = [];

        var attributeCheckArr: string[] = [];
        await Promise.all(attribute.map(async (e: any) => {
            if (e.attributeId === undefined || e.attributeId === null || e.attributeValueId === undefined || e.attributeValueId === null) {
                console.log('data not given');
                throw new BadRequestError("passed body data is insuficent")

            } else {
                if (attributeArr.includes(e.attributeId) || attributeValueArrr.includes(e.attributeValueId)) {
                    throw new BadRequestError("Attribute Id is repeating, Pls first verify it");
                } else {

                    attributeArr.push(e.attributeId);
                    attributeValueArrr.push(e.attributeValueId)

                    const attributeCheck = await AttributeValue.findOne({ $and: [{ attributeId: e.attributeId }, { _id: new mongoose.Types.ObjectId(e.attributeValueId) }] })

                    if (!attributeCheck) {
                        throw new BadRequestError("Sended Attribute Id is not valid");
                    }

                }
            }
        }))

        var skusDataCheck = await SKUS.find({ productId: productId });

        await Promise.all(skusDataCheck.map(async (e: any) => {
            console.log('e', e._id.toHexString());

            // const attributeCheckProduct=

            const productVariantCombinationData = await ProductVariantCombination.find({ productSKUsId: e._id });
            var variantArr: string[] = [];
            await Promise.all(productVariantCombinationData.map(async (b: any) => {
                variantArr.push(b.attributeValueId);
            }))
            var flag = false;
            if (variantArr.length == attributeValueArrr.length) {
                for (let i = 0; i < attributeValueArrr.length; i++) {
                    if (!variantArr.includes(attributeValueArrr[i])) {
                        flag = true;
                    }

                }
            }
            if (flag == false) {
                throw new BadRequestError("already exist attribute combination");
            }
        }))

        const skusData = SKUS.build({
            productId: productId,
            name: name,
            description: description,
            isVariantBasedPrice: isVariantBasedPrice,
            price: price,
            qty: qty,
            isVariantHasImage: isVariantHasImage,
            imageUrl: imageUrl,
        })

        await Promise.all(attribute.map(async (e: any) => {
            const productVariantCombinationData = ProductVariantCombination.build({ attributeId: e.attributeId, attributeValueId: e.attributeValueId, productSKUsId: skusData._id.toHexString() })
            await productVariantCombinationData.save();
        }))
        await skusData.save();
        return skusData;

    }

    static async updateProduct(req: any, id: string) {
        //TODO discount field add pending
        const { name, description, productSubCategoryId, imageUrl, storeId, brandName, warrenty, guaranty, basePrice, mrpPrice, addOns, quantity, isInvoiceAvailable, isCancellation, relatableProducts } = req.body;

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
                        if (e.businessRoleId.tableName == 'product' && e.businessRoleId.isUpdate == true) {
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
            const ProductSubCategoryCheck = await ProductSubCategory.findOne({ $and: [{ _id: productSubCategoryId }, { isActive: true }] });
            const storeCheck = await Store.findOne({ $and: [{ _id: storeId }, { isActive: true }] });
            var productCheck = true;
            if (relatableProducts != null && relatableProducts != 'undefined' && relatableProducts) {
                await Promise.all(relatableProducts.map(async (e: any) => {
                    if (!mongoose.isValidObjectId(e)) {
                        throw new BadRequestError('Requested id is not id type');
                    }
                    const productData = await Product.findOne({ _id: e });
                    console.log('productData', productData);

                    if (!productData) {

                        productCheck = false;
                    }
                }))
            }
            if (ProductSubCategoryCheck && storeCheck && productCheck) {
                try {
                    const data = await Product.findByIdAndUpdate(id, {
                        name: name,
                        description: description,
                        productSubCategoryId: productSubCategoryId,
                        imageUrl: imageUrl,
                        storeId: storeId,
                        brandName: brandName,
                        basePrice: basePrice,
                        mrpPrice: mrpPrice,
                        quantity: quantity,
                        warrenty: warrenty,
                        addOns: addOns,
                        isInvoiceAvailable: isInvoiceAvailable,
                        isCancellation: isCancellation,
                        relatableProducts: relatableProducts,
                    })
                    const productData = await Product.findById(id)
                    return productData;
                } catch (error: any) {
                    throw new BadRequestError(error.message);
                }
            } else {
                throw new BadRequestError("Given id is not valid");
            }
        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async deleteProduct(req: any, id: string) {

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
                        if (e.businessRoleId.tableName == 'product' && e.businessRoleId.isDelete == true) {
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
                const data = await Product.findById(id).populate('storeId')
                if (data) {
                    const status = data.isActive ? false : true;

                    if (status) {
                        const storeCheck = await Store.findOne({ $and: [{ _id: data.storeId.id }, { isActive: true }] })
                        if (!storeCheck) {
                            throw new BadRequestError("store is deactivted, not possible to product activation");
                        }
                    }
                    await Product.findByIdAndUpdate(id, { isActive: status });
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

    static async getProductList(req: any) {
        var pageSize: any = (req.query.pagesize);
        var page: any = (req.query.page);
        var sortBy: any = req.query.sortby === undefined || req.query.sortby === null ? null : req.query.sortby;
        console.log('sortBy', sortBy);

        var sort: any;
        console.log('sortBy', sortBy);
        if (sortBy === "LTH") {
            sort = { 'basePrice': 1 };
        } else if (sortBy === "HTL") {
            sort = { 'basePrice': -1 };
        } else if (sortBy === "NewFirst") {
            sort = { createdAt: -1 }
        } else if (sortBy === "Popularity") {
            sort = { rating: -1 };
        } else {
            sort = { _id: -1 };
        }

        var totalPage: number;

        if ((pageSize === undefined || pageSize === null) && (page === undefined || page === null)) {
            throw new BadRequestError("PageSize and page is not passed in query params")
        }
        const dataLength = await Product.find({ $and: [{ isActive: true }, { quantity: { $gte: 0 } }] });

        const data = await Product.aggregate([{ $match: { $and: [{ isActive: true }, { quantity: { $gte: 0 } }] } },
        {
            "$sort": sort,
        },
        {
            "$project": {
                "productId": "$_id",
                "productTitle": "$name",
                "productShortDescription": "$description",
                "originalPrice": "$basePrice",
                "discountedPrice": "$discountedValue",
                "discountPercentage": "$discount",
                "imageUrl": 1,
                "rating": 1,
                "_id": 0
            }
        }]).skip((parseInt(pageSize) * (parseInt(page) - 1))).limit(parseInt(pageSize));

        totalPage = Math.round(dataLength.length / pageSize);
        console.log('data', data.length);

        if (data) {
            const dataStr = JSON.parse(JSON.stringify(data));
            await Promise.all(dataStr.map(async (e: any) => {
                if (req.currentUser) {
                    const wishData = await ProductWhishlist.findOne({ $and: [{ productId: e.ProductId }, { customerId: req.currentUser.id }] });
                    e.isInWishList = wishData ? true : false;
                } else {
                    e.isInWishList = false;
                }
                const productSkusData = await SKUS.findOne({ productId: e.productId });
                if (productSkusData) {
                    e.productIteamId = productSkusData._id;
                    e.productImage = productSkusData.imageUrl;
                } else {
                    e.productIteamId = null;
                    e.productImage = e.imageUrl[0];
                }

                const reviewData = await ProductReview.find({ productId: e.ProductId });
                e.totalRating = reviewData.length;

                delete e['imageUrl'];
            }))
            return this.responseSuccess({ total: totalPage, page: page, result: dataStr });
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }

    static async getProductCategoryIdList(req: any, id: any) {
        const data = await Product.find({ productSubCategoryId: id }).populate({
            path: 'productSubCategoryId', populate: {
                path: 'productCategoryId'

            }
        }).populate('storeId').populate('relatableProducts');
        if (data.length != 0) {
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }

    static async getActiveProductList() {
        const data = await Product.find({ isActive: true }).populate({
            path: 'productSubCategoryId', populate: {
                path: 'productCategoryId'

            }
        }).populate('storeId').populate('relatableProducts');
        return data;
    }

    static async getDeactiveProductList() {
        const data = await Product.find({ isActive: false }).populate({
            path: 'productSubCategoryId', populate: {
                path: 'productCategoryId'

            }
        }).populate('storeId').populate('relatableProducts');
        return data;
    }

    static async getProductWithAddOnsAndProductItem(req: any) {
        const productData = await Product.aggregate([
            { "$addFields": { "pId": { "$toString": "$_id" } } },
            {
                $lookup:
                {
                    from: 'productitems',
                    localField: 'pId',
                    foreignField: 'productId',
                    as: 'productItem'
                }
            },
            {
                $lookup:
                {
                    from: 'addons',
                    localField: 'pId',
                    foreignField: 'productId',
                    as: 'addons'
                }
            }
        ])
        return productData;
    }

    static async getProductDetails(req: any, id: any) {

        const data = await Product.aggregate([
            { $match: { $and: [{ isActive: true }, { _id: new mongoose.Types.ObjectId(id) }, { quantity: { $gte: 0 } }] } },
            {
                "$project": {
                    "productId": "$_id",
                    "productName": "$name",
                    "productShortDescription": "$description",
                    "imageUrl": 1,
                    "originalPrice": "$basePrice",
                    "discountedPrice": "$discountedValue",
                    "discountPercentage": "$discount",
                    "productHighlights": "$highlights",
                    "rating": 1,
                    "_id": 0
                }
            }
        ]);

        if (data.length!=0) {
            var dataStr = JSON.parse(JSON.stringify(data[0]));
            if (req.currentUser) {
                const wishData = await ProductWhishlist.findOne({ $and: [{ productId: id }, { customerId: req.currentUser.id }] });
                dataStr.isInWishList = wishData ? true : false;
                const reviewData = await ProductReview.find({ productId: dataStr.ProductId });
                dataStr.totalRating = reviewData.length;
            } else {
                dataStr.isInWishList = false;
            }
            dataStr.productImages = dataStr.imageUrl;
            delete dataStr['imageUrl'];
            dataStr.review = await this.reviewBasedOnProductId(id);
            return dataStr

        } else {
            throw new BadRequestError("product id is not valid");
        }
    }

    static async serchData(req: any) {
        const serchData = (req.params.data).trim();

        console.log('req.params.data', req.params.data);

        const businessCategoryArr: any[] = [], businessSubCategoryArr: any[] = [], productCategoryArr: any[] = [], productSubCategoryArr: any[] = [];
        const businessCategory = await BusinessCategory.find({ name: { $regex: `^${serchData}`, $options: 'i' } });
        businessCategory.map((e: any) => {
            businessCategoryArr.push(e._id);
        })

        const businessSubCategory = await BusinessSubCategory.find({ $or: [{ name: { $regex: `^${serchData}`, $options: 'i' } }, { businessCategoryId: { $in: businessCategoryArr } }] })
        businessSubCategory.map((e: any) => {
            businessSubCategoryArr.push(e._id);
        })

        const productCategory = await ProductCategory.find({ $or: [{ name: { $regex: `^${serchData}`, $options: 'i' } }, { businessSubCategoryId: { $in: businessSubCategoryArr } }] })
        productCategory.map((e: any) => {
            productCategoryArr.push(e._id);
        })

        const productSubCategory = await ProductSubCategory.find({ $or: [{ name: { $regex: `^${serchData}`, $options: 'i' } }, { productCategoryId: { $in: productCategoryArr } }] })
        productSubCategory.map((e: any) => {
            productSubCategoryArr.push(e._id);
        })

        const product = await Product.find({
            $or:
                [{ name: { $regex: `^${serchData}`, $options: 'i' } },
                { description: { $regex: `^${serchData}`, $options: 'i' } },
                { brandName: { $regex: `^${serchData}`, $options: 'i' } },
                { productSubCategoryId: productSubCategoryArr }]
        })
            .populate({
                path: 'productSubCategoryId', populate: {
                    path: 'productCategoryId', populate: {
                        path: 'businessSubCategoryId', populate: {
                            path: 'businessCategoryId'
                        }
                    }
                }
            })

        return product;

    }

    static async reviewBasedOnProductId(id: any) {
        const data = await Product.findById(id);
        if (data) {
            const reviewData = await ProductReview.find({ productId: id }).populate('customerId');
            const totalReviews = reviewData.length;

            //Specific Rating aggregatre

            const specificRating = {
                "5": 0,
                "4": 0,
                "3": 0,
                "2": 0,
                "1": 0
            };
            const reviewStrData = JSON.parse(JSON.stringify(reviewData));
            var totalNumberImages = 0;

            var reviewImages: { productImage: string, rating: any, reviewTitle: string, reviewDescription: string, postedBy: string, reviewDate: Date }[] = [];
            var reviewsByUser: { rating: any, reviewTitle: string, reviewDescription: string, reviewImageUrl: string[], postedBy: string, reviewDate: Date }[] = []
            await Promise.all(reviewStrData.map((e: any) => {

                if (e.rate > 0 && e.rate <= 0.9) {
                    specificRating[1] = specificRating[1] + 1;
                } else if (e.rate >= 1 && e.rate <= 1.9) {
                    specificRating[2] = specificRating[2] + 1;
                } else if (e.rate >= 2 && e.rate <= 2.9) {
                    specificRating[3] = specificRating[3] + 1;
                } else if (e.rate >= 3 && e.rate <= 3.9) {
                    specificRating[4] = specificRating[4] + 1;
                } else if (e.rate >= 4 && e.rate <= 5) {
                    specificRating[5] = specificRating[5] + 1;
                }
                reviewsByUser.push({
                    rating: e.rate,
                    reviewTitle: e.title,
                    reviewDescription: e.comment,
                    postedBy: e.customerId.name,
                    reviewDate: new Date(e.createdAt),
                    reviewImageUrl: e.imageURL
                })
                if (e.imageURL.length != 0 && e.imageURL !== undefined) {
                    e.imageURL.map((a: any) => {
                        totalNumberImages = totalNumberImages + 1;
                        reviewImages.push({
                            productImage: a,
                            rating: e.rate,
                            reviewTitle: e.title,
                            reviewDescription: e.comment,
                            postedBy: e.customerId.name,
                            reviewDate: new Date(e.createdAt)
                        })
                    })
                }
            }))
            // at signle API
            return (this.responseSuccess({ result: { totalReviews: totalReviews, specificRating: specificRating, reviewImages: reviewImages, totalNumberImages: totalNumberImages, reviewsByUser: reviewsByUser } }));
            // function calling
            return (this.responseSuccess({ result: { totalReviews: totalReviews, specificRating: specificRating, reviewImages: reviewImages, totalNumberImages: totalNumberImages, reviewsByUser: reviewsByUser } }));
        } else {
            throw new BadRequestError("product id is not valid");
        }
    }

    static async getProduct(req: any) {

        //main logic of getting product data with thier attribue variant
        const data = await Product.aggregate([
            {
                "$lookup": {
                    "from": "skus",
                    "let": { "proId": "$_id" },
                    "pipeline": [
                        { "$match": { "$expr": { "$eq": ["$productId", "$$proId"] } } },
                        {
                            "$lookup": {
                                "from": "productvariantcombinations",
                                "let": { "pSKUsId": '$_id' },
                                "pipeline": [
                                    { "$match": { "$expr": { "$eq": ['$productSKUsId', "$$pSKUsId"] } } },
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
                                    }
                                ],
                                "as": "productVariantData"
                            }
                        }
                    ],
                    "as": "SKUsId"
                }
            }
        ])
        return data;
    }

    static async getProductWithVariant(req: any) {

        const data = await Product.aggregate([
            {
                "$lookup": {
                    "from": "skus",
                    "let": { "proId": "$_id" },
                    "pipeline": [
                        { "$match": { "$expr": { "$eq": ["$productId", "$$proId"] } } },
                        {
                            "$lookup": {
                                "from": "productvariantcombinations",
                                "let": { "pSKUsId": '$_id' },
                                "pipeline": [
                                    { "$match": { "$expr": { "$eq": ['$productSKUsId', "$$pSKUsId"] } } },
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
                                    }
                                ],
                                "as": "productVariantData"
                            }
                        }
                    ],
                    "as": "ProductIteamData"
                }
            },
            {
                $project: {

                    "createdAt": 0,
                    "updatedAt": 0,
                    "__v": 0,

                    "ProductIteamData.__v": 0,
                    "ProductIteamData.createdAt": 0,
                    "ProductIteamData.updatedAt": 0,
                    "ProductIteamData.isVariantBasedPrice": 0,
                    "ProductIteamData.isVariantHasImage": 0,
                    "ProductIteamData.productVariantData.__v": 0,
                    "ProductIteamData.productVariantData.createdAt": 0,
                    "ProductIteamData.productVariantData.updatedAt": 0,
                    "ProductIteamData.productVariantData._id": 0,


                    "ProductIteamData.productVariantData.attributevaluesData.__v": 0,
                    "ProductIteamData.productVariantData.attributevaluesData.createdAt": 0,
                    "ProductIteamData.productVariantData.attributevaluesData.updatedAt": 0,
                    "ProductIteamData.productVariantData.attributevaluesData._id": 0,

                    "ProductIteamData.productVariantData.attributevaluesData.attributeData.__v": 0,
                    "ProductIteamData.productVariantData.attributevaluesData.attributeData.createdAt": 0,
                    "ProductIteamData.productVariantData.attributevaluesData.attributeData.updatedAt": 0,
                    "ProductIteamData.productVariantData.attributevaluesData.attributeData._id": 0,
                    "ProductIteamData.productVariantData.productSKUsId": 0,
                    "ProductIteamData.productVariantData.attributeId": 0,


                }
            }
        ])
        return data;

    }

    static async getProductVariant(req: any, id: any,pId?:any) {
        if(id!=null && id!=undefined){
            
        }
        const data = await SKUS.findById(id);
        var skusIdArr: string[] = [];
        var productAttributeValueIdArr: any[] = [];
        var productAttributeIdArr: any[] = [];

        if (data) {
            const productData = await Product.aggregate([
                { $match: { $and: [{ isActive: true }, { _id: new mongoose.Types.ObjectId(data.productId.toString()) }, { quantity: { $gte: 0 } }] } },
                {
                    "$project": {
                        "productId": "$_id",
                        "productName": "$name",
                        "productShortDescription": "$description",
                        "imageUrl": 1,
                        "originalPrice": "$basePrice",
                        "discountedPrice": "$discountedValue",
                        "discountPercentage": "$discount",
                        "productHighlights": "$highlights",
                        "relatableProducts": 1,
                        "rating": 1,
                        "_id": 0
                    }
                }
            ]);

            if (productData.length!=0) {
                const productSkusData = await SKUS.find({ productId: productData[0].productId });
                // console.log('productSkusData', productSkusData);

                await Promise.all(productSkusData.map((e: any) => {
                    skusIdArr.push(e._id)
                }))

                const productAttributValueData = await ProductVariantCombination.aggregate([
                    { $match: { productSKUsId: { $in: skusIdArr } } },
                    { $group: { _id: '$attributeValueId' } }
                ])
                // console.log('productAttributValueData', productAttributValueData);


                await Promise.all(productAttributValueData.map((e: any) => {
                    productAttributeValueIdArr.push(new mongoose.Types.ObjectId(e._id));

                }))

                const productAttributeData = await AttributeValue.aggregate([
                    { $match: { _id: { $in: productAttributeValueIdArr } } },
                    { $group: { _id: '$attributeId' } }
                ])

                await Promise.all(productAttributeData.map((e: any) => {
                    productAttributeIdArr.push(new mongoose.Types.ObjectId(e._id));
                }))

                const attributeData = await Attribute.aggregate([
                    { $match: { _id: { $in: productAttributeIdArr } } },
                    {
                        $lookup: {
                            from: 'attributevalues',
                            let: { "aId": '$_id' },
                            pipeline: [
                                { $match: { $and: [{ $expr: { "$eq": [{ "$toObjectId": "$attributeId" }, "$$aId"] } }, { '_id': { $in: productAttributeValueIdArr } }] } },
                            ],
                            as: 'attributeValues',
                        },

                    },
                    {
                        $project: {
                            '__v': 0,
                            'createdAt': 0,
                            'updatedAt': 0,
                            'attributeValues.__v': 0,
                            'attributeValues.createdAt': 0,
                            'attributeValues.updatedAt': 0,
                            'attributeValues.attributeId': 0,
                        }
                    }
                ])
                const attributeStrData = JSON.parse(JSON.stringify(attributeData));
                await Promise.all(attributeStrData.map(async (e: any) => {
                    e.attributeId = e._id
                    delete e['_id'];
                    await Promise.all(e.attributeValues.map(async (b: any) => {
                        const p = await ProductVariantCombination.findOne({ $and: [{ productSKUsId: { $in: skusIdArr } }, { attributeValueId: b._id }] }).populate('productSKUsId');
                        b.attributeValueId = b._id
                        delete b['_id'];
                        if (p) {
                            b.attributeValueTitle = p.productSKUsId.name;
                            b.attributeValueDescription = p.productSKUsId.description;
                            b.attributeValueImage = p.productSKUsId.imageUrl;
                            b.isSelected = p.productSKUsId._id == id ? true : false
                        }
                    }))
                }))

                var dataStr = JSON.parse(JSON.stringify(productData[0]));
                dataStr.productIteamId = id;
                if (req.currentUser) {
                    const wishData = await ProductWhishlist.findOne({ $and: [{ productId: id }, { customerId: req.currentUser.id }] });
                    dataStr.isInWishList = wishData ? true : false;
                } else {
                    dataStr.isInWishList = false;
                }

                var similarProductArr: any[] = [];
                await Promise.all(productData[0].relatableProducts.map((e: any) => {
                    similarProductArr.push(new mongoose.Types.ObjectId(e));
                }))
                console.log('similarProductArr', similarProductArr);

                dataStr.productImages = dataStr.imageUrl;
                delete dataStr['imageUrl'];

                const productSimilarData = await Product.aggregate([
                    { $match: { _id: { $in: similarProductArr } } },
                    {
                        "$project": {
                            "productId": "$_id",
                            "productTitle": "$name",
                            "imageUrl": 1,
                            "originalPrice": "$basePrice",
                            "discountedPrice": "$discountedValue",
                            "discountPercentage": "$discount",
                            "rating": 1,
                            "_id": 0
                        }
                    }
                ]);
                dataStr.review = await this.reviewBasedOnProductId(productData[0].productId);
                dataStr.similarProduct = productSimilarData;
                dataStr.attributes = attributeStrData;
                return this.responseSuccess({ result: dataStr });
            }
        } else {
            throw new BadRequestError("ProductIteamId is not valid");
        }

    }

    static async checkProductCombination(req: any) {
        const productIteamId = req.query.productIteamId;

        const attribute = req.query.attribute;

        //TODO query params logic pending
        const attributeData = [{ attributeId: "63da6fab9dac386f5fcbdb21", attributeValueId: "63da6fb19dac386f5fcbdb24" }, { attributeId: "63da6fc09dac386f5fcbdb2c", attributeValueId: "63da6fcc9dac386f5fcbdb32" }];
        var attributeArr: string[] = [];
        attributeData.map((e: any) => {
            if (!attributeArr.includes(e.attributeValueId)) {
                attributeArr.push(e.attributeValueId);
            } else {
                throw new BadRequestError("passed AttributeValueId is duplicated");
            }
        })

        if (productIteamId === undefined || productIteamId === null || attribute === undefined || attribute === null) {
            throw new BadRequestError("productIteam or attribute undefiend");
        }

        if (!mongoose.isValidObjectId(productIteamId)) {
            throw new BadRequestError('productIteamId is not mongoes Id type');
        }
        var attributeValueResult: any[] = [];
        var returnProductIteamId: any[] = [];
        const productSKUsData = await SKUS.findById({ _id: productIteamId });
        if (productSKUsData) {

            //TODO qty check is pending
            const producData = await SKUS.find({ productId: productSKUsData.productId });
            await Promise.all(producData.map(async (e: any) => {
                const productCombination = await ProductVariantCombination.find({ $and: [{ productSKUsId: e._id }, { attributeValueId: { $in: attributeArr } }] });
                attributeValueResult = [];
                if (attributeData.length == productCombination.length) {
                    returnProductIteamId.push(e._id);
                }
            }))
            if (returnProductIteamId.length == 0) {
                return { message: 'attribute combination is not possible' };
            }

            //productIteamId based combination check
            const d = await this.getProductVariant(req, returnProductIteamId[0],null);
            return d;

        } else {
            throw new BadRequestError("ProductIteamId is not valid");
        }
    }

    static async couponSuggestionBasedOnProduct(req: any, id: any) {
        
        const producData = await Product.findById(id).populate({
            path: 'productSubCategoryId', populate: {
                path: 'productCategoryId'
            }
        })

        console.log('producData', producData);

        const couponMappingData = await CouponMapping.aggregate([{
            $match: {
                $or:
                    [{ $and: [{ isProduct: true }, { baseId: new mongoose.Types.ObjectId(id) }] },
                    { $and: [{ isProductSubCategory: true }, { baseId: producData?.productSubCategoryId._id }] },
                    { $and: [{ isProductCategory: true }, { baseId: producData?.productSubCategoryId.productCategoryId._id }] }]
            }
        },
        { $group: { _id: '$couponId' } }
        ])

        var couponIdArr:any[]=[];

        couponMappingData.map((e:any)=>{
            couponIdArr.push(e._id);
        })

        const couponData= await Coupon.find({$and:[{_id:{$in:couponIdArr}},{ startDate: { "$lte": new Date() } }, { endDate: { '$lte': new Date() } }]})

        return couponData
    }
}