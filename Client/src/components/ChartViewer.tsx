// import { Chart } from "@/types/chart";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Check, X, FileEdit, RefreshCw } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { useState } from "react";

// interface ChartViewerProps {
//   chart: Chart | null;
//   onToggleApproval?: () => void;
//   onRerun?: () => void;
// }

// export const ChartViewer = ({ chart, onToggleApproval, onRerun }: ChartViewerProps) => {
//   const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
//   const [prompt, setPrompt] = useState("You are a medical coding assistant. Analyze the following chart and suggest appropriate CPT and ICD codes based on the documented procedures and diagnoses.");

//   const handleRerunCurrent = () => {
//     setIsPromptDialogOpen(false);
//     if (onRerun) {
//       onRerun();
//     }
//   };

//   const handleRerunAll = () => {
//     setIsPromptDialogOpen(false);
//     if (onRerun) {
//       onRerun();
//     }
//   };

//   if (!chart) {
//     return (
//       <div className="h-full flex items-center justify-center text-muted-foreground">
//         <p>Select a chart to view</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-card border-b border-border flex flex-col">
//       <div className="p-4 border-b border-border">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex-1">
//             <h2 className="text-lg font-semibold text-card-foreground">{chart.name}</h2>
//             <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
//               <span>Patient: {chart.patientName}</span>
//               <span>Date: {chart.date}</span>
//             </div>
//           </div>
//           {onToggleApproval && (
//             <div className="flex items-center gap-2">
//               <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="sm" className="gap-2 shrink-0">
//                     <FileEdit className="w-4 h-4" />
//                     Edit Prompt
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl">
//                   <DialogHeader>
//                     <DialogTitle>Edit Prompt</DialogTitle>
//                     <DialogDescription>
//                       Modify the prompt used for medical coding analysis.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="prompt">Prompt</Label>
//                       <Textarea
//                         id="prompt"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         className="min-h-[200px]"
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button variant="outline" onClick={() => setIsPromptDialogOpen(false)}>
//                       Cancel
//                     </Button>
//                     <Button variant="outline" onClick={handleRerunCurrent}>
//                       <RefreshCw className="w-4 h-4 mr-2" />
//                       Re-run This Chart
//                     </Button>
//                     <Button onClick={handleRerunAll}>
//                       <RefreshCw className="w-4 h-4 mr-2" />
//                       Re-run All Charts
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onRerun}
//                 className="gap-2 shrink-0"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Re-run
//               </Button>

//               <Button
//                 variant={chart.approved ? "default" : "outline"}
//                 size="sm"
//                 onClick={onToggleApproval}
//                 className="gap-2 shrink-0"
//               >
//                 {chart.approved ? (
//                   <>
//                     <Check className="w-4 h-4" />
//                     Approved
//                   </>
//                 ) : (
//                   <>
//                     <X className="w-4 h-4" />
//                     Unapproved
//                   </>
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* <ScrollArea className="flex-1">
//         <div className="p-6">
//           <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans leading-relaxed">
//             {chart.content}
//           </pre>
//         </div>
//       </ScrollArea> */}
//       <ScrollArea className="flex-1 relative">
//   <div className="p-6">
//     {chart?.pdfUrl ? (
//       <iframe
//         src={chart.pdfUrl}
//         className="w-full h-[80vh] border rounded-md shadow-sm"
//         title={chart.name}
//       />
//     ) : (
//       <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans leading-relaxed">
//         {chart?.content || "No chart content available"}
//       </pre>
//     )}
//   </div>
// </ScrollArea>

//     </div>
//   );
// };


// import { useState, useEffect } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Check, X, FileEdit, RefreshCw } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// const ChartViewer = ({ chart, onToggleApproval, onRerun }) => {
//   const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
//   const [prompt, setPrompt] = useState(
//     "You are a medical coding assistant. Analyze the following chart and suggest appropriate CPT and ICD codes based on the documented procedures and diagnoses."
//   );
//   const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
//   const [isLoadingPdf, setIsLoadingPdf] = useState(false);

//   // 🧩 Fetch stored PDF bytes if available
//   useEffect(() => {
//     if (!chart?._id) return;

