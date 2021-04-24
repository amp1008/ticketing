import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects, NotFoundError } from '@amp-tickets/common';

import { Tickets } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCanceledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = global.queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        let { ticket: { id: ticketId } } = data;

        let existingTicket = await Tickets.findById(ticketId);
        if (!existingTicket) {
            throw new NotFoundError();
        }

        existingTicket.set({
            orderId: undefined
        });

        await existingTicket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticketId,
            version: existingTicket.version,
            title: existingTicket.title,
            price: existingTicket.price,
            userId: existingTicket.userId,
            orderId: existingTicket.orderId
        });

        msg.ack();
    }
}