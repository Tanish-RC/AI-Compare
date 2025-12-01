// import Client from "../../../Server/models/Client";

// export const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       // Remove the "data:application/pdf;base64," prefix to keep it clean
//       const base64String = reader.result.split(",")[1];
//       resolve(base64String);
//     };
//     reader.onerror = (error) => reject(error);
//   });
// };
// /**
//  * Sends a file to a specific LLM backend
//  * @param {File} file - The file to process
//  * @param {string} prompt - Custom extraction or analysis prompt
//  * @param {"openai"|"claude"|"gemini"} model - Which backend to call
//  * @returns {Promise<Object>} The JSON response from the server
//  */
// export async function processFileWithBackend(file, prompt = "", model = "openai") {
//   try {
//     const base64Data = await fileToBase64(file);

//     // Map model name to its endpoint
//     const BASE_URL = "http://localhost:8081";

// const endpointMap = {
//   openai: `${BASE_URL}/api/openai/analyze`,
//   claude: `${BASE_URL}/api/claude/analyze`,
//   gemini: `${BASE_URL}/api/gemini/analyze`,
// };

//     const endpoint = endpointMap[model.toLowerCase()] || endpointMap.openai;

//     const response = await fetch(endpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         fileName: file.name,
//         fileType: file.type,
//         fileData: base64Data,
//         prompt: prompt,
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({}));
//       throw new Error(error.message || `Failed to process file with ${model}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`❌ Error processing file with ${model}:`, error);
//     throw error;
//   }
// }

// /**
//  * Convenience helpers for specific models
//  */
// export async function processWithOpenAI(file, prompt = "") {
//   return processFileWithBackend(file, prompt, "openai", Client);
// }

// export async function processWithClaude(file, prompt = "") {
//   return processFileWithBackend(file, prompt, "claude", Client);
// }

// export async function processWithGemini(file, prompt = "") {
//   return processFileWithBackend(file, prompt, "gemini",Client);
// }

// export function parseJsonFromTextForGemini(text) {
//   try {
//     // Step 1: Try direct JSON.parse first (fastest path)
//     return JSON.parse(text);
//   } catch (directParseError) {
//     try {
//       // Step 2: Clean up and extract JSON
//       let cleaned = text.trim();
//       // Remove outer quotes if the entire text is wrapped in quotes
//       if (
//         (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
//         (cleaned.startsWith("'") && cleaned.endsWith("'"))
//       ) {
//         cleaned = cleaned.slice(1, -1);
//       }
//       // Remove markdown code blocks
//       cleaned = cleaned.replace(/```json\s*/gi, "");
//       cleaned = cleaned.replace(/```\s*/g, "");
//       cleaned = cleaned.replace(/^json\s*/gi, "");
//       // Handle escaped quotes and newlines
//       cleaned = cleaned.replace(/\\"/g, '"');
//       cleaned = cleaned.replace(/\\n/g, "\n");
//       cleaned = cleaned.trim();
//       // Find JSON boundaries - check for both objects and arrays
//       let startIndex = -1;
//       let endIndex = -1;
//       const objStart = cleaned.indexOf("{");
//       const objEnd = cleaned.lastIndexOf("}");
//       const arrStart = cleaned.indexOf("[");
//       const arrEnd = cleaned.lastIndexOf("]");
//       // Determine which comes first (object or array)
//       if (objStart !== -1 && (arrStart === -1 || objStart < arrStart)) {
//         startIndex = objStart;
//         endIndex = objEnd;
//       } else if (arrStart !== -1) {
//         startIndex = arrStart;
//         endIndex = arrEnd;
//       }
//       if (startIndex === -1 || endIndex === -1) {
//         throw new Error("No JSON object or array found");
//       }
//       // Extract just the JSON part
//       let jsonText = cleaned.substring(startIndex, endIndex + 1);
//       jsonText = jsonText.replace(/\\\\/g, "\\");
//       const result = JSON.parse(jsonText);
//       if (typeof result !== "object" || result === null) {
//         throw new Error("Parsed result is not a valid JSON object or array");
//       }
//       return result;
//     } catch (cleanParseError) {
//       // Step 3: Last resort - try regex fallback
//       try {
//         const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
//         if (jsonMatch) {
//           return JSON.parse(jsonMatch[0]);
//         }
//       } catch (lastResortError) {
//         console.error("All parsing attempts failed");
//       }
//       // Return appropriate empty value
//       return text.includes("[") ? [] : {};
//     }
//   }
// }

