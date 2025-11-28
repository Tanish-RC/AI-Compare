


// /**
//  * ChartParser.ts
//  * -------------------
//  * Converts backend chart.llmSuggestions into ChartCodes for UI,
//  * and builds back a safe payload for saving to DB.
//  */

// import { availableModifiers } from "@/data/mockModifiers";
// import { Chart, ChartCodes, CodeEntry, LLMSuggestions, LLMCode } from "@/types/chart";

// /**
//  * Safely handles null/undefined provider structure.
//  */
// const safeLLMProvider = (
//   provider?: LLMSuggestions[keyof LLMSuggestions]
// ): { CPT_Codes: LLMCode[]; ICD_Codes: LLMCode[] } => ({
//   CPT_Codes: provider?.CPT_Codes || [],
//   ICD_Codes: provider?.ICD_Codes || [],
// });

// /**
//  * Converts a backend Chart into ChartCodes for UI display.
//  */
// export const parseChartCodes = (chart: Chart): ChartCodes => {
//   const llm = chart.llmSuggestions || {};

//   // Normalize LLM data
//   const openai = safeLLMProvider(llm.openai);
//   const claude = safeLLMProvider(llm.claude);
//   const gemini = safeLLMProvider(llm.gemini);

//   // Collect unique CPT & ICD codes across all LLMs
//   const allCPT = [
//     ...openai.CPT_Codes,
//     ...claude.CPT_Codes,
//     ...gemini.CPT_Codes,
//   ];
//   const uniqueCPT = Array.from(new Map(allCPT.map((c) => [c.code, c])).values());

//   const allICD = [
//     ...openai.ICD_Codes,
//     ...claude.ICD_Codes,
//     ...gemini.ICD_Codes,
//   ];
//   const uniqueICD = Array.from(new Map(allICD.map((d) => [d.code, d])).values());

//   const llmSuggestionsForUI: LLMSuggestions = { openai, claude, gemini };

//   // Build CPT Code entries
//   const cptCodes: CodeEntry[] = uniqueCPT.map((c) => ({
//     code: c.code,
//     description:
//       openai.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       claude.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       gemini.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       "",
//     llmSuggestions: llmSuggestionsForUI,
//     selected: true,
//     feedback: "",
//     customModifiers: availableModifiers.map((m) => ({ ...m })),
//   }));

//   // Build ICD Code entries
//   const icdCodes: CodeEntry[] = uniqueICD.map((d) => ({
//     code: d.code,
//     description:
//       openai.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       claude.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       gemini.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       "",
//     llmSuggestions: llmSuggestionsForUI,
//     selected: true,
//     feedback: "",
//     customModifiers: availableModifiers.map((m) => ({ ...m })),
//   }));

//   return {
//     chartId: chart._id,
//     cptCodes,
//     icdCodes,
//   };
// };

// /**
//  * Builds backend-compatible llmSuggestions payload
//  * from the edited ChartCodes (for saving to DB).
//  */
// export const buildLLMPayloadFromParsed = (parsed: ChartCodes): LLMSuggestions => {
//   const providers = ["openai", "claude", "gemini"] as const;
//   const payload: LLMSuggestions = {
//     openai: { CPT_Codes: [], ICD_Codes: [] },
//     claude: { CPT_Codes: [], ICD_Codes: [] },
//     gemini: { CPT_Codes: [], ICD_Codes: [] },
//   };

//   // Fill CPT
//   parsed.cptCodes.forEach((c) => {
//     providers.forEach((p) => {
//       const prov = c.llmSuggestions?.[p] as { CPT_Codes?: LLMCode[] } | undefined;
//       (payload[p]?.CPT_Codes || []).push({
//         code: c.code,
//         reasoning: prov?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning || "",
//         audit_trail:
//           prov?.CPT_Codes?.find((x) => x.code === c.code)?.audit_trail || "",
//         modifiers:
//           prov?.CPT_Codes?.find((x) => x.code === c.code)?.modifiers || [],
//       });
//     });
//   });

//   // Fill ICD
//   parsed.icdCodes.forEach((d) => {
//     providers.forEach((p) => {
//       const prov = d.llmSuggestions?.[p] as { ICD_Codes?: LLMCode[] } | undefined;
//       (payload[p]?.ICD_Codes || []).push({
//         code: d.code,
//         reasoning: prov?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning || "",
//         audit_trail:
//           prov?.ICD_Codes?.find((x) => x.code === d.code)?.audit_trail || "",
//       });
//     });
//   });

