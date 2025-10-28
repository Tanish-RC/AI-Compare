// import { useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
// import { ChartSidebar } from "@/components/ChartSidebar";
// import { ChartViewer } from "@/components/ChartViewer";
// import { CodeComparisonPanel } from "@/components/CodeComparisonPanel";
// import { FinalCodesSection } from "@/components/FinalCodesSection";
// import { mockCharts, mockChartCodes } from "@/data/mockData";
// import { availableModifiers } from "@/data/mockModifiers";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Upload, ChevronRight, ChevronLeft } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { Chart } from "@/types/chart";
// import { useEffect } from "react";


// const Index = () => {
//   const { runId } = useParams();
//   const navigate = useNavigate();
//   const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [selectedChartIds, setSelectedChartIds] = useState<string[]>([]);
//   const [chartCodesData, setChartCodesData] = useState(() => {
//     // Initialize all codes with available modifiers
//     const initializedData = { ...mockChartCodes };
//     Object.keys(initializedData).forEach(chartId => {
//       initializedData[chartId].cptCodes = initializedData[chartId].cptCodes.map(code => ({
//         ...code,
//         customModifiers: availableModifiers.map(m => ({ ...m }))
//       }));
//       initializedData[chartId].icdCodes = initializedData[chartId].icdCodes.map(code => ({
//         ...code,
//         customModifiers: availableModifiers.map(m => ({ ...m }))
//       }));
//     });
//     return initializedData;
//   });
//   const [charts, setCharts] = useState<Chart[]>(mockCharts);
//   const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "unapproved">("all");
//   const { toast } = useToast();
//   useEffect(() => {
//   if (!runId) return;

//   const storedResults = localStorage.getItem(`llm_results_${runId}`);
//   if (!storedResults) return;

//   try {
//     const parsedResults = JSON.parse(storedResults);

//     // Generate chart objects dynamically
//     const newCharts = parsedResults.map((item, i) => ({
//       id: `chart_${i + 1}`,
//       name: item.fileName,
//       approved: false,
//       summary: "Generated from LLM analysis",
//       createdAt: new Date().toISOString(),
//     }));

//     // Build chartCodesData with OpenAI, Claude, and Gemini mapping
//     const newChartCodes = {};
//     parsedResults.forEach((item, i) => {
//       newChartCodes[`chart_${i + 1}`] = {
//         cptCodes: (item.openai?.CPT_Codes || []).map((c) => ({
//           code: c.code,
//           description: c.reasoning || "",
//           llmSuggestions: {
//             llm1: { // OpenAI
//               suggested: true,
//               reasoning: c.reasoning,
//               auditTrail: c.audit_trail,
//               modifiers: c.modifiers || [],
//             },
//             llm2: { // Claude
//               suggested: !!(item.claude?.CPT_Codes || []).find(x => x.code === c.code),
//               reasoning: (item.claude?.CPT_Codes || []).find(x => x.code === c.code)?.reasoning || "",
//               auditTrail: (item.claude?.CPT_Codes || []).find(x => x.code === c.code)?.audit_trail || "",
//               modifiers: (item.claude?.CPT_Codes || []).find(x => x.code === c.code)?.modifiers || [],
//             },
//             llm3: { // Gemini
//               suggested: !!(item.gemini?.CPT_Codes || []).find(x => x.code === c.code),
//               reasoning: (item.gemini?.CPT_Codes || []).find(x => x.code === c.code)?.reasoning || "",
//               auditTrail: (item.gemini?.CPT_Codes || []).find(x => x.code === c.code)?.audit_trail || "",
//               modifiers: (item.gemini?.CPT_Codes || []).find(x => x.code === c.code)?.modifiers || [],
//             },
//           },
//           selected: true,
//           feedback: "",
//           isExternal: false,
//           customModifiers: availableModifiers.map(m => ({ ...m })),
//         })),

