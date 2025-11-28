


// // src/components/RunChartsModal.jsx
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { getClientPrompts } from "@/services/api";
// import { useToast } from "@/hooks/use-toast";

// export default function RunChartsModal({
//   open,
//   onClose,
//   clientId,
//   charts = [],
//   preselectedChartIds = [],
//   onRunComplete = () => {},
// }) {
//   const { toast } = useToast();

//   const [availablePrompts, setAvailablePrompts] = useState([]);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);
//   const [selectedPromptIds, setSelectedPromptIds] = useState(new Set());

//   const [mode, setMode] = useState("list");
//   const [previewPromptId, setPreviewPromptId] = useState(null);

//   const [running, setRunning] = useState(false);
//   const [progress, setProgress] = useState([]);
//   const [completed, setCompleted] = useState(false);

//   // --------- On modal open ---------
//   useEffect(() => {
//     if (!open) return;

//     setSelectedChartIds([...preselectedChartIds]);
//     setSelectedPromptIds(new Set());
//     setMode("list");
//     setPreviewPromptId(null);
//     setProgress([]);
//     setRunning(false);
//     setCompleted(false);

//     loadPrompts();
//   }, [open]);

//   const loadPrompts = async () => {
//     try {
//       const prompts = await getClientPrompts(clientId);
//       setAvailablePrompts(prompts || []);
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to load prompts.",
//         variant: "destructive",
//       });
//     }
//   };

//   const idOfPrompt = (p) => String(p.promptId ?? p._id ?? p.id);

//   const toggleChartSelection = (chartId) =>
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );

//   const togglePromptSelection = (pid) =>
//     setSelectedPromptIds((prev) => {
//       const next = new Set(prev);
//       next.has(pid) ? next.delete(pid) : next.add(pid);
//       return next;
//     });

//   const openPreview = (pid) => {
//     setPreviewPromptId(pid);
//     setMode("preview");
//   };

//   const backToList = () => {
//     setMode("list");
//     setPreviewPromptId(null);
//   };

//   const getPromptById = (id) =>
//     availablePrompts.find((p) => idOfPrompt(p) === String(id)) || null;

//   const runSelected = async () => {
//     if (!selectedChartIds.length)
//       return toast({ title: "Select at least one chart" });
//     if (!selectedPromptIds.size)
//       return toast({ title: "Select at least one prompt" });

//     setRunning(true);
//     setProgress([]);
//     setCompleted(false);

//     const promptsToRun = [...selectedPromptIds];

//     try {
//       for (const chartId of selectedChartIds) {
//         for (const promptId of promptsToRun) {
//           const promptObj = getPromptById(promptId);

//           setProgress((prev) => [
//             ...prev,
//             { chartId, promptId, status: "running", message: "Running..." },
//           ]);

//           try {
//             // const res = await fetch(`/api/charts/${chartId}/run`, {
//             //   method: "POST",
//             //   headers: { "Content-Type": "application/json" },
//             //   body: JSON.stringify({
//             //     promptId,
//             //     promptName: promptObj?.promptName,
//             //     promptText: promptObj?.promptText,
//             //   }),
//             // });
//             const res = await fetch(`${API_BASE}/charts/${chartId}/run`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     promptId,
//     promptName: promptObj.promptName,
//     promptText: promptObj.promptText,
//     models: ["openai", "claude", "gemini"],   // NOW SELECTABLE IN FUTURE
//   }),
// });


//             if (!res.ok) throw new Error(await res.text());

//             setProgress((prev) =>
//               prev.map((p) =>
//                 p.chartId === chartId && p.promptId === promptId
//                   ? { ...p, status: "success", message: "Completed" }
//                   : p
//               )
//             );
//           } catch (err) {
//             setProgress((prev) =>
//               prev.map((p) =>
//                 p.chartId === chartId && p.promptId === promptId
//                   ? { ...p, status: "failed", message: err.message }
//                   : p
//               )
//             );
//           }
//         }
//       }

//       setCompleted(true);
//       onRunComplete();
//     } finally {
//       setRunning(false);
//     }
//   };

//   const handleClose = () => {
//     setSelectedPromptIds(new Set());
//     setMode("list");
//     setPreviewPromptId(null);
//     setProgress([]);
//     setCompleted(false);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
//       <DialogContent className="run-modal p-4">

