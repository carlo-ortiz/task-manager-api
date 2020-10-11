/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase)

test('Should sign-up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Max',
        email: 'example@sample.com',
        password: '123pass'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Max',
            email: 'example@sample.com'
        },
        token: user.tokens[0].token
    })

    // Assert that the plaintext password is not stored in the database
    expect(user.password).not.toBe('123pass')
})

test('Should log-in existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not log-in nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'somepassword'
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'JuanTwo' }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('JuanTwo')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
        .send({ location: 'QC' }).expect(400)
})