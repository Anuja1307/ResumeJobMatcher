const {
    calculateSkillMatch
} = require("./skillMatcher");


function analyzeSkillGap(
    resumeSkills = [],
    requiredSkills = []
) {

    const result = calculateSkillMatch(
        resumeSkills,
        requiredSkills
    );

    return {
        candidateSkills: resumeSkills,
        requiredSkills: requiredSkills,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        skillsScore: result.skillsScore
    };
}


module.exports = {
    analyzeSkillGap
};