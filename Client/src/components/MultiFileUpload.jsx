

// import { useState, useEffect } from "react";
// import { Upload, X, FileText, Send, Loader2 } from "lucide-react";
// import {
//   processWithOpenAI,
//   processWithClaude,
//   processWithGemini,
//   cleanAndParseLLMJson,
// } from "../utils/fileUtils";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// export default function MultiFileUpload({ results, setResults, clientId }) {
//   const [files, setFiles] = useState([]);
//   const [prompt, setPrompt] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("openai");
//   const [error, setError] = useState("");

//   // ✅ Handle missing clientId safely
//   useEffect(() => {
//     if (!clientId || clientId === "undefined" || clientId === "null") {
//       setError("Client ID is missing — cannot upload charts.");
//     } else {
//       setError("");
//     }
//   }, [clientId]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles((prev) => [...prev, ...selectedFiles]);
//     setError("");
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
//   };

//   const processFiles = async () => {
//     if (!clientId || clientId === "undefined" || clientId === "null") {
//       setError("Client ID is missing — cannot upload charts.");
//       return;
//     }

//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsProcessing(true);
//     setError("");
//     const newResults = [];

//     try {
//       for (const file of files) {
//         const resultItem = {
//           fileName: file.name,
//           pdfUrl: URL.createObjectURL(file),
//           openai: null,
//           claude: null,
//           gemini: null,
//           error: null,
//         };

//         try {
//           // Process with all 3 LLMs concurrently
//           const [openaiRes, claudeRes, geminiRes] = await Promise.all([
//             processWithOpenAI(file, prompt, clientId),
//             processWithClaude(file, prompt, clientId),
//             processWithGemini(file, prompt, clientId),
//           ]);

//           resultItem.openai =
//             cleanAndParseLLMJson(openaiRes.output_text) ||
//             openaiRes.error ||
//             "No response from OpenAI";
//           resultItem.claude =
//             cleanAndParseLLMJson(claudeRes.output_text) ||
//             claudeRes.error ||
//             "No response from Claude";
//           resultItem.gemini =
//             cleanAndParseLLMJson(geminiRes.output_text) ||
//             geminiRes.error ||
//             "No response from Gemini";

//           console.log("📦 Sending chart to backend:", {
//             client: clientId,
//             name: file.name,
//             pdfUrl: resultItem.pdfUrl,
//           });

//           // Save chart to MongoDB for this client
//           await fetch(`${API_BASE}/charts`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               client: clientId,
//               name: file.name,
//               pdfUrl: resultItem.pdfUrl,
//               content: prompt,
//               llmSuggestions: {
//                 openai: resultItem.openai,
//                 claude: resultItem.claude,
//                 gemini: resultItem.gemini,
//               },
//             }),
//           });
//         } catch (err) {
//           console.error(`Error processing ${file.name}:`, err);
//           resultItem.error = err.message || "Failed to process file";
//         }

//         newResults.push(resultItem);
//       }

//       setResults(newResults);
//     } catch (err) {
//       console.error("Processing error:", err);
//       setError("An error occurred while processing files. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setResults([]);
//     setError("");
//   };

//   // 🧱 Render fallback if clientId missing
//   if (!clientId || clientId === "undefined" || clientId === "null") {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         <p className="mb-2">⚠️ No client selected.</p>
//         <p className="text-sm text-gray-500">
//           Please go back to the dashboard and select a client before uploading files.
//         </p>
//       </div>
//     );
//   }

//   // ✅ Normal upload UI
//   return (
//     <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-4">Document Analyzer</h1>

//         {/* Optional Prompt Input */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Analysis Prompt (optional)
//           </label>
//           <textarea
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter a custom analysis prompt..."
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         </div>

//         {/* File Upload */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Upload Files
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <div className="flex text-sm text-gray-600 justify-center">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
//                 >
//                   <span>Upload files</span>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     className="sr-only"
//                     multiple
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">
//                 PDF, DOCX, TXT up to 10MB
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Selected Files */}
//         {files.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">
//               Selected Files
//             </h3>
//             <ul className="border rounded-md divide-y divide-gray-200">
//               {files.map((file, index) => (
//                 <li
//                   key={index}
//                   className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
//                 >
//                   <div className="w-0 flex-1 flex items-center">
//                     <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                     <span className="ml-2 flex-1 w-0 truncate">
//                       {file.name}
//                     </span>
//                     <span className="text-gray-500">
//                       {formatFileSize(file.size)}
//                     </span>
//                   </div>
//                   <div className="ml-4 flex-shrink-0">
//                     <button
//                       onClick={() => removeFile(index)}
//                       className="text-gray-400 hover:text-gray-500"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-3">
//           {files.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//             >
//               Clear All
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={processFiles}
//             disabled={isProcessing || files.length === 0}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Send className="-ml-1 mr-2 h-4 w-4" />
//                 Analyze Files
//               </>
//             )}
//           </button>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}
//       </div>

//       {/* Results */}
//       {results.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">
//             Analysis Results
//           </h2>

//           {/* Dropdown to select model */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Model
//             </label>
//             <select
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="openai">OpenAI</option>
//               <option value="claude">Claude</option>
//               <option value="gemini">Gemini</option>
//             </select>
//           </div>

//           {/* File Results */}
//           <div className="bg-white shadow overflow-hidden sm:rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {results.map((item, index) => (
//                 <li key={index} className="px-4 py-4">
//                   <p className="text-sm font-medium text-indigo-600 truncate">
//                     {item.fileName}
//                   </p>
//                   <div className="mt-2">
//                     {item.error ? (
//                       <p className="text-sm text-red-600">{item.error}</p>
//                     ) : (
//                       <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-80 overflow-y-auto border border-gray-200">
//                         <pre className="text-sm text-gray-800 whitespace-pre-wrap">
//                           {typeof item[selectedModel] === "object"
//                             ? JSON.stringify(item[selectedModel], null, 2)
//                             : item[selectedModel] ||
//                               `No ${selectedModel} response available.`}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { Upload, X, FileText, Send, Loader2 } from "lucide-react";


