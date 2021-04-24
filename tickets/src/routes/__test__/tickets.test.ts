import request from 'supertest';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

import { app } from '../../app';

import { Tickets } from '../../models/tickets';
import {NotFoundError} from "@amp-tickets/common";

jest.mock('../../nats-wrapper');

it('expects /api/tickets/create path to be defined', async () => {
   let response = await request(app)
       .post('/api/tickets/create')
       .send({});
   expect(response.status).not.toEqual(404);
});

it('expects /api/tickets/create to return 401, when user is not authorized', async () => {
   let response = await request(app)
       .post('/api/tickets/create')
       .send({});
   expect(response.status).toEqual(401);
});

it('expects /api/tickets/create to return status != 401, when user is authorized', async () => {
    let response = await request(app)
        .post('/api/tickets/create')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('expects valid title', async () => {
   await request(app)
       .post('/api/tickets/create')
       .set('Cookie', global.signin())
       .send({
           title: '',
           price: 10
        })
       .expect(422);

    await request(app)
        .post('/api/tickets/create')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
        .expect(422);
});

it('expects valid price', async () => {
    await request(app)
        .post('/api/tickets/create')
        .set('Cookie', global.signin())
        .send({
            title: 'Ticket Price',
            price: -10
        })
        .expect(422);

    await request(app)
        .post('/api/tickets/create')
        .set('Cookie', global.signin())
        .send({
           title: 'Testing'
        })
        .expect(422);
});

it('expects ticket to be created successfully', async () => {
    let tickets = await Tickets.find({});
    expect(tickets.length).toEqual(0);
    await request(app)
        .post('/api/tickets/create')
        .set('Cookie', global.signin())
        .send({
            title: 'Ticket Price',
            price: 10
        })
        .expect(201);

    tickets = await Tickets.find({});
    expect(tickets.length).toEqual(1);
});

/* Test for fetching ticket by ID */
it('expects 404 when invalid ticket id is sent', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
       .get(`/api/tickets/fetch-by-id/${id}`)
       .send()
       .expect(404);
});

it('expects result when valid ticket id is sent', async () => {
    let title = 'Football';
    let price = 20;
    let createdTicket = await request(app)
        .post('/api/tickets/create')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        }).expect(201);

    let ticketId = (createdTicket.body.result && createdTicket.body.result.id) || '';

    let response = await request(app)
        .get(`/api/tickets/fetch-by-id/${ticketId}`)
        .send().expect(200);

    let fetchedTicket = response.body.result || {};

    expect(fetchedTicket.title).toEqual(title);
});

/* Test for fetching all tickets */
it('fetch all tickets', async () => {
    let cookie = global.signin();
    await request(app)
        .post('/api/tickets/create')
        .set('Cookie', cookie)
        .send({
            title: 'Football',
            price: 20
        }).expect(201);

    await request(app)
        .post('/api/tickets/create')
        .set('Cookie', cookie)
        .send({
            title: 'Cricket',
            price: 10
        }).expect(201);

    let response = await request(app).get('/api/tickets/fetch').expect(200);
    let tickets = response.body.result || [];
    expect(tickets.length).toEqual(2);
});

/* Test for updating a ticket */

it('expects 401 if user is not authenticated', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/update/${id}`)
        .send({}).expect(401);
});

it('expects 404 if ticket id is not valid', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/update/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Football',
            price: 20
        }).expect(404);
});

it('expects 422 for invalid body', async () => {
    let cookie = global.signin();
    let response = await request(app)
        .post('/api/tickets/create')
        .set('Cookie', cookie)
        .send({
            title: 'Football',
            price: 20
        }).expect(201);

    let ticketId = response.body.result && response.body.result.id;
    await request(app)
        .put(`/api/tickets/update/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        }).expect(422);

    await request(app)
        .put(`/api/tickets/update/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: -20
        }).expect(422);
});

it('expects 401 when another user tries to update the ticket', async () => {
    let response = await request(app)
        .post('/api/tickets/create')
        .set('Cookie', global.signin())
        .send({
            title: 'Football',
            price: 20
        }).expect(201);

    let ticketId = response.body.result && response.body.result.id;
    await request(app)
        .put(`/api/tickets/update/${ticketId}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Football',
            price: 20
        }).expect(401);
});

it('expects publisher to be called', async () => {
    let response = await request(app)
        .post('/api/tickets/create')
        .set('Cookie', global.signin())
        .send({
            title: 'Football',
            price: 20
        }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('expects optimistic concurrency control', async (done) => {
    let ticket = Tickets.createTicket({
        title: 'Concert',
        price: 20,
        userId: '12345'
    });

    await ticket.save();

    let ticketInstance1 = await Tickets.findById(ticket.id);
    let ticketInstance2 = await Tickets.findById(ticket.id);

    ticketInstance1!.set({
        price: 25
    });

    ticketInstance2!.set({
        price: 40
    });

    await ticketInstance1!.save();

    try {
        await ticketInstance2!.save();
    } catch (error) {
        return done();
    }

    throw new Error('Failed optimistic concurrency control');
});

it('rejects updating ticket if ticket is already reserved', async () => {
    let cookie = global.signin();

    let ticketDetails = await request(app)
        .post('/api/tickets/create')
        .set('Cookie', cookie)
        .send({
            title: 'IPL',
            price: 2500
        }).expect(201);

    let ticket = await Tickets.findById(ticketDetails.body.result.id);
    if (!ticket) {
        throw new NotFoundError();
    }
    ticket.set({
        orderId: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    console.log(ticket.id);

    await request(app)
        .put(`/api/tickets/update/${ticket.id}`)
        .set('Cookie', cookie)
        .send({
            title: ticket.title,
            price: 1000
        }).expect(422);
});