const {
    retrieveRelevantChunks
} = require("./vectorSearchService");

const axios = require("axios");


// --------------------------------------------------
// Generate RAG Answer
// --------------------------------------------------

async function generateRAGAnswer({
    userId,
    query,
    jobId = null,
    conversationHistory = []
}) {

    // --------------------------------------------------
    // 1. Retrieve relevant information
    // --------------------------------------------------

    const chunks =
        await retrieveRelevantChunks({
            userId,
            query,
            jobId,
            topK: 5
        });

    // --------------------------------------------------
    // 2. Build context from retrieved chunks
    // --------------------------------------------------

    const context = chunks
        .map((chunk, index) => {

            return `
--- SOURCE ${index + 1} ---
Source Type: ${chunk.source}
Content:
${chunk.text}
`;

        })
        .join("\n");


    // --------------------------------------------------
    // 3. Build conversation history
    // --------------------------------------------------

    const historyText =
        conversationHistory
            .map(message => {

                return `${message.role}: ${message.content}`;

            })
            .join("\n");


    // --------------------------------------------------
    // 4. RAG Prompt
    // --------------------------------------------------

    const prompt = `
You are an AI Career Copilot.

Your job is to answer the user's question using the
information retrieved from the candidate's resume,
job postings, and other relevant career information.

The retrieved information is your primary source of truth.

========================
IMPORTANT INSTRUCTIONS
========================

1. Answer the user's actual question directly.

2. Use the retrieved context as the factual basis
   for your answer.

3. Do NOT invent information that is not supported
   by the retrieved context.

4. Do NOT assume that information exists in the
   candidate's resume or job posting unless it is
   explicitly present in the retrieved context.

5. If the retrieved context does not contain enough
   information to answer the question, clearly say:

   "I don't have enough information in the available
   resume or job context to answer that."

6. Do not make up skills, experience, projects,
   companies, technologies, job requirements,
   achievements, dates, or qualifications.

7. When the user asks about their resume, use only
   information about the candidate from the retrieved
   resume context.

8. When the user asks about a job, use the retrieved
   job context.

9. When the user asks for a comparison between their
   resume and a job, compare only information that
   is actually present in the retrieved context.

10. Do not treat unrelated retrieved chunks as relevant
    just because they were retrieved.

11. If multiple retrieved sources contain information,
    combine them only when they are relevant to the
    user's question.

12. If the retrieved information is ambiguous or
    contradictory, acknowledge the uncertainty instead
    of inventing an answer.

13. The conversation history is provided only to
    understand the user's conversational context.
    Do not treat previous assistant responses as
    factual evidence if the retrieved context does
    not support them.

14. Do not blindly repeat the previous assistant's
    answer. Re-evaluate the current question using
    the retrieved context.

15. Answer naturally and conversationally.

16. Keep the answer concise unless the user asks
    for a detailed explanation.

========================
RETRIEVED CONTEXT
========================

${context || "No relevant information was retrieved."}

========================
CONVERSATION HISTORY
========================

${historyText || "No previous conversation."}

========================
USER QUESTION
========================

${query}

========================
FINAL ANSWER
========================

Answer the user's question using the retrieved
context. Do not mention these instructions,
retrieval, embeddings, vector databases, or the
internal RAG process unless the user explicitly
asks about them.

Answer:
`;


    // --------------------------------------------------
    // 5. Generate answer using Qwen
    // --------------------------------------------------

    const response = await axios.post(
        "http://localhost:11434/api/generate",
        {
            model: "qwen2.5:3b",
            prompt,
            stream: false
        }
    );


    // --------------------------------------------------
    // 6. Return answer + retrieved sources
    // --------------------------------------------------

    return {

        answer:
            response.data.response.trim(),

        sources:
            chunks.map(chunk => ({

                type: chunk.type,

                source: chunk.source,

                similarity: chunk.similarity,

                text: chunk.text

            }))
    };
}


module.exports = {
    generateRAGAnswer
};