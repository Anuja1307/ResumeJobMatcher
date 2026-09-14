const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
    test('should return server running message', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Server is running');
    });
});
//When I send GET / to my Express application, I expect HTTP 200 and the text Server is running
