import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";

// intetface that describe the prooerties
// that are required to cretae new user
export interface CustomerAttrs {
    email?: string | null;
    phoneNumber?: number | null;
    name: string;
}

// interface for usermodel pass
interface CustomerModel extends mongoose.Model<CustomerDoc> {
    build(attrs: CustomerAttrs): CustomerDoc;
}

// interface for single user properties
export interface CustomerDoc extends mongoose.Document {
    email: string;
    phoneNumber: number;
    name: string;

}

const customerSchema = new mongoose.Schema({
    email: { type: String || null, },
    phoneNumber: { type: Number || null, },
    name: { type: String },

}, );

customerSchema.pre('save', async function (done) {

})
customerSchema.pre('update', async function (done) {

})

customerSchema.statics.build = (attrs: CustomerAttrs) => {
    return new Customer(attrs);
}

const Customer = mongoose.model<CustomerDoc, CustomerModel>('CustomerUser', customerSchema);

export { Customer };