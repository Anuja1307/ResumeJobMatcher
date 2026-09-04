from llm_extractor import extract_resume_information

text = """
Anuja Sharma

Experience

ABC Technologies
Software Developer Intern
June 2025 - August 2025

Developed REST APIs using Node.js and Express.js.
"""

result = extract_resume_information(text)

print(result)