// /**
//  * Safely parse and clean a JSON string from an LLM response.
//  * Handles markdown fences, escaped quotes, extra text, and both objects/arrays.
//  *
//  * @param {string} text - The raw model output (possibly messy JSON).
//  * @returns {object|array} - The parsed JSON object or array. Returns {} on failure.
//  */
// // export function cleanAndParseLLMJson(text) {
// //   try {
// //     if (!text || typeof text !== "string") {
// //       console.warn("⚠️ cleanAndParseLLMJson: input is not a string");
// //       return {};
// //     }

// //     // Step 1: Try direct parse first (fastest path)
// //     try {
// //       return JSON.parse(text);
// //     } catch {
// //       // continue to cleanup
// //     }

// //     // Step 2: Clean obvious markdown and escaped formatting
// //     let cleaned = text.trim();

// //     // Remove markdown code fences like ```json ... ```
// //     cleaned = cleaned.replace(/```json\s*/gi, "");
// //     cleaned = cleaned.replace(/```\s*/g, "");
// //     cleaned = cleaned.replace(/^json\s*/gi, "");

// //     // Remove wrapping quotes if text is quoted JSON
// //     if (
// //       (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
// //       (cleaned.startsWith("'") && cleaned.endsWith("'"))
// //     ) {
// //       cleaned = cleaned.slice(1, -1);
// //     }

// //     // Unescape common escaped characters
// //     cleaned = cleaned.replace(/\\"/g, '"');
// //     cleaned = cleaned.replace(/\\n/g, "\n");
// //     cleaned = cleaned.replace(/\\t/g, "\t");
// //     cleaned = cleaned.replace(/\\\\/g, "\\");

// //     // Step 3: Find first valid JSON boundary (object or array)
// //     const objStart = cleaned.indexOf("{");
// //     const objEnd = cleaned.lastIndexOf("}");
// //     const arrStart = cleaned.indexOf("[");
// //     const arrEnd = cleaned.lastIndexOf("]");

// //     let jsonText = "";

// //     if (objStart !== -1 && objEnd !== -1) {
// //       jsonText = cleaned.substring(objStart, objEnd + 1);
// //     } else if (arrStart !== -1 && arrEnd !== -1) {
// //       jsonText = cleaned.substring(arrStart, arrEnd + 1);
// //     } else {
// //       throw new Error("No JSON boundaries found");
// //     }

// //     // Step 4: Parse the extracted JSON safely
// //     const parsed = JSON.parse(jsonText);

// //     // ✅ Always return an object or array
// //     if (typeof parsed === "object" && parsed !== null) {
// //       return parsed;
// //     } else {
// //       throw new Error("Parsed value is not a valid object/array");
// //     }
// //   } catch (err) {
// //     console.error("❌ cleanAndParseLLMJson failed:", err.message);
// //     console.error("🔍 Raw input preview:", (text || "").substring(0, 200) + "...");
// //     return {};
// //   }
// // }

// export function cleanAndParseLLMJson(text) {
//   try {
//     if (!text || typeof text !== "string") {
//       console.warn("⚠️ cleanAndParseLLMJson: input is not a string");
//       return {};
//     }

