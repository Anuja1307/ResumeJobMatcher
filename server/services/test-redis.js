   const { redisClient, connectRedis } = require("../config/redis");

async function testRedis() {
    try {
        await connectRedis();

        await redisClient.set("test:key", "Hello Redis");

        const value = await redisClient.get("test:key");

        console.log("Redis value:", value);

        await redisClient.del("test:key");

        await redisClient.quit();

    } catch (error) {
        console.error("Redis test failed:", error);
    }
}

testRedis();