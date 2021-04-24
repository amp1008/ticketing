import mongoose from 'mongoose';
import { ExpirationCompleteEvent, OrderStatus } from '@amp-tickets/common';
import request from 'supertest';
import { Message } from 'node-nats-streaming';

import {app} from '../../../app';
import {Order} from '../../../models/order';
import {Ticket} from '../../../models/ticket';
import {ExpirationCompleteListener} from '../expiration-complete-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {OrderCancelledPublisher} from "../../publisher/order-cancelled-publisher";

async function setUp () {
    let listener = new ExpirationCompleteListener(natsWrapper.client);

    let ticket = await Ticket.createTicket({
        title: 'IPL',
        price: 2500,
        id: mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    let order = await Order.createOrder({
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket
    });

    await order.save();

    let data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // @ts-ignore
    let msg: Message = {
        ack: jest.fn()
    };

    return {
        data,
        msg,
        order,
        listener
    };
}

it('expects order status to be set to cancelled', async () => {
    let { listener, msg, data } = await setUp();

    await listener.onMessage(data, msg);
    let order = await Order.findById(data.orderId);

    expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('emits order cancelled event to be published', async () => {
    let { listener, order, msg, data } = await setUp();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    let eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it('acknowledges order on successful update of order', async () => {
    let { listener, msg, data } = await setUp();

    await listener.onMessage(data, msg);


    expect(msg.ack).toHaveBeenCalled();
});