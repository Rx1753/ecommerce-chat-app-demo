import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { BusinessUserCreatedListener } from './event/listener/business-user-listener';
import { CityCreatedListener } from './event/listener/city-listener';
import { StateCreatedListener } from './event/listener/state-listener';
import { CountryCreatedListener } from './event/listener/country-listener';
import { BusinessRoleCreatedListener } from './event/listener/business-role-listener';
import { BusinessRoleMappingListener } from './event/listener/business-role-mapping-listener';
import { AdminPermissioCreatedListener } from './event/listener/admin-permission-listener';
import { AdminCreatedListener } from './event/listener/admin-listener';
import { AdminUpdateListener } from './event/listener/admin-update-listener';

const port = 3000;

const start = async () => {
  
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
    throw new Error('NATS_URII must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );

    natsWrapper.client.on('close', () => {
      process.exit();
    });
    
    

    process.on('SIGINT', () => natsWrapper.client!.close());
    process.on('SIGTERM', () => natsWrapper.client!.close());

    new BusinessUserCreatedListener(natsWrapper.client).listen();
    new CityCreatedListener(natsWrapper.client).listen();
    new StateCreatedListener(natsWrapper.client).listen();
    new CountryCreatedListener(natsWrapper.client).listen();
    new BusinessRoleCreatedListener(natsWrapper.client).listen();
    new BusinessRoleMappingListener(natsWrapper.client).listen();
    new AdminCreatedListener(natsWrapper.client).listen();
    new AdminPermissioCreatedListener(natsWrapper.client).listen();
    new AdminUpdateListener(natsWrapper.client).listen();
    
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log(
        `Connected to MongoDB', ${process.env.MONGO_URI}`
      ); // Should be a random port
    });;


  } catch (error: any) {
    throw Error(error);
  }

  app.listen(port,()=>{
    console.log('listen at',port);
    
  });
};

start();
