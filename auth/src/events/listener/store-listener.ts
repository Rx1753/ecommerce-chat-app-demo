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
            latitude,
            longitude,
            city,
            state,
            country,
            pinCode,
            imageUrl,
            addressLine1,
            addressLine2,
            membershipId,
            welcomeMessage,
            createdBy } = data
        const StoreData = Store.build({
            phoneNumber,
            email,
            businessProfileId,
            businessSubCategoryId,
            description,
            name,
            latitude,
            longitude,
            city,
            state,
            country,
            pinCode,
            imageUrl,
            addressLine1,
            addressLine2,
            membershipId,
            welcomeMessage,
            createdBy
        })
        console.log('hii');
        
        StoreData._id = id;
        await StoreData.save();
        msg.ack();
    }
}
