import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import mongoose from 'mongoose';
import { ProductCreatedPublisher } from '../event/publisher/product-publisher';
import { BusinessCategory } from '../models/business-category';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessSubCategory } from '../models/business-sub-category';
import { BusinessUser } from '../models/business-user';
import { Product } from "../models/product";
import { ProductCategory } from '../models/product-category';
import { ProductSubCategory } from '../models/product-sub-category';
import { Store } from '../models/store';
import { ProductWhishlist } from '../models/whislist-product';
import { natsWrapper } from '../nats-wrapper';

export class ProductDatabaseLayer {

    static async createProduct(req: any) {
        const { name, description, productSubCategoryId, imageUrl, storeId, brandName, warrenty, guaranty, basePrice, mrpPrice, addOns, quantity, isInvoiceAvailable,  isCancellation, relatableProducts,attributeVariant } = req.body;

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
        const { name, description, productSubCategoryId, imageUrl, storeId, brandName, warrenty, guaranty, basePrice, mrpPrice, addOns, quantity, isInvoiceAvailable,  isCancellation, relatableProducts } = req.body;

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
        const data = await Product.find().populate({
            path: 'productSubCategoryId', populate: {
                path: 'productCategoryId'

            }
        }).populate('storeId').populate('relatableProducts');
        if (data) {
        const dataStr= JSON.parse(JSON.stringify(data));
        if(req.currentUser){
            await Promise.all(dataStr.map(async (e:any)=>{
                const wishData=await ProductWhishlist.findOne({$and:[{productId:e._id},{customerId:req.currentUser.id}]});
                dataStr.isInWishList= wishData ? true : false;
            }))
        }
            return dataStr;
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
}