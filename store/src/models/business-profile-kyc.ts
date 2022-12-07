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
    created_at: Date;
    updated_at: Date;
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
    created_at: { type: Number, default: () => Date.now() },
    updated_at: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.BusinessProfileKycId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },
    }
});

BusinessProfileKycSchema.pre('save', async function (done) {
    done();
})

BusinessProfileKycSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

BusinessProfileKycSchema.statics.build = (attrs: BusinessProfileKycAttrs) => {
    return new BusinessProfileKyc(attrs);
}

const BusinessProfileKyc = mongoose.model<BusinessProfileKycDoc, BusinessProfileKycModel>('BusinessProfileKyc', BusinessProfileKycSchema);

export { BusinessProfileKyc };