import { Request, Response } from 'express';
import { BadRequestError, NotFoundError, NotAuthorizedError } from '@amp-tickets/common';

import { Order, OrderStatus } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';

const EXPIRATION_WINDOW_SECONDS = 60;

async function fetchOrders (req: Request, res: Response) {
    let userId = req.current_user!.id;
    let orders = await Order.find({
        userId
    }).populate('ticket');

    res.status(200).send({
        result: orders
    });
}

async function fetchOrder (req: Request, res: Response) {
    let userId = req.current_user!.id;
    let orderId = req.params.id;

    let order = await Order.findById(orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== userId) {
        throw new NotAuthorizedError();
    }

    res.status(200).send({
        result: order
    });
}

async function createOrder (req: Request, res: Response) {
    /* Check if ticket is present */
    let { ticketId } = req.body || {};
    let ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    /* Check if ticket is already reserved */
    let isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved', 'TICKET');
    }

    let expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    let order = Order.createOrder({
        userId: req.current_user!.id,
        status: OrderStatus.Created,
        expiresAt: expirationDate,
        ticket,
    });

    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        userId: order.userId,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
            title: ticket.title
        }
    });

    res.status(201).send({
        result: order
    });
}

async function deleteOrder (req: Request, res: Response) {
    let { orderId } = req.body || {};

    let existingOrder = await Order.findById(orderId).populate('ticket');
    if (!existingOrder) {
        throw new NotFoundError();
    }

    if (existingOrder.userId !== req.current_user!.id) {
        throw new NotAuthorizedError();
    }

    // existingOrder.status = OrderStatus.Cancelled;
    existingOrder.set({
        status: OrderStatus.Cancelled
    });
    await existingOrder.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: existingOrder.id,
        version: existingOrder.version,
        ticket: {
            id: existingOrder.ticket.id
        }
    });

    res.status(200).send({
        result: existingOrder
    });
}

export {
    fetchOrders,
    fetchOrder,
    createOrder,
    deleteOrder
};