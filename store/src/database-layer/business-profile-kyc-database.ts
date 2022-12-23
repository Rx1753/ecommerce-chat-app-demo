import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { BusinessProfile } from '../models/business-profile';
import { BusinessProfileKyc } from "../models/business-profile-kyc";

export class BusinessProfileKycDatabaseLayer {

    static async createBusinessProfileKyc(req: any, publicUrl: any) {
        const { documentUrl, documentType, businessProfileId } = req.body;
        var businessProfileCheck = await BusinessProfile.findOne({ $and: [{ _id: businessProfileId }, { isActive: true }] });
        if (businessProfileCheck) {
            const data = BusinessProfileKyc.build({
                documentUrl: publicUrl,
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
            const data = await BusinessProfileKyc.findById(id);
            if (data) {
                const status = data.isApproved ? false : true;
                await BusinessProfileKyc.findByIdAndUpdate(id, { isApproved: status, update_at: updatedAt });
                await BusinessProfile.findByIdAndUpdate(data.businessProfileId, { isKYCApproved: status });
                return;
            } else {
                throw new BadRequestError("id is not exist in DB")
            }
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
        const data = await BusinessProfileKyc.find().populate('businessProfileId').populate('uploadedBy');
        return data;
    }

    static async getBusinessProfileKycPendingList(req: any) {
        const data = await BusinessProfileKyc.find({ isApproved: false }).populate('businessProfileId').populate('uploadedBy');
        return data;
    }

    static async getBusinessProfileIdKycList(req: any, id: any) {
        const data = await BusinessProfileKyc.find({ businessProfileId: id }).populate('businessProfileId').populate('uploadedBy');
        return data;
    }

}