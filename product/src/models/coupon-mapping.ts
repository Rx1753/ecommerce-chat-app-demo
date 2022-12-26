import mongoose, { ObjectId } from "mongoose";

// intetface that describe the prooerties
// that are required to cretae new category
export interface CouponMappingAttrs {
    couponId:string
    isProduct:boolean,
    isCustomer:boolean,
    isStore:boolean,
    isProductCategory:boolean,
    isProductSubCategory:boolean,
    baseId:string,
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
    createdAt: number
    updatedAt: number
}

const CouponMappingSchema = new mongoose.Schema({
    couponId:{type:String},
    isProduct:{type:Boolean,default:false},
    isCustomer:{type:Boolean,default:false},
    isStore:{type:Boolean,default:false},
    isProductCategory:{type:Boolean,default:false},
    isProductSubCategory:{type:Boolean,default:false},
    baseId:{type:String},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.CouponMappingId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    }
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