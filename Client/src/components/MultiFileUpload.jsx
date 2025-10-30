// import { useState } from 'react';
// import { Upload, X, FileText, Send } from 'lucide-react';

// export default function MultiFileUpload() {
//   const [files, setFiles] = useState([]);
//   const [prompt, setPrompt] = useState('Count the total number of words in this document and provide only the number.');
//   const [processing, setProcessing] = useState(false);
//   const [results, setResults] = useState([]);
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     console.log('Selected files:', selectedFiles);
//     console.log('Files array:', selectedFiles.map(file => ({
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       lastModified: file.lastModified,
//       lastModifiedDate: new Date(file.lastModified).toLocaleString()
//     })));
//     setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
//   };

//   const removeFile = (index) => {
//     setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
//   };

//  


//     async function uploadFileToOpenAI(file) {
//     const formData = new FormData();
//     formData.append("file", file);

//     formData.append("purpose", "assistants"); // file type purpose

//     const response = await fetch("https://api.openai.com/v1/files", {
//         method: "POST",
//         headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         },
//         body: formData,
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.error?.message || "Upload failed");
//     return data.id;
//     }

//     async function extractCodesFromFile(fileId, fileName) {
//   const extractionPrompt = `
// You are a medical document parser. 
// Read the attached PDF and extract:
// 1. All CPT codes
// 2. All ICD-10 codes
// Return your response strictly in JSON like this:
// {
//   "file": "${fileName}",
//   "CPT_codes": ["..."],
//   "ICD_codes": ["..."]
// }
// `;
//  const response = await fetch("http://localhost:8081/api/analyze", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ prompt, fileId, fileName }),
// });

//   const data = await response.json();
//   if (!response.ok) throw new Error(data.error?.message || "OpenAI error");

//   return data.choices?.[0]?.message?.content || "No response";
// }


//   // Call OpenAI with file attachment using Assistants API
//   async function callOpenAIWithFile(prompt, fileId, model = 'gpt-4-turbo') {
//     try {
//       // Create an assistant
//       const assistantResponse = await fetch('https://api.openai.com/v1/assistants', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${API_KEY}`,
//           'OpenAI-Beta': 'assistants=v2',
//         },
//         body: JSON.stringify({
//           model: model,
//           tools: [{ type: 'file_search' }],
//         }),
//       });

//       if (!assistantResponse.ok) {
//         throw new Error(`Assistant creation error: ${assistantResponse.status}`);
//       }

//       const assistant = await assistantResponse.json();
//       console.log('Assistant created:', assistant.id);

//       // Create a thread
//       const threadResponse = await fetch('https://api.openai.com/v1/threads', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${API_KEY}`,
//           'OpenAI-Beta': 'assistants=v2',
//         },
//         body: JSON.stringify({
//           messages: [
//             {
//               role: 'user',
//               content: prompt,
//               attachments: [
//                 {
//                   file_id: fileId,
//                   tools: [{ type: 'file_search' }],
//                 },
//               ],
//             },
//           ],
//         }),
//       });

//       if (!threadResponse.ok) {
//         throw new Error(`Thread creation error: ${threadResponse.status}`);
//       }

//       const thread = await threadResponse.json();
//       console.log('Thread created:', thread.id);

//       // Run the assistant
//       const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${API_KEY}`,
//           'OpenAI-Beta': 'assistants=v2',
//         },
//         body: JSON.stringify({
//           assistant_id: assistant.id,
//         }),
//       });

//       if (!runResponse.ok) {
//         throw new Error(`Run creation error: ${runResponse.status}`);
//       }

//       const run = await runResponse.json();
//       console.log('Run started:', run.id);

//       // Poll for completion
//       let runStatus = run;
//       while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
//           headers: {
//             'Authorization': `Bearer ${API_KEY}`,
//             'OpenAI-Beta': 'assistants=v2',
//           },
//         });

//         runStatus = await statusResponse.json();
//         console.log('Run status:', runStatus.status);
//       }

//       // Get messages
//       const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
//         headers: {
//           'Authorization': `Bearer ${API_KEY}`,
//           'OpenAI-Beta': 'assistants=v2',
//         },
//       });

