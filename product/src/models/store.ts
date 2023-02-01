import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";

// import { BusinessProfileDoc } from "./business-profile";
// import { BusinessSubCategoryDoc } from "./business-sub-category";

import { BusinessUserDoc } from "./business-user";

// intetface that describe the prooerties
// that are required to cretae new user
export interface StoreAttrs {
    phoneNumber: number;
    email: string;
    businessProfileId: string,
    businessSubCategoryId: string,
    description: string,
    name: string,
    isActive:boolean,
    createdBy: string,
}

// interface for usermodel pass
interface StoreModel extends mongoose.Model<StoreDoc> {
    build(attrs: StoreAttrs): StoreDoc;
}

// interface for single user properties
export interface StoreDoc extends mongoose.Document {
    created_at: Date;
    updated_at: Date;
    phoneNumber: number;
    email: string;
    imageUrl:string;
    businessProfileId: string,
    businessSubCategoryId: string,
    description: string,
    chat: boolean,
    pauseOrder: boolean,
    name: string,
    isActive:boolean,
    createdBy: string,
}

const StoreSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, default: null, require: true },
    description: { type: String, },
    imageUrl: { type: String, },
    businessSubCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessSubCategory' },
    businessProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfileId' },
    rating: { type: Number, default: 0 },
    phoneNumber: { type: Number },
    isActive: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessUser' },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

StoreSchema.pre('save', async function (done) {
})

StoreSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

StoreSchema.statics.build = (attrs: StoreAttrs) => {
    return new Store(attrs);
}

const Store = mongoose.model<StoreDoc, StoreModel>('Store', StoreSchema);

export { Store };