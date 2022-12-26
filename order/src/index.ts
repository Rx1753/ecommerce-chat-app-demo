import mongoose from 'mongoose';
import { app } from './app';
import { BusinessRoleCreatedListener } from './event/listener/business-role-listener';
import { BusinessRoleMappingListener } from './event/listener/business-role-mapping-listener';
import { BusinessUserCreatedListener } from './event/listener/business-user-listener';
import { CustomerAddressCreatedListener } from './event/listener/customer-address-listener';
import { CustomerCreatedListener } from './event/listener/customer-listener';
import { ProductItemCreatedListener } from './event/listener/product-item-listener';
import { ProductCreatedListener } from './event/listener/product-listener';
import { StoreCreatedListener } from './event/listener/store-listener';
import { natsWrapper } from './nats-wrapper';

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

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_URI,);

    new BusinessRoleCreatedListener(natsWrapper.client).listen()
    new BusinessRoleMappingListener(natsWrapper.client).listen()
    new BusinessUserCreatedListener(natsWrapper.client).listen()
    new StoreCreatedListener(natsWrapper.client).listen()
    new CustomerCreatedListener(natsWrapper.client).listen()
    new ProductCreatedListener(natsWrapper.client).listen()
    new ProductItemCreatedListener(natsWrapper.client).listen()
    new CustomerAddressCreatedListener(natsWrapper.client).listen()
  } catch (error: any) {
    throw Error(error);
  }

  app.listen(port,()=>{
    console.log('listen at',port);
    
  });
};

start();
