import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedPublisher } from './events/TicketCreatedPublisher';

console.clear();

let client = nats.connect('ticketing', randomBytes(8).toString('hex'), {
    url: 'http://localhost:4222'
});

client.on('connect', () => {
    console.log('Publisher connected successfully');

    let publisher = new TicketCreatedPublisher(client);
    publisher.publish({
        id: '123',
        title: 'Football',
        price: 20
    });

    // let ticket = {
    //     id: '123',
    //     title: 'Football',
    //     price: 20
    // };
    //
    // client.publish('ticket:created', JSON.stringify(ticket), () => {
    //     console.log('Ticket created event published successfully');
    // });
});