//     setPdfBlobUrl(null);
//     const fetchPdf = async () => {
//       try {
//         setIsLoadingPdf(true);
//         const res = await fetch(`http://localhost:8081/api/charts/${chart._id}/pdf`);
//         if (!res.ok) return;
//         const blob = await res.blob();
//         const objectUrl = URL.createObjectURL(blob);
//         setPdfBlobUrl(objectUrl);
//       } catch (err) {
//         console.error("Error loading PDF:", err);
//       } finally {
//         setIsLoadingPdf(false);
//       }
//     };

//     fetchPdf();
//     return () => {
//       if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
//     };
//   }, [chart?._id]);

//   const handleRerunCurrent = () => {
//     setIsPromptDialogOpen(false);
//     if (onRerun) onRerun();
//   };

//   if (!chart) {
//     return (
//       <div className="h-full flex items-center justify-center text-muted-foreground">
//         <p>Select a chart to view</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-card border-b border-border flex flex-col">
//       {/* Header */}
//       <div className="p-4 border-b border-border">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex-1">
//             <h2 className="text-lg font-semibold text-card-foreground">{chart.name}</h2>
//             <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
//               {chart.patientName && <span>Patient: {chart.patientName}</span>}
//               {chart.date && <span>Date: {chart.date}</span>}
//             </div>
//           </div>

//           {onToggleApproval && (
//             <div className="flex items-center gap-2">
//               {/* Prompt Dialog */}
//               <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="sm" className="gap-2 shrink-0">
//                     <FileEdit className="w-4 h-4" />
//                     Edit Prompt
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl">
//                   <DialogHeader>
//                     <DialogTitle>Edit Prompt</DialogTitle>
//                     <DialogDescription>
//                       Modify the prompt used for medical coding analysis.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="prompt">Prompt</Label>
//                       <Textarea
//                         id="prompt"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         className="min-h-[200px]"
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsPromptDialogOpen(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button variant="outline" onClick={handleRerunCurrent}>
//                       <RefreshCw className="w-4 h-4 mr-2" />
//                       Re-run This Chart
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onRerun}
//                 className="gap-2 shrink-0"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Re-run
//               </Button>

//               <Button
//                 variant={chart.approved ? "default" : "outline"}
//                 size="sm"
//                 onClick={onToggleApproval}
//                 className="gap-2 shrink-0"
//               >
//                 {chart.approved ? (
//                   <>
//                     <Check className="w-4 h-4" />
//                     Approved
//                   </>
//                 ) : (
//                   <>
//                     <X className="w-4 h-4" />
//                     Unapproved
//                   </>
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Chart body */}
//       <ScrollArea className="flex-1 relative">
//         <div className="p-6">
//           {isLoadingPdf ? (
//             <div className="flex items-center justify-center text-muted-foreground">
//               Loading PDF...
//             </div>
//           ) : pdfBlobUrl ? (
//             <iframe
//               src={pdfBlobUrl}
//               className="w-full h-[80vh] border rounded-md shadow-sm"
//               title={chart.name}
//             />
//           ) : chart?.pdfUrl ? (
//             <iframe
//               src={chart.pdfUrl}
//               className="w-full h-[80vh] border rounded-md shadow-sm"
//               title={chart.name}
//             />
//           ) : (
//             <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans leading-relaxed">
//               {chart?.content || "No chart content available"}
//             </pre>
//           )}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// };

// export default ChartViewer;


// ChartViewer.jsx

// import { useState, useEffect } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Check, X, FileEdit, RefreshCw } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// /**
//  * Props:
//  * - chart: chart object (from backend)
//  * - onToggleApproval
//  * - onRerun
//  * - runs: array of run objects (chart.llmResults)
//  * - selectedPromptId: currently selected promptId (string/ObjectId)
//  * - onSelectPrompt: function(promptId) -> parent will update codes view
//  */
// const ChartViewer = ({
//   chart,
//   onToggleApproval,
//   onRerun,
//   runs = [],
//   selectedPromptId = null,
//   onSelectPrompt = () => {},
// }) => {
//   const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
//   const [prompt, setPrompt] = useState(
//     "You are a medical coding assistant. Analyze the following chart and suggest appropriate CPT and ICD codes based on the documented procedures and diagnoses."
//   );
//   const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
//   const [isLoadingPdf, setIsLoadingPdf] = useState(false);

