import { Message } from "node-nats-streaming";
import { Subjects, Listener, BBusinessRoleMappingCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { BusinessRoleMapping } from "../../models/business-role-mapping";
import { queueGroup } from "./queue-group-name";

export class BusinessRoleMappingListener extends Listener<BBusinessRoleMappingCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.BusinessRoleMappingCreated = Subjects.BusinessRoleMappingCreated;
    async onMessage(data: BBusinessRoleMappingCreatedEvent['data'], msg: Message) {
        const { id, businessUserId,
            businessRoleId
        } = data
        const userData = BusinessRoleMapping.build({
            businessUserId: businessUserId,
            businessRoleId: businessRoleId
        })
        userData._id = id
        await userData.save();
        msg.ack();
    }
}