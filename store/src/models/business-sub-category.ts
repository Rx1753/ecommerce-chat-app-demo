import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";
import { BusinessCategoryDoc } from "./business-category";
// name String
//   description String
//   isActive Boolean
//   createdAt Date
//   updatedAt Date
// intetface that describe the prooerties
// that are required to cretae new category
export interface BusinessSubCategoryAttrs {
    name:string,
    description:string,
    isActive:boolean,
    businessCategoryId:string
}

// interface for categorymodel pass
interface BusinessSubCategoryModel extends mongoose.Model<BusinessSubCategoryDoc> {
    build(attrs: BusinessSubCategoryAttrs): BusinessSubCategoryDoc;
}

// interface for single category properties
export interface BusinessSubCategoryDoc extends mongoose.Document {
    
    created_at: Date;
    updated_at: Date;
    name: string;
    description:string;
    isActive:boolean;
    businessCategoryId:BusinessCategoryDoc;
}

const BusinessSubCategorySchema = new mongoose.Schema({
    name: { type: String },
    description: {type: String},
    isActive: { type: Boolean, default: true },
    businessCategoryId:{type:String,ref:'BusinessCategory'},
    created_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
    updated_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.BusinessSubCategoryId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.isActive;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

BusinessSubCategorySchema.pre('save', async function (done) {
    done();
})
BusinessSubCategorySchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

BusinessSubCategorySchema.statics.build = (attrs: BusinessSubCategoryAttrs) => {
    return new BusinessSubCategory(attrs);
}

const BusinessSubCategory = mongoose.model<BusinessSubCategoryDoc, BusinessSubCategoryModel>('BusinessSubCategory', BusinessSubCategorySchema);

export { BusinessSubCategory };