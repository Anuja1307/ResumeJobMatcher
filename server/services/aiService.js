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


module.exports = {
    extractWithAI
};