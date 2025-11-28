// // // import { useState, useEffect, useMemo } from "react";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
// // // import { ChartSidebar } from "@/components/ChartSidebar";
// // // import { ChartViewer } from "@/components/ChartViewer";
// // // import { CodeComparisonPanel } from "@/components/CodeComparisonPanel";
// // // import { FinalCodesSection } from "@/components/FinalCodesSection";
// // // import { availableModifiers } from "@/data/mockModifiers";
// // // import { Button } from "@/components/ui/button";
// // // import { ArrowLeft, Download } from "lucide-react";
// // // import { useToast } from "@/hooks/use-toast";

// // // const Index = () => {
// // //   const { clientId } = useParams();
// // //   const navigate = useNavigate();
// // //   const { toast } = useToast();

// // //   const [charts, setCharts] = useState([]);
// // //   const [chartCodesData, setChartCodesData] = useState({});
// // //   const [selectedChartId, setSelectedChartId] = useState(null);
// // //   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

// // //   // ✅ Fetch charts for a client
// // //   useEffect(() => {
// // //     if (!clientId) return;
// // //     (async () => {
// // //       try {
// // //         const res = await fetch(`http://localhost:8081/api/charts/client/${clientId}`);
// // //         const data = await res.json();

// // //         setCharts(
// // //           data.map((chart) => ({
// // //             id: chart._id,
// // //             name: chart.name,
// // //             pdfUrl: chart.pdfUrl,
// // //             approved: chart.status === "approved",
// // //             createdAt: chart.createdAt,
// // //           }))
// // //         );

// // //         // ✅ Transform LLM suggestions into usable chartCodesData
// // //         const parsed = {};
// // //         data.forEach((chart) => {
// // //           const openai = chart.llmSuggestions?.openai || {};
// // //           const claude = chart.llmSuggestions?.claude || {};
// // //           const gemini = chart.llmSuggestions?.gemini || {};

// // //           const allCPT = [
// // //             ...(openai?.CPT_Codes || []),
// // //             ...(claude?.CPT_Codes || []),
// // //             ...(gemini?.CPT_Codes || []),
// // //           ];
// // //           const uniqueCPT = Array.from(new Map(allCPT.map((c) => [c.code, c])).values());

// // //           const allICD = [
// // //             ...(openai?.ICD_Codes || []),
// // //             ...(claude?.ICD_Codes || []),
// // //             ...(gemini?.ICD_Codes || []),
// // //           ];
// // //           const uniqueICD = Array.from(new Map(allICD.map((d) => [d.code, d])).values());

// // //           parsed[chart._id] = {
// // //             cptCodes: uniqueCPT.map((c) => ({
// // //               code: c.code,
// // //               description:
// // //                 openai?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning ||
// // //                 claude?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning ||
// // //                 gemini?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning ||
// // //                 "",
// // //               llmSuggestions: {
// // //                 llm1: {
// // //                   suggested: !!openai?.CPT_Codes?.find((x) => x.code === c.code),
// // //                   reasoning: openai?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning || "",
// // //                   auditTrail: openai?.CPT_Codes?.find((x) => x.code === c.code)?.audit_trail || "",
// // //                   modifiers: openai?.CPT_Codes?.find((x) => x.code === c.code)?.modifiers || [],
// // //                 },
// // //                 llm2: {
// // //                   suggested: !!claude?.CPT_Codes?.find((x) => x.code === c.code),
// // //                   reasoning: claude?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning || "",
// // //                   auditTrail: claude?.CPT_Codes?.find((x) => x.code === c.code)?.audit_trail || "",
// // //                   modifiers: claude?.CPT_Codes?.find((x) => x.code === c.code)?.modifiers || [],
// // //                 },
// // //                 llm3: {
// // //                   suggested: !!gemini?.CPT_Codes?.find((x) => x.code === c.code),
// // //                   reasoning: gemini?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning || "",
// // //                   auditTrail: gemini?.CPT_Codes?.find((x) => x.code === c.code)?.audit_trail || "",
// // //                   modifiers: gemini?.CPT_Codes?.find((x) => x.code === c.code)?.modifiers || [],
// // //                 },
// // //               },
// // //               selected: true,
// // //               feedback: "",
// // //               customModifiers: availableModifiers.map((m) => ({ ...m })),
// // //             })),

