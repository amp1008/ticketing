import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfgh';
    mongo = new MongoMemoryServer();
    let mongoURI = await mongo.getUri();

    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async (done) => {
    await mongo.stop();
    await mongoose.connection.close();
    done();
});