
const express = require('express');
const cors = require('cors');
const env = require('dotenv');

env.config();

const authRouter=require('./routes/authRouter');
const resumeRouter=require('./routes/resumeRouter');
const connectDb=require('./config/db');

const app = express();

connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: ['text/plain', 'application/json'] }));
app.use((req, res, next) => {
    if (typeof req.body === 'string') {
        try {
            req.body = JSON.parse(req.body);
        } catch (err) {
            // keep raw text if it's not valid JSON
        }
    }
    next();
});

app.use('/api/auth', authRouter);
app.use('/api/resume',resumeRouter);

const port =process.env.PORT;

app.get('/', (req, res) => {
    console.log("GET / received");
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

