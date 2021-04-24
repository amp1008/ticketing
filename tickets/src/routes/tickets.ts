import { Request, Response } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@amp-tickets/common';

import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

import { Tickets } from '../models/tickets';

async function createTicket (req: Request, res: Response) {
    let { title, price } = req.body || {};
    let userId = req.current_user!.id;

    let ticket = Tickets.createTicket({
        title,
        price,
        userId
    });

    await ticket.save();

    let publisher = new TicketCreatedPublisher(natsWrapper.client);

    await publisher.publish({
        id: ticket.id,
        title: ticket.title,
        userId: ticket.userId,
        price: ticket.price,
        version: ticket.version
    });

    res.status(201).send({
        result: ticket
    });
}

async function updateTicket (req: Request, res: Response) {
    let { title, price } = req.body || {};
    let ticketId = req.params.id;
    let user = req.current_user;

    let ticket = await Tickets.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    if (user!.id !== ticket.userId) {
        throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
        throw new BadRequestError('Ticket is reserved already.', 'TICKET');
    }

    ticket.set({
        title,
        price
    });
    await ticket.save();

    let publisher = new TicketUpdatedPublisher(natsWrapper.client);
    await publisher.publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });

    res.status(200).send({
        result: ticket
    });
}

async function fetchTicketById (req: Request, res: Response) {
    let id = req.params.id;
    if (!id) {
        throw new NotFoundError();
    }
    let ticket = await Tickets.findById(id);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.status(200).send({
        result: ticket
    });
}

async function fetchAllTickets (req: Request, res: Response) {
    let tickets = await Tickets.find({});
    res.status(200).send({
        result: tickets
    });
}

export { createTicket, fetchTicketById, fetchAllTickets, updateTicket };