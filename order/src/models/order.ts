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
    totalPrice: number;
    remarks: string;
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
    totalPrice: number;
    remarks: string;
}

const OrderSchema = new mongoose.Schema({
    customerId: { type: String, ref: 'CustomerUser' },
    rewardPoints: { type: Number},
    addressId: { type: String, ref:'CustomerAddress' },
    deliveryMode: { type: String , enum: ['DeliveryMode','PickUpMode']},
    payableAmount:{type:Number},
    couponId:{type:String,ref:'Coupon'},
    discountPrice:{type:Number,},
    totalPrice:{type:Number},
    remarks:{type:String},
    created_at: { type: Number, default: () => Date.now() },
    updated_at: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.OrderId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },
    }
});

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