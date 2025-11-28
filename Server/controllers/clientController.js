// controllers/clientController.js
import mongoose from "mongoose";
import Client from "../models/Client.js";

// ⭐ Your default prompt text
// const DEFAULT_PROMPT_TEXT = `

// `;

const DEFAULT_PROMPT_TEXT = [
  "You are a certified professional medical coder reviewing a clinical chart document.",
  "",
  "The attached file is a Base64-encoded PDF chart.",
  "Your first step is to decode the Base64 content, extract the readable chart text, and then analyze the decoded content carefully.",
  "",
  "---",
  "",
  "OBJECTIVE",
  "Extract all CPT codes, Modifiers (MODs), and ICD-10 diagnosis codes that are either:",
  "- Explicitly documented in the chart, OR",
  "- Confidently inferable based on your expert judgment, NCCI, CMS, CLIA, MUE, and CPT guidelines.",
  "",
  "Your analysis should reflect how a certified coder would code a real chart — not only copying what is written but applying clinical reasoning, coding hierarchy, and compliance standards.",
  "",
  "---",
  "",
  "REQUIRED GUIDELINES",
  "While analyzing, ensure compliance with:",
  "- NCCI (National Correct Coding Initiative) for modifier use, bundling edits, and code pair restrictions.",
  "- CMS (Centers for Medicare & Medicaid Services) coding and documentation rules.",
  "- CLIA Waiver Requirements — verify if any lab CPTs qualify for CLIA-waived status; include appropriate modifiers if applicable.",
  "- MUE (Medically Unlikely Edits) — do not suggest quantities beyond CMS-permitted limits.",
  "- CPT Laterality Modifiers — use appropriate laterality or anatomical modifiers (e.g., LT, RT, 50) where context supports them.",
  "",
  "---",
  "",
  "CODING LOGIC",
  "",
  "CPT CODES",
  "For each CPT:",
  "- Derive codes that correspond to performed, ordered, or documented services.",
  "- Suggest Modifiers based on compliant reasoning (e.g., 25, 59, XU, LT, RT, 26, TC).",
  "- If CPT codes are implied but not stated, infer them confidently from clinical documentation.",
  "",
  "Each CPT entry must include:",
  "- code: CPT code.",
  "- modifiers: An array of applicable modifiers.",
  "- reasoning: Concise explanation.",
  "- audit_trail: A verbatim excerpt from the chart that supports the code.",
  "",
  "ICD-10 CODES",
  "For each ICD:",
  "- Include all relevant diagnoses inferred from assessment, plan, or clinical context.",
  "- Base code selection on clinical reasoning.",
  "",
  "Each ICD entry must include:",
  "- code: ICD-10 code.",
  "- reasoning: Why this diagnosis applies.",
  "- audit_trail: Supporting phrase or sentence.",
  "",
  "---",
  "",
  "OUTPUT FORMAT (MANDATORY)",
  "Output ONLY valid JSON.",
  "Structure must be:",
  "{",
  '  "CPT_Codes": [...],',
  '  "ICD_Codes": [...]',
  "}",
  "",
  "If no codes found:",
  "{",
  '  "CPT_Codes": [],',
  '  "ICD_Codes": []',
  "}",
  "",
  "---",
  "",
  "OUTPUT VALIDATION",
  "- Validate final JSON using JSON.parse.",
  "- Auto-correct formatting issues.",
  "",
  "---",
  "",
  "OUTPUT SANITIZATION",
  "- Escape all quotes.",
  "- Represent line breaks as \\n.",
  "- No markdown.",
  "- Output only JSON.",
  "",
  "---",
  "",
  "ADDITIONAL RULES",
  "- Do not hallucinate.",
  "- Infer codes only when clinically justified.",
  "- Follow HIPAA compliance.",
  "",
  "---",
  "",
  "ADDENDUM: E/M OUTPATIENT VISIT LOGIC",
  "If the chart is an office/outpatient encounter:",
  "- Apply 99202–99205 and 99211–99215 logic.",
  "- Use MDM or Time, whichever is higher.",
  "- Apply modifier 95 for telehealth.",
  "- Apply modifier 25 for significant separately identifiable E/M with procedure.",
  "- Only one E/M code per encounter.",
  "",
  "Embed the justification inside the reasoning for the CPT code."
].join("\n");