//   return payload;
// };


// /**
//  * Merges updated chart codes with existing ones to keep selected states.
//  */
// export const mergeChartCodes = (
//   oldCodes: ChartCodes | null,
//   newCodes: ChartCodes
// ): ChartCodes => {
//   if (!oldCodes) return newCodes;

//   const mergeCodes = (oldList: CodeEntry[], newList: CodeEntry[]) =>
//     newList.map((n) => {
//       const match = oldList.find((o) => o.code === n.code);
//       return match ? { ...n, selected: match.selected } : n;
//     });

//   return {
//     chartId: newCodes.chartId,
//     cptCodes: mergeCodes(oldCodes.cptCodes, newCodes.cptCodes),
//     icdCodes: mergeCodes(oldCodes.icdCodes, newCodes.icdCodes),
//   };
// };


// import { availableModifiers } from "@/data/mockModifiers";
// import { Chart, ChartCodes, CodeEntry, LLMSuggestions, LLMCode } from "@/types/chart";

// /**
//  * ✅ Safely handles any LLM provider structure.
//  */
// const safeLLMProvider = (provider: any = {}): { CPT_Codes: LLMCode[]; ICD_Codes: LLMCode[] } => ({
//   CPT_Codes: Array.isArray(provider.CPT_Codes) ? provider.CPT_Codes : [],
//   ICD_Codes: Array.isArray(provider.ICD_Codes) ? provider.ICD_Codes : [],
// });

// /**
//  * Converts a backend Chart into ChartCodes for UI display.
//  */
// export const parseChartCodes = (chart: Chart): ChartCodes => {
//   console.log("🧠 Chart passed into parseChartCodes:", chart);
//   console.log("🧠 chart.llmSuggestions type:", typeof chart.llmSuggestions, chart.llmSuggestions);
//   const llm = chart.llmSuggestions || {};

//   // Normalize LLM data
//   const openai = safeLLMProvider(llm.openai);
//   const claude = safeLLMProvider(llm.claude);
//   const gemini = safeLLMProvider(llm.gemini);
  

//   // Collect unique CPT & ICD codes across all LLMs
//   const allCPT = [...openai.CPT_Codes, ...claude.CPT_Codes, ...gemini.CPT_Codes];
//   const uniqueCPT = Array.from(new Map(allCPT.map((c) => [c.code, c])).values());

//   const allICD = [...openai.ICD_Codes, ...claude.ICD_Codes, ...gemini.ICD_Codes];
//   const uniqueICD = Array.from(new Map(allICD.map((d) => [d.code, d])).values());

//   const llmSuggestionsForUI: LLMSuggestions = { openai, claude, gemini };

//   // Build CPT Code entries
//   const cptCodes: CodeEntry[] = uniqueCPT.map((c) => ({
//     code: c.code,
//     description:
//       openai.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       claude.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       gemini.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       "",
//     llmSuggestions: llmSuggestionsForUI,
//     selected: true,
//     feedback: "",
//     customModifiers: availableModifiers.map((m) => ({ ...m })),
//   }));

//   // Build ICD Code entries
//   const icdCodes: CodeEntry[] = uniqueICD.map((d) => ({
//     code: d.code,
//     description:
//       openai.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       claude.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       gemini.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       "",
//     llmSuggestions: llmSuggestionsForUI,
//     selected: true,
//     feedback: "",
//     customModifiers: availableModifiers.map((m) => ({ ...m })),
//   }));

//   const parsed = { chartId: chart._id, cptCodes, icdCodes };
//   console.log("✅ Parsed chart codes:", parsed);
//   return parsed;
// };

// /**
//  * Builds backend-compatible llmSuggestions payload
//  */
// export const buildLLMPayloadFromParsed = (parsed: ChartCodes): LLMSuggestions => {
//   const providers = ["openai", "claude", "gemini"] as const;
//   const payload: LLMSuggestions = {
//     openai: { CPT_Codes: [], ICD_Codes: [] },
//     claude: { CPT_Codes: [], ICD_Codes: [] },
//     gemini: { CPT_Codes: [], ICD_Codes: [] },
//   };

