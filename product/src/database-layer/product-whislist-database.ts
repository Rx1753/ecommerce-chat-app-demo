import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Admin } from '../models/admin';
import { AdminRoleMapping } from '../models/admin-role-mapping';
import { AdminUser } from '../models/admin-user';
import { BusinessCategory } from '../models/business-category';
import { BusinessSubCategory } from '../models/business-sub-category';
import { Product } from '../models/product';
import { ProductSubCategory } from '../models/product-sub-category';
import { ProductWhishlist } from '../models/whislist-product';
import { natsWrapper } from '../nats-wrapper';

export class ProductWhishlistDatabaseLayer {

    static async createProductWhishlist(req: any) {
        const { productId } = req.body;
        const productCheck = await Product.findById(productId);
        if (productCheck) {
            const data = ProductWhishlist.build({
                customerId: req.currentUser.id,
                productId: productId
            });
            console.log(data);
            await data.save();
            return data;
        } else {
            throw new BadRequestError('Provided productId is not valid');
        }
    }

    static async deleteProductWhishlist(id: string) {
        const data= await ProductWhishlist.findById(id);
        if (data) {
            try {
                await ProductWhishlist.findByIdAndRemove(id);
                return;
            }
            catch (err: any) {
                console.log(err.message);
                throw new BadRequestError(err.message)
            }
        } else {
            throw new BadRequestError('Provided id is not valid');
        }
    }

    static async getProductWhishlistList(req: any) {
        const data = await ProductWhishlist.find()
            // .populate({
            //     path: '', populate: {
            //         path: 'businessCategoryId'
            //     }
            // });
        return data;
    }

}