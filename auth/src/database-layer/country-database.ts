import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { CountryCreatedPublisher } from '../events/publisher/country-publisher';
import { Country } from '../models/country';
import { natsWrapper } from '../nats-wrapper';

export class CountryDatabaseLayer {

    static async createCountry(req: any) {
        const { countryName } = req.body;
        const data = Country.build({ countryName: countryName });
        await data.save();
        await new CountryCreatedPublisher(natsWrapper.client).publish({
            id:data.id,
            countryName:data.countryName
        })
        return data;
    }

    static async updateCountry(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();
        try {
            await Country.findByIdAndUpdate(id, { countryName: req.body.countryName, update_at: updated_at });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async deleteCountry(id: string) {
        try {
            await Country.findByIdAndUpdate(id,{isDelete:true});
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getCountryList(req: any) {
        const data = await Country.find({isDelete:false});
        return data;
    }

}