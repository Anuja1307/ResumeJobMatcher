const {
    analyzeSkillGap
} = require("./services/skillGapService");

const resumeSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "REST APIs",
    "JWT Authentication",
    "Git",
    "Docker",
    "Redis",
    "Cloudinary"
];

const requiredSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "REST APIs",
    "JWT",
    "Git",
    "Docker",
    "AWS",
    "Stripe"
];

const result = analyzeSkillGap(
    resumeSkills,
    requiredSkills
);

console.log(
    JSON.stringify(result, null, 2)
);