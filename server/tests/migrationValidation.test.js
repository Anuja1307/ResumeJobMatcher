const assert = require('assert');

// 1. Vector Dimension Validation Logic
function validateVectorDimension(vector, expectedDimension = 1536) {
    if (!Array.isArray(vector)) {
        return { valid: false, reason: 'Vector is not an array' };
    }
    if (vector.length === 0) {
        return { valid: false, reason: 'Vector is empty' };
    }
    if (vector.length !== expectedDimension) {
        return { 
            valid: false, 
            reason: `Dimension mismatch: got ${vector.length}, expected ${expectedDimension}` 
        };
    }
    return { valid: true };
}

// 2. Safe Vector Update Logic
function safeUpdateEmbedding(existingEmbedding, newEmbedding, targetDimension = 1536) {
    const validation = validateVectorDimension(newEmbedding, targetDimension);
    if (!validation.valid) {
        return { embedding: existingEmbedding, updated: false, reason: validation.reason };
    }
    return { embedding: newEmbedding, updated: true };
}

// 3. Vector Similarity Dimension Safety Check
function safeCompareVectors(vectorA, vectorB) {
    if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
        throw new Error('Both inputs must be arrays');
    }
    if (vectorA.length !== vectorB.length) {
        return { compatible: false, reason: `Dimension mismatch: ${vectorA.length} vs ${vectorB.length}` };
    }
    return { compatible: true };
}

describe('Embedding Migration Validation Tests', () => {
    const vector768 = new Array(768).fill(0.1);
    const vector1536 = new Array(1536).fill(0.1);
    const invalidVector = [0.1, 0.2, 0.3];
    const emptyVector = [];

    test('1. 768-dimensional old vector detection', () => {
        const res768 = validateVectorDimension(vector768, 1536);
        expect(res768.valid).toBe(false);
        expect(res768.reason).toContain('768');
    });

    test('2. 1536-dimensional new vector validation', () => {
        const res1536 = validateVectorDimension(vector1536, 1536);
        expect(res1536.valid).toBe(true);
    });

    test('3. Invalid vector rejection', () => {
        const resInvalid = validateVectorDimension(invalidVector, 1536);
        expect(resInvalid.valid).toBe(false);
        const resEmpty = validateVectorDimension(emptyVector, 1536);
        expect(resEmpty.valid).toBe(false);
        const resNull = validateVectorDimension(null, 1536);
        expect(resNull.valid).toBe(false);
    });

    test('4. Failed embedding generation does NOT overwrite existing data', () => {
        const updateResultFailed = safeUpdateEmbedding(vector768, null, 1536);
        expect(updateResultFailed.updated).toBe(false);
        expect(updateResultFailed.embedding).toEqual(vector768);

        const updateResultBadDim = safeUpdateEmbedding(vector768, invalidVector, 1536);
        expect(updateResultBadDim.updated).toBe(false);
        expect(updateResultBadDim.embedding).toEqual(vector768);

        const updateResultSuccess = safeUpdateEmbedding(vector768, vector1536, 1536);
        expect(updateResultSuccess.updated).toBe(true);
        expect(updateResultSuccess.embedding).toEqual(vector1536);
    });

    test('5. Dimension-safe comparison prevents mixing 768-dim and 1536-dim vectors', () => {
        const compMismatch = safeCompareVectors(vector768, vector1536);
        expect(compMismatch.compatible).toBe(false);
        const compMatch = safeCompareVectors(vector1536, vector1536);
        expect(compMatch.compatible).toBe(true);
    });
});
