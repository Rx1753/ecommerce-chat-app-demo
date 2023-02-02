import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import mongoose from 'mongoose';
import { BusinessCategoryUpdatePublisher } from '../event/publisher/business-caegory-updated-publisher';
import { BusinessCategoryCreatedPublisher } from '../event/publisher/business-category-publisher';
import { BusinessSubCategoryUpdatePublisher } from '../event/publisher/business-sub-category-updated-publisher';
import { Admin } from '../models/admin';
import { AdminRoleMapping } from '../models/admin-role-mapping';
import { BusinessCategory } from "../models/business-category";
import { BusinessSubCategory } from '../models/business-sub-category';
import { natsWrapper } from '../nats-wrapper';

export class BusinessCategoryDatabaseLayer {

    static async createBusinessCategory(req: any) {
        const { name, description, isActive } = req.body;
        const data = BusinessCategory.build({
            name: name,
            description: description,
            isActive: isActive
        });
        console.log(data);
        await data.save();
        await new BusinessCategoryCreatedPublisher(natsWrapper.client).publish({
            name: data.name,
            description: data.description,
            isActive: data.isActive,
            id: data.id.toString()
        })
        return data;

    }

    static async updateBusinessCategory(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        try {
            const data=await BusinessCategory.findById(id);
            if(data){
            await BusinessCategory.findByIdAndUpdate(id, { name: req.body.name, description: req.body.description, isActive: req.body.isActive, update_at: updatedAt });
            return;
            }else{
                throw new BadRequestError("given id is not valid")
            }
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteBusinessCategory(id: string) {
        try {
            const data = await BusinessCategory.findById(id);
            if (data) {
                const status = data.isActive ? false : true;
                const catData = await BusinessCategory.findByIdAndUpdate(id, { isActive: status });
                console.log("63da35d87d7052c0f4e63a9d")
                const businessSubCategoryData = await BusinessSubCategory.find({ businessCategoryId: id });
                await new BusinessCategoryUpdatePublisher(natsWrapper.client).publish({
                    id:id,
                    name:data.name,
                    description:data.description,
                    isActive:status
                }) 
                await BusinessSubCategory.updateMany({ businessCategoryId: new mongoose.Schema.Types.ObjectId(id) }, { $set: { isActive: status } });
                await Promise.all(businessSubCategoryData.map(async (e:any)=>{
                    console.log('businessS',e.id);
                    await new BusinessSubCategoryUpdatePublisher(natsWrapper.client).publish({
                        id: e.id,
                        name: e.name,
                        description: e.description,
                        isActive: status,
                        businessCategoryId: e.businessCategoryId
                    })
                }))
                return;
            } else {
                throw new BadRequestError('Data not found for given id');
            }
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getBusinessCategoryList(req: any) {
        const data = await BusinessCategory.find();
        return data;
    }
    static async getBusinessCategoryId(req: any, id: any) {
        const data = await BusinessCategory.findById(id);
        if (data) {
            return data;
        } else {
            throw new BadRequestError('given id type no data found in DB')
        }
    }

    static async getBusinessCategoryActiveList(req: any) {
        const data = await BusinessCategory.find({ isActive: true });
        return data;
    }

    static async categoryCheck(req: any): Promise<any> {
        const data = await Admin.findById(req.currentUser.id);
        var dataPermission: any;
        if (data?.isSuperAdmin == true) {
            return data;
        }
        const roleData = await AdminRoleMapping.find({roleId:data?.roleId}).populate('permissionId')
        if(roleData){
            roleData.map((e:any)=>{
                if(e.permissionId.tableName=="category"){
                 dataPermission= e._id;
                }
            })
        }
        if (dataPermission) {
            return dataPermission;
        } else {
            throw new BadRequestError('Not wrights of category table')
        }
    }

}