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
            "company": {
                "type": "string"
            },
            "role": {
                "type": "string"
            },
            "startDate": {
                "type": "string"
            },
            "endDate": {
                "type": "string"
            },
            "description": {
                "type": "string"
            }
        },
        "required": [
            "company",
            "role",
            "startDate",
            "endDate",
            "description"
        ]
    }
},
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

Extract:
- technical skills
- job roles
- projects
- work experience

For each work experience, extract:
- company
- role
- start date
- end date
- description

Do not invent information.
If a date is not present, return an empty string.

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

    response.raise_for_status()

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


def extract_job_skills(job_description):

    schema = {
        "type": "object",
        "properties": {
            "skills": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": ["skills"]
    }

    prompt = f"""
You are a job description skill extraction system.

Extract the technical and professional skills explicitly
required or mentioned in this job description.

Include technologies, programming languages, frameworks,
databases, tools, cloud platforms, APIs, authentication
technologies, and relevant technical concepts.

Do not invent skills.

Return only skills that are actually present in the
job description.

Job Description:
{job_description}
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

    response.raise_for_status()

    result = response.json()["response"]

    return json.loads(result)

def extract_job_keywords(job_description):

    schema = {
        "type": "object",
        "properties": {
            "keywords": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": ["keywords"]
    }

    prompt = f"""
You are an ATS keyword extraction system.

Extract important keywords and technical phrases from this
job description that an Applicant Tracking System would
look for in a candidate's resume.

Include:
- technical concepts
- responsibilities
- tools
- methodologies
- domain-specific terms
- important phrases
- technologies

Do NOT include generic words such as:
"candidate", "company", "work", "team", "role", "experience".

Do not invent information.

Return only keywords or short phrases that are explicitly
present in the job description.

Job Description:
{job_description}
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

    response.raise_for_status()

    result = response.json()["response"]

    return json.loads(result)