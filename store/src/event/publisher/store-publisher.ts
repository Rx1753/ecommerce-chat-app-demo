import { Subjects,Publisher,StoreCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class StoreCreatedPublisher extends Publisher<StoreCreatedEvent>{
    subject: Subjects.StoreCreated=Subjects.StoreCreated;
}