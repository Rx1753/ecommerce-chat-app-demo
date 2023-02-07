import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";
import { StoreDoc } from "./store";

// intetface that describe the prooerties
// that are required to cretae new user
export interface BusinessUserAttrs {
    email?: string | null;
    phoneNumber?: number | null;
    name: string;
    createdBy?: string | null; 
    store?:string | null;
}

// interface for usermodel pass
interface BusinessUserModel extends mongoose.Model<BusinessUserDoc> {
    build(attrs: BusinessUserAttrs): BusinessUserDoc;
}

// interface for single user properties
export interface BusinessUserDoc extends mongoose.Document {
    email: string;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber: number;
    name: string;
    password: string;
    isActive: boolean;
    createdBy: BusinessUserDoc; // userId
    storeId:StoreDoc
}

const BusinessUserSchema = new mongoose.Schema({
    email: { type: String || null, },
    phoneNumber: { type: Number || null, },
    name: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId || null, default: null, ref: 'BusinessUser' },
    store:{type:mongoose.Schema.Types.ObjectId,ref:'Store',default:null},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
},);

BusinessUserSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hased = await Password.toHash(this.get('password'));
        this.set('password', hased);
    }
    done();
})
BusinessUserSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

BusinessUserSchema.statics.build = (attrs: BusinessUserAttrs) => {
    return new BusinessUser(attrs);
}

const BusinessUser = mongoose.model<BusinessUserDoc, BusinessUserModel>('BusinessUser', BusinessUserSchema);

export { BusinessUser };