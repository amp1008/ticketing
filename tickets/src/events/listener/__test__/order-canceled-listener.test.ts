import mongoose from 'mongoose';
import {OrderCancelledEvent} from '@amp-tickets/common';
import { Message } from 'node-nats-streaming';

import { Tickets } from '../../../models/tickets';
import { OrderCanceledListener } from '../order-canceled-listener';
import { natsWrapper } from '../../../nats-wrapper';

async function setUp () {
    let ticket = Tickets.createTicket({
        title: 'IPL',
        price: 2500,
        userId: mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    let orderId = mongoose.Types.ObjectId().toHexString();
    ticket.set({
        orderId
    });

    await ticket.save();

    let data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };

    // @ts-ignore
    let msg: Message = {
        ack: jest.fn()
    };

    let listener = new OrderCanceledListener(natsWrapper.client);

    return {
        data,
        msg,
        ticket,
        listener
    };
}

it('expects ticket to be updated with orderId set to undefined', async () => {
    let { listener, data, msg, ticket } = await setUp();

    await listener.onMessage(data, msg);

    let existingTicket = await Tickets.findById(ticket.id);
    if (!existingTicket) {
        throw new Error('Ticket not found');
    }

    expect(existingTicket.orderId).not.toBeDefined();
});

it('acknowledges ticket on successful ticket update', async () => {
    let { listener, data, msg, ticket } = await setUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});