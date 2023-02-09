import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductDatabaseLayer } from '../database-layer/product-database';

export class ProductDomain {

    static async createProduct(req: Request, res: Response) {
        const Product = await ProductDatabaseLayer.createProduct(req);
        res.status(201).send(Product);
    }
    
    static async createProductVariant(req:Request,res:Response){
        const Product = await ProductDatabaseLayer.createProductVariant(req,req.params.id);
        res.status(201).send(Product);
    }

    static async updateProduct(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const data = await ProductDatabaseLayer.updateProduct(req,req.params.id);
        res.status(201).send(data);
    }

    static async deleteProduct(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        await ProductDatabaseLayer.deleteProduct(req,req.params.id);
        res.status(201).send({ deleted: true });
    }

    static async getProductList(req: Request, res: Response) {
        const Product =  await ProductDatabaseLayer.getProductList(req);
        res.status(201).send(Product);
    }

    static async getActiveProductList(req: Request, res: Response) {
        const Product =  await ProductDatabaseLayer.getActiveProductList();
        res.status(201).send(Product);
    }

    static async getDeactiveProductList(req: Request, res: Response) {
        const Product =  await ProductDatabaseLayer.getDeactiveProductList();
        res.status(201).send(Product);
    }
    
    static async getProductSubCategoryIdList(req: Request, res: Response) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new BadRequestError('Requested id is not id type');
        }
        const Product =  await ProductDatabaseLayer.getProductCategoryIdList(req,req.params.id);
        res.status(201).send(Product);
    }

    static async getProductWithAddOnsAndProductItem(req: Request, res: Response) {
        const Product =  await ProductDatabaseLayer.getProductWithAddOnsAndProductItem(req);
        res.status(201).send(Product);
    }
    
    static async getProductDetails(req: Request, res: Response) {
        const Product =  await ProductDatabaseLayer.getProductDetails(req,req.params.id);
        res.status(201).send(Product);
    }
    
    static async serchData(req: Request, res: Response) {
        const Product =  await ProductDatabaseLayer.serchData(req);
        res.status(201).send(Product);
    }
    
    static async reviewBasedOnProductId(req:Request,res:Response){
        const Product =  await ProductDatabaseLayer.reviewBasedOnProductId(req.params.id);
        res.status(201).send(Product);
    }

    static async getProduct(req:Request,res:Response){
        const Product =  await ProductDatabaseLayer.getProduct(req);
        res.status(201).send(Product);
    }
    
    static async getProductWithVariant(req:Request,res:Response){
        const Product =  await ProductDatabaseLayer.getProductWithVariant(req);
        res.status(201).send(Product);
    }

    static async getProductVariant(req:Request,res:Response){
        const Product =  await ProductDatabaseLayer.getProductVariant(req,req.query.productItemId,req.query.productId);
        res.status(201).send(Product);
    }
    
    static async checkProductCombination(req:Request,res:Response){
        const Product =  await ProductDatabaseLayer.checkProductCombination(req,);
        res.status(201).send(Product);
    }
    
    static async couponSuggestionBasedOnProduct(req:Request,res:Response){
        const Product =  await ProductDatabaseLayer.couponSuggestionBasedOnProduct(req,req.params.id);
        res.status(201).send(Product);
    }
}
