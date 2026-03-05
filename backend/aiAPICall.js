import axios from "axios"

async function geminiResumeScore(jd, resumeData){

    const prompt = `
Compare the Resume and Job Description.

Return ONLY a number from 0-100 representing ATS match score.

Job Description:
${jd}

Resume:
${resumeData}
`

    const payload = {
        contents:[
            {
                parts:[{ text: prompt }]
            }
        ]
    }

    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

    try{

        const response = await axios.post(URL,payload)

        const text = response.data.candidates[0].content.parts[0].text

        const score = Number(text.match(/\d+/)[0])

        return score

    }catch(err){

        console.log("Gemini Error",err.response?.data)

        return null
    }

}

export {geminiResumeScore}