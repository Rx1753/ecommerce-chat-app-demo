import { Message } from "node-nats-streaming";
import { Subjects,Listener,BusinessRoleTypeCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { BusinessRoleType } from "../../models/business-role-type";
import { queueGroup } from "./queue-group-name";

export class BusinessRoleCreatedListener extends Listener<BusinessRoleTypeCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.BusinessRoleTypeCreated=Subjects.BusinessRoleTypeCreated;
    async onMessage(data:BusinessRoleTypeCreatedEvent['data'],msg:Message){
         const {id,
            tableName,
            isRead,
            isCreate,
            isDelete,
            isUpdate,}=data
         const userData = BusinessRoleType.build({
            tableName:tableName,
            isRead:isRead,
            isUpdate:isUpdate,
            isCreate:isCreate,
            isDelete:isDelete 
         })
         userData._id=id
         await userData.save();
         msg.ack();
    }
}
    