const request = require('supertest');
const app = require('../app');

describe('Resume API', () => {

    describe('POST /api/resume/upload', () => {

        test('should reject resume upload without authentication', async () => {
            const response = await request(app)
                .post('/api/resume/upload');

            expect(response.statusCode).toBe(401);
        });

    });

    describe('GET /api/resume/analysis', () => {

        test('should reject resume analysis without authentication', async () => {
            const response = await request(app)
                .get('/api/resume/analysis');

            expect(response.statusCode).toBe(401);
        });

    });

});