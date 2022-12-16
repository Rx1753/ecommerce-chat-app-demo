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
    
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.BusinessSubCategoryId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },

    }
});

BusinessSubCategorySchema.pre('save', async function (done) {
    done();
})
BusinessSubCategorySchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

BusinessSubCategorySchema.statics.build = (attrs: BusinessSubCategoryAttrs) => {
    return new BusinessSubCategory(attrs);
}

const BusinessSubCategory = mongoose.model<BusinessSubCategoryDoc, BusinessSubCategoryModel>('BusinessSubCategory', BusinessSubCategorySchema);

export { BusinessSubCategory };