// import {
//   processWithOpenAI,
//   processWithClaude,
//   processWithGemini,
//   cleanAndParseLLMJson,
// } from "../utils/fileUtils";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// export default function MultiFileUpload({ results, setResults, clientId, onUploadComplete }) {
//   const [files, setFiles] = useState([]);
//   const [prompt, setPrompt] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("openai");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!clientId || clientId === "undefined" || clientId === "null") {
//       setError("Client ID is missing — cannot upload charts.");
//     } else {
//       setError("");
//     }
//   }, [clientId]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles((prev) => [...prev, ...selectedFiles]);
//     setError("");
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
//   };

//   if (!clientId || clientId === "undefined" || clientId === "null") {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         <p className="mb-2">⚠️ No client selected.</p>
//         <p className="text-sm text-gray-500">Please go back to the dashboard and select a client before uploading files.</p>
//       </div>
//     );
//   }

//   const processFiles = async () => {
//     if (!clientId) {
//       setError("Client ID is missing — cannot upload charts.");
//       return;
//     }
//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsProcessing(true);
//     setError("");
//     const newResults = [];

//     try {
//       for (const file of files) {
//         const resultItem = {
//           fileName: file.name,
//           pdfUrl: URL.createObjectURL(file),
//           openai: null,
//           claude: null,
//           gemini: null,
//           error: null,
//         };

//         try {
//           // user-provided utils: processWithOpenAI/processWithClaude/processWithGemini
//           // if these are async calls to external services, they should return objects
//           const [openaiRes, claudeRes, geminiRes] = await Promise.all([
//             processWithOpenAI(file, prompt, clientId),
//             processWithClaude(file, prompt, clientId),
//             processWithGemini(file, prompt, clientId),
//           ]);

//           resultItem.openai = cleanAndParseLLMJson(openaiRes.output_text) || openaiRes.error || "No response from OpenAI";
//           resultItem.claude = cleanAndParseLLMJson(claudeRes.output_text) || claudeRes.error || "No response from Claude";
//           resultItem.gemini = cleanAndParseLLMJson(geminiRes.output_text) || geminiRes.error || "No response from Gemini";

//           // Save chart to backend
//           await fetch(`${API_BASE}/charts`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               client: clientId,
//               name: file.name,
//               pdfUrl: resultItem.pdfUrl,
//               content: prompt,
//               llmSuggestions: {
//                 openai: resultItem.openai || {},
//                 claude: resultItem.claude || {},
//                 gemini: resultItem.gemini || {},
//               },
//             }),
//           });
//         } catch (err) {
//           console.error(`Error processing ${file.name}:`, err);
//           resultItem.error = err.message || "Failed to process file";
//         }

//         newResults.push(resultItem);
//       }

//       setResults(newResults);
//       // call the parent to re-fetch charts (user requested: re-fetch and leave selection unchanged)
//       if (typeof onUploadComplete === "function") {
//         try {
//           await onUploadComplete();
//         } catch (e) {
//           console.warn("onUploadComplete threw:", e);
//         }
//       }
//     } catch (err) {
//       console.error("Processing error:", err);
//       setError("An error occurred while processing files. Please try again.");

//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setResults([]);
//     setError("");
//   };

//   return (
//     <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-4">Document Analyzer</h1>

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Prompt (optional)</label>
//           <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter a custom analysis prompt..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <div className="flex text-sm text-gray-600 justify-center">
//                 <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
//                   <span>Upload files</span>
//                   <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
//             </div>
//           </div>
//         </div>

//         {files.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
//             <ul className="border rounded-md divide-y divide-gray-200">
//               {files.map((file, index) => (
//                 <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
//                   <div className="w-0 flex-1 flex items-center">
//                     <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                     <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
//                     <span className="text-gray-500">{formatFileSize(file.size)}</span>
//                   </div>
//                   <div className="ml-4 flex-shrink-0">
//                     <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-gray-500">
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <div className="flex justify-end space-x-3">
//           {files.length > 0 && (
//             <button type="button" onClick={clearAll} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
//               Clear All
//             </button>
//           )}
//           <button type="button" onClick={processFiles} disabled={isProcessing || files.length === 0} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50">
//             {isProcessing ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Send className="-ml-1 mr-2 h-4 w-4" />
//                 Analyze Files
//               </>
//             )}
//           </button>
//         </div>

//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}
//       </div>

//       {results.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Select Model</label>
//             <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
//               <option value="openai">OpenAI</option>
//               <option value="claude">Claude</option>
//               <option value="gemini">Gemini</option>
//             </select>
//           </div>

//           <div className="bg-white shadow overflow-hidden sm:rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {results.map((item, index) => (
//                 <li key={index} className="px-4 py-4">
//                   <p className="text-sm font-medium text-indigo-600 truncate">{item.fileName}</p>
//                   <div className="mt-2">
//                     {item.error ? (
//                       <p className="text-sm text-red-600">{item.error}</p>
//                     ) : (
//                       <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-80 overflow-y-auto border border-gray-200">
//                         <pre className="text-sm text-gray-800 whitespace-pre-wrap">
//                           {typeof item[selectedModel] === "object" ? JSON.stringify(item[selectedModel], null, 2) : item[selectedModel] || `No ${selectedModel} response available.`}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { X, FileText, Send, Loader2 } from "lucide-react";
// import {
//   processWithOpenAI,
//   processWithClaude,
//   processWithGemini,
//   cleanAndParseLLMJson,
// } from "../utils/fileUtils";
// import { updateClientRun } from "@/services/api"; // ✅ new import

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// export default function MultiFileUpload({ results, setResults, clientId, onUploadComplete }) {
//   const [files, setFiles] = useState([]);
//   const [prompt, setPrompt] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("openai");
//   const [error, setError] = useState("");

//   // ✅ Validate clientId
//   useEffect(() => {
//     if (!clientId || clientId === "undefined" || clientId === "null") {
//       setError("Client ID is missing — cannot upload charts.");
//     } else {
//       setError("");
//     }
//   }, [clientId]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles((prev) => [...prev, ...selectedFiles]);
//     setError("");
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
//   };

