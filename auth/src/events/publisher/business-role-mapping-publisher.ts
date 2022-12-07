import { Subjects,Publisher,BBusinessRoleMappingCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class BusinessRoleTypeCreatedPublisher extends Publisher<BBusinessRoleMappingCreatedEvent>{
    subject: Subjects.BusinessRoleMappingCreated=Subjects.BusinessRoleMappingCreated;
}