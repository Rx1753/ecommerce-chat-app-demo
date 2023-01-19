import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Attribute } from '../models/attribute';
import { AttributeValue } from '../models/attribute-value';


export class AttributeValueDatabaseLayer {

    static async createAttributeValue(req: any) {
        try {
            const { value,attributeId}=req.body;
            const attributeCheck = await Attribute.findById(attributeId);
            if(attributeCheck){
            const data=AttributeValue.build({value:value,attributeId:attributeId});
            await data.save();
            return data;
            }else{
                throw new BadRequestError("Attribute Id is not exist")
            }
        } catch (error:any) {
            throw new BadRequestError(error.message);
        }        
    }

    static async updateAttributeValue(req: any, id: string) {
        const data= await AttributeValue.findById(id);
        const { value,attributeId}=req.body;
        if(data){
            const AttributeValueUpdate = await AttributeValue.findByIdAndUpdate(id,{value:value,attributeId:attributeId});
            return await AttributeValue.findById(id);
        }else{
            throw new BadRequestError("Data not exist for this passsed id");
        }
    }

    static async deleteAttributeValue(req: any, id: string) {
        const data= await AttributeValue.findById(id);
        if(data){
            await AttributeValue.findByIdAndDelete(id);
            return;
        }else{
            throw new BadRequestError("Data not exist for this passsed id");
        }
    }

    static async getAttributeValueList(req: any) {
        const data = await AttributeValue.find().populate('attributeId')
        if (data) {
            return data;
        } else {
            throw new BadRequestError("no data found for given id");
        }
    }



}