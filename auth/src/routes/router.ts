import { Router } from 'express';
import { body } from 'express-validator';
import { currentUser, validateRequest } from '@amp-tickets/common';

import { getCurrentUser, signInUser, signUpUser, signOutUser } from './auth';

const router = Router();

router.get('/api/users/current-user', currentUser, getCurrentUser);

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').trim().isLength({
        min: 8,
        max: 20
    }).withMessage('Password must be between 8 and 20 characters')
], validateRequest, signUpUser);

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').trim().notEmpty().withMessage('Password must not be empty')
], validateRequest, signInUser);
router.post('/api/users/signout', signOutUser);

export {
    router
};