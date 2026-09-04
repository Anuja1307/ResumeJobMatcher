const { generateEmbedding } = require("./aiService");

async function test() {

    const text = `
    Full-stack developer experienced in
    React, Node.js, Express and MongoDB.
    `;

    const embedding = await generateEmbedding(text);

    console.log("Embedding dimensions:", embedding.length);
    console.log("First 10 values:", embedding.slice(0, 10));
}

test();