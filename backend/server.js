require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/stream-summarize", async (req, res) => {
  try {
    const { text } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a resume analyzer.

Return JSON with:
- summary
- skills
- experience_level
- score (0-100 based on quality)

Resume:
"""${text}"""
`;

    const result = await model.generateContentStream(prompt);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    let fullResponse = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();

      fullResponse += chunkText;   // Save complete response
      res.write(chunkText);        // Send to frontend
    }

    // Try to parse the JSON response
    let score = null;

    try {
     const cleanResponse = fullResponse
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const parsed = JSON.parse(cleanResponse);
      score = parsed.score;
    } catch (e) {
      console.log("Response is not valid JSON");
    }

    const Resume = require("./models/Resume");

    await Resume.create({
      resume: text,
      analysis: fullResponse,
      score: score,
    });

    res.end();

  } catch (err) {
  console.error(err);

  if (!res.headersSent) {
    return res.status(500).json({
      error: err.message,
    });
  }

  res.end();
}
});

const connectDB = require("./config/db");

connectDB();

app.listen(5000, () => {
  console.log("Server running on 5000");
});