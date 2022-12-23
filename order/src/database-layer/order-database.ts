import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Cart } from '../models/cart';
import { customerAddress } from '../models/customer-address';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { ProductItem } from '../models/product-item';

export class OrderDatabaseLayer {

    static async createOrderBasedOnCart(req: any) {
        const cartData = await Cart.findById({customerId:req.currentUser.id});
        if(cartData){
            const addressId=await customerAddress.findOne({$and:[{customerId:req.currentUser.id},{isDefalultAddress:true}]})
            if(addressId){
            const payableAmount:number=0;
            await Promise.all(cartData.cartList.map(async (element:any)=>{
                var pItem: boolean;
            (element.productItemId === undefined || element.productItemId === null || element.productItemId.length == 0) ? pItem = false : pItem = true;
            if (pItem) {
                const productItemData = await ProductItem.findOne({_id:element.productItemId});
                return productItemData;
            }else{
                const productData = await Product.findOne({_id:element.productId});
                return productData;
            }

            }))

            const {deliveryMode}= req.body;
            

                // Order.build({
                //     customerId: req.currentUser.id,
                //     rewardPoints: 0,
                //     addressId: addressId?._id.toString(),
                //     zipCode: addressId?.zipCode,
                //     deliveryMode: deliveryMode,
                //     payableAmount: 0,
                //     discountPrice: 0,
                //     totalPrice: 0,
                //     remarks: ''
                // })
                
            }else{
                throw new BadRequestError("Address not found for current user pls write address first");
            }
            
        }
    }

    static async getSignleOrder(req: any,id:any) {
        const currentUserOrder = await Order.findOne({ customerId: req.currentUser.id });
        if (currentUserOrder) {
            return currentUserOrder;
        }else{
            throw new BadRequestError("Order Not Found");
        }
    }

    static async getOrder(req: any) {
        const data = await Order.find({ customerId: req.currentUser.id });
        return data;
    }    

}