//     // Step 1: unwrap Gemini/Claude style wrapper if present
//     try {
//       const maybeParsed = JSON.parse(text);
//       if (maybeParsed && typeof maybeParsed.output_text === "string") {
//         text = maybeParsed.output_text;
//       }
//     } catch {
//       // continue
//     }

//     // Step 2: strip markdown fences
//     let cleaned = text.trim()
//       .replace(/```json\s*/gi, "")
//       .replace(/```\s*/g, "")
//       .replace(/^json\s*/gi, "");

//     // Step 3: remove wrapping quotes if it’s quoted JSON
//     if (
//       (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
//       (cleaned.startsWith("'") && cleaned.endsWith("'"))
//     ) {
//       cleaned = cleaned.slice(1, -1);
//     }

//     // ⚠️ Step 4: DO NOT unescape yet — just find JSON boundaries first
//     const objStart = cleaned.indexOf("{");
//     const objEnd = cleaned.lastIndexOf("}");
//     if (objStart === -1 || objEnd === -1) {
//       throw new Error("No JSON boundaries found");
//     }

//     let jsonText = cleaned.substring(objStart, objEnd + 1);

//     // Step 5: try parsing once — if it fails, attempt a gentle unescape pass
//     let parsed;
//     try {
//       parsed = JSON.parse(jsonText);
//     } catch {
//       // gentle fallback: only normalize double-escaped characters
//       const fallback = jsonText
//         .replace(/\\\\n/g, "\\n")
//         .replace(/\\\\t/g, "\\t")
//         .replace(/\\\\/g, "\\")
//         .replace(/\\"/g, '"');
//       parsed = JSON.parse(fallback);
//     }

//     // Step 6: normalize string fields post-parse (convert \n to real line breaks)
//     const normalizeStrings = (obj) => {
//       if (Array.isArray(obj)) return obj.map(normalizeStrings);
//       if (obj && typeof obj === "object") {
//         for (const k of Object.keys(obj)) {
//           if (typeof obj[k] === "string") {
//             obj[k] = obj[k].replace(/\\n/g, "\n").trim();
//           } else if (typeof obj[k] === "object") {
//             obj[k] = normalizeStrings(obj[k]);
//           }
//         }
//       }
//       return obj;
//     };

//     return normalizeStrings(parsed);

//   } catch (err) {
//     console.error("❌ cleanAndParseLLMJson failed:", err.message);
//     console.error(
//       "🔍 Raw input preview:",
//       (text || "").substring(0, 300) + (text.length > 300 ? "..." : "")
//     );
//     return {};
//   }
// }










// 🔧 Utility to convert a File object to Base64 safely
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // ✅ Safely remove the prefix (works for all file types)
      const base64String = reader.result.toString().replace(/^data:.*;base64,/, "");
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Sends a file to a specific LLM backend
 * @param {File} file - The file to process
 * @param {string} prompt - Custom extraction or analysis prompt
 * @param {"openai"|"claude"|"gemini"} model - Which backend to call
 * @param {string} clientId - The MongoDB client _id
 * @returns {Promise<Object>} The JSON response from the server
 */
