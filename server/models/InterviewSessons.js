const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },

        questionType: {
            type: String,
            default: "technical"
        },

        topic: {
            type: String,
            default: ""
        },

        difficulty: {
            type: String,
            default: "medium"
        },

        answer: {
            type: String,
            default: ""
        },

        score: {
            type: Number,
            default: null
        },

        strengths: {
            type: [String],
            default: []
        },

        improvements: {
            type: [String],
            default: []
        },

        idealAnswerPoints: {
            type: [String],
            default: []
        }
    },
    {
        _id: true
    }
);

const interviewSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        status: {
            type: String,
            enum: ["in-progress", "completed"],
            default: "in-progress"
        },

        questions: {
            type: [interviewQuestionSchema],
            default: []
        },

        overallScore: {
            type: Number,
            default: null
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "InterviewSession",
    interviewSessionSchema
);