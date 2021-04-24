import request from 'supertest';
import { app } from '../../app';

declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>;
        }
    }
}

it('expects user to be created', async () => {
    request(app)
        .post('/api/users/signup')
        .send({
            email: 'testing@gmail.com',
            password: 'password'
        }).expect(201);
});

it('throw invalid email', async () => {
   await request(app)
       .post('/api/users/signup')
       .send({
           email: 'testing',
           password: 'password'
       }).expect(422);
});

it('throw invalid password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'testing@test.com',
            password: 'pass'
        }).expect(422);
});

it('disallows duplicate email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'testing@test.com',
            password: 'password1'
        }).expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'testing@test.com',
            password: 'password1'
        }).expect(422);
});

it ('sets a cookie on successful signup', async () => {
    let response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'testing@test.com',
            password: 'password1'
        });
    expect(response.get('Set-Cookie')).toBeDefined();
});

it ('signin a user', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'testing@test.com',
            password: 'password1'
        }).expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'testing@test.com',
            password: 'password1'
        }).expect(200);
});

it ('fetches info about logged in user', async () => {
   let response =  await request(app)
       .post('/api/users/signup')
       .send({
           email: 'testing@test.com',
           password: 'password1'
       }).expect(201);

   let cookie = response.get('Set-Cookie');
   let userResponse = await request(app)
       .get('/api/users/current-user')
       .set('Cookie', cookie)
       .send();

   expect(userResponse.body.user.email).toEqual('testing@test.com');
});

global.signin = async () => {
    let email = 'test@test.com';
    let password = 'password123';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        }).expect(201);

    return response.get('Set-Cookie');
};