export async function processFileWithBackend(file, prompt = "", model = "openai", clientId) {
  try {
    const base64Data = await fileToBase64(file);

    // Hardcoded backend URL
    const BASE_URL = "https://pilot-compare-backend.vercel.app/";

    // Map each model to its endpoint
    const endpointMap = {
      openai: `${BASE_URL}/api/openai/analyze`,
      claude: `${BASE_URL}/api/claude/analyze`,
      gemini: `${BASE_URL}/api/gemini/analyze`,
    };

    const endpoint = endpointMap[model.toLowerCase()] || endpointMap.openai;

    // 🚀 Send file to backend
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: clientId, // ✅ Important: required by backend
        fileName: file.name,
        fileType: file.type,
        fileData: base64Data,
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to process file with ${model}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error processing file with ${model}:`, error);
    throw error;
  }
}

/**
 * Convenience helpers for specific models
 */
export async function processWithOpenAI(file, prompt = "", clientId) {
  return processFileWithBackend(file, prompt, "openai", clientId);
}

export async function processWithClaude(file, prompt = "", clientId) {
  return processFileWithBackend(file, prompt, "claude", clientId);
}

export async function processWithGemini(file, prompt = "", clientId) {
  return processFileWithBackend(file, prompt, "gemini", clientId);
}

/**
 * Parses JSON responses from Gemini or similar APIs
 */
export function parseJsonFromTextForGemini(text) {
  try {
    return JSON.parse(text);
  } catch (directParseError) {
    try {
      let cleaned = text.trim();

      // Remove quotes or markdown fences
      if (
        (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
        (cleaned.startsWith("'") && cleaned.endsWith("'"))
      ) {
        cleaned = cleaned.slice(1, -1);
      }

      cleaned = cleaned
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .replace(/^json\s*/gi, "")
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "\n")
        .trim();

      // Extract JSON object or array
      const objStart = cleaned.indexOf("{");
      const objEnd = cleaned.lastIndexOf("}");
      const arrStart = cleaned.indexOf("[");
      const arrEnd = cleaned.lastIndexOf("]");

      let startIndex = objStart !== -1 ? objStart : arrStart;
      let endIndex = objEnd !== -1 ? objEnd : arrEnd;

      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No JSON object or array found");
      }

      const jsonText = cleaned.substring(startIndex, endIndex + 1);
      const result = JSON.parse(jsonText);
      return typeof result === "object" && result !== null ? result : {};
    } catch (cleanParseError) {
      const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          console.error("All parsing attempts failed");
        }
      }
      return text.includes("[") ? [] : {};
    }
  }
}

/**
 * Cleans and parses messy JSON strings from LLMs.
 * Handles markdown, escaped characters, and nested formatting.
 */
export function cleanAndParseLLMJson(text) {
  try {
    if (!text || typeof text !== "string") {
      console.warn("⚠️ cleanAndParseLLMJson: input is not a string");
      return {};
    }

    // Try unwrapping JSON-wrapped responses
    try {
      const maybeParsed = JSON.parse(text);
      if (maybeParsed && typeof maybeParsed.output_text === "string") {
        text = maybeParsed.output_text;
      }
    } catch {
      // ignore if not JSON
    }

    // Clean markdown/code fences
    let cleaned = text
      .trim()
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .replace(/^json\s*/gi, "");

    // Remove wrapping quotes
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1);
    }

    // Extract JSON boundaries
    const objStart = cleaned.indexOf("{");
    const objEnd = cleaned.lastIndexOf("}");
    if (objStart === -1 || objEnd === -1) throw new Error("No JSON boundaries found");

    let jsonText = cleaned.substring(objStart, objEnd + 1);

    // Try parsing (with fallback for escaped characters)
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      const fallback = jsonText
        .replace(/\\\\n/g, "\\n")
        .replace(/\\\\t/g, "\\t")
        .replace(/\\\\/g, "\\")
        .replace(/\\"/g, '"');
      parsed = JSON.parse(fallback);
    }

    // Normalize nested strings
    const normalizeStrings = (obj) => {
      if (Array.isArray(obj)) return obj.map(normalizeStrings);
      if (obj && typeof obj === "object") {
        for (const k of Object.keys(obj)) {
          if (typeof obj[k] === "string") {
            obj[k] = obj[k].replace(/\\n/g, "\n").trim();
          } else if (typeof obj[k] === "object") {
            obj[k] = normalizeStrings(obj[k]);
          }
        }
      }
      return obj;
    };

    return normalizeStrings(parsed);
  } catch (err) {
    console.error("❌ cleanAndParseLLMJson failed:", err.message);
    console.error(
      "🔍 Raw input preview:",
      (text || "").substring(0, 300) + (text.length > 300 ? "..." : "")
    );
    return {};
  }
}