//   parsed.cptCodes.forEach((c) => {
//     providers.forEach((p) => {
//       const prov = c.llmSuggestions?.[p] as { CPT_Codes?: LLMCode[] } | undefined;
//       payload[p]?.CPT_Codes?.push({
//         code: c.code,
//         reasoning: prov?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning || "",
//         audit_trail: prov?.CPT_Codes?.find((x) => x.code === c.code)?.audit_trail || "",
//         modifiers: prov?.CPT_Codes?.find((x) => x.code === c.code)?.modifiers || [],
//       });
//     });
//   });

//   parsed.icdCodes.forEach((d) => {
//     providers.forEach((p) => {
//       const prov = d.llmSuggestions?.[p] as { ICD_Codes?: LLMCode[] } | undefined;
//       payload[p]?.ICD_Codes?.push({
//         code: d.code,
//         reasoning: prov?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning || "",
//         audit_trail: prov?.ICD_Codes?.find((x) => x.code === d.code)?.audit_trail || "",
//       });
//     });
//   });

//   return payload;
// };

// /**
//  * Merge helper for refresh
//  */
// export const mergeChartCodes = (oldCodes: ChartCodes | null, newCodes: ChartCodes): ChartCodes => {
//   if (!oldCodes) return newCodes;

//   const mergeCodes = (oldList: CodeEntry[], newList: CodeEntry[]) =>
//     newList.map((n) => {
//       const match = oldList.find((o) => o.code === n.code);
//       return match ? { ...n, selected: match.selected } : n;
//     });

//   return {
//     chartId: newCodes.chartId,
//     cptCodes: mergeCodes(oldCodes.cptCodes, newCodes.cptCodes),
//     icdCodes: mergeCodes(oldCodes.icdCodes, newCodes.icdCodes),
//   };
// };


// import { availableModifiers } from "@/data/mockModifiers";
// import { Chart, ChartCodes, CodeEntry, LLMSuggestions, LLMCode } from "@/types/chart";

// /**
//  * ✅ Safely handles any LLM provider structure.
//  */
// const safeLLMProvider = (provider: any = {}): { CPT_Codes: LLMCode[]; ICD_Codes: LLMCode[] } => {
//   const cpt =
//     provider?.CPT_Codes ||
//     provider?.cpt_codes ||
//     provider?.cptCodes ||
//     provider?.codes ||
//     [];
//   const icd =
//     provider?.ICD_Codes ||
//     provider?.icd_codes ||
//     provider?.icdCodes ||
//     provider?.diagnoses ||
//     [];
//   const result = {
//     CPT_Codes: Array.isArray(cpt) ? cpt : [],
//     ICD_Codes: Array.isArray(icd) ? icd : [],
//   };
//   console.log("🔍 safeLLMProvider ->", { input: provider, output: result });
//   return result;
// };

// /**
//  * Converts a backend Chart into ChartCodes for UI display.
//  */
// export const parseChartCodes = (chart: Chart): ChartCodes => {
//   console.log("🧠 Chart passed into parseChartCodes:", chart);
//   console.log("🧠 chart.llmSuggestions type:", typeof chart.llmSuggestions, chart.llmSuggestions);

//   let llm = chart.llmSuggestions || {};
//   if (typeof llm === "string") {
//     try {
//       llm = JSON.parse(llm);
//       console.log("✅ Parsed stringified llmSuggestions:", llm);
//     } catch (err) {
//       console.error("❌ Failed to parse llmSuggestions JSON:", err);
//       llm = {};
//     }
//   }

//   console.log("🔍 llm.openai keys:", llm?.openai ? Object.keys(llm.openai) : "❌ none");
//   console.log("🔍 llm.claude keys:", llm?.claude ? Object.keys(llm.claude) : "❌ none");
//   console.log("🔍 llm.gemini keys:", llm?.gemini ? Object.keys(llm.gemini) : "❌ none");

//   // Normalize LLM data
//   const openai = safeLLMProvider(llm.openai);
//   const claude = safeLLMProvider(llm.claude);
//   const gemini = safeLLMProvider(llm.gemini);

//   console.log("✅ Normalized Providers:", { openai, claude, gemini });

//   // Collect unique CPT & ICD codes across all LLMs
//   const allCPT = [...openai.CPT_Codes, ...claude.CPT_Codes, ...gemini.CPT_Codes];
//   const allICD = [...openai.ICD_Codes, ...claude.ICD_Codes, ...gemini.ICD_Codes];

