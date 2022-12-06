import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";
// name String
//   description String
//   isActive Boolean
//   createdAt Date
//   updatedAt Date
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
    
    created_at: Date;
    updated_at: Date;
    name: string;
    description:string;
    isActive:boolean;
}

const BusinessCategorySchema = new mongoose.Schema({
    name: { type: String },
    description: {type: String},
    isActive: { type: Boolean, default: true },
    created_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
    updated_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.BusinesscategoryId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.isActive;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

BusinessCategorySchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hased = await Password.toHash(this.get('password'));
        this.set('password', hased);
    }
    done();
})
BusinessCategorySchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

BusinessCategorySchema.statics.build = (attrs: BusinessCategoryAttrs) => {
    return new BusinessCategory(attrs);
}

const BusinessCategory = mongoose.model<BusinessCategoryDoc, BusinessCategoryModel>('BusinessCategory', BusinessCategorySchema);

export { BusinessCategory };