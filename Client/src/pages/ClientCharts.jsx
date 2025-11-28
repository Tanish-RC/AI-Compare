



// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import { parseChartCodes, buildLLMPayloadFromParsed } from "@/utils/ChartParser";
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");
//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);
//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   // ------------------ fetch charts ------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts list.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId]);

//   // ------------------ fetch chart details ------------------
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("fetch chart details failed");
//       const data = await res.json();

//       const normalizeLLMs = (codes) =>
//         codes.map((c) => {
//           const updatedLLMs = { ...(c.llmSuggestions || {}) };
//           for (const key of Object.keys(updatedLLMs || {})) {
//             const llm = updatedLLMs[key] || {};
//             if (llm?.modifiers?.length && (!llm.selectedModifiers || !llm.selectedModifiers.length)) {
//               updatedLLMs[key] = { ...llm, selectedModifiers: [...llm.modifiers] };
//             }
//           }
//           return {
//             ...c,
//             llmSuggestions: updatedLLMs,
//             customModifiers: c.customModifiers || [],
//             selected: !!c.selected,
//             feedback: c.feedback || "",
//           };
//         });

//       const parsed = parseChartCodes(data);

//       const normalizedParsed = {
//         ...parsed,
//         cptCodes: normalizeLLMs(parsed.cptCodes || []),
//         icdCodes: normalizeLLMs(parsed.icdCodes || []),
//       };

//       setSelectedChartDetails(data);
//       setSelectedChartCodes(normalizedParsed);
//     } catch (err) {
//       console.error("fetchChartDetails err", err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ------------------ handlers for codes ------------------
//   const toggleCodeSelected = (type, codeStr) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });
//   };

//   const updateCodeFeedback = (type, codeStr, feedback) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) =>
//           c.code === codeStr ? { ...c, feedback } : c
//         ),
//       };
//     });
//   };

//   const toggleProviderModifier = (type, codeStr, provider, mod) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) => {
//           if (c.code !== codeStr) return c;
//           const llmSuggestions = { ...c.llmSuggestions };
//           const prov = { ...(llmSuggestions[provider] || {}) };
//           const mods = prov.modifiers || [];
//           let selected = prov.selectedModifiers || [...mods];

//           selected = selected.includes(mod)
//             ? selected.filter((m) => m !== mod)
//             : [...selected, mod];

//           prov.selectedModifiers = selected;
//           llmSuggestions[provider] = prov;
//           return { ...c, llmSuggestions };
//         }),
//       };
//     });
//   };

//   const toggleCustomModifier = (type, codeStr, mod) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           const idx = existing.findIndex((m) => m.code === mod);

//           if (idx >= 0) {
//             existing[idx] = { ...existing[idx], selected: !existing[idx].selected };
//           } else {
//             existing.push({ code: mod, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });
//   };

//   const addCustomModifier = (type, codeStr, modifier) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           if (!existing.some((m) => m.code === modifier.code)) {
//             existing.push({ code: modifier.code, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });
//   };

//   const addCustomCode = (type, codeStr, desc) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";

//       if (prev[arrKey].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [arrKey]: [newCode, ...prev[arrKey]],
//       };
//     });
//   };

//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),
//     onUpdateCPTFeedback: (code, feedback) =>
//       updateCodeFeedback("cpt", code, feedback),
//     onUpdateICDFeedback: (code, feedback) =>
//       updateCodeFeedback("icd", code, feedback),
//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),
//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),
//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },
//   };

//   // ------------------ Save chart (LLM suggestions only) ------------------
//   const handleSaveChanges = async () => {
//     if (!selectedChartDetails || !selectedChartCodes) return;

//     setIsSaving(true);
//     try {
//       const llmPayload = buildLLMPayloadFromParsed(selectedChartCodes);

//       const body = {
//         _id: selectedChartDetails._id,
//         client: selectedChartDetails.client,
//         name: selectedChartDetails.name,
//         pdfUrl: selectedChartDetails.pdfUrl,
//         content: selectedChartDetails.content || "",
//         llmSuggestions: llmPayload,
//       };

//       const res = await fetch("http://localhost:8081/api/charts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) throw new Error("save failed");

//       toast({
//         title: "Saved",
//         description: "Chart updated successfully.",
//       });

//       const data = await getClientCharts(clientId);
//       setCharts(data || []);
//       await fetchChartDetails(selectedChartDetails._id);
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to save chart.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ------------------ Sidebar selection helpers ------------------
//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   // ------------------ Render ------------------
//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">
//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">Client Charts</h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>

//             {activeView === "compare" && selectedChart && (
//               <Button
//                 className="bg-green-600 text-white"
//                 onClick={handleSaveChanges}
//                 disabled={isSaving}
//               >
//                 {isSaving ? "Saving..." : "Save"}
//               </Button>
//             )}
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup
//           direction="horizontal"
//           className="flex-1 overflow-hidden"
//         >
//           {/* LEFT SIDEBAR */}
//           <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRerunAllCharts={() => {}} // ⭐ placeholder for now
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup
//                 direction="vertical"
//                 className="w-full h-full"
//               >
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer chart={selectedChartDetails} />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel
//               chartCodes={selectedChartCodes}
//               {...handlersForPanel}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </TooltipProvider>
//   );
// }



// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import { parseChartCodes, buildLLMPayloadFromParsed } from "@/utils/ChartParser";
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");
//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);
//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   // ------------------ fetch charts ------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts list.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId]);

//   // ------------------ fetch chart details ------------------
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("fetch chart details failed");
//       const data = await res.json();

//       const normalizeLLMs = (codes) =>
//         codes.map((c) => {
//           const updatedLLMs = { ...(c.llmSuggestions || {}) };
//           for (const key of Object.keys(updatedLLMs || {})) {
//             const llm = updatedLLMs[key] || {};
//             if (
//               llm?.modifiers?.length &&
//               (!llm.selectedModifiers || !llm.selectedModifiers.length)
//             ) {
//               updatedLLMs[key] = {
//                 ...llm,
//                 selectedModifiers: [...llm.modifiers],
//               };
//             }
//           }
//           return {
//             ...c,
//             llmSuggestions: updatedLLMs,
//             customModifiers: c.customModifiers || [],
//             selected: !!c.selected,
//             feedback: c.feedback || "",
//           };
//         });

//       const parsed = parseChartCodes(data);

//       const normalizedParsed = {
//         ...parsed,
//         cptCodes: normalizeLLMs(parsed.cptCodes || []),
//         icdCodes: normalizeLLMs(parsed.icdCodes || []),
//       };

//       setSelectedChartDetails(data);
//       setSelectedChartCodes(normalizedParsed);
//     } catch (err) {
//       console.error("fetchChartDetails err", err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ------------------ handlers for codes ------------------
//   const toggleCodeSelected = (type, codeStr) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });
//   };

//   const updateCodeFeedback = (type, codeStr, feedback) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) =>
//           c.code === codeStr ? { ...c, feedback } : c
//         ),
//       };
//     });
//   };

//   const toggleProviderModifier = (type, codeStr, provider, mod) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) => {
//           if (c.code !== codeStr) return c;
//           const llmSuggestions = { ...c.llmSuggestions };
//           const prov = { ...(llmSuggestions[provider] || {}) };
//           const mods = prov.modifiers || [];
//           let selected = prov.selectedModifiers || [...mods];

//           selected = selected.includes(mod)
//             ? selected.filter((m) => m !== mod)
//             : [...selected, mod];

//           prov.selectedModifiers = selected;
//           llmSuggestions[provider] = prov;
//           return { ...c, llmSuggestions };
//         }),
//       };
//     });
//   };

//   const toggleCustomModifier = (type, codeStr, mod) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           const idx = existing.findIndex((m) => m.code === mod);

//           if (idx >= 0) {
//             existing[idx] = {
//               ...existing[idx],
//               selected: !existing[idx].selected,
//             };
//           } else {
//             existing.push({ code: mod, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });
//   };

//   const addCustomModifier = (type, codeStr, modifier) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [arrKey]: prev[arrKey].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           if (!existing.some((m) => m.code === modifier.code)) {
//             existing.push({ code: modifier.code, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });
//   };

//   const addCustomCode = (type, codeStr, desc) => {
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const arrKey = type === "cpt" ? "cptCodes" : "icdCodes";

//       if (prev[arrKey].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [arrKey]: [newCode, ...prev[arrKey]],
//       };
//     });
//   };

//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),
//     onUpdateCPTFeedback: (code, feedback) =>
//       updateCodeFeedback("cpt", code, feedback),
//     onUpdateICDFeedback: (code, feedback) =>
//       updateCodeFeedback("icd", code, feedback),
//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),
//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),
//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },
//   };

//   // ------------------ Save chart LLM suggestions (kept for later use) ------------------
//   const handleSaveChanges = async () => {
//     if (!selectedChartDetails || !selectedChartCodes) return;

//     setIsSaving(true);
//     try {
//       const llmPayload = buildLLMPayloadFromParsed(selectedChartCodes);

//       const body = {
//         _id: selectedChartDetails._id,
//         client: selectedChartDetails.client,
//         name: selectedChartDetails.name,
//         pdfUrl: selectedChartDetails.pdfUrl,
//         content: selectedChartDetails.content || "",
//         llmSuggestions: llmPayload,
//       };

//       const res = await fetch("http://localhost:8081/api/charts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) throw new Error("save failed");

//       toast({
//         title: "Saved",
//         description: "Chart updated successfully.",
//       });

//       const data = await getClientCharts(clientId);
//       setCharts(data || []);
//       await fetchChartDetails(selectedChartDetails._id);
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to save chart.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ------------------ Sidebar helpers ------------------
//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   // ------------------ Render ------------------
//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">
//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">Client Charts</h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>

//             {/* ⭐ SAVE BUTTON REMOVED HERE */}
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup
//           direction="horizontal"
//           className="flex-1 overflow-hidden"
//         >
//           {/* LEFT SIDEBAR */}
//           <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRerunAllCharts={() => {}}
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup
//                 direction="vertical"
//                 className="w-full h-full"
//               >
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer chart={selectedChartDetails} />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel chartCodes={selectedChartCodes} {...handlersForPanel} />
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </TooltipProvider>
//   );
// }




// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import { parseChartCodes, buildLLMPayloadFromParsed } from "@/utils/ChartParser";
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");
//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);
//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   // ⭐ NEW: sidebar collapse state + ref
//   const sidebarRef = useRef(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // ------------------ fetch charts ------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts list.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId]);

//   // ------------------ fetch chart details ------------------
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("fetch chart details failed");
//       const data = await res.json();

//       const normalizeLLMs = (codes) =>
//         codes.map((c) => {
//           const updatedLLMs = { ...(c.llmSuggestions || {}) };
//           for (const key of Object.keys(updatedLLMs || {})) {
//             const llm = updatedLLMs[key] || {};
//             if (
//               llm?.modifiers?.length &&
//               (!llm.selectedModifiers || !llm.selectedModifiers.length)
//             ) {
//               updatedLLMs[key] = {
//                 ...llm,
//                 selectedModifiers: [...llm.modifiers],
//               };
//             }
//           }
//           return {
//             ...c,
//             llmSuggestions: updatedLLMs,
//             customModifiers: c.customModifiers || [],
//             selected: !!c.selected,
//             feedback: c.feedback || "",
//           };
//         });

//       const parsed = parseChartCodes(data);

//       const normalizedParsed = {
//         ...parsed,
//         cptCodes: normalizeLLMs(parsed.cptCodes || []),
//         icdCodes: normalizeLLMs(parsed.icdCodes || []),
//       };

//       setSelectedChartDetails(data);
//       setSelectedChartCodes(normalizedParsed);
//     } catch (err) {
//       console.error("fetchChartDetails err", err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ------------------ code handlers ------------------
//   const toggleCodeSelected = (type, codeStr) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });

//   const updateCodeFeedback = (type, codeStr, feedback) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, feedback } : c
//         ),
//       };
//     });

//   const toggleProviderModifier = (type, codeStr, provider, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;
//           const llmSuggestions = { ...c.llmSuggestions };
//           const prov = { ...(llmSuggestions[provider] || {}) };
//           const mods = prov.modifiers || [];
//           let selected = prov.selectedModifiers || [...mods];

//           selected = selected.includes(mod)
//             ? selected.filter((m) => m !== mod)
//             : [...selected, mod];

//           prov.selectedModifiers = selected;
//           llmSuggestions[provider] = prov;
//           return { ...c, llmSuggestions };
//         }),
//       };
//     });

//   const toggleCustomModifier = (type, codeStr, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           const idx = existing.findIndex((m) => m.code === mod);
//           if (idx >= 0) {
//             existing[idx] = {
//               ...existing[idx],
//               selected: !existing[idx].selected,
//             };
//           } else {
//             existing.push({ code: mod, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomModifier = (type, codeStr, modifier) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           if (!existing.some((m) => m.code === modifier.code)) {
//             existing.push({ code: modifier.code, selected: true });
//           }
//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomCode = (type, codeStr, desc) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       if (prev[key].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [key]: [newCode, ...prev[key]],
//       };
//     });

//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),
//     onUpdateCPTFeedback: (code, feedback) =>
//       updateCodeFeedback("cpt", code, feedback),
//     onUpdateICDFeedback: (code, feedback) =>
//       updateCodeFeedback("icd", code, feedback),
//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),
//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),

//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },
//   };

//   // ------------------ Sidebar helpers ------------------
//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   // ⭐ NEW: collapse toggle handler
//   const handleSidebarCollapseToggle = (collapsed) => {
//     setSidebarCollapsed(collapsed);

//     if (sidebarRef.current) {
//       sidebarRef.current.resize(collapsed ? 4 : 20);
//     }
//   };

//   // ------------------ Render ------------------
//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">
//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">Client Charts</h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
//           {/* LEFT SIDEBAR */}
//           <ResizablePanel
//             ref={sidebarRef}
//             defaultSize={20}
//             minSize={4}
//             maxSize={30}
//           >
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRerunAllCharts={() => {}}
//               onCollapseToggle={handleSidebarCollapseToggle}  // ⭐ new
//               collapsed={sidebarCollapsed}                    // ⭐ new
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup
//                 direction="vertical"
//                 className="w-full h-full"
//               >
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer chart={selectedChartDetails} />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel
//               chartCodes={selectedChartCodes}
//               {...handlersForPanel}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </TooltipProvider>
//   );
// }



// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import { parseChartCodes, buildLLMPayloadFromParsed } from "@/utils/ChartParser";
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// import PromptManagerModal from "@/components/PromptManagerModal";

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");
//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);
//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   // sidebar collapse state
//   const sidebarRef = useRef(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // Prompt modal state
//   const [promptModalOpen, setPromptModalOpen] = useState(false);

//   // ------------------ fetch charts ------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts list.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId]);

//   // ------------------ fetch chart details ------------------
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("fetch chart details failed");
//       const data = await res.json();

//       const normalizeLLMs = (codes) =>
//         codes.map((c) => {
//           const updatedLLMs = { ...(c.llmSuggestions || {}) };
//           for (const key of Object.keys(updatedLLMs || {})) {
//             const llm = updatedLLMs[key] || {};
//             if (
//               llm?.modifiers?.length &&
//               (!llm.selectedModifiers || !llm.selectedModifiers.length)
//             ) {
//               updatedLLMs[key] = {
//                 ...llm,
//                 selectedModifiers: [...llm.modifiers],
//               };
//             }
//           }
//           return {
//             ...c,
//             llmSuggestions: updatedLLMs,
//             customModifiers: c.customModifiers || [],
//             selected: !!c.selected,
//             feedback: c.feedback || "",
//           };
//         });

//       const parsed = parseChartCodes(data);

//       const normalizedParsed = {
//         ...parsed,
//         cptCodes: normalizeLLMs(parsed.cptCodes || []),
//         icdCodes: normalizeLLMs(parsed.icdCodes || []),
//       };

//       setSelectedChartDetails(data);
//       setSelectedChartCodes(normalizedParsed);
//     } catch (err) {
//       console.error("fetchChartDetails err", err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ------------------ code handlers (unchanged) ------------------
//   const toggleCodeSelected = (type, codeStr) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });

//   const updateCodeFeedback = (type, codeStr, feedback) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, feedback } : c
//         ),
//       };
//     });

//   const toggleProviderModifier = (type, codeStr, provider, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;
//           const llmSuggestions = { ...c.llmSuggestions };
//           const prov = { ...(llmSuggestions[provider] || {}) };
//           const mods = prov.modifiers || [];
//           let selected = prov.selectedModifiers || [...mods];

//           selected = selected.includes(mod)
//             ? selected.filter((m) => m !== mod)
//             : [...selected, mod];

//           prov.selectedModifiers = selected;
//           llmSuggestions[provider] = prov;
//           return { ...c, llmSuggestions };
//         }),
//       };
//     });

//   const toggleCustomModifier = (type, codeStr, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           const idx = existing.findIndex((m) => m.code === mod);
//           if (idx >= 0) {
//             existing[idx] = {
//               ...existing[idx],
//               selected: !existing[idx].selected,
//             };
//           } else {
//             existing.push({ code: mod, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomModifier = (type, codeStr, modifier) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           if (!existing.some((m) => m.code === modifier.code)) {
//             existing.push({ code: modifier.code, selected: true });
//           }
//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomCode = (type, codeStr, desc) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       if (prev[key].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [key]: [newCode, ...prev[key]],
//       };
//     });

//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),
//     onUpdateCPTFeedback: (code, feedback) =>
//       updateCodeFeedback("cpt", code, feedback),
//     onUpdateICDFeedback: (code, feedback) =>
//       updateCodeFeedback("icd", code, feedback),
//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),
//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),

//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },
//   };

//   // sidebar helpers
//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   // collapse toggle handler
//   const handleSidebarCollapseToggle = (collapsed) => {
//     setSidebarCollapsed(collapsed);
//     if (sidebarRef.current) {
//       sidebarRef.current.resize?.(collapsed ? 4 : 20);
//     }
//   };

//   // Render
//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">
//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">Client Charts</h1>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Prompts button immediately left of Upload Charts */}
//             <Button variant="outline" onClick={() => setPromptModalOpen(true)}>
//               Prompts
//             </Button>

//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
//           {/* LEFT SIDEBAR */}
//           <ResizablePanel
//             ref={sidebarRef}
//             defaultSize={20}
//             minSize={4}
//             maxSize={30}
//           >
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRerunAllCharts={() => {}}
//               onCollapseToggle={handleSidebarCollapseToggle}
//               collapsed={sidebarCollapsed}
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup
//                 direction="vertical"
//                 className="w-full h-full"
//               >
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer chart={selectedChartDetails} />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel
//               chartCodes={selectedChartCodes}
//               {...handlersForPanel}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>

//         {/* Prompt modal */}
//         <PromptManagerModal
//           open={promptModalOpen}
//           onOpenChange={setPromptModalOpen}
//           clientId={clientId}
//         />
//       </div>
//     </TooltipProvider>
//   );
// }


// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import { parseChartCodes, buildLLMPayloadFromParsed } from "@/utils/ChartParser";
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// import PromptManagerModal from "@/components/PromptManagerModal";

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");
//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);
//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   // Sidebar collapse state
//   const sidebarRef = useRef(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // Prompt modal state
//   const [promptModalOpen, setPromptModalOpen] = useState(false);

//   // ------------------ fetch charts ------------------
//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts list.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId]);

//   // ------------------ fetch chart details ------------------
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("fetch chart details failed");
//       const data = await res.json();

//       const normalizeLLMs = (codes) =>
//         codes.map((c) => {
//           const updatedLLMs = { ...(c.llmSuggestions || {}) };
//           for (const key of Object.keys(updatedLLMs || {})) {
//             const llm = updatedLLMs[key] || {};
//             if (
//               llm?.modifiers?.length &&
//               (!llm.selectedModifiers || !llm.selectedModifiers.length)
//             ) {
//               updatedLLMs[key] = {
//                 ...llm,
//                 selectedModifiers: [...llm.modifiers],
//               };
//             }
//           }
//           return {
//             ...c,
//             llmSuggestions: updatedLLMs,
//             customModifiers: c.customModifiers || [],
//             selected: !!c.selected,
//             feedback: c.feedback || "",
//           };
//         });

