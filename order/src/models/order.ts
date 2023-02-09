import mongoose, { ObjectId } from "mongoose";

// import { BusinessProfileDoc } from "./business-profile";
// import { BusinessSubCategoryDoc } from "./business-sub-category";

// intetface that describe the prooerties
// that are required to cretae new user
export interface OrderAttrs {
    customerId: string;
    rewardPoints: number;
    addressId: string;
    zipCode: number;
    deliveryMode: string;
    payableAmount: number;
    couponId?: string | null;
    discountPrice: number;
    originalPrice: number;
    remarks: string;
    orderStatus: string;
    couponDiscountPrice:number
}

// interface for usermodel pass
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

// interface for single user properties
export interface OrderDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    rewardPoints: number;
    addressId: string;
    deliveryMode: string;
    payableAmount: number;
    couponId?: string;
    discountPrice: number;
    originalPrice: number;
    remarks: string;
    orderStatus: string;
    couponDiscountPrice:number;
}

const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerUser' },
    rewardPoints: { type: Number },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerAddress' },
    deliveryMode: { type: String, enum: ['DeliveryMode', 'PickUpMode'], default: 'DeliveryMode' },
    orderStatus: { type: String, enum: ["created", "paymentFail", "success"], default: "created" },
    payableAmount: { type: Number },
    couponId: { type: mongoose.Schema.Types.ObjectId || null, ref: 'Coupon', default: null },
    couponDiscountPrice: {type:Number, default:0},
    discountPrice: { type: Number, },
    originalPrice: { type: Number },
    remarks: { type: String },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
},);

OrderSchema.pre('save', async function (done) {
})

OrderSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

OrderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };