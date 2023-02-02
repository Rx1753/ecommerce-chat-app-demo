import { Message } from "node-nats-streaming";
import { Subjects,Listener,AdminUserUpdatedEvent } from "@rx-ecommerce-chat/common_lib";
import { City } from "../../models/city";
import { queueGroup } from "./queue-group-name";
import { AdminPermissions } from "../../models/admin-permissions";
import { Admin } from "../../models/admin";


export class AdminUpdateListener extends Listener<AdminUserUpdatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.AdminUserUpdated=Subjects.AdminUserUpdated;
    async onMessage(data:AdminUserUpdatedEvent['data'],msg:Message){
         const {id,permissionId,isActive}=data
         const AdminData = Admin.findByIdAndUpdate(id,{ permissionId:permissionId,isActive:isActive });
         msg.ack();
    }
}
    