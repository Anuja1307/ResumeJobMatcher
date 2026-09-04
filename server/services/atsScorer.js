const {
    calculateSkillMatch
} = require("./skillMatcher");

const {
    calculateExperienceMatch
} = require("./experienceMatcher");

const {
    calculateKeywordMatch
} = require("./keywordMatcher");

function calculateResumeCompleteness(resume) {

    let completedSections = 0;

    const totalSections = 6;

    // Personal information
    if (
        resume?.personal?.name ||
        resume?.personal?.email
    ) {
        completedSections++;
    }

    // Summary
    if (
        resume?.summary &&
        resume.summary.trim().length > 0
    ) {
        completedSections++;
    }

    // Skills
    if (
        Array.isArray(resume?.skills) &&
        resume.skills.length > 0
    ) {
        completedSections++;
    }

    // Education
    if (
        Array.isArray(resume?.education) &&
        resume.education.length > 0
    ) {
        completedSections++;
    }

    // Experience
    if (
        Array.isArray(resume?.experience) &&
        resume.experience.length > 0
    ) {
        completedSections++;
    }

    // Projects
    if (
        Array.isArray(resume?.projects) &&
        resume.projects.length > 0
    ) {
        completedSections++;
    }

    return Math.round(
        (completedSections / totalSections) * 100
    );
}


function calculateATSScore({
    resume,
    semanticScore,
    requiredSkills,
    keywords,
    requiredExperience
})  {

    const skillResult =
        calculateSkillMatch(
            resume?.skills || [],
            requiredSkills || []
        );
        
    const keywordResult =
    calculateKeywordMatch(
        resume,
        keywords || []
    );

    const experienceResult =
        calculateExperienceMatch(
            resume?.experience || [],
            requiredExperience || ""
        );


    const completenessScore =
        calculateResumeCompleteness(resume);


    const atsScore =
    (skillResult.skillsScore * 0.25) +
    (keywordResult.keywordScore * 0.25) +
    (semanticScore * 0.20) +
    (experienceResult.experienceScore * 0.15) +
    (completenessScore * 0.15);


    return {

    atsScore: Math.round(atsScore),

    skillsScore:
        skillResult.skillsScore,

    keywordScore:
        keywordResult.keywordScore,

    semanticScore,

    experienceScore:
        experienceResult.experienceScore,

    completenessScore,

    matchedSkills:
        skillResult.matchedSkills,

    missingSkills:
        skillResult.missingSkills,

    matchedKeywords:
        keywordResult.matchedKeywords,

    missingKeywords:
        keywordResult.missingKeywords,

    candidateYears:
        experienceResult.candidateYears,

    requiredYears:
        experienceResult.requiredYears
};
}


module.exports = {
    calculateATSScore,
    calculateResumeCompleteness
};