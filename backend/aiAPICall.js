import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function groqResumeScore(jd, resume) {
const prompt = `
You are a Career Coach and Resume Optimizer. Your goal is to provide an ENCOURAGING and HOLISTIC evaluation of this Resume against the Job Description.

### SCORING PHILOSOPHY:
- **Be Generous:** If a candidate has the foundation (e.g., knows Javascript), assume they can easily learn related tools (e.g., React or Vue). 
- **Value Synonyms:** Treat "Team Lead" same as "Management", or "Frontend" same as "UI Development".
- **The 55% Floor:** Unless the resume is completely irrelevant (e.g., a Chef applying for a C++ role), the score should generally be 55% or higher to reflect the candidate's potential.
- **Context over Keywords:** Look at the "impact" of their work, not just a checklist of words.

### TASK:
1. Calculate a "Match Score" (0-100). For any candidate with relevant industry experience, aim for a score between 60% and 85%.
2. Identify 3-5 "Missing Keywords" that would specifically help them rank even higher.

RETURN ONLY JSON:
{
  "score": number,
  "missingKeywords": ["keyword1", "keyword2"],
  "encouragement": "A one-sentence positive note about their strongest asset."
}

Job Description:
${jd.slice(0, 3000)}

Resume:
${resume.slice(0, 8000)}
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data.choices[0].message.content;

    console.log("RAW GROQ:", text);

    // 🔥 CLEAN RESPONSE
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.log("JSON FAILED, fallback parsing");

      const scoreMatch = text.match(/score[:\s]*([0-9]+)/i);
      const keywordsMatch = text.match(/missing.*?:([\s\S]*)/i);

      result = {
        score: scoreMatch ? Number(scoreMatch[1]) : 0,
        missingKeywords: keywordsMatch
          ? keywordsMatch[1]
              .split(/,|\n/)
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
      };
    }

    return result;

  } catch (err) {
    console.log("GROQ ERROR ❌", err.response?.data || err.message);

    return {
      score: 0,
      missingKeywords: [],
    };
  }
}

export { groqResumeScore };