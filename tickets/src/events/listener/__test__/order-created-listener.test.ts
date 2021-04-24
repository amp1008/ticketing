import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NotFoundError, OrderCreatedEvent, OrderStatus } from '@amp-tickets/common';

import { OrderCreatedListener } from '../order-created-listener';
import { Tickets } from '../../../models/tickets';
import { natsWrapper } from '../../../nats-wrapper';

async function setUp () {
    // create a ticket
    let ticket = await Tickets.createTicket({
        title: 'Concert',
        price: 20,
        userId: mongoose.Types.ObjectId().toHexString()
    });

    // save the ticket to database
    await ticket.save();

    // create a sample order created event
    let data : OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: ticket.userId,
        expiresAt: new Date().toISOString(),
        status: OrderStatus.Created,
        ticket: {
            id: ticket.id,
            price: ticket.price,
            title: ticket.title
        }
    };

    // @ts-ignore
    let msg: Message = {
        ack: jest.fn()
    };

    let listener = new OrderCreatedListener(natsWrapper.client);

    return {
        listener,
        msg,
        data,
        ticket
    };
}

it('expects ticket to be updated', async () => {
    let { listener, ticket, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    let existingTicket = await Tickets.findById(ticket.id);
    if (!existingTicket) {
        throw new NotFoundError();
    }

    expect(existingTicket.orderId).toEqual(data.id);
});

it('acknowledges the message on updating the ticket', async () => {
    let { listener, ticket, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes ticket updated event', async () => {
    let { listener, ticket, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    let orderDetails = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
    orderDetails = JSON.parse(orderDetails);
    expect(orderDetails.orderId).toEqual(data.id);
});