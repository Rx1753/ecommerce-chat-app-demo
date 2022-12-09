import { Message } from "node-nats-streaming";
import { Subjects,Listener,BusinessCategoryCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { BusinessCategory } from "../../models/business-category";
import { queueGroup } from "./queue-group-name";

export class BusinessCategoryCreatedListener extends Listener<BusinessCategoryCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.BusinessCategoryCreated=Subjects.BusinessCategoryCreated;
    async onMessage(data:BusinessCategoryCreatedEvent['data'],msg:Message){
         const {id,name,description,isActive}=data
         const BusinessCategoryData = BusinessCategory.build({
           name:name,
           description:description,
           isActive:isActive
         });
         BusinessCategoryData._id=id;
         await BusinessCategoryData.save();
         msg.ack();
    }
}
    