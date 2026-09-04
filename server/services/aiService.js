const axios = require("axios");


// FastAPI AI service
const AI_SERVICE_URL = "http://127.0.0.1:8000";


// ============================================================
// Send resume text to Python AI service
// ============================================================

async function extractWithAI(resumeText) {

    try {

        const response = await axios.post(
            `${AI_SERVICE_URL}/extract`,
            {
                text: resumeText
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "AI service error:",
            error.message
        );

        throw new Error(
            "AI extraction service is unavailable"
        );
    }
}

async function generateEmbedding(text) {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/embed`,
            {
                text: text
            }
        );

        return response.data.embedding;

    } catch (error) {
        console.error(
            "Embedding service error:",
            error.message
        );

        throw new Error(
            "Embedding service is unavailable"
        );
    }
}
async function extractJobSkills(description) {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/extract-job`,
            {
                description
            }
        );

        return response.data.skills || [];

    } catch (error) {
        console.error(
            "Job skill extraction error:",
            error.message
        );

        throw new Error(
            "Job skill extraction service is unavailable"
        );
    }
}

async function extractJobKeywords(description) {

    try {

        const response = await axios.post(
            `${AI_SERVICE_URL}/extract-job-keywords`,
            {
                description
            }
        );

        return response.data.keywords || [];

    } catch (error) {

        console.error(
            "Job keyword extraction error:",
            error.message
        );

        throw new Error(
            "Job keyword extraction service is unavailable"
        );
    }
}
async function analyzeResume(resume) {

    try {

        const response = await axios.post(
            `${AI_SERVICE_URL}/analyze-resume`,
            {
                resume
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Resume analysis error:",
            error.message
        );

        throw new Error(
            "Resume analysis service is unavailable"
        );
    }
}

async function analyzeResumeForJob(
    resume,
    job,
    ats
) {

    try {

        const response = await axios.post(
            `${AI_SERVICE_URL}/analyze-resume-for-job`,
            {
                resume,
                job,
                ats
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Job-specific analysis error:",
            error.message
        );

        throw new Error(
            "Job-specific analysis service is unavailable"
        );
    }
}


module.exports = {
    extractWithAI,
    generateEmbedding,
    extractJobSkills,
    extractJobKeywords,
    analyzeResume,
    analyzeResumeForJob
};