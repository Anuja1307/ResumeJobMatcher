function createInterviewChunks(session) {

    const chunks = [];

    if (!session.questions?.length) {
        return chunks;
    }

    session.questions.forEach((question, index) => {

        if (!question.answer) {
            return;
        }

        const text = `
Interview Question ${index + 1}:

Question:
${question.question || ""}

Question Type:
${question.questionType || ""}

Topic:
${question.topic || ""}

Difficulty:
${question.difficulty || ""}

Candidate Answer:
${question.answer || ""}

Score:
${question.score ?? ""}

Strengths:
${(question.strengths || []).join(", ")}

Areas for Improvement:
${(question.improvements || []).join(", ")}

Ideal Answer Points:
${(question.idealAnswerPoints || []).join(", ")}
        `.trim();

        chunks.push({
            source: "interview",
            type: "question-answer",
            text,

            // Explicitly preserve the interview's job
            jobId: session.jobId,

            // Explicitly preserve the interview session
            sessionId: session._id
        });
    });

    return chunks;
}


module.exports = {
    createInterviewChunks
};