//         icdCodes: (item.openai?.ICD_Codes || []).map((d) => ({
//           code: d.code,
//           description: d.reasoning || "",
//           llmSuggestions: {
//             llm1: { // OpenAI
//               suggested: true,
//               reasoning: d.reasoning,
//               auditTrail: d.audit_trail,
//               modifiers: [],
//             },
//             llm2: { // Claude
//               suggested: !!(item.claude?.ICD_Codes || []).find(x => x.code === d.code),
//               reasoning: (item.claude?.ICD_Codes || []).find(x => x.code === d.code)?.reasoning || "",
//               auditTrail: (item.claude?.ICD_Codes || []).find(x => x.code === d.code)?.audit_trail || "",
//               modifiers: [],
//             },
//             llm3: { // Gemini
//               suggested: !!(item.gemini?.ICD_Codes || []).find(x => x.code === d.code),
//               reasoning: (item.gemini?.ICD_Codes || []).find(x => x.code === d.code)?.reasoning || "",
//               auditTrail: (item.gemini?.ICD_Codes || []).find(x => x.code === d.code)?.audit_trail || "",
//               modifiers: [],
//             },
//           },
//           selected: true,
//           feedback: "",
//           isExternal: false,
//           customModifiers: availableModifiers.map(m => ({ ...m })),
//         })),
//       };
//     });

//     setCharts(newCharts);
//     setChartCodesData(newChartCodes);

//   } catch (err) {
//     console.error("❌ Failed to parse LLM results:", err);
//   }
// }, [runId]);

//   const filteredCharts = useMemo(() => {
//     if (filterStatus === "all") return charts;
//     return charts.filter(chart => 
//       filterStatus === "approved" ? chart.approved : !chart.approved
//     );
//   }, [charts, filterStatus]);

//   const selectedChart = useMemo(
//     () => charts.find((chart) => chart.id === selectedChartId) || null,
//     [selectedChartId, charts]
//   );

//   const selectedChartCodes = useMemo(
//     () => (selectedChartId ? chartCodesData[selectedChartId] : null),
//     [selectedChartId, chartCodesData]
//   );

//   const handleToggleCPTCode = (code: string) => {
//     if (!selectedChartId) return;
    
//     setChartCodesData((prev) => ({
//       ...prev,
//       [selectedChartId]: {
//         ...prev[selectedChartId],
//         cptCodes: prev[selectedChartId].cptCodes.map((c) =>
//           c.code === code ? { ...c, selected: !c.selected } : c
//         ),
//       },
//     }));
//   };

//   const handleToggleICDCode = (code: string) => {
//     if (!selectedChartId) return;
    
//     setChartCodesData((prev) => ({
//       ...prev,
//       [selectedChartId]: {
//         ...prev[selectedChartId],
//         icdCodes: prev[selectedChartId].icdCodes.map((c) =>
//           c.code === code ? { ...c, selected: !c.selected } : c
//         ),
//       },
//     }));
//   };

//   const handleUpdateCPTFeedback = (code: string, feedback: string) => {
//     if (!selectedChartId) return;
    
//     setChartCodesData((prev) => ({
//       ...prev,
//       [selectedChartId]: {
//         ...prev[selectedChartId],
//         cptCodes: prev[selectedChartId].cptCodes.map((c) =>
//           c.code === code ? { ...c, feedback } : c
//         ),
//       },
//     }));
//   };

//   const handleUpdateICDFeedback = (code: string, feedback: string) => {
//     if (!selectedChartId) return;
    
//     setChartCodesData((prev) => ({
//       ...prev,
//       [selectedChartId]: {
//         ...prev[selectedChartId],
//         icdCodes: prev[selectedChartId].icdCodes.map((c) =>
//           c.code === code ? { ...c, feedback } : c
//         ),
//       },
//     }));
//   };

//   const handleAddCustomCode = (type: 'cpt' | 'icd', code: string, description: string) => {
//     if (!selectedChartId) return;
    
//     const newCode = {
//       code,
//       description,
//       llmSuggestions: {
//         llm1: { suggested: false, reasoning: '', auditTrail: '', modifiers: [] },
//         llm2: { suggested: false, reasoning: '', auditTrail: '', modifiers: [] },
//         llm3: { suggested: false, reasoning: '', auditTrail: '', modifiers: [] },
//       },
//       selected: true,
//       feedback: '',
//       isExternal: true,
//       customModifiers: [],
//     };

//     setChartCodesData((prev) => ({
//       ...prev,
//       [selectedChartId]: {
//         ...prev[selectedChartId],
//         [type === 'cpt' ? 'cptCodes' : 'icdCodes']: [
//           ...prev[selectedChartId][type === 'cpt' ? 'cptCodes' : 'icdCodes'],
//           newCode,
//         ],
//       },
//     }));

