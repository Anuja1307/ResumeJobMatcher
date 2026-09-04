const mergeResumeData = require("./resumeMerger");


// ============================================================
// Mock rule-based parser output
// ============================================================

const ruleData = {
  personal: {
    name: "Anuja Sharma",
    email: "anuja@gmail.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    linkedin: "",
    github: "github.com/anuja-sharma",
    portfolio: ""
  },

  summary:
    "Third-year B.Tech Computer Science student with experience building MERN applications.",

  skills: [
    "JavaScript",
    "React.js",
    "Node.js",
    "MongoDB"
  ],

  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      field: "Computer Science and Engineering",
      institution: "Amrita Vishwa Vidyapeetham",
      location: "Coimbatore",
      startYear: "2022",
      endYear: "2026",
      cgpa: "8.4 / 10"
    }
  ],

  experience: [],

  projects: [
    "AI-Powered Resume and Job Matcher"
  ],

  certifications: [],

  achievements: [
    "Solved 200+ problems on LeetCode"
  ],

  languages: [],

  rawText:
    "Anuja Sharma worked at ABC Technologies in Bangalore."
};


// ============================================================
// Mock BERT output
// ============================================================

const bertData = {
  persons: [
    {
      type: "PER",
      start: 0,
      end: 12,
      text: "Anuja Sharma"
    }
  ],

  organizations: [
    {
      type: "ORG",
      start: 23,
      end: 39,
      text: "ABC Technologies"
    },
    {
      type: "ORG",
      start: 84,
      end: 86,
      text: "No"
    }
  ],

  locations: [
    {
      type: "LOC",
      start: 43,
      end: 52,
      text: "Bangalore"
    }
  ],

  miscellaneous: []
};


// ============================================================
// Mock Qwen output
// ============================================================

const llmData = {
  skills: [
    "Node.js",
    "MongoDB",
    "Express.js"
  ],

  roles: [
    "Software Developer Intern"
  ],

  projects: [
    {
      name: "AI-Powered Resume and Job Matcher",
      technologies: [
        "React",
        "Node.js",
        "Express",
        "MongoDB"
      ],
      description:
        "Built a resume matching application."
    }
  ],

  experience: [
    {
      company: "ABC Technologies",
      role: "Software Developer Intern",
      description:
        "Worked on REST APIs and backend services."
    }
  ],

  certifications: [],

  achievements: [
    "Smart India Hackathon 2023 participant"
  ],

  languages: []
};


// ============================================================
// Run merger
// ============================================================

const finalResume = mergeResumeData(
  ruleData,
  bertData,
  llmData,
  ruleData.rawText
);


// ============================================================
// Print result
// ============================================================

console.log(
  JSON.stringify(finalResume, null, 2)
);