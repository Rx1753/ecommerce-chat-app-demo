import mongoose, { ObjectId } from "mongoose";

// intetface that describe the prooerties
// that are required to cretae new category
export enum baseIdEnum{
    Product="Product",
    Customer="Cusotmer",
    Store="Store",
    ProductCategory="ProductCategory",
    ProductSubCategory="ProductSubCategory"
}

export interface CouponMappingAttrs {
    couponId:string
    isProduct:boolean,
    isCustomer:boolean,
    isStore:boolean,
    isProductCategory:boolean,
    isProductSubCategory:boolean,
    baseId:string,
    baseType:baseIdEnum,
}

// interface for categorymodel pass
interface CouponMappingModel extends mongoose.Model<CouponMappingDoc> {
    build(attrs: CouponMappingAttrs): CouponMappingDoc;
}

// interface for single category properties
export interface CouponMappingDoc extends mongoose.Document {
    couponId:string
    isProduct:boolean,
    isCustomer:boolean,
    isStore:boolean,
    isProductCategory:boolean,
    isProductSubCategory:boolean,
    baseId:string,
    baseType:string
}

const CouponMappingSchema = new mongoose.Schema({
    couponId:{type:String},
    isProduct:{type:Boolean,default:false},
    isCustomer:{type:Boolean,default:false},
    isStore:{type:Boolean,default:false},
    isProductCategory:{type:Boolean,default:false},
    isProductSubCategory:{type:Boolean,default:false},
    baseType:{type:String,enum:baseIdEnum},
    baseId:{type:mongoose.Schema.Types.ObjectId,ref:'baseType'},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

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