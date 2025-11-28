// import mongoose from "mongoose";

// // ─────────────────────────────────────────────
// // Subschema for final CPT codes (UNCHANGED)
// // ─────────────────────────────────────────────
// const cptCodeSchema = new mongoose.Schema(
//   {
//     code: { type: String, required: true },
//     modifiers: [{ type: String }],
//   },
//   { _id: false }
// );

// // ─────────────────────────────────────────────
// // ⭐ New subschema for LLM Results
// // ─────────────────────────────────────────────
// const llmResultSchema = new mongoose.Schema(
//   {
//     // ⭐ Reference to the prompt used — now a Mongo ObjectId
//     promptId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },

//     // ⭐ A nickname chosen in the UI when running the LLM
//     promptName: { type: String, required: true },

//     // ⭐ LLM suggestions for this run
//     llmSuggestions: {
//       openai: {
//         type: mongoose.Schema.Types.Mixed,
//         required: true,
//         default: {},
//       },
//       claude: {
//         type: mongoose.Schema.Types.Mixed,
//         required: true,
//         default: {},
//       },
//       gemini: {
//         type: mongoose.Schema.Types.Mixed,
//         required: true,
//         default: {},
//       },
//     },
//   },
//   { _id: false }
// );

// // ─────────────────────────────────────────────
// // MAIN CHART SCHEMA
// // ─────────────────────────────────────────────
// const chartSchema = new mongoose.Schema(
//   {
//     // 🔗 Client Reference
//     client: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Client",
//       required: true,
//     },

//     // 📊 Basic Chart Info
//     name: { type: String, required: true },

//     // 🌐 PDF Storage
//     pdfUrl: { type: String },
//     pdfData: { type: Buffer },
//     pdfContentType: { type: String, default: "application/pdf" },

//     // 📄 Parsed / extracted content
//     content: { type: String },

//     // ⚠️ Old field — kept TEMPORARILY (to be removed after migration)
//     llmSuggestions: {
//       openai: { type: mongoose.Schema.Types.Mixed, default: null },
//       claude: { type: mongoose.Schema.Types.Mixed, default: null },
//       gemini: { type: mongoose.Schema.Types.Mixed, default: null },
//     },

//     // ⭐ New array — each LLM run becomes a record here
//     llmResults: {
//       type: [llmResultSchema],
//       default: [],
//     },

//     // ✅ Final approved codes
//     finalCptCodes: [cptCodeSchema],
//     finalIcdCodes: [{ type: String }],

//     // 🏷️ Chart processing status
//     status: {
//       type: String,
//       enum: ["pending", "completed", "failed"],
//       default: "completed",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Chart", chartSchema);


// import mongoose from "mongoose";

// // ─────────────────────────────────────────────
// // Subschema for final CPT codes (UNCHANGED)
// // ─────────────────────────────────────────────
// const cptCodeSchema = new mongoose.Schema(
//   {
//     code: { type: String, required: true },
//     modifiers: [{ type: String }],
//   },
//   { _id: false }
// );

// // ─────────────────────────────────────────────
// // ⭐ Subschema for LLM Results (UPDATED WITH TIMESTAMP)
// // ─────────────────────────────────────────────
// const llmResultSchema = new mongoose.Schema(
//   {
//     // ⭐ Reference to the prompt used — ObjectId from Prompt collection
//     promptId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },

//     // ⭐ Stored prompt name (safe to show even if prompt deleted)
//     promptName: { type: String, required: true },

//     // ⭐ NEW FIELD — timestamp of this run
//     timestamp: {
//       type: String,
//       required: true,
//       default: () => new Date().toISOString(),
//     },

//     // ⭐ LLM suggestions (parsed CPT/ICD with reasoning, audit trail, etc.)
//     llmSuggestions: {
//       openai: {
//         type: mongoose.Schema.Types.Mixed,
//         required: true,
//         default: {},
//       },
//       claude: {
//         type: mongoose.Schema.Types.Mixed,
//         required: true,
//         default: {},
//       },
//       gemini: {
//         type: mongoose.Schema.Types.Mixed,
//         required: true,
//         default: {},
//       },
//     },
//   },
//   { _id: false }
// );

