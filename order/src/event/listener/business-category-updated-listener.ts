import { Message } from "node-nats-streaming";
import { Subjects,Listener,BusinessCategoryUpdatedEvent } from "@rx-ecommerce-chat/common_lib";
import { BusinessCategory } from "../../models/business-category";
import { queueGroup } from "./queue-group-name";

export class BusinessCategoryUpdatedListener extends Listener<BusinessCategoryUpdatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.BusinessCategoryUpdated=Subjects.BusinessCategoryUpdated;
    async onMessage(data:BusinessCategoryUpdatedEvent['data'],msg:Message){
         const {id,name,description,isActive}=data
         const BusinessCategoryData =await BusinessCategory.findByIdAndUpdate(id,{
           name:name,
           description:description,
           isActive:isActive
         });
         msg.ack();
    }
}
    