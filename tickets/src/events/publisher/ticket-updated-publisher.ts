import {Publisher, Subjects, TicketUpdatedEvent} from '@amp-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}