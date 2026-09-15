require('dotenv').config();
const mongoose = require('mongoose');
const connectDb = require('../config/db');
const User = require('../models/user');
const Job = require('../models/jobs');
const KnowledgeChunk = require('../models/knowledgeChunk');
const { generateEmbedding } = require('../services/aiService');

async function runMigration() {
    const args = process.argv.slice(2);
    const isForce = args.includes('--force');
    const isDryRun = !isForce || args.includes('--dry-run');

    const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
    const targetDimension = provider === 'openai' ? 1536 : 768;

    console.log('\n==================================================');
    console.log('      EMBEDDING MIGRATION & AUDIT SCRIPT          ');
    console.log('==================================================');
    console.log(`MODE:                ${isDryRun ? 'DRY-RUN (NO DB CHANGES WILL BE MADE)' : 'REAL MIGRATION (--force)'}`);
    console.log(`CONFIGURED PROVIDER: ${provider}`);
    console.log(`TARGET DIMENSION:    ${targetDimension}`);
    console.log('==================================================\n');

    try {
        await connectDb();
        console.log('Connected to MongoDB.\n');

        const collections = [
            {
                name: 'User (Resume)',
                model: User,
                findQuery: { 'resume.embedding': { $exists: true, $ne: [] } },
                getEmbedding: (doc) => doc.resume?.embedding || [],
                getText: (doc) => doc.resume?.resumeText || doc.resume?.structuredResume?.rawText || '',
                setEmbedding: (doc, newEmb) => {
                    if (!doc.resume) doc.resume = {};
                    doc.resume.embedding = newEmb;
                }
            },
            {
                name: 'Job',
                model: Job,
                findQuery: { embedding: { $exists: true, $ne: [] } },
                getEmbedding: (doc) => doc.embedding || [],
                getText: (doc) => `${doc.title} ${doc.description} ${doc.company} ${doc.requiredSkills?.join(' ')}`,
                setEmbedding: (doc, newEmb) => { doc.embedding = newEmb; }
            },
            {
                name: 'KnowledgeChunk',
                model: KnowledgeChunk,
                findQuery: { embedding: { $exists: true, $ne: [] } },
                getEmbedding: (doc) => doc.embedding || [],
                getText: (doc) => doc.text || '',
                setEmbedding: (doc, newEmb) => { doc.embedding = newEmb; }
            }
        ];

        const summary = [];

        for (const col of collections) {
            console.log(`--- Auditing Collection: ${col.name} ---`);
            const docs = await col.model.find({});
            let countTotal = docs.length;
            let count768 = 0;
            let count1536 = 0;
            let countMissingOrInvalid = 0;
            let updatedCount = 0;
            let failedCount = 0;

            for (const doc of docs) {
                const emb = col.getEmbedding(doc);
                const len = Array.isArray(emb) ? emb.length : 0;

                if (len === 768) {
                    count768++;
                } else if (len === 1536) {
                    count1536++;
                } else {
                    countMissingOrInvalid++;
                }

                // If real migration mode and document vector needs update
                if (!isDryRun && len !== targetDimension) {
                    const textToEmbed = col.getText(doc);
                    if (!textToEmbed || !textToEmbed.trim()) {
                        console.log(`  ⚠ Skipping doc ${doc._id}: No text available to embed.`);
                        failedCount++;
                        continue;
                    }

                    try {
                        console.log(`  Generating embedding for doc ${doc._id}...`);
                        const newEmb = await generateEmbedding(textToEmbed);

                        // Strict dimension validation before saving
                        if (!Array.isArray(newEmb) || newEmb.length !== targetDimension) {
                            console.error(`  ❌ Error: Generated embedding length (${newEmb?.length}) does not match target (${targetDimension}). Skipping update for doc ${doc._id}.`);
                            failedCount++;
                            continue;
                        }

                        col.setEmbedding(doc, newEmb);
                        await doc.save();
                        console.log(`  ✓ Successfully updated doc ${doc._id} to ${targetDimension}-dim vector.`);
                        updatedCount++;
                    } catch (err) {
                        console.error(`  ❌ Failed to generate/update embedding for doc ${doc._id}: ${err.message}`);
                        failedCount++;
                    }
                }
            }

            summary.push({
                Collection: col.name,
                TotalDocs: countTotal,
                '768-dim (Old)': count768,
                '1536-dim (New)': count1536,
                MissingOrInvalid: countMissingOrInvalid,
                UpdatedInRun: updatedCount,
                FailedInRun: failedCount
            });
        }

        console.log('\n==================================================');
        console.log('              SUMMARY OF RESULTS                  ');
        console.log('==================================================');
        console.table(summary);

        if (isDryRun) {
            console.log('\n[DRY-RUN CONFIRMED] Zero database modifications were made.');
            console.log('To run the real migration when credits/provider are ready, execute:');
            console.log('node scripts/migrateEmbeddings.js --force');
        }

        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    } catch (error) {
        console.error('Migration script failed:', error);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

if (require.main === module) {
    runMigration();
}

module.exports = { runMigration };
