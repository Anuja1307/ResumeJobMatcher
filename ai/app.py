from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from embeddding_service import generate_embedding

from bert_ner import extract_entities
from llm_extractor import extract_resume_information
from llm_extractor import extract_job_keywords
from llm_extractor import extract_job_skills
from llm_extractor import extract_resume_analysis
from llm_extractor import analyze_resume_for_job

app = FastAPI()


# ============================================================
# Request format
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



# ============================================================
# Home route
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Resume AI Service is running"
    }


# ============================================================
# Resume extraction endpoint
# ============================================================

@app.post("/extract")
def extract_resume(request: ResumeRequest):

    resume_text = request.text

    # -----------------------------
    # BERT NER
    # -----------------------------

    bert_result = extract_entities(resume_text)


    # -----------------------------
    # Qwen LLM
    # -----------------------------

    llm_result = extract_resume_information(resume_text)


    # -----------------------------
    # Return both results
    # -----------------------------

    return {
        "bert": bert_result,
        "llm": llm_result
    }

@app.post("/embed")
def create_embedding(request: EmbeddingRequest):

    embedding = generate_embedding(
        request.text
    )

    return {
        "embedding": embedding,
        "dimensions": len(embedding)
    }

@app.post("/extract-job")
def extract_job(request: JobSkillRequest):

    skills = extract_job_skills(
        request.description
    )

    return skills

@app.post("/extract-job-keywords")
def extract_job_keywords_endpoint(
    request: JobKeywordRequest
):
    result = extract_job_keywords(
        request.description
    )

    return result

@app.post("/analyze-resume")
def analyze_resume(request: ResumeAnalysisRequest):

    try:

        result = extract_resume_analysis(
            request.resume
        )

        return result

    except Exception as e:

        print("Resume analysis error:", e)

        raise HTTPException(
            status_code=500,
            detail="Resume analysis service failed"
        )

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