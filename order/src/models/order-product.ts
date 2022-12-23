import mongoose, { ObjectId } from "mongoose";

// import { BusinessProfileDoc } from "./business-profile";
// import { BusinessSubCategoryDoc } from "./business-sub-category";

// intetface that describe the prooerties
// that are required to cretae new user
export interface OrderProductAttrs {
    productId:string,
    addOnsId:string,
    storeId:string,
    quantity:number,
    orderId:string,
    refundAmount:number,
    penaltyAmount:number,
    estimatedDeliverDate:Date,
    deliveryRecivedDate:Date,
    deliveryCharges:number,
    orderStatus:string,
    couponId:string,
    discountPrice:number,
    price:number,
    mrpPrice:number,
    trackId:string,
    pauseOrder:boolean,
    cancellationCharge:number,
    isOrderRejected:boolean,
}

// interface for usermodel pass
interface OrderProductModel extends mongoose.Model<OrderProductDoc> {
    build(attrs: OrderProductAttrs): OrderProductDoc;
}

// interface for single user properties
export interface OrderProductDoc extends mongoose.Document {
    createdAt: Date;//,
    updatedAt: Date;
    productId:string,
    addOnsId:string,
    storeId:string,
    quantity:number,
    orderId:string,
    refundAmount:number,
    penaltyAmount:number,
    estimatedDeliverDate:Date,
    deliveryRecivedDate:Date,
    deliveryCharges:number,
    orderStatus:string,
    couponId:string,
    discountPrice:number,
    price:number,
    mrpPrice:number,
    trackId:string,
    pauseOrder:boolean,
    cancellationCharge:number,
    isOrderRejected:boolean,
}

const OrderProductSchema = new mongoose.Schema({
    customerId: { type: String, ref: 'CustomerUser' },
    productId: { type: String, ref:'Product'},
    addOnsId: { type:String, ref:'addOns'},
    storeId: { type:String, ref:'Store'},
    quantity:{type:Number},
    orderId:{type:String,ref:'Order'},
    refundAmount:{type:Number},
    penaltyAmount:{type:Number},
    estimatedDeliverDate:{type:Date},
    deliveryRecivedDate:{type:Date},
    deliveryCharges:{type:Number},
    orderStatus:{type:String, enum:['pending','accepted','rejected','completed','cancelled','returned','requested','enRoute']},
    couponId:{type:String,ref:'Coupon'},
    discountPrice:{type:Number},
    price:{type:Number},
    mrpPrice:{type:Number},
    trackId:{type:String},
    pauseOrder:{type:Boolean},
    cancellationCharge:{type:Number},
    isOrderRejected:{type:Boolean},
    created_at: { type: Number, default: () => Date.now() },
    updated_at: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.OrderProductProductId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },
    }
});

OrderProductSchema.pre('save', async function (done) {
})

OrderProductSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

OrderProductSchema.statics.build = (attrs: OrderProductAttrs) => {
    return new OrderProduct(attrs);
}

const OrderProduct = mongoose.model<OrderProductDoc, OrderProductModel>('OrderProduct', OrderProductSchema);

export { OrderProduct};