//     toast({
//       title: "Code Added",
//       description: `${type.toUpperCase()} code ${code} has been added`,
//     });
//   };

//   const handleToggleModifier = (codeType: 'cpt' | 'icd', code: string, llmKey: 'llm1' | 'llm2' | 'llm3', modifierCode: string) => {
//     if (!selectedChartId) return;
    
//     const codesKey = codeType === 'cpt' ? 'cptCodes' : 'icdCodes';
    
//     setChartCodesData((prev) => ({
//       ...prev,
//       [selectedChartId]: {
//         ...prev[selectedChartId],
//         [codesKey]: prev[selectedChartId][codesKey].map((c) => {
//           if (c.code !== code) return c;
          
//           const llmSuggestion = c.llmSuggestions[llmKey];
//           const currentSelected = llmSuggestion.selectedModifiers || llmSuggestion.modifiers;
          
//           return {
//             ...c,
//             llmSuggestions: {
//               ...c.llmSuggestions,
//               [llmKey]: {
//                 ...llmSuggestion,
//                 selectedModifiers: currentSelected.includes(modifierCode)
//                   ? currentSelected.filter(m => m !== modifierCode)
//                   : [...currentSelected, modifierCode]
//               }
//             }
//           };
//         }),
//       },
//     }));
//   };

//   const handleToggleCustomModifier = (codeType: 'cpt' | 'icd', code: string, modifierCode: string) => {
//     if (!selectedChartId) return;
    
//     const codesKey = codeType === 'cpt' ? 'cptCodes' : 'icdCodes';
    
//     setChartCodesData((prev) => ({
//       ...prev,
//       [selectedChartId]: {
//         ...prev[selectedChartId],
//         [codesKey]: prev[selectedChartId][codesKey].map((c) =>
//           c.code === code
//             ? {
//                 ...c,
//                 customModifiers: c.customModifiers.map(m =>
//                   m.code === modifierCode ? { ...m, selected: !m.selected } : m
//                 )
//               }
//             : c
//         ),
//       },
//     }));
//   };

//   const handleRerun = () => {
//     toast({
//       title: "Re-running Analysis",
//       description: "Chart is being reprocessed...",
//     });
//   };

//   const handleRunAllCharts = () => {
//     toast({
//       title: "Running All Charts",
//       description: "All charts are being reprocessed...",
//     });
//   };

//   const handleToggleApproval = () => {
//     if (!selectedChartId) return;
    
//     setCharts((prev) =>
//       prev.map((chart) =>
//         chart.id === selectedChartId
//           ? { ...chart, approved: !chart.approved }
//           : chart
//       )
//     );

//     toast({
//       title: selectedChart?.approved ? "Chart Unapproved" : "Chart Approved",
//       description: selectedChart?.approved 
//         ? "Chart marked as unapproved" 
//         : "Chart and codes have been approved",
//     });
//   };

//   const handleImportCharts = () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.pdf';
//     input.multiple = true;
//     input.onchange = () => {
//       toast({
//         title: "Charts imported",
//         description: "Charts are being processed...",
//       });
//     };
//     input.click();
//   };

//   const handleToggleChartSelection = (chartId: string) => {
//     setSelectedChartIds(prev =>
//       prev.includes(chartId)
//         ? prev.filter(id => id !== chartId)
//         : [...prev, chartId]
//     );
//   };

//   const handleSelectAllCharts = (selected: boolean) => {
//     if (selected) {
//       setSelectedChartIds(filteredCharts.map(chart => chart.id));
//     } else {
//       setSelectedChartIds([]);
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       <header className="h-12 border-b border-border bg-card flex items-center px-4 justify-between">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => navigate('/')}
//             className="gap-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Dashboard
//           </Button>
//           <h1 className="text-lg font-semibold text-card-foreground">
//             RCM Medical Coding System - Run {runId}
//           </h1>
//         </div>
//       </header>
      
//       <div className="flex-1 overflow-hidden">
//         <ResizablePanelGroup direction="horizontal">
//           {!isSidebarCollapsed && (
//             <>
//               <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
//                 <ChartSidebar
//                   charts={filteredCharts}
//                   selectedChartId={selectedChartId}
//                   onSelectChart={setSelectedChartId}
//                   filterStatus={filterStatus}
//                   onFilterChange={setFilterStatus}
//                   onImportCharts={handleImportCharts}
//                   onRunAllCharts={handleRunAllCharts}
//                   isCollapsed={isSidebarCollapsed}
//                   onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//                   selectedChartIds={selectedChartIds}
//                   onToggleChartSelection={handleToggleChartSelection}
//                   onSelectAllCharts={handleSelectAllCharts}
//                 />
//               </ResizablePanel>
              
