import mongoose, { ObjectId } from "mongoose";
import { ProductDoc } from "./product";

export interface SKUSAttrs {
    productId:string;
    name:string;
    description:string;
    isVariantBasedPrice:boolean;
    price:number;
    qty:number;
    isVariantHasImage:boolean;
    imageUrl:string;
}

interface SKUSModel extends mongoose.Model<SKUSDoc> {
    build(attrs: SKUSAttrs): SKUSDoc;
}

export interface SKUSDoc extends mongoose.Document {
    productId:ProductDoc;
    name:string;
    description:string;
    isVariantBasedPrice:boolean;
    price:number;
    qty:number;
    isVariantHasImage:boolean;
    imageUrl:string;
    
}

const SKUSSchema = new mongoose.Schema({
    productId: { type: String,ref:'Product' },
    name:{type:String},
    description:{type:String},
    isVariantBasedPrice:{type:Boolean},
    price:{type:Number,},
    qty:{type:Number},
    isVariantHasImage:{type:Boolean},
    imageUrl:{type:String},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.SKUSId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },

    }
});

SKUSSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

SKUSSchema.statics.build = (attrs: SKUSAttrs) => {
    return new SKUS(attrs);
}

const SKUS = mongoose.model<SKUSDoc, SKUSModel>('SKUS', SKUSSchema);

export { SKUS };