// // //             icdCodes: uniqueICD.map((d) => ({
// // //               code: d.code,
// // //               description:
// // //                 openai?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning ||
// // //                 claude?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning ||
// // //                 gemini?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning ||
// // //                 "",
// // //               llmSuggestions: {
// // //                 llm1: {
// // //                   suggested: !!openai?.ICD_Codes?.find((x) => x.code === d.code),
// // //                   reasoning: openai?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning || "",
// // //                   auditTrail: openai?.ICD_Codes?.find((x) => x.code === d.code)?.audit_trail || "",
// // //                 },
// // //                 llm2: {
// // //                   suggested: !!claude?.ICD_Codes?.find((x) => x.code === d.code),
// // //                   reasoning: claude?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning || "",
// // //                   auditTrail: claude?.ICD_Codes?.find((x) => x.code === d.code)?.audit_trail || "",
// // //                 },
// // //                 llm3: {
// // //                   suggested: !!gemini?.ICD_Codes?.find((x) => x.code === d.code),
// // //                   reasoning: gemini?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning || "",
// // //                   auditTrail: gemini?.ICD_Codes?.find((x) => x.code === d.code)?.audit_trail || "",
// // //                 },
// // //               },
// // //               selected: true,
// // //               feedback: "",
// // //               customModifiers: availableModifiers.map((m) => ({ ...m })),
// // //             })),
// // //           };
// // //         });

// // //         setChartCodesData(parsed);
// // //       } catch (err) {
// // //         console.error("Error fetching charts:", err);
// // //         toast({
// // //           title: "Error",
// // //           description: "Failed to fetch charts from server.",
// // //           variant: "destructive",
// // //         });
// // //       }
// // //     })();
// // //   }, [clientId]);

// // //   const selectedChart = useMemo(
// // //     () => charts.find((chart) => chart.id === selectedChartId) || null,
// // //     [selectedChartId, charts]
// // //   );

// // //   const selectedChartCodes = useMemo(
// // //     () => (selectedChartId ? chartCodesData[selectedChartId] : null),
// // //     [selectedChartId, chartCodesData]
// // //   );

// // //   // ✅ Handlers
// // //   const handleToggleCPTCode = (code) => {
// // //     if (!selectedChartId) return;
// // //     setChartCodesData((prev) => ({
// // //       ...prev,
// // //       [selectedChartId]: {
// // //         ...prev[selectedChartId],
// // //         cptCodes: prev[selectedChartId].cptCodes.map((c) =>
// // //           c.code === code ? { ...c, selected: !c.selected } : c
// // //         ),
// // //       },
// // //     }));
// // //   };

// // //   const handleToggleICDCode = (code) => {
// // //     if (!selectedChartId) return;
// // //     setChartCodesData((prev) => ({
// // //       ...prev,
// // //       [selectedChartId]: {
// // //         ...prev[selectedChartId],
// // //         icdCodes: prev[selectedChartId].icdCodes.map((c) =>
// // //           c.code === code ? { ...c, selected: !c.selected } : c
// // //         ),
// // //       },
// // //     }));
// // //   };

// // //   const handleUpdateCPTFeedback = (code, feedback) => {
// // //     if (!selectedChartId) return;
// // //     setChartCodesData((prev) => ({
// // //       ...prev,
// // //       [selectedChartId]: {
// // //         ...prev[selectedChartId],
// // //         cptCodes: prev[selectedChartId].cptCodes.map((c) =>
// // //           c.code === code ? { ...c, feedback } : c
// // //         ),
// // //       },
// // //     }));
// // //   };