//         {/* -------------------------------- */}
//         {/*           PREVIEW MODE           */}
//         {/* -------------------------------- */}
//         {mode === "preview" ? (
//           (() => {
//             const prompt = getPromptById(previewPromptId);

//             return (
//               <div className="flex flex-col h-full">

//                 {/* Top Bar */}
//                 <div className="flex items-center justify-between mb-4">
//                   <Button variant="outline" onClick={backToList}>
//                     ← Back
//                   </Button>
//                   <Button variant="ghost" onClick={handleClose}>
//                     Close
//                   </Button>
//                 </div>

//                 {/* Prompt Preview */}
//                 <div className="prompt-preview-wrapper">
//                   <div className="text-2xl font-semibold mb-3">
//                     {prompt?.promptName || "Prompt"}
//                   </div>

//                   <textarea
//                     readOnly
//                     value={prompt?.promptText || ""}
//                     className="
//                       prompt-preview-textarea
//                       w-full
//                       p-5
//                       border
//                       rounded
//                       bg-gray-50
//                       font-mono
//                       text-base
//                       resize-none
//                       overflow-auto
//                     "
//                     style={{
//                       lineHeight: "1.5rem",
//                     }}
//                   />
//                 </div>

//               </div>
//             );
//           })()
//         ) : (
//           <>
//             {/* -------------------------------- */}
//             {/*            LIST MODE              */}
//             {/* -------------------------------- */}
//             <DialogHeader>
//               <h3 className="text-xl font-bold">Run Charts with Prompts</h3>
//               <p className="text-sm text-gray-600">
//                 Select charts (left) and prompts (right). Click a prompt to preview.
//               </p>
//             </DialogHeader>

//             <div className="flex gap-4 h-[65%] mt-4">

//               {/* LEFT — CHARTS */}
//               <div className="w-1/3 border rounded p-3 overflow-auto">
//                 <div className="flex items-center justify-between mb-2">
//                   <strong>Charts</strong>
//                   <button
//                     className="text-sm text-indigo-600 underline"
//                     onClick={() =>
//                       setSelectedChartIds(charts.map((c) => c._id))
//                     }
//                   >
//                     Select all
//                   </button>
//                 </div>

//                 {charts.map((c) => (
//                   <div key={c._id} className="flex items-start gap-2 py-2 border-b">
//                     <Checkbox
//                       checked={selectedChartIds.includes(c._id)}
//                       onCheckedChange={() => toggleChartSelection(c._id)}
//                     />
//                     <div>
//                       <div className="text-sm font-medium">{c.name}</div>
//                       <div className="text-xs text-gray-500">
//                         {new Date(c.createdAt).toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* RIGHT — PROMPTS */}
//               <div className="flex-1 border rounded p-3 overflow-auto">
//                 <strong className="block mb-2">Prompts</strong>

//                 {availablePrompts.map((p) => {
//                   const pid = idOfPrompt(p);
//                   const selected = selectedPromptIds.has(pid);

//                   return (
//                     <div key={pid} className="flex items-start gap-3 py-2 border-b">
//                       <Checkbox
//                         checked={selected}
//                         onCheckedChange={() => togglePromptSelection(pid)}
//                       />

//                       <div className="flex-1">
//                         <div
//                           className="text-sm font-medium cursor-pointer"
//                           onClick={() => openPreview(pid)}
//                         >
//                           {p.promptName}
//                         </div>

//                         <div className="text-xs text-gray-500 truncate">
//                           {(p.promptText || "").slice(0, 150)}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* PROGRESS */}
//             <div className="mt-4 border rounded p-3 h-[18%] overflow-auto">
//               <strong className="block mb-2">Progress</strong>

//               {progress.length === 0 ? (
//                 <div className="text-sm text-gray-500">No runs yet.</div>
//               ) : (
//                 progress.map((p, i) => {
//                   const chart = charts.find((c) => c._id === p.chartId) || {};
//                   const prompt = getPromptById(p.promptId) || {};

//                   return (
//                     <div key={i} className="flex items-start gap-2 py-1">
//                       <div className="w-4">
//                         {p.status === "running"
//                           ? "⏳"
//                           : p.status === "success"
//                           ? "✅"
//                           : "❌"}
//                       </div>

//                       <div>
//                         <div className="font-medium">
//                           {chart.name} — {prompt.promptName}
//                         </div>
//                         <div className="text-xs text-gray-500">{p.message}</div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             <DialogFooter className="mt-4">
//               <Button variant="ghost" onClick={handleClose}>
//                 Close
//               </Button>
//               <Button
//                 className="bg-indigo-600 text-white"
//                 onClick={runSelected}
//               >
//                 Run Selected
//               </Button>
//             </DialogFooter>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }




// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { getClientPrompts } from "@/services/api";
// import { useToast } from "@/hooks/use-toast";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// export default function RunChartsModal({
//   open,
//   onClose,
//   clientId,
//   charts = [],
//   preselectedChartIds = [],
//   onRunComplete = () => {},
// }) {
//   const { toast } = useToast();

//   const [availablePrompts, setAvailablePrompts] = useState([]);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);
//   const [selectedPromptIds, setSelectedPromptIds] = useState(new Set());

//   const [mode, setMode] = useState("list");
//   const [previewPromptId, setPreviewPromptId] = useState(null);

//   const [running, setRunning] = useState(false);
//   const [progress, setProgress] = useState([]);
//   const [completed, setCompleted] = useState(false);


//   /* --------------------------------------------
//    * Load prompts on modal open
//    * -------------------------------------------- */
//   useEffect(() => {
//     if (!open) return;

//     setSelectedChartIds([...preselectedChartIds]);
//     setSelectedPromptIds(new Set());
//     setMode("list");
//     setPreviewPromptId(null);
//     setProgress([]);
//     setRunning(false);
//     setCompleted(false);

//     loadPrompts();
//   }, [open]);


//   const loadPrompts = async () => {
//     try {
//       const prompts = await getClientPrompts(clientId);
//       setAvailablePrompts(prompts || []);
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to load prompts.",
//         variant: "destructive",
//       });
//     }
//   };

//   const idOfPrompt = (p) => String(p.promptId ?? p._id ?? p.id);


//   /* --------------------------------------------
//    * UI Actions
//    * -------------------------------------------- */
//   const toggleChartSelection = (chartId) =>
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );

//   const togglePromptSelection = (pid) =>
//     setSelectedPromptIds((prev) => {
//       const next = new Set(prev);
//       next.has(pid) ? next.delete(pid) : next.add(pid);
//       return next;
//     });

//   const openPreview = (pid) => {
//     setPreviewPromptId(pid);
//     setMode("preview");
//   };

//   const backToList = () => {
//     setMode("list");
//     setPreviewPromptId(null);
//   };

//   const getPromptById = (id) =>
//     availablePrompts.find((p) => idOfPrompt(p) === String(id)) || null;



//   /* --------------------------------------------
//    * SERIAL EXECUTION ENGINE (final)
//    * -------------------------------------------- */
//   const runSelected = async () => {
//     if (!selectedChartIds.length)
//       return toast({ title: "Select at least one chart" });

//     if (!selectedPromptIds.size)
//       return toast({ title: "Select at least one prompt" });

//     setRunning(true);
//     setProgress([]);
//     setCompleted(false);

//     const promptsToRun = [...selectedPromptIds];

//     try {
//       for (const chartId of selectedChartIds) {
//         for (const promptId of promptsToRun) {

//           const promptObj = getPromptById(promptId);

//           setProgress((prev) => [
//             ...prev,
//             { chartId, promptId, status: "running", message: "Running..." },
//           ]);

//           try {
//             const res = await fetch(`${API_BASE}/charts/${chartId}/run`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 promptId,
//                 promptName: promptObj?.promptName,
//                 promptText: promptObj?.promptText,
//                 models: ["openai", "claude", "gemini"], // FUTURE-PROOF
//               }),
//             });

//             if (!res.ok) throw new Error(await res.text());

//             setProgress((prev) =>
//               prev.map((p) =>
//                 p.chartId === chartId && p.promptId === promptId
//                   ? { ...p, status: "success", message: "Completed" }
//                   : p
//               )
//             );
//           } catch (err) {
//             setProgress((prev) =>
//               prev.map((p) =>
//                 p.chartId === chartId && p.promptId === promptId
//                   ? { ...p, status: "failed", message: err.message }
//                   : p
//               )
//             );
//           }
//         }
//       }

