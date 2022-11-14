import createError from 'http-errors';
import bodyParser from 'body-parser';
//Routers

import express, { Application } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {
  requireAuth,
  currentUser,
  errorHandler,
  NotFoundError,
} from '@rx-ecommerce-chat/common_lib';
import { natsWrapper } from './nats-wrapper';
import { UserCreatedListener } from './events/listener/user-created-listener';

import chatRoomRoute from './routes/chatRoom';
import deleteRoomRouter from './routes/delete';
import mongoose from 'mongoose';

// const app = express();

// app.set('trust proxy', true);
// app.use(express.json());
// app.use(
//   cookieSession({
//     signed: false, // Disable encrypction in cookie
//     // secure : true, // use cookie only on https connection
//     secure: process.env.NODE_ENV !== 'test',
//   })
// );
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));

// //Router
// app.get('/api/chats/favicon.ico', (req: any, res: any) => res.sendStatus(204));
// app.use(currentUser);
// app.use('/api/chats/room', requireAuth, currentUser, chatRoomRoute);
// app.use('/api/chats/delete', deleteRoomRouter);

// app.all('*', async () => {
//   throw new NotFoundError();
// });
// app.use(errorHandler);
// export { app };

class ExpressServer {
  app: Application;
  constructor() {
    this.app = express();
    this.setUp();
  }
  async setUp() {
    try {
      this.app.set('trust proxy', true);
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
      this.app.use(bodyParser.urlencoded({ extended: true }));
      this.app.use(
        cookieSession({
          signed: false, // Disable encrypction in cookie
          // secure : true, // use cookie only on https connection
          secure: process.env.NODE_ENV !== 'test',
        })
      );

      this.app.get('/api/chats/favicon.ico', (req: any, res: any) =>
        res.sendStatus(204)
      );
      //Routers
      this.app.use(currentUser);
      this.app.use('/api/chats/room', chatRoomRoute);
      this.app.use('/api/chats/delete', deleteRoomRouter);

      // this.app.use((req: any, res: any, next: any) =>
      //   next(createError(404, 'File not found'))
      // );
      this.app.all('*', async () => {
        throw new NotFoundError();
      });
      this.app.use(errorHandler);

      // // eslint-disable-next-line no-unused-vars
      // this.app.use((error: any, req: any, res: any, next: any) => {
      //   res.status(error.status || 500);
      //   // Log out the error to the console
      //   return res.json({
      //     error: {
      //       message: req.app.get('env') === 'development' ? error.message : {},
      //     },
      //   });
      // });
      // this.app.all('*', async () => {
      //   throw new NotFoundError();
      // });
      // this.app.use(errorHandler);

      if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
      }

      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
      }

      if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
      }

      if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
      }

      if (!process.env.NATS_URI) {
        throw new Error('NATS_URI must be defined');
      }

      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URI
      );

      natsWrapper.client.on('close', () => {
        process.exit();
      });

      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());

      new UserCreatedListener(natsWrapper.client).listen();

      await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log(
          `Connected to MongoDB Ravinaaaaaa', ${process.env.MONGO_URI}`
        ); // Should be a random port
      });
    } catch (error: any) {
      throw new Error(error);
    }

    this.app.listen(3001, () => {
      console.log(`Listening on port:: http://localhost:${3001}/`);
    });
  }
}

export = ExpressServer;
