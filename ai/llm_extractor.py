import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()


def get_openai_client():
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)


def _parse_json(text):
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\n?", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\n?```$", "", text)
        text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        match_arr = re.search(r"\[.*\]", text, re.DOTALL)
        if match_arr:
            return json.loads(match_arr.group(0))
        raise ValueError(f"Could not parse valid JSON from LLM response: {text[:200]}")


def _call_llm_text(prompt, system_message="You are an expert AI assistant."):
    provider = os.getenv("AI_PROVIDER", "openai").lower()

    if provider == "openai":
        try:
            client = get_openai_client()
            model = os.getenv("OPENAI_LLM_MODEL", "gpt-4o-mini")

            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            content = response.choices[0].message.content
            return content.strip() if content else ""
        except Exception as e:
            print(f"OpenAI LLM text error: {e}")
            raise RuntimeError(f"LLM text generation failed via OpenAI: {e}")
    else:
        # Local Ollama fallback
        ollama_url = os.getenv("OLLAMA_URL", "http://host.docker.internal:11434").rstrip("/") + "/api/generate"
        ollama_model = os.getenv("OLLAMA_LLM_MODEL", "qwen2.5:3b")

        payload = {
            "model": ollama_model,
            "prompt": f"{system_message}\n\n{prompt}",
            "stream": False,
            "options": {
                "temperature": 0.3
            }
        }

        res = requests.post(ollama_url, json=payload, timeout=120)
        res.raise_for_status()
        content = res.json().get("response", "").strip()
        return content


def generate_rag_answer(prompt):
    return _call_llm_text(prompt, system_message="You are an AI Career Copilot.")


def _call_llm_json(prompt, system_message="You are an expert AI assistant. You MUST respond with valid JSON.", schema=None):
    provider = os.getenv("AI_PROVIDER", "openai").lower()

    if provider == "openai":
        try:
            client = get_openai_client()
            model = os.getenv("OPENAI_LLM_MODEL", "gpt-4o-mini")

            full_system = f"{system_message}\nReturn ONLY a JSON object strictly matching the requested format."

            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": full_system},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            content = response.choices[0].message.content
            return _parse_json(content)
        except Exception as e:
            print(f"OpenAI LLM extraction error: {e}")
            raise RuntimeError(f"LLM extraction failed via OpenAI: {e}")
    else:
        # Local Ollama fallback
        ollama_url = os.getenv("OLLAMA_URL", "http://host.docker.internal:11434").rstrip("/") + "/api/generate"
        ollama_model = os.getenv("OLLAMA_LLM_MODEL", "qwen2.5:3b")

        payload = {
            "model": ollama_model,
            "prompt": f"{system_message}\n\n{prompt}",
            "stream": False,
            "format": schema if schema else "json",
            "options": {
                "temperature": 0.3
            }
        }

        res = requests.post(ollama_url, json=payload, timeout=120)
        res.raise_for_status()
        content = res.json().get("response", "").strip()
        return _parse_json(content)


def extract_resume_information(resume_text):
    system_msg = "You are a resume information extraction system. Extract structured information from raw resume text."
    prompt = f"""
Extract:
- technical skills (array of strings)
- job roles (array of strings)
- projects (array of objects with name, technologies, description)
- work experience (array of objects with company, role, startDate, endDate, description)

Do not invent information. If a date is missing, return an empty string.

Required JSON Structure:
{{
  "skills": ["JavaScript", "Python"],
  "roles": ["Software Developer"],
  "projects": [
    {{
      "name": "Project Name",
      "technologies": ["React", "Node.js"],
      "description": "Project summary"
    }}
  ],
  "experience": [
    {{
      "company": "Company Name",
      "role": "Role Title",
      "startDate": "2023",
      "endDate": "2024",
      "description": "Experience summary"
    }}
  ]
}}

Resume Text:
{resume_text}
"""
    result = _call_llm_json(prompt, system_message=system_msg)
    return {
        "skills": result.get("skills", []),
        "roles": result.get("roles", []),
        "projects": result.get("projects", []),
        "experience": result.get("experience", [])
    }


def extract_job_skills(job_description):
    system_msg = "You are a job description skill extraction system."
    prompt = f"""
Extract technical and professional skills explicitly required or mentioned in this job description.
Include technologies, programming languages, frameworks, databases, tools, cloud platforms, and relevant technical concepts.
Do not invent skills.

Required JSON Structure:
{{
  "skills": ["Python", "React", "Docker"]
}}

Job Description:
{job_description}
"""
    result = _call_llm_json(prompt, system_message=system_msg)
    return {"skills": result.get("skills", [])}


def extract_job_keywords(job_description):
    system_msg = "You are an ATS keyword extraction system."
    prompt = f"""
Extract important keywords and technical phrases from this job description that an Applicant Tracking System (ATS) would look for in a resume.
Include technical concepts, responsibilities, tools, methodologies, and technologies.
Do NOT include generic words like 'candidate', 'company', 'work', 'team', 'role', 'experience'.

Required JSON Structure:
{{
  "keywords": ["REST API", "Microservices", "CI/CD"]
}}

Job Description:
{job_description}
"""
    result = _call_llm_json(prompt, system_message=system_msg)
    return {"keywords": result.get("keywords", [])}


def extract_resume_analysis(resume):
    system_msg = "You are an expert resume analysis assistant."
    prompt = f"""
Analyze the following structured resume.
Provide useful, specific, and honest feedback on:
1. Overall resume quality
2. Strengths
3. Weaknesses
4. Skills presentation
5. Experience descriptions
6. Project descriptions
7. ATS optimization opportunities
8. A practical action plan for improving the resume

IMPORTANT RULES:
- Only use information present in the resume. Do not invent experience or skills.
- Return full meaningful sentences for suggestions.

Required JSON Structure:
{{
  "overallAssessment": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "skillSuggestions": ["string"],
  "experienceSuggestions": ["string"],
  "projectSuggestions": ["string"],
  "atsSuggestions": ["string"],
  "actionPlan": ["string"]
}}

Structured Resume:
{json.dumps(resume, indent=2)}
"""
    result = _call_llm_json(prompt, system_message=system_msg)
    return {
        "overallAssessment": result.get("overallAssessment", ""),
        "strengths": result.get("strengths", []),
        "weaknesses": result.get("weaknesses", []),
        "skillSuggestions": result.get("skillSuggestions", []),
        "experienceSuggestions": result.get("experienceSuggestions", []),
        "projectSuggestions": result.get("projectSuggestions", []),
        "atsSuggestions": result.get("atsSuggestions", []),
        "actionPlan": result.get("actionPlan", [])
    }


def analyze_resume_for_job(resume, job, ats):
    system_msg = "You are an expert technical recruiter and resume optimization assistant."
    prompt = f"""
Analyze how well this candidate's resume matches the specific job description.

RULES:
- Use only provided resume, job description, and ATS data.
- Do not invent candidate experience or recommend lying.
- Clearly distinguish between existing strengths and missing requirements.

Required JSON Structure:
{{
  "overallAssessment": "string",
  "whyYouMatch": ["string"],
  "whyYouDontMatch": ["string"],
  "missingSkills": ["string"],
  "missingKeywords": ["string"],
  "resumeImprovements": ["string"],
  "projectImprovements": ["string"],
  "atsImprovements": ["string"],
  "actionPlan": ["string"]
}}

CANDIDATE RESUME:
{json.dumps(resume, indent=2)}

JOB:
{json.dumps(job, indent=2)}

ATS ANALYSIS:
{json.dumps(ats, indent=2)}
"""
    result = _call_llm_json(prompt, system_message=system_msg)
    return {
        "overallAssessment": result.get("overallAssessment", ""),
        "whyYouMatch": result.get("whyYouMatch", []),
        "whyYouDontMatch": result.get("whyYouDontMatch", []),
        "missingSkills": result.get("missingSkills", []),
        "missingKeywords": result.get("missingKeywords", []),
        "resumeImprovements": result.get("resumeImprovements", []),
        "projectImprovements": result.get("projectImprovements", []),
        "atsImprovements": result.get("atsImprovements", []),
        "actionPlan": result.get("actionPlan", [])
    }


def generate_interview_question(resume, job, previous_question=None, previous_answer=None):
    system_msg = "You are conducting a realistic technical job interview."

    resume_data = resume.get("structuredResume", resume) if isinstance(resume, dict) else {}
    if not isinstance(resume_data, dict):
        resume_data = resume if isinstance(resume, dict) else {}

    resume_context = {
        "skills": resume_data.get("skills", []),
        "experience": resume_data.get("experience", []),
        "projects": resume_data.get("projects", [])
    }

    job_context = {
        "title": job.get("title", "") if isinstance(job, dict) else "",
        "requiredSkills": job.get("requiredSkills", []) if isinstance(job, dict) else [],
        "description": job.get("description", "") if isinstance(job, dict) else ""
    }

    if not previous_question or not previous_answer:
        prompt = f"""
Generate ONE initial interview question for this candidate.

CANDIDATE:
{json.dumps(resume_context, indent=2)}

JOB:
{json.dumps(job_context, indent=2)}

RULES:
- Generate exactly ONE question. Max 25 words.
- Focus on ONE specific concept. Candidate answers in 1-2 mins.
- Do not ask for code or entire system design.
- Prefer a topic appearing in both resume and job.

Required JSON Structure:
{{
  "question": "How did you implement JWT authentication in your Node.js project?",
  "questionType": "technical",
  "topic": "Authentication",
  "difficulty": "medium"
}}
"""
    else:
        prompt = f"""
Generate ONE follow-up question based on the candidate's previous answer.

CANDIDATE:
{json.dumps(resume_context, indent=2)}

JOB:
{json.dumps(job_context, indent=2)}

PREVIOUS QUESTION:
{previous_question}

CANDIDATE'S ANSWER:
{previous_answer}

RULES:
- Generate exactly ONE follow-up question directly related to the previous answer.
- Focus on ONE specific concept. Max 25 words.
- If answer was weak, probe missing understanding. If strong, increase difficulty slightly.

Required JSON Structure:
{{
  "question": "Follow-up question string",
  "questionType": "technical",
  "topic": "Topic Name",
  "difficulty": "medium"
}}
"""
    result = _call_llm_json(prompt, system_message=system_msg)
    return {
        "question": result.get("question", "Tell me about your technical experience relevant to this role."),
        "questionType": result.get("questionType", "technical"),
        "topic": result.get("topic", "General"),
        "difficulty": result.get("difficulty", "medium")
    }


def evaluate_interview_answer(question, answer, resume, job):
    system_msg = "You are an expert technical interviewer evaluating a candidate's answer."

    resume_data = resume.get("structuredResume", resume) if isinstance(resume, dict) else {}
    if not isinstance(resume_data, dict):
        resume_data = resume if isinstance(resume, dict) else {}

    resume_context = {
        "skills": resume_data.get("skills", []),
        "experience": resume_data.get("experience", []),
        "projects": resume_data.get("projects", [])
    }

    job_context = {
        "title": job.get("title", "") if isinstance(job, dict) else "",
        "requiredSkills": job.get("requiredSkills", []) if isinstance(job, dict) else [],
        "description": job.get("description", "") if isinstance(job, dict) else ""
    }

    prompt = f"""
Evaluate the candidate's actual answer to the question.

QUESTION:
{question}

CANDIDATE ANSWER:
{answer}

CANDIDATE RESUME:
{json.dumps(resume_context, indent=2)}

JOB:
{json.dumps(job_context, indent=2)}

PART 1: CONTENT EVALUATION (0 to 10)
- Technical correctness, relevance, depth, practical understanding.

PART 2: COMMUNICATION EVALUATION (0 to 10 for each)
- clarity: Is explanation clear?
- confidence: Score perceived language confidence (look for uncertainty markers like 'I think', 'maybe'). Do NOT diagnose psychology.
- fluency: Smooth natural flow.
- fillerWordScore: Filler word control score.
- fillerWords: Array of objects with word and count.
- confidenceSignals: Array of observed positive language signals.
- communicationStrengths: Array of observed communication strengths.
- communicationImprovements: Array of actionable language improvements.

Next Question: ONE realistic adaptive follow-up question.

Required JSON Structure:
{{
    "contentScore": 8,
    "strengths": ["Meaningful sentence about technical strength."],
    "improvements": ["Meaningful sentence about technical improvement."],
    "idealAnswerPoints": ["Important point that strengthens answer."],
    "communication": {{
        "clarity": 8,
        "confidence": 7,
        "fluency": 8,
        "fillerWordScore": 9,
        "fillerWords": [
            {{"word": "um", "count": 1}}
        ],
        "confidenceSignals": ["Direct phrasing when stating key architectural choices."],
        "communicationStrengths": ["Clear logical structure."],
        "communicationImprovements": ["Reduce hesitation markers."]
    }},
    "nextQuestion": "Concise adaptive follow-up question."
}}
"""
    result = _call_llm_json(prompt, system_message=system_msg)

    # Deterministic Score Weightings (Content = 70%, Communication = 30%)
    content_score = float(result.get("contentScore", 7))

    comm = result.get("communication", {})
    if not isinstance(comm, dict):
        comm = {}

    clarity = float(comm.get("clarity", 7))
    confidence = float(comm.get("confidence", 7))
    fluency = float(comm.get("fluency", 7))
    filler_score = float(comm.get("fillerWordScore", 8))

    # Communication score: Clarity 30%, Confidence 30%, Fluency 20%, Filler control 20%
    comm_score = round(
        clarity * 0.30 +
        confidence * 0.30 +
        fluency * 0.20 +
        filler_score * 0.20,
        1
    )

    # Final score: Content 70%, Communication 30%
    final_score = round(content_score * 0.70 + comm_score * 0.30, 1)

    return {
        "contentScore": content_score,
        "strengths": result.get("strengths", []),
        "improvements": result.get("improvements", []),
        "idealAnswerPoints": result.get("idealAnswerPoints", []),
        "communication": {
            "clarity": clarity,
            "confidence": confidence,
            "fluency": fluency,
            "fillerWordScore": filler_score,
            "fillerWords": comm.get("fillerWords", []),
            "confidenceSignals": comm.get("confidenceSignals", []),
            "communicationStrengths": comm.get("communicationStrengths", []),
            "communicationImprovements": comm.get("communicationImprovements", [])
        },
        "communicationScore": comm_score,
        "finalScore": final_score,
        "nextQuestion": result.get("nextQuestion", "Can you elaborate on how you handled edge cases?")
    }


if __name__ == "__main__":
    test_resume = {
        "skills": ["Python", "Node.js", "MongoDB"],
        "experience": [{"company": "Tech Corp", "role": "Developer", "startDate": "2023", "endDate": "2024", "description": "Built APIs"}]
    }
    test_job = {"title": "Full Stack Engineer", "requiredSkills": ["Node.js", "MongoDB"]}
    print("Testing generate_interview_question...")
    print(generate_interview_question(test_resume, test_job))