import { Message } from "node-nats-streaming";
import { Subjects,Listener,BusinessUserCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { BusinessUser } from "../../models/business-user";
import { queueGroup } from "./queue-group-name";

export class BusinessUserCreatedListener extends Listener<BusinessUserCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.BusinessUserCreated=Subjects.BusinessUserCreated;
    async onMessage(data:BusinessUserCreatedEvent['data'],msg:Message){
         const {id,version,email,phoneNumber, name,isMFA,isEmailVerified,isPhoneVerified,isActive,createdBy,refreshToken}=data
         const ticket = BusinessUser.build({
            id,email,phoneNumber, name,isMFA,isEmailVerified,isPhoneVerified,createdBy       
         })
         ticket.refreshToken=refreshToken;
         await ticket.save();
         msg.ack();
    }
}
    