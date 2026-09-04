from entity_merger import merge_entities
import json


# -----------------------------
# RULE PARSER OUTPUT
# -----------------------------

rule_data = {
    "name": "Anuja Sharma",
    "email": "anuja@gmail.com",
    "phone": "+91 98765 43210",
    "location": "Bangalore, India",
    "linkedin": "",
    "github": "github.com/anuja-sharma",
    "portfolio": "",

    "summary": "Third-year B.Tech Computer Science student.",

    "skills": [
        "JavaScript",
        "Python",
        "Java",
        "C++",
        "React.js",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Redis",
        "Docker"
    ],

    "education": [
        {
            "degree": "B.Tech in Computer Science and Engineering",
            "field": "Computer Science and Engineering",
            "institution": "Amrita Vishwa Vidyapeetham",
            "location": "Coimbatore",
            "startYear": "2022",
            "endYear": "2026",
            "cgpa": "8.4 / 10"
        }
    ],

    "experience": [],

    "projects": [
        "AI-Powered Resume and Job Matcher",
        "Digital Library Management System"
    ],

    "certifications": [],

    "achievements": [
        "Solved 200+ problems on LeetCode"
    ],

    "languages": []
}


# -----------------------------
# BERT NER OUTPUT
# -----------------------------

bert_data = {
    "persons": [],

    "organizations": [
        {
            "type": "ORG",
            "start": 87,
            "end": 103,
            "text": "ABC Technologies"
        }
    ],

    "locations": [
        {
            "type": "LOC",
            "start": 69,
            "end": 78,
            "text": "Bangalore"
        },
        {
            "type": "LOC",
            "start": 80,
            "end": 85,
            "text": "India"
        }
    ],

    "miscellaneous": []
}


# -----------------------------
# LLM OUTPUT
# -----------------------------

llm_data = {
    "skills": [
        "JavaScript",
        "Python",
        "React.js",
        "Node.js",
        "MongoDB",
        "Docker"
    ],

    "roles": [
        "Software Developer Intern"
    ],

    "projects": [
        {
            "name": "AI-Powered Resume and Job Matcher",
            "technologies": [
                "React",
                "Node.js",
                "Express",
                "MongoDB"
            ],
            "description": "Built using React, Node.js, Express and MongoDB."
        }
    ],

    "experience": [
        {
            "company": "ABC Technologies",
            "role": "Software Developer Intern",
            "description": "Worked on REST APIs and backend services using Node.js and MongoDB."
        }
    ]
}


# -----------------------------
# RAW RESUME TEXT
# -----------------------------

raw_text = """
Anuja Sharma anuja@gmail.com | +91 98765 43210 | Bangalore, India

Software Developer Intern at ABC Technologies.

Technical Skills:
JavaScript, Python, Java, C++, React.js, Tailwind CSS, Node.js, Express.js, MongoDB, Redis, Docker

Experience:
Software Developer Intern
ABC Technologies
Worked on REST APIs and backend services using Node.js and MongoDB.

Education:
B.Tech in Computer Science and Engineering
Amrita Vishwa Vidyapeetham, Coimbatore
2022 - 2026
CGPA: 8.4 / 10
"""


# -----------------------------
# MERGE
# -----------------------------

merged_resume = merge_entities(
    rule_data,
    bert_data,
    llm_data,
    raw_text
)


# -----------------------------
# PRINT RESULT
# -----------------------------

print("\n========================================")
print("        FINAL MERGED RESUME")
print("========================================")

print(json.dumps(merged_resume, indent=4))