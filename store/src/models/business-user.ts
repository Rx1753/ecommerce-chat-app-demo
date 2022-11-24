import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";

// intetface that describe the prooerties
// that are required to cretae new user
export interface BusinessUserAttrs {
    id: string;
    email?: string | null;
    phoneNumber?: number | null;
    name: string;
    createdBy?: string | null; 
    isMFA?:boolean;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
}

// interface for usermodel pass
interface BusinessUserModel extends mongoose.Model<BusinessUserDoc> {
    build(attrs: BusinessUserAttrs): BusinessUserDoc;
}

// interface for single user properties
export interface BusinessUserDoc extends mongoose.Document {
    email: string;
    created_at: Date;
    updated_at: Date;
    phoneNumber: number;
    name: string;
    password: string;
    faceId: string;
    isMFA: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    imageUrl: string;
    isActive: boolean;
    createdBy: BusinessUserDoc; // userId
    isDelete: boolean;
    refreshToken: string;
    broadcastCount: number;
}

const BusinessUserSchema = new mongoose.Schema({
    email: { type: String || null, },
    phoneNumber: { type: Number || null, },
    name: { type: String },
    faceId: { type: String, default: null },
    isSocial: { type: Boolean, default: false },
    isMFA: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    imageUrl: { type: String, default: null },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    createdBy: { type: String || null, default: null, ref: 'BusinessUser' },
    accountType: { type: String, ref: 'AccountType' },
    refreshToken: { type: String },
    allowChangePassword: { type: Boolean, default: true},
    broadcastCount: {type:Number, default:0},
    created_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
    updated_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.BusinessUserId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            delete ret.isActive;
            delete ret.isDelete;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

BusinessUserSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hased = await Password.toHash(this.get('password'));
        this.set('password', hased);
    }
    done();
})
BusinessUserSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

BusinessUserSchema.statics.build = (attrs: BusinessUserAttrs) => {
    return new BusinessUser(attrs);
}

const BusinessUser = mongoose.model<BusinessUserDoc, BusinessUserModel>('BusinessUser', BusinessUserSchema);

export { BusinessUser };