//   // ⚠️ Early return if client missing
//   if (!clientId || clientId === "undefined" || clientId === "null") {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         <p className="mb-2">⚠️ No client selected.</p>
//         <p className="text-sm text-gray-500">
//           Please go back to the dashboard and select a client before uploading files.
//         </p>
//       </div>
//     );
//   }

//   // ✅ Main processing function
//   const processFiles = async () => {
//     if (!clientId) {
//       setError("Client ID is missing — cannot upload charts.");
//       return;
//     }
//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsProcessing(true);
//     setError("");
//     const newResults = [];

//     try {
//       for (const file of files) {
//         const resultItem = {
//           fileName: file.name,
//           pdfUrl: URL.createObjectURL(file),
//           openai: null,
//           claude: null,
//           gemini: null,
//           error: null,
//         };

//         try {
//           // 🧠 Process with all LLMs in parallel
//           const [openaiRes, claudeRes, geminiRes] = await Promise.all([
//             processWithOpenAI(file, prompt, clientId),
//             processWithClaude(file, prompt, clientId),
//             processWithGemini(file, prompt, clientId),
//           ]);

//           resultItem.openai =
//             cleanAndParseLLMJson(openaiRes.output_text) ||
//             openaiRes.error ||
//             "No response from OpenAI";
//           resultItem.claude =
//             cleanAndParseLLMJson(claudeRes.output_text) ||
//             claudeRes.error ||
//             "No response from Claude";
//           resultItem.gemini =
//             cleanAndParseLLMJson(geminiRes.output_text) ||
//             geminiRes.error ||
//             "No response from Gemini";

//           // 💾 Save chart to backend
//           await fetch(`${API_BASE}/charts`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               client: clientId,
//               name: file.name,
//               pdfUrl: resultItem.pdfUrl,
//               content: prompt,
//               llmSuggestions: {
//                 openai: resultItem.openai || {},
//                 claude: resultItem.claude || {},
//                 gemini: resultItem.gemini || {},
//               },
//             }),
//           });
//         } catch (err) {
//           console.error(`Error processing ${file.name}:`, err);
//           resultItem.error = err.message || "Failed to process file";
//         }

//         newResults.push(resultItem);
//       }

//       // ✅ Update UI
//       setResults(newResults);

//       // ✅ Notify parent to refresh chart list
//       if (typeof onUploadComplete === "function") {
//         try {
//           await onUploadComplete();
//         } catch (e) {
//           console.warn("onUploadComplete threw:", e);
//         }
//       }

//       // ✅ Update client's lastRunTime & totalRuns
//       try {
//         const updateRes = await updateClientRun(clientId, prompt);
//         console.log("✅ Client run info updated:", updateRes);
//       } catch (e) {
//         console.error("Failed to update client run info:", e);
//       }
//     } catch (err) {
//       console.error("Processing error:", err);
//       setError("An error occurred while processing files. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setResults([]);
//     setError("");
//   };

//   // ✅ UI
//   return (
//     <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-4">Document Analyzer</h1>

//         {/* Prompt input */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Analysis Prompt (optional)
//           </label>
//           <textarea
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter a custom analysis prompt..."
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         </div>

//         {/* File upload */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Upload Files
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <div className="flex text-sm text-gray-600 justify-center">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
//                 >
//                   <span>Upload files</span>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     className="sr-only"
//                     multiple
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">
//                 PDF, DOCX, TXT up to 10MB
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Selected Files */}
//         {files.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">
//               Selected Files
//             </h3>
//             <ul className="border rounded-md divide-y divide-gray-200">
//               {files.map((file, index) => (
//                 <li
//                   key={index}
//                   className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
//                 >
//                   <div className="w-0 flex-1 flex items-center">
//                     <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                     <span className="ml-2 flex-1 w-0 truncate">
//                       {file.name}
//                     </span>
//                     <span className="text-gray-500">
//                       {formatFileSize(file.size)}
//                     </span>
//                   </div>
//                   <div className="ml-4 flex-shrink-0">
//                     <button
//                       onClick={() => removeFile(index)}
//                       className="text-gray-400 hover:text-gray-500"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end space-x-3">
//           {files.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//             >
//               Clear All
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={processFiles}
//             disabled={isProcessing || files.length === 0}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Send className="-ml-1 mr-2 h-4 w-4" />
//                 Analyze Files
//               </>
//             )}
//           </button>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}
//       </div>

//       {/* Analysis Results */}
//       {results.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">
//             Analysis Results
//           </h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Model
//             </label>
//             <select
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="openai">OpenAI</option>
//               <option value="claude">Claude</option>
//               <option value="gemini">Gemini</option>
//             </select>
//           </div>

//           <div className="bg-white shadow overflow-hidden sm:rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {results.map((item, index) => (
//                 <li key={index} className="px-4 py-4">
//                   <p className="text-sm font-medium text-indigo-600 truncate">
//                     {item.fileName}
//                   </p>
//                   <div className="mt-2">
//                     {item.error ? (
//                       <p className="text-sm text-red-600">{item.error}</p>
//                     ) : (
//                       <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-80 overflow-y-auto border border-gray-200">
//                         <pre className="text-sm text-gray-800 whitespace-pre-wrap">
//                           {typeof item[selectedModel] === "object"
//                             ? JSON.stringify(item[selectedModel], null, 2)
//                             : item[selectedModel] ||
//                               `No ${selectedModel} response available.`}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import { X, FileText, Send, Loader2 } from "lucide-react";
// import {
//   processWithOpenAI,
//   processWithClaude,
//   processWithGemini,
//   cleanAndParseLLMJson,
// } from "../utils/fileUtils";
// import { updateClientRun } from "@/services/api";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// export default function MultiFileUpload({ results, setResults, clientId, onUploadComplete }) {
//   const [files, setFiles] = useState([]);
//   const [prompt, setPrompt] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("openai");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!clientId || clientId === "undefined" || clientId === "null") {
//       setError("Client ID is missing — cannot upload charts.");
//     } else {
//       setError("");
//     }
//   }, [clientId]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     setFiles((prev) => [...prev, ...selectedFiles]);
//     setError("");
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
//   };

