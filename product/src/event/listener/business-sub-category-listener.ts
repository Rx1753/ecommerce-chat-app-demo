import { Message } from "node-nats-streaming";
import { Subjects,Listener,BusinessSubCategoryCreatedEvent } from "@rx-ecommerce-chat/common_lib";

import { queueGroup } from "./queue-group-name";
import { BusinessSubCategory } from "../../models/business-sub-category";

export class BusinessSubCategoryCreatedListener extends Listener<BusinessSubCategoryCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.BusinessSubCategoryCreated=Subjects.BusinessSubCategoryCreated;
    async onMessage(data:BusinessSubCategoryCreatedEvent['data'],msg:Message){
         const {id,name,description,isActive,businessCategoryId}=data
         const BusinessSubCategoryData = BusinessSubCategory.build({
           name:name,
           description:description,
           isActive:isActive,
           businessCategoryId:businessCategoryId
         });
         BusinessSubCategoryData._id=id;
         await BusinessSubCategoryData.save();
         msg.ack();
    }
}
    