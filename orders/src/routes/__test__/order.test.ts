import request from 'supertest';
import mongoose from 'mongoose';

import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper');

it('returns an error, if ticket id is not present', async () => {
    let ticketId = mongoose.Types.ObjectId();
    await request(app)
       .post('/api/orders/create')
       .set('Cookie', global.signin())
       .send({
           ticketId: ticketId
       }).expect(404);
});

it('returns an error, if ticket is already reserved', async () => {
    let ticket = Ticket.createTicket({
        title: 'Concert',
        price: 20,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    let order = Order.createOrder({
        ticket,
        status: OrderStatus.Created,
        expiresAt: new Date(),
        userId: 'abcd'
    });

    await order.save();

    await request(app)
        .post('/api/orders/create')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        }).expect(422);
});

it('creates an order, when ticket is not reserved', async () => {
   let ticket = Ticket.createTicket({
       title: 'Football',
       price: 20,
       id: mongoose.Types.ObjectId().toHexString()
   });

   await ticket.save();

   await request(app)
       .post('/api/orders/create')
       .set('Cookie', global.signin())
       .send({
           ticketId: ticket.id
       }).expect(201);
});

async function createTicket (title: string, price: number) {
    let ticket = Ticket.createTicket({
        title,
        price,
        id: mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();
    return ticket;
}

it('fetches orders for a particular user', async () => {
    let ticket1 = await createTicket('Football', 30);
    let ticket2 = await createTicket('Cricket', 10);
    let ticket3 = await createTicket('Concert', 5);

    let userOne = global.signin();
    let userTwo = global.signin();

    await request(app)
        .post('/api/orders/create')
        .set('Cookie', userOne)
        .send({
            ticketId: ticket1.id
        }).expect(201);

    await request(app)
        .post('/api/orders/create')
        .set('Cookie', userTwo)
        .send({
            ticketId: ticket2.id
        }).expect(201);

    await request(app)
        .post('/api/orders/create')
        .set('Cookie', userTwo)
        .send({
            ticketId: ticket3.id
        }).expect(201);

    let response = await request(app)
        .get('/api/orders/fetch')
        .set('Cookie', userTwo)
        .expect(200);

    expect(response.body.result.length).toEqual(2);
});

it('fetches an order', async () => {
    let ticket1 = await createTicket('Football', 30);

    let user = global.signin();

    let order = await request(app)
        .post('/api/orders/create')
        .set('Cookie', user)
        .send({
            ticketId: ticket1.id
        }).expect(201);

    await request(app)
        .get(`/api/orders/fetch?id=${order.body.result.id}`)
        .set('Cookie', user)
        .expect(200);
});

it('cancels an order', async () => {
    let ticket1 = await createTicket('Football', 30);

    let user = global.signin();

    let order = await request(app)
        .post('/api/orders/create')
        .set('Cookie', user)
        .send({
            ticketId: ticket1.id
        }).expect(201);

    let { body: updatedOrder } = await request(app)
        .delete('/api/orders/delete')
        .set('Cookie', user)
        .send({
            orderId: order.body.result.id
        })
        .expect(200);

    expect(updatedOrder.result.status).toEqual(OrderStatus.Cancelled);
});

it('expects publisher to be called', async () => {
    let ticket = Ticket.createTicket({
        title: 'Football',
        price: 20,
        id: mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    await request(app)
        .post('/api/orders/create')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('expects order cancelled publisher to be invoked', async () => {
    let ticket1 = await createTicket('Football', 30);

    let user = global.signin();

    let order = await request(app)
        .post('/api/orders/create')
        .set('Cookie', user)
        .send({
            ticketId: ticket1.id
        }).expect(201);

    let { body: updatedOrder } = await request(app)
        .delete('/api/orders/delete')
        .set('Cookie', user)
        .send({
            orderId: order.body.result.id
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});