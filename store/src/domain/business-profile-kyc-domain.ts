import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BusinessProfileKycDatabaseLayer } from '../database-layer/business-profile-kyc-database';


export class BusinessProfileKycDomain {



    static async createBusinessProfileKyc(req: Request, res: Response) {
        if (req.file) {
            const data = JSON.parse(JSON.stringify(req.file));
            if (data) {
                console.log(data.publicUrl);
            }
            const BusinessProfileKyc = await BusinessProfileKycDatabaseLayer.createBusinessProfileKyc(req, data.publicUrl);
            res.status(201).send(BusinessProfileKyc);
        } else {
            throw new BadRequestError("pls first upload document");
        }
    }

    static async updateBusinessProfileKyc(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await BusinessProfileKycDatabaseLayer.updateBusinessProfileKyc(req, req.params.id);
        res.status(201).send({ updated: true });
    }

    // static async deleteBusinessProfileKyc(req: Request, res: Response) {
    //     if (!mongoose.isValidObjectId(req.params.id)) {
    //         throw new BadRequestError('Requested id is not id type');
    //     }
    //     await BusinessProfileKycDatabaseLayer.deleteBusinessProfileKyc(req.params.id);
    //     res.status(201).send({ deleted: true });
    // }

    static async getBusinessProfileKycList(req: Request, res: Response) {
        const BusinessProfileKyc = await BusinessProfileKycDatabaseLayer.getBusinessProfileKycList(req);
        res.status(201).send(BusinessProfileKyc);
    }

    static async getBusinessProfileIdKycList(req: Request, res: Response) {
        const BusinessProfileKyc = await BusinessProfileKycDatabaseLayer.getBusinessProfileIdKycList(req, req.params.id);
        res.status(201).send(BusinessProfileKyc);
    }


    static async getBusinessProfileKycPendingList(req: Request, res: Response) {
        const BusinessProfileKyc = await BusinessProfileKycDatabaseLayer.getBusinessProfileKycPendingList(req);
        res.status(201).send(BusinessProfileKyc);
    }
}

function multer(arg0: { storage: any; }) {
    throw new Error('Function not implemented.');
}