//   if (!clientId || clientId === "undefined" || clientId === "null") {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         <p className="mb-2">⚠️ No client selected.</p>
//         <p className="text-sm text-gray-500">
//           Please go back to the dashboard and select a client before uploading files.
//         </p>
//       </div>
//     );
//   }

//   const processFiles = async () => {
//     if (!clientId) {
//       setError("Client ID is missing — cannot upload charts.");
//       return;
//     }
//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsProcessing(true);
//     setError("");
//     const newResults = [];

//     try {
//       for (const file of files) {
//         const resultItem = {
//           fileName: file.name,
//           pdfUrl: URL.createObjectURL(file),
//           openai: null,
//           claude: null,
//           gemini: null,
//           error: null,
//         };

//         try {
//           // 🧠 Run all LLMs in parallel
//           const [openaiRes, claudeRes, geminiRes] = await Promise.all([
//             processWithOpenAI(file, prompt, clientId),
//             processWithClaude(file, prompt, clientId),
//             processWithGemini(file, prompt, clientId),
//           ]);

//           resultItem.openai =
//             cleanAndParseLLMJson(openaiRes.output_text) ||
//             openaiRes.error ||
//             "No response from OpenAI";
//           resultItem.claude =
//             cleanAndParseLLMJson(claudeRes.output_text) ||
//             claudeRes.error ||
//             "No response from Claude";
//           resultItem.gemini =
//             cleanAndParseLLMJson(geminiRes.output_text) ||
//             geminiRes.error ||
//             "No response from Gemini";

//           // 💾 Save chart to backend
//           const createRes = await fetch(`${API_BASE}/charts`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               client: clientId,
//               name: file.name,
//               pdfUrl: resultItem.pdfUrl,
//               content: prompt,
//               llmSuggestions: {
//                 openai: resultItem.openai || {},
//                 claude: resultItem.claude || {},
//                 gemini: resultItem.gemini || {},
//               },
//             }),
//           });

//           if (!createRes.ok) throw new Error("Failed to create chart entry");
//           const createdChart = await createRes.json();

//           // 🧩 Upload PDF bytes to /api/charts/:id/pdf
//           try {
//             const formData = new FormData();
//             formData.append("pdf", file);
//             const uploadRes = await fetch(`${API_BASE}/charts/${createdChart._id}/pdf`, {
//               method: "PUT",
//               body: formData,
//             });
//             if (!uploadRes.ok) {
//               console.warn(`⚠️ PDF byte upload failed for ${file.name}`);
//             } else {
//               console.log(`✅ Stored PDF bytes for chart ${createdChart._id}`);
//             }
//           } catch (uploadErr) {
//             console.error("PDF upload failed:", uploadErr);
//           }
//         } catch (err) {
//           console.error(`Error processing ${file.name}:`, err);
//           resultItem.error = err.message || "Failed to process file";
//         }

//         newResults.push(resultItem);
//       }

//       setResults(newResults);

//       if (typeof onUploadComplete === "function") {
//         try {
//           await onUploadComplete();
//         } catch (e) {
//           console.warn("onUploadComplete threw:", e);
//         }
//       }

//       try {
//         const updateRes = await updateClientRun(clientId, prompt);
//         console.log("✅ Client run info updated:", updateRes);
//       } catch (e) {
//         console.error("Failed to update client run info:", e);
//       }
//     } catch (err) {
//       console.error("Processing error:", err);
//       setError("An error occurred while processing files. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setResults([]);
//     setError("");
//   };

//   return (
//     <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-4">Document Analyzer</h1>

//         {/* Prompt input */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Analysis Prompt (optional)
//           </label>
//           <textarea
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter a custom analysis prompt..."
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         </div>

//         {/* File upload */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Upload Files
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <div className="flex text-sm text-gray-600 justify-center">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
//                 >
//                   <span>Upload files</span>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     className="sr-only"
//                     multiple
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
//             </div>
//           </div>
//         </div>

//         {/* Selected files */}
//         {files.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
//             <ul className="border rounded-md divide-y divide-gray-200">
//               {files.map((file, index) => (
//                 <li
//                   key={index}
//                   className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
//                 >
//                   <div className="w-0 flex-1 flex items-center">
//                     <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                     <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
//                     <span className="text-gray-500">{formatFileSize(file.size)}</span>
//                   </div>
//                   <div className="ml-4 flex-shrink-0">
//                     <button
//                       onClick={() => removeFile(index)}
//                       className="text-gray-400 hover:text-gray-500"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end space-x-3">
//           {files.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
//             >
//               Clear All
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={processFiles}
//             disabled={isProcessing || files.length === 0}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Send className="-ml-1 mr-2 h-4 w-4" />
//                 Analyze Files
//               </>
//             )}
//           </button>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}
//       </div>

//       {/* Results */}
//       {results.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Model
//             </label>
//             <select
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="openai">OpenAI</option>
//               <option value="claude">Claude</option>
//               <option value="gemini">Gemini</option>
//             </select>
//           </div>

//           <div className="bg-white shadow overflow-hidden sm:rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {results.map((item, index) => (
//                 <li key={index} className="px-4 py-4">
//                   <p className="text-sm font-medium text-indigo-600 truncate">{item.fileName}</p>
//                   <div className="mt-2">
//                     {item.error ? (
//                       <p className="text-sm text-red-600">{item.error}</p>
//                     ) : (
//                       <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-80 overflow-y-auto border border-gray-200">
//                         <pre className="text-sm text-gray-800 whitespace-pre-wrap">
//                           {typeof item[selectedModel] === "object"
//                             ? JSON.stringify(item[selectedModel], null, 2)
//                             : item[selectedModel] ||
//                               `No ${selectedModel} response available.`}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useState, useEffect } from "react";
// import { X, FileText, Send, Loader2, Upload } from "lucide-react";
// import {
//   processWithOpenAI,
//   processWithClaude,
//   processWithGemini,
//   cleanAndParseLLMJson,
// } from "../utils/fileUtils";
// import { updateClientRun } from "@/services/api";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// export default function MultiFileUpload({
//   results,
//   setResults,
//   clientId,
//   onUploadComplete,
// }) {
//   const [files, setFiles] = useState([]);
//   const [prompt, setPrompt] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isUploadingOnly, setIsUploadingOnly] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("openai");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!clientId || clientId === "undefined" || clientId === "null") {
//       setError("Client ID is missing — cannot upload charts.");
//     } else {
//       setError("");
//     }
//   }, [clientId]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     setFiles((prev) => [...prev, ...selectedFiles]);
//     setError("");
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
//   };

//   if (!clientId || clientId === "undefined" || clientId === "null") {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         <p className="mb-2">⚠️ No client selected.</p>
//         <p className="text-sm text-gray-500">
//           Please go back to the dashboard and select a client before uploading files.
//         </p>
//       </div>
//     );
//   }

//   // --------------------------------------------------------
//   // 🔵 NEW: UPLOAD ONLY (NO LLM CALLS)
//   // --------------------------------------------------------
//   const uploadOnly = async () => {
//     if (!clientId) {
//       setError("Client ID is missing — cannot upload charts.");
//       return;
//     }
//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsUploadingOnly(true);
//     setError("");

//     try {
//       for (const file of files) {
//         const fileUrl = URL.createObjectURL(file);

//         // 1️⃣ Create chart WITHOUT LLM fields
//         const createRes = await fetch(`${API_BASE}/charts`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             client: clientId,
//             name: file.name,
//             pdfUrl: fileUrl,
//             content: "", // you can store extracted raw text later if needed
//             llmResults: [], // empty
//             finalCptCodes: [],
//             finalIcdCodes: [],
//           }),
//         });

//         if (!createRes.ok) throw new Error("Failed to create chart entry");

//         const createdChart = await createRes.json();

//         // 2️⃣ Upload PDF file bytes
//         try {
//           const formData = new FormData();
//           formData.append("pdf", file);

//           const uploadRes = await fetch(
//             `${API_BASE}/charts/${createdChart._id}/pdf`,
//             {
//               method: "PUT",
//               body: formData,
//             }
//           );

//           if (!uploadRes.ok) {
//             console.warn(`⚠️ PDF byte upload failed for ${file.name}`);
//           }
//         } catch (err) {
//           console.error("PDF upload failed:", err);
//         }
//       }

//       setResults([]); // No LLM results for upload-only
//     } catch (err) {
//       console.error(err);
//       setError("Failed to upload files.");
//     } finally {
//       setIsUploadingOnly(false);
//     }
//   };

//   // --------------------------------------------------------
//   // 🟣 ORIGINAL: PROCESS WITH LLMs
//   // --------------------------------------------------------
//   const processFiles = async () => {
//     if (!clientId) {
//       setError("Client ID is missing — cannot upload charts.");
//       return;
//     }
//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsProcessing(true);
//     setError("");
//     const newResults = [];

//     try {
//       for (const file of files) {
//         const resultItem = {
//           fileName: file.name,
//           pdfUrl: URL.createObjectURL(file),
//           openai: null,
//           claude: null,
//           gemini: null,
//           error: null,
//         };

//         try {
//           const [openaiRes, claudeRes, geminiRes] = await Promise.all([
//             processWithOpenAI(file, prompt, clientId),
//             processWithClaude(file, prompt, clientId),
//             processWithGemini(file, prompt, clientId),
//           ]);

//           resultItem.openai =
//             cleanAndParseLLMJson(openaiRes.output_text) ||
//             openaiRes.error ||
//             "No response from OpenAI";
//           resultItem.claude =
//             cleanAndParseLLMJson(claudeRes.output_text) ||
//             claudeRes.error ||
//             "No response from Claude";
//           resultItem.gemini =
//             cleanAndParseLLMJson(geminiRes.output_text) ||
//             geminiRes.error ||
//             "No response from Gemini";

//           // Save chart WITH LLM data
//           const createRes = await fetch(`${API_BASE}/charts`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               client: clientId,
//               name: file.name,
//               pdfUrl: resultItem.pdfUrl,
//               content: prompt,
//               llmSuggestions: {
//                 openai: resultItem.openai || {},
//                 claude: resultItem.claude || {},
//                 gemini: resultItem.gemini || {},
//               },
//             }),
//           });

//           if (!createRes.ok) throw new Error("Failed to create chart entry");

//           const createdChart = await createRes.json();

//           // Upload PDF bytes
//           try {
//             const formData = new FormData();
//             formData.append("pdf", file);
//             await fetch(`${API_BASE}/charts/${createdChart._id}/pdf`, {
//               method: "PUT",
//               body: formData,
//             });
//           } catch {}
//         } catch (err) {
//           resultItem.error = err.message || "Failed to process file";
//         }

//         newResults.push(resultItem);
//       }

//       setResults(newResults);

//       // Switch UI after processing
//       if (typeof onUploadComplete === "function") {
//         await onUploadComplete();
//       }

//       // Update client run stats
//       await updateClientRun(clientId, prompt);
//     } catch (err) {
//       setError("An error occurred while processing files.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setResults([]);
//     setError("");
//   };

//   return (
//     <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-4">Document Analyzer</h1>

//         {/* Prompt */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Analysis Prompt (optional)
//           </label>
//           <textarea
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter a custom analysis prompt..."
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         </div>

//         {/* File Upload */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Upload Files
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <div className="flex text-sm text-gray-600 justify-center">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   <span>Upload files</span>
//                   <input
//                     id="file-upload"
//                     name="file-upload"
//                     type="file"
//                     className="sr-only"
//                     multiple
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
//             </div>
//           </div>
//         </div>

//         {/* Selected Files */}
//         {files.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">
//               Selected Files
//             </h3>
//             <ul className="border rounded-md divide-y divide-gray-200">
//               {files.map((file, index) => (
//                 <li
//                   key={index}
//                   className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
//                 >
//                   <div className="w-0 flex-1 flex items-center">
//                     <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                     <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
//                     <span className="text-gray-500">
//                       {formatFileSize(file.size)}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => removeFile(index)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end space-x-3">
//           {files.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
//             >
//               Clear All
//             </button>
//           )}

