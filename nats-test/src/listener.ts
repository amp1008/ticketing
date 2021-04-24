import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

/*
    Connects to a particular cluster with a client ID.
    Client ID is being passed as second argument and it must be unique.
*/

/*
    When a event is emitted, all the listeners subscribed to the subject, receive the event.
    If there are multiple instances of the same listener,
    if we want the event to be listened by only one instance, then we can create a queue group.
    Queue groups are used to send the messages only to a single member of the queue group.
    A queue group can have multiple members. When a message is sent, only one member receives the event.
*/

let client = nats.connect('ticketing', randomBytes(8).toString('hex'), {
    url: 'http://localhost:4222'
});

client.on('close', () => {
    console.log('exiting server');
    process.exit();
});

client.on('connect', () => {
    console.log('Listener connected successfully');

    new TicketCreatedListener(client).listen();

    /* let options = client.subscriptionOptions().setManualAckMode(true);
    let subscription = client.subscribe('ticket:created', 'ticket-svc-queue-group', options);
    subscription.on('message', (msg: Message) => {
        let data = msg.getData();
        console.log(`Message received with sequence: ${msg.getSequence()} and data: ${data}`);

        msg.ack();
    }); */
});

process.on('SIGINT', client.close);
process.on('SIGTERM', client.close);