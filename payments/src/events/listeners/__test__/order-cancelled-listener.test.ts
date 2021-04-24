import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@amp-tickets/common';

import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Orders } from '../../../models/orders';
import {Order} from "../../../../../orders/src/models/order";

async function setUp () {
    let listener = new OrderCancelledListener(natsWrapper.client);

    let order = Orders.createOrder({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 150
    });

    await order.save();

    let data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString()
        }
    };

    // @ts-ignore
    let msg: Message = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg,
        order
    };
}

it('expects order to be marked as cancelled', async () => {
   let { listener, msg, data, order } = await setUp();

   await listener.onMessage(data, msg);

    let existingOrder = await Orders.findById(data.id);

    expect(existingOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acknowledges after marking the order as cancelled', async () => {
    let { listener, msg, data, order } = await setUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});