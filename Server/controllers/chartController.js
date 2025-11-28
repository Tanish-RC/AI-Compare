// // 

// // controllers/chartController.js

// import Chart from "../models/Chart.js";

// /**
//  * -------------------------------------------------------
//  * CREATE CHART (UPLOAD ONLY — NO LLM)
//  * POST /api/charts/upload
//  * -------------------------------------------------------
//  */
// export const createEmptyChart = async (req, res) => {
//   try {
//     const { client, name, pdfUrl, content } = req.body;

//     if (!client) {
//       return res.status(400).json({ error: "Client ID is required" });
//     }
//     if (!name) {
//       return res.status(400).json({ error: "Chart name is required" });
//     }

//     const chart = new Chart({
//       client,
//       name,
//       pdfUrl: pdfUrl || null,
//       content: content || "",
//       llmResults: [],      // NEW STRUCTURE
//       llmSuggestions: {},  // legacy field kept empty
//       finalCptCodes: [],
//       finalIcdCodes: [],
//     });

//     await chart.save();

//     return res.json(chart);
//   } catch (err) {
//     console.error("Error creating chart (upload only):", err);
//     return res.status(500).json({ error: "Failed to create chart" });
//   }
// };



// /**
//  * -------------------------------------------------------
//  * UPDATE FINAL CODES
//  * -------------------------------------------------------
//  */
// export const updateFinalCodes = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { finalCptCodes, finalIcdCodes } = req.body;

//     if (!Array.isArray(finalCptCodes) || !Array.isArray(finalIcdCodes)) {
//       return res.status(400).json({
//         message: "finalCptCodes and finalIcdCodes must be arrays",
//       });
//     }

//     const updated = await Chart.findByIdAndUpdate(
//       id,
//       { finalCptCodes, finalIcdCodes },
//       { new: true, runValidators: true }
//     );

//     if (!updated) return res.status(404).json({ message: "Chart not found" });

//     return res.json({ success: true, chart: updated });
//   } catch (err) {
//     console.error("Error updating final codes:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


// controllers/chartController.js

// import Chart from "../models/Chart.js";
// import { analyzeWithOpenAI } from "../services/openaiService.js";
// import { analyzeWithClaude } from "../services/claudeService.js";
// import { analyzeWithGemini } from "../services/geminiService.js";
// import { cleanAndParseLLMJson } from "../utils/generateRunId.js";

// /**
//  * CREATE CHART (upload only)
//  */
// export const createEmptyChart = async (req, res) => {
//   try {
//     const { client, name, pdfUrl, content } = req.body;

//     if (!client) return res.status(400).json({ error: "Client ID is required" });
//     if (!name) return res.status(400).json({ error: "Chart name is required" });

//     const chart = new Chart({
//       client,
//       name,
//       pdfUrl: pdfUrl || null,
//       content: content || "",
//       llmResults: [],
//       llmSuggestions: {},
//       finalCptCodes: [],
//       finalIcdCodes: [],
//     });

//     await chart.save();
//     return res.json(chart);
//   } catch (err) {
//     console.error("Error creating chart:", err);
//     return res.status(500).json({ error: "Failed to create chart" });
//   }
// };

// /**
//  * UPDATE FINAL CODES
//  */
// export const updateFinalCodes = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { finalCptCodes, finalIcdCodes } = req.body;

//     if (!Array.isArray(finalCptCodes) || !Array.isArray(finalIcdCodes)) {
//       return res.status(400).json({
//         message: "finalCptCodes and finalIcdCodes must be arrays",
//       });
//     }

//     const updated = await Chart.findByIdAndUpdate(
//       id,
//       { finalCptCodes, finalIcdCodes },
//       { new: true, runValidators: true }
//     );

//     if (!updated) return res.status(404).json({ message: "Chart not found" });

//     return res.json({ success: true, chart: updated });
//   } catch (err) {
//     console.error("Error updating final codes:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// /**
//  * RUN LLM ON EXISTING CHART
//  * POST /api/charts/:id/run
//  */
// export const runLLMOnChart = async (req, res) => {
//   const start = Date.now();

//   try {
//     const { promptId, promptName, promptText, models = ["openai", "claude", "gemini"] } =
//       req.body;

//     if (!promptId || !promptName || !promptText) {
//       return res.status(400).json({
//         success: false,
//         error: "promptId, promptName, and promptText are required.",
//       });
//     }

//     const chart = await Chart.findById(req.params.id);
//     if (!chart) return res.status(404).json({ success: false, error: "Chart not found." });
//     if (!chart.pdfData)
//       return res.status(400).json({
//         success: false,
//         error: "Chart has no PDF uploaded.",
//       });

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

//     const llmResults = {};

//     if (models.includes("openai")) {
//   const raw = await analyzeWithOpenAI(pdfBase64, chart.name, cleanPrompt);
//   llmResults.openai = cleanAndParseLLMJson(raw);
// }

