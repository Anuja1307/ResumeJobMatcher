const env = require('dotenv');

env.config();

const app = require('./app');

const connectDb = require('./config/db');
const { connectRedis } = require('./config/redis');

connectDb();
connectRedis();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});