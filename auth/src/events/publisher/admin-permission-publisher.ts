import { Subjects,Publisher,AdminPermissionUserCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class AdminPermissionCreatedPublisher extends Publisher<AdminPermissionUserCreatedEvent>{
    subject: Subjects.AdminPermissionCreated=Subjects.AdminPermissionCreated;
}