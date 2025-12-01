// import mongoose from 'mongoose';

// const clientSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   contactEmail: String,
//   contactPhone: String,
//   createdAt: { type: Date, default: Date.now },
//   lastRunDate: Date,
//   totalRuns: { type: Number, default: 0 },
// }, { timestamps: true });

// // Explicitly use the existing "Orgs" collection
// export default mongoose.model('Client', clientSchema, 'Orgs');

// import mongoose from "mongoose";

// const promptSchema = new mongoose.Schema(
//   {
//     prompt: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { _id: false } // no need for _id on each subdocument
// );

// const clientSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     // 🧠 Run stats
//     totalRuns: { type: Number, default: 0 },
//     lastRunTime: { type: Date },

//     // 💬 History of prompts
//     prompts: [promptSchema],
//   },
//   { timestamps: true } // adds createdAt & updatedAt automatically
// );

// // Use existing "Orgs" collection explicitly
// export default mongoose.model("Client", clientSchema, "Orgs");


// import mongoose from "mongoose";

// const promptSchema = new mongoose.Schema(
//   {
//     // Use a new ObjectId as the promptId
//     promptId: {
//       type: mongoose.Schema.Types.ObjectId,
//       default: () => new mongoose.Types.ObjectId(),
//       required: true,
//     },

//     // Name assigned from UI
//     promptName: { type: String, required: true },

//     // The actual prompt text
//     promptText: { type: String, required: true },
//   },
//   { _id: false } // do not create Mongo's default _id for each subdocument
// );

// const clientSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     // 🧠 Run stats
//     totalRuns: { type: Number, default: 0 },
//     lastRunTime: { type: Date },

//     // 💬 Updated prompts array using new schema
//     prompts: [promptSchema],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Client", clientSchema, "Orgs");


import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    // Use a new ObjectId as the promptId
    promptId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
    },

    // Name assigned from UI
    promptName: { type: String, required: true },

    // The actual prompt text
    promptText: { type: String, required: true },
  },
  { _id: false } // do not create Mongo's default _id for each subdocument
);

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // 📊 Total charts uploaded by this client
    totalCharts: { type: Number, default: 0 },

    // 🧠 When the last run occurred (kept as-is)
    lastRunTime: { type: Date },

    // 💬 Prompt library for this client
    prompts: [promptSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Client ||mongoose.model("Client", clientSchema, "Orgs");