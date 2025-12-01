
// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from './config/db.js';
// import clientRoutes from './routes/apix/clients.js';

// // Import routes
// import openaiRoutes from './routes/openaiRoute.js';
// import claudeRoutes from './routes/claudeRoute.js';
// import geminiRoutes from './routes/geminiRoute.js';
// import chartRoutes from './routes/apix/charts.js';

// // Initialize app
// const app = express();
// const PORT = process.env.PORT || 8081;

// // Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '100mb' }));

// // Load prompt from file
// let defaultPrompt = '';
// try {
//   defaultPrompt = await fs.readFile(path.join(__dirname, 'prompt.txt'), 'utf8');
//   console.log('✅ Prompt loaded from prompt.txt');
// } catch (err) {
//   console.error('⚠️ Could not load prompt.txt:', err.message);
// }

// // Attach prompt to all requests
// app.use((req, res, next) => {
//   req.defaultPrompt = defaultPrompt;
//   next();
// });


// app.use('/api/clients', clientRoutes);
// app.use('/api/charts', chartRoutes);
 
// // API Routes
// app.use('/api/openai', openaiRoutes);
// app.use('/api/claude', claudeRoutes);
// app.use('/api/gemini', geminiRoutes);

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: `Server running on port ${PORT}`,
//     endpoints: [
//       '/api/openai - OpenAI API endpoints',
//       '/api/claude - Claude API endpoints',
//       '/api/gemini - Gemini API endpoints',
//       '/api/charts - Charts CRUD operations'
//     ]
//   });
// });

// // Error handling middleware
// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).json({ 
// //     error: 'Something went wrong!',
// //     message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
// //   });
// // });



// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.error(`Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });

// export default server;


// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from '../config/db.js';

// // Routes
// import clientRoutes from '../routes/apix/clients.js';
// import openaiRoutes from '../routes/openaiRoute.js';
// import claudeRoutes from '../routes/claudeRoute.js';
// import geminiRoutes from '../routes/geminiRoute.js';
// import chartRoutes from '../routes/apix/charts.js';

// // ----------------------------------------
// // SETUP
// // ----------------------------------------

// const app = express();

// // Ensure only one DB connection on cold start
// let isConnected = false;
// async function connectOnce() {
//   if (!isConnected) {
//     await connectDB();
//     isConnected = true;
//     console.log("✅ MongoDB connected (serverless)");
//   }
// }

// // Load prompt.txt (once)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// let defaultPrompt = "";
// async function loadPrompt() {
//   try {
//     defaultPrompt = await fs.readFile(
//       path.join(__dirname, "../prompt.txt"),
//       "utf8"
//     );
//     console.log("✅ prompt.txt loaded");
//   } catch (err) {
//     console.error("⚠️ prompt.txt missing:", err.message);
//   }
// }
// await loadPrompt();

// // ----------------------------------------
// // MIDDLEWARE
// // ----------------------------------------

// app.use(cors());
// app.use(express.json({ limit: "100mb" }));

// // Attach prompt + ensure DB on every request
// app.use(async (req, res, next) => {
//   req.defaultPrompt = defaultPrompt;
//   await connectOnce();
//   next();
// });

// // ----------------------------------------
// // ROUTES
// // ----------------------------------------

// app.use("/api/clients", clientRoutes);
// app.use("/api/charts", chartRoutes);
// app.use("/api/openai", openaiRoutes);
// app.use("/api/claude", claudeRoutes);
// app.use("/api/gemini", geminiRoutes);

// app.get("/", (req, res) => {
//   res.json({
//     status: "ok",
//     message: "Vercel Express backend running (serverless)",
//   });
// });

// // ----------------------------------------
// // EXPORT AS SERVERLESS HANDLER
// // ----------------------------------------

// export default app;



import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";

// Routes
import clientRoutes from "../routes/apix/clients.js";
import chartRoutes from "../routes/apix/charts.js";
import openaiRoutes from "../routes/openaiRoute.js";
import claudeRoutes from "../routes/claudeRoute.js";
import geminiRoutes from "../routes/geminiRoute.js";

const app = express();

/* ------------------ Load prompt.txt once ------------------ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let defaultPrompt = "";
async function loadPrompt() {
  try {
    defaultPrompt = await fs.readFile(
      path.join(__dirname, "../prompt.txt"),
      "utf8"
    );
    console.log("📄 prompt.txt loaded");
  } catch (err) {
    console.error("⚠️ prompt.txt missing:", err.message);
  }
}

await loadPrompt();

/* ------------------ Middleware ------------------ */

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// One-time DB connection + add prompt
app.use(async (req, res, next) => {
  await connectDB();
  req.defaultPrompt = defaultPrompt;
  next();
});

/* ------------------ Routes ------------------ */

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Vercel Express API running",
  });
});

app.use("/api/clients", clientRoutes);
app.use("/api/charts", chartRoutes);
app.use("/api/openai", openaiRoutes);
app.use("/api/claude", claudeRoutes);
app.use("/api/gemini", geminiRoutes);

/* ------------------ Export handler (IMPORTANT) ------------------ */

export default app;
