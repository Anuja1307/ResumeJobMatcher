const KnowledgeChunk = require("../models/knowledgeChunk");
const {
    generateEmbedding
} = require("./aiService");


// --------------------------------------------------
// Store chunks
// --------------------------------------------------

async function storeChunks({
    userId,
    chunks,
    jobId = null,
    sessionId = null
}) {

    if (!chunks || chunks.length === 0) {
        return [];
    }

    const documents = [];

    for (const chunk of chunks) {

        const embedding =
            await generateEmbedding(chunk.text);

        documents.push({
            userId,

            source: chunk.source,

            type: chunk.type,

            text: chunk.text,

            embedding,

            // IMPORTANT:
            // Prefer the jobId attached to the chunk.
            // Otherwise use the jobId passed to this function.
            jobId:
                chunk.jobId ||
                jobId ||
                null,

            sessionId:
                chunk.sessionId ||
                sessionId ||
                null,

            metadata:
                chunk.metadata || {}
        });
    }

    return KnowledgeChunk.insertMany(
        documents
    );
}


// --------------------------------------------------
// Replace resume chunks
// --------------------------------------------------

async function replaceResumeChunks({
    userId,
    chunks
}) {

    await KnowledgeChunk.deleteMany({
        userId,
        source: "resume"
    });

    return storeChunks({
        userId,
        chunks
    });
}


// --------------------------------------------------
// Replace job chunks
// --------------------------------------------------

async function replaceJobChunks({
    userId,
    jobId,
    chunks
}) {

    await KnowledgeChunk.deleteMany({
        userId,
        source: "job",
        jobId
    });

    return storeChunks({
        userId,
        chunks,
        jobId
    });
}


// --------------------------------------------------
// Replace interview chunks
// --------------------------------------------------

async function replaceInterviewChunks({
    userId,
    sessionId,
    jobId,
    chunks
}) {

    // Delete all previous chunks belonging
    // to this interview session.
    await KnowledgeChunk.deleteMany({
        userId,
        source: "interview",
        sessionId
    });

    // Store the new chunks with the correct IDs.
    return storeChunks({
        userId,
        chunks,
        jobId,
        sessionId
    });
}


module.exports = {
    storeChunks,
    replaceResumeChunks,
    replaceJobChunks,
    replaceInterviewChunks
};