//       const messages = await messagesResponse.json();
//       const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
//       const content = assistantMessage?.content[0]?.text?.value || 'No response';

//       return content;
//     } catch (error) {
//       console.error(`OpenAI API error: ${error.message}`);
//       throw new Error(`OpenAI API error: ${error.message}`);
//     }
//   }

// //   const processFilesWithOpenAI = async () => {
// //     if (files.length === 0 || !prompt.trim()) {
// //       alert('Please upload files and enter a prompt');
// //       return;
// //     }

// //     setProcessing(true);
// //     setResults([]);
// //     console.log('Starting OpenAI processing...');
// //     console.log('Prompt:', prompt);

// //     for (let i = 0; i < files.length; i++) {
// //       const file = files[i];
// //       console.log(`\n--- Processing file ${i + 1}/${files.length} ---`);
// //       console.log('File:', file.name);

// //       try {
// //         // Upload file to OpenAI first
// //         console.log('Uploading file to OpenAI...');
// //         const fileId = await uploadFileToOpenAI(file);
// //         console.log('File uploaded with ID:', fileId);

// //         // Call OpenAI API with file attachment
// //         console.log('Calling OpenAI API with file attachment...');
// //         const aiResponse = await callOpenAIWithFile(prompt, fileId);

// //         const result = {
// //           fileName: file.name,
// //           prompt: prompt,
// //           response: aiResponse,
// //           timestamp: new Date().toLocaleTimeString()
// //         };

// //         console.log('OpenAI Response:', result);
// //         setResults(prev => [...prev, result]);

// //       } catch (error) {
// //         console.error(`Error processing ${file.name}:`, error);
// //         setResults(prev => [...prev, {
// //           fileName: file.name,
// //           prompt: prompt,
// //           response: `Error: ${error.message}`,
// //           timestamp: new Date().toLocaleTimeString(),
// //           isError: true
// //         }]);
// //       }
// //     }

// //     setProcessing(false);
// //     console.log('\n✓ All files processed!');
// //   };

//     async function processFilesWithOpenAI() {
//   if (files.length === 0) {
//     alert("Please upload PDF files first.");
//     return;
//   }

//   setProcessing(true);
//   setResults([]);

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     console.log(`Uploading ${file.name}...`);

//     try {
//       const fileId = await uploadFileToOpenAI(file);
//       console.log(`File uploaded: ${fileId}`);

//       const aiResponse = await extractCodesFromFile(fileId, file.name);

//       setResults((prev) => [
//         ...prev,
//         {
//           fileName: file.name,
//           response: aiResponse,
//           timestamp: new Date().toLocaleTimeString(),
//         },
//       ]);
//     } catch (error) {
//       console.error(`Error for ${file.name}:`, error);
//       setResults((prev) => [
//         ...prev,
//         {
//           fileName: file.name,
//           response: `Error: ${error.message}`,
//           isError: true,
//           timestamp: new Date().toLocaleTimeString(),
//         },
//       ]);
//     }
//   }

//   setProcessing(false);
// }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6">Multiple File Upload</h1>

//           <div className="mb-6">
//             <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
//               <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                 <Upload className="w-12 h-12 text-gray-400 mb-3" />
//                 <p className="mb-2 text-sm text-gray-500">
//                   <span className="font-semibold">Click to upload</span> or drag and drop
//                 </p>
//                 <p className="text-xs text-gray-500">PDF files only • Multiple files supported</p>
//               </div>
//               <input
//                 type="file"
//                 multiple
//                 accept=".pdf"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           {files.length > 0 && (
//             <div className="space-y-3">
//               <h2 className="text-lg font-semibold text-gray-700 mb-3">
//                 Uploaded Files ({files.length})
//               </h2>
//               {files.map((file, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
//                 >
//                   <div className="flex items-center space-x-3 flex-1 min-w-0">
//                     <FileText className="w-8 h-8 text-indigo-500 flex-shrink-0" />
//                     <div className="min-w-0 flex-1">
//                       <p className="text-sm font-medium text-gray-900 truncate">
//                         {file.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {formatFileSize(file.size)}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => removeFile(index)}
//                     className="ml-4 p-1 hover:bg-red-100 rounded-full transition-colors"
//                   >
//                     <X className="w-5 h-5 text-red-500" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {files.length === 0 && (
//             <div className="text-center text-gray-500 py-8">
//               No files uploaded yet
//             </div>
//           )}

