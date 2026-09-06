from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from embeddding_service import generate_embedding

from bert_ner import extract_entities

from llm_extractor import (
    extract_resume_information,
    extract_job_keywords,
    extract_job_skills,
    extract_resume_analysis,
    analyze_resume_for_job,
    generate_interview_question,
    evaluate_interview_answer
)


app = FastAPI()


# ============================================================
# Request Models
# ============================================================

class ResumeRequest(BaseModel):
    text: str


class EmbeddingRequest(BaseModel):
    text: str


class JobSkillRequest(BaseModel):
    description: str


class JobKeywordRequest(BaseModel):
    description: str


class ResumeAnalysisRequest(BaseModel):
    resume: dict


class JobResumeAnalysisRequest(BaseModel):
    resume: dict
    job: dict
    ats: dict


class InterviewQuestionRequest(BaseModel):
    resume: dict
    job: dict
    previousQuestion: str | None = None
    previousAnswer: str | None = None


class InterviewAnswerRequest(BaseModel):
    question: str
    answer: str
    resume: dict
    job: dict


# ============================================================
# Home Route
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Resume AI Service is running"
    }


# ============================================================
# Resume Extraction Endpoint
# ============================================================

@app.post("/extract")
def extract_resume(request: ResumeRequest):

    try:

        resume_text = request.text

        # -----------------------------
        # BERT NER
        # -----------------------------

        bert_result = extract_entities(
            resume_text
        )

        # -----------------------------
        # Qwen LLM
        # -----------------------------

        llm_result = extract_resume_information(
            resume_text
        )

        # -----------------------------
        # Return both results
        # -----------------------------

        return {
            "bert": bert_result,
            "llm": llm_result
        }

    except Exception as e:

        print(
            "Resume extraction error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Resume extraction service failed"
        )


# ============================================================
# Embedding Endpoint
# ============================================================

@app.post("/embed")
def create_embedding(
    request: EmbeddingRequest
):

    try:

        embedding = generate_embedding(
            request.text
        )

        return {
            "embedding": embedding,
            "dimensions": len(embedding)
        }

    except Exception as e:

        print(
            "Embedding generation error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Embedding generation failed"
        )


# ============================================================
# Job Skill Extraction Endpoint
# ============================================================

@app.post("/extract-job")
def extract_job(
    request: JobSkillRequest
):

    try:

        skills = extract_job_skills(
            request.description
        )

        return skills

    except Exception as e:

        print(
            "Job skill extraction error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Job skill extraction failed"
        )


# ============================================================
# Job Keyword Extraction Endpoint
# ============================================================

@app.post("/extract-job-keywords")
def extract_job_keywords_endpoint(
    request: JobKeywordRequest
):

    try:

        result = extract_job_keywords(
            request.description
        )

        return result

    except Exception as e:

        print(
            "Job keyword extraction error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Job keyword extraction failed"
        )


# ============================================================
# General Resume Analysis
# ============================================================

@app.post("/analyze-resume")
def analyze_resume(
    request: ResumeAnalysisRequest
):

    try:

        result = extract_resume_analysis(
            request.resume
        )

        return result

    except Exception as e:

        print(
            "Resume analysis error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Resume analysis service failed"
        )


# ============================================================
# Job-Specific Resume Analysis
# ============================================================

@app.post("/analyze-resume-for-job")
def analyze_resume_for_job_endpoint(
    request: JobResumeAnalysisRequest
):

    try:

        result = analyze_resume_for_job(
            request.resume,
            request.job,
            request.ats
        )

        return result

    except Exception as e:

        print(
            "Job-specific resume analysis error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Job-specific resume analysis failed"
        )


# ============================================================
# Generate Interview Question
# ============================================================

@app.post("/generate-interview-question")
def generate_interview_question_endpoint(
    request: InterviewQuestionRequest
):

    try:

        result = generate_interview_question(
            request.resume,
            request.job,
            request.previousQuestion,
            request.previousAnswer
        )

        return result

    except Exception as e:

        print(
            "Interview question generation error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate interview question: {str(e)}"
        )
# ============================================================
# Evaluate Interview Answer
# ============================================================

@app.post("/evaluate-interview-answer")
def evaluate_interview_answer_endpoint(
    request: InterviewAnswerRequest
):

    try:

        result = evaluate_interview_answer(
            request.question,
            request.answer,
            request.resume,
            request.job
        )

        return result

    except Exception as e:

        print(
            "Interview answer evaluation error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to evaluate interview answer: {str(e)}"
        )