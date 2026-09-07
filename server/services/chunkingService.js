function createResumeChunks(resume) {

    const chunks = [];

    // Summary
    if (resume.summary) {
        chunks.push({
            source: "resume",
            type: "summary",
            text: resume.summary
        });
    }

    // Skills
    if (resume.skills?.length) {
        chunks.push({
            source: "resume",
            type: "skills",
            text: `Candidate skills: ${resume.skills.join(", ")}`
        });
    }

    // Experience
    if (resume.experience?.length) {

        resume.experience.forEach((experience) => {

            const text = `
Company: ${experience.company || ""}
Role: ${experience.role || ""}
Duration: ${experience.startDate || ""} - ${experience.endDate || ""}
Description: ${experience.description || ""}
            `.trim();

            chunks.push({
                source: "resume",
                type: "experience",
                text
            });

        });
    }

    // Projects
    if (resume.projects?.length) {

        resume.projects.forEach((project) => {

            const text = `
Project: ${project.name || ""}
Technologies: ${(project.technologies || []).join(", ")}
Description: ${project.description || ""}
            `.trim();

            chunks.push({
                source: "resume",
                type: "project",
                text
            });

        });
    }

    // Education
    if (resume.education?.length) {

        resume.education.forEach((education) => {

            const text = `
Degree: ${education.degree || ""}
Field: ${education.field || ""}
Institution: ${education.institution || ""}
Duration: ${education.startYear || ""} - ${education.endYear || ""}
            `.trim();

            chunks.push({
                source: "resume",
                type: "education",
                text
            });

        });
    }

    return chunks;
}

function createJobChunks(job) {

    const chunks = [];

    // Job overview
    const overview = `
Job Title: ${job.title || ""}
Company: ${job.company || ""}
Location: ${job.location || ""}
Experience Required: ${job.experience || ""}
Description: ${job.description || ""}
    `.trim();

    if (overview) {
        chunks.push({
            source: "job",
            type: "overview",
            text: overview,
            jobId: job._id
        });
    }


    // Required skills
    if (job.requiredSkills?.length) {

        chunks.push({
            source: "job",
            type: "requiredSkills",
            text: `Required skills: ${job.requiredSkills.join(", ")}`,
            jobId: job._id
        });

    }


    // Keywords
    if (job.keywords?.length) {

        chunks.push({
            source: "job",
            type: "keywords",
            text: `Important job keywords: ${job.keywords.join(", ")}`,
            jobId: job._id
        });

    }


    return chunks;
}

module.exports = {
    createResumeChunks,createJobChunks
};