//   console.log("📦 allCPT length:", allCPT.length, allCPT);
//   console.log("📦 allICD length:", allICD.length, allICD);

//   const uniqueCPT = Array.from(new Map(allCPT.map((c) => [c.code, c])).values());
//   const uniqueICD = Array.from(new Map(allICD.map((d) => [d.code, d])).values());

//   console.log("✨ uniqueCPT:", uniqueCPT.map((c) => c.code));
//   console.log("✨ uniqueICD:", uniqueICD.map((d) => d.code));

//   const llmSuggestionsForUI: LLMSuggestions = { openai, claude, gemini };

//   // Build CPT Code entries
//   const cptCodes: CodeEntry[] = uniqueCPT.map((c) => ({
//     code: c.code,
//     description:
//       openai.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       claude.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       gemini.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       "",
//     llmSuggestions: llmSuggestionsForUI,
//     selected: true,
//     feedback: "",
//     customModifiers: availableModifiers.map((m) => ({ ...m })),
//   }));

//   // Build ICD Code entries
//   const icdCodes: CodeEntry[] = uniqueICD.map((d) => ({
//     code: d.code,
//     description:
//       openai.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       claude.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       gemini.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       "",
//     llmSuggestions: llmSuggestionsForUI,
//     selected: true,
//     feedback: "",
//     customModifiers: availableModifiers.map((m) => ({ ...m })),
//   }));

//   const parsed = { chartId: chart._id, cptCodes, icdCodes };
//   console.log("✅ Parsed chart codes:", parsed);
//   return parsed;
// };

// /**
//  * Builds backend-compatible llmSuggestions payload
//  */
// export const buildLLMPayloadFromParsed = (parsed: ChartCodes): LLMSuggestions => {
//   const providers = ["openai", "claude", "gemini"] as const;
//   const payload: LLMSuggestions = {
//     openai: { CPT_Codes: [], ICD_Codes: [] },
//     claude: { CPT_Codes: [], ICD_Codes: [] },
//     gemini: { CPT_Codes: [], ICD_Codes: [] },
//   };

//   parsed.cptCodes.forEach((c) => {
//     providers.forEach((p) => {
//       const prov = c.llmSuggestions?.[p] as { CPT_Codes?: LLMCode[] } | undefined;
//       payload[p]?.CPT_Codes?.push({
//         code: c.code,
//         reasoning: prov?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning || "",
//         audit_trail: prov?.CPT_Codes?.find((x) => x.code === c.code)?.audit_trail || "",
//         modifiers: prov?.CPT_Codes?.find((x) => x.code === c.code)?.modifiers || [],
//       });
//     });
//   });

//   parsed.icdCodes.forEach((d) => {
//     providers.forEach((p) => {
//       const prov = d.llmSuggestions?.[p] as { ICD_Codes?: LLMCode[] } | undefined;
//       payload[p]?.ICD_Codes?.push({
//         code: d.code,
//         reasoning: prov?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning || "",
//         audit_trail: prov?.ICD_Codes?.find((x) => x.code === d.code)?.audit_trail || "",
//       });
//     });
//   });

//   console.log("💾 buildLLMPayloadFromParsed output:", payload);
//   return payload;
// };

// /**
//  * Merge helper for refresh
//  */
// export const mergeChartCodes = (oldCodes: ChartCodes | null, newCodes: ChartCodes): ChartCodes => {
//   if (!oldCodes) return newCodes;

//   const mergeCodes = (oldList: CodeEntry[], newList: CodeEntry[]) =>
//     newList.map((n) => {
//       const match = oldList.find((o) => o.code === n.code);
//       return match ? { ...n, selected: match.selected } : n;
//     });

//   const merged = {
//     chartId: newCodes.chartId,
//     cptCodes: mergeCodes(oldCodes.cptCodes, newCodes.cptCodes),
//     icdCodes: mergeCodes(oldCodes.icdCodes, newCodes.icdCodes),
//   };

//   console.log("🔄 mergeChartCodes result:", merged);
//   return merged;
// };

// import { availableModifiers } from "@/data/mockModifiers";
// import { Chart, ChartCodes, CodeEntry, LLMSuggestions, LLMCode } from "@/types/chart";