//           {files.length > 0 && (
//             <div className="mt-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Prompt for Analysis
//                 </label>
//                 <textarea
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   placeholder="Enter your prompt..."
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   rows="2"
//                 />
//               </div>

//               <button
//                 onClick={processFilesWithOpenAI}
//                 disabled={processing || !prompt.trim()}
//                 className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
//               >
//                 <Send className="w-5 h-5" />
//                 <span>{processing ? `Processing ${results.length + 1}/${files.length}...` : 'Analyze PDFs with OpenAI'}</span>
//               </button>
//             </div>
//           )}

//           {results.length > 0 && (
//             <div className="mt-8">
//               <h2 className="text-lg font-semibold text-gray-700 mb-4">
//                 Analysis Results ({results.length}/{files.length})
//               </h2>
//               <div className="space-y-4">
//                 {results.map((result, index) => (
//                   <div key={index} className={`p-4 border rounded-lg ${result.isError ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className={`font-medium ${result.isError ? 'text-red-900' : 'text-blue-900'}`}>
//                         📄 {result.fileName}
//                       </h3>
//                       <span className={`text-xs ${result.isError ? 'text-red-600' : 'text-blue-600'}`}>
//                         {result.timestamp}
//                       </span>
//                     </div>
//                     <div className="bg-white p-3 rounded border border-gray-200">
//                       <p className="text-xs text-gray-500 mb-1">Prompt:</p>
//                       <p className="text-sm text-gray-600 mb-3 italic">{result.prompt}</p>
//                       <p className="text-xs text-gray-500 mb-1">Response:</p>
//                       <p className="text-base font-semibold text-gray-900 whitespace-pre-wrap">{result.response}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





// import { useState } from 'react';
// import { Upload, X, FileText, Send, Loader2 } from 'lucide-react';
// import { fileToBase64, processFileWithBackend } from '../utils/fileUtils';


// export default function MultiFileUpload() {
//   const [files, setFiles] = useState([]);
//   const [prompt, setPrompt] = useState('Please analyze this document and provide a summary.');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState('');

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
//     setError('');
//   };

//   const removeFile = (index) => {
//     setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
//   };

//   const processFiles = async () => {
//     if (files.length === 0) {
//       setError('Please select at least one file');
//       return;
//     }

//     setIsProcessing(true);
//     setError('');
//     const results = [];

//     try {
//       for (const file of files) {
//         try {
//           const result = await processFileWithBackend(
//             file,
//             prompt,
//             'http://localhost:8081/api/analyze'
//           );

//           results.push({
//             fileName: file.name,
//             result: result.output_text || result.error || 'No content returned'
//           });
//         } catch (err) {
//           console.error(`Error processing ${file.name}:`, err);
//           results.push({
//             fileName: file.name,
//             error: err.message || 'Failed to process file'
//           });
//         }
//       }

//       setResults(results);
//     } catch (err) {
//       setError('An error occurred while processing files. Please try again.');
//       console.error('Processing error:', err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const clearAll = () => {
//     setFiles([]);
//     setResults([]);
//     setError('');
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-4">Document Analyzer</h1>

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
//               <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
//             </div>
//           </div>
//         </div>

//         {/* Selected Files */}
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

