import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler } from '@rx-ecommerce-chat/common_lib';
import { adminAuthRouter } from './routes/admin-auth-router';
import { customerRouter } from './routes/customer-auth';
import { customerAddressRouter } from './routes/customer-address-route';
import { stateRouter } from './routes/state-route';
import { countryRouter } from './routes/country-route';
import { cityRouter } from './routes/city-route';

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
app.use(adminAuthRouter);
app.use(customerRouter);
app.use(customerAddressRouter);
app.use(stateRouter);
app.use(countryRouter);
app.use(cityRouter);
app.use(errorHandler);

// app.all('*', async () => {
//   throw new NotFoundError();
// });


export { app };
