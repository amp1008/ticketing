import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}

let mongo: any;
jest.mock('../nats-wrapper');
// jest.mock('../stripe');

process.env.STRIPE_KEY = 'sk_test_51IfimaSI8WqdBX9ivGpyGGo3XwdFnjt2iPcw1vIRSYWMLLjhLCw9XXumZ8jPBBvY7cmxwfepNBWbLeXndZO4lUqB00pZuIeA5b';
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
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id = '') => {
    let payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "test123@test.com"
    };
    let token = jwt.sign(payload, process.env.JWT_KEY!);
    let jsonObj = {
        jwt: token
    };

    let base64 = Buffer.from(JSON.stringify(jsonObj)).toString('base64');
    return [`express:sess=${base64}`];
};