//       const parsed = parseChartCodes(data);

//       const normalizedParsed = {
//         ...parsed,
//         cptCodes: normalizeLLMs(parsed.cptCodes || []),
//         icdCodes: normalizeLLMs(parsed.icdCodes || []),
//       };

//       setSelectedChartDetails(data);
//       setSelectedChartCodes(normalizedParsed);
//     } catch (err) {
//       console.error("fetchChartDetails err", err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ------------------ code handlers (unchanged) ------------------
//   const toggleCodeSelected = (type, codeStr) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });

//   const updateCodeFeedback = (type, codeStr, feedback) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, feedback } : c
//         ),
//       };
//     });

//   const toggleProviderModifier = (type, codeStr, provider, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;
//           const llmSuggestions = { ...c.llmSuggestions };
//           const prov = { ...(llmSuggestions[provider] || {}) };
//           const mods = prov.modifiers || [];
//           let selected = prov.selectedModifiers || [...mods];

//           selected = selected.includes(mod)
//             ? selected.filter((m) => m !== mod)
//             : [...selected, mod];

//           prov.selectedModifiers = selected;
//           llmSuggestions[provider] = prov;
//           return { ...c, llmSuggestions };
//         }),
//       };
//     });

//   const toggleCustomModifier = (type, codeStr, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           const idx = existing.findIndex((m) => m.code === mod);
//           if (idx >= 0) {
//             existing[idx] = {
//               ...existing[idx],
//               selected: !existing[idx].selected,
//             };
//           } else {
//             existing.push({ code: mod, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomModifier = (type, codeStr, modifier) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           if (!existing.some((m) => m.code === modifier.code)) {
//             existing.push({ code: modifier.code, selected: true });
//           }
//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomCode = (type, codeStr, desc) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       if (prev[key].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [key]: [newCode, ...prev[key]],
//       };
//     });

//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),
//     onUpdateCPTFeedback: (code, feedback) =>
//       updateCodeFeedback("cpt", code, feedback),
//     onUpdateICDFeedback: (code, feedback) =>
//       updateCodeFeedback("icd", code, feedback),
//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),
//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),

//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },
//   };

//   // Sidebar helpers
//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   // Collapse toggle handler
//   const handleSidebarCollapseToggle = (collapsed) => {
//     setSidebarCollapsed(collapsed);
//     if (sidebarRef.current) {
//       sidebarRef.current.resize?.(collapsed ? 4 : 20);
//     }
//   };

//   // ------------------ Render ------------------
//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">
//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">Client Charts</h1>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Prompts button left of Upload Charts */}
//             <Button variant="outline" onClick={() => setPromptModalOpen(true)}>
//               Prompts
//             </Button>

//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          
//           {/* LEFT SIDEBAR */}
//           <ResizablePanel
//             ref={sidebarRef}
//             defaultSize={20}
//             minSize={4}
//             maxSize={30}
//           >
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRerunAllCharts={() => {}}
//               onCollapseToggle={handleSidebarCollapseToggle}
//               collapsed={sidebarCollapsed}
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup
//                 direction="vertical"
//                 className="w-full h-full"
//               >
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer chart={selectedChartDetails} />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel
//               chartCodes={selectedChartCodes}
//               {...handlersForPanel}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>

//         {/* PROMPT MODAL */}
//         <PromptManagerModal
//           open={promptModalOpen}
//           onClose={() => setPromptModalOpen(false)}
//           clientId={clientId}
//         />
//       </div>
//     </TooltipProvider>
//   );
// }


// src/pages/ClientCharts.jsx

// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import { parseChartCodes } from "@/utils/ChartParser";
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";

// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// import PromptManagerModal from "@/components/PromptManagerModal";
// import RunChartsModal from "../components/RunChartsModal"; // NEW

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");

//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);
//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   // sidebar collapse
//   const sidebarRef = useRef(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // modals
//   const [promptModalOpen, setPromptModalOpen] = useState(false);
//   const [runModalOpen, setRunModalOpen] = useState(false); // NEW

//   // ---------------- Load charts ----------------
//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId]);

//   // ---------------- Load chart details ----------------
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("Failed to fetch chart details");

//       const data = await res.json();

//       const normalizeLLMs = (codes) =>
//         codes.map((c) => {
//           const updatedLLMs = { ...(c.llmSuggestions || {}) };

//           // Ensure selectedModifiers is initialized when missing
//           for (const key of Object.keys(updatedLLMs || {})) {
//             const llm = updatedLLMs[key] || {};
//             if (
//               llm?.modifiers?.length &&
//               (!llm.selectedModifiers || !llm.selectedModifiers.length)
//             ) {
//               updatedLLMs[key] = {
//                 ...llm,
//                 selectedModifiers: [...llm.modifiers],
//               };
//             }
//           }

//           return {
//             ...c,
//             llmSuggestions: updatedLLMs,
//             customModifiers: c.customModifiers || [],
//             selected: !!c.selected,
//             feedback: c.feedback || "",
//           };
//         });

//       const parsed = parseChartCodes(data);

//       const normalizedParsed = {
//         ...parsed,
//         cptCodes: normalizeLLMs(parsed.cptCodes || []),
//         icdCodes: normalizeLLMs(parsed.icdCodes || []),
//       };

//       setSelectedChartDetails(data);
//       setSelectedChartCodes(normalizedParsed);
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ---------------- Code Handlers ----------------
//   const toggleCodeSelected = (type, codeStr) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });

//   const updateCodeFeedback = (type, codeStr, feedback) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, feedback } : c
//         ),
//       };
//     });

//   const toggleProviderModifier = (type, codeStr, provider, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const llmSuggestions = { ...c.llmSuggestions };
//           const prov = { ...(llmSuggestions[provider] || {}) };
//           const mods = prov.modifiers || [];
//           let selected = prov.selectedModifiers || [...mods];

//           selected = selected.includes(mod)
//             ? selected.filter((m) => m !== mod)
//             : [...selected, mod];

//           prov.selectedModifiers = selected;
//           llmSuggestions[provider] = prov;

//           return { ...c, llmSuggestions };
//         }),
//       };
//     });

//   const toggleCustomModifier = (type, codeStr, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           const idx = existing.findIndex((m) => m.code === mod);

//           if (idx >= 0) {
//             existing[idx] = { ...existing[idx], selected: !existing[idx].selected };
//           } else {
//             existing.push({ code: mod, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomModifier = (type, codeStr, modifier) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];

//           if (!existing.some((m) => m.code === modifier.code)) {
//             existing.push({ code: modifier.code, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomCode = (type, codeStr, desc) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       if (prev[key].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [key]: [newCode, ...prev[key]],
//       };
//     });

//   // ---------------- Handlers for Code Panel ----------------
//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),

//     onUpdateCPTFeedback: (code, feedback) =>
//       updateCodeFeedback("cpt", code, feedback),
//     onUpdateICDFeedback: (code, feedback) =>
//       updateCodeFeedback("icd", code, feedback),

//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),

//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),

//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },
//   };

//   // ---------------- Sidebar selection ----------------
//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   const handleSidebarCollapseToggle = (collapsed) => {
//     setSidebarCollapsed(collapsed);
//     if (sidebarRef.current) {
//       sidebarRef.current.resize?.(collapsed ? 4 : 20);
//     }
//   };

//   // ---------------- Render ----------------
//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">

//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">Client Charts</h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => setPromptModalOpen(true)}>
//               Prompts
//             </Button>

//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">

//           {/* LEFT SIDEBAR */}
//           <ResizablePanel
//             ref={sidebarRef}
//             defaultSize={20}
//             minSize={4}
//             maxSize={30}
//           >
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRunCharts={() => setRunModalOpen(true)} // NEW
//               onCollapseToggle={handleSidebarCollapseToggle}
//               collapsed={sidebarCollapsed}
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup direction="vertical" className="w-full h-full">
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer chart={selectedChartDetails} />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel
//               chartCodes={selectedChartCodes}
//               {...handlersForPanel}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>

//         {/* PROMPT MANAGER MODAL */}
//         <PromptManagerModal
//           open={promptModalOpen}
//           onClose={() => setPromptModalOpen(false)}
//           clientId={clientId}
//         />

//         {/* RUN CHARTS MODAL */}
//         <RunChartsModal
//           open={runModalOpen}
//           onClose={() => setRunModalOpen(false)}
//           clientId={clientId}
//           charts={charts}
//           preselectedChartIds={selectedChartIds}
//           onRunComplete={async () => {
//             // refresh chart list after running
//             try {
//               const data = await getClientCharts(clientId);
//               setCharts(data || []);
//             } catch (err) {
//               console.error(err);
//             }
//           }}
//         />

//       </div>
//     </TooltipProvider>
//   );
// }



// ClientCharts.jsx

// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import { parseChartCodes } from "@/utils/ChartParser"; // still available if you need
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";

// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// import PromptManagerModal from "@/components/PromptManagerModal";
// import RunChartsModal from "../components/RunChartsModal"; // NEW

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");

//   const [client, setClient] = useState(null);


//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);

//   // chartCodes now represent codes for the currently selected run
//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   // Runs (llmResults) for the currently selected chart
//   const [availableRuns, setAvailableRuns] = useState([]);
//   const [selectedPromptId, setSelectedPromptId] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   // sidebar collapse
//   const sidebarRef = useRef(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // modals
//   const [promptModalOpen, setPromptModalOpen] = useState(false);
//   const [runModalOpen, setRunModalOpen] = useState(false); // NEW

//   useEffect(() => {
//   const loadClient = async () => {
//     try {
//       const res = await fetch(`http://localhost:8081/api/clients/${clientId}`);
//       if (!res.ok) throw new Error("Failed to fetch client");
//       const data = await res.json();
//       setClient(data);
//     } catch (err) {
//       console.error("Client load error:", err);
//     }
//   };
//   if (clientId) loadClient();
// }, [clientId]);

