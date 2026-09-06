const InterviewSession = require("../models/InterviewSessons");
const Job = require("../models/jobs");
const User = require("../models/user");


const {
    generateInterviewQuestion,evaluateInterviewAnswer
} = require("../services/aiService");



const startInterview = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user);

        const userId = req.user.userId;

        console.log("USER ID:", userId);

        const { jobId } = req.body;

        console.log("JOB ID:", jobId);

        

        // 1. Validate jobId
        if (!jobId) {
            return res.status(400).json({
                message: "jobId is required"
            });
        }

        // 2. Find the job
        const job = await Job.findById(jobId);

        console.log("Requested jobId:", jobId);
        console.log("Logged-in userId:", userId);
        console.log("Found job:", job);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // 3. Find the user's resume
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.resume) {
            return res.status(400).json({
                message: "Please upload a resume before starting an interview"
            });
        }

        // 4. Generate first interview question
        const question = await generateInterviewQuestion(
            user.resume,
            job
        );

        // 5. Create interview session
        const session = await InterviewSession.create({
            userId,
            jobId,
            status: "in-progress",
            questions: [
                {
                    question: question.question,
                    questionType: question.questionType,
                    topic: question.topic,
                    difficulty: question.difficulty
                }
            ]
        });

        // 6. Return session
        res.status(201).json({
            success: true,
            sessionId: session._id,
            question: question
        });

    } catch (error) {

        console.error(
            "Start interview error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to start interview"
        });
    }
};

const submitAnswer = async (req, res) => {
    try {

        const userId = req.user.userId;
        const { sessionId } = req.params;
        const { answer } = req.body;

        if (!answer || !answer.trim()) {
            return res.status(400).json({
                message: "Answer is required"
            });
        }

        // 1. Find the interview session
        const session = await InterviewSession.findOne({
            _id: sessionId,
            userId: userId
        });

        if (!session) {
            return res.status(404).json({
                message: "Interview session not found"
            });
        }

        if (session.status === "completed") {
            return res.status(400).json({
                message: "Interview has already been completed"
            });
        }

        // 2. Get the current unanswered question
        const currentQuestion =
            [...session.questions]
                .reverse()
                .find(question => !question.answer);

        if (!currentQuestion) {
            return res.status(400).json({
                message: "No unanswered question found"
            });
        }

        // 3. Get job
        const job = await Job.findById(session.jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // 4. Get user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 5. Evaluate answer using AI
        const evaluation = await evaluateInterviewAnswer(
            currentQuestion.question,
            answer,
            user.resume,
            job
        );

        // 6. Save answer + evaluation
        currentQuestion.answer = answer;
        currentQuestion.score = evaluation.score;
        currentQuestion.strengths = evaluation.strengths || [];
        currentQuestion.improvements =
            evaluation.improvements || [];
        currentQuestion.idealAnswerPoints =
            evaluation.idealAnswerPoints || [];

        // 7. Generate next question if max questions limit not reached (max 5)
        const MAX_QUESTIONS = 5;
        let nextQuestion = null;

        if (session.questions.length < MAX_QUESTIONS) {
            nextQuestion = await generateInterviewQuestion(
                user.resume,
                job,
                currentQuestion.question,
                answer
            );

            session.questions.push({
                question: nextQuestion.question,
                questionType: nextQuestion.questionType,
                topic: nextQuestion.topic,
                difficulty: nextQuestion.difficulty
            });
        }

        // 8. Save session
        await session.save();

        // 9. Return evaluation + next question
        res.status(200).json({
            success: true,
            evaluation: {
                score: evaluation.score,
                strengths: evaluation.strengths || [],
                improvements: evaluation.improvements || [],
                idealAnswerPoints: evaluation.idealAnswerPoints || []
            },
            nextQuestion
        });

    } catch (error) {
        console.error(
            "Submit interview answer error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to submit interview answer"
        });
    }
};

const getInterviewSession = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { sessionId } = req.params;

        const session = await InterviewSession.findOne({
            _id: sessionId,
            userId: userId
        }).populate(
            "jobId",
            "title company location experience"
        );

        if (!session) {
            return res.status(404).json({
                message: "Interview session not found"
            });
        }

        res.status(200).json({
            success: true,
            session
        });

    } catch (error) {
        console.error(
            "Get interview session error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to get interview session"
        });
    }
};

const completeInterview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { sessionId } = req.params;

        const session = await InterviewSession.findOne({
            _id: sessionId,
            userId: userId
        });

        if (!session) {
            return res.status(404).json({
                message: "Interview session not found"
            });
        }

        if (session.status === "completed") {
            return res.status(400).json({
                message: "Interview has already been completed"
            });
        }

        // Remove trailing unanswered questions if user finishes interview early
        session.questions = session.questions.filter(
            question => question.answer && question.answer.trim() !== ""
        );

        if (session.questions.length === 0) {
            return res.status(400).json({
                message: "Please answer at least one interview question before completing the interview"
            });
        }

        const scores = session.questions
            .map(question => question.score)
            .filter(score => score !== null && score !== undefined);

        if (scores.length === 0) {
            return res.status(400).json({
                message: "No evaluated questions found"
            });
        }

        const totalScore = scores.reduce(
            (sum, score) => sum + score,
            0
        );

        const overallScore = totalScore / scores.length;

        session.overallScore = Math.round(overallScore * 10) / 10;
        session.status = "completed";
        session.completedAt = new Date();

        await session.save();

        res.status(200).json({
            success: true,
            message: "Interview completed successfully",
            sessionId: session._id,
            status: session.status,
            overallScore: session.overallScore,
            questionsAnswered: scores.length,
            completedAt: session.completedAt
        });

    } catch (error) {
        console.error(
            "Complete interview error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to complete interview"
        });
    }
};


module.exports = {
    startInterview,
    submitAnswer,
    getInterviewSession,
    completeInterview
};