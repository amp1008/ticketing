import mongoose from 'mongoose';

import { app } from './app';

async function connectToDB () {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO URI is required !!');
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to Mongo Server');
    } catch (error) {
        console.error(error);
    }
}

connectToDB();

app.listen(3000, () => {
    console.log('Auth service listening on port 3000');
});