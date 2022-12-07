import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { CityCreatedPublisher } from '../events/publisher/city-publisher';
import { City } from '../models/city';
import { State } from '../models/state';
import { natsWrapper } from '../nats-wrapper';

export class CityDatabaseLayer {

    static async createCity(req: any) {
        const { cityName, stateId } = req.body;

        const countryCheck = await State.findOne({ $and: [{ _id: stateId }, { isDelete: false }] });
        if (countryCheck) {
            const data = City.build({ cityName: cityName, stateId: stateId });
            console.log(data);
            console.log(Date.now());
            
            await data.save();
            await new CityCreatedPublisher(natsWrapper.client).publish({
                id: data.id,
                cityName: data.cityName,
                stateId: data.stateId.toString()
            })
            return data;
        } else {
            throw new BadRequestError('Country id is not valid')
        }

       
    }

    static async updateCity(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            await City.findByIdAndUpdate(id, { CityName: req.body.CityName, stateId: req.body.stateId, update_at: updated_at });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteCity(id: string) {
        try {
            await City.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getCityList(req: any) {
        const data = await City.find().populate({
            path: 'stateId', populate: {
                path: 'countryId'
            }
        });
        return data;
    }

    static async getCityStateId(req: any, id: string) {
        const data = await City.find({ stateId: id }).populate({
            path: 'stateId', populate: {
                path: 'countryId'
            }
        });
        return data;
    }

}