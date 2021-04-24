import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Orders } from '../../models/orders';
import { OrderStatus } from '@amp-tickets/common';
import { stripe } from '../../stripe';

it('returns a 404, on purchasing a order which does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            orderId: mongoose.Types.ObjectId().toHexString(),
            token: 'random_token'
        }).expect(404);
});

it('returns a 401, on purchasing the order that does not belong to the user', async () => {
    let order = Orders.createOrder({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 100,
        version: 0,
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            orderId: order.id,
            token: 'random_token'
        }).expect(401);
});

it('returns a 422, on purchasing a cancelled order', async () => {
    let userId = mongoose.Types.ObjectId().toHexString();

    let order = Orders.createOrder({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 100,
        version: 0,
        userId,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'random_token'
        }).expect(422);
});

it('returns a 201, when payment is successfully done', async () => {
    let userId = mongoose.Types.ObjectId().toHexString();
    let price = Math.round(Math.random() * 1000);

    let order = Orders.createOrder({
        id: mongoose.Types.ObjectId().toHexString(),
        price,
        version: 0,
        userId,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'tok_visa'
        }).expect(201);

    let paymentList = await stripe.charges.list({
        limit: 20
    });

    let payment = paymentList.data.find((charge) => charge.amount === price);
    expect(payment).toBeDefined();
    expect(payment!.currency).toEqual('inr');
});