//           {/* 🔵 UPLOAD ONLY BUTTON */}
//           <button
//             type="button"
//             onClick={uploadOnly}
//             disabled={isUploadingOnly || files.length === 0}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 hover:bg-gray-200"
//           >
//             {isUploadingOnly ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <Upload className="-ml-1 mr-2 h-4 w-4" />
//                 Upload Only
//               </>
//             )}
//           </button>

//           {/* 🟣 ANALYZE BUTTON */}
//           <button
//             type="button"
//             onClick={processFiles}
//             disabled={isProcessing || files.length === 0}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Send className="-ml-1 mr-2 h-4 w-4" />
//                 Analyze Files
//               </>
//             )}
//           </button>
//         </div>

//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* Results */}
//       {results.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">
//             Analysis Results
//           </h2>

//           {/* Model Select */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Model
//             </label>
//             <select
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="openai">OpenAI</option>
//               <option value="claude">Claude</option>
//               <option value="gemini">Gemini</option>
//             </select>
//           </div>

//           <div className="bg-white shadow rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {results.map((item, index) => (
//                 <li key={index} className="px-4 py-4">
//                   <p className="text-sm font-medium text-indigo-600 truncate">
//                     {item.fileName}
//                   </p>
//                   <div className="mt-2">
//                     {item.error ? (
//                       <p className="text-sm text-red-600">{item.error}</p>
//                     ) : (
//                       <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-80 overflow-y-auto border">
//                         <pre className="text-sm whitespace-pre-wrap">
//                           {typeof item[selectedModel] === "object"
//                             ? JSON.stringify(item[selectedModel], null, 2)
//                             : item[selectedModel] ||
//                               `No ${selectedModel} response.`}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import { X, FileText, Send, Loader2, Upload } from "lucide-react";
// import {
//   processWithOpenAI,
//   processWithClaude,
//   processWithGemini,
//   cleanAndParseLLMJson,
// } from "../utils/fileUtils";
// import { updateClientRun } from "@/services/api";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// export default function MultiFileUpload({ results, setResults, clientId, onUploadComplete }) {
//   const [files, setFiles] = useState([]);
//   const [prompt, setPrompt] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("openai");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!clientId || clientId === "undefined" || clientId === "null") {
//       setError("Client ID is missing — cannot upload charts.");
//     } else {
//       setError("");
//     }
//   }, [clientId]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     setFiles((prev) => [...prev, ...selectedFiles]);
//     setError("");
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
//   };

//   if (!clientId || clientId === "undefined" || clientId === "null") {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         <p className="mb-2">⚠️ No client selected.</p>
//         <p className="text-sm text-gray-500">
//           Please go back to the dashboard and select a client before uploading files.
//         </p>
//       </div>
//     );
//   }

//   /**
//    * ---------------------------------------------------
//    * 🚀 NEW: Upload Only (no LLM calls)
//    * ---------------------------------------------------
//    */
//   const uploadOnly = async () => {
//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsUploading(true);
//     setError("");

//     try {
//       for (const file of files) {
//         // Step 1: Create empty chart doc
//         const createRes = await fetch(`${API_BASE}/charts/upload`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             client: clientId,
//             name: file.name,
//             pdfUrl: URL.createObjectURL(file),
//             content: "",
//           }),
//         });

//         if (!createRes.ok) throw new Error("Failed to create chart entry");

//         const chart = await createRes.json();

//         // Step 2: upload PDF bytes
//         const formData = new FormData();
//         formData.append("pdf", file);

//         const uploadRes = await fetch(`${API_BASE}/charts/${chart._id}/pdf`, {
//           method: "PUT",
//           body: formData,
//         });

//         if (!uploadRes.ok) {
//           console.warn(`⚠️ Failed to upload PDF for chart ${chart._id}`);
//         }
//       }

//       // Clear state
//       setFiles([]);
//       setResults([]);

//       if (onUploadComplete) await onUploadComplete();
//     } catch (err) {
//       console.error("Upload-only error:", err);
//       setError("An error occurred during upload-only.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   /**
//    * ---------------------------------------------------
//    * EXISTING ANALYZE FLOW
//    * ---------------------------------------------------
//    */
//   const processFiles = async () => {
//     if (!clientId) {
//       setError("Client ID is missing — cannot upload charts.");
//       return;
//     }
//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsProcessing(true);
//     setError("");
//     const newResults = [];

//     try {
//       for (const file of files) {
//         const resultItem = {
//           fileName: file.name,
//           pdfUrl: URL.createObjectURL(file),
//           openai: null,
//           claude: null,
//           gemini: null,
//           error: null,
//         };

//         try {
//           const [openaiRes, claudeRes, geminiRes] = await Promise.all([
//             processWithOpenAI(file, prompt, clientId),
//             processWithClaude(file, prompt, clientId),
//             processWithGemini(file, prompt, clientId),
//           ]);

//           resultItem.openai =
//             cleanAndParseLLMJson(openaiRes.output_text) ||
//             openaiRes.error ||
//             "No response from OpenAI";
//           resultItem.claude =
//             cleanAndParseLLMJson(claudeRes.output_text) ||
//             claudeRes.error ||
//             "No response from Claude";
//           resultItem.gemini =
//             cleanAndParseLLMJson(geminiRes.output_text) ||
//             geminiRes.error ||
//             "No response from Gemini";

//           const createRes = await fetch(`${API_BASE}/charts`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               client: clientId,
//               name: file.name,
//               pdfUrl: resultItem.pdfUrl,
//               content: prompt,
//               llmSuggestions: {
//                 openai: resultItem.openai || {},
//                 claude: resultItem.claude || {},
//                 gemini: resultItem.gemini || {},
//               },
//             }),
//           });

//           if (!createRes.ok) throw new Error("Failed to create chart entry");
//           const createdChart = await createRes.json();

//           // upload bytes
//           try {
//             const formData = new FormData();
//             formData.append("pdf", file);
//             await fetch(`${API_BASE}/charts/${createdChart._id}/pdf`, {
//               method: "PUT",
//               body: formData,
//             });
//           } catch (err) {
//             console.warn("PDF upload failed:", err);
//           }
//         } catch (err) {
//           console.error(`Error processing ${file.name}:`, err);
//           resultItem.error = err.message || "Failed to process file";
//         }

//         newResults.push(resultItem);
//       }

//       setResults(newResults);

//       if (onUploadComplete) await onUploadComplete();

//       await updateClientRun(clientId, prompt);
//     } catch (err) {
//       console.error("Processing error:", err);
//       setError("An error occurred while processing files.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setResults([]);
//     setError("");
//   };

//   return (
//     <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-auto p-6 bg-white rounded-lg shadow-md">

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-4">Document Analyzer</h1>

//         {/* Prompt */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Analysis Prompt (optional)
//           </label>
//           <textarea
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             placeholder="Enter a custom analysis prompt..."
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         </div>

//         {/* File Upload */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Upload Files
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <div className="flex text-sm text-gray-600 justify-center">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   <span>Upload files</span>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     className="sr-only"
//                     multiple
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
//             </div>
//           </div>
//         </div>

//         {/* Selected files */}
//         {files.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
//             <ul className="border rounded-md divide-y divide-gray-200">
//               {files.map((file, index) => (
//                 <li
//                   key={index}
//                   className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
//                 >
//                   <div className="flex items-center gap-2 w-0 flex-1">
//                     <FileText className="h-5 w-5 text-gray-400" />
//                     <span className="ml-2 flex-1 truncate">{file.name}</span>
//                     <span className="text-gray-500">{formatFileSize(file.size)}</span>
//                   </div>
//                   <button
//                     onClick={() => removeFile(index)}
//                     className="text-gray-400 hover:text-gray-500 ml-4"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end space-x-3">

//           {/* CLEAR */}
//           {files.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
//             >
//               Clear All
//             </button>
//           )}

//           {/* 🚀 NEW UPLOAD ONLY BUTTON */}
//           <button
//             type="button"
//             onClick={uploadOnly}
//             disabled={isUploading || files.length === 0}
//             className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm disabled:opacity-50"
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <Upload className="-ml-1 mr-2 h-4 w-4" />
//                 Upload Only
//               </>
//             )}
//           </button>

//           {/* ANALYZE BUTTON */}
//           <button
//             type="button"
//             onClick={processFiles}
//             disabled={isProcessing || files.length === 0}
//             className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm disabled:opacity-50"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Send className="-ml-1 mr-2 h-4 w-4" />
//                 Analyze Files
//               </>
//             )}
//           </button>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}
//       </div>

//       {/* Results */}
//       {results.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-medium mb-4">Analysis Results</h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Model
//             </label>
//             <select
//               value={selectedModel}
//               onChange={(e) => setSelectedModel(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="openai">OpenAI</option>
//               <option value="claude">Claude</option>
//               <option value="gemini">Gemini</option>
//             </select>
//           </div>

//           <div className="bg-white shadow rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {results.map((item, index) => (
//                 <li key={index} className="px-4 py-4">
//                   <p className="text-sm font-medium text-indigo-600">{item.fileName}</p>

//                   <div className="mt-2">
//                     {item.error ? (
//                       <p className="text-sm text-red-600">{item.error}</p>
//                     ) : (
//                       <div className="mt-2 p-3 bg-gray-50 rounded border overflow-y-auto max-h-80">
//                         <pre className="text-sm whitespace-pre-wrap">
//                           {typeof item[selectedModel] === "object"
//                             ? JSON.stringify(item[selectedModel], null, 2)
//                             : item[selectedModel] ||
//                               `No ${selectedModel} response available.`}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import { X, FileText, Loader2, Upload } from "lucide-react";
// import { incrementTotalCharts } from "@/services/api";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// export default function MultiFileUpload({ results, setResults, clientId, onUploadComplete }) {
//   const [files, setFiles] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!clientId || clientId === "undefined" || clientId === "null") {
//       setError("Client ID is missing — cannot upload charts.");
//     } else {
//       setError("");
//     }
//   }, [clientId]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     setFiles((prev) => [...prev, ...selectedFiles]);
//     setError("");
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
//   };

//   if (!clientId || clientId === "undefined" || clientId === "null") {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         <p className="mb-2">⚠️ No client selected.</p>
//         <p className="text-sm text-gray-500">
//           Please go back to the dashboard and select a client before uploading files.
//         </p>
//       </div>
//     );
//   }

//   /**
//    * ---------------------------------------------------
//    * 🚀 UPLOAD ONLY — increment totalCharts for each file
//    * ---------------------------------------------------
//    */
//   const uploadOnly = async () => {
//     if (files.length === 0) {
//       setError("Please select at least one file.");
//       return;
//     }

//     setIsUploading(true);
//     setError("");

//     try {
//       for (const file of files) {
//         // Step 1: Create empty chart doc
//         const createRes = await fetch(`${API_BASE}/charts/upload`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             client: clientId,
//             name: file.name,
//             pdfUrl: URL.createObjectURL(file),
//             content: "",
//           }),
//         });

//         if (!createRes.ok) throw new Error("Failed to create chart entry");

//         const chart = await createRes.json();

//         // Step 2: Upload PDF bytes
//         const formData = new FormData();
//         formData.append("pdf", file);

//         const uploadRes = await fetch(`${API_BASE}/charts/${chart._id}/pdf`, {
//           method: "PUT",
//           body: formData,
//         });

//         if (!uploadRes.ok) {
//           console.warn(`⚠️ Failed to upload PDF for chart ${chart._id}`);
//         }

//         // Step 3: Increment totalCharts for client
//         try {
//           await incrementTotalCharts(clientId);
//         } catch (err) {
//           console.error("⚠️ Failed to increment totalCharts:", err);
//         }
//       }

//       // Clear state
//       setFiles([]);
//       setResults([]);

//       if (onUploadComplete) await onUploadComplete();
//     } catch (err) {
//       console.error("Upload-only error:", err);
//       setError("An error occurred during upload-only.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setResults([]);
//     setError("");
//   };