//       setCompleted(true);
//       onRunComplete();
//     } finally {
//       setRunning(false);
//     }
//   };


//   const handleClose = () => {
//     setSelectedPromptIds(new Set());
//     setMode("list");
//     setPreviewPromptId(null);
//     setProgress([]);
//     setCompleted(false);
//     onClose();
//   };



//   /* --------------------------------------------
//    * RENDER
//    * -------------------------------------------- */
//   return (
//     <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
//       <DialogContent className="run-modal p-4">

//         {/* ---------------- PREVIEW MODE ---------------- */}
//         {mode === "preview" ? (
//           (() => {
//             const prompt = getPromptById(previewPromptId);
//             return (
//               <div className="flex flex-col h-full">
//                 <div className="flex items-center justify-between mb-4">
//                   <Button variant="outline" onClick={backToList}>
//                     ← Back
//                   </Button>
//                   <Button variant="ghost" onClick={handleClose}>
//                     Close
//                   </Button>
//                 </div>

//                 <div className="prompt-preview-wrapper">
//                   <div className="text-2xl font-semibold mb-3">
//                     {prompt?.promptName || "Prompt"}
//                   </div>

//                   <textarea
//                     readOnly
//                     value={prompt?.promptText || ""}
//                     className="
//                       prompt-preview-textarea
//                       w-full
//                       p-5
//                       border
//                       rounded
//                       bg-gray-50
//                       font-mono
//                       text-base
//                       resize-none
//                       overflow-auto
//                     "
//                     style={{ lineHeight: "1.5rem" }}
//                   />
//                 </div>

//               </div>
//             );
//           })()
//         ) : (
//           <>
//             <DialogHeader>
//               <h3 className="text-xl font-bold">Run Charts with Prompts</h3>
//               <p className="text-sm text-gray-600">
//                 Select charts (left) and prompts (right). Click a prompt to preview.
//               </p>
//             </DialogHeader>

//             <div className="flex gap-4 h-[65%] mt-4">

//               {/* --- CHARTS LIST --- */}
//               <div className="w-1/3 border rounded p-3 overflow-auto">
//                 <div className="flex items-center justify-between mb-2">
//                   <strong>Charts</strong>
//                   <button
//                     className="text-sm text-indigo-600 underline"
//                     onClick={() =>
//                       setSelectedChartIds(charts.map((c) => c._id))
//                     }
//                   >
//                     Select all
//                   </button>
//                 </div>

//                 {charts.map((c) => (
//                   <div key={c._id} className="flex items-start gap-2 py-2 border-b">
//                     <Checkbox
//                       checked={selectedChartIds.includes(c._id)}
//                       onCheckedChange={() => toggleChartSelection(c._id)}
//                     />
//                     <div>
//                       <div className="text-sm font-medium">{c.name}</div>
//                       <div className="text-xs text-gray-500">
//                         {new Date(c.createdAt).toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>



//               {/* --- PROMPTS LIST --- */}
//               <div className="flex-1 border rounded p-3 overflow-auto">
//                 <strong className="block mb-2">Prompts</strong>

//                 {availablePrompts.map((p) => {
//                   const pid = idOfPrompt(p);
//                   const selected = selectedPromptIds.has(pid);

//                   return (
//                     <div key={pid} className="flex items-start gap-3 py-2 border-b">
//                       <Checkbox
//                         checked={selected}
//                         onCheckedChange={() => togglePromptSelection(pid)}
//                       />

//                       <div className="flex-1">
//                         <div
//                           className="text-sm font-medium cursor-pointer"
//                           onClick={() => openPreview(pid)}
//                         >
//                           {p.promptName}
//                         </div>

//                         <div className="text-xs text-gray-500 truncate">
//                           {(p.promptText || "").slice(0, 150)}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>



//             {/* --- PROGRESS LOG --- */}
//             <div className="mt-4 border rounded p-3 h-[18%] overflow-auto">
//               <strong className="block mb-2">Progress</strong>

//               {progress.length === 0 ? (
//                 <div className="text-sm text-gray-500">No runs yet.</div>
//               ) : (
//                 progress.map((p, i) => {
//                   const chart = charts.find((c) => c._id === p.chartId) || {};
//                   const prompt = getPromptById(p.promptId) || {};

