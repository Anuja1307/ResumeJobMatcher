// resumeParser.js

const SECTION_HEADERS = {
  skills: /^(skills|technical skills|technologies)\s*:?$/i,
  education: /^(education|academic background)\s*:?$/i,
  projects: /^(projects|personal projects)\s*:?$/i,
  experience: /^(experience|work experience|professional experience|internship)\s*:?$/i,
};

function findSections(rawText) {
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const sectionPositions = [];

  lines.forEach((line, idx) => {
    for (const [sectionName, pattern] of Object.entries(SECTION_HEADERS)) {
      if (pattern.test(line)) {
        sectionPositions.push({ sectionName, lineIndex: idx });
        break;
      }
    }
  });

  const sections = {};
  for (let i = 0; i < sectionPositions.length; i++) {
    const { sectionName, lineIndex } = sectionPositions[i];
    const nextLineIndex = sectionPositions[i + 1]
      ? sectionPositions[i + 1].lineIndex
      : lines.length;

    const contentLines = lines.slice(lineIndex + 1, nextLineIndex);
    sections[sectionName] = contentLines;
  }

  return { lines, sectionPositions, sections };
}

function extractName(lines, sectionPositions) {
  // Name is usually the very first non-empty line, before any section header
  const firstSectionLine = sectionPositions[0]?.lineIndex ?? lines.length;
  return firstSectionLine > 0 ? lines[0] : null;
}

function parseSkills(skillLines) {
  // Skills might be comma-separated on one line, or one per line, or space/pipe separated
  const joined = skillLines.join(', ');
  return joined
    .split(/,|\||•|\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseEducation(eduLines) {
  const degreePattern = /(B\.?Tech|M\.?Tech|B\.?E|M\.?E|Bachelor|Master|PhD|B\.?Sc|M\.?Sc)/i;
  return eduLines
    .filter(line => degreePattern.test(line))
    .map(line => ({ degree: line }));
}

function parseListSection(sectionLines) {
  // Generic fallback: each non-empty line is one entry
  return sectionLines.filter(Boolean);
}

function parseResume(rawText) {
  const { lines, sectionPositions, sections } = findSections(rawText);

  const structured = {
    name: extractName(lines, sectionPositions),
    skills: sections.skills ? parseSkills(sections.skills) : [],
    education: sections.education ? parseEducation(sections.education) : [],
    projects: sections.projects ? parseListSection(sections.projects) : [],
    experience: sections.experience ? parseListSection(sections.experience) : [],
  };

  return structured;
}

module.exports = parseResume ;