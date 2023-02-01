import mongoose, { ObjectId } from "mongoose";
import { CustomerDoc } from "./customer";
import { OrderDoc } from "./order";
import { ProductDoc } from "./product";
import { ProductItemDoc } from "./product-item";
import { StoreDoc } from "./store";

// import { BusinessProfileDoc } from "./business-profile";
// import { BusinessSubCategoryDoc } from "./business-sub-category";

// intetface that describe the prooerties
// that are required to cretae new user
export interface OrderProductAttrs {
    productId:string,
    addOnsId?:string|null,
    storeId:string,
    productItemId?:string|null,
    quantity:number,
    orderId:string,
    refundAmount?:number,
    penaltyAmount?:number,
    orderStatus:string,
    couponId:string | null,
    discountPrice:number,
    price:number,
    mrpPrice:number,
}

// interface for usermodel pass
interface OrderProductModel extends mongoose.Model<OrderProductDoc> {
    build(attrs: OrderProductAttrs): OrderProductDoc;
}

// interface for single user properties
export interface OrderProductDoc extends mongoose.Document {
    createdAt: Date;//,
    updatedAt: Date;
    productId:ProductDoc,
    customerId:CustomerDoc,
    addOnsId:string,
    storeId:StoreDoc,
    productItemId:ProductItemDoc,
    quantity:number,
    orderId:OrderDoc,
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
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerUser' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref:'Product'},
    productItemId: { type: mongoose.Schema.Types.ObjectId || null, ref:'ProductItem'},
    addOnsId: { type:mongoose.Schema.Types.ObjectId || null, ref:'addOns'},
    storeId: { type:mongoose.Schema.Types.ObjectId, ref:'Store'},
    quantity:{type:Number},
    orderId:{type:mongoose.Schema.Types.ObjectId,ref:'Order'},
    refundAmount:{type:Number,default:0},
    penaltyAmount:{type:Number,default:0},
    estimatedDeliverDate:{type:Date,default:()=>new Date(new Date().getTime()+(5*24*60*60*1000))},
    deliveryRecivedDate:{type:Date,default:null},
    deliveryCharges:{type:Number,default:0},
    orderStatus:{type:String, enum:['pending','accepted','rejected','completed','cancelled','returned','requested','enRoute'],default:'pending'},
    couponId:{type:mongoose.Schema.Types.ObjectId || null,ref:'Coupon',default:null},
    discountPrice:{type:Number},
    price:{type:Number},
    mrpPrice:{type:Number},
    trackId:{type:String || null ,default:null},
    pauseOrder:{type:Boolean,default:false},
    cancellationCharge:{type:Number},
    isOrderRejected:{type:Boolean},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

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