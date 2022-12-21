import { Subjects,Publisher,StoreUpdatedEvent } from "@rx-ecommerce-chat/common_lib";

export class StoreUpdatedPublisher extends Publisher<StoreUpdatedEvent>{
    subject: Subjects.StoreUpdated=Subjects.StoreUpdated;
}