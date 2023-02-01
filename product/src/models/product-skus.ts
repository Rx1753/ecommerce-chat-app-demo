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
    productId: { type: mongoose.Schema.Types.ObjectId,ref:'Product' },
    name:{type:String},
    description:{type:String},
    isVariantBasedPrice:{type:Boolean},
    price:{type:Number,},
    qty:{type:Number},
    isVariantHasImage:{type:Boolean},
    imageUrl:{type:String},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

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