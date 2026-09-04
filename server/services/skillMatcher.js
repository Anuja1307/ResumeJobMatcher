const {
    normalizeSkills
} = require("./skillNormalizer");


function calculateSkillMatch(
    resumeSkills = [],
    requiredSkills = []
) {

    const normalizedResumeSkills =
        normalizeSkills(resumeSkills);

    const normalizedRequiredSkills =
        normalizeSkills(requiredSkills);

    const matchedSkills = [];
    const missingSkills = [];

    for (let i = 0; i < normalizedRequiredSkills.length; i++) {

        const requiredSkill =
            normalizedRequiredSkills[i];

        if (
            normalizedResumeSkills.includes(
                requiredSkill
            )
        ) {
            matchedSkills.push(requiredSkill);
        } else {
            missingSkills.push(requiredSkill);
        }
    }

    const skillsScore =
        normalizedRequiredSkills.length > 0
            ? (
                matchedSkills.length /
                normalizedRequiredSkills.length
            ) * 100
            : 0;

    return {
        matchedSkills,
        missingSkills,
        skillsScore: Math.round(skillsScore)
    };
}


module.exports = {
    calculateSkillMatch
};