//   // ---------------- Load charts ----------------
//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId]);

//   // ---------------- Helper: Build codes object from a run (llmSuggestions) ----------
//   // Output shape:
//   // { cptCodes: [ { code, description?, selected, customModifiers:[], llmSuggestions: {openai:{modifiers,selectedModifiers,reasoning,audit_trail}, ...}, feedback:'' } ], icdCodes: [...] }
//   const buildCodesFromRun = (run) => {
//     if (!run || !run.llmSuggestions) return { cptCodes: [], icdCodes: [] };

//     const llmKeys = ["openai", "claude", "gemini"];
//     const codeMap = {
//       cpt: new Map(),
//       icd: new Map(),
//     };

//     // iterate each LLM and its CPT/ICD arrays
//     for (const llm of llmKeys) {
//       const sugg = run.llmSuggestions[llm];
//       if (!sugg) continue;

//       const cpts = Array.isArray(sugg.CPT_Codes) ? sugg.CPT_Codes : [];
//       const icds = Array.isArray(sugg.ICD_Codes) ? sugg.ICD_Codes : [];

//       cpts.forEach((c) => {
//         const codeKey = String(c.code);
//         if (!codeMap.cpt.has(codeKey)) {
//           codeMap.cpt.set(codeKey, {
//             code: codeKey,
//             description: c.description || "",
//             selected: !!c.selected,
//             customModifiers: c.customModifiers || [],
//             feedback: c.feedback || "",
//             llmSuggestions: {
//               openai: { modifiers: [], selectedModifiers: [] },
//               claude: { modifiers: [], selectedModifiers: [] },
//               gemini: { modifiers: [], selectedModifiers: [] },
//             },
//           });
//         }
//         const entry = codeMap.cpt.get(codeKey);
//         // assign llm-specific fields
//         entry.llmSuggestions[llm] = {
//           modifiers: Array.isArray(c.modifiers) ? c.modifiers : [],
//           selectedModifiers: Array.isArray(c.selectedModifiers)
//             ? c.selectedModifiers
//             : Array.isArray(c.modifiers)
//             ? [...c.modifiers]
//             : [],
//           reasoning: c.reasoning || c.Reasoning || "",
//           audit_trail: c.audit_trail || c.auditTrail || "",
//           suggested: !!c.suggested,
//         };
//       });

//       icds.forEach((c) => {
//         const codeKey = String(c.code);
//         if (!codeMap.icd.has(codeKey)) {
//           codeMap.icd.set(codeKey, {
//             code: codeKey,
//             description: c.description || "",
//             selected: !!c.selected,
//             customModifiers: c.customModifiers || [],
//             feedback: c.feedback || "",
//             llmSuggestions: {
//               openai: { modifiers: [], selectedModifiers: [] },
//               claude: { modifiers: [], selectedModifiers: [] },
//               gemini: { modifiers: [], selectedModifiers: [] },
//             },
//           });
//         }
//         const entry = codeMap.icd.get(codeKey);
//         entry.llmSuggestions[llm] = {
//           modifiers: Array.isArray(c.modifiers) ? c.modifiers : [],
//           selectedModifiers: Array.isArray(c.selectedModifiers)
//             ? c.selectedModifiers
//             : Array.isArray(c.modifiers)
//             ? [...c.modifiers]
//             : [],
//           reasoning: c.reasoning || c.Reasoning || "",
//           audit_trail: c.audit_trail || c.auditTrail || "",
//           suggested: !!c.suggested,
//         };
//       });
//     }

//     // turn maps into arrays preserving insertion order
//     const cptCodes = Array.from(codeMap.cpt.values());
//     const icdCodes = Array.from(codeMap.icd.values());

//     // Initialize selectedModifiers if missing in llmSuggestions
//     const initSelectedModifiers = (codeObj) => {
//       for (const key of Object.keys(codeObj.llmSuggestions || {})) {
//         const prov = codeObj.llmSuggestions[key] || {};
//         if (Array.isArray(prov.modifiers) && (!Array.isArray(prov.selectedModifiers) || prov.selectedModifiers.length === 0)) {
//           prov.selectedModifiers = [...prov.modifiers];
//         }
//         codeObj.llmSuggestions[key] = prov;
//       }
//     };

//     cptCodes.forEach(initSelectedModifiers);
//     icdCodes.forEach(initSelectedModifiers);

//     return { cptCodes, icdCodes };
//   };

//   // ---------------- Load chart details ----------------
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);
//       setAvailableRuns([]);
//       setSelectedPromptId(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("Failed to fetch chart details");

//       const data = await res.json();

//       // The chart may have llmResults (array) — each has promptId, promptName, timestamp, llmSuggestions
//       const runs = Array.isArray(data.llmResults) ? data.llmResults : [];

//       // Normalize promptId to string for stable comparisons
//       const normalizedRuns = runs.map((r) => {
//         const pid =
//           typeof r.promptId === "object" && r.promptId?._id
//             ? String(r.promptId._id)
//             : String(r.promptId || "");
//         return { ...r, promptId: pid };
//       });

//       // Determine latest run: use timestamp if present, otherwise last array item
//       let latestRun = null;
//       if (normalizedRuns.length > 0) {
//         // try sort by timestamp (ISO strings compare lexicographically)
//         const runsWithTs = normalizedRuns.filter((r) => !!r.timestamp);
//         if (runsWithTs.length > 0) {
//           runsWithTs.sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
//           latestRun = runsWithTs[runsWithTs.length - 1];
//         } else {
//           latestRun = normalizedRuns[normalizedRuns.length - 1];
//         }
//       }

//       setAvailableRuns(normalizedRuns);
//       setSelectedChartDetails(data);

//       // If there is a latest run, select it by default
//       const pickId = latestRun ? latestRun.promptId : (normalizedRuns[0] ? normalizedRuns[0].promptId : null);
//       setSelectedPromptId(pickId);

//       // Build codes for the selected run
//       const selectedRun = normalizedRuns.find((r) => r.promptId === pickId) || null;
//       const built = buildCodesFromRun(selectedRun);
//       setSelectedChartCodes({
//         ...built,
//       });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   // called when user selects a different prompt/run from dropdown in ChartViewer
//   const handleSelectPrompt = (promptId) => {
//     setSelectedPromptId(promptId);

//     // find run
//     const run = availableRuns.find((r) => r.promptId === String(promptId));
//     const built = buildCodesFromRun(run);
//     setSelectedChartCodes({
//       ...built,
//     });
//   };

//   // ---------------- Code Handlers ----------------
//   const toggleCodeSelected = (type, codeStr) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });

//   const updateCodeFeedback = (type, codeStr, feedback) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, feedback } : c
//         ),
//       };
//     });

//   const toggleProviderModifier = (type, codeStr, provider, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const llmSuggestions = { ...c.llmSuggestions };
//           const prov = { ...(llmSuggestions[provider] || {}) };
//           const mods = prov.modifiers || [];
//           let selected = prov.selectedModifiers || [...mods];

//           selected = selected.includes(mod)
//             ? selected.filter((m) => m !== mod)
//             : [...selected, mod];

//           prov.selectedModifiers = selected;
//           llmSuggestions[provider] = prov;

//           return { ...c, llmSuggestions };
//         }),
//       };
//     });

//   const toggleCustomModifier = (type, codeStr, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           const idx = existing.findIndex((m) => m.code === mod);

//           if (idx >= 0) {
//             existing[idx] = { ...existing[idx], selected: !existing[idx].selected };
//           } else {
//             existing.push({ code: mod, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomModifier = (type, codeStr, modifier) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];

//           if (!existing.some((m) => m.code === modifier.code)) {
//             existing.push({ code: modifier.code, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomCode = (type, codeStr, desc) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       if (prev[key].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [key]: [newCode, ...prev[key]],
//       };
//     });

//   // ---------------- Handlers for Code Panel ----------------
//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),

//     onUpdateCPTFeedback: (code, feedback) =>
//       updateCodeFeedback("cpt", code, feedback),
//     onUpdateICDFeedback: (code, feedback) =>
//       updateCodeFeedback("icd", code, feedback),

//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),

//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),

//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },
//   };

//   // ---------------- Sidebar selection ----------------
//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   const handleSidebarCollapseToggle = (collapsed) => {
//     setSidebarCollapsed(collapsed);
//     if (sidebarRef.current) {
//       sidebarRef.current.resize?.(collapsed ? 4 : 20);
//     }
//   };

//   // ---------------- Render ----------------
//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">

//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">
//   {client ? client.name : "Client"}
// </h1>

//           </div>

//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => setPromptModalOpen(true)}>
//               Prompts
//             </Button>

//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">

//           {/* LEFT SIDEBAR */}
//           <ResizablePanel
//             ref={sidebarRef}
//             defaultSize={20}
//             minSize={4}
//             maxSize={30}
//           >
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRunCharts={() => setRunModalOpen(true)} // NEW
//               onCollapseToggle={handleSidebarCollapseToggle}
//               collapsed={sidebarCollapsed}
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup direction="vertical" className="w-full h-full">
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer
//                     chart={selectedChartDetails}
//                     onToggleApproval={() => {}}
//                     onRerun={() => {}}
//                     runs={availableRuns}
//                     selectedPromptId={selectedPromptId}
//                     onSelectPrompt={handleSelectPrompt}
//                   />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel
//               chartCodes={selectedChartCodes}
//               {...handlersForPanel}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>

//         {/* PROMPT MANAGER MODAL */}
//         <PromptManagerModal
//           open={promptModalOpen}
//           onClose={() => setPromptModalOpen(false)}
//           clientId={clientId}
//         />

