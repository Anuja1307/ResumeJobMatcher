
const express = require('express');
const cors = require('cors');
const env = require('dotenv');

env.config();

const authRouter=require('./routes/authRouter');
const resumeRouter=require('./routes/resumeRouter');
const jobRouter=require('./routes/jobRouter');
const interviewRoutes = require("./routes/interviewRouter");
const ragRoutes = require("./routes/ragRoutes");
const careerChatRoutes =
    require("./routes/careerChatRoutes");

const connectDb=require('./config/db');
const { connectRedis } = require("./config/redis");

const app = express();

connectDb();
connectRedis();

app.use(cors({
    origin: 'http://localhost:5173',   
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', authRouter);
app.use('/api/resume',resumeRouter);
app.use('/api/job',jobRouter);
app.use('/api/jobs',jobRouter);
app.use(
    "/api/rag",
    ragRoutes
);
app.use(
    "/api/career-chat",
    careerChatRoutes
);

app.use('/api/interview', interviewRoutes);
const port =process.env.PORT;

app.get('/', (req, res) => {
    console.log("GET / received");
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