// if (models.includes("claude")) {
//   const raw = await analyzeWithClaude(pdfBase64, chart.name, cleanPrompt);
//   llmResults.claude = cleanAndParseLLMJson(raw);
// }

// if (models.includes("gemini")) {
//   const raw = await analyzeWithGemini(pdfBase64, chart.name, cleanPrompt);
//   llmResults.gemini = cleanAndParseLLMJson(raw);
// }

//     chart.llmResults.push({
//       promptId,
//       promptName,
//       timestamp: new Date().toISOString(),
//       llmSuggestions: {
//         openai: llmResults.openai || {},
//         claude: llmResults.claude || {},
//         gemini: llmResults.gemini || {},
//       },
//     });

//     await chart.save();

//     const duration = Date.now() - start;
//     console.log(`✨ runLLMOnChart finished in ${duration}ms`);

//     return res.json({
//       success: true,
//       chartId: chart._id,
//       llmSuggestions: llmResults,
//       promptId,
//     });
//   } catch (err) {
//     console.error("❌ Error running LLM:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };


import Chart from "../models/Chart.js";
import { analyzeWithOpenAI } from "../services/openaiService.js";
import { analyzeWithClaude } from "../services/claudeService.js";
import { analyzeWithGemini } from "../services/geminiService.js";
import { cleanAndParseLLMJson } from "../utils/generateRunId.js";

/**
 * SAFE WRAPPER:
 * Runs an LLM call and guarantees output no matter what.
 * Also returns error info when failures happen.
 */
async function safeLLMCall(fn, modelName, ...args) {
  try {
    const raw = await fn(...args);
    const parsed = cleanAndParseLLMJson(raw);
    return {
      success: true,
      error: null,
      data: parsed,
    };
  } catch (err) {
    console.error(`❌ ${modelName} failed:`, err.message);
    return {
      success: false,
      error: err.message,
      data: {
        CPT_Codes: [],
        ICD_Codes: [],
      },
    };
  }
}

/**
 * CREATE CHART (upload only)
 */
export const createEmptyChart = async (req, res) => {
  try {
    const { client, name, pdfUrl, content } = req.body;

    if (!client) return res.status(400).json({ error: "Client ID is required" });
    if (!name) return res.status(400).json({ error: "Chart name is required" });

    const chart = new Chart({
      client,
      name,
      pdfUrl: pdfUrl || null,
      content: content || "",
      llmResults: [],
      llmSuggestions: {},   // legacy, unused
      finalCptCodes: [],
      finalIcdCodes: [],
    });

    await chart.save();
    return res.json(chart);
  } catch (err) {
    console.error("Error creating chart:", err);
    return res.status(500).json({ error: "Failed to create chart" });
  }
};

/**
 * UPDATE FINAL CODES
 */