// /**
//  * ✅ Safely handles any LLM provider structure.
//  */
// const safeLLMProvider = (provider: any = {}): { CPT_Codes: LLMCode[]; ICD_Codes: LLMCode[] } => {
//   const cpt =
//     provider?.CPT_Codes ||
//     provider?.cpt_codes ||
//     provider?.cptCodes ||
//     provider?.codes ||
//     [];
//   const icd =
//     provider?.ICD_Codes ||
//     provider?.icd_codes ||
//     provider?.icdCodes ||
//     provider?.diagnoses ||
//     [];
//   const result = {
//     CPT_Codes: Array.isArray(cpt) ? cpt : [],
//     ICD_Codes: Array.isArray(icd) ? icd : [],
//   };
//   console.log("🔍 safeLLMProvider ->", { input: provider, output: result });
//   return result;
// };

// /**
//  * Converts a backend Chart into ChartCodes for UI display.
//  */
// export const parseChartCodes = (chart: Chart): ChartCodes => {
//   console.log("🧠 Chart passed into parseChartCodes:", chart);
//   console.log("🧠 chart.llmSuggestions type:", typeof chart.llmSuggestions, chart.llmSuggestions);

//   let llm = chart.llmSuggestions || {};
//   if (typeof llm === "string") {
//     try {
//       llm = JSON.parse(llm);
//       console.log("✅ Parsed stringified llmSuggestions:", llm);
//     } catch (err) {
//       console.error("❌ Failed to parse llmSuggestions JSON:", err);
//       llm = {};
//     }
//   }

//   console.log("🔍 llm.openai keys:", llm?.openai ? Object.keys(llm.openai) : "❌ none");
//   console.log("🔍 llm.claude keys:", llm?.claude ? Object.keys(llm.claude) : "❌ none");
//   console.log("🔍 llm.gemini keys:", llm?.gemini ? Object.keys(llm.gemini) : "❌ none");

//   // Normalize LLM data
//   const openai = safeLLMProvider(llm.openai);
//   const claude = safeLLMProvider(llm.claude);
//   const gemini = safeLLMProvider(llm.gemini);

//   console.log("✅ Normalized Providers:", { openai, claude, gemini });

//   // Collect unique CPT & ICD codes across all LLMs
//   const allCPT = [...openai.CPT_Codes, ...claude.CPT_Codes, ...gemini.CPT_Codes];
//   const allICD = [...openai.ICD_Codes, ...claude.ICD_Codes, ...gemini.ICD_Codes];

//   console.log("📦 allCPT length:", allCPT.length, allCPT);
//   console.log("📦 allICD length:", allICD.length, allICD);

//   const uniqueCPT = Array.from(new Map(allCPT.map((c) => [c.code, c])).values());
//   const uniqueICD = Array.from(new Map(allICD.map((d) => [d.code, d])).values());

//   console.log("✨ uniqueCPT:", uniqueCPT.map((c) => c.code));
//   console.log("✨ uniqueICD:", uniqueICD.map((d) => d.code));

//   const llmSuggestionsForUI: LLMSuggestions = { openai, claude, gemini };

//   // Build CPT Code entries
//   const cptCodes: CodeEntry[] = uniqueCPT.map((c) => ({
//     code: c.code,
//     description:
//       openai.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       claude.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       gemini.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
//       "",
//     llmSuggestions: llmSuggestionsForUI,
//     selected: true,
//     feedback: "",
//     customModifiers: availableModifiers.map((m) => ({ ...m })),
//   }));

//   // Build ICD Code entries
//   const icdCodes: CodeEntry[] = uniqueICD.map((d) => ({
//     code: d.code,
//     description:
//       openai.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       claude.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       gemini.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
//       "",
//     llmSuggestions: llmSuggestionsForUI,
//     selected: true,
//     feedback: "",
//     customModifiers: availableModifiers.map((m) => ({ ...m })),
//   }));

//   const parsed = { chartId: chart._id, cptCodes, icdCodes };
//   console.log("✅ Parsed chart codes:", parsed);
//   return parsed;
// };

// /**
//  * Builds backend-compatible llmSuggestions payload
//  */
// export const buildLLMPayloadFromParsed = (parsed: ChartCodes): LLMSuggestions => {
//   const providers = ["openai", "claude", "gemini"] as const;
//   const payload: LLMSuggestions = {
//     openai: { CPT_Codes: [], ICD_Codes: [] },
//     claude: { CPT_Codes: [], ICD_Codes: [] },
//     gemini: { CPT_Codes: [], ICD_Codes: [] },
//   };

