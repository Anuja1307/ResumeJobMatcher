const Job = require("../models/jobs");

const { cosineSimilarity } = require("./vectorSimilarity");

const { calculateSkillMatch } = require("./skillMatcher");

const {
    calculateExperienceMatch
} = require("./experienceMatcher");

const {
    calculateFinalScore
} = require("./matchScore");


async function matchResumeToJobs(
    userId,
    resumeEmbedding,
    resumeSkills = [],
    resumeExperience = []
) {

    const jobs = await Job.find({
        userId: userId,
        embedding: {
            $exists: true,
            $ne: []
        }
    });

    const matches = [];

    for (const job of jobs) {

        if (
            !job.embedding ||
            job.embedding.length === 0
        ) {
            continue;
        }

        if (
            job.embedding.length !==
            resumeEmbedding.length
        ) {
            continue;
        }


        // --------------------------------
        // 1. SEMANTIC SCORE
        // --------------------------------

        const similarity =
            cosineSimilarity(
                resumeEmbedding,
                job.embedding
            );

        const semanticScore =
            Math.round(
                similarity * 100
            );


        // --------------------------------
        // 2. SKILL SCORE
        // --------------------------------

        const skillResult =
            calculateSkillMatch(
                resumeSkills,
                job.requiredSkills || []
            );


        // --------------------------------
        // 3. EXPERIENCE SCORE
        // --------------------------------
        console.log("JOB EXPERIENCE:", job.experience);
console.log("JOB EXPERIENCE TYPE:", typeof job.experience);
        const experienceResult =
            calculateExperienceMatch(
                resumeExperience,
                job.experience || ""
            );


        // --------------------------------
        // 4. FINAL SCORE
        // --------------------------------

        const finalScore =
            calculateFinalScore({
                semanticScore,
                skillsScore:
                    skillResult.skillsScore,
                experienceScore:
                    experienceResult.experienceScore
            });


        matches.push({

            job,

            semanticScore,

            skillsScore:
                skillResult.skillsScore,

            experienceScore:
                experienceResult.experienceScore,

            finalScore,

            matchedSkills:
                skillResult.matchedSkills,

            missingSkills:
                skillResult.missingSkills,

            candidateYears:
                experienceResult.candidateYears,

            requiredYears:
                experienceResult.requiredYears
        });
    }


    // Rank by FINAL score
    matches.sort(
        (a, b) =>
            b.finalScore -
            a.finalScore
    );


    return matches;
}


module.exports = {
    matchResumeToJobs
};