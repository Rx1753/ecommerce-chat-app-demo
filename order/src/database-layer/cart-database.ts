import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import e from 'express';
import { BusinessRoleMapping } from '../models/business-role-mapping';
import { BusinessUser } from '../models/business-user';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { ProductItem } from '../models/product-item';

import { natsWrapper } from '../nats-wrapper';

export class CartDatabaseLayer {

    static async createCart(req: any) {
        const cartList  = req.body;
        const cartPrdouctIdList:any[]=[];
        cartList.forEach((e:any)=>{
            if(!cartPrdouctIdList.includes(e.productId)){
                cartPrdouctIdList.push(e.productId);
            }else{
                throw new BadRequestError("Product Id is in repeating");
            }
        })
        var cartListPrep: any[] = [];
        await Promise.all(cartList.map(async (element: any) => {
            var pItem: boolean;
            (element.productItemId === undefined || element.productItemId === null || element.productItemId.length == 0) ? pItem = false : pItem = true;

            if (pItem) {
                const productIteamCheck = await ProductItem.findOne({$and:[{ _id: element.productItemId },{productId:element.productId}]}).populate('productId');

                if (productIteamCheck) {
                    if (productIteamCheck.productId._id.toString() == element.productId) {
                        const cartExisting = await Cart.findOne({customerId:req.currentUser.id});
                        if(cartExisting){
                            cartExisting.cartList.map((a:any)=>{
                                if(a.productItemId==element.productItemId){
                                   element.purchaseQuantity=element.purchaseQuantity+a.purchaseQuantity;
                                }
                            })
                        }
                        if (productIteamCheck.quantity >= element.purchaseQuantity) {
                            cartListPrep.push({
                                productId: element.productId, productItemId: element.productItemId, purchaseQuantity: element.purchaseQuantity
                            })
                        } else {
                            throw new BadRequestError('you ask more quantity but product has less quantity');
                        }
                    } else {
                        throw new BadRequestError('productId is not match with productItemId, pls first verify it...')
                    }
                } else {
                    throw new BadRequestError('productItemId is not match, pls first verify it...')
                }
            } else {
                const productCheck = await Product.findById(element.productId);
                if (productCheck) {
                    const cartExisting = await Cart.findOne({customerId:req.currentUser.id});
                        if(cartExisting){
                            cartExisting.cartList.map((a:any)=>{
                                if(a.productId==element.productId){
                                   element.purchaseQuantity=element.purchaseQuantity+a.purchaseQuantity;
                                }
                            })
                        }
                    if (productCheck.quantity >= element.purchaseQuantity) {
                        cartListPrep.push({
                            productId: element.productId, purchaseQuantity: element.purchaseQuantity
                        })
                    } else {
                        throw new BadRequestError('you ask more quantity but product has less quantity for '+element.productId);
                    }
                } else {
                    throw new BadRequestError('productId is not match, pls first verify it...'+element.productId)
                }
            }
        }));
        try {
            const currentUserCart = await Cart.findOne({ customerId: req.currentUser.id });
            if (currentUserCart) {
                currentUserCart.cartList.forEach((e:any)=>{
                    if(!cartPrdouctIdList.includes(e.productId)){
                        cartListPrep.push(e);
                    }
                })
                await Cart.findOneAndUpdate({ customerId: req.currentUser.id }, {
                    cartList: cartListPrep
                });
                const cartData = await Cart.findOne({ customerId: req.currentUser.id });
                return cartData;
            } else {
                const data = Cart.build({
                    customerId: req.currentUser.id,
                    cartList: cartListPrep
                })
                await data.save()
                return data;
            }
        } catch (error: any) {
            throw new BadRequestError(error.message);
        }
    }

    static async removeSignleCart(req: any,id:any) {
        const currentUserCart = await Cart.findOne({ customerId: req.currentUser.id });
        const cartPrep:any[]=[];
        if (currentUserCart) {
            currentUserCart.cartList.forEach((e:any)=>{
                if(e.productId!=id){
                    cartPrep.push(e);
                }
            })
            await Cart.findOneAndUpdate({ customerId: req.currentUser.id }, {
                cartList: cartPrep
            });
            const cartData = await Cart.findOne({ customerId: req.currentUser.id });
            return cartData;
        }else{
            throw new BadRequestError("Cart Not Found");
        }
    }
    
    static async removeCart(req: any) {
        const currentUserCart = await Cart.findOne({ customerId: req.currentUser.id });
        if (currentUserCart) {
           await Cart.findOneAndDelete({customerId:req.currentUser.id})
           return;
        }else{
            throw new BadRequestError("Cart Not Found");
        }
    }

    static async getCart(req: any) {
        const data = await Cart.find({ customerId: req.currentUser.id }).populate("cartList.productId").populate("cartList.productItemId");
        return data;
    }




}