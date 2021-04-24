import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@amp-tickets/common';

import { expirationQueue } from '../../queue/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = global.queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        let delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        });

        msg.ack();
    }
}