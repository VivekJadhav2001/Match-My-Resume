
async function geminiResumeScore(jd, resumeData){

    //Prompt

    //Payload

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
        parts: [{ text: "Act like you are a FAANG ATC Checker." }],
      },
    }

    //Api URL

    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`


    //POST CALL


    //Extract Score From The Response

    //Send The Score to User
}


export {
    geminiResumeScore
}