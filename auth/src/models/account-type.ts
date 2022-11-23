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
    created_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
    updated_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
    is_delete: { type: Boolean, default: false }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.accountTypeId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

AccountTypeSchema.pre('save', async function (done) {

})

AccountTypeSchema.statics.build = (attrs: AccountTypeAttrs) => {
    return new AccountType(attrs);
}

const AccountType = mongoose.model<AccountTypeDoc, AccountTypeModel>('AccountType', AccountTypeSchema);

export { AccountType };