import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import mongoose from 'mongoose';
import { ProductCreatedPublisher } from '../event/publisher/product-publisher';
import { BusinessCategory } from '../models/business-category';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessSubCategory } from '../models/business-sub-category';
import { BusinessUser } from '../models/business-user';
import { Product } from "../models/product";
import { ProductCategory } from '../models/product-category';
import { ProductReview } from '../models/product-review';
import { ProductSubCategory } from '../models/product-sub-category';
import { Store } from '../models/store';
import { ProductWhishlist } from '../models/whislist-product';
import { natsWrapper } from '../nats-wrapper';

export class ProductDatabaseLayer {

    static async createProduct(req: any) {
        const { name, description, productSubCategoryId, imageUrl, storeId, brandName, warrenty, guaranty, basePrice, mrpPrice, addOns, quantity, isInvoiceAvailable, isCancellation, relatableProducts } = req.body;

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
                    const data = Product.build({
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
                        createdBy: req.currentUser.id
                    })
                    await data.save();
                    var rProduct: string[] = [];
                    data.relatableProducts.forEach((e: any) => {
                        rProduct.push(e.toString());
                    })
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
                        mrpPrice: data.mrpPrice,
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

    static async updateProduct(req: any, id: string) {
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
        var sortBy: any = req.query.sortby;

        console.log('pageSize', pageSize);
        console.log('page', page);



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
        }

        var totalPage: number;

        if ((pageSize === undefined || pageSize === null) && (page === undefined || page === null)) {
            throw new BadRequestError("PageSize and page is not passed in query params")
        }
        const dataLength = await Product.find({ $and: [{ isActive: true }, { quantity: { $gte: 0 } }] });
        console.log('sort', sort);

        const data = await Product.aggregate([{ $match: { $and: [{ isActive: true }, { quantity: { $gte: 0 } }] } },
        {
            "$sort": sort,
        },
        {
            "$project": {
                "productId": "$_id",
                "productTitle": "$name",
                "productShortDescription": "$description",
                "imageUrl": 1,
                "basePrice": 1,
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
                const reviewData = await ProductReview.find({ productId: e.ProductId });
                e.totalRating = reviewData.length;
                e.productImage = e.imageUrl[0];
                delete e['imageUrl'];
            }))
            return {
                page: page,
                totalPage: totalPage,
                result: dataStr
            };
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

    static async getProductDetails(req:any,id:any){

        const data = await Product.findById(id);
        if(data){
            var dataStr=JSON.parse(JSON.stringify(data));
            if (req.currentUser) {
                const wishData = await ProductWhishlist.findOne({ $and: [{ productId: id }, { customerId: req.currentUser.id }] });
                dataStr.isInWishList = wishData ? true : false;
            } else {
                dataStr.isInWishList = false;
            }
        }else{
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
            var reviewsByUser: { rating: any, reviewTitle: string, reviewDescription: string,reviewImageUrl:string[],  postedBy: string, reviewDate: Date }[] = []
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
                    reviewImageUrl:e.imageURL
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

            return { totalReviews: totalReviews, specificRating: specificRating, reviewImages: reviewImages, totalNumberImages: totalNumberImages, reviewsByUser:reviewsByUser };
        } else {
            throw new BadRequestError("product id is not valid");
        }
    }
}