// // //   const handleUpdateICDFeedback = (code, feedback) => {
// // //     if (!selectedChartId) return;
// // //     setChartCodesData((prev) => ({
// // //       ...prev,
// // //       [selectedChartId]: {
// // //         ...prev[selectedChartId],
// // //         icdCodes: prev[selectedChartId].icdCodes.map((c) =>
// // //           c.code === code ? { ...c, feedback } : c
// // //         ),
// // //       },
// // //     }));
// // //   };

// // //   const handleAddCustomCode = (type, code, description) => {
// // //     if (!selectedChartId) return;

// // //     const newCode = {
// // //       code,
// // //       description,
// // //       llmSuggestions: {
// // //         llm1: { suggested: false, reasoning: "", auditTrail: "", modifiers: [] },
// // //         llm2: { suggested: false, reasoning: "", auditTrail: "", modifiers: [] },
// // //         llm3: { suggested: false, reasoning: "", auditTrail: "", modifiers: [] },
// // //       },
// // //       selected: true,
// // //       feedback: "",
// // //       customModifiers: availableModifiers.map((m) => ({ ...m })),
// // //     };

// // //     setChartCodesData((prev) => ({
// // //       ...prev,
// // //       [selectedChartId]: {
// // //         ...prev[selectedChartId],
// // //         [type === "cpt" ? "cptCodes" : "icdCodes"]: [
// // //           ...prev[selectedChartId][type === "cpt" ? "cptCodes" : "icdCodes"],
// // //           newCode,
// // //         ],
// // //       },
// // //     }));

// // //     toast({
// // //       title: "Code Added",
// // //       description: `${type.toUpperCase()} code ${code} was added successfully.`,
// // //     });
// // //   };

// // //   const handleToggleModifier = (type, code, llmKey, modifierCode) => {
// // //     if (!selectedChartId) return;

// // //     setChartCodesData((prev) => ({
// // //       ...prev,
// // //       [selectedChartId]: {
// // //         ...prev[selectedChartId],
// // //         [type === "cpt" ? "cptCodes" : "icdCodes"]: prev[selectedChartId][
// // //           type === "cpt" ? "cptCodes" : "icdCodes"
// // //         ].map((c) =>
// // //           c.code === code
// // //             ? {
// // //                 ...c,
// // //                 llmSuggestions: {
// // //                   ...c.llmSuggestions,
// // //                   [llmKey]: {
// // //                     ...c.llmSuggestions[llmKey],
// // //                     selectedModifiers: (
// // //                       c.llmSuggestions[llmKey].selectedModifiers || []
// // //                     ).includes(modifierCode)
// // //                       ? c.llmSuggestions[llmKey].selectedModifiers.filter(
// // //                           (m) => m !== modifierCode
// // //                         )
// // //                       : [
// // //                           ...(c.llmSuggestions[llmKey].selectedModifiers || []),
// // //                           modifierCode,
// // //                         ],
// // //                   },
// // //                 },
// // //               }
// // //             : c
// // //         ),
// // //       },
// // //     }));
// // //   };

// // //   const handleToggleCustomModifier = (type, code, modifierCode) => {
// // //     if (!selectedChartId) return;

// // //     setChartCodesData((prev) => ({
// // //       ...prev,
// // //       [selectedChartId]: {
// // //         ...prev[selectedChartId],
// // //         [type === "cpt" ? "cptCodes" : "icdCodes"]: prev[selectedChartId][
// // //           type === "cpt" ? "cptCodes" : "icdCodes"
// // //         ].map((c) =>
// // //           c.code === code
// // //             ? {
// // //                 ...c,
// // //                 customModifiers: c.customModifiers.map((m) =>
// // //                   m.code === modifierCode ? { ...m, selected: !m.selected } : m
// // //                 ),
// // //               }
// // //             : c
// // //         ),
// // //       },
// // //     }));
// // //   };

// // //   const handleExportToCSV = () => {
// // //     if (!charts.length) {
// // //       toast({ title: "No charts to export", variant: "destructive" });
// // //       return;
// // //     }

