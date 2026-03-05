import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { geminiResumeScore } from "./aiAPICall.js";
import dotenv from "dotenv"
const PORT = 3000;
const app = express();

dotenv.config()

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
  }),
);

// multer setup
const upload = multer({ storage: multer.memoryStorage() });

app.post("/getResumeScore", upload.single("resume"), async (req, res) => {
  const jd = req.body.jd;
  const resumeBuffer = req.file.buffer;
//   console.log(resumeBuffer, "RESUME BUFFER");

  const parser = new PDFParse({ data: resumeBuffer });

  const normalText = await parser.getText();
  // const normalText = await pdf(resumeBuffer)

//   console.log(normalText, "NORMAL TEXT");

  const score = await geminiResumeScore(jd,normalText)

  console.log(score,"Score of my Resume")

  const base64Resume = resumeBuffer.toString("base64");


  res.status(200).json({
    message: "converted",
    resumeBase64: base64Resume,
  });
});

app.listen(PORT, () => console.log("SERVER RUNNING ON 3000"));




/*


const base64Resume = resumeBuffer.toString("base64");

  //converting to base64
  const originalBuffer = Buffer.from(base64Resume, "base64");

  // console.log(base64Resume.substring(0,100),"BASE64 STRING")
  // console.log(normalText,"NORMAL RESUME STRING")

  // console.log(originalBuffer,"ORIGINAL TEXT!!!")
  const decoder = new TextDecoder("utf-8");
  const originalText = decoder.decode(originalBuffer);

  // console.log(originalText,"ORIGINAL TEXT")*/