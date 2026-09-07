const KnowledgeChunk = require("../models/knowledgeChunk");
const { generateEmbedding } = require("./aiService");
const mongoose = require("mongoose");

async function retrieveRelevantChunks({
    userId,
    query,
    jobId = null,
    topK = 3
}) {

    // 1. Convert the user's question into an embedding
    const queryEmbedding =
        await generateEmbedding(query);

    const objectUserId =
    new mongoose.Types.ObjectId(userId);

    const filter = {
    userId: objectUserId
};

if (jobId) {
    const objectJobId = new mongoose.Types.ObjectId(jobId);
    // Note: $or is not supported in $vectorSearch filter
    // We'll apply the $or filtering AFTER vector search using $match
}

const results = await KnowledgeChunk.aggregate([
    {
        $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 50,
            limit: topK * 3, // Get more candidates since we'll filter after
            filter
        }
    },
    {
        $project: {
            _id: 1,
            source: 1,
            type: 1,
            text: 1,
            jobId: 1,
            sessionId: 1,
            userId: 1,
            similarity: {
                $meta: "vectorSearchScore"
            }
        }
    },
    {
        $match: {
            similarity: {
                $gte: 0.45
            }
        }
    },
    {
        $match: {
            $or: [
                {
                    source: "resume"
                },
                ...(jobId ? [
                    {
                        source: "job",
                        jobId: new mongoose.Types.ObjectId(jobId)
                    },
                    {
                        source: "interview",
                        jobId: new mongoose.Types.ObjectId(jobId)
                    }
                ] : [])
            ]
        }
    },
    {
        $limit: topK
    }
]);

    return results;
}


module.exports = {
    retrieveRelevantChunks
};