//                   return (
//                     <div key={i} className="flex items-start gap-2 py-1">
//                       <div className="w-4">
//                         {p.status === "running"
//                           ? "⏳"
//                           : p.status === "success"
//                           ? "✅"
//                           : "❌"}
//                       </div>

//                       <div>
//                         <div className="font-medium">
//                           {chart.name} — {prompt.promptName}
//                         </div>
//                         <div className="text-xs text-gray-500">{p.message}</div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>


//             <DialogFooter className="mt-4">
//               <Button variant="ghost" onClick={handleClose}>
//                 Close
//               </Button>
//               <Button
//                 className="bg-indigo-600 text-white"
//                 onClick={runSelected}
//                 disabled={running}
//               >
//                 Run Selected
//               </Button>
//             </DialogFooter>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }


// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { getClientPrompts } from "@/services/api";
// import { useToast } from "@/hooks/use-toast";

// export default function RunChartsModal({
//   open,
//   onClose,
//   clientId,
//   charts = [],
//   preselectedChartIds = [],
//   onRunComplete = () => {},
// }) {
//   const { toast } = useToast();

//   const [availablePrompts, setAvailablePrompts] = useState([]);
//   const [selectedChartIds, setSelectedChartIds] = useState([]);
//   const [selectedPromptIds, setSelectedPromptIds] = useState(new Set());

//   const [mode, setMode] = useState("list"); // list | preview
//   const [previewPromptId, setPreviewPromptId] = useState(null);

//   const [running, setRunning] = useState(false);
//   const [progress, setProgress] = useState([]);
//   const [completed, setCompleted] = useState(false);

//   // Load when opened
//   useEffect(() => {
//     if (!open) return;

//     setSelectedChartIds([...preselectedChartIds]);
//     setSelectedPromptIds(new Set());
//     setMode("list");
//     setPreviewPromptId(null);
//     setProgress([]);
//     setRunning(false);
//     setCompleted(false);

//     loadPrompts();
//   }, [open]);

//   const loadPrompts = async () => {
//     try {
//       const prompts = await getClientPrompts(clientId);
//       setAvailablePrompts(prompts || []);
//     } catch (err) {
//       toast({ title: "Failed to load prompts", variant: "destructive" });
//     }
//   };

//   const idOfPrompt = (p) => String(p.promptId ?? p._id ?? p.id);

//   const toggleChartSelection = (chartId) =>
//     setSelectedChartIds((prev) =>
//       prev.includes(chartId)
//         ? prev.filter((id) => id !== chartId)
//         : [...prev, chartId]
//     );

//   const togglePromptSelection = (pid) =>
//     setSelectedPromptIds((prev) => {
//       const next = new Set(prev);
//       next.has(pid) ? next.delete(pid) : next.add(pid);
//       return next;
//     });

//   const openPreview = (pid) => {
//     setPreviewPromptId(pid);
//     setMode("preview");
//   };

//   const backToList = () => {
//     setMode("list");
//     setPreviewPromptId(null);
//   };

//   const getPromptById = (id) =>
//     availablePrompts.find((p) => idOfPrompt(p) === String(id)) || null;

//   // Main execution logic — SERIAL
//   const runSelected = async () => {
//     if (!selectedChartIds.length)
//       return toast({ title: "Select at least one chart" });
//     if (!selectedPromptIds.size)
//       return toast({ title: "Select at least one prompt" });

//     setRunning(true);
//     setCompleted(false);
//     setProgress([]);

//     const promptsToRun = [...selectedPromptIds];

//     try {
//       for (const chartId of selectedChartIds) {
//         for (const promptId of promptsToRun) {
//           const promptObj = getPromptById(promptId);

//           // Add progress entry
//           setProgress((prev) => [
//             ...prev,
//             {
//               chartId,
//               promptId,
//               status: "running",
//               message: "Processing...",
//             },
//           ]);

//           try {
//             const res = await fetch(
//               `http://localhost:8081/api/charts/${chartId}/run`,
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   promptId,
//                   promptName: promptObj?.promptName,
//                   promptText: promptObj?.promptText,
//                   models: ["openai", "claude", "gemini"], // supports future flexibility
//                 }),
//               }
//             );

//             if (!res.ok) {
//               const errText = await res.text();
//               throw new Error(errText || "Failed to run LLM");
//             }

//             setProgress((prev) =>
//               prev.map((p) =>
//                 p.chartId === chartId && p.promptId === promptId
//                   ? { ...p, status: "success", message: "Completed" }
//                   : p
//               )
//             );
//           } catch (err) {
//             setProgress((prev) =>
//               prev.map((p) =>
//                 p.chartId === chartId && p.promptId === promptId
//                   ? { ...p, status: "failed", message: err.message }
//                   : p
//               )
//             );
//           }
//         }
//       }

//       setCompleted(true);
//       onRunComplete();
//     } finally {
//       setRunning(false);
//     }
//   };

//   const handleClose = () => {
//     setSelectedPromptIds(new Set());
//     setMode("list");
//     setPreviewPromptId(null);
//     setProgress([]);
//     setCompleted(false);
//     onClose();
//   };

//   /* --------------------------------------------------------
//      RENDER
//   -------------------------------------------------------- */
//   return (
//     <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
//       <DialogContent className="run-modal p-4">

//         {/* -------------------- PREVIEW MODE -------------------- */}
//         {mode === "preview" ? (
//           (() => {
//             const prompt = getPromptById(previewPromptId);

//             return (
//               <div className="flex flex-col h-full">

//                 {/* Top Bar */}
//                 <div className="flex items-center justify-between mb-4">
//                   <Button variant="outline" onClick={backToList}>
//                     ← Back
//                   </Button>
//                   <Button variant="ghost" onClick={handleClose}>
//                     Close
//                   </Button>
//                 </div>

//                 {/* Prompt Preview Area */}
//                 <div className="flex-1 overflow-auto p-4 border rounded bg-gray-50">
//                   <div className="text-2xl font-semibold mb-4">
//                     {prompt?.promptName ?? "Prompt"}
//                   </div>

//                   <textarea
//                     readOnly
//                     value={prompt?.promptText || ""}
//                     className="w-full h-full resize-none font-mono p-4 bg-white border rounded"
//                   />
//                 </div>
//               </div>
//             );
//           })()
//         ) : (
//           <>
//             {/* -------------------- LIST MODE -------------------- */}
//             <DialogHeader>
//               <h3 className="text-xl font-bold">Run Charts with Prompts</h3>
//               <p className="text-sm text-gray-600">
//                 Select charts (left) and prompts (right). Click a prompt to preview.
//               </p>
//             </DialogHeader>

//             <div className="flex gap-4 h-[65%] mt-4">

//               {/* LEFT: CHARTS */}
//               <div className="w-1/3 border rounded p-3 overflow-auto">
//                 <div className="flex items-center justify-between mb-2">
//                   <strong>Charts</strong>
//                   <button
//                     className="text-sm text-indigo-600 underline"
//                     onClick={() => setSelectedChartIds(charts.map((c) => c._id))}
//                   >
//                     Select all
//                   </button>
//                 </div>

//                 {charts.map((c) => (
//                   <div key={c._id} className="flex items-start gap-2 py-2 border-b">
//                     <Checkbox
//                       checked={selectedChartIds.includes(c._id)}
//                       onCheckedChange={() => toggleChartSelection(c._id)}
//                     />
//                     <div>
//                       <div className="text-sm font-medium">{c.name}</div>
//                       <div className="text-xs text-gray-500">
//                         {new Date(c.createdAt).toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* RIGHT: PROMPTS */}
//               <div className="flex-1 border rounded p-3 overflow-auto">
//                 <strong className="block mb-2">Prompts</strong>

//                 {availablePrompts.map((p) => {
//                   const pid = idOfPrompt(p);
//                   const selected = selectedPromptIds.has(pid);

//                   return (
//                     <div key={pid} className="flex items-start gap-3 py-2 border-b">
//                       <Checkbox
//                         checked={selected}
//                         onCheckedChange={() => togglePromptSelection(pid)}
//                       />

//                       {/* Name + Preview */}
//                       <div className="flex-1">
//                         <div
//                           className="text-sm font-medium cursor-pointer"
//                           onClick={() => openPreview(pid)}
//                         >
//                           {p.promptName}
//                         </div>

