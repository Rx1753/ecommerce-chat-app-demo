
import { Subjects,Publisher,CustomerCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class CutomerCreatedPublisher extends Publisher<CustomerCreatedEvent>{
    subject: Subjects.CustomerCreated=Subjects.CustomerCreated;
}