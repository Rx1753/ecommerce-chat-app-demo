import { Subjects,Publisher,CustomerAddressCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class CustomerAddressCreatedPublisher extends Publisher<CustomerAddressCreatedEvent>{
    subject: Subjects.CustomerAddressCreated=Subjects.CustomerAddressCreated;
}