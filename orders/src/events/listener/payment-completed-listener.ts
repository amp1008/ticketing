import { Listener, PaymentCompletedEvent, Subjects, OrderStatus } from '@amp-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
    subject:Subjects.PaymentComplete = Subjects.PaymentComplete;
    queueGroupName = global.QUEUE_GROUP_NAME;

    async onMessage(data: PaymentCompletedEvent["data"], msg: Message) {
        let order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Completed
        });

        await order.save();

        msg.ack();
    }
}