
import { Subjects,Publisher,CouponMappingCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class CouponMappingCreatedPublisher extends Publisher<CouponMappingCreatedEvent>{
    subject: Subjects.CouponMappingCreated=Subjects.CouponMappingCreated;
}