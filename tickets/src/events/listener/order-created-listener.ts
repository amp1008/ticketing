import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects, NotFoundError } from '@amp-tickets/common';

import { Tickets } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName = global.queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        let { id, ticket: { id: ticketId } } = data;

        let existingTicket = await Tickets.findById(ticketId);
        if (!existingTicket) {
            throw new NotFoundError();
        }

        existingTicket.set({
            orderId: id
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