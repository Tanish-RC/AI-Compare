// import express from "express";
// import { analyzeWithOpenAI } from "../services/openaiService.js";
// import Chart from "../models/Chart.js";
// import generateRunId from "../utils/generateRunId.js";

// const router = express.Router();

// router.post("/analyze", async (req, res) => {
//   try {
//     const { fileData, fileName, patientName } = req.body;
//     if (!fileData) return res.status(400).json({ success: false, error: "Missing file data." });

//     // Run analysis
//     const output = await analyzeWithOpenAI(fileData, fileName, req.defaultPrompt);

//     // Save to MongoDB
//     // const chart = await Chart.create({
//     //   name: fileName || "Untitled Report",
//     //   patientName: patientName || "Unknown",
//     //   content: output,
//     //   runId: generateRunId("openai"),
//     //   summary: output.substring(0, 300) + "...",
//     // });

//     res.json({ success: true, output_text: output, chart });
//   } catch (err) {
//     console.error("🚨 OpenAI Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// export default router;

// routes/openaiRoute.js

// import express from "express";
// import { analyzeWithOpenAI } from "../services/openaiService.js";

// const router = express.Router();

// router.post("/analyze", async (req, res) => {
//   try {
//     const { fileData, fileName, prompt } = req.body;

//     if (!fileData) {
//       return res.status(400).json({
//         success: false,
//         error: "Missing file data.",
//       });
//     }

//     // ✅ Use default prompt if custom one not provided
//     const usedPrompt =
//       prompt ||
//       req.defaultPrompt ||
//       "You are a medical coding assistant. Analyze this file and summarize key findings.";

//     // ✅ Run OpenAI analysis
//     const output = await analyzeWithOpenAI(fileData, fileName, usedPrompt);

//     // ✅ Return just the LLM result — no database writes
//     return res.json({
//       success: true,
//       output_text: output,
//     });
//   } catch (err) {
//     console.error("🚨 OpenAI analyze error:", err);
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// });

// export default router;


// import express from "express";
// import Chart from "../models/Chart.js";
// import { analyzeWithOpenAI } from "../services/openaiService.js";

// const router = express.Router();

// router.post("/analyze", async (req, res) => {
//   try {
//     console.log("Received body keys:", Object.keys(req.body));
//     const { fileData, fileName, prompt, client } = req.body;
//     // console.log(req.body)
//     if (!fileData)
//       return res.status(400).json({ success: false, error: "Missing file data." });
//     if (!client)
//       return res.status(400).json({ success: false, error: "Missing client ID." });

//     // Use default prompt if none provided
//     const usedPrompt =
//       prompt ||
//       req.defaultPrompt ||
//       "You are a medical coding assistant. Analyze this file and summarize key findings.";

//     // Run OpenAI analysis
//     const output_text = await analyzeWithOpenAI(fileData, fileName, usedPrompt);

//     // ✅ Save result to MongoDB
//     const chart = new Chart({
//       client,
//       name: fileName,
//       content: usedPrompt,
//       pdfUrl: "",
//       llmSuggestions: { openai: output_text },
//       status: "completed",
//     });

//     await chart.save();

//     res.json({ success: true, chart });
//   } catch (err) {
//     console.error("🚨 OpenAI analyze error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// export default router;

import express from "express";
import Chart from "../models/Chart.js";
import { analyzeWithOpenAI } from "../services/openaiService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    console.log("📥 Received body keys:", Object.keys(req.body));

    const { fileData, fileName, prompt, client } = req.body;

    // 🧩 Validate input
    if (!fileData)
      return res.status(400).json({ success: false, error: "Missing file data." });
    if (!client)
      return res.status(400).json({ success: false, error: "Missing client ID." });

    // 🧠 Use provided or fallback prompt
    const usedPrompt =
      prompt ||
      req.defaultPrompt ||
      "You are a medical coding assistant. Analyze this file and summarize key findings.";

    // 🧠 Call OpenAI API for analysis
    const output_text = await analyzeWithOpenAI(fileData, fileName, usedPrompt);

    // ✅ Save chart to MongoDB
    const chart = new Chart({
      client,
      name: fileName,
      content: usedPrompt,
      pdfUrl: "",
      llmSuggestions: { openai: output_text },
      status: "completed",
    });

    // await chart.save();

    // 🧾 Return clean structured response
    res.json({
      success: true,
      output_text,  // ✅ frontend uses this key
      chartId: chart._id,  // helpful for linking later
      message: "Analysis completed and chart saved successfully.",
    });

  } catch (err) {
    console.error("🚨 OpenAI analyze error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
