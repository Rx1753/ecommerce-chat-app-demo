import mongoose, { ObjectId } from "mongoose";

// intetface that describe the prooerties
// that are required to cretae new category
export interface CouponAttrs {
    name:string,
    discountPercentage:number,
    couponCode:string,
    repeatCoupon:boolean,
    maxUserLimit:number,
    maxDiscountAmount:number,
    createdFor:string,
    startDate:Date,
    endDate:Date,
    isMonthlyActive:boolean,
    couponAuthor:string,
    imageUrl:string,
}

// interface for categorymodel pass
interface CouponModel extends mongoose.Model<CouponDoc> {
    build(attrs: CouponAttrs): CouponDoc;
}

// interface for single category properties
export interface CouponDoc extends mongoose.Document {
    name:string,
    discountPercentage:number,
    couponCode:string,
    repeatCoupon:boolean,
    maxUserLimit:number,
    maxDiscountAmount:number,
    createdFor:string,
    startDate:Date,
    endDate:Date,
    isMonthlyActive:boolean,
    couponAuthor:string,
    imageUrl:string,
    isActive:boolean,
    createdAt:number,
    updateAt:number
}

const CouponSchema = new mongoose.Schema({
    name:{type:String},
    discountPercentage:{type:Number},
    couponCode:{type:String},
    repeatCoupon:{type:Boolean,default:false},
    maxUserLimit:{type:Number},
    maxDiscountAmount:{type:Number},
    createdFor:{type:String,enum:['store','business','customer','product category','product sub-category']},
    startDate:{type:Date},
    endDate:{type:Date},
    isMonthlyActive:{type:Boolean,default:false},
    couponAuthor:{type:String,enum:['admin','business']},
    imageUrl:[{type:String}],
    isActive:{type:Boolean,default:true},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.CouponId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    }
});

CouponSchema.pre('save', async function (done) {
    done();
})
CouponSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

CouponSchema.statics.build = (attrs: CouponAttrs) => {
    return new Coupon(attrs);
}

const Coupon = mongoose.model<CouponDoc, CouponModel>('Coupon', CouponSchema);

export { Coupon };