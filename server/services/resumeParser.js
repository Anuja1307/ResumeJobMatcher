// server/services/resumeParser.js

const createEmptyResume = require("./resumeSchema");

const SECTION_HEADERS = {
  skills: /^(skills|technical skills|technologies)\s*:?\s*$/i,

  education:
    /^(education|academic background|educational background)\s*:?\s*$/i,

  projects:
    /^(projects|personal projects|academic projects)\s*:?\s*$/i,

  experience:
    /^(experience|work experience|professional experience|internship|work history)\s*:?\s*$/i,

  certifications:
    /^(certifications|certificates|licenses)\s*:?\s*$/i,

  achievements:
    /^(achievements|awards|accomplishments)\s*:?\s*$/i,

  languages:
    /^(languages|language proficiency)\s*:?\s*$/i,

  summary:
    /^(summary|professional summary|profile|objective|career objective)\s*:?\s*$/i
};


// ==================================================
// FIND SECTIONS
// ==================================================

function findSections(rawText) {

  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const sectionPositions = [];

  lines.forEach((line, index) => {

    for (const [sectionName, pattern] of Object.entries(SECTION_HEADERS)) {

      if (pattern.test(line)) {

        sectionPositions.push({
          sectionName,
          lineIndex: index
        });

        break;
      }
    }
  });

  const sections = {};

  for (let i = 0; i < sectionPositions.length; i++) {

    const {
      sectionName,
      lineIndex
    } = sectionPositions[i];

    const nextLineIndex =
      sectionPositions[i + 1]
        ? sectionPositions[i + 1].lineIndex
        : lines.length;

    sections[sectionName] =
      lines.slice(lineIndex + 1, nextLineIndex);
  }

  return {
    lines,
    sectionPositions,
    sections
  };
}


// ==================================================
// CONTACT LINE
// ==================================================

function getContactLine(lines) {

  if (!lines.length) {
    return "";
  }

  return lines[0];
}


// ==================================================
// EXTRACT NAME
// ==================================================

function extractName(lines) {

  if (!lines.length) {
    return "";
  }

  const firstLine = lines[0];

  // Email separates the name from contact information
  const emailIndex = firstLine.search(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );

  if (emailIndex !== -1) {

    const name = firstLine
      .substring(0, emailIndex)
      .replace(/[\t|,]+$/, "")
      .trim();

    return name;
  }

  // Fallback: remove contact information if present
  return firstLine
    .split(/\||\t/)
    [0]
    .trim();
}


// ==================================================
// EXTRACT EMAIL
// ==================================================

function extractEmail(rawText) {

  const pattern =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

  const match = rawText.match(pattern);

  return match ? match[0] : "";
}


// ==================================================
// EXTRACT PHONE
// ==================================================

function extractPhone(rawText) {

  // Handles examples such as:
  // +91 98765 43210
  // +91-98765-43210
  // 98765 43210
  // 9876543210

  const pattern =
    /(?:\+\d{1,3}[\s.-]?)?(?:\d{5}[\s.-]?\d{5}|\d{10})\b/;

  const match = rawText.match(pattern);

  return match
    ? match[0].trim()
    : "";
}


// ==================================================
// EXTRACT LOCATION
// ==================================================

function extractLocation(lines) {

  const contactLine = getContactLine(lines);

  // Example:
  // Anuja Sharma    email | phone | Bangalore, India | github.com/...

  const parts = contactLine
    .split("|")
    .map(part => part.trim())
    .filter(Boolean);

  for (const part of parts) {

    // Ignore email
    if (part.includes("@")) {
      continue;
    }

    // Ignore phone
    if (/\d{5}[\s.-]?\d{5}/.test(part)) {
      continue;
    }

    // Ignore GitHub
    if (/github\.com/i.test(part)) {
      continue;
    }

    // Ignore LinkedIn
    if (/linkedin\.com/i.test(part)) {
      continue;
    }

    // Ignore obvious URLs
    if (/https?:\/\//i.test(part)) {
      continue;
    }

    // If it contains a comma, likely a location
    if (part.includes(",")) {
      return part;
    }
  }

  return "";
}


// ==================================================
// EXTRACT LINKEDIN
// ==================================================

function extractLinkedIn(rawText) {

  const pattern =
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|]+/i;

  const match = rawText.match(pattern);

  return match
    ? match[0]
    : "";
}


// ==================================================
// EXTRACT GITHUB
// ==================================================

function extractGithub(rawText) {

  const pattern =
    /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|]+/i;

  const match = rawText.match(pattern);

  return match
    ? match[0]
    : "";
}


// ==================================================
// EXTRACT PORTFOLIO
// ==================================================

function extractPortfolio(rawText) {

  const lines = rawText.split(/\r?\n/);

  for (const line of lines) {

    if (
      /portfolio|personal website/i.test(line)
    ) {

      const urlMatch =
        line.match(/https?:\/\/[^\s|]+/i);

      if (urlMatch) {
        return urlMatch[0];
      }
    }
  }

  return "";
}


// ==================================================
// PARSE SKILLS
// ==================================================

