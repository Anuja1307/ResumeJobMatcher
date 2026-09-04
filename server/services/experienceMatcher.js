function parseDate(dateText) {
    if (!dateText) return null;

    const text = dateText
        .toLowerCase()
        .trim();

    // Current / Present
    if (
        text === "present" ||
        text === "current" ||
        text === "now"
    ) {
        return new Date();
    }

    // Example: "June 2025"
    const date = new Date(`1 ${dateText}`);

    if (!isNaN(date.getTime())) {
        return date;
    }

    // Example: "2025"
    const yearMatch = text.match(/\b(20\d{2})\b/);

    if (yearMatch) {
        return new Date(
            Number(yearMatch[1]),
            0,
            1
        );
    }

    return null;
}


function calculateExperienceYears(experience = []) {

    let totalMonths = 0;

    for (const item of experience) {

        const startDate =
            parseDate(item.startDate);

        const endDate =
            parseDate(item.endDate);

        if (!startDate || !endDate) {
            continue;
        }

        const months =
            (endDate.getFullYear() -
                startDate.getFullYear()) * 12
            +
            (endDate.getMonth() -
                startDate.getMonth());

        if (months > 0) {
            totalMonths += months;
        }
    }

    return totalMonths / 12;
}


function extractMinimumExperience(
    experienceText = ""
) {

    const text = experienceText
        .toLowerCase()
        .trim();

    if (!text) {
        return 0;
    }

    // Fresher / entry level
    if (
        text.includes("fresher") ||
        text.includes("entry level") ||
        text.includes("entry-level")
    ) {
        return 0;
    }

    // Example: "3+ years"
    const plusMatch =
        text.match(/(\d+)\s*\+/);

    if (plusMatch) {
        return Number(plusMatch[1]);
    }

    // Example: "1-3 years" or "1–3 years"
    const rangeMatch =
        text.match(
            /(\d+)\s*[-–]\s*(\d+)/
        );

    if (rangeMatch) {
        return Number(rangeMatch[1]);
    }

    // Example: "2 years"
    const yearMatch =
        text.match(
            /(\d+)\s*(?:years?|yrs?)/
        );

    if (yearMatch) {
        return Number(yearMatch[1]);
    }

    return 0;
}


function calculateExperienceMatch(
    candidateExperience = [],
    requiredExperience = ""
) {

    const candidateYears =
        calculateExperienceYears(
            candidateExperience
        );

    const requiredYears =
        extractMinimumExperience(
            requiredExperience
        );

    if (requiredYears === 0) {
        return {
            candidateYears:
                Number(candidateYears.toFixed(2)),
            requiredYears,
            experienceScore: 100
        };
    }

    const score =
        Math.min(
            (candidateYears / requiredYears) * 100,
            100
        );

    return {
        candidateYears:
            Number(candidateYears.toFixed(2)),

        requiredYears,

        experienceScore:
            Math.round(score)
    };
}


module.exports = {
    parseDate,
    calculateExperienceYears,
    extractMinimumExperience,
    calculateExperienceMatch
};