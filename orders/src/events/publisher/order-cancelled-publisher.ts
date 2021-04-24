import { OrderCancelledEvent, Publisher, Subjects } from '@amp-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}