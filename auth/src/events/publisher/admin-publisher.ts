import { Subjects,Publisher,AdminUserCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class AdminCreatedPublisher extends Publisher<AdminUserCreatedEvent>{
    subject: Subjects.AdminUserCreated=Subjects.AdminUserCreated;
}