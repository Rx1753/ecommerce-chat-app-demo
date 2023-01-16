import { Message } from "node-nats-streaming";
import { Subjects,Listener,BusinessSubCategoryUpdatedEvent } from "@rx-ecommerce-chat/common_lib";
import { queueGroup } from "./queue-group-name";
import { BusinessSubCategory } from "../../models/business-sub-category";
import { ProductCategory } from "../../models/product-category";
import { ProductSubCategory } from "../../models/product-sub-category";

export class BusinessSubCategoryUpdatedListener extends Listener<BusinessSubCategoryUpdatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.BusinessSubCategoryUpdated=Subjects.BusinessSubCategoryUpdated;
    async onMessage(data:BusinessSubCategoryUpdatedEvent['data'],msg:Message){
         const {id,name,description,isActive}=data
         const catData= await BusinessSubCategory.findById(id);
         const BusinessCategoryData =await BusinessSubCategory.findByIdAndUpdate(id,{
           name:name,
           description:description,
           isActive:isActive
         });
         if(catData?.isActive!=isActive){
            const productCatData=await ProductCategory.find({businessSubCategoryId:id});
            await ProductCategory.updateMany({businessSubCategoryId:id},{$set:{isActive:isActive}});
            productCatData.forEach(async (e:any)=>{
                await ProductSubCategory.updateMany({productCategoryId:e._id},{$set:{isActive:isActive}});
            })
         }
         msg.ack();
    }
}
    
    