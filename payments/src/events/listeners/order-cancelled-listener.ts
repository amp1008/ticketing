import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@amp-tickets/common';
import { Message } from 'node-nats-streaming';

import { Orders } from '../../models/orders';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = global.queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        let existingOrder = await Orders.findOne({
            _id: data.id,
            version: data.version - 1
        });
        if (!existingOrder) {
            throw new Error('Order not found');
        }

        existingOrder.set({
            status: OrderStatus.Cancelled
        });

        await existingOrder.save();

        msg.ack();
    }
}