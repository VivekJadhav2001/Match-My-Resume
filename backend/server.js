import express from "express"
import cors from "cors"
import multer from "multer"

const PORT = 3000
const app = express()

app.use(cors({
    origin:"*",
    methods:["POST","GET","PATCH","PUT","DELETE"]
}))

// multer setup
const upload = multer({ storage: multer.memoryStorage() })

app.post("/getResumeScore", upload.single("resume"), async (req,res)=>{

    const jd = req.body.jd
    const resumeBuffer = req.file.buffer

    const base64Resume = resumeBuffer.toString("base64")
    const encryptedString = btoa(base64Resume)
    const decryptedString = atob(encryptedString)

    console.log(base64Resume.substring(0,100))
    // console.log(normalText,"NORMAL RESUME STRING")
    // console.log(decryptedString,"DECRYPTED")

    res.status(200).json({
        message:"converted",
        resumeBase64: base64Resume
    })
})

app.listen(PORT,()=>console.log("SERVER RUNNING ON 3000"))