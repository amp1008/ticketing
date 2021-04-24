import {Publisher, Subjects, TicketCreatedEvent} from '@amp-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}