// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientRuns, exportClientRuns } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { format } from "date-fns";

// const RunsPage = () => {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [runs, setRuns] = useState([]);
//   const [total, setTotal] = useState(0);

//   const [page, setPage] = useState(1);
//   const limit = 25;

//   // filters
//   const [startDT, setStartDT] = useState("");
//   const [endDT, setEndDT] = useState("");
//   const [promptFilter, setPromptFilter] = useState("");

//   // selection
//   const [selectedRuns, setSelectedRuns] = useState(new Set());
//   const [selectAllOnPage, setSelectAllOnPage] = useState(false);

//   // prompts available from runs (for prompt filter dropdown)
//   const [availablePrompts, setAvailablePrompts] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [exporting, setExporting] = useState(false);

//   const fetchRuns = async () => {
//     try {
//       setLoading(true);
//       const resp = await getClientRuns(clientId, {
//         start: startDT || undefined,
//         end: endDT || undefined,
//         promptId: promptFilter || undefined,
//         page,
//         limit,
//       });

//       setRuns(resp.runs || []);
//       setTotal(resp.total || 0);

//       // collect prompts for filter
//       const prompts = [];
//       (resp.runs || []).forEach((r) => {
//         if (r.promptId && !prompts.find((p) => p.id === String(r.promptId))) {
//           prompts.push({ id: String(r.promptId), name: r.promptName || String(r.promptId) });
//         }
//       });
//       setAvailablePrompts(prompts);
//       // reset selection
//       setSelectedRuns(new Set());
//       setSelectAllOnPage(false);
//     } catch (err) {
//       console.error(err);
//       toast({ title: "Error", description: "Failed to fetch runs", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!clientId) return;
//     fetchRuns();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [clientId, page]);

//   const toggleSelectRun = (runId) => {
//     setSelectedRuns((prev) => {
//       const next = new Set(prev);
//       if (next.has(runId)) next.delete(runId);
//       else next.add(runId);
//       setSelectAllOnPage(false);
//       return next;
//     });
//   };

//   const handleSelectAllPage = () => {
//     if (selectAllOnPage) {
//       // deselect all runs on page
//       setSelectedRuns((prev) => {
//         const next = new Set(prev);
//         runs.forEach((r) => next.delete(String(r.runId)));
//         return next;
//       });
//       setSelectAllOnPage(false);
//     } else {
//       // select all runs on page
//       setSelectedRuns((prev) => {
//         const next = new Set(prev);
//         runs.forEach((r) => next.add(String(r.runId)));
//         return next;
//       });
//       setSelectAllOnPage(true);
//     }
//   };

//   const handleExport = async () => {
//     if (selectedRuns.size === 0) {
//       toast({ title: "No runs selected", description: "Select runs to export", variant: "destructive" });
//       return;
//     }

//     setExporting(true);
//     try {
//       const runIds = Array.from(selectedRuns);
//       const blob = await exportClientRuns(clientId, runIds);

//       // download blob as file
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       const fname = `runs_export_${clientId}_${Date.now()}.csv`;
//       a.download = fname;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(url);
//       toast({ title: "Exported", description: "CSV downloaded." });
//     } catch (err) {
//       console.error(err);
//       toast({ title: "Error", description: "Export failed", variant: "destructive" });
//     } finally {
//       setExporting(false);
//     }
//   };

//   const handleApplyFilters = () => {
//     setPage(1);
//     fetchRuns();
//   };

//   const totalPages = Math.ceil((total || 0) / limit);

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">Client Runs</h2>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
//           <Button onClick={handleExport} disabled={exporting || selectedRuns.size === 0}>
//             {exporting ? "Exporting..." : `Export ${selectedRuns.size || ""}`}
//           </Button>
//         </div>
//       </div>

//       {/* Filters toolbar */}
//       <div className="flex gap-3 items-end mb-4">
//         <div>
//           <label className="text-xs text-muted-foreground block mb-1">Start (date/time)</label>
//           <Input type="datetime-local" value={startDT} onChange={(e) => setStartDT(e.target.value)} />
//         </div>

//         <div>
//           <label className="text-xs text-muted-foreground block mb-1">End (date/time)</label>
//           <Input type="datetime-local" value={endDT} onChange={(e) => setEndDT(e.target.value)} />
//         </div>

