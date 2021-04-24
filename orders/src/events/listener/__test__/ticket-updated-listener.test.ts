import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@amp-tickets/common';

import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

async function setUp () {
    let listener = new TicketUpdatedListener(natsWrapper.client);

    let ticket = Ticket.createTicket({
        title: 'IPL',
        price: 2500,
        id: mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    let data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'IPL',
        version: 1,
        price: 3500,
        userId: mongoose.Types.ObjectId().toHexString()
    };

    // @ts-ignore
    let msg: Message = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        ticket,
        msg
    };
}

it('expects a ticket to be updated successfully', async () => {
    let { listener, data, ticket, msg } = await setUp();

    await listener.onMessage(data, msg);

    let updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acknowledges on successful save of ticket', async () => {
    let { listener, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not acknowledge, if the ticket version is out of order', async (done) => {
    let { listener, data, msg } = await setUp();
    data.version = 100;

    try {
        await listener.onMessage(data, msg);
    } catch (error) {
        return done();
    }
    throw new Error('Test failed');
});