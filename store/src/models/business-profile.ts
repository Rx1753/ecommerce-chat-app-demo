import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";

// intetface that describe the prooerties
// that are required to cretae new user
export interface BusinessUserAttrs {
   businessUserId:[{id:string}],
   name:string,
   tagLine:string,
   
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
   businessUserId:[{
    id:{type:String,ref:'BusinessUser'}
   }],
    name: { type: String },
    tagLine: { type: String, default: null },
    description: { type: String, },
    coverPhoto: { type: String, },
    businessSubCategoryId: { type: String, ref:'BusinessSubCategory'},
    privacyPolicy: { type: String, default: null },
    termsAndCondition: { type: String, default: null },
    qrCode: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    phoneNumber: { type: Number,},
    followes: { type:Number, default:0 },
    following: { type:Number, default:0 },
    isKYCApproved:{ type: Boolean, default: false},
    isActive:{ type: Boolean, default: false},
    minOrderAmount:{type:Number,default:0},
    welcomeMessage:{type:String,default:"Welcome to My business profile"},
    createdAt: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
    updatedAt: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
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