require('dotenv').config();
const mongoose = require('mongoose');
const connectDb = require('../config/db');
const { retrieveRelevantChunks } = require('../services/vectorSearchService');

async function testVectorSearch() {
    try {
        await connectDb();
        console.log('MongoDB connected');

        const userId = '6a609e496185ff4846eb2052';
        const jobId = '6a9e1ab13547c15f3ca0c430';
        const query = 'What skills are required for this job?';

        console.log('\n========================================');
        console.log('TESTING VECTOR SEARCH');
        console.log('========================================');
        console.log('User ID:', userId);
        console.log('Job ID:', jobId);
        console.log('Query:', query);
        console.log('========================================\n');

        const results = await retrieveRelevantChunks({
            userId,
            query,
            jobId,
            topK: 5
        });

        console.log('\n========================================');
        console.log('FINAL RESULTS');
        console.log('========================================');
        console.log('Total chunks retrieved:', results.length);
        console.log('========================================\n');

        await mongoose.connection.close();
        console.log('MongoDB connection closed');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testVectorSearch();
