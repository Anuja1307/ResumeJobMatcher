import api from './api';

/**
 * Sends a message to the AI Career Chat RAG backend.
 * @param {Object} params
 * @param {string} params.query - User query text
 * @param {string} [params.jobId] - Optional selected job ID
 * @param {string} [params.conversationId] - Optional existing conversation ID
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const sendCareerChatMessage = async ({ query, jobId, conversationId }) => {
    const payload = { query };
    if (jobId) {
        payload.jobId = jobId;
    }
    if (conversationId) {
        payload.conversationId = conversationId;
    }

    return await api.post('/career-chat', payload);
};
