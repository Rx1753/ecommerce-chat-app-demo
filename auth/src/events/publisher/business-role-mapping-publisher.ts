import { Subjects,Publisher,BBusinessRoleMappingCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class BusinessRoleMappingCreatedPublisher extends Publisher<BBusinessRoleMappingCreatedEvent>{
    subject: Subjects.BusinessRoleMappingCreated=Subjects.BusinessRoleMappingCreated;
}