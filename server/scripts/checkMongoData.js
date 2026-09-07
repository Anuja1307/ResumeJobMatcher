require('dotenv').config();
const mongoose = require('mongoose');
const connectDb = require('../config/db');
const KnowledgeChunk = require('../models/knowledgeChunk');
const Job = require('../models/jobs');

async function checkMongoData() {
    try {
        await connectDb();
        console.log('MongoDB connected');

        const jobId = '6a9e1ab13547c15f3ca0c430';
        const userId = '6a609e496185ff4846eb2052';

        console.log('\n========================================');
        console.log('CHECKING MONGODB DATA');
        console.log('========================================');

        // Check job chunks for specific job
        console.log('\n1. JOB CHUNKS for jobId:', jobId);
        const jobChunks = await KnowledgeChunk.find({
            source: 'job',
            jobId: new mongoose.Types.ObjectId(jobId)
        });

        console.log(`   Found: ${jobChunks.length} job chunks`);
        jobChunks.forEach((chunk, idx) => {
            console.log(`   Chunk ${idx + 1}:`);
            console.log(`     - Type: ${chunk.type}`);
            console.log(`     - JobId: ${chunk.jobId ? chunk.jobId.toString() : 'NULL'}`);
            console.log(`     - UserId: ${chunk.userId ? chunk.userId.toString() : 'NULL'}`);
            console.log(`     - Embedding exists: ${!!chunk.embedding && chunk.embedding.length > 0}`);
            console.log(`     - Embedding length: ${chunk.embedding ? chunk.embedding.length : 0}`);
            console.log(`     - Text preview: ${chunk.text.substring(0, 100)}...`);
        });

        // Check resume chunks for user
        console.log('\n2. RESUME CHUNKS for userId:', userId);
        const resumeChunks = await KnowledgeChunk.find({
            source: 'resume',
            userId: new mongoose.Types.ObjectId(userId)
        });

        console.log(`   Found: ${resumeChunks.length} resume chunks`);
        resumeChunks.forEach((chunk, idx) => {
            console.log(`   Chunk ${idx + 1}:`);
            console.log(`     - Type: ${chunk.type}`);
            console.log(`     - UserId: ${chunk.userId ? chunk.userId.toString() : 'NULL'}`);
            console.log(`     - Embedding exists: ${!!chunk.embedding && chunk.embedding.length > 0}`);
            console.log(`     - Embedding length: ${chunk.embedding ? chunk.embedding.length : 0}`);
            console.log(`     - Text preview: ${chunk.text.substring(0, 100)}...`);
        });

        // Check interview chunks for job
        console.log('\n3. INTERVIEW CHUNKS for jobId:', jobId);
        const interviewChunks = await KnowledgeChunk.find({
            source: 'interview',
            jobId: new mongoose.Types.ObjectId(jobId)
        });

        console.log(`   Found: ${interviewChunks.length} interview chunks`);
        interviewChunks.forEach((chunk, idx) => {
            console.log(`   Chunk ${idx + 1}:`);
            console.log(`     - Type: ${chunk.type}`);
            console.log(`     - JobId: ${chunk.jobId ? chunk.jobId.toString() : 'NULL'}`);
            console.log(`     - SessionId: ${chunk.sessionId ? chunk.sessionId.toString() : 'NULL'}`);
            console.log(`     - UserId: ${chunk.userId ? chunk.userId.toString() : 'NULL'}`);
            console.log(`     - Embedding exists: ${!!chunk.embedding && chunk.embedding.length > 0}`);
            console.log(`     - Embedding length: ${chunk.embedding ? chunk.embedding.length : 0}`);
        });

        // Check job chunks with NULL jobId (should be 0 after migration)
        console.log('\n4. JOB CHUNKS with NULL jobId (should be 0):');
        const nullJobChunks = await KnowledgeChunk.find({
            source: 'job',
            jobId: null
        });

        console.log(`   Found: ${nullJobChunks.length} job chunks with NULL jobId`);

        // Verify the job exists
        console.log('\n5. JOB DOCUMENT:');
        const job = await Job.findById(jobId);
        if (job) {
            console.log(`   Job exists: YES`);
            console.log(`   Title: ${job.title}`);
            console.log(`   Company: ${job.company}`);
            console.log(`   UserId: ${job.userId ? job.userId.toString() : 'NULL'}`);
        } else {
            console.log(`   Job exists: NO`);
        }

        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkMongoData();
