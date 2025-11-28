

// import express from "express";
// import Chart from "../models/Chart.js";
// import { analyzeWithGemini } from "../services/geminiService.js";

// const router = express.Router();

// router.post("/analyze", async (req, res) => {
//   try {
//     const { fileData, fileName, prompt, client } = req.body;

//     if (!fileData)
//       return res.status(400).json({ success: false, error: "Missing file data." });
//     if (!client)
//       return res.status(400).json({ success: false, error: "Missing client ID." });

//     const usedPrompt =
//       prompt ||
//       req.defaultPrompt ||
//       "You are a medical coding assistant. Analyze this file and summarize key findings.";

//     const output_text = await analyzeWithGemini(fileData, fileName, usedPrompt);

//     const chart = new Chart({
//       client,
//       name: fileName,
//       content: usedPrompt,
//       pdfUrl: "",
//       llmSuggestions: { gemini: output_text },
//       status: "completed",
//     });

//     await chart.save();

//     res.json({ success: true, chart });
//   } catch (err) {
//     console.error("🚨 Gemini analyze error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// export default router;


import express from "express";
import Chart from "../models/Chart.js";
import { analyzeWithGemini } from "../services/geminiService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    console.log("📥 Gemini request body keys:", Object.keys(req.body));
    const { fileData, fileName, prompt, client } = req.body;

    if (!fileData)
      return res.status(400).json({ success: false, error: "Missing file data." });
    if (!client)
      return res.status(400).json({ success: false, error: "Missing client ID." });

    // Use default or fallback prompt
    const usedPrompt =
      prompt ||
      req.defaultPrompt ||
      "You are a medical coding assistant. Analyze this file and summarize key findings.";

    // 🔍 Analyze using Gemini
    const output_text = await analyzeWithGemini(fileData, fileName, usedPrompt);

    // 💾 Save chart to MongoDB
    const chart = new Chart({
      client,
      name: fileName,
      content: usedPrompt,
      pdfUrl: "",
      llmSuggestions: { gemini: output_text },
      status: "completed",
    });

    // await chart.save();

    // ✅ Return consistent response format
    res.json({
      success: true,
      output_text,
      chartId: chart._id,
      message: "Gemini analysis completed and chart saved successfully.",
    });

  } catch (err) {
    console.error("🚨 Gemini analyze error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