//         <div>
//           <label className="text-xs text-muted-foreground block mb-1">Prompt</label>
//           <Select value={promptFilter} onValueChange={(v) => setPromptFilter(v)}>
//             <SelectTrigger className="w-48">
//               <SelectValue placeholder="All prompts" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All prompts</SelectItem>
//               {availablePrompts.map((p) => (
//                 <SelectItem key={p.id} value={p.id}>
//                   {p.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <Button onClick={handleApplyFilters}>Apply</Button>
//         </div>

//         <div className="ml-auto flex items-center gap-3">
//           <label className="text-sm">
//             <input type="checkbox" checked={selectAllOnPage} onChange={handleSelectAllPage} />{" "}
//             Select all on page
//           </label>
//         </div>
//       </div>

//       {/* Runs list */}
//       <ScrollArea className="h-[60vh]">
//         <div className="space-y-2">
//           {loading ? (
//             <div className="p-4 text-muted-foreground">Loading...</div>
//           ) : runs.length === 0 ? (
//             <div className="p-4 text-muted-foreground">No runs.</div>
//           ) : (
//             // runs.map((r) => {
//             //   const id = String(r.runId);
//             //   return (
//             //     <Card key={id} className="p-4 flex items-center gap-4">
//             //       <div>
//             //         <input
//             //           type="checkbox"
//             //           checked={selectedRuns.has(id)}
//             //           onChange={() => toggleSelectRun(id)}
//             //         />
//             //       </div>

//             //       <div className="flex-1">
//             //         <div className="flex items-center justify-between">
//             //           <div>
//             //             <div className="text-sm font-medium">{r.promptName || "Prompt"}</div>
//             //             <div className="text-xs text-muted-foreground">{r.chartName || ""}</div>
//             //           </div>

//             //           <div className="text-right text-xs text-muted-foreground">
//             //             <div>{r.timestamp ? format(new Date(r.timestamp), "PPpp") : "unknown"}</div>
//             //             <div className="mt-1">CPT: {r.cptCount} | ICD: {r.icdCount}</div>
//             //           </div>
//             //         </div>
//             //       </div>
//             //     </Card>
//             //   );
//             // })
//             runs.map((r) => {
//   const id = String(r._id); // FIXED HERE!

//   return (
//     <Card key={id} className="p-4 flex items-center gap-4">
//       <div>
//         <input
//           type="checkbox"
//           checked={selectedRuns.has(id)}
//           onChange={() => toggleSelectRun(id)}
//         />
//       </div>

//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-sm font-medium">{r.promptName || "Prompt"}</div>
//             <div className="text-xs text-muted-foreground">{r.chartName || ""}</div>
//           </div>

//           <div className="text-right text-xs text-muted-foreground">
//             <div>{r.timestamp ? format(new Date(r.timestamp), "PPpp") : "unknown"}</div>
//             <div className="mt-1">CPT: {r.cptCount} | ICD: {r.icdCount}</div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// })

//           )}
//         </div>
//       </ScrollArea>

//       {/* Pagination */}
//       <div className="mt-4 flex items-center justify-between">
//         <div className="text-sm text-muted-foreground">Total runs: {total}</div>
//         <div className="flex items-center gap-2">
//           <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
//             Prev
//           </Button>
//           <div>
//             Page {page} / {totalPages || 1}
//           </div>
//           <Button onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))} disabled={page >= totalPages}>
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RunsPage;


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getClientRuns, exportClientRuns } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { format } from "date-fns";

// const RunsPage = () => {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [runs, setRuns] = useState([]);
//   const [total, setTotal] = useState(0);

//   const [page, setPage] = useState(1);
//   const limit = 25;

//   // filters
//   const [startDT, setStartDT] = useState("");
//   const [endDT, setEndDT] = useState("");
//   const [promptFilter, setPromptFilter] = useState("__all__"); // FIXED

//   // selection
//   const [selectedRuns, setSelectedRuns] = useState(new Set());
//   const [selectAllOnPage, setSelectAllOnPage] = useState(false);

//   // prompts for filter dropdown
//   const [availablePrompts, setAvailablePrompts] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [exporting, setExporting] = useState(false);

