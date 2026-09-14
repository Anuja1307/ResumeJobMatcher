const request = require('supertest');
const app = require('../app');

describe('Authentication API', () => {
//sending {} to /api/auth/register and /api/auth/login should return 400 Bad Request
    describe('POST /api/auth/register', () => {

        test('should reject registration with missing required fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({});

            expect(response.statusCode).toBe(400);
        });

    });

    describe('POST /api/auth/login', () => {

        test('should reject login with missing required fields', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.statusCode).toBe(400);
        });

    });

});