//         {/* RUN CHARTS MODAL */}
//         <RunChartsModal
//           open={runModalOpen}
//           onClose={() => setRunModalOpen(false)}
//           clientId={clientId}
//           charts={charts}
//           preselectedChartIds={selectedChartIds}
//           onRunComplete={async () => {
//             // refresh chart list after running
//             try {
//               const data = await getClientCharts(clientId);
//               setCharts(data || []);
//               // Refresh selected chart details if one is open
//               if (selectedChart?._id) await fetchChartDetails(selectedChart._id);
//             } catch (err) {
//               console.error(err);
//             }
//           }}
//         />

//       </div>
//     </TooltipProvider>
//   );
// }


// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// import PromptManagerModal from "@/components/PromptManagerModal";
// import RunChartsModal from "@/components/RunChartsModal";

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");

//   const [client, setClient] = useState(null);

//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);

//   // chartCodes now represent codes for the currently selected run
//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   // Runs (llmResults) for the currently selected chart
//   const [availableRuns, setAvailableRuns] = useState([]);
//   const [selectedPromptId, setSelectedPromptId] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   // sidebar collapse
//   const sidebarRef = useRef(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // modals
//   const [promptModalOpen, setPromptModalOpen] = useState(false);
//   const [runModalOpen, setRunModalOpen] = useState(false);

//   // ---------------- Load client ----------------
//   useEffect(() => {
//     const loadClient = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:8081/api/clients/${clientId}`
//         );
//         if (!res.ok) throw new Error("Failed to fetch client");
//         const data = await res.json();
//         setClient(data);
//       } catch (err) {
//         console.error("Client load error:", err);
//       }
//     };
//     if (clientId) loadClient();
//   }, [clientId]);

//   // ---------------- Load charts ----------------
//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId, toast]);

//   // ---------------- Helper: Build codes object from a run (llmSuggestions) ----------
//   // Output shape:
//   // { cptCodes: [ { code, description?, selected, customModifiers:[], llmSuggestions: {openai:{modifiers,selectedModifiers,reasoning,audit_trail}, ...}, feedback:'' } ], icdCodes: [...] }
//   const buildCodesFromRun = (run) => {
//     if (!run || !run.llmSuggestions) return { cptCodes: [], icdCodes: [] };

//     const llmKeys = ["openai", "claude", "gemini"];
//     const codeMap = {
//       cpt: new Map(),
//       icd: new Map(),
//     };

//     // iterate each LLM and its CPT/ICD arrays
//     for (const llm of llmKeys) {
//       const sugg = run.llmSuggestions[llm];
//       if (!sugg) continue;

//       const cpts = Array.isArray(sugg.CPT_Codes) ? sugg.CPT_Codes : [];
//       const icds = Array.isArray(sugg.ICD_Codes) ? sugg.ICD_Codes : [];

//       cpts.forEach((c) => {
//         const codeKey = String(c.code);
//         if (!codeMap.cpt.has(codeKey)) {
//           codeMap.cpt.set(codeKey, {
//             code: codeKey,
//             description: c.description || "",
//             selected: !!c.selected,
//             customModifiers: c.customModifiers || [],
//             feedback: c.feedback || "",
//             llmSuggestions: {
//               openai: { modifiers: [], selectedModifiers: [] },
//               claude: { modifiers: [], selectedModifiers: [] },
//               gemini: { modifiers: [], selectedModifiers: [] },
//             },
//           });
//         }
//         const entry = codeMap.cpt.get(codeKey);
//         // assign llm-specific fields
//         entry.llmSuggestions[llm] = {
//           modifiers: Array.isArray(c.modifiers) ? c.modifiers : [],
//           selectedModifiers: Array.isArray(c.selectedModifiers)
//             ? c.selectedModifiers
//             : Array.isArray(c.modifiers)
//             ? [...c.modifiers]
//             : [],
//           reasoning: c.reasoning || c.Reasoning || "",
//           audit_trail: c.audit_trail || c.auditTrail || "",
//           suggested: !!c.suggested,
//         };
//       });

//       icds.forEach((c) => {
//         const codeKey = String(c.code);
//         if (!codeMap.icd.has(codeKey)) {
//           codeMap.icd.set(codeKey, {
//             code: codeKey,
//             description: c.description || "",
//             selected: !!c.selected,
//             customModifiers: c.customModifiers || [],
//             feedback: c.feedback || "",
//             llmSuggestions: {
//               openai: { modifiers: [], selectedModifiers: [] },
//               claude: { modifiers: [], selectedModifiers: [] },
//               gemini: { modifiers: [], selectedModifiers: [] },
//             },
//           });
//         }
//         const entry = codeMap.icd.get(codeKey);
//         entry.llmSuggestions[llm] = {
//           modifiers: Array.isArray(c.modifiers) ? c.modifiers : [],
//           selectedModifiers: Array.isArray(c.selectedModifiers)
//             ? c.selectedModifiers
//             : Array.isArray(c.modifiers)
//             ? [...c.modifiers]
//             : [],
//           reasoning: c.reasoning || c.Reasoning || "",
//           audit_trail: c.audit_trail || c.auditTrail || "",
//           suggested: !!c.suggested,
//         };
//       });
//     }

//     // turn maps into arrays preserving insertion order
//     const cptCodes = Array.from(codeMap.cpt.values());
//     const icdCodes = Array.from(codeMap.icd.values());

//     // Initialize selectedModifiers if missing in llmSuggestions
//     const initSelectedModifiers = (codeObj) => {
//       for (const key of Object.keys(codeObj.llmSuggestions || {})) {
//         const prov = codeObj.llmSuggestions[key] || {};
//         if (
//           Array.isArray(prov.modifiers) &&
//           (!Array.isArray(prov.selectedModifiers) ||
//             prov.selectedModifiers.length === 0)
//         ) {
//           prov.selectedModifiers = [...prov.modifiers];
//         }
//         codeObj.llmSuggestions[key] = prov;
//       }
//     };

//     cptCodes.forEach(initSelectedModifiers);
//     icdCodes.forEach(initSelectedModifiers);

//     return { cptCodes, icdCodes };
//   };

//   // ---------------- Load chart details ----------------
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);
//       setAvailableRuns([]);
//       setSelectedPromptId(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("Failed to fetch chart details");

//       const data = await res.json();

//       // The chart may have llmResults (array) — each has promptId, promptName, timestamp, llmSuggestions
//       const runs = Array.isArray(data.llmResults) ? data.llmResults : [];

//       // Normalize promptId to string for stable comparisons
//       const normalizedRuns = runs.map((r) => {
//         const pid =
//           typeof r.promptId === "object" && r.promptId?._id
//             ? String(r.promptId._id)
//             : String(r.promptId || "");
//         return { ...r, promptId: pid };
//       });

//       // Determine latest run: use timestamp if present, otherwise last array item
//       let latestRun = null;
//       if (normalizedRuns.length > 0) {
//         const runsWithTs = normalizedRuns.filter((r) => !!r.timestamp);
//         if (runsWithTs.length > 0) {
//           runsWithTs.sort((a, b) =>
//             a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0
//           );
//           latestRun = runsWithTs[runsWithTs.length - 1];
//         } else {
//           latestRun = normalizedRuns[normalizedRuns.length - 1];
//         }
//       }

//       setAvailableRuns(normalizedRuns);
//       setSelectedChartDetails(data);

//       // If there is a latest run, select it by default
//       const pickId = latestRun
//         ? latestRun.promptId
//         : normalizedRuns[0]
//         ? normalizedRuns[0].promptId
//         : null;
//       setSelectedPromptId(pickId);

//       // Build codes for the selected run
//       const selectedRun =
//         normalizedRuns.find((r) => r.promptId === pickId) || null;
//       const built = buildCodesFromRun(selectedRun);
//       setSelectedChartCodes({
//         ...built,
//       });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   // called when user selects a different prompt/run from dropdown in ChartViewer
//   const handleSelectPrompt = (promptId) => {
//     setSelectedPromptId(promptId);

//     const run = availableRuns.find((r) => r.promptId === String(promptId));
//     const built = buildCodesFromRun(run);
//     setSelectedChartCodes({
//       ...built,
//     });
//   };

//   // ---------------- Code Handlers ----------------
//   const toggleCodeSelected = (type, codeStr) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });

//   const updateCodeFeedback = (type, codeStr, feedback) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, feedback } : c
//         ),
//       };
//     });

//   const toggleProviderModifier = (type, codeStr, provider, mod) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const llmSuggestions = { ...c.llmSuggestions };
//           const prov = { ...(llmSuggestions[provider] || {}) };
//           const mods = prov.modifiers || [];
//           let selected = prov.selectedModifiers || [...mods];

//           selected = selected.includes(mod)
//             ? selected.filter((m) => m !== mod)
//             : [...selected, mod];

//           prov.selectedModifiers = selected;
//           llmSuggestions[provider] = prov;

//           return { ...c, llmSuggestions };
//         }),
//       };
//     });

//   const toggleCustomModifier = (type, codeStr, mod) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];
//           const idx = existing.findIndex((m) => m.code === mod);

//           if (idx >= 0) {
//             existing[idx] = {
//               ...existing[idx],
//               selected: !existing[idx].selected,
//             };
//           } else {
//             existing.push({ code: mod, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomModifier = (type, codeStr, modifier) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const existing = [...(c.customModifiers || [])];

//           if (!existing.some((m) => m.code === modifier.code)) {
//             existing.push({ code: modifier.code, selected: true });
//           }

//           return { ...c, customModifiers: existing };
//         }),
//       };
//     });

//   const addCustomCode = (type, codeStr, desc) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       if (prev[key].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [key]: [newCode, ...prev[key]],
//       };
//     });

//   // ---------------- Handlers for Code Panel ----------------
//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),

//     onUpdateCPTFeedback: (code, feedback) =>
//       updateCodeFeedback("cpt", code, feedback),
//     onUpdateICDFeedback: (code, feedback) =>
//       updateCodeFeedback("icd", code, feedback),

//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),

//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),

//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },
//   };

//   // ---------------- Sidebar selection ----------------
//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   const handleSidebarCollapseToggle = (collapsed) => {
//     setSidebarCollapsed(collapsed);
//     if (sidebarRef.current) {
//       sidebarRef.current.resize?.(collapsed ? 4 : 20);
//     }
//   };

