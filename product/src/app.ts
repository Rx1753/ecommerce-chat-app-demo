import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@rx-ecommerce-chat/common_lib';
import { ProductCategoryRouter } from './routes/product-category-route';
import { ProductSubCategoryRouter } from './routes/product-sub-category-route';
import { ProductRouter } from './routes/product-route';
import { ProductItemRouter } from './routes/product-item-route';
import { AddOnsRouter } from './routes/add-ons-route';
import { CouponRouter } from './routes/coupon';
import { ProductWhishlist } from './models/whislist-product';
import { ProductWhishlistRouter } from './routes/product-whislist-route';
import { AttributeRouter } from './routes/attribute-route';
import { AttributeValueRouter } from './routes/attribute-value-route';
import { ProductReviewRouter } from './routes/product-review';

const app = express();

// The reason for this that traffic is being prixy to our app through ingress nginx
app.set('trust proxy', true);
app.use(express.json());

app.use(
  cookieSession({
    signed: false, // Disable encrypction in cookie
    // secure : true, // use cookie only on https connecßßion
    secure: process.env.NODE_ENV !== 'test',
  })
);

// Router
app.use(ProductWhishlistRouter);
app.use(ProductCategoryRouter);
app.use(ProductSubCategoryRouter);
app.use(ProductRouter);
app.use(ProductItemRouter);
app.use(AddOnsRouter);
app.use(CouponRouter);
app.use(AttributeRouter);
app.use(AttributeValueRouter);
app.use(ProductReviewRouter);

app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };