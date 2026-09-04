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

def extract_resume_analysis(resume):

    schema = {
        "type": "object",
        "properties": {
            "overallAssessment": {
                "type": "string"
            },
            "strengths": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "weaknesses": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "skillSuggestions": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "experienceSuggestions": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "projectSuggestions": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "atsSuggestions": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "actionPlan": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": [
            "overallAssessment",
            "strengths",
            "weaknesses",
            "skillSuggestions",
            "experienceSuggestions",
            "projectSuggestions",
            "atsSuggestions",
            "actionPlan"
        ]
    }

    prompt = f"""
You are an expert resume analysis assistant.

Analyze the following structured resume.

Your job is to provide useful, specific and honest feedback.

Analyze:

1. Overall resume quality
2. Strengths
3. Weaknesses
4. Skills and skill presentation
5. Experience descriptions
6. Project descriptions
7. ATS optimization opportunities
8. A practical action plan for improving the resume

IMPORTANT RULES:

- Only use information present in the resume.
- Do not invent experience, skills, projects or achievements.
- Do not assume the candidate has a skill that is not mentioned.
- Do not recommend adding a skill merely because it is popular.
- Suggestions should be practical and specific.
- If a section is missing or weak, mention that.
- For ATS suggestions, recommend naturally incorporating relevant
  terminology rather than keyword stuffing.
- Focus on improving the resume rather than judging the candidate.

Return only the requested JSON structure.

STRUCTURED RESUME:

{json.dumps(resume, indent=2)}
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

def analyze_resume_for_job(resume, job, ats):

    schema = {
        "type": "object",
        "properties": {
            "overallAssessment": {
                "type": "string"
            },
            "whyYouMatch": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "whyYouDontMatch": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "missingSkills": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "missingKeywords": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "resumeImprovements": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "projectImprovements": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "atsImprovements": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "actionPlan": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": [
            "overallAssessment",
            "whyYouMatch",
            "whyYouDontMatch",
            "missingSkills",
            "missingKeywords",
            "resumeImprovements",
            "projectImprovements",
            "atsImprovements",
            "actionPlan"
        ]
    }

    prompt = f"""
You are an expert technical recruiter and resume optimization assistant.

Analyze how well this candidate's resume matches the specific job.

You are given:

1. The candidate's structured resume
2. The job description
3. An ATS analysis produced by our application

Your goal is to provide personalized and honest recommendations.

IMPORTANT RULES:

- Use only information provided in the resume, job description and ATS data.
- Do not invent candidate experience.
- Do not claim the candidate has a skill that is not present.
- Do not recommend lying or adding fake experience.
- Clearly distinguish between existing strengths and missing requirements.
- Suggestions should be specific to THIS job.
- Do not simply repeat the ATS results.
- Explain why particular resume changes would improve the candidate's fit.
- For missing skills, suggest learning them rather than falsely adding them.
- For keywords, recommend naturally incorporating them only when the candidate genuinely has relevant experience.
- Avoid keyword stuffing.

Analyze:

- Overall match
- Why the candidate matches the job
- Why the candidate does not match
- Missing skills
- Missing keywords
- Resume improvements
- Project improvements
- ATS improvements
- A prioritized action plan

Return only the requested JSON structure.

CANDIDATE RESUME:

{json.dumps(resume, indent=2)}

JOB:

{json.dumps(job, indent=2)}

ATS ANALYSIS:

{json.dumps(ats, indent=2)}
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