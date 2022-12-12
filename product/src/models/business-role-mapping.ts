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
    businessUserId:{type:String,ref:'BusinessUserUser'},
    businessRoleId:{type:String,ref:'BusinessRoleType'},
    created_at: { type: Number, default: () => Date.now() },
    updated_at: { type: Number, default: () => Date.now() },
    is_delete: { type: Boolean, default: false }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.BusinessRoleMappingId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

BusinessRoleMappingSchema.pre('save', async function (done) {

})

BusinessRoleMappingSchema.statics.build = (attrs: BusinessRoleMappingAttrs) => {
    return new BusinessRoleMapping(attrs);
}

const BusinessRoleMapping = mongoose.model<BusinessRoleMappingDoc, BusinessRoleMappingModel>('BusinessRoleMapping', BusinessRoleMappingSchema);

export { BusinessRoleMapping };