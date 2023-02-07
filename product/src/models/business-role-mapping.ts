import mongoose, { ObjectId } from "mongoose";
import { BusinessUserDoc } from "./business-user";

// intetface that describe the prooerti
// that are required to cretae new user
export interface BusinessRoleMappingAttrs {
    businessUserId?:string;
    businessRoleId?:string;
}

// interface for usermodel pass
interface BusinessRoleMappingModel extends mongoose.Model<BusinessRoleMappingDoc> {
    build(attrs: BusinessRoleMappingAttrs): BusinessRoleMappingDoc;
}

// interface for single user properties
export interface BusinessRoleMappingDoc extends mongoose.Document {
    businessUserId:BusinessUserDoc;
    businessRoleId:BusinessRoleMappingDoc;
}

const BusinessRoleMappingSchema = new mongoose.Schema({
    businessUserId:{type:mongoose.Schema.Types.ObjectId,ref:'BusinessUser'},
    businessRoleId:{type:mongoose.Schema.Types.ObjectId,ref:'BusinessRoleType'},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    is_delete: { type: Boolean, default: false }
}, );

BusinessRoleMappingSchema.pre('save', async function (done) {

})

BusinessRoleMappingSchema.statics.build = (attrs: BusinessRoleMappingAttrs) => {
    return new BusinessRoleMapping(attrs);
}

const BusinessRoleMapping = mongoose.model<BusinessRoleMappingDoc, BusinessRoleMappingModel>('BusinessRoleMapping', BusinessRoleMappingSchema);

export { BusinessRoleMapping };