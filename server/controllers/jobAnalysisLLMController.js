const User = require("../models/user");
const Job = require("../models/jobs");

const {
    cosineSimilarity
} = require("../services/vectorSimilarity");

const {
    calculateATSScore
} = require("../services/atsScorer.JS");

const {
    analyzeResumeForJob
} = require("../services/aiService");


exports.getJobSpecificAnalysis = async (req, res) => {

    try {

        const userId =
            req.user.userId || req.user.id;

        const jobId =
            req.params.jobId;


        const user =
            await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const job =
            await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }


        if (
            job.userId.toString() !==
            userId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }


        const resume =
            user.resume?.structuredResume;

        if (!resume) {

            return res.status(400).json({
                success: false,
                message: "Please upload a resume first"
            });
        }


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


        if (
            !job.embedding ||
            job.embedding.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Job embedding not found"
            });
        }


        const similarity =
            cosineSimilarity(
                resumeEmbedding,
                job.embedding
            );


        const semanticScore =
            Math.round(similarity * 100);


        const ats =
            calculateATSScore({
                resume,
                semanticScore,
                requiredSkills:
                    job.requiredSkills || [],
                keywords:
                    job.keywords || [],
                requiredExperience:
                    job.experience || ""
            });


        const analysis =
            await analyzeResumeForJob(
                resume,
                {
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    description: job.description,
                    requiredSkills:
                        job.requiredSkills || [],
                    keywords:
                        job.keywords || [],
                    experience:
                        job.experience || ""
                },
                ats
            );


        return res.status(200).json({

            success: true,

            job: {
                id: job._id,
                title: job.title,
                company: job.company,
                location: job.location
            },

            ats,

            analysis
        });

    } catch (error) {

        console.error(
            "Job-specific analysis error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to generate job-specific analysis"
        });
    }
};