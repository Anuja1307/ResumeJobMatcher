const {
    normalizeSkills
} = require("./skillNormalizer");


function normalizeResume(structuredResume) {

    const normalizedResume = {
        ...structuredResume
    };

    normalizedResume.skills =
        normalizeSkills(
            structuredResume.skills || []
        );

    return normalizedResume;
}


module.exports = normalizeResume;