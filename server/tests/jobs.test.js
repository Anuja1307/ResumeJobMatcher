const request = require('supertest');
const app = require('../app');

describe('Job API', () => {

    test('should reject getting saved jobs without authentication', async () => {
        const response = await request(app)
            .get('/api/jobs/saved');

        expect(response.statusCode).toBe(401);
    });

    test('should reject getting a saved job without authentication', async () => {
        const response = await request(app)
            .get('/api/jobs/saved/123');

        expect(response.statusCode).toBe(401);
    });

    test('should reject creating a job without authentication', async () => {
        const response = await request(app)
            .post('/api/jobs/save')
            .send({
                title: 'Software Developer',
                company: 'Test Company'
            });

        expect(response.statusCode).toBe(401);
    });

    test('should reject updating a job without authentication', async () => {
        const response = await request(app)
            .put('/api/jobs/123')
            .send({
                title: 'Updated Job'
            });

        expect(response.statusCode).toBe(401);
    });

    test('should reject deleting a job without authentication', async () => {
        const response = await request(app)
            .delete('/api/jobs/123');

        expect(response.statusCode).toBe(401);
    });

    test('should reject job matching without authentication', async () => {
        const response = await request(app)
            .get('/api/jobs/matches');

        expect(response.statusCode).toBe(401);
    });

});