//   // ---------------- Render ----------------
//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">
//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">
//               {client ? client.name : "Client"}
//             </h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => setPromptModalOpen(true)}>
//               Prompts
//             </Button>

//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup
//           direction="horizontal"
//           className="flex-1 overflow-hidden"
//         >
//           {/* LEFT SIDEBAR */}
//           <ResizablePanel
//             ref={sidebarRef}
//             defaultSize={20}
//             minSize={4}
//             maxSize={30}
//           >
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRunCharts={() => setRunModalOpen(true)}
//               onCollapseToggle={handleSidebarCollapseToggle}
//               collapsed={sidebarCollapsed}
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup
//                 direction="vertical"
//                 className="w-full h-full"
//               >
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer
//                     chart={selectedChartDetails}
//                     onToggleApproval={() => {}}
//                     onRerun={() => {}}
//                     runs={availableRuns}
//                     selectedPromptId={selectedPromptId}
//                     onSelectPrompt={handleSelectPrompt}
//                   />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel
//               chartCodes={selectedChartCodes}
//               {...handlersForPanel}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>

//         {/* PROMPT MANAGER MODAL */}
//         <PromptManagerModal
//           open={promptModalOpen}
//           onClose={() => setPromptModalOpen(false)}
//           clientId={clientId}
//         />

//         {/* RUN CHARTS MODAL */}
//         <RunChartsModal
//           open={runModalOpen}
//           onClose={() => setRunModalOpen(false)}
//           clientId={clientId}
//           charts={charts}
//           preselectedChartIds={selectedChartIds}
//           onRunComplete={async () => {
//             try {
//               const data = await getClientCharts(clientId);
//               setCharts(data || []);
//               if (selectedChart?._id) await fetchChartDetails(selectedChart._id);
//             } catch (err) {
//               console.error(err);
//             }
//           }}
//         />
//       </div>
//     </TooltipProvider>
//   );
// }


// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import ChartViewer from "@/components/ChartViewer";
// import CodeComparisonPanel from "@/components/CodeComparisonPanel";
// import FinalCodesSection from "@/components/FinalCodesSection";
// import { useToast } from "@/hooks/use-toast";
// import ChartSidebar from "@/components/ChartSidebar";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";

// import PromptManagerModal from "@/components/PromptManagerModal";
// import RunChartsModal from "@/components/RunChartsModal";

// export default function ClientCharts() {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload");

//   const [client, setClient] = useState(null);

//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);

//   const [selectedChartCodes, setSelectedChartCodes] = useState(null);

//   const [availableRuns, setAvailableRuns] = useState([]);
//   const [selectedPromptId, setSelectedPromptId] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);

//   const sidebarRef = useRef(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const [promptModalOpen, setPromptModalOpen] = useState(false);
//   const [runModalOpen, setRunModalOpen] = useState(false);

//   useEffect(() => {
//     const loadClient = async () => {
//       try {
//         const res = await fetch(`http://localhost:8081/api/clients/${clientId}`);
//         if (!res.ok) throw new Error("Failed to fetch client");
//         const data = await res.json();
//         setClient(data);
//       } catch (err) {
//         console.error("Client load error:", err);
//       }
//     };
//     if (clientId) loadClient();
//   }, [clientId]);

//   useEffect(() => {
//     const load = async () => {
//       if (!clientId) return;
//       try {
//         setLoading(true);
//         const data = await getClientCharts(clientId);
//         setCharts(data || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch charts.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [clientId, toast]);

//   const buildCodesFromRun = (run) => {
//     if (!run || !run.llmSuggestions) return { cptCodes: [], icdCodes: [] };

//     const llmKeys = ["openai", "claude", "gemini"];
//     const codeMap = {
//       cpt: new Map(),
//       icd: new Map(),
//     };

//     for (const llm of llmKeys) {
//       const sugg = run.llmSuggestions[llm];
//       if (!sugg) continue;

//       const cpts = Array.isArray(sugg.CPT_Codes) ? sugg.CPT_Codes : [];
//       const icds = Array.isArray(sugg.ICD_Codes) ? sugg.ICD_Codes : [];

//       cpts.forEach((c) => {
//         const key = String(c.code);
//         if (!codeMap.cpt.has(key)) {
//           codeMap.cpt.set(key, {
//             code: key,
//             description: c.description || "",
//             selected: !!c.selected,
//             customModifiers: c.customModifiers || [],
//             feedback: c.feedback || "",
//             llmSuggestions: {
//               openai: {},
//               claude: {},
//               gemini: {},
//             },
//           });
//         }

//         codeMap.cpt.get(key).llmSuggestions[llm] = {
//           modifiers: c.modifiers || [],
//           selectedModifiers:
//             c.selectedModifiers ||
//             (Array.isArray(c.modifiers) ? [...c.modifiers] : []),
//           suggested: !!c.suggested,
//           reasoning: c.reasoning || "",
//           audit_trail: c.audit_trail || "",
//         };
//       });

//       icds.forEach((c) => {
//         const key = String(c.code);
//         if (!codeMap.icd.has(key)) {
//           codeMap.icd.set(key, {
//             code: key,
//             description: c.description || "",
//             selected: !!c.selected,
//             customModifiers: [],
//             feedback: "",
//             llmSuggestions: {
//               openai: {},
//               claude: {},
//               gemini: {},
//             },
//           });
//         }
//         codeMap.icd.get(key).llmSuggestions[llm] = {
//           modifiers: c.modifiers || [],
//           selectedModifiers:
//             c.selectedModifiers ||
//             (Array.isArray(c.modifiers) ? [...c.modifiers] : []),
//           reasoning: c.reasoning || "",
//           audit_trail: c.audit_trail || "",
//         };
//       });
//     }

//     const finalize = (arr) => {
//       arr.forEach((c) => {
//         for (const key of ["openai", "claude", "gemini"]) {
//           const prov = c.llmSuggestions[key] || {};
//           if (
//             Array.isArray(prov.modifiers) &&
//             (!prov.selectedModifiers || prov.selectedModifiers.length === 0)
//           ) {
//             prov.selectedModifiers = [...prov.modifiers];
//           }
//           c.llmSuggestions[key] = prov;
//         }
//       });
//     };

//     const cptCodes = Array.from(codeMap.cpt.values());
//     const icdCodes = Array.from(codeMap.icd.values());

//     finalize(cptCodes);
//     finalize(icdCodes);

//     return { cptCodes, icdCodes };
//   };

//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       setSelectedChartCodes(null);
//       setAvailableRuns([]);
//       setSelectedPromptId(null);

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("Failed to fetch chart details");

//       const data = await res.json();
//       const runs = Array.isArray(data.llmResults) ? data.llmResults : [];

//       const normalizedRuns = runs.map((r) => {
//         return {
//           ...r,
//           runId: String(r._id), // IMPORTANT
//           promptId:
//             typeof r.promptId === "object" && r.promptId?._id
//               ? String(r.promptId._id)
//               : String(r.promptId || ""),
//         };
//       });

//       let latestRun = null;
//       if (normalizedRuns.length > 0) {
//         normalizedRuns.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
//         latestRun = normalizedRuns[normalizedRuns.length - 1];
//       }

//       setAvailableRuns(normalizedRuns);
//       setSelectedChartDetails(data);

//       const pickRunId =
//         latestRun?.runId || (normalizedRuns[0] ? normalizedRuns[0].runId : null);

//       setSelectedPromptId(pickRunId);

//       const selectedRun = normalizedRuns.find((r) => r.runId === pickRunId);
//       const built = buildCodesFromRun(selectedRun);

