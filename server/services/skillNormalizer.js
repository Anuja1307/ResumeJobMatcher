function normalizeSkill(skill) {
    if (!skill) return "";

    const cleaned = skill
        .trim()
        .replace(/\s+/g, " ");

    const skillMap = {
        "react.js": "React",
        "react js": "React",
        "reactjs": "React",

        "node": "Node.js",
        "nodejs": "Node.js",
        "node js": "Node.js",

        "express": "Express.js",
        "expressjs": "Express.js",
        "express js": "Express.js",

        "mongodb": "MongoDB",
        "mongo db": "MongoDB",
        "mongo": "MongoDB",

        "javascript": "JavaScript",
        "java script": "JavaScript",

        "typescript": "TypeScript",
        "type script": "TypeScript",

        "tailwind": "Tailwind CSS",
        "tailwindcss": "Tailwind CSS",

        "postgres": "PostgreSQL",
        "postgresql": "PostgreSQL"
    };

    const key = cleaned.toLowerCase();

    return skillMap[key] || cleaned;
}


function normalizeSkills(skills = []) {
    return [
        ...new Set(
            skills
                .map(normalizeSkill)
                .filter(Boolean)
        )
    ];
}


module.exports = {
    normalizeSkill,
    normalizeSkills
};