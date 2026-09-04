def merge_entities(rule_data, bert_data, llm_data, raw_text=""):

    # -----------------------------
    # 1. PERSONAL INFORMATION
    # -----------------------------

    personal = {
        "name": rule_data.get("name", ""),
        "email": rule_data.get("email", ""),
        "phone": rule_data.get("phone", ""),
        "location": rule_data.get("location", ""),
        "linkedin": rule_data.get("linkedin", ""),
        "github": rule_data.get("github", ""),
        "portfolio": rule_data.get("portfolio", "")
    }


    # -----------------------------
    # 2. SKILLS
    # -----------------------------

    rule_skills = rule_data.get("skills", [])
    llm_skills = llm_data.get("skills", [])

    skills = list(dict.fromkeys(
        rule_skills + llm_skills
    ))


    # -----------------------------
    # 3. PROJECTS
    # -----------------------------

    projects = llm_data.get("projects", [])

    if not projects:
        projects = rule_data.get("projects", [])


    # -----------------------------
    # 4. EXPERIENCE
    # -----------------------------

    experience = llm_data.get("experience", [])

    if not experience:
        experience = rule_data.get("experience", [])


    # -----------------------------
    # 5. EDUCATION
    # -----------------------------

    education = rule_data.get("education", [])


    # -----------------------------
    # 6. OTHER INFORMATION
    # -----------------------------

    certifications = rule_data.get("certifications", [])
    achievements = rule_data.get("achievements", [])
    languages = rule_data.get("languages", [])


    # -----------------------------
    # 7. BERT ENTITIES
    # -----------------------------

    ner_entities = {
        "persons": bert_data.get("persons", []),
        "organizations": bert_data.get("organizations", []),
        "locations": bert_data.get("locations", []),
        "miscellaneous": bert_data.get("miscellaneous", [])
    }


    # -----------------------------
    # 8. FINAL STRUCTURED RESUME
    # -----------------------------

    merged = {

        "personal": personal,

        "summary": rule_data.get("summary", ""),

        "skills": skills,

        "roles": llm_data.get("roles", []),

        "education": education,

        "experience": experience,

        "projects": projects,

        "certifications": certifications,

        "achievements": achievements,

        "languages": languages,

        "nerEntities": ner_entities,

        "rawText": raw_text
    }


    return merged