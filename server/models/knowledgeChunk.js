const mongoose = require("mongoose");

const knowledgeChunkSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        source: {
            type: String,
            enum: [
                "resume",
                "job",
                "interview"
            ],
            required: true
        },

        type: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        },

        embedding: {
            type: [Number],
            required: true
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            default: null
        },

        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewSession",
            default: null
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "KnowledgeChunk",
    knowledgeChunkSchema
);