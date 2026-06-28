
const express = require('express');
const cors = require('cors');
const env = require('dotenv');

const authRouter=require('./routes/authRouter');
const connectDb=require('./config/db');


const app = express();

env.config();
connectDb();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

const port =process.env.PORT;

app.get('/', (req, res) => {
    console.log("GET / received");
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

