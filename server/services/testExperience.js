const {
    calculateExperienceMatch
} = require("./experienceMatcher");


const resumeExperience = [
    {
        company: "ABC Technologies",
        role: "Software Developer",
        startDate: "June 2023",
        endDate: "June 2025",
        description: "Backend development."
    }
];

const jobRequirement = "1–3 years";

const result =
    calculateExperienceMatch(
        resumeExperience,
        jobRequirement
    );


console.log(result);