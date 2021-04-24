import { Message } from 'node-nats-streaming';
import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from '@amp-tickets/common';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = global.QUEUE_GROUP_NAME;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        let { price, title, id, version } = data;

        let ticket = await Ticket.findOne({
            _id: id,
            version: version - 1
        });

        if (!ticket) {
            throw new NotFoundError();
        }
        ticket.set({
            price,
            title
        });

        await ticket.save();

        msg.ack();
    }
}