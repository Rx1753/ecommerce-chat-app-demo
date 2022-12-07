import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";
import { BusinessProfileDoc } from "./business-profile";
import { BusinessSubCategoryDoc } from "./business-sub-category";
import { BusinessUserDoc } from "./business-user";
import { CityDoc } from "./city";
import { CountryDoc } from "./country";
import { StateDoc } from "./state";
// intetface that describe the prooerties
// that are required to cretae new user
export interface StoreAttrs {
    phoneNumber: number;
    email: string;
    businessProfileId: string,
    businessSubCategoryId: string,
    description: string,
    name: string,
    latitude: number,
    longitude: number,
    city: CityDoc,
    state: StateDoc,
    country: CountryDoc,
    pinCode: number,
    imageUrl:string,
    addressLine1: string,
    addressLine2?: string,
    membershipId?: string,
    welcomeMessage?: string, 
    createdBy: BusinessUserDoc,
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
    businessProfileId: BusinessProfileDoc,
    businessSubCategoryId: BusinessSubCategoryDoc,
    description: string,
    chat: boolean,
    pauseOrder: boolean,
    name: string,
    rating: number,
    latitude: number,
    longitude: number,
    city: CityDoc,
    state: StateDoc,
    country: CountryDoc,
    pinCode: number,
    addressLine1: string,
    addressLine2: string,
    isActive: boolean,
    membershipId: string,
    welcomeMessage: string,
    isApprovedByAdmin: boolean,
    brodcastCount: number,
    createdBy: BusinessUserDoc,
}

const StoreSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, default: null, require: true },
    description: { type: String, },
    imageUrl: { type: String, },
    businessSubCategoryId: { type: String, ref: 'BusinessSubCategory' },
    businessProfileId: { type: String, ref: 'BusinessProfileId' },
    rating: { type: Number, default: 0 },
    city: { type: String, ref: 'City' },
    state: { type: String, ref: 'State' },
    country: { type: String, ref: 'Country' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    addressLine1: { type: String },
    addressLine2: { type: String },
    pinCode: { type: Number },
    chat: { type: Boolean, default: false },
    pauseOrder: { type: Boolean, default: false },
    phoneNumber: { type: Number },
    isActive: { type: Boolean, default: false },
    membershipId: { type: String, ref: 'Membership', default: null },
    isApprovedByAdmin: { type: Boolean, default: false },
    welcomeMessage: { type: String, default: "Welcome to My business profile" },
    brodcastCount: { type: Number, default: 0 },
    createdBy: { type: String, ref: 'BusinessUser' },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.StoreId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

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