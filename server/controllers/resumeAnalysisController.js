const User = require("../models/user");

const {
    analyzeResume
} = require("../services/aiService");


exports.getResumeAnalysis = async (req, res) => {

    try {

        const userId =
            req.user.userId || req.user.id;

        const user =
            await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
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


        const analysis =
            await analyzeResume(resume);


        return res.status(200).json({

            success: true,

            analysis

        });

    } catch (error) {

        console.error(
            "Resume analysis controller error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to analyze resume"

        });
    }
};