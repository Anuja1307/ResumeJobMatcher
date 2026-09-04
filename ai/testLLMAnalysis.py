from llm_extractor import extract_resume_analysis
import json
resume = {
    "summary": "Computer Science student interested in full stack development.",

    "skills": [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB"
    ],

    "education": [
        {
            "degree": "B.Tech",
            "field": "Computer Science",
            "institution": "XYZ University"
        }
    ],

    "experience": [
        {
            "company": "ABC Technologies",
            "role": "Software Developer Intern",
            "description": "Developed REST APIs using Node.js and Express."
        }
    ],

    "projects": [
        {
            "name": "Resume Matcher",
            "technologies": [
                "React",
                "Node.js",
                "MongoDB"
            ],
            "description": "Built a web application for matching resumes with jobs."
        }
    ]
}

result = extract_resume_analysis(resume)

print(json.dumps(result, indent=2))