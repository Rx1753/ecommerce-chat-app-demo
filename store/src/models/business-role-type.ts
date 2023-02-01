import mongoose, { ObjectId } from "mongoose";

// intetface that describe the prooerti
// that are required to cretae new user
export interface BusinessRoleTypeAttrs {
    tableName: string;
    isRead: boolean;
    isCreate: boolean;
    isDelete: boolean;
    isUpdate: boolean;
}

// interface for usermodel pass
interface BusinessRoleTypeModel extends mongoose.Model<BusinessRoleTypeDoc> {
    build(attrs: BusinessRoleTypeAttrs): BusinessRoleTypeDoc;
}

// interface for single user properties
export interface BusinessRoleTypeDoc extends mongoose.Document {
    tableName: string;
    isRead: boolean;
    isCreate: boolean;
    isDelete: boolean;
    isUpdate: boolean;
}

const BusinessRoleTypeSchema = new mongoose.Schema({
    tableName: { type: String, required: true,enum:['product','order','store','businessProfile'] },
    isRead: { type: Boolean, default: false },
    isCreate: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isUpdate: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    is_delete: { type: Boolean, default: false }
}, );

BusinessRoleTypeSchema.pre('save', async function (done) {

})

BusinessRoleTypeSchema.statics.build = (attrs: BusinessRoleTypeAttrs) => {
    return new BusinessRoleType(attrs);
}

const BusinessRoleType = mongoose.model<BusinessRoleTypeDoc, BusinessRoleTypeModel>('BusinessRoleType', BusinessRoleTypeSchema);

export { BusinessRoleType };