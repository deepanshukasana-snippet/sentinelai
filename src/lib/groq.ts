import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export const groq = new Groq({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true // Web client usage constraint
});

export async function analyzePassword(password: string) {
  if (!password) return null;
  
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a cybersecurity expert analyzing password strength. Respond in STRICT JSON format with {"strength": "Weak"|"Medium"|"Strong", "crackTime": "string estimation", "score": number 0-100, "suggestions": ["array of short actionable tips"]}. Do not include markdown formatting or extra text, just the raw JSON.'
        },
        {
          role: 'user',
          content: `Analyze this password: ${password}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error analyzing password with Groq:", error);
    return null;
  }
}

export async function generateSecurityInsights(passwords: {website: string, strength: string}[]) {
  if (!passwords || passwords.length === 0) return null;
  
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a cybersecurity expert analyzing a user\'s password vault. Responding ONLY in valid JSON. Format: {"assessment": "2-3 sentences of overall security health assessment", "recommendations": ["short actionable tip 1", "short actionable tip 2", "short actionable tip 3"]}'
        },
        {
          role: 'user',
          content: `Here is the user's vault summary (website and strength): ${JSON.stringify(passwords)}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error generating insights with Groq:", error);
    return null;
  }
}
