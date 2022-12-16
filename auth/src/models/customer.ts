import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";

// intetface that describe the prooerties
// that are required to cretae new user
export interface CustomerAttrs {
    email?: string | null;
    phoneNumber?: number | null;
    name: string;
    password: string;
    inviteCode: string;
    status?:string;
    referalId?:string;
    referalType?:String;
    isPhoneVerified?:boolean;
    isEmailVerified?:boolean;
}

// interface for usermodel pass
interface CustomerModel extends mongoose.Model<CustomerDoc> {
    build(attrs: CustomerAttrs): CustomerDoc;
}

// interface for single user properties
export interface CustomerDoc extends mongoose.Document {
    email: string;
    created_at: Date;
    updated_at: Date;
    phoneNumber: number;
    name: string;
    password: string;
    faceId: string;
    isReadReceipt:boolean;
    isMFA: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    qrCode: string;
    imageUrl: string;
    isActive: boolean;
    grpPermission: boolean;
    brodcastRecieve: boolean;
    lastSeenStatus: boolean;
    rewardPoint: Number;
    inviteCode: string;
    referalId: CustomerDoc; // userId
    isDelete: boolean;
    refreshToken: string;
    isAddressVisible:boolean;
    isEmailVisible:boolean;
    isAllowToAddGroup:boolean;
    allowFriendsToAddGroup:boolean;
    isAllowToRecieveBrodcast:boolean;
    isLastSeenActive:boolean;
    isAllowToChatStranger:boolean;
}

const customerSchema = new mongoose.Schema({
    email: { type: String || null, },
    phoneNumber: { type: Number|| null, },
    name: { type: String },
    password: { type: String, required: true },
    faceId: { type: String, default: null },
    isSocial: { type: Boolean, default: false },
    isMFA: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    rewardAmount: { type: Number, default: 0 },
    loyaltyPoint: { type: Number, default: 0 },
    qrCode: { type: String, require: true },
    imageUrl: { type: String, default: null },
    //currentPlan:{type:String},
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    inviteCode: { type: String, required: true, unique: true },
    referalType:{type:String,enum:['Admin','CustomerUser']},
    referalId: { type: String, default: null, ref: 'CustomerUser' },
    noOfFriend: { type: Number, default: 0 },
    status: { type: String, enum: ['New', 'pending', 'Approved', 'Rejected', 'diActivated'], default: 'New' },
    noOfFollowedBusiness: { type: Number, default: 0 },
    isReadReceipt: { type: Boolean, default: true },
    isEmailVisible: { type: Boolean, default: true },
    isAddressVisible: { type: Boolean, default: true },
    isAllowToAddGroup: { type: Boolean, default: true },
    allowFriendsToAddGroup: { type: Array },
    isAllowToRecieveBrodcast: { type: Boolean, default: true },
    isLastSeenActive: { type: Boolean, default: true },
    isAllowToChatStranger: { type: Boolean, default: true },
    hideChatPassword: { type: String, default: null },
    refreshToken: { type: String },
    created_at: { type: Number, default: () => Date.now() },
    updated_at: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.customerId = ret._id;
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

customerSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hased = await Password.toHash(this.get('password'));
        this.set('password', hased);
    }
    done();
})
customerSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

customerSchema.statics.build = (attrs: CustomerAttrs) => {
    return new Customer(attrs);
}

const Customer = mongoose.model<CustomerDoc, CustomerModel>('CustomerUser', customerSchema);

export { Customer };