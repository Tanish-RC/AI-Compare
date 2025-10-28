import express from "express";
import { analyzeWithClaude } from "../services/claudeService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) return res.status(400).json({ success: false, error: "Missing file data." });

    const output = await analyzeWithClaude(fileData, fileName, req.defaultPrompt);
    res.json({ success: true, output_text: output });
  } catch (err) {
    console.error("🚨 Claude Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
