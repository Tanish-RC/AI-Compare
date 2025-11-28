

// import express from "express";
// import Client from "../../models/Client.js";

// const router = express.Router();

// /* -------------------- GET all clients -------------------- */
// router.get("/", async (req, res) => {
//   try {
//     const clients = await Client.find().sort({ createdAt: -1 });
//     res.json(clients);
//   } catch (err) {
//     console.error("Error fetching clients:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -------------------- GET single client -------------------- */
// router.get("/:id", async (req, res) => {
//   try {
//     const client = await Client.findById(req.params.id);
//     if (!client) return res.status(404).json({ error: "Client not found" });
//     res.json(client);
//   } catch (err) {
//     console.error("Error fetching client:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -------------------- CREATE client -------------------- */
// // router.post("/", async (req, res) => {
// //   try {
// //     const { name, contactEmail, contactPhone } = req.body;

// //     if (!name) {
// //       return res.status(400).json({ error: "Client name is required" });
// //     }

// //     const newClient = new Client({
// //       name,
// //       contactEmail,
// //       contactPhone,
// //     });

// //     const savedClient = await newClient.save();
// //     res.status(201).json(savedClient);
// //   } catch (err) {
// //     console.error("Error creating client:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// router.post("/", async (req, res) => {
//   try {
//     const { name } = req.body;

//     if (!name || !name.trim()) {
//       return res.status(400).json({ error: "Client name is required" });
//     }

//     const newClient = new Client({
//       name: name.trim(),
//       totalRuns: 0,
//       lastRunTime: null,
//       prompts: [],
//     });

//     const savedClient = await newClient.save();
//     res.status(201).json(savedClient);
//   } catch (err) {
//     console.error("Error creating client:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -------------------- UPDATE client -------------------- */
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedClient = await Client.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     );

//     if (!updatedClient)
//       return res.status(404).json({ error: "Client not found" });

//     res.json(updatedClient);
//   } catch (err) {
//     console.error("Error updating client:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -------------------- DELETE client -------------------- */
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedClient = await Client.findByIdAndDelete(req.params.id);
//     if (!deletedClient)
//       return res.status(404).json({ error: "Client not found" });

//     res.json({ message: "Client deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting client:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -------------------- UPDATE lastRunTime + totalRuns -------------------- */
// router.put("/:id/run", async (req, res) => {
//   try {
//     console.log("🟢 PUT /api/clients/:id/run called with:", req.params.id);
//     const clientId = req.params.id;
//     const { prompt } = req.body;

//     const client = await Client.findById(clientId);
//     if (!client) return res.status(404).json({ error: "Client not found" });

//     // Increment run count and update last run time
//     client.totalRuns += 1;
//     client.lastRunTime = new Date();

//     // Optional: log this prompt in the history
//     if (prompt && prompt.trim()) {
//       client.prompts.push({
//         prompt: prompt.trim(),
//         createdAt: new Date(),
//       });
//     }

//     const updated = await client.save();

//     res.json({
//       success: true,
//       message: "Run stats updated successfully",
//       client: updated,
//     });
//   } catch (err) {
//     console.error("Error updating run stats:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// export default router;



// routes/clientRoutes.js

// import express from "express";
// import {
//   createClient,
//   getClient,
//   getAllClients,
// } from "../../controllers/clientController.js";

// const router = express.Router();

// // Create new client (AUTO-ADDS DEFAULT PROMPT)
// router.post("/", createClient);

// // Get all clients
// router.get("/", getAllClients);

// // Get single client by id
// router.get("/:id", getClient);

// router.get("/:id/prompts", getPrompts);
// router.post("/:id/prompts", addPrompt);

// export default router;


import express from "express";
import {
  createClient,
  getClient,
  getAllClients,
  getPrompts,
  addPrompt,
  incrementTotalCharts,
  getClientRuns,
  exportClientRunsCsv
} from "../../controllers/clientController.js";

const router = express.Router();

// Create new client (AUTO-ADDS DEFAULT PROMPT)
router.post("/", createClient);

// Get all clients
router.get("/", getAllClients);

// Get single client
router.get("/:id", getClient);

//  GET prompts for client
router.get("/:id/prompts", getPrompts);

//  ADD new prompt for client
router.post("/:id/prompts", addPrompt);

router.put("/:clientId/charts/increment", incrementTotalCharts);

// GET runs with filters & pagination
router.get("/:clientId/runs", getClientRuns);

// POST export CSV for selected runs
router.post("/:clientId/runs/export", exportClientRunsCsv);


export default router;
