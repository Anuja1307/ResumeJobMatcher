function normalizeKeyword(keyword) {
    if (!keyword) return "";

    return keyword
        .toLowerCase()
        .trim()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
        .replace(/\s+/g, " ");
}


function buildResumeSearchText(resume) {

    const parts = [];

    // Raw resume text
    if (resume?.rawText) {
        parts.push(resume.rawText);
    }

    // Summary
    if (resume?.summary) {
        parts.push(resume.summary);
    }

    // Skills
    if (Array.isArray(resume?.skills)) {
        parts.push(resume.skills.join(" "));
    }

    // Education
    if (Array.isArray(resume?.education)) {
        parts.push(
            resume.education
                .map(item =>
                    `${item.degree || ""} ${item.field || ""} ${item.institution || ""}`
                )
                .join(" ")
        );
    }

    // Experience
    if (Array.isArray(resume?.experience)) {
        parts.push(
            resume.experience
                .map(item =>
                    `${item.company || ""} ${item.role || ""} ${item.description || ""}`
                )
                .join(" ")
        );
    }

    // Projects
    if (Array.isArray(resume?.projects)) {
        parts.push(
            resume.projects
                .map(item =>
                    `${item.name || ""} ${item.description || ""} ${(item.technologies || []).join(" ")}`
                )
                .join(" ")
        );
    }

    return parts.join(" ").toLowerCase();
}


function containsKeyword(text, keyword) {

    const normalizedKeyword = normalizeKeyword(keyword);

    if (!normalizedKeyword) {
        return false;
    }

    const escapedKeyword =
        normalizedKeyword.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    const pattern =
        new RegExp(
            `(^|\\s)${escapedKeyword}(?=\\s|$)`,
            "i"
        );

    return pattern.test(text);
}


function calculateKeywordMatch(resume, jobKeywords = []) {

    const resumeText =
        buildResumeSearchText(resume);

    const normalizedKeywords = [
        ...new Set(
            jobKeywords
                .map(normalizeKeyword)
                .filter(Boolean)
        )
    ];

    const matchedKeywords = [];
    const missingKeywords = [];

    for (const keyword of normalizedKeywords) {

        if (containsKeyword(resumeText, keyword)) {
            matchedKeywords.push(keyword);
        } else {
            missingKeywords.push(keyword);
        }
    }

    const keywordScore =
        normalizedKeywords.length > 0
            ? (matchedKeywords.length /
                normalizedKeywords.length) * 100
            : 0;

    return {
        keywordScore: Math.round(keywordScore),
        matchedKeywords,
        missingKeywords
    };
}


module.exports = {
    calculateKeywordMatch,
    buildResumeSearchText
};