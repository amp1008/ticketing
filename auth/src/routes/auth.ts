import { Request, Response } from 'express';
import { BadRequestError } from '@amp-tickets/common';

import { generateToken } from '../services/token';
import { Password } from '../services/password';

import { User } from '../models/users';

function getCurrentUser (req: Request, res: Response) {
    res.status(200).send({
        user: req.current_user || null
    });
}

async function signUpUser (req: Request, res: Response) {
    let { email, password } = req.body;

    let userResult = await User.findOne({
        email
    });
    if (userResult) {
        throw new BadRequestError('Email already in use', 'EMAIL');
    }

    let user = User.createUser({
        email,
        password
    });
    await user.save();

    let token = generateToken(user);

    req.session = {
        jwt: token
    };

    res.status(201).send({
        result: user
    });
}

async function signInUser (req: Request, res: Response) {
    let { email, password } = req.body;

    let existingUser = await User.findOne({
        email
    });

    if (!existingUser) {
        throw new BadRequestError('Invalid credentials', 'CREDENTIALS');
    }

    let isPasswordMatch = Password.comparePassword(existingUser.password, password);
    if (!isPasswordMatch) {
        throw new BadRequestError('Invalid credentials', 'CREDENTIALS');
    }

    let token = generateToken(existingUser);
    req.session = {
        jwt: token
    };

    res.send({
        result: 'success',
        rescode: 0
    });
}

function signOutUser (req: Request, res: Response) {
    req.session = null;
    res.status(200).send({
        result: 'success'
    });
}

export {
    getCurrentUser,
    signUpUser,
    signInUser,
    signOutUser
};