//                         <div className="text-xs text-gray-500 truncate">
//                           {(p.promptText || "").slice(0, 150)}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* -------------------- PROGRESS LOG -------------------- */}
//             <div className="mt-4 border rounded p-3 h-[18%] overflow-auto">
//               <strong className="block mb-2">Progress</strong>

//               {progress.length === 0 ? (
//                 <div className="text-sm text-gray-500">No runs yet.</div>
//               ) : (
//                 progress.map((p, i) => {
//                   const chart = charts.find((c) => c._id === p.chartId) || {};
//                   const prompt = getPromptById(p.promptId) || {};

//                   return (
//                     <div key={i} className="flex items-start gap-2 py-1">
//                       <div className="w-4">
//                         {p.status === "running"
//                           ? "⏳"
//                           : p.status === "success"
//                           ? "✅"
//                           : "❌"}
//                       </div>
//                       <div>
//                         <div className="font-medium">
//                           {chart.name} — {prompt.promptName}
//                         </div>
//                         <div className="text-xs text-gray-500">{p.message}</div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             <DialogFooter className="mt-4">
//               <Button variant="ghost" onClick={handleClose}>
//                 Close
//               </Button>
//               <Button
//                 className="bg-indigo-600 text-white"
//                 onClick={runSelected}
//                 disabled={running}
//               >
//                 {running ? "Running..." : "Run Selected"}
//               </Button>
//             </DialogFooter>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }



