
import { fileToBase64 } from "../utils/fileUtils";

const API_BASE =  "http://localhost:8081/api";

/* -------------------- CLIENTS -------------------- */

// ✅ Get all clients hh
export async function getClients() {
  try {
    const res = await fetch(`${API_BASE}/clients`);
    if (!res.ok) throw new Error("Failed to fetch clients");
    return await res.json();
  } catch (err) {
    console.error("getClients error:", err);
    return { error: err.message };
  }
}

// ✅ Get a single client by ID
export async function getClientById(clientId) {
  try {
    const res = await fetch(`${API_BASE}/clients/${clientId}`);
    if (!res.ok) throw new Error("Failed to fetch client");
    return await res.json();
  } catch (err) {
    console.error("getClientById error:", err);
    return { error: err.message };
  }
}



// ✅ Add a new client (only name required)
export async function addClient(clientData) {
  try {
    const res = await fetch(`${API_BASE}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: clientData.name }),
    });
    if (!res.ok) throw new Error("Failed to add client");
    return await res.json();
  } catch (err) {
    console.error("addClient error:", err);
    return { error: err.message };
  }
}



// ✅ Update an existing client
export async function updateClient(clientId, clientData) {
  try {
    const res = await fetch(`${API_BASE}/clients/${clientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    });
    if (!res.ok) throw new Error("Failed to update client");
    return await res.json();
  } catch (err) {
    console.error("updateClient error:", err);
    return { error: err.message };
  }
}

// ✅ Delete a client
export async function deleteClient(clientId) {
  try {
    const res = await fetch(`${API_BASE}/clients/${clientId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete client");
    return await res.json();
  } catch (err) {
    console.error("deleteClient error:", err);
    return { error: err.message };
  }
}

/* -------------------- CHARTS -------------------- */

// ✅ Get all charts for a client
export async function getChartsByClient(clientId) {
  try {
    const res = await fetch(`${API_BASE}/charts/client/${clientId}`);
    if (!res.ok) throw new Error("Failed to fetch charts");
    return await res.json();
  } catch (err) {
    console.error("getChartsByClient error:", err);
    return { error: err.message };
  }
}

// ✅ Add or update a chart
export async function saveChart(chartData) {
  try {
    const res = await fetch(`${API_BASE}/charts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chartData),
    });
    if (!res.ok) throw new Error("Failed to save chart");
    return await res.json();
  } catch (err) {
    console.error("saveChart error:", err);
    return { error: err.message };
  }
}

// ✅ Delete a chart
export async function deleteChart(chartId) {
  try {
    const res = await fetch(`${API_BASE}/charts/${chartId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete chart");
    return await res.json();
  } catch (err) {
    console.error("deleteChart error:", err);
    return { error: err.message };
  }
}


export const getClientCharts = async (clientId) => {
  const res = await fetch(`${API_BASE}/charts/client/${clientId}`);
  if (!res.ok) throw new Error("Failed to fetch client charts");
  return await res.json();
};

export const getChartById = async (chartId) => {
  const res = await fetch(`${API_BASE}/charts/${chartId}`);
  if (!res.ok) throw new Error("Failed to fetch chart by ID");
  return await res.json();
};


export const uploadChart = async (clientId, file, prompt = "") => {
  try {
    // ✅ Hardcoded backend URL since you don’t have .env
    const API_BASE = "http://localhost:8081/api";

    // Convert file to Base64 before uploading
    const base64Data = await fileToBase64(file);

    console.log("📤 Uploading chart for client:", clientId, "→", file.name);

    // Step 1: Create chart entry in MongoDB
    const createRes = await fetch(`${API_BASE}/charts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: clientId,
        name: file.name,
        content: base64Data,
        llmSuggestions: {}, // will fill later
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Chart creation failed: ${errText}`);
    }

    const chart = await createRes.json();
    console.log("✅ Chart created in DB:", chart);

    // Step 2: Let your frontend handle model processing directly
    // (via processWithOpenAI, processWithClaude, processWithGemini)
    // ❌ No backend /process endpoint call needed here

    return chart;
  } catch (err) {
    console.error("Error uploading chart:", err);
    throw err;
  }
};

// ✅ Increment totalRuns and update lastRunTime
export async function updateClientRun(clientId, prompt = "") {
  try {
    const res = await fetch(`${API_BASE}/clients/${clientId}/run`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error("Failed to update client run info");
    return await res.json();
  } catch (err) {
    console.error("updateClientRun error:", err);
    return { error: err.message };
  }
}


/**
 * Fetch all prompts for a given client
 */
// export async function getClientPrompts(clientId) {
//   const res = await fetch(`${API_BASE}/clients/${clientId}`);
//   if (!res.ok) throw new Error("Failed to load client prompts");
//   const data = await res.json();
//   return data.prompts || [];
// }

/**
 * Save a NEW prompt for a client
 * (existing prompts cannot be edited)
 */
export async function saveClientPrompt(clientId, promptName, promptText) {
  const res = await fetch(`${API_BASE}/clients/${clientId}/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promptName, promptText }),
  });

  if (!res.ok) throw new Error("Failed to save prompt");
  return await res.json();
}

// ✅ Get all prompts for a client (correct endpoint)
export async function getClientPrompts(clientId) {
  const res = await fetch(`${API_BASE}/clients/${clientId}/prompts`);
  if (!res.ok) throw new Error("Failed to load client prompts");
  return await res.json();
}


// ✅ Increment totalCharts by +1
export async function incrementTotalCharts(clientId) {
  try {
    const res = await fetch(`${API_BASE}/clients/${clientId}/charts/increment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("Failed to increment total charts");

    return await res.json();
  } catch (err) {
    console.error("incrementTotalCharts error:", err);
    return { error: err.message };
  }
}

// Save final codes for a specific run
export async function saveRunFinalCodes(chartId, runId, payload) {
  const res = await fetch(`${API_BASE}/charts/${chartId}/runs/${runId}/final-codes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to save final codes: ${text || res.status}`);
  }
  return await res.json();
}

// GET runs for client with filters
// 

// services/api.js (add or replace this function)

export async function getClientRuns(clientId, params = {}) {
  if (!clientId) throw new Error("clientId required");

  // Build URL + query params robustly
  const url = new URL(`/api/clients/${clientId}/runs`, window.location.origin);
  const qs = new URLSearchParams();

  if (params.start) qs.set("start", params.start);
  if (params.end) qs.set("end", params.end);
  if (params.promptId) qs.set("promptId", params.promptId);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  const full = `${url.pathname}${qs.toString() ? `?${qs.toString()}` : ""}`;

  // debug - check network tab or console
  // eslint-disable-next-line no-console
  console.log("GET", full);

  const res = await fetch(full, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`getClientRuns failed: ${res.status} ${res.statusText} - ${txt}`);
  }

  return res.json();
}


// POST export selected runs -> returns CSV response
export async function exportClientRuns(clientId, runIds = []) {
  const res = await fetch(`${API_BASE}/clients/${clientId}/runs/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ runIds }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to export runs");
  }

  const blob = await res.blob();
  return blob; // caller will trigger download
}
