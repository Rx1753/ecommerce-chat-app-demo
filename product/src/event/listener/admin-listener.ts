import { Message } from "node-nats-streaming";
import { Subjects,Listener,AdminUserCreatedEvent } from "@rx-ecommerce-chat/common_lib";

import { queueGroup } from "./queue-group-name";
import { Admin } from "../../models/admin";

export class AdminCreatedListener extends Listener<AdminUserCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AdminUserCreated=Subjects.AdminUserCreated;
    async onMessage(data:AdminUserCreatedEvent['data'],msg:Message){
         const {id,userName,email,phoneNumber,permissionId,createdBy,allowChangePassword}=data
         const AdminData = Admin.build({
             email: email, userName: userName, phoneNumber: phoneNumber, createdBy: createdBy, allowChangePassword: allowChangePassword,
             password: "",
             roleId: ""
         })
         AdminData._id=id;
         await AdminData.save();
         msg.ack();
    }
}
    