//         {/* Prompt Input */}
//         {/* <div className="mb-6">
//           <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
//             Analysis Instructions
//           </label>
//           <div className="mt-1">
//             <textarea
//               rows={3}
//               name="prompt"
//               id="prompt"
//               className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
//               placeholder="Enter your analysis instructions here..."
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//             />
//           </div>
//         </div> */}

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-3">
//           {files.length > 0 && (
//             <button
//               type="button"
//               onClick={clearAll}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Clear All
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={processFiles}
//             disabled={isProcessing || files.length === 0}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg
//                   className="h-5 w-5 text-red-400"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Results */}
//       {results.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
//           <div className="bg-white shadow overflow-hidden sm:rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {results.map((item, index) => (
//                 <li key={index} className="px-4 py-4">
//                   <div className="flex items-center justify-between">
//                     <p className="text-sm font-medium text-indigo-600 truncate">{item.fileName}</p>
//                   </div>
//                   <div className="mt-2">
//                     {item.error ? (
//                       <p className="text-sm text-red-600">{item.error}</p>
//                     ) : (
//                       <div className="mt-2 p-3 bg-gray-50 rounded-md">
//                         <pre className="text-sm text-gray-800 whitespace-pre-wrap">{item.result}</pre>
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

import { useState } from "react";
import { Upload, X, FileText, Send, Loader2 } from "lucide-react";
import {
  processWithOpenAI,
  processWithClaude,
  processWithGemini,
  cleanAndParseLLMJson
} from "../utils/fileUtils";

export default function MultiFileUpload({results, setResults}) {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState(
    ""
  );
  const [isProcessing, setIsProcessing] = useState(false);
  // const [results, setResults] = useState([]); // stores per-file results
  const [selectedModel, setSelectedModel] = useState("openai");
  const [error, setError] = useState("");

  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
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

  const processFiles = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setIsProcessing(true);
    setError("");
    const newResults = [];

    try {
      for (const file of files) {
        const resultItem = {
          fileName: file.name,
          pdfUrl: URL.createObjectURL(file),
          openai: null,
          claude: null,
          gemini: null,
          error: null,
        };

        try {
          // Run all 3 calls concurrently
          const [openaiRes, claudeRes, geminiRes] = await Promise.all([
            processWithOpenAI(file, prompt),
            processWithClaude(file, prompt),
            processWithGemini(file, prompt),
          ]);

          resultItem.openai =
            cleanAndParseLLMJson(openaiRes.output_text) ||
            openaiRes.error ||
            "No response from OpenAI";
          resultItem.claude =
            cleanAndParseLLMJson(claudeRes.output_text) ||
            claudeRes.error ||
            "No response from Claude";
          resultItem.gemini =
            cleanAndParseLLMJson(geminiRes.output_text) ||
            geminiRes.error ||
            "No response from Gemini";
        } catch (err) {
          console.error(`Error processing ${file.name}:`, err);
          resultItem.error = err.message || "Failed to process file";
        }

        newResults.push(resultItem);
      }
      console.log(newResults);
      setResults(newResults);
      
      const runId = Date.now(); // unique timestamp-based run ID
      localStorage.setItem(`llm_results_${runId}`, JSON.stringify(newResults));
      
// Also store the latest run ID so Dashboard can access it easily
      localStorage.setItem("latest_run_id", runId.toString());

    } catch (err) {
      console.error("Processing error:", err);
      setError("An error occurred while processing files. Please try again.");
    } finally {
      setIsProcessing(false);
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
        <h1 className="text-2xl font-bold mb-4">Document Analyzer</h1>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOCX, TXT up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Selected Files
            </h3>
            <ul className="border rounded-md divide-y divide-gray-200">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                >
                  <div className="w-0 flex-1 flex items-center">
                    <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                    <span className="text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          {files.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            onClick={processFiles}
            disabled={isProcessing || files.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              <>
                <Send className="-ml-1 mr-2 h-4 w-4" />
                Analyze Files
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Analysis Results
          </h2>

          {/* Dropdown to select model */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>

          {/* File Results */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {results.map((item, index) => (
                <li key={index} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {item.fileName}
                    </p>
                  </div>

                  <div className="mt-2">
                    {item.error ? (
                      <p className="text-sm text-red-600">{item.error}</p>
                    ) : (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-80 overflow-y-auto border border-gray-200">
                        {/* <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {item[selectedModel] ||
                            `No ${selectedModel} response available.`}
                        </pre> */}
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {typeof item[selectedModel] === "object"
                            ? JSON.stringify(item[selectedModel], null, 2)
                            : item[selectedModel] || `No ${selectedModel} response available.`}
                        </pre>

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