//       setSelectedChartCodes(built);
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch chart details.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleSelectPrompt = (runId) => {
//     setSelectedPromptId(runId);
//     const run = availableRuns.find((r) => r.runId === String(runId));
//     const built = buildCodesFromRun(run);
//     setSelectedChartCodes(built);
//   };

//   useEffect(() => {
//     const handler = () => {
//       if (selectedChartDetails?._id) {
//         fetchChartDetails(selectedChartDetails._id);
//       }
//     };
//     window.addEventListener("finalCodesUpdated", handler);
//     return () => window.removeEventListener("finalCodesUpdated", handler);
//   }, [selectedChartDetails]);

//   const toggleCodeSelected = (type, codeStr) =>
//     setSelectedChartCodes((prev) => {
//       if (!prev) return prev;

//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) =>
//           c.code === codeStr ? { ...c, selected: !c.selected } : c
//         ),
//       };
//     });

//   const toggleProviderModifier = (type, codeStr, provider, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const updated = { ...c };
//           const prov = updated.llmSuggestions[provider] || {};
//           let selected = prov.selectedModifiers || [...(prov.modifiers || [])];

//           if (selected.includes(mod)) {
//             selected = selected.filter((m) => m !== mod);
//           } else {
//             selected.push(mod);
//           }

//           updated.llmSuggestions = {
//             ...updated.llmSuggestions,
//             [provider]: { ...prov, selectedModifiers: selected },
//           };

//           return updated;
//         }),
//       };
//     });

//   const toggleCustomModifier = (type, codeStr, mod) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";
//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const updated = { ...c };
//           const mods = [...(updated.customModifiers || [])];
//           const idx = mods.findIndex((m) => m.code === mod);

//           if (idx >= 0) {
//             mods[idx] = { ...mods[idx], selected: !mods[idx].selected };
//           } else {
//             mods.push({ code: mod, selected: true });
//           }

//           updated.customModifiers = mods;
//           return updated;
//         }),
//       };
//     });

//   const addCustomModifier = (type, codeStr, modifier) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       return {
//         ...prev,
//         [key]: prev[key].map((c) => {
//           if (c.code !== codeStr) return c;

//           const mods = [...(c.customModifiers || [])];
//           if (!mods.some((m) => m.code === modifier.code)) {
//             mods.push({ code: modifier.code, selected: true });
//           }
//           return { ...c, customModifiers: mods };
//         }),
//       };
//     });

//   const addCustomCode = (type, codeStr, desc) =>
//     setSelectedChartCodes((prev) => {
//       const key = type === "cpt" ? "cptCodes" : "icdCodes";

//       if (prev[key].some((c) => c.code === codeStr)) return prev;

//       const newCode = {
//         code: codeStr,
//         description: desc,
//         selected: true,
//         customModifiers: [],
//         llmSuggestions: {
//           openai: { modifiers: [], selectedModifiers: [] },
//           claude: { modifiers: [], selectedModifiers: [] },
//           gemini: { modifiers: [], selectedModifiers: [] },
//         },
//         feedback: "",
//       };

//       return {
//         ...prev,
//         [key]: [newCode, ...prev[key]],
//       };
//     });

//   const handlersForPanel = {
//     onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
//     onToggleICDCode: (code) => toggleCodeSelected("icd", code),

//     onToggleCPTModifier: (code, provider, mod) =>
//       toggleProviderModifier("cpt", code, provider, mod),
//     onToggleICDModifier: (code, provider, mod) =>
//       toggleProviderModifier("icd", code, provider, mod),

//     onToggleCPTCustomModifier: (code, mod) =>
//       toggleCustomModifier("cpt", code, mod),
//     onToggleICDCustomModifier: (code, mod) =>
//       toggleCustomModifier("icd", code, mod),

//     onAddCustomModifier: (code, modifier) => {
//       if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
//         addCustomModifier("cpt", code, modifier);
//       } else {
//         addCustomModifier("icd", code, modifier);
//       }
//     },

//     onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),
//   };

//   const handleToggleChartSelection = (chartId) => {
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected) => {
//     setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
//   };

//   const handleSidebarCollapseToggle = (collapsed) => {
//     setSidebarCollapsed(collapsed);

//     if (sidebarRef.current) {
//       sidebarRef.current.resize?.(collapsed ? 4 : 20);
//     }
//   };

//   return (
//     <TooltipProvider>
//       <div className="h-screen flex flex-col bg-gray-50">
//         {/* Header */}
//         <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => navigate("/")}>
//               ← Back
//             </Button>
//             <h1 className="text-lg font-semibold">
//               {client ? client.name : "Client"}
//             </h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button variant="outline" onClick={() => setPromptModalOpen(true)}>
//               Prompts
//             </Button>

//             <Button
//               className="bg-indigo-600 text-white"
//               onClick={() => setActiveView("upload")}
//             >
//               Upload Charts
//             </Button>
//           </div>
//         </header>

//         {/* Body */}
//         <ResizablePanelGroup
//           direction="horizontal"
//           className="flex-1 overflow-hidden"
//         >
//           {/* LEFT SIDEBAR */}
//           <ResizablePanel
//             ref={sidebarRef}
//             defaultSize={20}
//             minSize={4}
//             maxSize={30}
//           >
//             <ChartSidebar
//               charts={charts.map((c) => ({
//                 id: c._id,
//                 name: c.name,
//                 createdAt: c.createdAt,
//               }))}
//               selectedChartId={selectedChart?._id}
//               selectedChartIds={selectedChartIds}
//               onToggleChartSelection={handleToggleChartSelection}
//               onSelectAllCharts={handleSelectAllCharts}
//               onSelectChart={(id) => {
//                 const chart = charts.find((c) => c._id === id);
//                 if (chart) {
//                   setSelectedChart(chart);
//                   setActiveView("compare");
//                   fetchChartDetails(chart._id);
//                 }
//               }}
//               onRunCharts={() => setRunModalOpen(true)}
//               onCollapseToggle={handleSidebarCollapseToggle}
//               collapsed={sidebarCollapsed}
//             />
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* MIDDLE */}
//           <ResizablePanel defaultSize={50} minSize={30}>
//             {activeView === "upload" ? (
//               <MultiFileUpload
//                 results={results}
//                 setResults={setResults}
//                 clientId={clientId}
//                 onUploadComplete={() => setActiveView("compare")}
//               />
//             ) : selectedChartDetails ? (
//               <ResizablePanelGroup
//                 direction="vertical"
//                 className="w-full h-full"
//               >
//                 <ResizablePanel defaultSize={70} minSize={25}>
//                   <ChartViewer
//                     chart={selectedChartDetails}
//                     onToggleApproval={() => {}}
//                     onRerun={() => {}}
//                     runs={availableRuns}
//                     selectedPromptId={selectedPromptId}
//                     onSelectPrompt={handleSelectPrompt}
//                   />
//                 </ResizablePanel>

//                 <ResizableHandle />

//                 <ResizablePanel defaultSize={30}>
//                   <FinalCodesSection
//                     chartId={selectedChartDetails?._id}
//                     runId={selectedPromptId}
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </ResizablePanel>
//               </ResizablePanelGroup>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500">
//                 Select a chart to view
//               </div>
//             )}
//           </ResizablePanel>

//           <ResizableHandle />

//           {/* RIGHT PANEL */}
//           <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
//             <CodeComparisonPanel
//               chartCodes={selectedChartCodes}
//               {...handlersForPanel}
//             />
//           </ResizablePanel>
//         </ResizablePanelGroup>

//         {/* PROMPT MANAGER MODAL */}
//         <PromptManagerModal
//           open={promptModalOpen}
//           onClose={() => setPromptModalOpen(false)}
//           clientId={clientId}
//         />

//         {/* RUN CHARTS MODAL */}
//         <RunChartsModal
//           open={runModalOpen}
//           onClose={() => setRunModalOpen(false)}
//           clientId={clientId}
//           charts={charts}
//           preselectedChartIds={selectedChartIds}
//           onRunComplete={async () => {
//             try {
//               const data = await getClientCharts(clientId);
//               setCharts(data || []);

//               if (selectedChart?._id) {
//                 await fetchChartDetails(selectedChart._id);
//               }
//             } catch (err) {
//               console.error(err);
//             }
//           }}
//         />
//       </div>
//     </TooltipProvider>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientCharts } from "@/services/api";
import { Button } from "@/components/ui/button";
import MultiFileUpload from "@/components/MultiFileUpload";
import ChartViewer from "@/components/ChartViewer";
import CodeComparisonPanel from "@/components/CodeComparisonPanel";
import FinalCodesSection from "@/components/FinalCodesSection";
import { useToast } from "@/hooks/use-toast";
import ChartSidebar from "@/components/ChartSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import PromptManagerModal from "@/components/PromptManagerModal";
import RunChartsModal from "@/components/RunChartsModal";

