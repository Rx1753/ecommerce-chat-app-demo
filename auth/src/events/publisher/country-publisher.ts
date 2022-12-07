import { Subjects,Publisher,CountryCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class CountryCreatedPublisher extends Publisher<CountryCreatedEvent>{
    subject: Subjects.CountryCreated=Subjects.CountryCreated;
}