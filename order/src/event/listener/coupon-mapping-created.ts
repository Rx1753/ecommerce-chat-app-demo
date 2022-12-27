import { Message } from "node-nats-streaming";
import { Subjects, Listener, CouponMappingCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { Country } from "../../models/country";
import { queueGroup } from "./queue-group-name";
import { Coupon } from "../../models/coupon";
import { baseIdEnum, CouponMapping } from "../../models/coupon-mapping";

export class CouponMappingCreatedListener extends Listener<CouponMappingCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.CouponMappingCreated = Subjects.CouponMappingCreated;
    async onMessage(data: CouponMappingCreatedEvent['data'], msg: Message) {
        const { id,couponId,
            isProduct,
            isCustomer,
            isStore,
            isProductCategory,
            isProductSubCategory,
            baseId,
            baseType  } = data
        const couponData = CouponMapping.build({
            couponId,
            isProduct,
            isCustomer,
            isStore,
            isProductCategory,
            isProductSubCategory,
            baseId,
            baseType:baseType as baseIdEnum
        });

        couponData._id = id
        await couponData.save();
        msg.ack();
    }
}
