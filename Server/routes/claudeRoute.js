
// import express from "express";
// import Chart from "../models/Chart.js";
// import { analyzeWithClaude } from "../services/claudeService.js";

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

//     const output_text = await analyzeWithClaude(fileData, fileName, usedPrompt);

//     const chart = new Chart({
//       client,
//       name: fileName,
//       content: usedPrompt,
//       pdfUrl: "",
//       llmSuggestions: { claude: output_text },
//       status: "completed",
//     });

//     await chart.save();

//     res.json({ success: true, chart });
//   } catch (err) {
//     console.error("🚨 Claude analyze error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// export default router;

import express from "express";
import Chart from "../models/Chart.js";
import { analyzeWithClaude } from "../services/claudeService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    console.log("📥 Claude request body keys:", Object.keys(req.body));
    const { fileData, fileName, prompt, client } = req.body;

    if (!fileData)
      return res.status(400).json({ success: false, error: "Missing file data." });
    if (!client)
      return res.status(400).json({ success: false, error: "Missing client ID." });

    const usedPrompt =
      prompt ||
      req.defaultPrompt ||
      "You are a medical coding assistant. Analyze this file and summarize key findings.";

    // 🔍 Analyze using Claude
    const output_text = await analyzeWithClaude(fileData, fileName, usedPrompt);

    // 💾 Save chart to MongoDB
    const chart = new Chart({
      client,
      name: fileName,
      content: usedPrompt,
      pdfUrl: "",
      llmSuggestions: { claude: output_text },
      status: "completed",
    });

    // await chart.save();

    // ✅ Return clean and uniform response
    res.json({
      success: true,
      output_text,
      chartId: chart._id,
      message: "Claude analysis completed and chart saved successfully.",
    });

  } catch (err) {
    console.error("🚨 Claude analyze error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
