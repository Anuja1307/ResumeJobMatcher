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
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"] : true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'ResumeJobMatcher backend is healthy' });
});

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