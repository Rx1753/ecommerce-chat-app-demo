import { BadRequestError } from '../errors/bad-request-error';
import { customerAddress } from '../models/customer-address';

export class CustomerAddressDatabaseLayer {

    static async createAddress(req: any) {
        const { phoneNumber, addressType, isDefault, addressLine1, addressLine2, city, state, country } = req.body;

        //city Id find logic
        //state Id find logic
        //country Id find logic

        const data = customerAddress.build({
            customerId: req.currentUser.id,
            phoneNumber: phoneNumber,
            addressType: addressType,
            isDefalultAddress: isDefault,
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            cityId: city,
            stateId: state,
            countryId: country
        })
        await data.save();
        return data;
    }

    static async updateAddress(req: any, id: string) {
        const currentDate = new Date();
        const updated_at = currentDate.getTime();

        //city Id find logic
        //state Id find logic
        //country Id find logic
        try {
            await customerAddress.findByIdAndUpdate(id, {
                phoneNumber: req.body.phoneNumber,
                addressType: req.body.addressType,
                isDefalultAddress: req.body.isDefault,
                addressLine1: req.body.addressLine1,
                addressLine2: req.body.addressLine2,
                cityId: req.body.city,
                stateId: req.body.state,
                countryId: req.body.country,
                updated_at: updated_at
            });

            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }

    }

    static async deleteAddress(id: string) {
        try {
            await customerAddress.findByIdAndDelete(id);
            return;
        } catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    static async getCurrentUserAddress(req:any) {
        const data=await customerAddress.find({customerId:req.currentUser.id});
        return data
    }

}