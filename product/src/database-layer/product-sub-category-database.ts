import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { AdminUser } from '../models/admin-user';
import { ProductCategory } from '../models/product-category';
import { ProductSubCategory } from "../models/product-sub-category";

export class ProductSubCategoryDatabaseLayer {

    static async createProductSubCategory(req: any) {
        try {

            const { name, description, productCategoryId } = req.body;
            const productCategoryCheck = await ProductCategory.findOne({$and:[{id:productCategoryId},{isActive:true}]});
            if (productCategoryCheck) {
                const data = ProductSubCategory.build({
                    name: name,
                    description: description,
                    isActive: true,
                    productCategoryId: productCategoryId
                });
                console.log(data);
                await data.save();
                return data;
            } else {
                throw new BadRequestError('Provided Category is not valid');
            }
        } catch (e: any) {
            throw new BadRequestError(e.message);
        }
    }

    static async updateProductSubCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        const productCategoryCheck = await ProductCategory.findOne({$and:[{id:req.body.productCategoryId},{isActive:true}]});
        if (productCategoryCheck) {
            try {
                const data = await ProductSubCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, productCategoryId: req.body.productCategoryId, updateAt: updatedAt });
                
                return data;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided ProductCategory is not valid');
        }
    }

    static async deleteProductSubCategory(id: string) {
        try {
            const data = await ProductSubCategory.findById(id).populate('productCategoryId');
            
            if (data) {
                if(data.productCategoryId.isActive==false){
                    throw new BadRequestError('parent category is inactive so not possible to active this category')
                }
                const status = data.isActive ? false : true;
                await ProductSubCategory.findByIdAndUpdate(id, { isActive: status });

                return;
            } else {
                throw new BadRequestError('Data not found for given id');
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getProductSubCategoryList(req: any) {
        const data = await ProductSubCategory.find()
            .populate({
                path: 'productCategoryId', populate: {
                    path: 'businessSubCategoryId', populate: {
                        path: 'businessCategoryId'
                    }
                }
            });
        return data;
    }


    static async getProductSubCategoryId(req: any, id: any) {
        const data = await ProductSubCategory.findById(id)
            .populate({
                path: 'productCategoryId', populate: {
                    path: 'businessSubCategoryId', populate: {
                        path: 'businessCategoryId'
                    }
                }
            });
        if (data) {
            return data;
        } else {
            throw new BadRequestError('Data not found for given id');
        }
    }
    static async getProductCategoryIdList(req: any, id: any) {
        const data = await ProductSubCategory.find({ productCategoryId: id })
            .populate({
                path: 'productCategoryId', populate: {
                    path: 'businessSubCategoryId', populate: {
                        path: 'businessCategoryId'
                    }
                }
            });
        return data;
    }

    static async categoryCheck(req: any): Promise<any> {
        const data = await AdminUser.findById(req.currentUser.id).populate('permissionId._id');
        var dataPermission: any;
        if (data?.isSuperAdmin == true) {
            return data;
        }
        if (data?.permissionId) {
            data.permissionId.map((e: any) => {
                if (e._id.tableName == "category") {
                    dataPermission = e._id;
                }
            })
        }
        if (dataPermission) {
            return dataPermission;
        } else {
            throw new BadRequestError('Not wrights of category table')
        }
    }

    static async getProductSubCategoryActiveList(req: any) {
        const data = await ProductSubCategory.find({ isActive: true })
            .populate({
                path: 'productCategoryId', populate: {
                    path: 'businessSubCategoryId', populate: {
                        path: 'businessCategoryId'
                    }
                }
            });
        return data;
    }
}