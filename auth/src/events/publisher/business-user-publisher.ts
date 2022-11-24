import { Subjects,Publisher,BusinessUserCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class BusinessUserCreatedPublisher extends Publisher<BusinessUserCreatedEvent>{
    subject: Subjects.BusinessUserCreated=Subjects.BusinessUserCreated;
}