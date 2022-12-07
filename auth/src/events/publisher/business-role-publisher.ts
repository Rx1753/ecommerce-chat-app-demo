import { Subjects,Publisher,BusinessRoleTypeCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class BusinessRoleTypeCreatedPublisher extends Publisher<BusinessRoleTypeCreatedEvent>{
    subject: Subjects.BusinessRoleTypeCreated=Subjects.BusinessRoleTypeCreated;
}