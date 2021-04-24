import { Publisher, Subjects, PaymentCompletedEvent } from '@amp-tickets/common';

export class PaymentCompletedPublisher extends Publisher<PaymentCompletedEvent> {
    subject: Subjects.PaymentComplete = Subjects.PaymentComplete;
}