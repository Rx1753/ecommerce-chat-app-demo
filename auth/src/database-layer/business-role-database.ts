import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessRoleTypeCreatedPublisher } from '../events/publisher/business-role-publisher';
import { BusinessRoleType } from '../models/business-role-type';
import { State } from '../models/state';
import { natsWrapper } from '../nats-wrapper';

export class BusinessRoleDatabaseLayer {

    static async createBusinessRole(req: any) {
        const { tableName, isRead, isCreate, isDelete, isUpdate } = req.body;

        const countryCheck = await BusinessRoleType.findOne({
            $and: [{ tableName: tableName }, {
                isRead: isRead
            }, {
                isCreate: isCreate
            }, {
                isDelete: isDelete
            }, {
                isUpdate: isUpdate
            }]
        });
        if (!countryCheck) {
            const data = BusinessRoleType.build({
                tableName: tableName,
                isRead: isRead,
                isCreate: isCreate,
                isDelete: isDelete,
                isUpdate: isUpdate
            });
            console.log(data);
            console.log(Date.now());

            await data.save();
            await new BusinessRoleTypeCreatedPublisher(natsWrapper.client).publish({
                id: data.id,
                tableName: data.tableName,
                isRead: data.isRead,
                isCreate: data.isCreate,
                isDelete: data.isDelete,
                isUpdate: data.isUpdate
            })
            return data;
        } else {
            throw new BadRequestError('role is already exists');
        }


    }

    static async updateBusinessRole(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            await BusinessRoleType.findByIdAndUpdate(id, {
                tableName: req.body.tableName,
                isRead: req.body.isRead,
                isCreate: req.body.isCreate,
                isDelete: req.body.isDelete,
                isUpdate: req.body.isUpdate, 
                update_at: updated_at
            });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteBusinessRole(id: string) {
        try {
            await BusinessRoleType.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getBusinessRoleList(req: any) {
        const data = await BusinessRoleType.find()
        return data;
    }

}