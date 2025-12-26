/**
 * Predefined skills list for rule-based extraction
 */
export const SKILLS_LIST = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
  'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell', 'Elixir', 'Clojure',
  
  // Web Technologies
  'HTML', 'CSS', 'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Next.js', 'Nuxt.js',
  'Django', 'Flask', 'FastAPI', 'Spring', 'ASP.NET', 'Laravel', 'Symfony', 'Rails',
  
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB',
  'SQLite', 'Oracle', 'SQL Server', 'Firebase', 'Supabase',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD',
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Linux', 'Bash', 'Shell Scripting',
  
  // Frontend Tools
  'Webpack', 'Vite', 'Babel', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap', 'Material-UI',
  'Redux', 'MobX', 'Zustand', 'GraphQL', 'REST API', 'Apollo',
  
  // Mobile
  'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Android', 'iOS',
  
  // Data Science & ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas',
  'NumPy', 'Jupyter', 'Data Analysis', 'Data Visualization', 'Tableau', 'Power BI',
  
  // Testing
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'JUnit', 'Pytest', 'Testing',
  
  // Other
  'Microservices', 'API Development', 'System Design', 'Agile', 'Scrum', 'DevOps',
  'Security', 'Authentication', 'Authorization', 'OAuth', 'JWT', 'Blockchain',
  'Web3', 'Solidity', 'Smart Contracts', 'NFT', 'Cryptocurrency',
];

/**
 * Normalize skill name for matching
 */
export function normalizeSkill(skill) {
  return skill.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

/**
 * Extract skills from text using rule-based keyword matching
 */
export function extractSkills(text) {
  const normalizedText = normalizeSkill(text);
  const foundSkills = [];
  const foundSkillsLower = new Set();

  for (const skill of SKILLS_LIST) {
    const normalizedSkill = normalizeSkill(skill);
    const regex = new RegExp(`\\b${normalizedSkill.replace(/\s+/g, '\\s+')}\\b`, 'i');
    
    if (regex.test(normalizedText) && !foundSkillsLower.has(normalizedSkill)) {
      foundSkills.push(skill);
      foundSkillsLower.add(normalizedSkill);
    }
  }

  return foundSkills;
}

/**
 * Extract skills from job description
 */
export function extractSkillsFromJD(jobDescription) {
  return extractSkills(jobDescription);
}

