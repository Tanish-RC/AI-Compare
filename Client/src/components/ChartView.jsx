// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// const ChartView = ({ results }) => {
//   // Process results for charts
//   const processDataForCharts = () => {
//     if (!results || results.length === 0) return { barData: [], lineData: [], pieData: [] };

//     // Process data for bar and line charts
//     const chartData = results.map((result, index) => ({
//       name: `File ${index + 1}`,
//       score: result.score || 0,
//       analysisTime: (result.analysisTime || 0) / 1000, // Convert to seconds
//       wordCount: result.wordCount || 0,
//     }));

//     // Process data for pie chart
//     const pieData = results.map((result, index) => ({
//       name: `File ${index + 1}`,
//       value: result.score || 0,
//     }));

//     return { barData: chartData, lineData: chartData, pieData };
//   };

//   const { barData, lineData, pieData } = processDataForCharts();

//   if (results.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-gray-500">No analysis results available. Please analyze some files first.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Analysis Results Overview</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-medium mb-3">Scores by File</h3>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={barData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="score" fill="#8884d8" name="Score" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-medium mb-3">Analysis Time</h3>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={lineData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="analysisTime" stroke="#82ca9d" name="Time (s)" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8">
//           <h3 className="text-lg font-medium mb-3">Score Distribution</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   File
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Score
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Analysis Time (s)
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Word Count
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {results.map((result, index) => (
//                 <tr key={index}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     File {index + 1}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {result.score?.toFixed(2) || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {result.analysisTime ? (result.analysisTime / 1000).toFixed(2) : 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {result.wordCount || 'N/A'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartView;


import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X, FileEdit, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const ChartView = ({ chart, onToggleApproval, onRerun }) => {
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [prompt, setPrompt] = useState(
    "You are a medical coding assistant. Analyze the following chart and suggest appropriate CPT and ICD codes based on the documented procedures and diagnoses."
  );

  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // 🧩 Fetch stored PDF bytes (if available)
  useEffect(() => {
    if (!chart?._id) return;

    setPdfBlobUrl(null);

    const fetchPdf = async () => {
      try {
        setIsLoadingPdf(true);
        const res = await fetch(`http://localhost:8081/api/charts/${chart._id}/pdf`);
        if (!res.ok) return; // fallback to pdfUrl
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (err) {
        console.error("Error fetching PDF from DB:", err);
      } finally {
        setIsLoadingPdf(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [chart?._id]);

  const handleRerunCurrent = () => {
    setIsPromptDialogOpen(false);
    if (onRerun) onRerun();
  };

  if (!chart) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Select a chart to view</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-card border-b border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-card-foreground">{chart.name}</h2>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              {chart.patientName && <span>Patient: {chart.patientName}</span>}
              {chart.date && <span>Date: {chart.date}</span>}
            </div>
          </div>

          {onToggleApproval && (
            <div className="flex items-center gap-2">
              {/* Edit Prompt Dialog */}
              <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 shrink-0">
                    <FileEdit className="w-4 h-4" />
                    Edit Prompt
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Prompt</DialogTitle>
                    <DialogDescription>
                      Modify the prompt used for medical coding analysis.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Prompt</Label>
                      <Textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPromptDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={handleRerunCurrent}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-run This Chart
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                onClick={onRerun}
                className="gap-2 shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                Re-run
              </Button>

              <Button
                variant={chart.approved ? "default" : "outline"}
                size="sm"
                onClick={onToggleApproval}
                className="gap-2 shrink-0"
              >
                {chart.approved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Approved
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Unapproved
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chart Body */}
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
            <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans leading-relaxed">
              {chart?.content || "No chart content available"}
            </pre>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChartView;