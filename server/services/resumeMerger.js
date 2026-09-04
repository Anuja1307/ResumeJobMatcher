const createEmptyResume = require("./resumeSchema");


// ============================================================
// Remove duplicate values from an array
// ============================================================

function uniqueStrings(values = []) {
  return [
    ...new Set(
      values
        .filter(Boolean)
        .map(value => value.trim())
    )
  ];
}


// ============================================================
// Merge resume data
// ============================================================

function mergeResumeData(ruleData, bertData, llmData, rawText = "") {

  const finalResume = createEmptyResume();


  // ==========================================================
  // 1. PERSONAL INFORMATION
  // ==========================================================

  finalResume.personal.name =
    ruleData?.personal?.name ||
    ruleData?.name ||
    "";

  finalResume.personal.email =
    ruleData?.personal?.email ||
    ruleData?.email ||
    "";

  finalResume.personal.phone =
    ruleData?.personal?.phone ||
    ruleData?.phone ||
    "";

  finalResume.personal.location =
    ruleData?.personal?.location ||
    ruleData?.location ||
    "";

  finalResume.personal.linkedin =
    ruleData?.personal?.linkedin ||
    ruleData?.linkedin ||
    "";

  finalResume.personal.github =
    ruleData?.personal?.github ||
    ruleData?.github ||
    "";

  finalResume.personal.portfolio =
    ruleData?.personal?.portfolio ||
    ruleData?.portfolio ||
    "";


  // ==========================================================
  // 2. SUMMARY
  // ==========================================================

  finalResume.summary =
    ruleData?.summary ||
    llmData?.summary ||
    "";


  // ==========================================================
  // 3. SKILLS
  // ==========================================================

  const ruleSkills =
    ruleData?.skills || [];

  const llmSkills =
    llmData?.skills || [];

  finalResume.skills =
    uniqueStrings([
      ...ruleSkills,
      ...llmSkills
    ]);


  // ==========================================================
  // 4. EDUCATION
  // ==========================================================

  finalResume.education =
    ruleData?.education?.length
      ? ruleData.education
      : (llmData?.education || []);


  // ==========================================================
  // 5. EXPERIENCE
  // ==========================================================

  finalResume.experience =
    llmData?.experience || [];


  // ==========================================================
  // 6. PROJECTS
  // ==========================================================

  finalResume.projects =
    llmData?.projects || [];


  // ==========================================================
  // 7. CERTIFICATIONS
  // ==========================================================

  finalResume.certifications =
    llmData?.certifications || [];


  // ==========================================================
  // 8. ACHIEVEMENTS
  // ==========================================================

  const ruleAchievements =
    ruleData?.achievements || [];

  const llmAchievements =
    llmData?.achievements || [];

  finalResume.achievements =
    uniqueStrings([
      ...ruleAchievements,
      ...llmAchievements
    ]);


  // ==========================================================
  // 9. LANGUAGES
  // ==========================================================

  finalResume.languages =
    uniqueStrings(
      llmData?.languages || []
    );


  // ==========================================================
  // 10. BERT NER ENTITIES
  // ==========================================================

  finalResume.nerEntities = {

    persons:
      bertData?.persons || [],

    organizations:
      bertData?.organizations || [],

    locations:
      bertData?.locations || [],

    miscellaneous:
      bertData?.miscellaneous || []

  };


  // ==========================================================
  // 11. RAW TEXT
  // ==========================================================

  finalResume.rawText =
    rawText ||
    ruleData?.rawText ||
    "";


  return finalResume;
}


module.exports = mergeResumeData;