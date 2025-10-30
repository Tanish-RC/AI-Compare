

// import express from "express";
// import cors from "cors";
// import fs from "fs";
// import dotenv from "dotenv";

// // Import routes
// import openaiRoutes from "./routes/openaiRoute.js";
// import claudeRoutes from "./routes/claudeRoute.js";
// import geminiRoutes from "./routes/geminiRoute.js";

// dotenv.config();

// const app = express();
// const PORT = 8081;

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: "100mb" }));

// // Load prompt from file
// let defaultPrompt = "";
// try {
//   defaultPrompt = fs.readFileSync("./prompt.txt", "utf8");
//   console.log("✅ Prompt loaded from prompt.txt");
// } catch (err) {
//   console.error("⚠️ Could not load prompt.txt:", err.message);
// }
// // console.log(defaultPrompt)

// console.log(process.env.OPENAI_API_KEY);
// // Attach prompt to all requests
// app.use((req, res, next) => {
//   req.defaultPrompt = defaultPrompt;
//   next();
// });
// // Routes
// app.use("/api/openai", openaiRoutes);
// app.use("/api/claude", claudeRoutes);
// app.use("/api/gemini", geminiRoutes);

// // Root endpoint
// app.get("/", (req, res) => {
//   res.json({ status: "ok", message: "Server running on port 8081" });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Import routes
import openaiRoutes from "./routes/openaiRoute.js";
import claudeRoutes from "./routes/claudeRoute.js";
import geminiRoutes from "./routes/geminiRoute.js";

// Setup environment
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));

// Get the current directory (works in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load prompt safely using absolute path
let defaultPrompt = "";
try {
  const promptPath = path.join(__dirname, "prompt.txt");
  defaultPrompt = fs.readFileSync(promptPath, "utf8");
  console.log("✅ Prompt loaded from:", promptPath);
  console.log("Prompt Preview:", defaultPrompt.substring(0, 100) + "...");
} catch (err) {
  console.error("⚠️ Could not load prompt.txt:", err.message);
}
console.log(defaultPrompt)
// Attach prompt to all requests
app.use((req, res, next) => {
  req.defaultPrompt = defaultPrompt;
  next();
});

// Routes
app.use("/api/openai", openaiRoutes);
app.use("/api/claude", claudeRoutes);
app.use("/api/gemini", geminiRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server running on port " + PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
