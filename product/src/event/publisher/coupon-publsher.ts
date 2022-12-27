
import { Subjects,Publisher,CouponCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class CouponCreatedPublisher extends Publisher<CouponCreatedEvent>{
    subject: Subjects.CouponCreated=Subjects.CouponCreated;
}