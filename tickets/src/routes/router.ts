import { Router } from 'express';
import { requireAuth, validateRequest } from '@amp-tickets/common';
import { body } from 'express-validator';

import { createTicket, fetchTicketById, fetchAllTickets, updateTicket } from './tickets';

let router = Router();

router.post('/api/tickets/create', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is not valid'),
    body('price').isFloat({
        gt: 0
    }).withMessage('Price must be greater than 0')
], validateRequest, createTicket);

router.put('/api/tickets/update/:id', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is not valid'),
    body('price').isFloat({
        gt: 0
    }).withMessage('Price must be greater than 0')
], validateRequest, updateTicket);

router.get('/api/tickets/fetch', fetchAllTickets);

router.get('/api/tickets/fetch-by-id/:id', fetchTicketById);

export default router;