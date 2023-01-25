import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Attribute } from '../models/attribute';


export class AttributeDatabaseLayer {

    static async createAttribute(req: any) {
        try {
            const {name,type}=req.body;
            const data=Attribute.build({name:name,type:type});
            await data.save();
            return data;
        } catch (error:any) {
            throw new BadRequestError(error.message);
        }        
    }

    static async updateAttribute(req: any, id: string) {
        const data= await Attribute.findById(id);
        const {name,}=req.body;
        if(data){
            const attributeUpdate = await Attribute.findByIdAndUpdate(id,{name:name,});
            return await Attribute.findById(id);
        }else{
            throw new BadRequestError("Data not exist for this passsed id");
        }
    }

    static async deleteAttribute(req: any, id: string) {
        const data= await Attribute.findById(id);
        if(data){
            await Attribute.findByIdAndDelete(id);
            return;
        }else{
            throw new BadRequestError("Data not exist for this passsed id");
        }
    }

    static async getAttributeList(req: any) {
        const data = await Attribute.find()
        if (data) {
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }



}