import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { getClientPrompts } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function RunChartsModal({
  open,
  onClose,
  clientId,
  charts = [],
  preselectedChartIds = [],
  onRunComplete = () => {},
}) {
  const { toast } = useToast();

  const [availablePrompts, setAvailablePrompts] = useState([]);
  const [selectedChartIds, setSelectedChartIds] = useState([]);
  const [selectedPromptIds, setSelectedPromptIds] = useState(new Set());

  const [mode, setMode] = useState("list"); // list | preview
  const [previewPromptId, setPreviewPromptId] = useState(null);

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!open) return;

    setSelectedChartIds([...preselectedChartIds]);
    setSelectedPromptIds(new Set());
    setMode("list");
    setPreviewPromptId(null);
    setProgress([]);
    setRunning(false);
    setCompleted(false);

    loadPrompts();
  }, [open]);

  const loadPrompts = async () => {
    try {
      const prompts = await getClientPrompts(clientId);
      setAvailablePrompts(prompts || []);
    } catch (err) {
      toast({ title: "Failed to load prompts", variant: "destructive" });
    }
  };

  const idOfPrompt = (p) => String(p.promptId ?? p._id ?? p.id);

  const toggleChartSelection = (chartId) =>
    setSelectedChartIds((prev) =>
      prev.includes(chartId)
        ? prev.filter((id) => id !== chartId)
        : [...prev, chartId]
    );

  const togglePromptSelection = (pid) =>
    setSelectedPromptIds((prev) => {
      const next = new Set(prev);
      next.has(pid) ? next.delete(pid) : next.add(pid);
      return next;
    });

  const openPreview = (pid) => {
    setPreviewPromptId(pid);
    setMode("preview");
  };

  const backToList = () => {
    setMode("list");
    setPreviewPromptId(null);
  };

  const getPromptById = (id) =>
    availablePrompts.find((p) => idOfPrompt(p) === String(id)) || null;

  const runSelected = async () => {
    if (!selectedChartIds.length)
      return toast({ title: "Select at least one chart" });
    if (!selectedPromptIds.size)
      return toast({ title: "Select at least one prompt" });

    setRunning(true);
    setCompleted(false);
    setProgress([]);

    const promptsToRun = [...selectedPromptIds];

    try {
      for (const chartId of selectedChartIds) {
        for (const promptId of promptsToRun) {
          const promptObj = getPromptById(promptId);

          setProgress((prev) => [
            ...prev,
            { chartId, promptId, status: "running", message: "Processing..." },
          ]);

          try {
            const res = await fetch(
              `http://localhost:8081/api/charts/${chartId}/run`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  promptId,
                  promptName: promptObj?.promptName,
                  promptText: promptObj?.promptText,
                  models: ["openai", "claude", "gemini"],
                }),
              }
            );

            if (!res.ok) throw new Error(await res.text());

            setProgress((prev) =>
              prev.map((p) =>
                p.chartId === chartId && p.promptId === promptId
                  ? { ...p, status: "success", message: "Completed" }
                  : p
              )
            );
          } catch (err) {
            setProgress((prev) =>
              prev.map((p) =>
                p.chartId === chartId && p.promptId === promptId
                  ? { ...p, status: "failed", message: err.message }
                  : p
              )
            );
          }
        }
      }

      setCompleted(true);
      onRunComplete();
    } finally {
      setRunning(false);
    }
  };

  const handleClose = () => {
    setSelectedPromptIds(new Set());
    setMode("list");
    setPreviewPromptId(null);
    setProgress([]);
    setCompleted(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="run-modal p-0">

        {/* HEADER */}
        <DialogHeader className="p-4 border-b">
          {mode === "list" ? (
            <>
              <h3 className="text-xl font-bold">Run Charts with Prompts</h3>
              <p className="text-sm text-gray-600">
                Select charts (left) and prompts (right). Click a prompt to preview.
              </p>
            </>
          ) : (
            <Button variant="outline" onClick={backToList}>
              ← Back
            </Button>
          )}
        </DialogHeader>

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-auto p-4">

          {mode === "preview" ? (
            (() => {
              const prompt = getPromptById(previewPromptId);
              return (
                <div className="flex flex-col h-full">
                  <div className="text-2xl font-semibold mb-4">
                    {prompt?.promptName ?? "Prompt"}
                  </div>
                  <textarea
                    readOnly
                    value={prompt?.promptText || ""}
                    className="w-full flex-1 resize-none font-mono p-4 bg-gray-50 border rounded"
                  />
                </div>
              );
            })()
          ) : (
            <>
              {/* MAIN GRID */}
              <div className="flex gap-4 h-[60vh]">
                {/* LEFT: CHARTS */}
                <div className="w-1/3 border rounded p-3 overflow-auto">
                  <div className="flex items-center justify-between mb-2">
                    <strong>Charts</strong>
                    <button
                      className="text-sm text-indigo-600 underline"
                      onClick={() => setSelectedChartIds(charts.map((c) => c._id))}
                    >
                      Select all
                    </button>
                  </div>

                  {charts.map((c) => (
                    <div key={c._id} className="flex items-start gap-2 py-2 border-b">
                      <Checkbox
                        checked={selectedChartIds.includes(c._id)}
                        onCheckedChange={() => toggleChartSelection(c._id)}
                      />
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* RIGHT: PROMPTS */}
                <div className="flex-1 border rounded p-3 overflow-auto">
                  <strong className="block mb-2">Prompts</strong>

                  {availablePrompts.map((p) => {
                    const pid = idOfPrompt(p);
                    const selected = selectedPromptIds.has(pid);

                    return (
                      <div key={pid} className="flex items-start gap-3 py-2 border-b">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => togglePromptSelection(pid)}
                        />

                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => openPreview(pid)}
                        >
                          <div className="text-sm font-medium">{p.promptName}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {(p.promptText || "").slice(0, 150)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PROGRESS LOG */}
              <div className="mt-4 border rounded p-3 h-40 overflow-auto">
                <strong className="block mb-2">Progress</strong>
                {progress.length === 0 ? (
                  <div className="text-sm text-gray-500">No runs yet.</div>
                ) : (
                  progress.map((p, i) => {
                    const chart = charts.find((c) => c._id === p.chartId) || {};
                    const prompt = getPromptById(p.promptId) || {};
                    return (
                      <div key={i} className="flex items-start gap-2 py-1">
                        <div className="w-4">
                          {p.status === "running"
                            ? "⏳"
                            : p.status === "success"
                            ? "✅"
                            : "❌"}
                        </div>
                        <div>
                          <div className="font-medium">
                            {chart.name} — {prompt.promptName}
                          </div>
                          <div className="text-xs text-gray-500">{p.message}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER - ALWAYS VISIBLE */}
        <DialogFooter className="p-4 border-t">
          <Button variant="ghost" onClick={handleClose}>
            Close
          </Button>
          <Button
            className="bg-indigo-600 text-white"
            onClick={runSelected}
            disabled={running}
          >
            {running ? "Running..." : "Run Selected"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
