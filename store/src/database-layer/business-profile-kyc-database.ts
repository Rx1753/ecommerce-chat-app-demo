import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessProfile } from '../models/business-profile';
import { BusinessProfileKyc } from "../models/business-profile-kyc";

export class BusinessProfileKycDatabaseLayer {

    static async createBusinessProfileKyc(req: any) {
        const { documentUrl, documentType, businessProfileId } = req.body;
        var businessProfileCheck = await BusinessProfile.findById(businessProfileId);
        if (businessProfileCheck) {
            const data = BusinessProfileKyc.build({
                documentUrl: documentUrl,
                documentType: documentType,
                businessProfileId: businessProfileCheck.id,
                uploadedBy: req.currentUser.id
            });
            console.log(data);
            await data.save();
            return data;
        } else {
            throw new BadRequestError('businessProfileId not found');
        }
    }

    static async updateBusinessProfileKyc(req: any, id: string) {
        const currentDate = new Date();
        const updatedAt = currentDate.getTime();
        try {
            const data = await BusinessProfileKyc.findByIdAndUpdate(id, { isApproved: req.body.isApproved, update_at: updatedAt });
            await BusinessProfile.findByIdAndUpdate(data?.businessProfileId, { isKYCApproved: req.body.isApproved });
            return;
        }
        catch (err: any) {
            console.log(err.message);
            throw new BadRequestError(err.message)
        }
    }

    // static async deleteBusinessProfileKyc(id: string) {
    //     try {
    //         await BusinessProfileKyc.findByIdAndDelete(id);
    //         return;
    //     } catch (err: any) {
    //         console.log(err.message);
    //         throw new BadRequestError(err.message)
    //     }
    // }

    static async getBusinessProfileKycList(req: any) {
        const data = await BusinessProfileKyc.find();
        return data;
    }

    static async getBusinessProfileKycPendingList(req: any) {
        const data = await BusinessProfileKyc.find({isApproved:false});
        return data;
    }

    static async getBusinessProfileIdKycList(req: any, id: any) {
        const data = await BusinessProfileKyc.find({ BusinessProfileId: id });
        return data;
    }

}