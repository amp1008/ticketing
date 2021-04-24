import { ExpirationCompleteEvent, Publisher, Subjects } from '@amp-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}