


// import express from "express";
// import mongoose from "mongoose";
// import multer from "multer";
// import {
//   createEmptyChart,
//   updateFinalCodes,
// } from "../../controllers/chartController.js";
// import Chart from "../../models/Chart.js";

// const router = express.Router();
// const upload = multer(); // memory storage



// /**
//  * -------------------------------------------------------
//  * NEW: UPLOAD CHART WITHOUT LLM
//  * POST /api/charts/upload
//  * -------------------------------------------------------
//  */
// router.post("/upload", createEmptyChart);



// /**
//  * GET /api/charts/client/:clientId
//  * Fetch all charts for a client
//  */
// router.get("/client/:clientId", async (req, res) => {
//   try {
//     const { clientId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(clientId)) {
//       return res.status(400).json({ error: "Invalid client ID" });
//     }

//     const charts = await Chart.find({ client: clientId })
//       .populate("client", "name contactEmail")
//       .sort({ createdAt: -1 });

//     res.json(charts);
//   } catch (err) {
//     console.error("Error fetching client charts:", err);
//     res.status(500).json({ error: "Failed to fetch charts" });
//   }
// });



// /**
//  * GET /api/charts/:chartId
//  */
// router.get("/:chartId", async (req, res) => {
//   try {
//     const chart = await Chart.findById(req.params.chartId).populate(
//       "client",
//       "name contactEmail"
//     );

//     if (!chart) {
//       return res.status(404).json({ error: "Chart not found" });
//     }

//     res.json(chart);
//   } catch (err) {
//     console.error("Error fetching chart:", err);
//     res.status(500).json({ error: "Failed to fetch chart" });
//   }
// });



// /**
//  * LEGACY LLM SAVE CALL (kept untouched)
//  * POST /api/charts
//  */
// router.post("/", async (req, res) => {
//   try {
//     const { _id, client, name, pdfUrl, content, llmSuggestions } = req.body;

//     if (!client) {
//       return res.status(400).json({ error: "Client ID is required" });
//     }

//     let chart;

//     if (_id) {
//       chart = await Chart.findByIdAndUpdate(
//         _id,
//         { $set: { client, name, pdfUrl, content, llmSuggestions } },
//         { new: true }
//       );
//     } else {
//       chart = new Chart({ client, name, pdfUrl, content, llmSuggestions });
//       await chart.save();
//     }

//     res.json(chart);
//   } catch (err) {
//     console.error("Error saving chart:", err);
//     res.status(500).json({ error: "Failed to save chart" });
//   }
// });



// /**
//  * FINAL CODES
//  */
// router.put("/:id/final-codes", updateFinalCodes);



// /**
//  * PUT /api/charts/:id/pdf
//  * Upload PDF bytes
//  */
// router.put("/:id/pdf", upload.single("pdf"), async (req, res) => {
//   try {
//     const chart = await Chart.findById(req.params.id);
//     if (!chart) return res.status(404).json({ message: "Chart not found" });

//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     chart.pdfData = req.file.buffer;
//     chart.pdfContentType = req.file.mimetype || "application/pdf";
//     await chart.save();

//     res.json({ message: "PDF uploaded successfully" });
//   } catch (error) {
//     console.error("Error uploading PDF:", error);
//     res.status(500).json({ message: "Failed to upload PDF" });
//   }
// });



// /**
//  * GET /api/charts/:id/pdf
//  */
// router.get("/:id/pdf", async (req, res) => {
//   try {
//     const chart = await Chart.findById(req.params.id).select(
//       "pdfData pdfContentType"
//     );
//     if (!chart || !chart.pdfData) {
//       return res.status(404).json({ message: "No stored PDF found" });
//     }

//     res.contentType(chart.pdfContentType || "application/pdf");
//     res.send(chart.pdfData);
//   } catch (error) {
//     console.error("Error fetching PDF:", error);
//     res.status(500).json({ message: "Failed to fetch PDF" });
//   }
// });

// export default router;


// /**
//  * @route POST /api/charts/upload
//  * @desc Upload-only: create chart without LLM data
//  */
// router.post("/upload", async (req, res) => {
//   try {
//     const { client, name, pdfUrl, content } = req.body;

//     if (!client || !name) {
//       return res.status(400).json({ error: "client and name are required" });
//     }

//     const chart = new Chart({
//       client,
//       name,
//       pdfUrl: pdfUrl || null,
//       content: content || "",
//       llmResults: [],              // always empty on upload-only
//       finalCptCodes: [],           // required by schema
//       finalIcdCodes: [],           // required by schema
//     });

//     await chart.save();
//     res.json(chart);

//   } catch (err) {
//     console.error("❌ Upload-only chart creation error:", err);
//     res.status(500).json({ error: "Failed to create chart" });
//   }
// });



// /**
//  * -------------------------------------------------------
//  * RUN LLM ON EXISTING CHART
//  * POST /api/charts/:id/run
//  * -------------------------------------------------------
//  */
// router.post("/:id/run", async (req, res) => {
//   const startTime = Date.now();
//   try {
//     const { promptId, promptName, promptText, models = ["openai", "claude", "gemini"] } = req.body;

