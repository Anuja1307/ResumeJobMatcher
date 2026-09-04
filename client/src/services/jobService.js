import api from './api';

export const getJobs = async () => {
    return await api.get('/job/saved');
};

export const saveJob = async (jobData) => {
    return await api.post('/job/save', jobData);
};

export const updateJob = async (id, jobData) => {
    return await api.put(`/job/${id}`, jobData);
};

export const deleteJob = async (id) => {
    return await api.delete(`/job/${id}`);
};

export const getJobMatches = async () => {
    return await api.get('/jobs/matches');
};

export const getATSScore = async (jobId) => {
    return await api.get(`/jobs/${jobId}/ats`);
};