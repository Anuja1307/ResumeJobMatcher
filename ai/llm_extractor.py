import requests
import json


def extract_resume_information(resume_text):

    schema = {
        "type": "object",
        "properties": {
            "skills": {
                "type": "array",
                "items": {"type": "string"}
            },
            "roles": {
                "type": "array",
                "items": {"type": "string"}
            },
            "projects": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "technologies": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "description": {"type": "string"}
                    },
                    "required": [
                        "name",
                        "technologies",
                        "description"
                    ]
                }
            },
            "experience": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "company": {"type": "string"},
                        "role": {"type": "string"},
                        "description": {"type": "string"}
                    },
                    "required": [
                        "company",
                        "role",
                        "description"
                    ]
                }
            }
        },
        "required": [
            "skills",
            "roles",
            "projects",
            "experience"
        ]
    }

    prompt = f"""
You are a resume information extraction system.

Extract the following information from the resume:

1. Technical skills
2. Job roles or job titles
3. Projects
4. Work experience
5. Any additional relevant resume information such as:
   - Certifications
   - Publications
   - Awards
   - Achievements
   - Courses
   - Languages
   - Volunteering
   - Leadership experience
   - Other relevant sections

Include any additional information found in the resume using a similar structured format.

Do not invent information.
Only extract information that is explicitly present in the resume.
If a category is not present, return an empty array.

Resume:
{resume_text}
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "qwen2.5:3b",
            "prompt": prompt,
            "stream": False,
            "format": schema
        }
    )

    result = response.json()["response"]

    return json.loads(result)

resume = """
Anuja Sharma

I am a Computer Science student with experience building
full-stack applications.

Technical Skills:
JavaScript, Python, Java, C++, React.js, Tailwind CSS,
Node.js, Express.js, MongoDB, Redis, Docker.

Projects:
AI-Powered Resume and Job Matcher
Built using React, Node.js, Express and MongoDB.

Digital Library Management System
Developed a web application using React and Node.js.

Experience:
Software Developer Intern at ABC Technologies.
Worked on REST APIs and backend services using Node.js
and MongoDB.
"""

result = extract_resume_information(resume)

print(json.dumps(result, indent=2))