//               <ResizableHandle className="w-px bg-border" />
//             </>
//           )}
          
//           {isSidebarCollapsed && (
//             <>
//               <div className="w-12 border-r border-border bg-sidebar flex flex-col items-center py-4">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsSidebarCollapsed(false)}
//                   className="h-8 w-8 p-0"
//                   title="Expand Sidebar"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
              
//               <ResizableHandle className="w-px bg-border" />
//             </>
//           )}
          
//           <ResizablePanel defaultSize={isSidebarCollapsed ? 100 : 80} minSize={70}>
//             <ResizablePanelGroup direction="horizontal">
//               <ResizablePanel defaultSize={55} minSize={35}>
//                 <ResizablePanelGroup direction="vertical">
//                   <ResizablePanel defaultSize={70} minSize={50}>
//                     <ChartViewer 
//                       chart={selectedChart} 
//                       onToggleApproval={selectedChart ? handleToggleApproval : undefined}
//                       onRerun={selectedChart ? handleRerun : undefined}
//                     />
//                   </ResizablePanel>
                  
//                   <ResizableHandle className="h-px bg-border" />
                  
//                   <ResizablePanel defaultSize={30} minSize={20}>
//                     {selectedChartCodes ? (
//                       <FinalCodesSection
//                         cptCodes={selectedChartCodes.cptCodes}
//                         icdCodes={selectedChartCodes.icdCodes}
//                       />
//                     ) : (
//                       <div className="h-full flex items-center justify-center bg-card border-t border-border">
//                         <p className="text-muted-foreground text-sm">Select a chart to view final codes</p>
//                       </div>
//                     )}
//                   </ResizablePanel>
//                 </ResizablePanelGroup>
//               </ResizablePanel>

//               <ResizableHandle className="w-px bg-border" />

//               <ResizablePanel defaultSize={45} minSize={30}>
//                 <CodeComparisonPanel
//                   chartCodes={selectedChartCodes}
//                   onToggleCPTCode={handleToggleCPTCode}
//                   onToggleICDCode={handleToggleICDCode}
//                   onUpdateCPTFeedback={handleUpdateCPTFeedback}
//                   onUpdateICDFeedback={handleUpdateICDFeedback}
//                   onAddCustomCode={handleAddCustomCode}
//                   onToggleCPTModifier={(code, llmKey, modifierCode) => handleToggleModifier('cpt', code, llmKey, modifierCode)}
//                   onToggleICDModifier={(code, llmKey, modifierCode) => handleToggleModifier('icd', code, llmKey, modifierCode)}
//                   onToggleCPTCustomModifier={(code, modifierCode) => handleToggleCustomModifier('cpt', code, modifierCode)}
//                   onToggleICDCustomModifier={(code, modifierCode) => handleToggleCustomModifier('icd', code, modifierCode)}
//                 />
//               </ResizablePanel>
//             </ResizablePanelGroup>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </div>
//   );
// };

// export default Index;


import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChartSidebar } from "@/components/ChartSidebar";
import { ChartViewer } from "@/components/ChartViewer";
import { CodeComparisonPanel } from "@/components/CodeComparisonPanel";
import { FinalCodesSection } from "@/components/FinalCodesSection";
import { mockCharts, mockChartCodes } from "@/data/mockData";
import { availableModifiers } from "@/data/mockModifiers";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, ChevronRight, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Chart } from "@/types/chart";
import { useEffect } from "react";


