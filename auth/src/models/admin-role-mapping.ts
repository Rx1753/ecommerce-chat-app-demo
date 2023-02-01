import mongoose, { ObjectId } from 'mongoose';
import { AdminPermissionsDoc } from './admin-permissions';
import { AdminRoleDoc } from "./admin-role";
// An interface that describe the properties
// that are required to create AdminRoleMapping
interface AdminRoleMappingAttrs {
    roleId:string;
    permissionId:string;
}

// An interface that describe the properties
// that AdminRoleMapping document has
interface AdminRoleMappingDoc extends mongoose.Document {
    roleId: AdminRoleDoc;
    permissionId:AdminPermissionsDoc;
}

// An interface that describe the properties
// that AdminRoleMapping model has
interface AdminRoleMappingModel extends mongoose.Model<AdminRoleMappingDoc> {
    build(attrs: AdminRoleMappingAttrs): AdminRoleMappingDoc;
}

// Schema
const AdminRoleMappingSchema = new mongoose.Schema(
    {
        roleId:{type:mongoose.Schema.Types.ObjectId,ref:'AdminRole'},
        permissionId:{type:mongoose.Schema.Types.ObjectId,ref:'adminPermissions'},
        createdAt: { type: Date, default: () => Date.now() },
        updatedAt: { type: Date, default: () => Date.now() },
    }
);

// This is middleware function
AdminRoleMappingSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updatedAt', updated_at);
    done();
})

// Adding statics property in schema
AdminRoleMappingSchema.statics.build = (attrs: AdminRoleMappingAttrs) => {
    return new AdminRoleMapping(attrs);
};

// Model
const AdminRoleMapping = mongoose.model<AdminRoleMappingDoc, AdminRoleMappingModel>('AdminRoleMapping', AdminRoleMappingSchema);


export { AdminRoleMapping };
