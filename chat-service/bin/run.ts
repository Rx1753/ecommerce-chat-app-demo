import http from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import config from '../config/index';
import DbConnection from '../server/lib/mongodb';
import ExpressServer from '../server/service';
require('dotenv/config');

const service = new ExpressServer().app;
const server = http.createServer(service);

var dbUrl = config.db.dsn as string;

DbConnection.connect(dbUrl)
  .then(() => {
    console.log(`Connected to MongoDB Ravinaaaaaa', ${config.db.dsn}`); // Should be a random port
  })
  .catch((err) => {
    console.log('Error in Mongo', err);
  });

server.on('listening', () => {
  console.log(`Listening on port:: http://localhost:${3000}/`);
});
