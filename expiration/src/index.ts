import { natsWrapper } from './nats-wrapper';

import { OrderCreatedListener } from './events/listeners/order-created-listener';

declare global {
    namespace NodeJS {
        interface Global {
            queueGroupName: string;
        }
    }
}

async function connectClient () {
    try {
        if (!process.env.NATS_CLUSTER_ID) {
            throw new Error('Cluster ID is required');
        }
        if (!process.env.NATS_CLIENT_ID) {
            throw new Error('Client ID is required');
        }
        if (!process.env.NATS_URL) {
            throw new Error('URL is required');
        }

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        console.log('Connected to NATS');

        new OrderCreatedListener(natsWrapper.client).listen();

        natsWrapper.client.on('close', () => {
            console.log('Closing NATS Client');
            process.exit();
        });
    } catch (error) {
        console.error(error);
    }
}

process.on('SIGINT', () => {
    natsWrapper.client.close();
});

process.on('SIGTERM', () => {
    natsWrapper.client.close();
});

connectClient();