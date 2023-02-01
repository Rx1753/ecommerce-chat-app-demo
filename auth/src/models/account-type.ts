import mongoose, { ObjectId } from "mongoose";

// intetface that describe the prooerti
// that are required to cretae new user
export interface AccountTypeAttrs {
    accountType: string;
}

// interface for usermodel pass
interface AccountTypeModel extends mongoose.Model<AccountTypeDoc> {
    build(attrs: AccountTypeAttrs): AccountTypeDoc;
}

// interface for single user properties
export interface AccountTypeDoc extends mongoose.Document {
    accountTypeName: string;
}

const AccountTypeSchema = new mongoose.Schema({
    accountType: { type: String, required: true, unique: true},
    createdAt: { type: Date, default: () => Date.now()},
    updatedAt: { type: Date, default: () => Date.now() },
    isDelete: { type: Boolean, default: false }
});

AccountTypeSchema.pre('save', async function (done) {

})

AccountTypeSchema.statics.build = (attrs: AccountTypeAttrs) => {
    return new AccountType(attrs);
}

const AccountType = mongoose.model<AccountTypeDoc, AccountTypeModel>('AccountType', AccountTypeSchema);

export { AccountType };