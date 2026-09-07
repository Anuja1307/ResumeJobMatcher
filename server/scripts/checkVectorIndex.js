require('dotenv').config();
const mongoose = require('mongoose');
const connectDb = require('../config/db');

async function checkVectorIndex() {
    try {
        await connectDb();
        console.log('MongoDB connected');

        const db = mongoose.connection.db;
        const collection = db.collection('knowledgechunks');

        console.log('\n========================================');
        console.log('CHECKING VECTOR SEARCH INDEX STATUS');
        console.log('========================================');

        const indexes = await collection.listSearchIndexes().toArray();
        console.log('\nAll search indexes:');
        
        for (const idx of indexes) {
            console.log(`\nIndex: ${idx.name}`);
            console.log(`  Status: ${idx.status}`);
            console.log(`  Type: ${idx.type}`);
            console.log(`  Queryable: ${idx.queryable}`);
            if (idx.definition) {
                console.log(`  Definition:`, JSON.stringify(idx.definition, null, 2));
            }
        }

        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');

    } catch (error) {
        console.error('Error checking vector index:', error);
        process.exit(1);
    }
}

checkVectorIndex();
