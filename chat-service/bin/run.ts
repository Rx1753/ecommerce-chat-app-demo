import http from 'http';
import ExpressServer from '../src/app';
require('dotenv/config');

const service = new ExpressServer().app;
const server = http.createServer(service);


server.on('listening', () => {
  console.log(`Listening on port:: http://localhost:${3001}/`);
});