//   const fetchRuns = async () => {
//     try {
//       setLoading(true);

//       const resp = await getClientRuns(clientId, {
//         start: startDT || undefined,
//         end: endDT || undefined,
//         promptId: promptFilter === "__all__" ? undefined : promptFilter,
//         page,
//         limit,
//       });

//       setRuns(resp.runs || []);
//       setTotal(resp.total || 0);

//       // collect prompts for dropdown
//       const prompts = [];
//       (resp.runs || []).forEach((r) => {
//         const pid = String(r.promptId || "");
//         if (pid && !prompts.find((p) => p.id === pid)) {
//           prompts.push({ id: pid, name: r.promptName || pid });
//         }
//       });

//       setAvailablePrompts(prompts);

//       // reset selection on new page or filter
//       setSelectedRuns(new Set());
//       setSelectAllOnPage(false);

//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch runs",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // load on mount + page change
//   useEffect(() => {
//     if (!clientId) return;
//     fetchRuns();
//   }, [clientId, page]);

//   // toggle selection
//   const toggleSelectRun = (runId) => {
//     setSelectedRuns((prev) => {
//       const next = new Set(prev);
//       next.has(runId) ? next.delete(runId) : next.add(runId);
//       setSelectAllOnPage(false);
//       return next;
//     });
//   };

//   // select all on current page
//   const handleSelectAllPage = () => {
//     if (selectAllOnPage) {
//       setSelectedRuns((prev) => {
//         const next = new Set(prev);
//         runs.forEach((r) => next.delete(String(r.runId)));
//         return next;
//       });
//       setSelectAllOnPage(false);
//     } else {
//       setSelectedRuns((prev) => {
//         const next = new Set(prev);
//         runs.forEach((r) => next.add(String(r.runId)));
//         return next;
//       });
//       setSelectAllOnPage(true);
//     }
//   };

//   // export CSV
//   const handleExport = async () => {
//     if (selectedRuns.size === 0) {
//       toast({
//         title: "No runs selected",
//         description: "Select runs to export",
//         variant: "destructive",
//       });
//       return;
//     }

//     setExporting(true);
//     try {
//       const blob = await exportClientRuns(clientId, Array.from(selectedRuns));

//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `runs_export_${clientId}_${Date.now()}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(url);

//       toast({ title: "Exported", description: "CSV downloaded." });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Export failed",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setExporting(false);
//     }
//   };

//   const handleApplyFilters = () => {
//     setPage(1);
//     fetchRuns();
//   };

//   const totalPages = Math.ceil((total || 0) / limit);

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">Client Runs</h2>

//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => navigate(-1)}>
//             Back
//           </Button>

//           <Button onClick={handleExport} disabled={exporting || selectedRuns.size === 0}>
//             {exporting ? "Exporting..." : `Export ${selectedRuns.size}`}
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-3 items-end mb-4">
//         <div>
//           <label className="text-xs text-muted-foreground block mb-1">
//             Start (date/time)
//           </label>
//           <Input type="datetime-local" value={startDT} onChange={(e) => setStartDT(e.target.value)} />
//         </div>

//         <div>
//           <label className="text-xs text-muted-foreground block mb-1">
//             End (date/time)
//           </label>
//           <Input type="datetime-local" value={endDT} onChange={(e) => setEndDT(e.target.value)} />
//         </div>

//         <div>
//           <label className="text-xs text-muted-foreground block mb-1">Prompt</label>

//           <Select
//             value={promptFilter}
//             onValueChange={(v) => setPromptFilter(v)}
//           >
//             <SelectTrigger className="w-48">
//               <SelectValue placeholder="All prompts" />
//             </SelectTrigger>

//             <SelectContent>
//               <SelectItem value="__all__">All prompts</SelectItem>
//               {availablePrompts.map((p) => (
//                 <SelectItem key={p.id} value={p.id}>
//                   {p.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <Button onClick={handleApplyFilters}>Apply</Button>

//         <div className="ml-auto flex items-center gap-3">
//           <label className="text-sm">
//             <input
//               type="checkbox"
//               checked={selectAllOnPage}
//               onChange={handleSelectAllPage}
//             />{" "}
//             Select all on page
//           </label>
//         </div>
//       </div>

