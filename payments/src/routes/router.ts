import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
    OrderStatus,
    BadRequestError
} from '@amp-tickets/common';
import { Orders } from '../models/orders';
import { Payments } from '../models/payments';
import { stripe } from '../stripe';

import { PaymentCompletedPublisher } from '../events/publishers/payment-completed-publisher';
import {natsWrapper} from "../nats-wrapper";

let router = Router();

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
], validateRequest, makePayment);

async function makePayment (req: Request, res: Response) {
    let { orderId, token } = req.body || {};

    let existingOrder = await Orders.findById(orderId);
    if (!existingOrder) {
        throw new NotFoundError();
    }

    if (existingOrder!.userId !== req.current_user!.id) {
        throw new NotAuthorizedError();
    }

    if (existingOrder.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for cancelled order', 'ORDER');
    }

    try {
        console.log(existingOrder.price);
        console.log(`token is ${token}`);
        let stripeDetails = await stripe.charges.create({
            amount: existingOrder.price * 100,
            currency: 'inr',
            source: token,
            description: 'Deducting the amount for purchasing ticket'
        });

        console.log(stripeDetails);
        let payment = Payments.createPayment({
            orderId,
            stripeId: stripeDetails.id
        });

        await payment.save();

        await new PaymentCompletedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });
        res.status(201).send({
            result: 'success'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: ['Failed to make payment']
        });
    }
}

export { router };