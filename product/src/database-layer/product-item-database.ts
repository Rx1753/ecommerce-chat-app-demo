import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { ProductItemCreatedPublisher } from '../event/publisher/product-item-publisher';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessUser } from '../models/business-user';
import { Product } from '../models/product';
import { ProductItem } from "../models/product-item";
import { natsWrapper } from '../nats-wrapper';

export class ProductItemDatabaseLayer {

    static async createProductItem(req: any) {
        const { name,
            description,
            imageUrl,
            mrpPrice,
            quantity,
            productId } = req.body;

        var permission = false;
            console.log('chdcc');
            
        if (req.currentUser.type == 'Vendor') {
            const userData = await BusinessUser.findById(req.currentUser.id);

            if (userData) {
                if (userData.id.toString() == userData.createdBy) {
                    console.log('both id is same so it\'s business profile user');
                    permission = true;
                } else {
                    const userRoleMapping = await BusinessRoleMapping.find({ businessUserId: userData.id }).populate('businessRoleId');
                    console.log('userRoleMapping',userRoleMapping);
                    
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


            const productCheck = await Product.findOne({ _id: productId });
            console.log("============================");
            
            console.log(productCheck);
            
            if (productCheck) {
                try {
                    const data = ProductItem.build({
                        name: name,
                        description: description,
                        imageUrl: imageUrl,
                        mrpPrice: mrpPrice,
                        quantity: quantity,
                        productId: productId,
                        createdBy: req.currentUser.id
                    })
                    await data.save();
                    await new ProductItemCreatedPublisher(natsWrapper.client).publish({
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        imageUrl: data.imageUrl,
                        mrpPrice: data.mrpPrice,
                        quantity: data.quantity,
                        productId: data.productId.toString(),
                        createdBy: data.createdBy
                    })
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

    static async updateProductItem(req: any, id: string) {
        const { name,
            description,
            imageUrl,
            mrpPrice,
            quantity, } = req.body;
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


            try {
                const data = await ProductItem.findByIdAndUpdate(id, {
                    name: name,
                    description: description,
                    imageUrl: imageUrl,
                    mrpPrice: mrpPrice,
                    quantity: quantity,
                })
                return data;
            } catch (error: any) {
                throw new BadRequestError(error.message);
            }

        } else {
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async deleteProductItem(req:any,id: string) {
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
                const data = await ProductItem.findByIdAndRemove(id)
                return data;
            } catch (error: any) {
                throw new BadRequestError(error.message);

                
            }
        }else{
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async getProductItemList(req: any) {
        const data = await ProductItem.find().populate('productId');
        return data;
    }   

    static async getProductItemListProductId(req: any, id: any) {
        const data = await ProductItem.find({productId:id}).populate('productId');
        return data;
    }

}