//       {/* Runs List */}
//       <ScrollArea className="h-[60vh]">
//         <div className="space-y-2">
//           {loading ? (
//             <div className="p-4 text-muted-foreground">Loading...</div>
//           ) : runs.length === 0 ? (
//             <div className="p-4 text-muted-foreground">No runs.</div>
//           ) : (
//             runs.map((r) => {
//               const id = String(r.runId); // FIXED: MUST USE runId

//               return (
//                 <Card key={id} className="p-4 flex items-center gap-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedRuns.has(id)}
//                     onChange={() => toggleSelectRun(id)}
//                   />

//                   <div className="flex-1">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-sm font-medium">{r.promptName || "Prompt"}</div>
//                         <div className="text-xs text-muted-foreground">{r.chartName || ""}</div>
//                       </div>

//                       <div className="text-right text-xs text-muted-foreground">
//                         <div>
//                           {r.timestamp
//                             ? format(new Date(r.timestamp), "PPpp")
//                             : "unknown"}
//                         </div>
//                         <div className="mt-1">
//                           CPT: {Array.isArray(r.finalCptCodes) ? r.finalCptCodes.length : 0} | 
// ICD: {Array.isArray(r.finalIcdCodes) ? r.finalIcdCodes.length : 0}

//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               );
//             })
//           )}
//         </div>
//       </ScrollArea>

//       {/* Pagination */}
//       <div className="mt-4 flex items-center justify-between">
//         <div className="text-sm text-muted-foreground">Total runs: {total}</div>

//         <div className="flex items-center gap-2">
//           <Button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page <= 1}
//           >
//             Prev
//           </Button>

//           <div>
//             Page {page} / {totalPages || 1}
//           </div>

