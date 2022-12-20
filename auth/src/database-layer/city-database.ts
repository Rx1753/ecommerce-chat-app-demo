import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { isThrowStatement } from 'typescript';
import { CityCreatedPublisher } from '../events/publisher/city-publisher';
import { City } from '../models/city';
import { State } from '../models/state';
import { natsWrapper } from '../nats-wrapper';

export class CityDatabaseLayer {

    static async createCity(req: any) {
        const { cityName, stateId } = req.body;
        try {
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
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }

    }

    static async updateCity(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            await City.findByIdAndUpdate(id, { CityName: req.body.CityName, stateId: req.body.stateId,isActive:req.body.isActive, update_at: updated_at });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteCity(id: string) {
        try {
            const cityData = await City.findById(id);
            const status = cityData?.isActive ? false : true;
            await City.findByIdAndUpdate(id,{isActive:status})
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

    static async getCityNameBasedSerch(name:string){
        const data = await City.find({ cityName: { $regex: name + '.*', $options: 'i' } }).populate({
            path: 'stateId', populate: {
                path: 'countryId'
            }
        });
        if(data){
        return data;
        }else{
            return [];
        }
    }

}