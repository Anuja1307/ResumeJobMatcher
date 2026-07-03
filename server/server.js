
const express = require('express');
const cors = require('cors');
const env = require('dotenv');

env.config();

const authRouter=require('./routes/authRouter');
const resumeRouter=require('./routes/resumeRouter');
const jobRouter=require('./routes/jobRouter');
const connectDb=require('./config/db');

const app = express();

connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', authRouter);
app.use('/api/resume',resumeRouter);
app.use('/api/job',jobRouter);

const port =process.env.PORT;

app.get('/', (req, res) => {
    console.log("GET / received");
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