//   parsed.cptCodes.forEach((c) => {
//     providers.forEach((p) => {
//       const prov = c.llmSuggestions?.[p] as { CPT_Codes?: LLMCode[] } | undefined;
//       payload[p]?.CPT_Codes?.push({
//         code: c.code,
//         reasoning: prov?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning || "",
//         audit_trail: prov?.CPT_Codes?.find((x) => x.code === c.code)?.audit_trail || "",
//         modifiers: prov?.CPT_Codes?.find((x) => x.code === c.code)?.modifiers || [],
//       });
//     });
//   });

//   parsed.icdCodes.forEach((d) => {
//     providers.forEach((p) => {
//       const prov = d.llmSuggestions?.[p] as { ICD_Codes?: LLMCode[] } | undefined;
//       payload[p]?.ICD_Codes?.push({
//         code: d.code,
//         reasoning: prov?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning || "",
//         audit_trail: prov?.ICD_Codes?.find((x) => x.code === d.code)?.audit_trail || "",
//       });
//     });
//   });

//   console.log("💾 buildLLMPayloadFromParsed output:", payload);
//   return payload;
// };

// /**
//  * Merge helper for refresh
//  */
// export const mergeChartCodes = (oldCodes: ChartCodes | null, newCodes: ChartCodes): ChartCodes => {
//   if (!oldCodes) return newCodes;

//   const mergeCodes = (oldList: CodeEntry[], newList: CodeEntry[]) =>
//     newList.map((n) => {
//       const match = oldList.find((o) => o.code === n.code);
//       return match ? { ...n, selected: match.selected } : n;
//     });

//   const merged = {
//     chartId: newCodes.chartId,
//     cptCodes: mergeCodes(oldCodes.cptCodes, newCodes.cptCodes),
//     icdCodes: mergeCodes(oldCodes.icdCodes, newCodes.icdCodes),
//   };

//   console.log("🔄 mergeChartCodes result:", merged);
//   return merged;
// };


import { availableModifiers } from "@/data/mockModifiers";
import {
  Chart,
  ChartCodes,
  CodeEntry,
  LLMSuggestions,
  LLMCode,
  LLMRawSuggestions,
  LLMProviderFlattened,
} from "@/types/chart";

/**
 * ✅ Normalize provider structure safely.
 */
const safeLLMProvider = (provider: any = {}): { CPT_Codes: LLMCode[]; ICD_Codes: LLMCode[] } => {
  const cpt =
    provider?.CPT_Codes ||
    provider?.cpt_codes ||
    provider?.cptCodes ||
    provider?.codes ||
    [];
  const icd =
    provider?.ICD_Codes ||
    provider?.icd_codes ||
    provider?.icdCodes ||
    provider?.diagnoses ||
    [];
  const result = {
    CPT_Codes: Array.isArray(cpt) ? cpt : [],
    ICD_Codes: Array.isArray(icd) ? icd : [],
  };
  console.log("🔍 safeLLMProvider ->", { input: provider, output: result });
  return result;
};

/**
 * ✅ Converts backend Chart into UI-ready structure
 * (flattens reasoning, audit_trail, modifiers)
 */
