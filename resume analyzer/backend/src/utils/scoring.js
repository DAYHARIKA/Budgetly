/**
 * Rule-based ATS scoring and matching algorithm
 */

/**
 * Calculate match percentage and ATS score
 */
export function calculateScore(resumeSkills, requiredSkills) {
  // Normalize skills for comparison
  const normalize = (skill) => skill.toLowerCase().trim();
  
  const resumeSkillsNormalized = resumeSkills.map(normalize);
  const requiredSkillsNormalized = requiredSkills.map(normalize);
  
  // Find matched skills
  const matchedSkills = requiredSkills.filter(skill =>
    resumeSkillsNormalized.includes(normalize(skill))
  );
  
  // Find missing skills
  const missingSkills = requiredSkills.filter(skill =>
    !resumeSkillsNormalized.includes(normalize(skill))
  );
  
  // Calculate match percentage
  const requiredCount = requiredSkills.length;
  const matchedCount = matchedSkills.length;
  
  const matchPercentage = requiredCount > 0
    ? Math.round((matchedCount / requiredCount) * 100)
    : 0;
  
  // Calculate skill match ratio
  const skillMatchRatio = requiredCount > 0 ? matchedCount / requiredCount : 0;
  
  // Calculate ATS Score
  const extraSkills = resumeSkills.filter(skill =>
    !requiredSkillsNormalized.includes(normalize(skill))
  ).length;
  
  // Bonus: 1% per extra skill, capped at 10%
  const bonus = Math.min(extraSkills * 1, 10);
  const atsScore = Math.min(matchPercentage + bonus, 100);
  
  return {
    matchPercentage,
    atsScore: Math.round(atsScore),
    missingSkills,
    matchedSkills,
    skillMatchRatio,
  };
}

/**
 * Validate scoring inputs
 */
export function validateScoringInputs(resumeSkills, requiredSkills) {
  if (!Array.isArray(resumeSkills) || !Array.isArray(requiredSkills)) {
    return { valid: false, error: 'Skills must be arrays' };
  }
  
  if (requiredSkills.length === 0) {
    return { valid: false, error: 'Job description must have at least one required skill' };
  }
  
  return { valid: true };
}

