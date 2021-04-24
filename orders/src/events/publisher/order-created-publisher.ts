import { OrderCreatedEvent, Publisher, Subjects } from '@amp-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}