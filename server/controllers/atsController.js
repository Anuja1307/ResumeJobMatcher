const User = require("../models/user");
const Job = require("../models/jobs");

const { cosineSimilarity } = require("../services/vectorSimilarity");
const { calculateATSScore } = require("../services/atsScorer");


exports.getATSScore = async (req, res) => {

    try {

        const userId =
            req.user.userId || req.user.id;

        const jobId =
            req.params.jobId;


        // Get user
        const user =
            await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // Get job
        const job =
            await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }


        // Make sure job belongs to this user
        if (
            job.userId.toString() !==
            userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }


        // Resume data
        const resume =
            user.resume?.structuredResume;

        if (!resume) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume first"
            });
        }


        // Resume embedding
        const resumeEmbedding =
            user.resume?.embedding;

        if (
            !resumeEmbedding ||
            resumeEmbedding.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Resume embedding not found"
            });
        }


        // Job embedding
        if (
            !job.embedding ||
            job.embedding.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Job embedding not found"
            });
        }


        // Calculate semantic similarity
        const similarity =
            cosineSimilarity(
                resumeEmbedding,
                job.embedding
            );


        const semanticScore =
            Math.round(
                similarity * 100
            );


        // Calculate ATS score
        const atsResult = calculateATSScore({
    resume,
    semanticScore,
    requiredSkills: job.requiredSkills || [],
    keywords: job.keywords || [],
    requiredExperience: job.experience || ""
});


        return res.status(200).json({

            success: true,

            job: {
                id: job._id,
                title: job.title,
                company: job.company,
                location: job.location
            },

            ats: atsResult

        });


    } catch (err) {

        console.error(
            "ATS scoring error:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};