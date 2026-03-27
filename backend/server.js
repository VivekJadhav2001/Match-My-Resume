import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { groqResumeScore } from "./aiAPICall.js";
import dotenv from "dotenv";

const PORT = 3000;
const app = express();

dotenv.config();

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
  })
);

const upload = multer({ storage: multer.memoryStorage() });

app.post("/getResumeScore", upload.single("resume"), async (req, res) => {
  try {
    console.log("API HIT ✅");

    const jd = req.body.jd;

    if (!req.file) {
      return res.status(400).json({
        score: 0,
        missingKeywords: [],
      });
    }

    const resumeBuffer = req.file.buffer;

    const parser = new PDFParse({ data: resumeBuffer });
    const parsed = await parser.getText();

    const normalText = parsed.text;

    if (!normalText) {
      console.log("PDF PARSE FAILED ❌");

      return res.status(200).json({
        score: 0,
        missingKeywords: [],
      });
    }

    // 🔥 CALL GROQ
    const result = await groqResumeScore(jd, normalText);

    console.log(result, "Score of my Resume");

    // ✅ RETURN CORRECT FORMAT
    res.status(200).json({
      score: result.score || 0,
      missingKeywords: result.missingKeywords || [],
    });

  } catch (error) {
    console.log("SERVER ERROR ❌", error);

    res.status(500).json({
      score: 0,
      missingKeywords: [],
    });
  }
});

app.listen(PORT, () => console.log("SERVER RUNNING ON 3000 🚀"));