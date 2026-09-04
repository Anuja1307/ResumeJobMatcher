const { calculateSkillMatch } = require("./skillMatcher");

const resumeSkills = [
    "React.js",
    "NodeJS",
    "Mongo DB",
    "JavaScript",
    "Tailwind"
];

const requiredSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "Java Script",
    "Tailwind CSS",
    "AWS"
];

const result = calculateSkillMatch(
    resumeSkills,
    requiredSkills
);

console.log(result);