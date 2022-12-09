import mongoose, { ObjectId } from "mongoose";
import { BusinessProfileDoc } from "./business-profile";
import { BusinessUserDoc } from "./business-user";

// intetface that describe the prooerties
// that are required to cretae new category
export interface BusinessProfileKycAttrs {
    documentUrl: string,
    documentType: string,
    businessProfileId:BusinessProfileDoc,
    uploadedBy:BusinessUserDoc,
}

// interface for categorymodel pass
interface BusinessProfileKycModel extends mongoose.Model<BusinessProfileKycDoc> {
    build(attrs: BusinessProfileKycAttrs): BusinessProfileKycDoc;
}

// interface for single category properties
export interface BusinessProfileKycDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    documentUrl: string,
    documentType: string,
    businessProfileId:BusinessProfileDoc,
    isApproved:boolean,
    uploadedBy:BusinessUserDoc,
}

const BusinessProfileKycSchema = new mongoose.Schema({
    documentUrl: { type: String },
    documentType: {type: String,enum:['PAN card','driving license']},
    businessProfileId:{type:String,ref:'BusinessProfile'},
    isApproved:{type:Boolean,default:false},
    uploadedBy:{type:String,ref:'BusinessUser'},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.BusinessProfileKycId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    }
});

BusinessProfileKycSchema.pre('save', async function (done) {
    done();
})

BusinessProfileKycSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

BusinessProfileKycSchema.statics.build = (attrs: BusinessProfileKycAttrs) => {
    return new BusinessProfileKyc(attrs);
}

const BusinessProfileKyc = mongoose.model<BusinessProfileKycDoc, BusinessProfileKycModel>('BusinessProfileKyc', BusinessProfileKycSchema);

export { BusinessProfileKyc };