// // //     let csvContent = "Chart Name,CPT Codes,ICD Codes\n";
// // //     charts.forEach((chart) => {
// // //       const data = chartCodesData[chart.id];
// // //       if (!data) return;
// // //       const cpt = data.cptCodes.map((c) => c.code).join(", ");
// // //       const icd = data.icdCodes.map((d) => d.code).join(", ");
// // //       csvContent += `"${chart.name}","${cpt}","${icd}"\n`;
// // //     });

// // //     const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
// // //     const link = document.createElement("a");
// // //     link.href = URL.createObjectURL(blob);
// // //     link.download = "charts_export.csv";
// // //     link.click();
// // //   };

// // //   return (
// // //     <div className="h-screen flex flex-col bg-background">
// // //       <header className="h-14 border-b border-border bg-card flex items-center px-4 justify-between">
// // //         <div className="flex items-center gap-4">
// // //           <Button variant="ghost" size="sm" onClick={() => navigate(`/client/${clientId}`)}>
// // //             <ArrowLeft className="w-4 h-4 mr-1" /> Back to Client
// // //           </Button>
// // //           <h1 className="text-lg font-semibold text-card-foreground">All Charts</h1>
// // //         </div>
// // //         <Button variant="outline" size="sm" onClick={handleExportToCSV}>
// // //           <Download className="w-4 h-4 mr-1" /> Export to CSV
// // //         </Button>
// // //       </header>

// // //       <div className="flex-1 overflow-hidden">
// // //         <ResizablePanelGroup direction="horizontal">
// // //           {!isSidebarCollapsed && (
// // //             <>
// // //               <ResizablePanel defaultSize={25} minSize={15} maxSize={30}>
// // //                 <ChartSidebar
// // //                   charts={charts}
// // //                   selectedChartId={selectedChartId}
// // //                   onSelectChart={setSelectedChartId}
// // //                   isCollapsed={isSidebarCollapsed}
// // //                   onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
// // //                   filterStatus="all"
// // //                   onFilterChange={() => {}}
// // //                 />
// // //               </ResizablePanel>
// // //               <ResizableHandle className="w-px bg-border" />
// // //             </>
// // //           )}

// // //           <ResizablePanel defaultSize={isSidebarCollapsed ? 100 : 75}>
// // //             <ResizablePanelGroup direction="horizontal">
// // //               <ResizablePanel defaultSize={55}>
// // //                 <ResizablePanelGroup direction="vertical">
// // //                   <ResizablePanel defaultSize={65}>
// // //                     <ChartViewer chart={selectedChart} />
// // //                   </ResizablePanel>
// // //                   <ResizableHandle className="h-px bg-border" />
// // //                   <ResizablePanel defaultSize={35}>
// // //                     {selectedChartCodes ? (
// // //                       <FinalCodesSection
// // //                         cptCodes={selectedChartCodes.cptCodes}
// // //                         icdCodes={selectedChartCodes.icdCodes}
// // //                       />
// // //                     ) : (
// // //                       <div className="h-full flex items-center justify-center text-muted-foreground">
// // //                         Select a chart to view codes
// // //                       </div>
// // //                     )}
// // //                   </ResizablePanel>
// // //                 </ResizablePanelGroup>
// // //               </ResizablePanel>

// // //               <ResizableHandle className="w-px bg-border" />

// // //               <ResizablePanel defaultSize={45}>
// // //                 <CodeComparisonPanel
// // //                   chartCodes={selectedChartCodes}
// // //                   onToggleCPTCode={handleToggleCPTCode}
// // //                   onToggleICDCode={handleToggleICDCode}
// // //                   onUpdateCPTFeedback={handleUpdateCPTFeedback}
// // //                   onUpdateICDFeedback={handleUpdateICDFeedback}
// // //                   onAddCustomCode={handleAddCustomCode}
// // //                   onToggleCPTModifier={(code, llmKey, modifierCode) =>
// // //                     handleToggleModifier("cpt", code, llmKey, modifierCode)
// // //                   }
// // //                   onToggleICDModifier={(code, llmKey, modifierCode) =>
// // //                     handleToggleModifier("icd", code, llmKey, modifierCode)
// // //                   }
// // //                   onToggleCPTCustomModifier={(code, modifierCode) =>
// // //                     handleToggleCustomModifier("cpt", code, modifierCode)
// // //                   }
// // //                   onToggleICDCustomModifier={(code, modifierCode) =>
// // //                     handleToggleCustomModifier("icd", code, modifierCode)
// // //                   }
// // //                 />
// // //               </ResizablePanel>
// // //             </ResizablePanelGroup>
// // //           </ResizablePanel>
// // //         </ResizablePanelGroup>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Index;


