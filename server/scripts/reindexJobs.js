require('dotenv').config();
const mongoose = require('mongoose');
const connectDb = require('../config/db');
const Job = require('../models/jobs');
const { createJobChunks } = require('../services/chunkingService');
const { replaceJobChunks } = require('../services/knowledgeService');

async function reindexAllJobs() {
    try {
        // Connect to MongoDB
        await connectDb();
        console.log('MongoDB connected');

        // Fetch all existing jobs
        const jobs = await Job.find({});
        
        if (!jobs || jobs.length === 0) {
            console.log('No jobs found to re-index.');
            return;
        }

        console.log(`Re-indexing ${jobs.length} jobs...`);
        console.log('========================================');

        let successCount = 0;
        let failureCount = 0;

        // Process jobs sequentially
        for (const job of jobs) {
            try {
                console.log(`\nProcessing job:`);
                console.log(`  Job ID: ${job._id}`);
                console.log(`  Title: ${job.title}`);
                console.log(`  Company: ${job.company}`);
                console.log(`  User ID: ${job.userId}`);

                // Create chunks using the fixed createJobChunks function
                const jobChunks = createJobChunks(job);

                if (jobChunks.length === 0) {
                    console.log(`  Warning: No chunks generated for job ${job.title}`);
                    continue;
                }

                // Replace old chunks with new chunks (includes correct jobId)
                await replaceJobChunks({
                    userId: job.userId,
                    jobId: job._id,
                    chunks: jobChunks
                });

                console.log(`✓ Re-indexed job: ${job.title} | ${job._id}`);
                successCount++;

                // Small delay to avoid overwhelming Ollama
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`✗ Failed to re-index job ${job.title} (${job._id}):`, error.message);
                failureCount++;
            }
        }

        console.log('\n========================================');
        console.log('Job RAG migration completed.');
        console.log(`Successfully re-indexed: ${successCount} jobs`);
        console.log(`Failed: ${failureCount} jobs`);

        // Close database connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
reindexAllJobs();
