import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";
import { BusinessSubCategoryDoc } from "./business-sub-category";
import { BusinessUserDoc } from "./business-user";
// intetface that describe the prooerties
// that are required to cretae new user
export interface BusinessProfileAttrs {
    BusinessUsers: [{ BusinessUserId: string }],
    name: string,
    tagLine?: string,
    businessSubCategoryId: string,
    phoneNumber?: number,
    description?: string,
    coverPhoto?: string,
    latitude?: number,
    longitude?: number,
    welcomeMessage?: string,

}

// interface for usermodel pass
interface BusinessProfileModel extends mongoose.Model<BusinessProfileDoc> {
    build(attrs: BusinessProfileAttrs): BusinessProfileDoc;
}

// interface for single user properties
export interface BusinessProfileDoc extends mongoose.Document {
    created_at: Date;
    updated_at: Date;
    phoneNumber: number;
    name: string;
    followers: number,
    following: number,
    description: string,
    coverPhoto: string,
    businessSubCategoryId: BusinessSubCategoryDoc,
    qrCode: string,
    latitude: number,
    longitude: number,
    BusinessUsers: [
        {
            BusinessUserId: BusinessUserDoc,
        }
    ]
}

const BusinessProfileSchema = new mongoose.Schema({
    BusinessUsers: [{
        BusinessUserId: { type: String, ref: 'BusinessUser' }, _id: false,
    }],
    name: { type: String },
    tagLine: { type: String, default: null },
    description: { type: String, },
    coverPhoto: { type: String, },
    businessSubCategoryId: { type: String, ref: 'BusinessSubCategory' },
    privacyPolicy: { type: String, default: null },
    termsAndCondition: { type: String, default: null },
    qrCode: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    phoneNumber: { type: Number, },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    isKYCApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    minOrderAmount: { type: Number, default: 0 },
    welcomeMessage: { type: String, default: "Welcome to My business profile" },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.BusinessProfileId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

BusinessProfileSchema.pre('save', async function (done) {
})

BusinessProfileSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

BusinessProfileSchema.statics.build = (attrs: BusinessProfileAttrs) => {
    return new BusinessProfile(attrs);
}

const BusinessProfile = mongoose.model<BusinessProfileDoc, BusinessProfileModel>('BusinessProfile', BusinessProfileSchema);

export { BusinessProfile };