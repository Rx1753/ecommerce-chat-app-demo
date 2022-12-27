import { Message } from "node-nats-streaming";
import { Subjects,Listener,CustomerCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { Customer } from "../../models/customer";
import { queueGroup } from "./queue-group-name";

export class CustomerCreatedListener extends Listener<CustomerCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.CustomerCreated=Subjects.CustomerCreated;
    async onMessage(data:CustomerCreatedEvent['data'],msg:Message){
         const {id,email,phoneNumber,name}=data
         const userData = Customer.build({
            email,phoneNumber,name
         })
         userData._id=id
         await userData.save();
         msg.ack();
    }
}
    