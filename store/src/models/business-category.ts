import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";

// intetface that describe the prooerties
// that are required to cretae new category
export interface BusinessCategoryAttrs {
    name:string,
    description:string,
    isActive:boolean,
}

// interface for categorymodel pass
interface BusinessCategoryModel extends mongoose.Model<BusinessCategoryDoc> {
    build(attrs: BusinessCategoryAttrs): BusinessCategoryDoc;
}

// interface for single category properties
export interface BusinessCategoryDoc extends mongoose.Document {
    
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description:string;
    isActive:boolean;
}

const BusinessCategorySchema = new mongoose.Schema({
    name: { type: String },
    description: {type: String},
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

BusinessCategorySchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hased = await Password.toHash(this.get('password'));
        this.set('password', hased);
    }
    done();
})
BusinessCategorySchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

BusinessCategorySchema.statics.build = (attrs: BusinessCategoryAttrs) => {
    return new BusinessCategory(attrs);
}

const BusinessCategory = mongoose.model<BusinessCategoryDoc, BusinessCategoryModel>('BusinessCategory', BusinessCategorySchema);

export { BusinessCategory };