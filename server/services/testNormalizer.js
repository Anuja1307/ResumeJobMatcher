const normalizeResume = require("./resumeNormalizer");

const resume = {
    skills: [
        "React.js",
        "React JS",
        "reactjs",
        "Node",
        "NodeJS",
        "Mongo DB",
        "JavaScript",
        "Tailwind"
    ]
};

const result = normalizeResume(resume);

console.log("Original:");
console.log(resume.skills);

console.log("\nNormalized:");
console.log(result.skills);