import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessUser } from '../models/business-user';
import { Product } from '../models/product';
import { AddOns } from "../models/add-ons";

export class AddOnsDatabaseLayer {

    static async createAddOns(req: any) {
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
            
            if (productCheck) {
                try {
                    const data = AddOns.build({
                        name: name,
                        description: description,
                        imageUrl: imageUrl,
                        mrpPrice: mrpPrice,
                        quantity: quantity,
                        productId: productId,
                        createdBy: req.currentUser.id
                    })
                    await data.save();
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

    static async updateAddOns(req: any, id: string) {
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
                const data = await AddOns.findByIdAndUpdate(id, {
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

    static async deleteAddOns(req:any,id: string) {
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
                const data = await AddOns.findByIdAndRemove(id)
                return data;
            } catch (error: any) {
                throw new BadRequestError(error.message);

                
            }
        }else{
            throw new BadRequestError('Permission is not for current login user');
        }
    }

    static async getAddOnsList(req: any) {
        const data = await AddOns.find().populate('productId');
        return data;
    }   

    static async getAddOnsListProductId(req: any, id: any) {
        const data = await AddOns.find({productId:id}).populate('productId');
        return data;
    }

}