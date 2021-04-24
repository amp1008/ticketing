import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@amp-tickets/common';
import { Message } from 'node-nats-streaming';

import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

async function setUp () {
    let listener = new TicketCreatedListener(natsWrapper.client);

    let data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'Testing Ticket',
        price: 250
    };

    // @ts-ignore
    let msg: Message = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg
    };
}

it('expects a ticket to be saved successfully', async () => {
    let { listener, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    let ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acknowledges on successful save of ticket', async () => {
    let { listener, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});