// import { useState, useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientCharts } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import MultiFileUpload from "@/components/MultiFileUpload";
// import { ChartViewer } from "@/components/ChartViewer";
// import { CodeComparisonPanel } from "@/components/CodeComparisonPanel";

// import { availableModifiers } from "@/data/mockModifiers";
// import { Loader2 } from "lucide-react";

// const Index = () => {
//   const { clientId } = useParams();
//   const navigate = useNavigate();

//   const [charts, setCharts] = useState([]);
//   const [results, setResults] = useState([]);
//   const [activeView, setActiveView] = useState("upload"); // "upload" | "compare"
//   const [selectedChart, setSelectedChart] = useState(null);
//   const [selectedChartDetails, setSelectedChartDetails] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch all charts for the client
//   const fetchCharts = async () => {
//     if (!clientId || clientId === "undefined" || clientId === "null") return;
//     try {
//       setLoading(true);
//       const data = await getClientCharts(clientId);
//       setCharts(data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch client charts:", err);
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch full chart details from DB
//   const fetchChartDetails = async (chartId) => {
//     try {
//       setSelectedChartDetails(null);
//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}`);
//       if (!res.ok) throw new Error("Failed to fetch chart details");
//       const data = await res.json();
//       setSelectedChartDetails(data);
//     } catch (err) {
//       console.error("Error fetching chart details:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCharts();
//   }, [clientId]);

//   // ✅ When user clicks on a chart in sidebar
//   const handleChartClick = (chart) => {
//     setSelectedChart(chart);
//     setActiveView("compare");
//     fetchChartDetails(chart._id);
//   };

//   // ✅ Transform LLM data for comparison view
//   const selectedChartCodes = useMemo(() => {
//     if (!selectedChartDetails?.llmSuggestions) return null;

//     const { llmSuggestions } = selectedChartDetails;
//     const openai = llmSuggestions.openai || {};
//     const claude = llmSuggestions.claude || {};
//     const gemini = llmSuggestions.gemini || {};

//     const allCPT = [
//       ...(openai?.CPT_Codes || []),
//       ...(claude?.CPT_Codes || []),
//       ...(gemini?.CPT_Codes || []),
//     ];
//     const uniqueCPT = Array.from(new Map(allCPT.map((c) => [c.code, c])).values());

//     const allICD = [
//       ...(openai?.ICD_Codes || []),
//       ...(claude?.ICD_Codes || []),
//       ...(gemini?.ICD_Codes || []),
//     ];
//     const uniqueICD = Array.from(new Map(allICD.map((d) => [d.code, d])).values());

//     return {
//       cptCodes: uniqueCPT.map((c) => ({
//         code: c.code,
//         description:
//           openai?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning ||
//           claude?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning ||
//           gemini?.CPT_Codes?.find((x) => x.code === c.code)?.reasoning ||
//           "",
//         llmSuggestions: { openai, claude, gemini },
//         selected: true,
//         feedback: "",
//         customModifiers: availableModifiers.map((m) => ({ ...m })),
//       })),
//       icdCodes: uniqueICD.map((d) => ({
//         code: d.code,
//         description:
//           openai?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning ||
//           claude?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning ||
//           gemini?.ICD_Codes?.find((x) => x.code === d.code)?.reasoning ||
//           "",
//         llmSuggestions: { openai, claude, gemini },
//         selected: true,
//         feedback: "",
//         customModifiers: availableModifiers.map((m) => ({ ...m })),
//       })),
//     };
//   }, [selectedChartDetails]);

//   const handleToggleCPTCode = (code) => {
//     if (!selectedChartDetails) return;
//     setSelectedChartDetails((prev) => ({
//       ...prev,
//       cptCodes: prev.cptCodes.map((c) =>
//         c.code === code ? { ...c, selected: !c.selected } : c
//       ),
//     }));
//   };

//   const handleToggleICDCode = (code) => {
//     if (!selectedChartDetails) return;
//     setSelectedChartDetails((prev) => ({
//       ...prev,
//       icdCodes: prev.icdCodes.map((c) =>
//         c.code === code ? { ...c, selected: !c.selected } : c
//       ),
//     }));
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="h-16 border-b flex items-center justify-between px-6 bg-white shadow-sm sticky top-0 z-10">
//         <div className="flex items-center gap-3">
//           <Button variant="outline" onClick={() => navigate("/")}>
//             ← Back to Dashboard
//           </Button>
//           <h1 className="text-lg font-semibold text-gray-800">
//             Client Charts
//           </h1>
//         </div>

//         {/* Upload button */}
//         <Button
//           className="bg-indigo-600 hover:bg-indigo-700 text-white"
//           onClick={() => {
//             setActiveView("upload");
//             setSelectedChart(null);
//           }}
//         >
//           Upload Charts
//         </Button>
//       </header>

//       {/* Main content area */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* LEFT: Chart List */}
//         <div className="w-[35%] min-w-[350px] border-r bg-white flex flex-col shadow-sm">
//           <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
//             <h2 className="text-md font-semibold text-gray-700">Recent Charts</h2>
//             {loading && <Loader2 className="animate-spin h-4 w-4 text-gray-500" />}
//           </div>
//           <div className="flex-1 overflow-y-auto p-4">
//             {charts.length > 0 ? (
//               charts.slice(0, 20).map((chart) => (
//                 <div
//                   key={chart._id}
//                   className={`p-3 mb-2 border rounded-md cursor-pointer transition-colors ${
//                     selectedChart?._id === chart._id
//                       ? "bg-indigo-50 border-indigo-400"
//                       : "hover:bg-indigo-50"
//                   }`}
//                   onClick={() => handleChartClick(chart)}
//                 >
//                   <h3 className="font-medium text-indigo-700 truncate">
//                     {chart.name}
//                   </h3>
//                   <p className="text-xs text-gray-500">
//                     Created: {new Date(chart.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500">
//                 No charts found for this client.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* RIGHT: Upload or Comparison View */}
//         <div className="flex-1 flex flex-col bg-white shadow-sm overflow-hidden">
//           {activeView === "upload" ? (
//             <MultiFileUpload
//               results={results}
//               setResults={setResults}
//               clientId={clientId}
//               onUploadComplete={fetchCharts}
//             />
//           ) : selectedChart ? (
//             selectedChartDetails ? (
//               <div className="flex flex-col h-full">
//                 {/* Chart PDF Viewer */}
//                 <div className="flex-1 overflow-hidden">
//                   <ChartViewer chart={selectedChartDetails} />
//                 </div>

//                 {/* Code Comparison Section */}
//                 <div className="border-t h-[50%] overflow-hidden">
//                   <CodeComparisonPanel
//                     chartCodes={selectedChartCodes}
//                     onToggleCPTCode={handleToggleCPTCode}
//                     onToggleICDCode={handleToggleICDCode}
//                   />
//                   <FinalCodesSection
//                     cptCodes={selectedChartCodes?.cptCodes || []}
//                     icdCodes={selectedChartCodes?.icdCodes || []}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-500">
//                 <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading chart details...
//               </div>
//             )
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               Select a chart or upload new charts.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
const Index = () => {
    return (
        <div>
            <h1>Index</h1>
        </div>
    );
}
export default Index;