//     if (!promptId || !promptName || !promptText) {
//       return res.status(400).json({
//         success: false,
//         error: "promptId, promptName, and promptText are required.",
//       });
//     }

//     const chart = await Chart.findById(req.params.id);
//     if (!chart) {
//       return res.status(404).json({ success: false, error: "Chart not found." });
//     }

//     if (!chart.pdfData) {
//       return res.status(400).json({
//         success: false,
//         error: "Chart has no PDF data. Upload PDF before running LLM.",
//       });
//     }

//     // Convert stored PDF buffer → base64
//     const pdfBase64 = chart.pdfData.toString("base64");

//     const cleanPrompt = `
// ${promptText}

// IMPORTANT:
// Return ONLY VALID JSON with this structure:

// {
//   "CPT_Codes": [...],
//   "ICD_Codes": [...]
// }

// No markdown. No explanation. No text outside JSON.
//     `.trim();

//     // Dynamically decide which LLMs to run
//     const llmResults = {};

//     if (models.includes("openai")) {
//       llmResults.openai = await analyzeWithOpenAI(pdfBase64, chart.name, cleanPrompt);
//     }

//     if (models.includes("claude")) {
//       llmResults.claude = await analyzeWithClaude(pdfBase64, chart.name, cleanPrompt);
//     }

//     if (models.includes("gemini")) {
//       llmResults.gemini = await analyzeWithGemini(pdfBase64, chart.name, cleanPrompt);
//     }

//     // Save result in chart.llmResults array
//     chart.llmResults.push({
//       promptId,
//       promptName,
//       llmSuggestions: {
//         openai: llmResults.openai || {},
//         claude: llmResults.claude || {},
//         gemini: llmResults.gemini || {},
//       },
//     });

//     await chart.save();

//     const durationMs = Date.now() - startTime;
//     console.log(`✨ LLM run completed in ${durationMs}ms → Chart ${chart._id}`);

//     return res.json({
//       success: true,
//       chartId: chart._id,
//       promptId,
//       llmSuggestions: llmResults,
//     });

//   } catch (err) {
//     console.error("❌ Error during run:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });


import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {
  createEmptyChart,
  updateFinalCodes,
  runLLMOnChart,
  updateRunFinalCodes,
} from "../../controllers/chartController.js";

import Chart from "../../models/Chart.js";

const router = express.Router();
const upload = multer();

router.put("/:chartId/runs/:runId/final-codes", updateRunFinalCodes);
/* UPLOAD (NO LLM) */
router.post("/upload", createEmptyChart);

/* GET CHARTS FOR CLIENT */
router.get("/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    const charts = await Chart.find({ client: clientId })
      .populate("client", "name contactEmail")
      .sort({ createdAt: -1 });

    res.json(charts);
  } catch (err) {
    console.error("Error fetching client charts:", err);
    res.status(500).json({ error: "Failed to fetch charts" });
  }
});

/* GET ONE CHART */
router.get("/:chartId", async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.chartId).populate(
      "client",
      "name contactEmail"
    );

    if (!chart) return res.status(404).json({ error: "Chart not found" });

    res.json(chart);
  } catch (err) {
    console.error("Error fetching chart:", err);
    res.status(500).json({ error: "Failed to fetch chart" });
  }
});

/* LEGACY SAVE */
router.post("/", async (req, res) => {
  try {
    const { _id, client, name, pdfUrl, content, llmSuggestions } = req.body;

    if (!client) return res.status(400).json({ error: "Client ID is required" });

    let chart;

    if (_id) {
      chart = await Chart.findByIdAndUpdate(
        _id,
        { $set: { client, name, pdfUrl, content, llmSuggestions } },
        { new: true }
      );
    } else {
      chart = new Chart({ client, name, pdfUrl, content, llmSuggestions });
      await chart.save();
    }

    res.json(chart);
  } catch (err) {
    console.error("Error saving chart:", err);
    res.status(500).json({ error: "Failed to save chart" });
  }
});

/* UPDATE FINAL CODES */
router.put("/:id/final-codes", updateFinalCodes);

/* PDF UPLOAD */
router.put("/:id/pdf", upload.single("pdf"), async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.id);
    if (!chart) return res.status(404).json({ message: "Chart not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    chart.pdfData = req.file.buffer;
    chart.pdfContentType = req.file.mimetype || "application/pdf";
    await chart.save();

    res.json({ message: "PDF uploaded successfully" });
  } catch (err) {
    console.error("Error uploading PDF:", err);
    res.status(500).json({ message: "Failed to upload PDF" });
  }
});

/* GET PDF */
router.get("/:id/pdf", async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.id).select(
      "pdfData pdfContentType"
    );

    if (!chart || !chart.pdfData)
      return res.status(404).json({ message: "No stored PDF found" });

    res.contentType(chart.pdfContentType || "application/pdf");
    res.send(chart.pdfData);
  } catch (err) {
    console.error("Error fetching PDF:", err);
    res.status(500).json({ message: "Failed to fetch PDF" });
  }
});

/* RUN LLM */
router.post("/:id/run", runLLMOnChart);



export default router;
