import mongoose, { ObjectId } from "mongoose";

export interface CouponMappingAttrs {
    couponId:string
    isProduct:boolean,
    isCustomer:boolean,
    isStore:boolean,
    isProductCategory:boolean,
    isProductSubCategory:boolean,
    baseId:string,
    
}

export interface CouponMappingModel extends mongoose.Model<CouponMappingDoc> {
    build(attrs: CouponMappingAttrs): CouponMappingDoc;
}

export interface CouponMappingDoc extends mongoose.Document {
    baseType: string;
    couponId:string
    isProduct:boolean,
    isCustomer:boolean,
    isStore:boolean,
    isProductCategory:boolean,
    isProductSubCategory:boolean,
    baseId:string,
    
}
export const CouponMappingSchema = new mongoose.Schema({
    couponId:{type:mongoose.Schema.Types.ObjectId},
    isProduct:{type:Boolean,default:false},
    isCustomer:{type:Boolean,default:false},
    isStore:{type:Boolean,default:false},
    isProductCategory:{type:Boolean,default:false},
    isProductSubCategory:{type:Boolean,default:false},
    baseId:{type:mongoose.Schema.Types.ObjectId},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
});

CouponMappingSchema.pre('save', async function (done) {
    done();
})

CouponMappingSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

CouponMappingSchema.statics.build = (attrs: CouponMappingAttrs) => {
    return new CouponMapping(attrs);
}
const CouponMapping = mongoose.model<CouponMappingDoc, CouponMappingModel>('CouponMapping', CouponMappingSchema);
export { CouponMapping };