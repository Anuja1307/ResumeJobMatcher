function buildResumeEmbeddingText(resume) {
    const personal = resume.personal || {};

    const skills = (resume.skills || []).join(", ");

    const education = (resume.education || [])
        .map(edu =>
            `${edu.degree || ""} ${edu.field || ""} ${edu.institution || ""}`
        )
        .join("\n");

    const experience = (resume.experience || [])
        .map(exp =>
            `${exp.role || ""} at ${exp.company || ""}: ${exp.description || ""}`
        )
        .join("\n");

    const projects = (resume.projects || [])
        .map(project =>
            `${project.name || ""} using ${(project.technologies || []).join(", ")}: ${project.description || ""}`
        )
        .join("\n");

    const certifications = (resume.certifications || []).join(", ");

    return `
Name: ${personal.name || ""}

Summary:
${resume.summary || ""}

Skills:
${skills}

Education:
${education}

Experience:
${experience}

Projects:
${projects}

Certifications:
${certifications}
`;
}

module.exports = buildResumeEmbeddingText;