import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { StateCreatedPublisher } from '../events/publisher/state-publisher';
import { Country } from '../models/country';
import { State } from '../models/state';
import { natsWrapper } from '../nats-wrapper';

export class StateDatabaseLayer {

    static async createState(req: any) {
        const { stateName, countryId } = req.body;
        try {
            const countryCheck = await Country.findOne({ $and: [{ _id: countryId }, { isActive: true }] });
            if (countryCheck) {
                const data = State.build({ stateName: stateName, countryId: countryCheck._id });
                console.log(data);

                await data.save();
                await new StateCreatedPublisher(natsWrapper.client).publish({
                    id: data.id,
                    stateName: data.stateName,
                    countryId: data.countryId.toString()
                })
                return data;

            } else {
                throw new BadRequestError('Country id is not valid')
            }
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }
    }

    static async updateState(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        const { stateName, countryId } = req.body;
        try {
            const countryCheck = await Country.findOne({ $and: [{ _id: countryId }, { isActive: true }] });
            if (countryCheck) {
                await State.findByIdAndUpdate(id, { stateName: req.body.stateName, countryId: req.body.countryId, isActive: req.body.isActive, update_at: updated_at });
                return;
            } else {
                throw new BadRequestError('Country id is not valid')
            }
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteState(id: string) {
        try {
            const stateData = await State.findById(id)
            const status = stateData?.isActive ? false : true;
            await State.findByIdAndUpdate(id, { isActive: status });
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getStateList(req: any) {
        const data = await State.find().populate('countryId');
        return data;
    }
    static async getStateDeactiveList(req: any) {
        const data = await State.find({ isActive: false }).populate('countryId');
        return data;
    }
     static async getStateActiveList(req: any) {
        const data = await State.find({ isActive: true }).populate('countryId');
        return data;
    }

    static async getStateCountryId(req: any, id: string) {
        const data = await State.find({ $and: [{ countryId: id }, { isActive: true }] }).populate('countryId');
        return data;
    }
    static async getStateNameBasedSerch(name: string) {
        const data = await State.find({ stateName: { $regex: name + '.*', $options: 'i' } }).populate('countryId');
        if (data) {
            return data;
        } else {
            return [];
        }
    }

}