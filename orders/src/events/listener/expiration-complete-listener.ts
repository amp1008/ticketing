import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, Listener, NotFoundError, Subjects } from '@amp-tickets/common';

import { Order, OrderStatus } from '../../models/order';
import { OrderCancelledPublisher } from '../publisher/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    queueGroupName = global.QUEUE_GROUP_NAME;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        let existingOrder = await Order.findById(data.orderId).populate('ticket', 'id');

        if (!existingOrder) {
            throw new NotFoundError();
        }

        if (existingOrder.status !== OrderStatus.Completed) {
            existingOrder.set({
                status: OrderStatus.Cancelled
            });
            await existingOrder.save();

            await new OrderCancelledPublisher(this.client).publish({
                id: existingOrder.id,
                version: existingOrder.version,
                ticket: {
                    id: existingOrder.ticket.id
                }
            });
        }
        msg.ack();
    }
}