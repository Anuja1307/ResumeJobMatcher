const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
    console.log("Redis connecting...");
});

redisClient.on("ready", () => {
    console.log("Redis connected and ready");
});

async function connectRedis() {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
        } catch (err) {
            console.error("Redis connection error:", err.message);
        }
    }
}

module.exports = {
    redisClient,
    connectRedis
};