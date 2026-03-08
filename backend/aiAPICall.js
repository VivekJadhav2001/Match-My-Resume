import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function groqResumeScore(jd, resume) {
  const prompt = `
You are an ATS resume analyzer.

Compare the Job Description and Resume.

Steps:
1. Extract important technical keywords from the Job Description.
2. Check which keywords are missing in the Resume.
3. Calculate an ATS match score (0-100).

Return ONLY valid JSON in this format:

{
"score": number,
"missingKeywords": ["keyword1","keyword2","keyword3"]
}

Rules:
- Score must be integer between 0-100
- missingKeywords must contain only skills/tools
- Max 10 keywords
- No explanations

Job Description:
${jd}

Resume:
${resume}
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const text = response.data.choices[0].message.content;

    const json = JSON.parse(text);

    return json;
  } catch (err) {
    console.log("GROQ ERROR", err.response?.data);

    return {
      score: 0,
      missingKeywords: [],
    };
  }
}

export { groqResumeScore };
