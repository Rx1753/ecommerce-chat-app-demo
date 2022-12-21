import { Message } from "node-nats-streaming";
import { Subjects, Listener, StoreCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { Store } from "../../models/store";
import { queueGroup } from "./queue-group-name";

export class StoreCreatedListener extends Listener<StoreCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.StoreCreated = Subjects.StoreCreated;
    async onMessage(data: StoreCreatedEvent['data'], msg: Message) {
        const { id,
            phoneNumber,
            email,
            businessProfileId,
            businessSubCategoryId,
            description,
            name,
            isActive,
            createdBy } = data
        const StoreData = Store.build({
            phoneNumber,
            email,
            businessProfileId,
            businessSubCategoryId,
            description,
            name,
            isActive,
            createdBy
        })
        
        StoreData._id = id;
        await StoreData.save();
        msg.ack();
    }
}
