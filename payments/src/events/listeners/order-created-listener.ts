import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@amp-tickets/common';

import { Orders } from '../../models/orders';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = global.queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        let order = Orders.createOrder({
            id: data.id,
            userId: data.userId,
            version: data.version,
            status: data.status,
            price: data.ticket.price
        });

        await order.save();

        msg.ack();
    }
}