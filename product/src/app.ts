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

const app = express();

// The reason for this that traffic is being prixy to our app through ingress nginx
app.set('trust proxy', true);
app.use(express.json());

app.use(
  cookieSession({
    signed: false, // Disable encrypction in cookie
    // secure : true, // use cookie only on https connection
    secure: process.env.NODE_ENV !== 'test',
  })
);

// Router
app.use(ProductCategoryRouter);
app.use(ProductSubCategoryRouter);
app.use(ProductRouter);
app.use(ProductItemRouter);
app.use(AddOnsRouter);
app.use(CouponRouter);
app.use(errorHandler);

app.all('*', async () => {
  throw new NotFoundError();
});

export { app };