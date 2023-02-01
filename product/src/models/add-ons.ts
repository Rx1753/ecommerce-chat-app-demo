import mongoose, { ObjectId } from "mongoose";
import { ProductDoc } from "./product";

// intetface that describe the prooerties
// that are required to cretae new category
export interface AddOnsAttrs {
    name: string;
    description: string;
    imageUrl: string;
    mrpPrice: number;
    quantity: number;
    productId: string;
    createdBy:string;
}

// interface for categorymodel pass
interface AddOnsModel extends mongoose.Model<AddOnsDoc> {
    build(attrs: AddOnsAttrs): AddOnsDoc;
}

// interface for single category properties
export interface AddOnsDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    isActive: boolean;
    imageUrl: string;
    mrpPrice: number;
    quantity: number;
    productId: ProductDoc; createdBy:string;
}

const AddOnsSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String },
    mrpPrice: { type: Number },
    quantity: { type: Number },
    productId: { type: String, ref: 'Product' },
    createdBy:{type:String},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

AddOnsSchema.pre('save', async function (done) {
    done();
})
AddOnsSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

AddOnsSchema.statics.build = (attrs: AddOnsAttrs) => {
    return new AddOns(attrs);
}

const AddOns = mongoose.model<AddOnsDoc, AddOnsModel>('AddOns', AddOnsSchema);

export { AddOns };