// // ─────────────────────────────────────────────
// // MAIN CHART SCHEMA
// // ─────────────────────────────────────────────
// const chartSchema = new mongoose.Schema(
//   {
//     // 🔗 Client Reference
//     client: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Client",
//       required: true,
//     },

//     // 📊 Basic Chart Info
//     name: { type: String, required: true },

//     // 🌐 PDF Storage
//     pdfUrl: { type: String },
//     pdfData: { type: Buffer },
//     pdfContentType: { type: String, default: "application/pdf" },

//     // 📄 Parsed / extracted content
//     content: { type: String },

//     // ⚠️ Old field (TEMPORARY - will be removed later)
//     llmSuggestions: {
//       openai: { type: mongoose.Schema.Types.Mixed, default: null },
//       claude: { type: mongoose.Schema.Types.Mixed, default: null },
//       gemini: { type: mongoose.Schema.Types.Mixed, default: null },
//     },

//     // ⭐ New array — each LLM run gets appended here
//     llmResults: {
//       type: [llmResultSchema],
//       default: [],
//     },

//     // ✅ Final approved codes
//     finalCptCodes: [cptCodeSchema],
//     finalIcdCodes: [{ type: String }],

//     // 🏷️ Chart processing status
//     status: {
//       type: String,
//       enum: ["pending", "completed", "failed"],
//       default: "completed",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Chart", chartSchema);


import mongoose from "mongoose";

// ─────────────────────────────────────────────
// CPT CODE SUBSCHEMA
// ─────────────────────────────────────────────
const cptCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    modifiers: [{ type: String }],
    auditTrail: { type: String },  // Optional, but present when set
     description: { type: String },
    },
    { _id: false }
  );
  
  // ─────────────────────────────────────────────
  // ICD CODE SUBSCHEMA
  // ─────────────────────────────────────────────
  const icdCodeSchema = new mongoose.Schema(
    {
      code: { type: String, required: true },
      auditTrail: { type: String },
      description: { type: String },
    },
  { _id: false }
);

// ─────────────────────────────────────────────
// LLM RUN SUBSCHEMA — WITH AUTO RUN ID
// ─────────────────────────────────────────────
const llmResultSchema = new mongoose.Schema(
  {
    // Unique run ID
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    // Prompt reference
    promptId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    promptName: { type: String, required: true },

    // Timestamp for the run
    timestamp: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },

    // Raw LLM suggestions
    llmSuggestions: {
      openai: { type: mongoose.Schema.Types.Mixed, default: {} },
      claude: { type: mongoose.Schema.Types.Mixed, default: {} },
      gemini: { type: mongoose.Schema.Types.Mixed, default: {} },
    },

    // ⭐ Final codes defined ONLY when added manually (NO DEFAULT)
    finalCptCodes: {
      type: [cptCodeSchema],
      required: false,
    },
    finalIcdCodes: {
      type: [icdCodeSchema],
      required: false,
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// MAIN CHART SCHEMA
// ─────────────────────────────────────────────
const chartSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    name: { type: String, required: true },

    pdfUrl: { type: String },
    pdfData: { type: Buffer },
    pdfContentType: { type: String, default: "application/pdf" },

    content: { type: String },

    // Old field
    llmSuggestions: {
      openai: { type: mongoose.Schema.Types.Mixed, default: null },
      claude: { type: mongoose.Schema.Types.Mixed, default: null },
      gemini: { type: mongoose.Schema.Types.Mixed, default: null },
    },

    // Array of all LLM runs
    llmResults: {
      type: [llmResultSchema],
      default: [],
    },

    // ⭐ Final codes NOT auto-created — only appear when API sets them
    finalCptCodes: {
      type: [cptCodeSchema],
      required: false,
    },
    finalIcdCodes: {
      type: [icdCodeSchema],
      required: false,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chart", chartSchema);
