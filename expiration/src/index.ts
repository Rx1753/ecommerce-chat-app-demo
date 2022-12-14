
import { InvitionCodeCreatedListener } from './events/listeners/invition-code-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined')
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined')
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URII must be defined')
    }
    try {

        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
            process.exit();

        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new InvitionCodeCreatedListener(natsWrapper.client).listen();
        

    } catch (error: any) {
        throw new Error(error)

    }


}

start();