from entity_merger import merge_entities


# ==========================================
# 1. RULE-BASED PARSER OUTPUT
# ==========================================

rule_data = {
    "name": "Anuja Sharma",
    "email": "anuja@gmail.com",
    "phone": "+91 98765 43210",
    "location": "Bangalore, India",
    "linkedin": "",
    "github": "github.com/anuja-sharma",
    "portfolio": "",

    "summary": "Third-year B.Tech Computer Science student at Amrita Vishwa Vidyapeetham with hands-on experience building full-stack MERN applications.",

    "skills": [
        "JavaScript",
        "Python",
        "Java",
        "C++",
        "React.js",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
        "Node.js",
        "Express.js",
        "REST APIs",
        "JWT Authentication",
        "MongoDB",
        "Mongoose",
        "MongoDB Atlas",
        "Redis",
        "Git",
        "GitHub",
        "Postman",
        "VS Code",
        "Docker (basics)",
        "Cloudinary",
        "Vercel",
        "Render",
        "Upstash"
    ],

    "education": [
        {
            "degree": "B.Tech in Computer Science and Engineering",
            "field": "Computer Science and Engineering",
            "institution": "Amrita Vishwa Vidyapeetham",
            "location": "Coimbatore",
            "startYear": "2022",
            "endYear": "2026",
            "cgpa": "8.4 / 10"
        }
    ],

    "experience": [],

    "projects": [
        "AI-Powered Resume and Job Matcher",
        "Digital Library Management System",
        "E-Wallet Application"
    ],

    "certifications": [],

    "achievements": [
        "Solved 200+ problems on LeetCode",
        "Completed The Complete Node.js Developer Course"
    ],

    "languages": []
}


# ==========================================
# 2. BERT NER OUTPUT
# ==========================================

bert_data = {
    "persons": [],

    "organizations": [
        {
            "type": "ORG",
            "start": 87,
            "end": 103,
            "text": "ABC Technologies"
        }
    ],

    "locations": [
        {
            "type": "LOC",
            "start": 69,
            "end": 78,
            "text": "Bangalore"
        },
        {
            "type": "LOC",
            "start": 80,
            "end": 85,
            "text": "India"
        },
        {
            "type": "LOC",
            "start": 202,
            "end": 212,
            "text": "Coimbatore"
        }
    ],

    "miscellaneous": []
}


# ==========================================
# 3. RAW RESUME TEXT
# ==========================================

raw_text = """
Anuja Sharma anuja@gmail.com | +91 98765 43210 | Bangalore, India | github.com/anuja-sharma

SUMMARY

Third-year B.Tech Computer Science student at Amrita Vishwa Vidyapeetham with hands-on experience building full-stack MERN applications.

SKILLS

JavaScript, Python, Java, C++, React.js, Tailwind CSS, Node.js, Express.js, MongoDB, Redis

EXPERIENCE

ABC Technologies
Software Developer Intern

EDUCATION

B.Tech in Computer Science and Engineering
Amrita Vishwa Vidyapeetham, Coimbatore | 2022 - 2026 | CGPA: 8.4 / 10

PROJECTS

AI-Powered Resume and Job Matcher
Digital Library Management System
E-Wallet Application
"""


# ==========================================
# 4. MERGE
# ==========================================

merged = merge_entities(
    rule_data,
    bert_data,
    raw_text
)


# ==========================================
# 5. DISPLAY RESULT
# ==========================================

print("\n========================================")
print("        MERGED RESUME")
print("========================================")

print("\nPERSONAL:")
print(merged["personal"])


print("\nSUMMARY:")
print(merged["summary"])


print("\nSKILLS:")
print(merged["skills"])


print("\nEDUCATION:")
print(merged["education"])


print("\nEXPERIENCE:")
print(merged["experience"])


print("\nPROJECTS:")
print(merged["projects"])


print("\nCERTIFICATIONS:")
print(merged["certifications"])


print("\nACHIEVEMENTS:")
print(merged["achievements"])


print("\nLANGUAGES:")
print(merged["languages"])


# ==========================================
# 6. BERT ENTITIES
# ==========================================

print("\n========================================")
print("          BERT NER ENTITIES")
print("========================================")

print("\nPERSONS:")
print(merged["nerEntities"]["persons"])

print("\nORGANIZATIONS:")
print(merged["nerEntities"]["organizations"])

print("\nLOCATIONS:")
print(merged["nerEntities"]["locations"])

print("\nMISCELLANEOUS:")
print(merged["nerEntities"]["miscellaneous"])


print("\n========================================")
print("        MERGER TEST COMPLETE")
print("========================================")