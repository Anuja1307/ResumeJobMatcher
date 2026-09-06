import api from './api';

export const startInterview = async (jobId) => {
    return await api.post('/interview/start', { jobId });
};

export const submitAnswer = async (sessionId, answer) => {
    return await api.post(`/interview/${sessionId}/answer`, { answer });
};

export const getInterviewSession = async (sessionId) => {
    return await api.get(`/interview/${sessionId}`);
};

export const completeInterview = async (sessionId) => {
    return await api.post(`/interview/${sessionId}/complete`);
};
