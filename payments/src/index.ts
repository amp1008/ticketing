import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

declare global {
    namespace NodeJS {
        interface Global {
            queueGroupName: string;
        }
    }
}

global.queueGroupName = 'payments-service';

async function connectToDB () {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO URI is required !!');
        }
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

        natsWrapper.client.on('close', () => {
            console.log('Closing NATS Client');
            process.exit();
        });

        new OrderCancelledListener(natsWrapper.client).listen();
        new OrderCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to Mongo Server');
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

connectToDB();

app.listen(3000, () => {
    console.log('Payments service listening on port 3000');
});