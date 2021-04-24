import { Router } from 'express';
import { requireAuth, validateRequest } from '@amp-tickets/common';
import { body } from 'express-validator';

import { createOrder, fetchOrders, fetchOrder, deleteOrder } from './orders';

const router = Router();

router.get('/api/orders/fetch', requireAuth, fetchOrders);

router.get('/api/orders/fetch-by-id/:id', requireAuth, fetchOrder);

router.post('/api/orders/create', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('Ticket Id must be present')
], validateRequest, createOrder);

router.delete('/api/orders/delete', requireAuth, [
    body('orderId')
        .not()
        .isEmpty()
        .withMessage('Order Id must be present')
], validateRequest, deleteOrder);

export default router;