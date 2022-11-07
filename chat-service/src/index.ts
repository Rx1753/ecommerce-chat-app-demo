// import mongoose from 'mongoose';
// import { app } from './app';
// import { DatabaseConnectionError } from '@rx-ecommerce-chat/common_lib';
// import { natsWrapper } from './nats-wrapper';
// import { UserCreatedListener } from './events/listener/user-created-listener';

// const port = 3000;

// const start = async () => {
//   if (!process.env.JWT_KEY) {
//     throw new Error('JWT_KEY must be defined');
//   }
//   if (!process.env.MONGO_URI) {
//     throw new Error('MONGO_URI must be defined');
//   }

//   if (!process.env.NATS_CLUSTER_ID) {
//     throw new Error('NATS_CLUSTER_ID must be defined');
//   }

//   if (!process.env.NATS_CLIENT_ID) {
//     throw new Error('NATS_CLIENT_ID must be defined');
//   }

//   if (!process.env.NATS_URI) {
//     throw new Error('NATS_URII must be defined');
//   }

//   try {
//     await natsWrapper.connect(
//       process.env.NATS_CLUSTER_ID,
//       process.env.NATS_CLIENT_ID,
//       process.env.NATS_URI
//     );

//     natsWrapper.client.on('close', () => {
//       process.exit();
//     });

//     process.on('SIGINT', () => natsWrapper.client.close());
//     process.on('SIGTERM', () => natsWrapper.client.close());

//     new UserCreatedListener(natsWrapper.client).listen();

//     await mongoose
//       .connect(process.env.MONGO_URI)
//       .then(() => {
//         console.log(
//           `Connected to MongoDB Ravinaaaaaa', ${process.env.MONGO_URI}`
//         ); // Should be a random port
//       })
//       .catch((err) => {
//         console.log('Error in Mongo', err);
//       });
//   } catch (error: any) {
//     throw Error(error);
//   }
//   console.log("Startedddd----")
//   app.listen(port);
//   console.log("Startedddd---- 22")

//   app.on('listening', () => {
//     console.log(`Listening on port:: http://localhost:${3001}/`);
//   });
// };

// start();
