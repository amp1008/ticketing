import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listener/ticket-created-listener';
import { TicketUpdatedListener } from './events/listener/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listener/expiration-complete-listener';
import { PaymentCompletedListener } from './events/listener/payment-completed-listener';

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

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCompletedListener(natsWrapper.client).listen();

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
    console.log('Orders service listening on port 3000');
});