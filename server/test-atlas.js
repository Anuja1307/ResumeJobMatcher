const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;

async function test() {
   const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    family: 4
});
    try {
        console.log("Connecting with MongoDB driver...");

        await client.connect();

        console.log("✅ MongoDB driver connected");

        await client.db("resumeJobMatcher").command({
            ping: 1
        });

        console.log("✅ Atlas ping successful");

    } catch (error) {
        console.error("❌ Driver connection failed");
        console.error(error);
    } finally {
        await client.close();
    }
}

test();