export default function ClientCharts() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [charts, setCharts] = useState([]);
  const [results, setResults] = useState([]);
  const [activeView, setActiveView] = useState("upload");

  const [client, setClient] = useState(null);

  const [selectedChart, setSelectedChart] = useState(null);
  const [selectedChartDetails, setSelectedChartDetails] = useState(null);

  const [selectedChartCodes, setSelectedChartCodes] = useState(null);

  const [availableRuns, setAvailableRuns] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [selectedChartIds, setSelectedChartIds] = useState([]);

  const sidebarRef = useRef(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [runModalOpen, setRunModalOpen] = useState(false);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/clients/${clientId}`);
        if (!res.ok) throw new Error("Failed to fetch client");
        const data = await res.json();
        setClient(data);
      } catch (err) {
        console.error("Client load error:", err);
      }
    };
    if (clientId) loadClient();
  }, [clientId]);

  useEffect(() => {
    const load = async () => {
      if (!clientId) return;
      try {
        setLoading(true);
        const data = await getClientCharts(clientId);
        setCharts(data || []);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch charts.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [clientId, toast]);

  const buildCodesFromRun = (run) => {
    if (!run || !run.llmSuggestions) return { cptCodes: [], icdCodes: [] };

    const llmKeys = ["openai", "claude", "gemini"];
    const codeMap = {
      cpt: new Map(),
      icd: new Map(),
    };

    for (const llm of llmKeys) {
      const sugg = run.llmSuggestions[llm];
      if (!sugg) continue;

      const cpts = Array.isArray(sugg.CPT_Codes) ? sugg.CPT_Codes : [];
      const icds = Array.isArray(sugg.ICD_Codes) ? sugg.ICD_Codes : [];

      cpts.forEach((c) => {
        const key = String(c.code);
        if (!codeMap.cpt.has(key)) {
          codeMap.cpt.set(key, {
            code: key,
            description: c.description || "",
            selected: !!c.selected,
            customModifiers: c.customModifiers || [],
            feedback: c.feedback || "",
            llmSuggestions: {
              openai: {},
              claude: {},
              gemini: {},
            },
          });
        }

        codeMap.cpt.get(key).llmSuggestions[llm] = {
          modifiers: c.modifiers || [],
          selectedModifiers:
            c.selectedModifiers ||
            (Array.isArray(c.modifiers) ? [...c.modifiers] : []),
          suggested: !!c.suggested,
          reasoning: c.reasoning || "",
          audit_trail: c.audit_trail || "",
        };
      });

      icds.forEach((c) => {
        const key = String(c.code);
        if (!codeMap.icd.has(key)) {
          codeMap.icd.set(key, {
            code: key,
            description: c.description || "",
            selected: !!c.selected,
            customModifiers: [],
            feedback: "",
            llmSuggestions: {
              openai: {},
              claude: {},
              gemini: {},
            },
          });
        }
        codeMap.icd.get(key).llmSuggestions[llm] = {
          modifiers: c.modifiers || [],
          selectedModifiers:
            c.selectedModifiers ||
            (Array.isArray(c.modifiers) ? [...c.modifiers] : []),
          reasoning: c.reasoning || "",
          audit_trail: c.audit_trail || "",
        };
      });
    }

    const finalize = (arr) => {
      arr.forEach((c) => {
        for (const key of ["openai", "claude", "gemini"]) {
          const prov = c.llmSuggestions[key] || {};
          if (
            Array.isArray(prov.modifiers) &&
            (!prov.selectedModifiers || prov.selectedModifiers.length === 0)
          ) {
            prov.selectedModifiers = [...prov.modifiers];
          }
          c.llmSuggestions[key] = prov;
        }
      });
    };

    const cptCodes = Array.from(codeMap.cpt.values());
    const icdCodes = Array.from(codeMap.icd.values());

    finalize(cptCodes);
    finalize(icdCodes);

    return { cptCodes, icdCodes };
  };

  const fetchChartDetails = async (chartId) => {
    try {
      setSelectedChartDetails(null);
      setSelectedChartCodes(null);
      setAvailableRuns([]);
      setSelectedPromptId(null);

      const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
      if (!res.ok) throw new Error("Failed to fetch chart details");

      const data = await res.json();
      const runs = Array.isArray(data.llmResults) ? data.llmResults : [];

      const normalizedRuns = runs.map((r) => {
        return {
          ...r,
          runId: String(r._id), // IMPORTANT
          promptId:
            typeof r.promptId === "object" && r.promptId?._id
              ? String(r.promptId._id)
              : String(r.promptId || ""),
        };
      });

      let latestRun = null;
      if (normalizedRuns.length > 0) {
        normalizedRuns.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        latestRun = normalizedRuns[normalizedRuns.length - 1];
      }

      setAvailableRuns(normalizedRuns);
      setSelectedChartDetails(data);

      const pickRunId =
        latestRun?.runId || (normalizedRuns[0] ? normalizedRuns[0].runId : null);

      setSelectedPromptId(pickRunId);

      const selectedRun = normalizedRuns.find((r) => r.runId === pickRunId);
      const built = buildCodesFromRun(selectedRun);

      setSelectedChartCodes(built);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch chart details.",
        variant: "destructive",
      });
    }
  };

  const handleSelectPrompt = (runId) => {
    setSelectedPromptId(runId);
    const run = availableRuns.find((r) => r.runId === String(runId));
    const built = buildCodesFromRun(run);
    setSelectedChartCodes(built);
  };

  useEffect(() => {
    const handler = () => {
      if (selectedChartDetails?._id) {
        fetchChartDetails(selectedChartDetails._id);
      }
    };
    window.addEventListener("finalCodesUpdated", handler);
    return () => window.removeEventListener("finalCodesUpdated", handler);
  }, [selectedChartDetails]);

  const toggleCodeSelected = (type, codeStr) =>
    setSelectedChartCodes((prev) => {
      if (!prev) return prev;

      const key = type === "cpt" ? "cptCodes" : "icdCodes";
      return {
        ...prev,
        [key]: prev[key].map((c) =>
          c.code === codeStr ? { ...c, selected: !c.selected } : c
        ),
      };
    });

  const toggleProviderModifier = (type, codeStr, provider, mod) =>
    setSelectedChartCodes((prev) => {
      const key = type === "cpt" ? "cptCodes" : "icdCodes";

      return {
        ...prev,
        [key]: prev[key].map((c) => {
          if (c.code !== codeStr) return c;

          const updated = { ...c };
          const prov = updated.llmSuggestions[provider] || {};
          let selected = prov.selectedModifiers || [...(prov.modifiers || [])];

          if (selected.includes(mod)) {
            selected = selected.filter((m) => m !== mod);
          } else {
            selected.push(mod);
          }

          updated.llmSuggestions = {
            ...updated.llmSuggestions,
            [provider]: { ...prov, selectedModifiers: selected },
          };

          return updated;
        }),
      };
    });

  const toggleCustomModifier = (type, codeStr, mod) =>
    setSelectedChartCodes((prev) => {
      const key = type === "cpt" ? "cptCodes" : "icdCodes";
      return {
        ...prev,
        [key]: prev[key].map((c) => {
          if (c.code !== codeStr) return c;

          const updated = { ...c };
          const mods = [...(updated.customModifiers || [])];
          const idx = mods.findIndex((m) => m.code === mod);

          if (idx >= 0) {
            mods[idx] = { ...mods[idx], selected: !mods[idx].selected };
          } else {
            mods.push({ code: mod, selected: true });
          }

          updated.customModifiers = mods;
          return updated;
        }),
      };
    });

  const addCustomModifier = (type, codeStr, modifier) =>
    setSelectedChartCodes((prev) => {
      const key = type === "cpt" ? "cptCodes" : "icdCodes";

      return {
        ...prev,
        [key]: prev[key].map((c) => {
          if (c.code !== codeStr) return c;

          const mods = [...(c.customModifiers || [])];
          if (!mods.some((m) => m.code === modifier.code)) {
            mods.push({ code: modifier.code, selected: true });
          }
          return { ...c, customModifiers: mods };
        }),
      };
    });

  const addCustomCode = (type, codeStr, desc) =>
    setSelectedChartCodes((prev) => {
      const key = type === "cpt" ? "cptCodes" : "icdCodes";

      if (prev[key].some((c) => c.code === codeStr)) return prev;

      const newCode = {
        code: codeStr,
        description: desc,
        selected: true,
        customModifiers: [],
        llmSuggestions: {
          openai: { modifiers: [], selectedModifiers: [] },
          claude: { modifiers: [], selectedModifiers: [] },
          gemini: { modifiers: [], selectedModifiers: [] },
        },
        feedback: "",
      };

      return {
        ...prev,
        [key]: [newCode, ...prev[key]],
      };
    });

  const handlersForPanel = {
    onToggleCPTCode: (code) => toggleCodeSelected("cpt", code),
    onToggleICDCode: (code) => toggleCodeSelected("icd", code),

    onToggleCPTModifier: (code, provider, mod) =>
      toggleProviderModifier("cpt", code, provider, mod),
    onToggleICDModifier: (code, provider, mod) =>
      toggleProviderModifier("icd", code, provider, mod),

    onToggleCPTCustomModifier: (code, mod) =>
      toggleCustomModifier("cpt", code, mod),
    onToggleICDCustomModifier: (code, mod) =>
      toggleCustomModifier("icd", code, mod),

    onAddCustomModifier: (code, modifier) => {
      if (selectedChartCodes?.cptCodes?.some((c) => c.code === code)) {
        addCustomModifier("cpt", code, modifier);
      } else {
        addCustomModifier("icd", code, modifier);
      }
    },

    onAddCustomCode: (type, code, desc) => addCustomCode(type, code, desc),
  };

  const handleToggleChartSelection = (chartId) => {
    setSelectedChartIds((prev) =>
      prev.includes(chartId)
        ? prev.filter((id) => id !== chartId)
        : [...prev, chartId]
    );
  };

  const handleSelectAllCharts = (selected) => {
    setSelectedChartIds(selected ? charts.map((c) => c._id) : []);
  };

  const handleSidebarCollapseToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);

    if (sidebarRef.current) {
      sidebarRef.current.resize?.(collapsed ? 4 : 20);
    }
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="h-16 border-b px-6 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/")}>
              ← Back
            </Button>
            <h1 className="text-lg font-semibold">
              {client ? client.name : "Client"}
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <Button variant="outline" onClick={() => setPromptModalOpen(true)}>
              Prompts
            </Button>

            {/* ⭐ New RUNS button */}
            <Button
              variant="outline"
              onClick={() => navigate(`/client/${clientId}/runs`)}
            >
              Runs
            </Button>

            <Button
              className="bg-indigo-600 text-white"
              onClick={() => setActiveView("upload")}
            >
              Upload Charts
            </Button>
          </div>
        </header>

        {/* Body */}
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 overflow-hidden"
        >
          {/* LEFT SIDEBAR */}
          <ResizablePanel
            ref={sidebarRef}
            defaultSize={20}
            minSize={4}
            maxSize={30}
          >
            <ChartSidebar
              charts={charts.map((c) => ({
                id: c._id,
                name: c.name,
                createdAt: c.createdAt,
              }))}
              selectedChartId={selectedChart?._id}
              selectedChartIds={selectedChartIds}
              onToggleChartSelection={handleToggleChartSelection}
              onSelectAllCharts={handleSelectAllCharts}
              onSelectChart={(id) => {
                const chart = charts.find((c) => c._id === id);
                if (chart) {
                  setSelectedChart(chart);
                  setActiveView("compare");
                  fetchChartDetails(chart._id);
                }
              }}
              onRunCharts={() => setRunModalOpen(true)}
              onCollapseToggle={handleSidebarCollapseToggle}
              collapsed={sidebarCollapsed}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* MIDDLE */}
          <ResizablePanel defaultSize={50} minSize={30}>
            {activeView === "upload" ? (
              <MultiFileUpload
                results={results}
                setResults={setResults}
                clientId={clientId}
                onUploadComplete={() => setActiveView("compare")}
              />
            ) : selectedChartDetails ? (
              <ResizablePanelGroup
                direction="vertical"
                className="w-full h-full"
              >
                <ResizablePanel defaultSize={70} minSize={25}>
                  <ChartViewer
                    chart={selectedChartDetails}
                    onToggleApproval={() => {}}
                    onRerun={() => {}}
                    runs={availableRuns}
                    selectedPromptId={selectedPromptId}
                    onSelectPrompt={handleSelectPrompt}
                  />
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={30}>
                  <FinalCodesSection
                    chartId={selectedChartDetails?._id}
                    runId={selectedPromptId}
                    cptCodes={selectedChartCodes?.cptCodes || []}
                    icdCodes={selectedChartCodes?.icdCodes || []}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a chart to view
              </div>
            )}
          </ResizablePanel>

          <ResizableHandle />

          {/* RIGHT PANEL */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={65}>
            <CodeComparisonPanel
              chartCodes={selectedChartCodes}
              {...handlersForPanel}
            />
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* PROMPT MANAGER MODAL */}
        <PromptManagerModal
          open={promptModalOpen}
          onClose={() => setPromptModalOpen(false)}
          clientId={clientId}
        />

        {/* RUN CHARTS MODAL */}
        <RunChartsModal
          open={runModalOpen}
          onClose={() => setRunModalOpen(false)}
          clientId={clientId}
          charts={charts}
          preselectedChartIds={selectedChartIds}
          onRunComplete={async () => {
            try {
              const data = await getClientCharts(clientId);
              setCharts(data || []);

              if (selectedChart?._id) {
                await fetchChartDetails(selectedChart._id);
              }
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </div>
    </TooltipProvider>
  );
}
