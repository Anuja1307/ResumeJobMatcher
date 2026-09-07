const { storeChunks } = require("../services/knowledgeService");
const {
    retrieveRelevantChunks
} = require("../services/vectorSearchService");
const {
    generateRAGAnswer
} = require("../services/ragService");

const testRAGIndexing = async (req, res) => {
    try {

        const userId = req.user.userId;

        const chunks = [
            {
                source: "resume",
                type: "test",
                text: "The candidate has experience with React, Node.js, MongoDB and Redis."
            },
            {
                source: "resume",
                type: "test",
                text: "The candidate built a full-stack application using the MERN stack."
            }
        ];

        const storedChunks = await storeChunks({
            userId,
            chunks
        });

        res.status(201).json({
            success: true,
            message: "RAG test chunks stored successfully",
            count: storedChunks.length,
            chunks: storedChunks
        });

    } catch (error) {

        console.error(
            "RAG indexing test error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to store RAG test chunks"
        });
    }
};

const testRAGRetrieval = async (req, res) => {
    try {

        const userId = req.user.userId;

        const { query, jobId } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }

        const results =
            await retrieveRelevantChunks({
                userId,
                query,
                jobId,
                topK: 3
            });

        res.status(200).json({
            success: true,
            query,
            jobId,
            results
        });

    } catch (error) {

        console.error(
            "RAG retrieval error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to retrieve chunks"
        });
    }
};
const testRAGChat = async (req, res) => {
    try {

        const userId = req.user.userId;
        const { query, jobId } = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }

        const result = await generateRAGAnswer({
            userId,
            query,
            jobId
        });

        res.status(200).json({
            success: true,
            query,
            ...result
        });

    } catch (error) {

        console.error(
            "RAG chat error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate RAG answer"
        });
    }
};
module.exports = {
    testRAGIndexing,testRAGRetrieval,testRAGChat
};