import mongoose from 'mongoose';
import { app } from './app';
import { AdminCreatedListener } from './event/listener/admin-listener';
import { AdminPermissioCreatedListener } from './event/listener/admin-permission-listener';
import { BusinessCategoryCreatedListener } from './event/listener/business-category-listener';
import { BusinessCategoryUpdatedListener } from './event/listener/business-category-updated-listener';
import { BusinessRoleCreatedListener } from './event/listener/business-role-listener';
import { BusinessRoleMappingListener } from './event/listener/business-role-mapping-listener';
import { BusinessSubCategoryCreatedListener } from './event/listener/business-sub-category-listener';
import { BusinessSubCategoryUpdatedListener } from './event/listener/business-sub-category-update-listener';
import { BusinessUserCreatedListener } from './event/listener/business-user-listener';
import { StoreCreatedListener } from './event/listener/store-listener';
import { StoreUpdatedListener } from './event/listener/store-updated-listener';
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

    new BusinessCategoryCreatedListener(natsWrapper.client).listen();
    new BusinessSubCategoryCreatedListener(natsWrapper.client).listen();
    new StoreCreatedListener(natsWrapper.client).listen();
    new BusinessUserCreatedListener(natsWrapper.client).listen();
    new BusinessRoleCreatedListener(natsWrapper.client).listen();
    new BusinessRoleMappingListener(natsWrapper.client).listen();
    new AdminCreatedListener(natsWrapper.client).listen();
    new AdminPermissioCreatedListener(natsWrapper.client).listen();
    new BusinessSubCategoryUpdatedListener(natsWrapper.client).listen();
    new BusinessCategoryUpdatedListener(natsWrapper.client).listen();
    new StoreUpdatedListener(natsWrapper.client).listen();
  } catch (error: any) {
    throw Error(error);
  }

  app.listen(port,()=>{
    console.log('listen at',port);
    
  });
};

start();
