const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRouter = require('./routes/authRouter');
const resumeRouter = require('./routes/resumeRouter');
const jobRouter = require('./routes/jobRouter');
const interviewRoutes = require('./routes/interviewRouter');
const ragRoutes = require('./routes/ragRoutes');
const careerChatRoutes = require('./routes/careerChatRoutes');

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/job', jobRouter);
app.use('/api/jobs', jobRouter);

app.use('/api/rag', ragRoutes);

app.use('/api/career-chat', careerChatRoutes);

app.use('/api/interview', interviewRoutes);

app.get('/', (req, res) => {
    console.log("GET / received");
    res.send('Server is running');
});

module.exports = app;