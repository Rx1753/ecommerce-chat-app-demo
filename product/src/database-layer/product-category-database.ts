import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { AdminUser } from '../models/admin-user';
import { BusinessCategory } from '../models/business-category';
import { BusinessSubCategory } from '../models/business-sub-category';
import { ProductCategory } from "../models/product-category";
import { ProductSubCategory } from '../models/product-sub-category';

export class ProductCategoryDatabaseLayer {

    static async createProductCategory(req: any) {
        const { name, description, businessSubCategoryId } = req.body;
        const businessSubCategoryCheck = await BusinessSubCategory.findById(businessSubCategoryId);
        if (businessSubCategoryCheck) {
            const data = ProductCategory.build({
                name: name,
                description: description,
                isActive: true,
                businessSubCategoryId:businessSubCategoryId
            });
            console.log(data);
            await data.save();
            return data;
        } else {
            throw new BadRequestError('Provided Business Sub Category is not valid');
        }
    }

    static async updateProductCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        const businessSubCategoryCheck = await BusinessSubCategory.findById(req.body.businessSubCategoryId);
        if (businessSubCategoryCheck) {
            try {
                await ProductCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, businessSubCategoryId: req.body.businessSubCategoryId, updateAt: updatedAt });
                return;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided Business Sub Category is not valid');
        }
    }

    static async deleteProductCategory(id: string) {
        try {
            const data=await ProductCategory.findById(id);
            if(data){
                const status=data.isActive ? false : true;
                await ProductCategory.findByIdAndUpdate(id,{isActive:status});
                await ProductSubCategory.updateMany({productCategoryId:id},{$set:{isActive:status}});
                return;
            }else{
                throw new BadRequestError('Data not found for given id');
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getProductCategoryList(req: any) {
        const data = await ProductCategory.find()
            .populate({
                path: 'businessSubCategoryId', populate: {
                    path: 'businessCategoryId'
                }
            });
        return data;
    }
    
    static async getProductCategoryId(req: any,id:any) {
        const data=await ProductCategory.findById(id).populate({
            path: 'businessSubCategoryId', populate: {
                path: 'businessCategoryId'
            }
        });;
        if(data){
            return data;
        }else{
            throw new BadRequestError('Data not found for given id');
        }
    }
    
    static async getBusinessCategoryIdList(req: any,id:any) {
        const data = await ProductCategory.find({businessSubCategoryId:id})
            .populate({
                path: 'businessSubCategoryId', populate: {
                    path: 'businessCategoryId'
                }
            });
        return data;
    }

    static async categoryCheck(req:any):Promise<any>{
        const data = await AdminUser.findById(req.currentUser.id).populate('permissionId._id');
        var dataPermission:any;
        if(data?.isSuperAdmin==true){
            return data;
        }
        if(data?.permissionId){
            data.permissionId.map((e:any)=>{
                if(e._id.tableName=="category"){
                 dataPermission= e._id;
                }
            })
        }
        if(dataPermission){
            return dataPermission;
        }else{
            throw new BadRequestError('Not wrights of category table')
        }
    }
    static async getProductCategoryActiveList(req: any) {
        const data = await ProductCategory.find({isActive:true}).populate({
            path: 'businessSubCategoryId', populate: {
                path: 'businessCategoryId'
            }
        });;
        return data;
    }
    
}