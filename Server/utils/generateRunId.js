// utils/generateRunId.js
export default function generateRunId(prefix = "run") {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}


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
