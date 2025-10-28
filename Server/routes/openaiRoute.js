import express from "express";
import { analyzeWithOpenAI } from "../services/openaiService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) return res.status(400).json({ success: false, error: "Missing file data." });

    const output = await analyzeWithOpenAI(fileData, fileName, req.defaultPrompt);
    res.json({ success: true, output_text: output });
  } catch (err) {
    console.error("🚨 OpenAI Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
