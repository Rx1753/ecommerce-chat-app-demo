import { Message } from "node-nats-streaming";
import { Subjects, Listener, StoreUpdatedEvent } from "@rx-ecommerce-chat/common_lib";
import { Store } from "../../models/store";
import { queueGroup } from "./queue-group-name";

export class StoreUpdatedListener extends Listener<StoreUpdatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.StoreUpdated = Subjects.StoreUpdated;
    async onMessage(data: StoreUpdatedEvent['data'], msg: Message) {
        const { id,
            phoneNumber,
            email,
            businessProfileId,
            businessSubCategoryId,
            description,
            name,
            isActive,
            createdBy } = data
        const storeData=await Store.findByIdAndUpdate(id,{phoneNumber:phoneNumber,email:email,businessProfileId:businessProfileId,businessSubCategoryId:businessSubCategoryId,description:description,name:name,isActive:isActive,createdBy:createdBy}) 
        msg.ack();
    }
}
