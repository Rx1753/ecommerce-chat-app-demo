import { Message } from "node-nats-streaming";
import { Subjects,Listener,AdminUserCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { City } from "../../models/city";
import { queueGroup } from "./queue-group-name";
import { AdminPermissions } from "../../models/admin-permissions";
import { AdminUser } from "../../models/admin-user";

export class AdminCreatedListener extends Listener<AdminUserCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AdminUserCreated=Subjects.AdminUserCreated;
    async onMessage(data:AdminUserCreatedEvent['data'],msg:Message){
         const {id,userName,email,phoneNumber,permissionId,createdBy,allowChangePassword}=data
         const AdminData = AdminUser.build({
            email:email,userName:userName,phoneNumber:phoneNumber,permissionId:permissionId,createdBy:createdBy,allowChangePassword:allowChangePassword
         })
         AdminData._id=id;
         await AdminData.save();
         msg.ack();
    }
}
    