import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from "@amp-tickets/common";
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = global.QUEUE_GROUP_NAME;

    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        try {
            let {title, price, id} = data;

            let ticket = Ticket.createTicket({
                id,
                title,
                price
            });

            await ticket.save();
        } catch (error) {
            console.error(error);
        } finally {
            msg.ack();
        }
    }
}