//           <Button
//             onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
//             disabled={page >= totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RunsPage;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientRuns, exportClientRuns } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const RunsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [runs, setRuns] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 25;

  // filters
  const [startDT, setStartDT] = useState("");
  const [endDT, setEndDT] = useState("");
  const [promptFilter, setPromptFilter] = useState("__all__");

  // selection
  const [selectedRuns, setSelectedRuns] = useState(new Set());
  const [selectAllOnPage, setSelectAllOnPage] = useState(false);

  // prompts for dropdown
  const [availablePrompts, setAvailablePrompts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // ---------------------------
  // Fetch runs
  // ---------------------------
//   const fetchRuns = async () => {
//     try {
//       setLoading(true);

//       const resp = await getClientRuns(clientId, {
//         start: startDT || undefined,
//         end: endDT || undefined,
//         promptId: promptFilter === "__all__" ? undefined : promptFilter,
//         page,
//         limit,
//       });

//       setRuns(resp.runs || []);
//       setTotal(resp.total || 0);

//       // collect unique prompts
//       const prompts = [];
//       (resp.runs || []).forEach((r) => {
//         const pid = String(r.promptId || "");
//         if (pid && !prompts.find((p) => p.id === pid)) {
//           prompts.push({ id: pid, name: r.promptName || pid });
//         }
//       });

//       setAvailablePrompts(prompts);
//       setSelectedRuns(new Set());
//       setSelectAllOnPage(false);

//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to fetch runs",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

    // inside RunsPage.jsx - replace the fetchRuns function
const fetchRuns = async () => {
  try {
    setLoading(true);

    // convert local datetime-local input to ISO strings (if present)
    const startIso = startDT ? new Date(startDT).toISOString() : undefined;
    const endIso = endDT ? new Date(endDT).toISOString() : undefined;

    // prompt filter handling
    const promptIdParam = promptFilter === "__all__" ? undefined : promptFilter;

    // debug log (open browser console to verify)
    // eslint-disable-next-line no-console
    console.log("Fetching runs with params:", {
      clientId,
      start: startIso,
      end: endIso,
      promptId: promptIdParam,
      page,
      limit,
    });

    const resp = await getClientRuns(clientId, {
      start: startIso,
      end: endIso,
      promptId: promptIdParam,
      page,
      limit,
    });

    setRuns(resp.runs || []);
    setTotal(resp.total || 0);

    // collect prompts for dropdown
    const prompts = [];
    (resp.runs || []).forEach((r) => {
      const pid = String(r.promptId || "");
      if (pid && !prompts.find((p) => p.id === pid)) {
        prompts.push({ id: pid, name: r.promptName || pid });
      }
    });

    setAvailablePrompts(prompts);

    // reset selection on new page or filter
    setSelectedRuns(new Set());
    setSelectAllOnPage(false);
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to fetch runs",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  // Run fetch on load + pagination
  useEffect(() => {
    if (!clientId) return;
    fetchRuns();
  }, [clientId, page]);


  // ---------------------------
  // UI Actions
  // ---------------------------
  const toggleSelectRun = (runId) => {
    setSelectedRuns((prev) => {
      const next = new Set(prev);
      next.has(runId) ? next.delete(runId) : next.add(runId);
      setSelectAllOnPage(false);
      return next;
    });
  };

  const handleSelectAllPage = () => {
    if (selectAllOnPage) {
      setSelectedRuns((prev) => {
        const next = new Set(prev);
        runs.forEach((r) => next.delete(String(r.runId)));
        return next;
      });
      setSelectAllOnPage(false);
    } else {
      setSelectedRuns((prev) => {
        const next = new Set(prev);
        runs.forEach((r) => next.add(String(r.runId)));
        return next;
      });
      setSelectAllOnPage(true);
    }
  };

  const handleExport = async () => {
    if (selectedRuns.size === 0) {
      toast({
        title: "No runs selected",
        description: "Select runs to export.",
        variant: "destructive",
      });
      return;
    }

    setExporting(true);
    try {
      const blob = await exportClientRuns(clientId, Array.from(selectedRuns));

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `runs_export_${clientId}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({
        title: "Exported",
        description: "CSV downloaded.",
      });

    } catch (err) {
      console.error(err);
      toast({
        title: "Export failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchRuns();
  };

  const totalPages = Math.ceil((total || 0) / limit);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Client Runs</h2>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>

          <Button
            onClick={handleExport}
            disabled={exporting || selectedRuns.size === 0}
          >
            {exporting ? "Exporting..." : `Export ${selectedRuns.size}`}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-end mb-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Start (date/time)
          </label>
          <Input
            type="datetime-local"
            value={startDT}
            onChange={(e) => setStartDT(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            End (date/time)
          </label>
          <Input
            type="datetime-local"
            value={endDT}
            onChange={(e) => setEndDT(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Prompt
          </label>

          {/* FIXED SELECT — no placeholder, no empty values */}
          <Select
            value={promptFilter}
            onValueChange={(v) => setPromptFilter(v)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="__all__">All prompts</SelectItem>
              {availablePrompts.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleApplyFilters}>Apply</Button>

        <div className="ml-auto flex items-center gap-3">
          <label className="text-sm">
            <input
              type="checkbox"
              checked={selectAllOnPage}
              onChange={handleSelectAllPage}
            />{" "}
            Select all on page
          </label>
        </div>
      </div>

      {/* Runs List */}
      <ScrollArea className="h-[60vh]">
        <div className="space-y-2">
          {loading ? (
            <div className="p-4 text-muted-foreground">Loading...</div>
          ) : runs.length === 0 ? (
            <div className="p-4 text-muted-foreground">No runs.</div>
          ) : (
            runs.map((r) => {
              const id = String(r.runId);

              return (
                <Card key={id} className="p-4 flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedRuns.has(id)}
                    onChange={() => toggleSelectRun(id)}
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          {r.promptName || "Prompt"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.chartName || ""}
                        </div>
                      </div>

                      <div className="text-right text-xs text-muted-foreground">
                        <div>
                          {r.timestamp
                            ? format(new Date(r.timestamp), "PPpp")
                            : "unknown"}
                        </div>

                        {/* FINAL COUNTS ONLY */}
                        <div className="mt-1">
                          CPT:{" "}
                          {Array.isArray(r.finalCptCodes)
                            ? r.finalCptCodes.length
                            : 0}{" "}
                          | ICD:{" "}
                          {Array.isArray(r.finalIcdCodes)
                            ? r.finalIcdCodes.length
                            : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total runs: {total}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </Button>

          <div>
            Page {page} / {totalPages || 1}
          </div>

          <Button
            onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RunsPage;