export const parseChartCodes = (chart: Chart): ChartCodes => {
  console.log("🧠 parseChartCodes called with chart:", chart);

  let llm: LLMRawSuggestions = {};
  if (typeof chart.llmSuggestions === "string") {
    try {
      llm = JSON.parse(chart.llmSuggestions);
    } catch (err) {
      console.error("❌ Failed to parse llmSuggestions string:", err);
    }
  } else {
    llm = chart.llmSuggestions || {};
  }

  const openai = safeLLMProvider(llm.openai);
  const claude = safeLLMProvider(llm.claude);
  const gemini = safeLLMProvider(llm.gemini);

  // Collect unique codes across providers
  const allCPT = [...openai.CPT_Codes, ...claude.CPT_Codes, ...gemini.CPT_Codes];
  const allICD = [...openai.ICD_Codes, ...claude.ICD_Codes, ...gemini.ICD_Codes];
  const uniqueCPT = Array.from(new Map(allCPT.map((c) => [c.code, c])).values());
  const uniqueICD = Array.from(new Map(allICD.map((d) => [d.code, d])).values());

  console.log("✨ uniqueCPT:", uniqueCPT.map((c) => c.code));
  console.log("✨ uniqueICD:", uniqueICD.map((d) => d.code));

  // Helper to flatten LLM fields for a specific code
  const flattenLLMDetails = (
    code: string,
    provider: { CPT_Codes: LLMCode[]; ICD_Codes: LLMCode[] },
    type: "CPT" | "ICD"
  ): LLMProviderFlattened => {
    const list = type === "CPT" ? provider.CPT_Codes : provider.ICD_Codes;
    const match = list.find((x) => x.code === code);
    return {
      suggested: !!match,
      reasoning: match?.reasoning || "",
      audit_trail: match?.audit_trail || "",
      modifiers: match?.modifiers || [],
      selectedModifiers: match?.selectedModifiers || [],
    };
  };

  // ✅ Build CPT code entries
  const cptCodes: CodeEntry[] = uniqueCPT.map((c) => ({
    code: c.code,
    description:
      openai.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
      claude.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
      gemini.CPT_Codes.find((x) => x.code === c.code)?.reasoning ||
      "",
    llmSuggestions: {
      openai: flattenLLMDetails(c.code, openai, "CPT"),
      claude: flattenLLMDetails(c.code, claude, "CPT"),
      gemini: flattenLLMDetails(c.code, gemini, "CPT"),
    },
    selected: true,
    feedback: "",
    customModifiers: availableModifiers.map((m) => ({ ...m })),
  }));

  // ✅ Build ICD code entries
  const icdCodes: CodeEntry[] = uniqueICD.map((d) => ({
    code: d.code,
    description:
      openai.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
      claude.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
      gemini.ICD_Codes.find((x) => x.code === d.code)?.reasoning ||
      "",
    llmSuggestions: {
      openai: flattenLLMDetails(d.code, openai, "ICD"),
      claude: flattenLLMDetails(d.code, claude, "ICD"),
      gemini: flattenLLMDetails(d.code, gemini, "ICD"),
    },
    selected: true,
    feedback: "",
    customModifiers: availableModifiers.map((m) => ({ ...m })),
  }));

  const parsed = { chartId: chart._id, cptCodes, icdCodes };
  console.log("✅ Parsed chart codes (flattened):", parsed);
  return parsed;
};

/**
 * ✅ Converts flattened UI codes back into backend structure.
 */
export const buildLLMPayloadFromParsed = (parsed: ChartCodes): LLMRawSuggestions => {
  const providers = ["openai", "claude", "gemini"] as const;
  const payload: LLMRawSuggestions = {
    openai: { CPT_Codes: [], ICD_Codes: [] },
    claude: { CPT_Codes: [], ICD_Codes: [] },
    gemini: { CPT_Codes: [], ICD_Codes: [] },
  };

  parsed.cptCodes.forEach((c) => {
    providers.forEach((p) => {
      const prov = c.llmSuggestions[p];
      payload[p]?.CPT_Codes?.push({
        code: c.code,
        reasoning: prov.reasoning,
        audit_trail: prov.audit_trail,
        modifiers: prov.modifiers,
        selectedModifiers: prov.selectedModifiers,
      });
    });
  });

  parsed.icdCodes.forEach((d) => {
    providers.forEach((p) => {
      const prov = d.llmSuggestions[p];
      payload[p]?.ICD_Codes?.push({
        code: d.code,
        reasoning: prov.reasoning,
        audit_trail: prov.audit_trail,
      });
    });
  });

  console.log("💾 buildLLMPayloadFromParsed output:", payload);
  return payload;
};

/**
 * ✅ Merge helper for refresh (preserves selection state)
 */
export const mergeChartCodes = (oldCodes: ChartCodes | null, newCodes: ChartCodes): ChartCodes => {
  if (!oldCodes) return newCodes;

  const mergeCodes = (oldList: CodeEntry[], newList: CodeEntry[]) =>
    newList.map((n) => {
      const match = oldList.find((o) => o.code === n.code);
      return match ? { ...n, selected: match.selected } : n;
    });

  const merged = {
    chartId: newCodes.chartId,
    cptCodes: mergeCodes(oldCodes.cptCodes, newCodes.cptCodes),
    icdCodes: mergeCodes(oldCodes.icdCodes, newCodes.icdCodes),
  };

  console.log("🔄 mergeChartCodes result:", merged);
  return merged;
};
