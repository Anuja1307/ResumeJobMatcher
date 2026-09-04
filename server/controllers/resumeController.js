const { PassThrough } = require('stream');
const User = require('../models/user');
const cloudinary = require('../config/cloudinary');
const { extractTextFromPdf } = require('../services/pdfParser');
const parseResumeText = require('../services/resumeParser');
const { extractWithAI ,generateEmbedding } = require('../services/aiService');
const mergeResumeData = require('../services/resumeMerger');
const normalizeResume = require('../services/resumeNormalizer');
const buildResumeEmbeddingText = require('../services/resumeEmbeddingBuilder');


// ============================================================
// Upload buffer to Cloudinary
// ============================================================

const uploadBufferToCloudinary = (buffer, filename) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {
                resource_type: 'raw',

                folder: 'resumes',

                public_id: filename.replace(/\.[^/.]+$/, '')
            },

            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );


        const passthrough = new PassThrough();

        passthrough.end(buffer);

        passthrough.pipe(stream);

    });

};


// ============================================================
// Upload Resume
// ============================================================

exports.uploadResume = async (req, res) => {

    try {

        // ------------------------------------------------------
        // 1. Get uploaded file
        // ------------------------------------------------------

        const file = req.file;


        if (!file) {

            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });

        }


        // ------------------------------------------------------
        // 2. Upload to Cloudinary + extract PDF text
        // ------------------------------------------------------

        const [
            cloudinaryResult,
            parsedResume
        ] = await Promise.all([

            uploadBufferToCloudinary(
                file.buffer,
                file.originalname
            ),

            extractTextFromPdf(
                file.buffer
            )

        ]);


        const resumeUrl =
            cloudinaryResult.secure_url ||
            cloudinaryResult.url;


        // ------------------------------------------------------
        // 3. Get authenticated user
        // ------------------------------------------------------

        const userId =
            req.user?.userId ||
            req.user?.id;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized user identity missing"
            });

        }


        // ------------------------------------------------------
        // 4. Find user
        // ------------------------------------------------------

        const user =
            await User.findById(userId);


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // ======================================================
        // 5. RULE-BASED EXTRACTION
        // ======================================================

        console.log(
            "===== RESUME TEXT ====="
        );

        console.log(parsedResume);


        const ruleData =
            parseResumeText(parsedResume);


        console.log(
            "===== RULE-BASED DATA ====="
        );

        console.log(
            JSON.stringify(
                ruleData,
                null,
                2
            )
        );


        // ======================================================
        // 6. AI EXTRACTION
        // ======================================================

        console.log(
            "===== CALLING AI SERVICE ====="
        );


        const aiResult =
            await extractWithAI(parsedResume);


        const bertData =
            aiResult.bert || {};


        const llmData =
            aiResult.llm || {};


        console.log(
            "===== BERT DATA ====="
        );

        console.log(
            JSON.stringify(
                bertData,
                null,
                2
            )
        );


        console.log(
            "===== LLM DATA ====="
        );

        console.log(
            JSON.stringify(
                llmData,
                null,
                2
            )
        );


        // ======================================================
        // 7. MERGE RULE + BERT + LLM
        // ======================================================

    const mergedResume = mergeResumeData(
    ruleData,
    bertData,
    llmData,
    parsedResume
);

    const structuredResume = normalizeResume(mergedResume);
    const resumeEmbeddingText =buildResumeEmbeddingText(structuredResume);
    const resumeEmbedding =await generateEmbedding(resumeEmbeddingText);

        console.log(
            "===== FINAL STRUCTURED RESUME ====="
        );

        console.log(
            JSON.stringify(
                structuredResume,
                null,
                2
            )
        );


        // ======================================================
        // 8. Save resume information
        // ======================================================

        user.resume = {
            filename: file.originalname,
            path: resumeUrl,
            resumeText: parsedResume,
            structuredResume: structuredResume,
            embedding: resumeEmbedding,
            uploadedAt: new Date()
};


        await user.save();


        // ======================================================
        // 9. Return final result
        // ======================================================

        return res.status(200).json({

            success: true,

            message:
                "Resume uploaded and analyzed successfully",

            resumeUrl,

            structuredResume

        });


    } catch (error) {

        console.error(
            "Error uploading resume:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }

};