//   // 🧩 Fetch stored PDF bytes if available
//   useEffect(() => {
//     if (!chart?._id) return;

//     setPdfBlobUrl(null);
//     const fetchPdf = async () => {
//       try {
//         setIsLoadingPdf(true);
//         const res = await fetch(`http://localhost:8081/api/charts/${chart._id}/pdf`);
//         if (!res.ok) return;
//         const blob = await res.blob();
//         const objectUrl = URL.createObjectURL(blob);
//         setPdfBlobUrl(objectUrl);
//       } catch (err) {
//         console.error("Error loading PDF:", err);
//       } finally {
//         setIsLoadingPdf(false);
//       }
//     };

//     fetchPdf();
//     return () => {
//       if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
//     };
//   }, [chart?._id]);

//   const handleRerunCurrent = () => {
//     setIsPromptDialogOpen(false);
//     if (onRerun) onRerun();
//   };

//   // Format timestamp for dropdown
//   function formatTs(ts: any): string {
//   if (!ts) return "unknown";

//   // If ts is a Date object → use it directly
//   if (ts instanceof Date) {
//     return ts.toLocaleString(undefined, {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//     });
//   }

//   // If ts is string or number → convert to Date
//   const d = new Date(ts);

//   if (isNaN(d.getTime())) return "invalid date";

//   return d.toLocaleString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "numeric",
//     minute: "2-digit",
//   });
// }


//   if (!chart) {
//     return (
//       <div className="h-full flex items-center justify-center text-muted-foreground">
//         <p>Select a chart to view</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-card border-b border-border flex flex-col">
//       {/* Header */}
//       <div className="p-4 border-b border-border">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex-1">
//             <h2 className="text-lg font-semibold text-card-foreground">{chart.name}</h2>
//             <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
//               {chart.patientName && <span>Patient: {chart.patientName}</span>}
//               {chart.date && <span>Date: {chart.date}</span>}
//             </div>
//             {/* Prompt selector */}
//             <div className="mt-3">
//               <label className="text-xs text-muted-foreground block mb-1">Select run / prompt</label>
//               <select
//                 value={selectedPromptId || ""}
//                 onChange={(e) => setPrompt(e.currentTarget.value || null)}
//                 className="border border-gray-300 rounded-md px-2 py-1 text-sm"
//               >
//                 {/* If no runs, show a single disabled option */}
//                 {(!runs || runs.length === 0) && (
//                   <option value="">No runs available</option>
//                 )}

//                 {runs && runs.length > 0 && (
//                   <>
//                     {runs.map((r, idx) => {
//                       // Some runs might store promptId as Object or string — normalize
//                       const id = typeof r.promptId === "object" && r.promptId?._id ? r.promptId._id : String(r.promptId || idx);
//                       const label = `${r.promptName || "Prompt"} — ${r.timestamp ? formatTs(r.timestamp) : "unknown time"}`;
//                       return (
//                         <option key={id} value={id}>
//                           {label}
//                         </option>
//                       );
//                     })}
//                   </>
//                 )}
//               </select>
//             </div>
//           </div>

//           {onToggleApproval && (
//             <div className="flex items-center gap-2">
//               {/* Prompt Dialog */}
//               <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="sm" className="gap-2 shrink-0">
//                     <FileEdit className="w-4 h-4" />
//                     Edit Prompt
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl">
//                   <DialogHeader>
//                     <DialogTitle>Edit Prompt</DialogTitle>
//                     <DialogDescription>
//                       Modify the prompt used for medical coding analysis.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="prompt">Prompt</Label>
//                       <Textarea
//                         id="prompt"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         className="min-h-[200px]"
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsPromptDialogOpen(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button variant="outline" onClick={handleRerunCurrent}>
//                       <RefreshCw className="w-4 h-4 mr-2" />
//                       Re-run This Chart
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onRerun}
//                 className="gap-2 shrink-0"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Re-run
//               </Button>

