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
        const { cartList } = req.body;
        var cartListPrep: any[] = [];
        await Promise.all(cartList.map(async (element: any) => {
            var pItem: boolean;
            (element.productItemId === undefined || element.productItemId === null || element.productItemId.length == 0) ? pItem = false : pItem = true;

            if (pItem) {
                const productIteamCheck = await ProductItem.findOne({ _id: element.productItemId }).populate('productId');

                if (productIteamCheck) {
                    if (productIteamCheck.productId._id.toString() == element.productId) {
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
                    if (productCheck.quantity >= element.purchaseQuantity) {
                        cartListPrep.push({
                            productId: element.productId, purchaseQuantity: element.purchaseQuantity
                        })
                    } else {
                        throw new BadRequestError('you ask more quantity but product has less quantity');
                    }
                } else {
                    throw new BadRequestError('productId is not match, pls first verify it...')
                }
            }
        }));
        try {


            const currentUserCart = await Cart.findOne({ customerId: req.currentUser.id });
            if (currentUserCart) {
                // cartListPrep.forEach((e:any)=>{
                //     if( (e.productItemId === undefined || e.productItemId === null || e.productItemId.length == 0) ? (!currentUserCart.cartList.includes(e.productId)) : (!currentUserCart.cartList.includes(e.productId) && ) ){

                //     }
                // })
                const cartLisUpdate = currentUserCart.cartList.concat(cartListPrep);
                
                const data = await Cart.findOneAndUpdate({ customerId: req.currentUser.id }, {
                    cartList: cartLisUpdate
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

    static async removeCart(req: any) {

    }

    static async getCart(req: any) {
        const data = await Cart.find({ customerId: req.currentUser.id });
        return data;
    }

}