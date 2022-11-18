import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler } from '../src/middlewares/error-handler';
import { authRouter } from './routes/auth-router';
import { customerRouter } from './routes/customer-auth';

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

app.use(authRouter);
app.use(customerRouter);
app.use(errorHandler);

// app.all('*', async () => {
//   throw new NotFoundError();
// });


export { app };
