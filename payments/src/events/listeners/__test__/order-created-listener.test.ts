import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@amp-tickets/common';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Orders } from '../../../models/orders';

async function setUp () {
    let listener = new OrderCreatedListener(natsWrapper.client);

    let data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        expiresAt: new Date().toISOString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
            price: 200,
            title: 'IPL'
        }
    };

    // @ts-ignore
    let msg: Message= {
        ack: jest.fn()
    };

    return {
        data,
        listener,
        msg
    };
}

it('expects a order record to be created in the database', async () => {
    let { listener, data, msg } = await setUp();

    await listener.onMessage(data, msg);

    let order = await Orders.findById(data.id);
    expect(order!.id).toEqual(data.id);
});

it('acknowledges the event', async () => {
    let { listener, data, msg } = await setUp();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});