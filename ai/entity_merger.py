def merge_entities(rule_data, bert_data, raw_text=""):

    merged = {
        "personal": {
            "name": rule_data.get("name", ""),
            "email": rule_data.get("email", ""),
            "phone": rule_data.get("phone", ""),
            "location": rule_data.get("location", ""),
            "linkedin": rule_data.get("linkedin", ""),
            "github": rule_data.get("github", ""),
            "portfolio": rule_data.get("portfolio", "")
        },

        "summary": rule_data.get("summary", ""),

        "skills": rule_data.get("skills", []),

        "education": rule_data.get("education", []),

        "experience": rule_data.get("experience", []),

        "projects": rule_data.get("projects", []),

        "certifications": rule_data.get("certifications", []),

        "achievements": rule_data.get("achievements", []),

        "languages": rule_data.get("languages", []),

        # BERT information
        "nerEntities": {
            "persons": bert_data.get("persons", []),
            "organizations": bert_data.get("organizations", []),
            "locations": bert_data.get("locations", []),
            "miscellaneous": bert_data.get("miscellaneous", [])
        },

        "rawText": raw_text
    }

    return merged