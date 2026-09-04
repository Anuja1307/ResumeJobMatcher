const Job = require("../models/jobs");
const { cosineSimilarity } = require("./vectorSimilarity");

async function matchResumeToJobs(userId, resumeEmbedding) {

    const jobs = await Job.find({
        userId: userId,
        embedding: {
            $exists: true,
            $ne: []
        }
    });

    const matches = [];

    for (const job of jobs) {

        if (!job.embedding || job.embedding.length === 0) {
            continue;
        }

        if (job.embedding.length !== resumeEmbedding.length) {
            continue;
        }

        const similarity = cosineSimilarity(
            resumeEmbedding,
            job.embedding
        );

        matches.push({
            job,
            similarity,
            matchScore: Math.round(similarity * 100)
        });
    }

    matches.sort(
        (a, b) => b.similarity - a.similarity
    );

    return matches;
}

module.exports = {
    matchResumeToJobs
};