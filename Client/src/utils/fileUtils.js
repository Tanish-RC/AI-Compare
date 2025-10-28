// /**
//  * Converts a file to base64 string
//  * @param {File} file - The file to convert
//  * @returns {Promise<string>} A promise that resolves to the base64 string
//  */
// export async function fileToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       // Remove the data URL prefix (e.g., "data:image/png;base64,")
//       const base64String = reader.result.split(',')[1];
//       resolve(base64String);
//     };
//     reader.onerror = error => reject(error);
//   });
// }

// /**
//  * Sends a file to the backend for processing
//  * @param {File} file - The file to process
//  * @param {string} prompt - Optional prompt/instructions for processing
//  * @param {string} endpoint - The API endpoint to call (e.g., '/api/analyze')
//  * @returns {Promise<Object>} The response from the server
//  */
// export async function processFileWithBackend(file, prompt = '', endpoint = '/api/analyze') {
//   try {
//     const base64Data = await fileToBase64(file);
    
//     const response = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         fileName: file.name,
//         fileType: file.type,
//         fileData: base64Data,
//         prompt: prompt
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to process file');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error processing file:', error);
//     throw error;
//   }
// }

/**
 * Converts a file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} A promise that resolves to the base64 string
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Sends a file to a specific LLM backend
 * @param {File} file - The file to process
 * @param {string} prompt - Custom extraction or analysis prompt
 * @param {"openai"|"claude"|"gemini"} model - Which backend to call
 * @returns {Promise<Object>} The JSON response from the server
 */
export async function processFileWithBackend(file, prompt = "", model = "openai") {
  try {
    const base64Data = await fileToBase64(file);

    // Map model name to its endpoint
    const BASE_URL = "http://localhost:8081";

const endpointMap = {
  openai: `${BASE_URL}/api/openai/analyze`,
  claude: `${BASE_URL}/api/claude/analyze`,
  gemini: `${BASE_URL}/api/gemini/analyze`,
};

    const endpoint = endpointMap[model.toLowerCase()] || endpointMap.openai;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
export async function processWithOpenAI(file, prompt = "") {
  return processFileWithBackend(file, prompt, "openai");
}

export async function processWithClaude(file, prompt = "") {
  return processFileWithBackend(file, prompt, "claude");
}

export async function processWithGemini(file, prompt = "") {
  return processFileWithBackend(file, prompt, "gemini");
}

export function parseJsonFromTextForGemini(text) {
  try {
    // Step 1: Try direct JSON.parse first (fastest path)
    return JSON.parse(text);
  } catch (directParseError) {
    try {
      // Step 2: Clean up and extract JSON
      let cleaned = text.trim();
      // Remove outer quotes if the entire text is wrapped in quotes
      if (
        (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
        (cleaned.startsWith("'") && cleaned.endsWith("'"))
      ) {
        cleaned = cleaned.slice(1, -1);
      }
      // Remove markdown code blocks
      cleaned = cleaned.replace(/```json\s*/gi, "");
      cleaned = cleaned.replace(/```\s*/g, "");
      cleaned = cleaned.replace(/^json\s*/gi, "");
      // Handle escaped quotes and newlines
      cleaned = cleaned.replace(/\\"/g, '"');
      cleaned = cleaned.replace(/\\n/g, "\n");
      cleaned = cleaned.trim();
      // Find JSON boundaries - check for both objects and arrays
      let startIndex = -1;
      let endIndex = -1;
      const objStart = cleaned.indexOf("{");
      const objEnd = cleaned.lastIndexOf("}");
      const arrStart = cleaned.indexOf("[");
      const arrEnd = cleaned.lastIndexOf("]");
      // Determine which comes first (object or array)
      if (objStart !== -1 && (arrStart === -1 || objStart < arrStart)) {
        startIndex = objStart;
        endIndex = objEnd;
      } else if (arrStart !== -1) {
        startIndex = arrStart;
        endIndex = arrEnd;
      }
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No JSON object or array found");
      }
      // Extract just the JSON part
      let jsonText = cleaned.substring(startIndex, endIndex + 1);
      jsonText = jsonText.replace(/\\\\/g, "\\");
      const result = JSON.parse(jsonText);
      if (typeof result !== "object" || result === null) {
        throw new Error("Parsed result is not a valid JSON object or array");
      }
      return result;
    } catch (cleanParseError) {
      // Step 3: Last resort - try regex fallback
      try {
        const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (lastResortError) {
        console.error("All parsing attempts failed");
      }
      // Return appropriate empty value
      return text.includes("[") ? [] : {};
    }
  }
}

/**
 * Safely parse and clean a JSON string from an LLM response.
 * Handles markdown fences, escaped quotes, extra text, and both objects/arrays.
 *
 * @param {string} text - The raw model output (possibly messy JSON).
 * @returns {object|array} - The parsed JSON object or array. Returns {} on failure.
 */
export function cleanAndParseLLMJson(text) {
  try {
    if (!text || typeof text !== "string") {
      console.warn("⚠️ cleanAndParseLLMJson: input is not a string");
      return {};
    }

    // Step 1: Try direct parse first (fastest path)
    try {
      return JSON.parse(text);
    } catch {
      // continue to cleanup
    }

    // Step 2: Clean obvious markdown and escaped formatting
    let cleaned = text.trim();

    // Remove markdown code fences like ```json ... ```
    cleaned = cleaned.replace(/```json\s*/gi, "");
    cleaned = cleaned.replace(/```\s*/g, "");
    cleaned = cleaned.replace(/^json\s*/gi, "");

    // Remove wrapping quotes if text is quoted JSON
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1);
    }

    // Unescape common escaped characters
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\n/g, "\n");
    cleaned = cleaned.replace(/\\t/g, "\t");
    cleaned = cleaned.replace(/\\\\/g, "\\");

    // Step 3: Find first valid JSON boundary (object or array)
    const objStart = cleaned.indexOf("{");
    const objEnd = cleaned.lastIndexOf("}");
    const arrStart = cleaned.indexOf("[");
    const arrEnd = cleaned.lastIndexOf("]");

    let jsonText = "";

    if (objStart !== -1 && objEnd !== -1) {
      jsonText = cleaned.substring(objStart, objEnd + 1);
    } else if (arrStart !== -1 && arrEnd !== -1) {
      jsonText = cleaned.substring(arrStart, arrEnd + 1);
    } else {
      throw new Error("No JSON boundaries found");
    }

    // Step 4: Parse the extracted JSON safely
    const parsed = JSON.parse(jsonText);

    // ✅ Always return an object or array
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    } else {
      throw new Error("Parsed value is not a valid object/array");
    }
  } catch (err) {
    console.error("❌ cleanAndParseLLMJson failed:", err.message);
    console.error("🔍 Raw input preview:", (text || "").substring(0, 200) + "...");
    return {};
  }
}








