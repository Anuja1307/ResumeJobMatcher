from fastapi import FastAPI
from pydantic import BaseModel

from bert_ner import extract_entities
from llm_extractor import extract_resume_information


app = FastAPI()


# ============================================================
# Request format
# ============================================================

class ResumeRequest(BaseModel):
    text: str


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