export const updateFinalCodes = async (req, res) => {
  try {
    const { id } = req.params;
    const { finalCptCodes, finalIcdCodes } = req.body;

    if (!Array.isArray(finalCptCodes) || !Array.isArray(finalIcdCodes)) {
      return res.status(400).json({
        message: "finalCptCodes and finalIcdCodes must be arrays",
      });
    }

    const updated = await Chart.findByIdAndUpdate(
      id,
      { finalCptCodes, finalIcdCodes },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Chart not found" });

    return res.json({ success: true, chart: updated });
  } catch (err) {
    console.error("Error updating final codes:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * RUN LLM ON EXISTING CHART
 * POST /api/charts/:id/run
 */
// export const runLLMOnChart = async (req, res) => {
//   const start = Date.now();

//   try {
//     const { promptId, promptName, promptText, models = ["openai", "claude", "gemini"] } =
//       req.body;

//     if (!promptId || !promptName || !promptText) {
//       return res.status(400).json({
//         success: false,
//         error: "promptId, promptName, and promptText are required.",
//       });
//     }

//     const chart = await Chart.findById(req.params.id);
//     if (!chart) return res.status(404).json({ success: false, error: "Chart not found." });
//     if (!chart.pdfData)
//       return res.status(400).json({
//         success: false,
//         error: "Chart has no PDF uploaded.",
//       });

//     const pdfBase64 = chart.pdfData.toString("base64");

//     const cleanPrompt = `
// ${promptText}


//     `.trim();

//     // ----------------------
//     // Run all LLMs safely
//     // ----------------------
//     const llmResults = {};
//     const llmErrors = {}; // NEW — record model-specific errors

//     if (models.includes("openai")) {
//       const result = await safeLLMCall(
//         analyzeWithOpenAI,
//         "openai",
//         pdfBase64,
//         chart.name,
//         cleanPrompt
//       );
//       llmResults.openai = result.data;
//       llmErrors.openai = result.error; // null if OK
//     }

//     if (models.includes("claude")) {
//       const result = await safeLLMCall(
//         analyzeWithClaude,
//         "claude",
//         pdfBase64,
//         chart.name,
//         cleanPrompt
//       );
//       llmResults.claude = result.data;
//       llmErrors.claude = result.error;
//     }

//     if (models.includes("gemini")) {
//       const result = await safeLLMCall(
//         analyzeWithGemini,
//         "gemini",
//         pdfBase64,
//         chart.name,
//         cleanPrompt
//       );
//       llmResults.gemini = result.data;
//       llmErrors.gemini = result.error;
//     }

//     // ----------------------
//     // Store results in DB
//     // ----------------------
//     chart.llmResults.push({
//       promptId,
//       promptName,
//       timestamp: new Date().toISOString(),
//       llmSuggestions: {
//         openai: llmResults.openai || { CPT_Codes: [], ICD_Codes: [] },
//         claude: llmResults.claude || { CPT_Codes: [], ICD_Codes: [] },
//         gemini: llmResults.gemini || { CPT_Codes: [], ICD_Codes: [] },
//       },
//       llmErrors, 
//     });

//     await chart.save();

//     const duration = Date.now() - start;
//     console.log(`✨ runLLMOnChart finished in ${duration}ms`);

//     return res.json({
//       success: true,
//       chartId: chart._id,
//       llmSuggestions: llmResults,
//       llmErrors, 
//       promptId,
//     });
//   } catch (err) {
//     console.error("❌ Error running LLM:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

export const runLLMOnChart = async (req, res) => {
  const start = Date.now();

  try {
    const { promptId, promptName, promptText, models = ["openai", "claude", "gemini"] } = req.body;

    if (!promptId || !promptName || !promptText) {
      return res.status(400).json({
        success: false,
        error: "promptId, promptName, and promptText are required.",
      });
    }

    const chart = await Chart.findById(req.params.id);
    if (!chart) return res.status(404).json({ success: false, error: "Chart not found." });
    if (!chart.pdfData) {
      return res.status(400).json({
        success: false,
        error: "Chart has no PDF uploaded.",
      });
    }

    const pdfBase64 = chart.pdfData.toString("base64");
    const cleanPrompt = `${promptText}`.trim();

    // ----------------------
    // Run all LLMs in parallel
    // ----------------------
    const llmCalls = [];

    if (models.includes("openai")) {
      llmCalls.push([
        "openai",
        safeLLMCall(analyzeWithOpenAI, "openai", pdfBase64, chart.name, cleanPrompt)
      ]);
    }

    if (models.includes("claude")) {
      llmCalls.push([
        "claude",
        safeLLMCall(analyzeWithClaude, "claude", pdfBase64, chart.name, cleanPrompt)
      ]);
    }

    if (models.includes("gemini")) {
      llmCalls.push([
        "gemini",
        safeLLMCall(analyzeWithGemini, "gemini", pdfBase64, chart.name, cleanPrompt)
      ]);
    }

    const promises = llmCalls.map(([_, p]) => p);
    const results = await Promise.all(promises);

    // Build result/error objects
    const llmResults = {};
    const llmErrors = {};

    results.forEach((result, i) => {
      const model = llmCalls[i][0];
      llmResults[model] = result.data || { CPT_Codes: [], ICD_Codes: [] };
      llmErrors[model] = result.error || null;
    });

    // ----------------------
    // Store results in DB
    // ----------------------
    chart.llmResults.push({
      promptId,
      promptName,
      timestamp: new Date().toISOString(),
      llmSuggestions: {
        openai: llmResults.openai || { CPT_Codes: [], ICD_Codes: [] },
        claude: llmResults.claude || { CPT_Codes: [], ICD_Codes: [] },
        gemini: llmResults.gemini || { CPT_Codes: [], ICD_Codes: [] },
      },
      llmErrors,
    });

    await chart.save();

    const duration = Date.now() - start;
    console.log(`✨ runLLMOnChart finished in ${duration}ms`);

    return res.json({
      success: true,
      chartId: chart._id,
      llmSuggestions: llmResults,
      llmErrors,
      promptId,
    });

  } catch (err) {
    console.error("❌ Error running LLM:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};




export const updateRunFinalCodes = async (req, res) => {
  try {
    const { chartId, runId } = req.params;
    const { finalCptCodes = [], finalIcdCodes = [] } = req.body;

    if (!Array.isArray(finalCptCodes) || !Array.isArray(finalIcdCodes)) {
      return res.status(400).json({ success: false, error: "finalCptCodes and finalIcdCodes must be arrays" });
    }

    const result = await Chart.updateOne(
      { _id: chartId, "llmResults._id": runId },
      {
        $set: {
          "llmResults.$.finalCptCodes": finalCptCodes,
          "llmResults.$.finalIcdCodes": finalIcdCodes,
        },
      }
    );

    if (!result.matchedCount && !result.n) { // support both older/newer mongoose shapes
      return res.status(404).json({ success: false, error: "Run not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("updateRunFinalCodes error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
