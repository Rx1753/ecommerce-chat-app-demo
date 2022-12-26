import { Message } from "node-nats-streaming";
import { Subjects,Listener,CustomerAddressCreatedEvent } from "@rx-ecommerce-chat/common_lib";

import { queueGroup } from "./queue-group-name";
import { customerAddress } from "../../models/customer-address";

export class CustomerAddressCreatedListener extends Listener<CustomerAddressCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.CustomerAddressCreated=Subjects.CustomerAddressCreated;
    async onMessage(data:CustomerAddressCreatedEvent['data'],msg:Message){
         const {id,customerId,phoneNumber,addressType,isDefalultAddress,addressLine1,addressLine2,cityId,stateId,countryId,zipCodes}=data
         const userData = customerAddress.build({
             customerId: customerId,
             phoneNumber: phoneNumber,
             addressType: addressType,
             isDefalultAddress: isDefalultAddress,
             addressLine1: addressLine1,
             addressLine2: addressLine2,
             cityId: cityId,
             stateId: stateId,
             countryId: countryId,
             zipCode: zipCodes
         })
         userData._id=id
         await userData.save();
         msg.ack();
    }
}
    