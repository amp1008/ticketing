import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@amp-tickets/common';
import { router } from './routes/router';

const app = express();
app.set('trust proxy', true);
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(json());
app.use(currentUser);

app.use(router);

app.all('*', () => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };