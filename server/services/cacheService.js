const { redisClient } = require("../config/redis");

async function getCache(key) {
    try {
        return await redisClient.get(key);
    } catch (error) {
        console.error("Redis GET error:", error);
        return null;
    }
}

async function setCache(key, value, ttl = 600) {
    try {
        await redisClient.set(key, value, {
            EX: ttl
        });
    } catch (error) {
        console.error("Redis SET error:", error);
    }
}

module.exports = {
    getCache,
    setCache
};