//               <Button
//                 variant={chart.approved ? "default" : "outline"}
//                 size="sm"
//                 onClick={onToggleApproval}
//                 className="gap-2 shrink-0"
//               >
//                 {chart.approved ? (
//                   <>
//                     <Check className="w-4 h-4" />
//                     Approved
//                   </>
//                 ) : (
//                   <>
//                     <X className="w-4 h-4" />
//                     Unapproved
//                   </>
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Chart body */}
//       <ScrollArea className="flex-1 relative">
//         <div className="p-6">
//           {isLoadingPdf ? (
//             <div className="flex items-center justify-center text-muted-foreground">
//               Loading PDF...
//             </div>
//           ) : pdfBlobUrl ? (
//             <iframe
//               src={pdfBlobUrl}
//               className="w-full h-[80vh] border rounded-md shadow-sm"
//               title={chart.name}
//             />
//           ) : chart?.pdfUrl ? (
//             <iframe
//               src={chart.pdfUrl}
//               className="w-full h-[80vh] border rounded-md shadow-sm"
//               title={chart.name}
//             />
//           ) : (
//             <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans leading-relaxed">
//               {chart?.content || "No chart content available"}
//             </pre>
//           )}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// };

// export default ChartViewer;

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Props:
 * - chart
 * - runs
 * - selectedPromptId
 * - onSelectPrompt
 */
const ChartViewer = ({
  chart,
  runs = [],
  selectedPromptId = null,
  onSelectPrompt = (id: string | null) => {}, // ✅ FIXED SIGNATURE
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // -------- Fetch PDF ----------
  useEffect(() => {
    if (!chart?._id) return;

    setPdfBlobUrl(null);
    const fetchPdf = async () => {
      try {
        setIsLoadingPdf(true);
        const res = await fetch(
          `http://localhost:8081/api/charts/${chart._id}/pdf`
        );
        if (!res.ok) return;
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (err) {
        console.error("Error loading PDF:", err);
      } finally {
        setIsLoadingPdf(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [chart?._id]);

  // -------- Format timestamp ----------
  function formatTs(ts: any): string {
    if (!ts) return "unknown";

    if (ts instanceof Date) {
      return ts.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }

    const d = new Date(ts);
    if (isNaN(d.getTime())) return "invalid date";

    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (!chart)
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a chart to view
      </div>
    );

  return (
    <div className="h-full bg-card border-b border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-card-foreground">
              {chart.name}
            </h2>

            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              {chart.patientName && <span>Patient: {chart.patientName}</span>}
              {chart.date && <span>Date: {chart.date}</span>}
            </div>
          </div>

          {/* RIGHT SIDE — NOW ONLY THE DROPDOWN */}
          <div className="flex flex-col items-end">
            <label className="text-xs text-muted-foreground mb-1">
              Select run / prompt
            </label>

            <select
  value={selectedPromptId || ""}
  onChange={(e) => onSelectPrompt(e.target.value || null)}
  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
>
  {(!runs || runs.length === 0) && (
    <option value="">No runs available</option>
  )}

  {runs.map((r) => {
    const runId = String(r.runId); // ✅ ALWAYS use runId

    const label = `${r.promptName || "Prompt"} — ${
      r.timestamp ? formatTs(r.timestamp) : "unknown time"
    }`;

    return (
      <option key={runId} value={runId}>
        {label}
      </option>
    );
  })}
</select>

          </div>
        </div>
      </div>

      {/* Chart body */}
      <ScrollArea className="flex-1 relative">
        <div className="p-6">
          {isLoadingPdf ? (
            <div className="flex items-center justify-center text-muted-foreground">
              Loading PDF...
            </div>
          ) : pdfBlobUrl ? (
            <iframe
              src={pdfBlobUrl}
              className="w-full h-[80vh] border rounded-md shadow-sm"
              title={chart.name}
            />
          ) : chart?.pdfUrl ? (
            <iframe
              src={chart.pdfUrl}
              className="w-full h-[80vh] border rounded-md shadow-sm"
              title={chart.name}
            />
          ) : (
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {chart?.content || "No chart content available"}
            </pre>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChartViewer;