function parseSkills(skillLines) {

  const skills = [];

  for (const line of skillLines) {

    // Remove category before :
    //
    // Languages: JavaScript, Python
    // becomes
    // JavaScript, Python

    const colonIndex = line.indexOf(":");

    let skillText = line;

    if (colonIndex !== -1) {
      skillText = line.substring(colonIndex + 1);
    }

    const extractedSkills = skillText
      .split(/,|\||•|;/)
      .map(skill => skill.trim())
      .filter(Boolean);

    skills.push(...extractedSkills);
  }

  // Remove duplicates
  return [...new Set(skills)];
}


// ==================================================
// PARSE EDUCATION
// ==================================================

function parseEducation(eduLines) {

  const degreePattern =
    /(B\.?Tech|M\.?Tech|B\.?E|M\.?E|Bachelor|Master|PhD|B\.?Sc|M\.?Sc)/i;

  const education = [];

  for (let i = 0; i < eduLines.length; i++) {

    const line = eduLines[i];

    if (!degreePattern.test(line)) {
      continue;
    }

    const entry = {
      degree: line,
      field: "",
      institution: "",
      location: "",
      startYear: "",
      endYear: "",
      cgpa: ""
    };

    // Look at following lines for institution/details

    const nextLine = eduLines[i + 1] || "";

    if (nextLine) {

      const cgpaMatch =
        nextLine.match(/CGPA\s*:\s*([\d.]+(?:\s*\/\s*[\d.]+)?)/i);

      if (cgpaMatch) {
        entry.cgpa = cgpaMatch[1];
      }

      const yearMatch =
        nextLine.match(/(20\d{2})\s*[-–]\s*(20\d{2})/);

      if (yearMatch) {
        entry.startYear = yearMatch[1];
        entry.endYear = yearMatch[2];
      }

      // Example:
      // Amrita Vishwa Vidyapeetham, Coimbatore | 2022 - 2026 | CGPA: 8.4 / 10

      const institutionPart =
        nextLine.split("|")[0].trim();

      if (institutionPart.includes(",")) {

        const parts =
          institutionPart.split(",");

        entry.institution =
          parts[0].trim();

        entry.location =
          parts.slice(1).join(",").trim();

      } else {

        entry.institution =
          institutionPart;
      }
    }

    // Extract field from degree
    const fieldMatch =
      line.match(
        /(?:B\.?Tech|M\.?Tech|B\.?E|M\.?E|Bachelor|Master|B\.?Sc|M\.?Sc)\s+(?:in\s+)?(.+)/i
      );

    if (fieldMatch) {
      entry.field = fieldMatch[1].trim();
    }

    education.push(entry);
  }

  return education;
}


// ==================================================
// PARSE GENERIC LIST
// ==================================================

function parseListSection(sectionLines) {

  return sectionLines
    .filter(Boolean);
}


// ==================================================
// PARSE SUMMARY
// ==================================================

function parseSummary(summaryLines) {

  return summaryLines
    .join(" ")
    .trim();
}


// ==================================================
// MAIN PARSER
// ==================================================

function parseResume(rawText) {

  const {
    lines,
    sectionPositions,
    sections
  } = findSections(rawText);

  const structured =
    createEmptyResume();


  // ==================================================
  // PERSONAL
  // ==================================================

  structured.personal.name =
    extractName(lines);

  structured.personal.email =
    extractEmail(rawText);

  structured.personal.phone =
    extractPhone(rawText);

  structured.personal.location =
    extractLocation(lines);

  structured.personal.linkedin =
    extractLinkedIn(rawText);

  structured.personal.github =
    extractGithub(rawText);

  structured.personal.portfolio =
    extractPortfolio(rawText);


  // ==================================================
  // SUMMARY
  // ==================================================

  structured.summary =
    sections.summary
      ? parseSummary(sections.summary)
      : "";


  // ==================================================
  // SKILLS
  // ==================================================

  structured.skills =
    sections.skills
      ? parseSkills(sections.skills)
      : [];


  // ==================================================
  // EDUCATION
  // ==================================================

  structured.education =
    sections.education
      ? parseEducation(sections.education)
      : [];


  // ==================================================
  // PROJECTS
  // ==================================================

  structured.projects =
    sections.projects
      ? parseListSection(sections.projects)
      : [];


  // ==================================================
  // EXPERIENCE
  // ==================================================

  structured.experience =
    sections.experience
      ? parseListSection(sections.experience)
      : [];


  // ==================================================
  // CERTIFICATIONS
  // ==================================================

  structured.certifications =
    sections.certifications
      ? parseListSection(sections.certifications)
      : [];


  // ==================================================
  // ACHIEVEMENTS
  // ==================================================

  structured.achievements =
    sections.achievements
      ? parseListSection(sections.achievements)
      : [];


  // ==================================================
  // LANGUAGES
  // ==================================================

  structured.languages =
    sections.languages
      ? parseSkills(sections.languages)
      : [];


  // ==================================================
  // RAW TEXT
  // ==================================================

  structured.rawText = rawText;


  return structured;
}


module.exports = parseResume;