import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler } from '@rx-ecommerce-chat/common_lib';
import { BusinessCategoryRouter } from './routes/business-category-route';
import { BusinessSubCategoryRouter } from './routes/business-sub-category-route';
import { BusinessProfileRouter } from './routes/business-profile-route';
import { BusinessProfileKycRouter } from './routes/buisness-profile-kyc-route';
import { StoreRouter } from './routes/store-route';

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
app.use(BusinessCategoryRouter);
app.use(BusinessSubCategoryRouter);
app.use(BusinessProfileRouter);
app.use(BusinessProfileKycRouter);
app.use(StoreRouter);
app.use(errorHandler);

// app.all('*', async () => {
//   throw new NotFoundError();
// });

export { app };