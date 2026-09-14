const jwt = require('jsonwebtoken');
const protect = require('../middlewares/authMiddleware');

process.env.JWT_SECRET = 'test-secret';

describe('Authentication Middleware', () => {

    test('should reject request without token', () => {
        const req = {
            headers: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });


    test('should reject invalid token', () => {
        const req = {
            headers: {
                authorization: 'Bearer invalid-token'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });


    test('should allow request with valid token', () => {
        const token = jwt.sign(
            { userId: 'test-user-id' },
            process.env.JWT_SECRET
        );

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        const res = {};

        const next = jest.fn();

        protect(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user.userId).toBe('test-user-id');
    });

});