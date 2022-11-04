import createError from 'http-errors';
import bodyParser from 'body-parser';

import config from '../config/index';
//Routers
import indexRouter from './routes/index';
import userRouter from './routes/user';
import chatRoomRoute from './routes/chatRoom';
import deleteRoomRouter from './routes/delete';

import { decode } from './middlewares/jwt';

import express, { Application, Request, Response, NextFunction } from 'express';

class ExpressServer {
  app: Application;
  constructor() {
    this.app = express();
    this.setUp();
  }
  setUp() {

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.get('/api/chats/favicon.ico', (req: any, res: any) => res.sendStatus(204));
    this.app.use('/api/chats/', indexRouter);
    this.app.use('/api/chats/users', userRouter);
    this.app.use('/api/chats/room', decode, chatRoomRoute);
    this.app.use('/api/chats/delete', deleteRoomRouter);

    this.app.use((req: any, res: any, next: any) =>
      next(createError(404, 'File not found'))
    );

    // eslint-disable-next-line no-unused-vars
    this.app.use((error: any, req: any, res: any, next: any) => {
      res.status(error.status || 500);
      // Log out the error to the console
      return res.json({
        error: {
          message: req.app.get('env') === 'development' ? error.message : {},
        },
      });
    });

    this.app.listen(3001, () => {
      console.log(`Listening on port:: http://localhost:${3001}/`);
    });
  }
}

export = ExpressServer;
