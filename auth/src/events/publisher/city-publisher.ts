import { Subjects,Publisher,CityCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class CityCreatedPublisher extends Publisher<CityCreatedEvent>{
    subject: Subjects.CityCreated=Subjects.CityCreated;
}