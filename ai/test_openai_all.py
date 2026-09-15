import os
import json
import math
from dotenv import load_dotenv

load_dotenv()

from llm_extractor import (
    extract_resume_information,
    extract_job_skills,
    extract_job_keywords,
    extract_resume_analysis,
    analyze_resume_for_job,
    generate_interview_question,
    evaluate_interview_answer
)
from embedding_service import generate_embedding
from whisper_service import transcribe_audio_file


def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    return dot / (mag_a * mag_b)


def run_all_tests():
    print("\n==================================================")
    print("      RUNNING OPENAI INTEGRATION TEST SUITE       ")
    print("==================================================")
    print(f"AI_PROVIDER:                  {os.getenv('AI_PROVIDER', 'openai')}")
    print(f"OPENAI_LLM_MODEL:             {os.getenv('OPENAI_LLM_MODEL', 'gpt-4o-mini')}")
    print(f"OPENAI_EMBEDDING_MODEL:       {os.getenv('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small')}")
    print(f"OPENAI_TRANSCRIPTION_MODEL:   {os.getenv('OPENAI_TRANSCRIPTION_MODEL', 'whisper-1')}")
    print("--------------------------------------------------\n")

    sample_resume_text = """
    Anuja Sharma
    Email: anuja@example.com | Location: Bangalore, India
    Summary: Computer Science student passionate about full-stack development.
    Skills: JavaScript, Python, Node.js, Express.js, React, MongoDB, Docker, Git.
    Experience:
    Software Developer Intern at ABC Tech (June 2024 - August 2024):
    Developed REST APIs using Node.js, Express, and MongoDB. Optimized database queries and containerized services with Docker.
    Projects:
    AI-Powered Resume Matcher: Built React frontend and Node.js backend with AI services.
    """

    sample_job_description = """
    Full Stack Developer (Node.js & React)
    We are looking for a Software Engineer with strong experience in Node.js, Express, React, and MongoDB.
    Responsibilities:
    - Design and implement scalable RESTful APIs.
    - Build responsive front-end applications with React and Tailwind CSS.
    - Integrate containerized backend microservices using Docker and CI/CD pipelines.
    Requirements:
    - 1+ years experience with JavaScript/TypeScript, Node.js, and React.
    - Experience with MongoDB, Redis, and vector search.
    """

    sample_resume_dict = {
        "summary": "Full stack developer with Node.js and React experience.",
        "skills": ["JavaScript", "Python", "Node.js", "Express.js", "React", "MongoDB", "Docker"],
        "experience": [
            {
                "company": "ABC Tech",
                "role": "Software Developer Intern",
                "startDate": "2024-06",
                "endDate": "2024-08",
                "description": "Developed REST APIs with Node.js and MongoDB."
            }
        ],
        "projects": [
            {
                "name": "Resume Matcher",
                "technologies": ["React", "Node.js", "MongoDB"],
                "description": "Built full stack matching application."
            }
        ]
    }

    sample_job_dict = {
        "title": "Full Stack Developer",
        "company": "Tech Corp",
        "requiredSkills": ["Node.js", "React", "MongoDB", "Docker"],
        "description": sample_job_description
    }

    sample_ats = {
        "matchScore": 85,
        "matchedKeywords": ["Node.js", "React", "MongoDB"],
        "missingKeywords": ["TypeScript", "Redis"]
    }

    # 1. Resume Information Extraction
    print("[1/10] Testing Resume Information Extraction...")
    extracted_resume = extract_resume_information(sample_resume_text)
    assert isinstance(extracted_resume, dict)
    assert "skills" in extracted_resume
    assert "projects" in extracted_resume
    print(f"  ✓ Skills extracted: {len(extracted_resume['skills'])}")
    print(f"  ✓ Projects extracted: {len(extracted_resume['projects'])}")

    # 2. Job Skill Extraction
    print("\n[2/10] Testing Job Skill Extraction...")
    extracted_skills = extract_job_skills(sample_job_description)
    assert isinstance(extracted_skills, dict)
    assert "skills" in extracted_skills
    print(f"  ✓ Job skills extracted: {extracted_skills['skills']}")

    # 3. Job Keyword Extraction
    print("\n[3/10] Testing Job Keyword Extraction...")
    extracted_keywords = extract_job_keywords(sample_job_description)
    assert isinstance(extracted_keywords, dict)
    assert "keywords" in extracted_keywords
    print(f"  ✓ Job keywords extracted: {extracted_keywords['keywords']}")

    # 4. Resume General Analysis
    print("\n[4/10] Testing General Resume Analysis...")
    analysis = extract_resume_analysis(sample_resume_dict)
    assert isinstance(analysis, dict)
    assert "overallAssessment" in analysis
    print(f"  ✓ Overall Assessment snippet: {analysis['overallAssessment'][:80]}...")

    # 5. Job-Specific Resume Analysis
    print("\n[5/10] Testing Job-Specific Resume Analysis...")
    job_analysis = analyze_resume_for_job(sample_resume_dict, sample_job_dict, sample_ats)
    assert isinstance(job_analysis, dict)
    assert "overallAssessment" in job_analysis
    print(f"  ✓ Job Match Assessment snippet: {job_analysis['overallAssessment'][:80]}...")

    # 6. Interview Question Generation
    print("\n[6/10] Testing Interview Question Generation...")
    question_res = generate_interview_question(sample_resume_dict, sample_job_dict)
    assert "question" in question_res
    print(f"  ✓ Initial Question: \"{question_res['question']}\"")

    followup_res = generate_interview_question(
        sample_resume_dict,
        sample_job_dict,
        previous_question=question_res['question'],
        previous_answer="I implemented JWT tokens stored in HTTP-only cookies and created authentication middleware in Express."
    )
    assert "question" in followup_res
    print(f"  ✓ Follow-up Question: \"{followup_res['question']}\"")

    # 7. Interview Answer Evaluation
    print("\n[7/10] Testing Interview Answer Evaluation...")
    eval_res = evaluate_interview_answer(
        question=question_res['question'],
        answer="I used JSON Web Tokens for authentication. Um, I created a middleware function in Express that verifies the token from request headers before passing control to protected route handlers.",
        resume=sample_resume_dict,
        job=sample_job_dict
    )
    assert "contentScore" in eval_res
    assert "communicationScore" in eval_res
    assert "finalScore" in eval_res
    print(f"  ✓ Content Score: {eval_res['contentScore']}/10")
    print(f"  ✓ Communication Score: {eval_res['communicationScore']}/10")
    print(f"  ✓ Final Score: {eval_res['finalScore']}/10")

    # 8. Resume & Job Embeddings
    print("\n[8/10] Testing Resume & Job Embedding Generation...")
    resume_emb = generate_embedding(sample_resume_text)
    job_emb = generate_embedding(sample_job_description)
    cake_emb = generate_embedding("Chocolate cake recipe with cocoa, sugar, and flour.")

    assert isinstance(resume_emb, list)
    assert isinstance(job_emb, list)
    assert len(resume_emb) == len(job_emb)
    dim = len(resume_emb)
    print(f"  ✓ Embedding Dimension: {dim}")

    sim_job = cosine_similarity(resume_emb, job_emb)
    sim_cake = cosine_similarity(resume_emb, cake_emb)
    print(f"  ✓ Cosine Similarity (Resume vs Job): {sim_job:.4f}")
    print(f"  ✓ Cosine Similarity (Resume vs Cake): {sim_cake:.4f}")
    assert sim_job > sim_cake, "Resume should match Job higher than Chocolate Cake!"

    # 9. Audio Transcription & Voice Metrics
    print("\n[9/10] Testing Audio Transcription & Voice Metrics...")
    audio_path = "test_audio.wav"
    if os.path.exists(audio_path):
        audio_res = transcribe_audio_file(audio_path)
        assert "transcript" in audio_res
        assert "wordCount" in audio_res
        assert "duration" in audio_res
        assert "speakingRate" in audio_res
        print(f"  ✓ Transcript: \"{audio_res['transcript']}\"")
        print(f"  ✓ Word Count: {audio_res['wordCount']}")
        print(f"  ✓ Duration: {audio_res['duration']}s")
        print(f"  ✓ Speaking Rate: {audio_res['speakingRate']} WPM")
        print(f"  ✓ Filler Word Count: {audio_res['fillerWordCount']}")
        print(f"  ✓ Filler Words: {audio_res['fillerWords']}")

        # 10. End-to-End Audio Transcript -> Answer Evaluation Flow
        print("\n[10/10] Testing End-to-End Transcript -> Evaluation Flow...")
        e2e_eval = evaluate_interview_answer(
            question=question_res['question'],
            answer=audio_res['transcript'],
            resume=sample_resume_dict,
            job=sample_job_dict
        )
        assert "finalScore" in e2e_eval
        print(f"  ✓ E2E Evaluation Final Score: {e2e_eval['finalScore']}/10")
        print(f"  ✓ Next Adaptive Question: \"{e2e_eval['nextQuestion']}\"")
    else:
        print(f"  ⚠ Audio file {audio_path} not found, skipping audio test.")

    print("\n==================================================")
    print("      ALL OPENAI INTEGRATION TESTS PASSED!        ")
    print("==================================================\n")


if __name__ == "__main__":
    run_all_tests()