const Index = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedChartIds, setSelectedChartIds] = useState<string[]>([]);
  const [chartCodesData, setChartCodesData] = useState(() => {
    // Initialize all codes with available modifiers
    const initializedData = { ...mockChartCodes };
    Object.keys(initializedData).forEach(chartId => {
      initializedData[chartId].cptCodes = initializedData[chartId].cptCodes.map(code => ({
        ...code,
        customModifiers: availableModifiers.map(m => ({ ...m }))
      }));
      initializedData[chartId].icdCodes = initializedData[chartId].icdCodes.map(code => ({
        ...code,
        customModifiers: availableModifiers.map(m => ({ ...m }))
      }));
    });
    return initializedData;
  });
  const [charts, setCharts] = useState<Chart[]>(mockCharts);
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "unapproved">("all");
  const { toast } = useToast();
  useEffect(() => {
  if (!runId) return;

  const storedResults = localStorage.getItem(`llm_results_${runId}`);
  if (!storedResults) return;

  try {
    const parsedResults = JSON.parse(storedResults);

    // Generate chart objects dynamically
    const newCharts = parsedResults.map((item, i) => ({
      id: `chart_${i + 1}`,
      name: item.fileName,
      pdfUrl: item.pdfUrl || null,
      approved: false,
      summary: "Generated from LLM analysis",
      createdAt: new Date().toISOString(),
    }));

    // Build chartCodesData with OpenAI, Claude, and Gemini mapping
    const newChartCodes = {};
    parsedResults.forEach((item, i) => {
      newChartCodes[`chart_${i + 1}`] = {
        cptCodes: (item.openai?.CPT_Codes || []).map((c) => ({
          code: c.code,
          description: c.reasoning || "",
          llmSuggestions: {
            llm1: { // OpenAI
              suggested: true,
              reasoning: c.reasoning,
              auditTrail: c.audit_trail,
              modifiers: c.modifiers || [],
            },
            llm2: { // Claude
              suggested: !!(item.claude?.CPT_Codes || []).find(x => x.code === c.code),
              reasoning: (item.claude?.CPT_Codes || []).find(x => x.code === c.code)?.reasoning || "",
              auditTrail: (item.claude?.CPT_Codes || []).find(x => x.code === c.code)?.audit_trail || "",
              modifiers: (item.claude?.CPT_Codes || []).find(x => x.code === c.code)?.modifiers || [],
            },
            llm3: { // Gemini
              suggested: !!(item.gemini?.CPT_Codes || []).find(x => x.code === c.code),
              reasoning: (item.gemini?.CPT_Codes || []).find(x => x.code === c.code)?.reasoning || "",
              auditTrail: (item.gemini?.CPT_Codes || []).find(x => x.code === c.code)?.audit_trail || "",
              modifiers: (item.gemini?.CPT_Codes || []).find(x => x.code === c.code)?.modifiers || [],
            },
          },
          selected: true,
          feedback: "",
          isExternal: false,
          customModifiers: availableModifiers.map(m => ({ ...m })),
        })),

        icdCodes: (item.openai?.ICD_Codes || []).map((d) => ({
          code: d.code,
          description: d.reasoning || "",
          llmSuggestions: {
            llm1: { // OpenAI
              suggested: true,
              reasoning: d.reasoning,
              auditTrail: d.audit_trail,
              modifiers: [],
            },
            llm2: { // Claude
              suggested: !!(item.claude?.ICD_Codes || []).find(x => x.code === d.code),
              reasoning: (item.claude?.ICD_Codes || []).find(x => x.code === d.code)?.reasoning || "",
              auditTrail: (item.claude?.ICD_Codes || []).find(x => x.code === d.code)?.audit_trail || "",
              modifiers: [],
            },
            llm3: { // Gemini
              suggested: !!(item.gemini?.ICD_Codes || []).find(x => x.code === d.code),
              reasoning: (item.gemini?.ICD_Codes || []).find(x => x.code === d.code)?.reasoning || "",
              auditTrail: (item.gemini?.ICD_Codes || []).find(x => x.code === d.code)?.audit_trail || "",
              modifiers: [],
            },
          },
          selected: true,
          feedback: "",
          isExternal: false,
          customModifiers: availableModifiers.map(m => ({ ...m })),
        })),
      };
    });

    setCharts(newCharts);
    setChartCodesData(newChartCodes);

  } catch (err) {
    console.error("❌ Failed to parse LLM results:", err);
  }
}, [runId]);

  const filteredCharts = useMemo(() => {
    if (filterStatus === "all") return charts;
    return charts.filter(chart => 
      filterStatus === "approved" ? chart.approved : !chart.approved
    );
  }, [charts, filterStatus]);

  const selectedChart = useMemo(
    () => charts.find((chart) => chart.id === selectedChartId) || null,
    [selectedChartId, charts]
  );

  const selectedChartCodes = useMemo(
    () => (selectedChartId ? chartCodesData[selectedChartId] : null),
    [selectedChartId, chartCodesData]
  );

  const handleToggleCPTCode = (code: string) => {
    if (!selectedChartId) return;
    
    setChartCodesData((prev) => ({
      ...prev,
      [selectedChartId]: {
        ...prev[selectedChartId],
        cptCodes: prev[selectedChartId].cptCodes.map((c) =>
          c.code === code ? { ...c, selected: !c.selected } : c
        ),
      },
    }));
  };

  const handleToggleICDCode = (code: string) => {
    if (!selectedChartId) return;
    
    setChartCodesData((prev) => ({
      ...prev,
      [selectedChartId]: {
        ...prev[selectedChartId],
        icdCodes: prev[selectedChartId].icdCodes.map((c) =>
          c.code === code ? { ...c, selected: !c.selected } : c
        ),
      },
    }));
  };

  const handleUpdateCPTFeedback = (code: string, feedback: string) => {
    if (!selectedChartId) return;
    
    setChartCodesData((prev) => ({
      ...prev,
      [selectedChartId]: {
        ...prev[selectedChartId],
        cptCodes: prev[selectedChartId].cptCodes.map((c) =>
          c.code === code ? { ...c, feedback } : c
        ),
      },
    }));
  };

  const handleUpdateICDFeedback = (code: string, feedback: string) => {
    if (!selectedChartId) return;
    
    setChartCodesData((prev) => ({
      ...prev,
      [selectedChartId]: {
        ...prev[selectedChartId],
        icdCodes: prev[selectedChartId].icdCodes.map((c) =>
          c.code === code ? { ...c, feedback } : c
        ),
      },
    }));
  };

  const handleAddCustomCode = (type: 'cpt' | 'icd', code: string, description: string) => {
    if (!selectedChartId) return;
    
    const newCode = {
      code,
      description,
      llmSuggestions: {
        llm1: { suggested: false, reasoning: '', auditTrail: '', modifiers: [] },
        llm2: { suggested: false, reasoning: '', auditTrail: '', modifiers: [] },
        llm3: { suggested: false, reasoning: '', auditTrail: '', modifiers: [] },
      },
      selected: true,
      feedback: '',
      isExternal: true,
      customModifiers: [],
    };

    setChartCodesData((prev) => ({
      ...prev,
      [selectedChartId]: {
        ...prev[selectedChartId],
        [type === 'cpt' ? 'cptCodes' : 'icdCodes']: [
          ...prev[selectedChartId][type === 'cpt' ? 'cptCodes' : 'icdCodes'],
          newCode,
        ],
      },
    }));

    toast({
      title: "Code Added",
      description: `${type.toUpperCase()} code ${code} has been added`,
    });
  };

  const handleToggleModifier = (codeType: 'cpt' | 'icd', code: string, llmKey: 'llm1' | 'llm2' | 'llm3', modifierCode: string) => {
    if (!selectedChartId) return;
    
    const codesKey = codeType === 'cpt' ? 'cptCodes' : 'icdCodes';
    
    setChartCodesData((prev) => ({
      ...prev,
      [selectedChartId]: {
        ...prev[selectedChartId],
        [codesKey]: prev[selectedChartId][codesKey].map((c) => {
          if (c.code !== code) return c;
          
          const llmSuggestion = c.llmSuggestions[llmKey];
          const currentSelected = llmSuggestion.selectedModifiers || llmSuggestion.modifiers;
          
          return {
            ...c,
            llmSuggestions: {
              ...c.llmSuggestions,
              [llmKey]: {
                ...llmSuggestion,
                selectedModifiers: currentSelected.includes(modifierCode)
                  ? currentSelected.filter(m => m !== modifierCode)
                  : [...currentSelected, modifierCode]
              }
            }
          };
        }),
      },
    }));
  };

  const handleToggleCustomModifier = (codeType: 'cpt' | 'icd', code: string, modifierCode: string) => {
    if (!selectedChartId) return;
    
    const codesKey = codeType === 'cpt' ? 'cptCodes' : 'icdCodes';
    
    setChartCodesData((prev) => ({
      ...prev,
      [selectedChartId]: {
        ...prev[selectedChartId],
        [codesKey]: prev[selectedChartId][codesKey].map((c) =>
          c.code === code
            ? {
                ...c,
                customModifiers: c.customModifiers.map(m =>
                  m.code === modifierCode ? { ...m, selected: !m.selected } : m
                )
              }
            : c
        ),
      },
    }));
  };

  const handleRerun = () => {
    toast({
      title: "Re-running Analysis",
      description: "Chart is being reprocessed...",
    });
  };

  const handleRunAllCharts = () => {
    toast({
      title: "Running All Charts",
      description: "All charts are being reprocessed...",
    });
  };

  const handleToggleApproval = () => {
    if (!selectedChartId) return;
    
    setCharts((prev) =>
      prev.map((chart) =>
        chart.id === selectedChartId
          ? { ...chart, approved: !chart.approved }
          : chart
      )
    );

    toast({
      title: selectedChart?.approved ? "Chart Unapproved" : "Chart Approved",
      description: selectedChart?.approved 
        ? "Chart marked as unapproved" 
        : "Chart and codes have been approved",
    });
  };

  const handleImportCharts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.multiple = true;
    input.onchange = () => {
      toast({
        title: "Charts imported",
        description: "Charts are being processed...",
      });
    };
    input.click();
  };

  const handleToggleChartSelection = (chartId: string) => {
    setSelectedChartIds(prev =>
      prev.includes(chartId)
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  const handleSelectAllCharts = (selected: boolean) => {
    if (selected) {
      setSelectedChartIds(filteredCharts.map(chart => chart.id));
    } else {
      setSelectedChartIds([]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="h-12 border-b border-border bg-card flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-lg font-semibold text-card-foreground">
            RCM Medical Coding System - Run {runId}
          </h1>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {!isSidebarCollapsed && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <ChartSidebar
                  charts={filteredCharts}
                  selectedChartId={selectedChartId}
                  onSelectChart={setSelectedChartId}
                  filterStatus={filterStatus}
                  onFilterChange={setFilterStatus}
                  onImportCharts={handleImportCharts}
                  onRunAllCharts={handleRunAllCharts}
                  isCollapsed={isSidebarCollapsed}
                  onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  selectedChartIds={selectedChartIds}
                  onToggleChartSelection={handleToggleChartSelection}
                  onSelectAllCharts={handleSelectAllCharts}
                />
              </ResizablePanel>
              
              <ResizableHandle className="w-px bg-border" />
            </>
          )}
          
          {isSidebarCollapsed && (
            <>
              <div className="w-12 border-r border-border bg-sidebar flex flex-col items-center py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="h-8 w-8 p-0"
                  title="Expand Sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <ResizableHandle className="w-px bg-border" />
            </>
          )}
          
          <ResizablePanel defaultSize={isSidebarCollapsed ? 100 : 80} minSize={70}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={55} minSize={35}>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={70} minSize={50}>
                    <ChartViewer 
                      chart={selectedChart} 
                      onToggleApproval={selectedChart ? handleToggleApproval : undefined}
                      onRerun={selectedChart ? handleRerun : undefined}
                    />
                  </ResizablePanel>
                  
                  <ResizableHandle className="h-px bg-border" />
                  
                  <ResizablePanel defaultSize={30} minSize={20}>
                    {selectedChartCodes ? (
                      <FinalCodesSection
                        cptCodes={selectedChartCodes.cptCodes}
                        icdCodes={selectedChartCodes.icdCodes}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-card border-t border-border">
                        <p className="text-muted-foreground text-sm">Select a chart to view final codes</p>
                      </div>
                    )}
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle className="w-px bg-border" />

              <ResizablePanel defaultSize={45} minSize={30}>
                <CodeComparisonPanel
                  chartCodes={selectedChartCodes}
                  onToggleCPTCode={handleToggleCPTCode}
                  onToggleICDCode={handleToggleICDCode}
                  onUpdateCPTFeedback={handleUpdateCPTFeedback}
                  onUpdateICDFeedback={handleUpdateICDFeedback}
                  onAddCustomCode={handleAddCustomCode}
                  onToggleCPTModifier={(code, llmKey, modifierCode) => handleToggleModifier('cpt', code, llmKey, modifierCode)}
                  onToggleICDModifier={(code, llmKey, modifierCode) => handleToggleModifier('icd', code, llmKey, modifierCode)}
                  onToggleCPTCustomModifier={(code, modifierCode) => handleToggleCustomModifier('cpt', code, modifierCode)}
                  onToggleICDCustomModifier={(code, modifierCode) => handleToggleCustomModifier('icd', code, modifierCode)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;

