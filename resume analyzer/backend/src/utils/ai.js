import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI feedback for resume improvement
 * This is ONLY used for suggestions, NOT for scoring
 */
export async function generateAIFeedback(resumeText, jobDescription, missingSkills, matchPercentage) {
  // If no API key, return null (graceful degradation)
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const prompt = `You are a professional resume reviewer. Analyze the following resume and job description, then provide constructive feedback.

RESUME TEXT:
${resumeText.substring(0, 3000)} ${resumeText.length > 3000 ? '...' : ''}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)} ${jobDescription.length > 2000 ? '...' : ''}

CURRENT MATCH: ${matchPercentage}%
MISSING SKILLS: ${missingSkills.join(', ') || 'None'}

Provide feedback in the following format:
1. **Overall Assessment**: Brief summary of resume quality
2. **Strengths**: What the resume does well
3. **Areas for Improvement**: Specific suggestions to improve match
4. **Missing Skills**: How to address the missing skills (if any)
5. **Actionable Tips**: 3-5 specific, actionable recommendations

Keep the feedback professional, constructive, and focused on improving ATS compatibility and match percentage. Limit response to 500 words.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume reviewer providing constructive feedback to help candidates improve their resumes for ATS systems and job matching.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const feedback = completion.choices[0]?.message?.content;
    return feedback || null;
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    
    // Handle specific error cases
    if (error.status === 429) {
      return 'AI feedback temporarily unavailable due to rate limits. Please try again later.';
    }
    
    if (error.status === 401) {
      return null; // Invalid API key, fail silently
    }
    
    // For other errors, return a generic message
    return 'AI feedback is currently unavailable. Please try again later.';
  }
}

/**
 * Timeout wrapper for AI calls
 */
export async function generateAIFeedbackWithTimeout(
  resumeText,
  jobDescription,
  missingSkills,
  matchPercentage,
  timeoutMs = 10000
) {
  return Promise.race([
    generateAIFeedback(resumeText, jobDescription, missingSkills, matchPercentage),
    new Promise((resolve) =>
      setTimeout(() => resolve('AI feedback request timed out. Please try again.'), timeoutMs)
    ),
  ]);
}

