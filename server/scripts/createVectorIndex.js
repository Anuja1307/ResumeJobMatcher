require('dotenv').config();
const mongoose = require('mongoose');
const connectDb = require('../config/db');

async function createVectorIndex() {
    try {
        await connectDb();
        console.log('MongoDB connected');

        const db = mongoose.connection.db;
        const collection = db.collection('knowledgechunks');

        console.log('\n========================================');
        console.log('CREATING VECTOR SEARCH INDEX');
        console.log('========================================');

        // Check if index already exists
        const indexes = await collection.listSearchIndexes().toArray();
        console.log('Existing search indexes:', indexes.map(idx => idx.name));

        const vectorIndexExists = indexes.some(idx => idx.name === 'vector_index');

        if (vectorIndexExists) {
            console.log('Vector index "vector_index" already exists. Skipping creation.');
            await mongoose.connection.close();
            return;
        }

        // Create the vector search index
        const indexDefinition = {
            name: 'vector_index',
            type: 'vectorSearch',
            definition: {
                fields: [
                    {
                        type: 'vector',
                        path: 'embedding',
                        numDimensions: 768,
                        similarity: 'cosine'
                    },
                    {
                        type: 'filter',
                        path: 'userId'
                    },
                    {
                        type: 'filter',
                        path: 'source'
                    },
                    {
                        type: 'filter',
                        path: 'jobId'
                    }
                ]
            }
        };

        console.log('Creating vector index with definition:', JSON.stringify(indexDefinition, null, 2));

        const result = await collection.createSearchIndex(indexDefinition);
        console.log('Vector index creation initiated:', result);
        console.log('\nNOTE: The index may take several minutes to build.');
        console.log('You can check the status in MongoDB Atlas under Search > Search Indexes.');

        await mongoose.connection.close();
        console.log('MongoDB connection closed');

    } catch (error) {
        console.error('Error creating vector index:', error);
        process.exit(1);
    }
}

createVectorIndex();
