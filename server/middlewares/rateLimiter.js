const { redisClient } = require("../config/redis");

const rateLimiter = (
    limit = 10,
    windowSeconds = 60,
    name = "default"
) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const key = `rate-limit:${name}:${userId}`;

            const currentCount =
                await redisClient.incr(key);

            if (currentCount === 1) {
                await redisClient.expire(
                    key,
                    windowSeconds
                );
            }

            if (currentCount > limit) {
                return res.status(429).json({
                    success: false,
                    message:
                        "Too many requests. Please try again later."
                });
            }

            next();

        } catch (error) {
            console.error(
                "Rate limiter error:",
                error
            );

            // Redis failure should not break the application
            next();
        }
    };
};

module.exports = rateLimiter;