//   return (
//     <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-auto p-6 bg-white rounded-lg shadow-md">

//       <div className="mb-6">
//         {/* REMOVED Document Analyzer heading */}
//         {/* REMOVED Prompt textbox */}

//         {/* File Upload */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Upload Files
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//             <div className="space-y-1 text-center">
//               <div className="flex text-sm text-gray-600 justify-center">
//                 <label
//                   htmlFor="file-upload"
//                   className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   <span>Upload files</span>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     className="sr-only"
//                     multiple
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
//             </div>
//           </div>
//         </div>

//         {/* Selected files */}
//         {files.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
//             <ul className="border rounded-md divide-y divide-gray-200">
//               {files.map((file, index) => (
//                 <li
//                   key={index}
//                   className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
//                 >
//                   <div className="flex items-center gap-2 w-0 flex-1">
//                     <FileText className="h-5 w-5 text-gray-400" />
//                     <span className="ml-2 flex-1 truncate">{file.name}</span>
//                     <span className="text-gray-500">{formatFileSize(file.size)}</span>
//                   </div>
//                   <button
//                     onClick={() => removeFile(index)}
//                     className="text-gray-400 hover:text-gray-500 ml-4"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end space-x-3">

//           {/* CLEAR */}
//           {files.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
//             >
//               Clear All
//             </button>
//           )}

//           {/* 🚀 UPLOAD ONLY (NOW VISIBLE) */}
//           <button
//             type="button"
//             onClick={uploadOnly}
//             disabled={isUploading || files.length === 0}
//             className="upload-btn-visible inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 
//              text-white rounded-md shadow-lg border border-green-700"
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <Upload className="-ml-1 mr-2 h-4 w-4" />
//                 Upload Only
//               </>
//             )}
//           </button>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}
//       </div>

//       {/* Results */}
//       {results.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>

//           <div className="bg-white shadow rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {results.map((item, index) => (
//                 <li key={index} className="px-4 py-4">
//                   <p className="text-sm font-medium text-indigo-600">{item.fileName}</p>

//                   <div className="mt-2">
//                     {item.error ? (
//                       <p className="text-sm text-red-600">{item.error}</p>
//                     ) : (
//                       <div className="mt-2 p-3 bg-gray-50 rounded border">
//                         <p className="text-sm text-gray-600">Uploaded successfully.</p>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { X, FileText, Loader2, Upload } from "lucide-react";
import { incrementTotalCharts } from "@/services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

export default function MultiFileUpload({ results, setResults, clientId, onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientId || clientId === "undefined" || clientId === "null") {
      setError("Client ID is missing — cannot upload charts.");
    } else {
      setError("");
    }
  }, [clientId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
    setError("");
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (!clientId || clientId === "undefined" || clientId === "null") {
    return (
      <div className="p-6 text-center text-gray-600">
        <p className="mb-2">⚠️ No client selected.</p>
        <p className="text-sm text-gray-500">
          Please go back to the dashboard and select a client before uploading files.
        </p>
      </div>
    );
  }

  /**
   * ---------------------------------------------------
   * 🚀 UPLOAD ONLY — increment totalCharts for each file
   * ---------------------------------------------------
   */
  const uploadOnly = async () => {
    if (files.length === 0) {
      setError("Please select at least one file.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      for (const file of files) {
        // Step 1: Create empty chart
        const createRes = await fetch(`${API_BASE}/charts/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client: clientId,
            name: file.name,
            pdfUrl: URL.createObjectURL(file),
            content: "",
          }),
        });

        if (!createRes.ok) throw new Error("Failed to create chart entry");

        const chart = await createRes.json();

        // Step 2: Upload PDF
        const formData = new FormData();
        formData.append("pdf", file);

        const uploadRes = await fetch(`${API_BASE}/charts/${chart._id}/pdf`, {
          method: "PUT",
          body: formData,
        });

        if (!uploadRes.ok) {
          console.warn(`⚠️ Failed to upload PDF for chart ${chart._id}`);
        }

        // Step 3: Increment totalCharts
        try {
          await incrementTotalCharts(clientId);
        } catch (err) {
          console.error("⚠️ Failed to increment totalCharts:", err);
        }
      }

      setFiles([]);
      setResults([]);

      if (onUploadComplete) await onUploadComplete();
    } catch (err) {
      console.error("Upload-only error:", err);
      setError("An error occurred during upload-only.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setResults([]);
    setError("");
  };

  return (
    <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-140px)] overflow-auto p-6 bg-white rounded-lg shadow-md">

      <div className="mb-6">

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files
          </label>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-white">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
            <ul className="border rounded-md divide-y divide-gray-200 bg-white">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="pl-3 pr-4 py-3 flex items-center justify-between text-sm bg-white"
                >
                  <div className="flex items-center gap-2 w-0 flex-1">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 flex-1 truncate">{file.name}</span>
                    <span className="text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-500 ml-4"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 bg-white py-3 sticky bottom-0 border-t border-gray-200 z-50">

          {files.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              Clear All
            </button>
          )}

          {/* UPLOAD ONLY BUTTON (VISIBLE) */}
          <button
            type="button"
            onClick={uploadOnly}
            disabled={isUploading || files.length === 0}
            className=" tw-btn upload-btn-visible 
  inline-flex 
  items-center 
  px-4 
  py-2 
  bg-green-600 
  hover:bg-green-700 
  rounded-md 
  shadow-lg 
  border 
  border-green-700 
  font-medium 
  relative 
  z-50
"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="-ml-1 mr-2 h-4 w-4" />
                Upload Only
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>

          <div className="bg-white shadow rounded-md">
            <ul className="divide-y divide-gray-200">
              {results.map((item, index) => (
                <li key={index} className="px-4 py-4">
                  <p className="text-sm font-medium text-indigo-600">{item.fileName}</p>

                  <div className="mt-2">
                    {item.error ? (
                      <p className="text-sm text-red-600">{item.error}</p>
                    ) : (
                      <div className="mt-2 p-3 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Uploaded successfully.</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