export const createClient = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Client name is required." });
    }

    // ⭐ Create default prompt object
    const defaultPrompt = {
      promptId: new mongoose.Types.ObjectId(),
      promptName: "Default Prompt",
      promptText: DEFAULT_PROMPT_TEXT,
    };

    // ⭐ Create client with default prompt
    const newClient = new Client({
      name,
      prompts: [defaultPrompt],
      totalRuns: 0,
      lastRunTime: null,
    });

    await newClient.save();

    return res.status(201).json(newClient);
  } catch (err) {
    console.error("❌ Error creating client:", err);
    return res.status(500).json({ error: "Failed to create client." });
  }
};

export const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    return res.json(client);
  } catch (err) {
    console.error("❌ Error fetching client:", err);
    return res.status(500).json({ error: "Failed to fetch client" });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    return res.json(clients);
  } catch (err) {
    console.error("❌ Error fetching clients:", err);
    return res.status(500).json({ error: "Failed to fetch clients" });
  }
};

export const getPrompts = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);
    if (!client)
      return res.status(404).json({ error: "Client not found" });

    return res.json(client.prompts || []);
  } catch (err) {
    console.error("❌ Error fetching prompts:", err);
    return res.status(500).json({ error: "Failed to fetch prompts" });
  }
};


export const addPrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const { promptName, promptText } = req.body;

    if (!promptName || !promptText) {
      return res
        .status(400)
        .json({ error: "promptName and promptText are required" });
    }

    const client = await Client.findById(id);
    if (!client)
      return res.status(404).json({ error: "Client not found" });

    // Create new prompt entry
    const newPrompt = {
      promptId: new mongoose.Types.ObjectId(),
      promptName,
      promptText,
    };

    client.prompts.push(newPrompt);
    await client.save();

    return res.status(201).json(newPrompt);
  } catch (err) {
    console.error("❌ Error adding prompt:", err);
    return res.status(500).json({ error: "Failed to add prompt" });
  }
};

export const incrementTotalCharts = async (req, res) => {
  try {
    const { clientId } = req.params;

    const updated = await Client.findByIdAndUpdate(
      clientId,
      { $inc: { totalCharts: 1 } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Client not found" });

    return res.json({ success: true, totalCharts: updated.totalCharts });
  } catch (err) {
    console.error("incrementTotalCharts error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ADD to controllers/clientController.js

import Chart from "../models/Chart.js";
// import { Parser as Json2csvParser } from "json2csv";

/**
 * GET /api/clients/:clientId/runs
 * Query params:
 *  - start (ISO datetime string) optional
 *  - end (ISO datetime string) optional
 *  - promptId (string) optional (filter by promptId)
 *  - page (number, default 1)
 *  - limit (number, default 25)
 */



// export const getClientRuns = async (req, res) => {
//   try {
//     const { clientId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(clientId)) {
//       return res.status(400).json({ error: "Invalid clientId" });
//     }

//     const {
//       start,
//       end,
//       promptId,
//       page = 1,
//       limit = 25,
//     } = req.query;

//     const pageNum = Math.max(1, parseInt(page) || 1);
//     const pageSize = Math.max(1, Math.min(200, parseInt(limit) || 25));

//     // Base pipeline
//     const pipeline = [
//       { $match: { client: new mongoose.Types.ObjectId(clientId) } },
//       {
//         $project: {
//           name: 1,
//           llmResults: 1,
//         },
//       },
//       { $unwind: "$llmResults" },
//       {
//         $replaceRoot: {
//           newRoot: {
//             $mergeObjects: [
//               "$llmResults",
//               {
//                 chartId: "$_id",
//                 chartName: "$name",
//               },
//             ],
//           },
//         },
//       },
//     ];

//     // ------------- FIXED FILTER LOGIC -----------------
//     const matchFilters = {};

//     if (start) {
//       const iso = new Date(start).toISOString();
//       matchFilters.timestamp = matchFilters.timestamp || {};
//       matchFilters.timestamp.$gte = iso;
//     }

//     if (end) {
//       const iso = new Date(end).toISOString();
//       matchFilters.timestamp = matchFilters.timestamp || {};
//       matchFilters.timestamp.$lte = iso;
//     }

//     if (promptId) {
//        matchFilters.promptId = promptId;
//     }

//     if (Object.keys(matchFilters).length > 0) {
//       pipeline.push({ $match: matchFilters });
//     }

//     // Count total BEFORE pagination
//     const totalRes = await Chart.aggregate([...pipeline, { $count: "total" }]);
//     const total = totalRes.length > 0 ? totalRes[0].total : 0;

//     // Sort + paginate
//     pipeline.push({ $sort: { timestamp: -1 } });
//     pipeline.push({ $skip: (pageNum - 1) * pageSize });
//     pipeline.push({ $limit: pageSize });

//     // Final projection
//     pipeline.push({
//       $project: {
//         runId: "$_id",
//         promptId: 1,
//         promptName: 1,
//         timestamp: 1,
//         llmSuggestions: 1,
//         finalCptCodes: 1,
//         finalIcdCodes: 1,
//         chartId: 1,
//         chartName: 1,
//       },
//     });

//     const runs = await Chart.aggregate(pipeline);

//     return res.json({
//       total,
//       page: pageNum,
//       limit: pageSize,
//       runs,
//     });

//   } catch (err) {
//     console.error("getClientRuns error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };



export const getClientRuns = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: "Invalid clientId" });
    }

    const {
      start,
      end,
      promptId,
      page = 1,
      limit = 25,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.max(1, Math.min(200, parseInt(limit) || 25));

    // Base
    const pipeline = [
      { $match: { client: new mongoose.Types.ObjectId(clientId) } },
      {
        $project: {
          name: 1,
          llmResults: 1,
        },
      },
      { $unwind: "$llmResults" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$llmResults",
              {
                chartId: "$_id",
                chartName: "$name",
              },
            ],
          },
        },
      },
    ];

    // ---------- FIXED FILTER OBJECT ----------
    const matchFilters = {};

    // 1. Time filters
    if (start) {
      const iso = new Date(start).toISOString();
      matchFilters.timestamp = matchFilters.timestamp || {};
      matchFilters.timestamp.$gte = iso;
    }

    if (end) {
      const iso = new Date(end).toISOString();
      matchFilters.timestamp = matchFilters.timestamp || {};
      matchFilters.timestamp.$lte = iso;
    }

    // 2. Prompt filter (CRITICAL FIX)
    if (promptId && promptId !== "__all__") {
      if (!mongoose.Types.ObjectId.isValid(promptId)) {
        return res.status(400).json({ error: "Invalid promptId" });
      }

      matchFilters.promptId = new mongoose.Types.ObjectId(promptId);
    }

    // Apply combined filter
    if (Object.keys(matchFilters).length > 0) {
      pipeline.push({ $match: matchFilters });
    }

    // Count before pagination
    const totalRes = await Chart.aggregate([...pipeline, { $count: "total" }]);
    const total = totalRes.length > 0 ? totalRes[0].total : 0;

    // Sort + paginate
    pipeline.push({ $sort: { timestamp: -1 } });
    pipeline.push({ $skip: (pageNum - 1) * pageSize });
    pipeline.push({ $limit: pageSize });

    // Final shape
    pipeline.push({
      $project: {
        runId: "$_id",
        promptId: 1,
        promptName: 1,
        timestamp: 1,
        llmSuggestions: 1,
        finalCptCodes: 1,
        finalIcdCodes: 1,
        chartId: 1,
        chartName: 1,
      },
    });

    const runs = await Chart.aggregate(pipeline);

    res.json({
      total,
      page: pageNum,
      limit: pageSize,
      runs,
    });
  } catch (err) {
    console.error("getClientRuns error:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * POST /api/clients/:clientId/runs/export
 * Body: { runIds: [string], format: "csv" }
 * Exports selected runs (selected by runId) to CSV and returns CSV file.
//  */
// export const exportClientRunsCsv = async (req, res) => {
//   try {
//     const { clientId } = req.params;
//     const { runIds } = req.body;

//     if (!Array.isArray(runIds) || runIds.length === 0) {
//       return res.status(400).json({ error: "runIds (non-empty array) required" });
//     }

//     const validIds = runIds
//       .filter((id) => mongoose.Types.ObjectId.isValid(id))
//       .map((id) => new mongoose.Types.ObjectId(id));

//     if (validIds.length === 0) {
//       return res.status(400).json({ error: "No valid runIds provided" });
//     }

//     // Aggregate selected runs
//     const pipeline = [
//       { $match: { client: new mongoose.Types.ObjectId(clientId) } },
//       { $project: { name: 1, llmResults: 1 } },
//       { $unwind: "$llmResults" },
//       {
//         $replaceRoot: {
//           newRoot: {
//             $mergeObjects: ["$llmResults", { chartId: "$_id", chartName: "$name" }],
//           },
//         },
//       },
//       { $match: { _id: { $in: validIds } } },
//       {
//         $project: {
//           runId: "$_id",
//           chartId: 1,
//           chartName: 1,
//           promptId: 1,
//           promptName: 1,
//           timestamp: 1,
//           finalCptCodes: 1,
//           finalIcdCodes: 1,
//         },
//       },
//     ];

//     const runs = await Chart.aggregate(pipeline);

//     const rows = [];

//     for (const run of runs) {
//       const finalCpts = Array.isArray(run.finalCptCodes) ? run.finalCptCodes : [];
//       const finalIcds = Array.isArray(run.finalIcdCodes) ? run.finalIcdCodes : [];

//       // EXPORT ONLY FINAL CPT CODES
//       finalCpts.forEach((c) => {
//         rows.push({
//           runId: String(run.runId),
//           chartName: run.chartName || "",
//           promptName: run.promptName || "",
//           timestamp: run.timestamp || "",
//           codeType: "CPT",
//           code: c.code || "",
//           modifiers: Array.isArray(c.modifiers) ? c.modifiers.join("|") : "",
//           auditTrail: c.auditTrail || c.audit_trail || "",
//         });
//       });

//       // EXPORT ONLY FINAL ICD CODES
//       finalIcds.forEach((c) => {
//         rows.push({
//           runId: String(run.runId),
//           chartName: run.chartName || "",
//           promptName: run.promptName || "",
//           timestamp: run.timestamp || "",
//           codeType: "ICD",
//           code: c.code || "",
//           modifiers: "",
//           auditTrail: c.auditTrail || c.audit_trail || "",
//         });
//       });
//     }

//     // Convert rows to CSV
//     const fields = [
//       "runId",
//       "chartName",
//       "promptName",
//       "timestamp",
//       "codeType",
//       "code",
//       "modifiers",
//       "auditTrail",
//     ];

//     const json2csv = new Json2csvParser({ fields });
//     const csv = json2csv.parse(rows);

//     const filename = `runs_export_${clientId}_${Date.now()}.csv`;
//     res.header("Content-Type", "text/csv");
//     res.attachment(filename);
//     return res.send(csv);
//   } catch (err) {
//     console.error("exportClientRunsCsv error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };



// Requires: mongoose, Chart model, json2csv, archiver
// npm install json2csv archiver

import { Parser as Json2csvParser } from "json2csv";
import archiver from "archiver";

/**
 * Export selected runs as two CSVs (CPT and ICD) inside a ZIP.
 * Request:
 *  - req.params.clientId
 *  - req.body.runIds = array of run ObjectId strings (must be non-empty)
 */


import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
export const exportClientRunsCsv = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { runIds } = req.body;

    if (!Array.isArray(runIds) || runIds.length === 0) {
      return res.status(400).json({ error: "runIds (non-empty array) required" });
    }

    // Avoid deprecated constructor signature by casting to String
    const validIds = runIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(String(id)));

    if (validIds.length === 0) {
      return res.status(400).json({ error: "No valid runIds provided" });
    }

    // Aggregation pipeline similar to your reference (pulls runs for the client)
    const pipeline = [
      { $match: { client: new mongoose.Types.ObjectId(String(clientId)) } },
      { $project: { name: 1, llmResults: 1 } },
      { $unwind: "$llmResults" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$llmResults", { chartId: "$_id", chartName: "$name" }],
          },
        },
      },
      { $match: { _id: { $in: validIds } } },
      {
        $project: {
          runId: "$_id",
          chartId: 1,
          chartName: 1,
          promptId: 1,
          promptName: 1,
          timestamp: 1,
          llmSuggestions: 1,
        },
      },
    ];

    const runs = await Chart.aggregate(pipeline).exec();

    const providers = ["openai", "claude", "gemini"];

    // Build rows: one row per run
    const cptRows = [];
    const icdRows = [];

    for (const run of runs) {
      // prepare per-provider cell values
      const cptRow = {
        runId: String(run.runId),
        chartName: run.chartName || "",
      };
      const icdRow = {
        runId: String(run.runId),
        chartName: run.chartName || "",
      };

      for (const prov of providers) {
        const provObj = run.llmSuggestions?.[prov] || {};

        const provCpts = Array.isArray(provObj.CPT_Codes) ? provObj.CPT_Codes : [];
        const provIcds = Array.isArray(provObj.ICD_Codes) ? provObj.ICD_Codes : [];

        // CPT provider columns
        if (provCpts.length > 0) {
          const codes = provCpts.map((c) => (c && c.code ? String(c.code).trim() : "")).filter(Boolean);
          const descriptions = provCpts.map((c) => (c && c.description ? c.description : ""));
          cptRow[`${prov}_codes`] = codes.join(", ");
          cptRow[`${prov}_descriptions`] = JSON.stringify(descriptions);
        } else {
          cptRow[`${prov}_codes`] = "";
          cptRow[`${prov}_descriptions`] = JSON.stringify([]);
        }

        // ICD provider columns
        if (provIcds.length > 0) {
          const codes = provIcds.map((c) => (c && c.code ? String(c.code).trim() : "")).filter(Boolean);
          const descriptions = provIcds.map((c) => (c && c.description ? c.description : ""));
          icdRow[`${prov}_codes`] = codes.join(", ");
          icdRow[`${prov}_descriptions`] = JSON.stringify(descriptions);
        } else {
          icdRow[`${prov}_codes`] = "";
          icdRow[`${prov}_descriptions`] = JSON.stringify([]);
        }
      }

      cptRows.push(cptRow);
      icdRows.push(icdRow);
    }

    // Create workbook and two sheets (CPT and ICD)
    const workbook = new ExcelJS.Workbook();

    // CPT sheet
    const cptSheet = workbook.addWorksheet("CPT");

    // Define CPT columns: runId, chartName, then for each provider: codes + descriptions
    const cptCols = [
      { header: "runId", key: "runId", width: 24 },
      { header: "chartName", key: "chartName", width: 40 },
    ];
    for (const prov of providers) {
      cptCols.push({ header: `${prov}_codes`, key: `${prov}_codes`, width: 40 });
      cptCols.push({ header: `${prov}_descriptions`, key: `${prov}_descriptions`, width: 60 });
    }
    cptSheet.columns = cptCols;

    // Add CPT rows
    cptRows.forEach((r) => cptSheet.addRow(r));

    // Optional: format header bold
    cptSheet.getRow(1).font = { bold: true };

    // ICD sheet
    const icdSheet = workbook.addWorksheet("ICD");

    const icdCols = [
      { header: "runId", key: "runId", width: 24 },
      { header: "chartName", key: "chartName", width: 40 },
    ];
    for (const prov of providers) {
      icdCols.push({ header: `${prov}_codes`, key: `${prov}_codes`, width: 40 });
      icdCols.push({ header: `${prov}_descriptions`, key: `${prov}_descriptions`, width: 60 });
    }
    icdSheet.columns = icdCols;

    icdRows.forEach((r) => icdSheet.addRow(r));
    icdSheet.getRow(1).font = { bold: true };

    // Write workbook to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    const filename = `runs_export_${clientId}_${Date.now()}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("exportClientRunsXlsx error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
    try { res.end(); } catch (e) {}
  }
};