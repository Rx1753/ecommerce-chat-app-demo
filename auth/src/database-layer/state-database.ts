import { BadRequestError } from '../errors/bad-request-error';
import { Country } from '../models/country';
import { State } from '../models/state';

export class StateDatabaseLayer {

    static async createState(req: any) {
        const { stateName, countryId } = req.body;

        const countryCheck = await Country.findOne({ $and: [{ _id: countryId }, { isDelete: false }] });
        if (countryCheck) {
            const data = State.build({ stateName: stateName, countryId: countryCheck._id });
            console.log(data);
            
            await data.save();
            return data;
        } else {
            throw new BadRequestError('Country id is not valid')
        }
    }

    static async updateState(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            await State.findByIdAndUpdate(id, { stateName: req.body.stateName, countryId: req.body.countryId, update_at: updated_at });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteState(id: string) {
        try {
            await State.findByIdAndUpdate(id, { isDelete: true });
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getStateList(req: any) {
        const data = await State.find({ isDelete: false }).populate('countryId');
        return data;
    }

    static async getStateCountryId(req: any, id: string) {
        const data = await State.find({ $and: [{ countryId: id }, { isDelete: false }] }).populate('countryId');
        return data;
    }

}