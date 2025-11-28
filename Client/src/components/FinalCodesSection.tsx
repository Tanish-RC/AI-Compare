// // import { CodeSuggestion } from "@/types/chart";
// // import { Badge } from "@/components/ui/badge";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // interface FinalCodesSectionProps {
// //   cptCodes: CodeSuggestion[];
// //   icdCodes: CodeSuggestion[];
// // }

// // export const FinalCodesSection = ({ cptCodes, icdCodes }: FinalCodesSectionProps) => {
// //   const selectedCptCodes = cptCodes.filter(code => code.selected);
// //   const selectedIcdCodes = icdCodes.filter(code => code.selected);

// //   // Get all selected modifiers for a code
// //   const getSelectedModifiers = (code: CodeSuggestion) => {
// //     const allMods = new Set<string>();
    
// //     // Add LLM selected modifiers (using selectedModifiers or falling back to modifiers)
// //     (code.llmSuggestions.llm1.selectedModifiers || code.llmSuggestions.llm1.modifiers).forEach(mod => allMods.add(mod));
// //     (code.llmSuggestions.llm2.selectedModifiers || code.llmSuggestions.llm2.modifiers).forEach(mod => allMods.add(mod));
// //     (code.llmSuggestions.llm3.selectedModifiers || code.llmSuggestions.llm3.modifiers).forEach(mod => allMods.add(mod));
    
// //     // Add custom modifiers that are selected
// //     code.customModifiers.filter(m => m.selected).forEach(mod => allMods.add(mod.code));
    
// //     return Array.from(allMods);
// //   };

// //   if (selectedCptCodes.length === 0 && selectedIcdCodes.length === 0) {
// //     return (
// //       <div className="h-full flex items-center justify-center bg-card border-t border-border">
// //         <p className="text-muted-foreground text-sm">No codes selected</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="h-full bg-card border-t border-border flex flex-col overflow-hidden">
// //       <div className="px-4 py-3 border-b border-border bg-secondary">
// //         <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
// //           Final Approved Codes
// //         </h3>
// //       </div>
      
// //       <Tabs defaultValue="cpt" className="flex-1 flex flex-col overflow-hidden">
// //         <TabsList className="mx-4 mt-3 w-fit">
// //           <TabsTrigger value="cpt">CPT Codes</TabsTrigger>
// //           <TabsTrigger value="icd">ICD Codes</TabsTrigger>
// //         </TabsList>
        
// //         <TabsContent value="cpt" className="flex-1 overflow-y-auto px-4 pb-4 mt-0">
// //           {selectedCptCodes.length > 0 ? (
// //             <div className="space-y-2">
// //               {selectedCptCodes.map((code) => (
// //                 <div key={code.code} className="p-3 bg-secondary/30 rounded-md border border-border space-y-2">
// //                   <div className="flex items-center gap-3">
// //                     <Badge variant="outline" className="font-mono text-xs shrink-0">
// //                       {code.code}
// //                     </Badge>
// //                     {getSelectedModifiers(code).length > 0 && (
// //                       <div className="flex items-center gap-2">
// //                         <span className="text-xs font-medium text-muted-foreground">MOD:</span>
// //                         <div className="flex flex-wrap gap-1">
// //                           {getSelectedModifiers(code).map(mod => (
// //                             <Badge key={mod} variant="secondary" className="text-xs">
// //                               {mod}
// //                             </Badge>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="h-full flex items-center justify-center">
// //               <p className="text-muted-foreground text-sm">No CPT codes selected</p>
// //             </div>
// //           )}
// //         </TabsContent>

// //         <TabsContent value="icd" className="flex-1 overflow-y-auto px-4 pb-4 mt-0">
// //           {selectedIcdCodes.length > 0 ? (
// //             <div className="space-y-2">
// //               {selectedIcdCodes.map((code) => (
// //                 <div key={code.code} className="p-3 bg-secondary/30 rounded-md border border-border">
// //                   <Badge variant="outline" className="font-mono text-xs">
// //                     {code.code}
// //                   </Badge>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="h-full flex items-center justify-center">
// //               <p className="text-muted-foreground text-sm">No ICD codes selected</p>
// //             </div>
// //           )}
// //         </TabsContent>
// //       </Tabs>
// //     </div>
// //   );
// // };


// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export const FinalCodesSection = ({ cptCodes = [], icdCodes = [] }) => {
//   const selectedCptCodes = cptCodes.filter((c) => c.selected);
//   const selectedIcdCodes = icdCodes.filter((c) => c.selected);

//   const getSelectedModifiers = (code) => {
//     const allMods = new Set();
//     ["openai", "claude", "gemini"].forEach((p) => {
//       const prov = code?.llmSuggestions?.[p] || {};
//       const mods = prov.selectedModifiers || prov.modifiers || [];
//       mods.forEach((m) => allMods.add(m));
//     });
//     (code?.customModifiers || []).filter((m) => m.selected).forEach((m) => allMods.add(m.code));
//     return Array.from(allMods);
//   };

//   if (selectedCptCodes.length === 0 && selectedIcdCodes.length === 0) {
//     return (
//       <div className="h-full flex items-center justify-center bg-card border-t border-border">
//         <p className="text-muted-foreground text-sm">No codes selected</p>
//       </div>
//     );
//   }
  

//   return (
//     <div className="h-full bg-card border-t border-border flex flex-col overflow-hidden">
//       <div className="px-4 py-3 border-b border-border bg-secondary">
//         <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
//           Final Approved Codes
//         </h3>
//       </div>

//       <Tabs defaultValue="cpt" className="flex-1 flex flex-col overflow-hidden">
//         <TabsList className="mx-4 mt-3 w-fit">
//           <TabsTrigger value="cpt">CPT Codes</TabsTrigger>
//           <TabsTrigger value="icd">ICD Codes</TabsTrigger>
//         </TabsList>

//         <TabsContent value="cpt" className="flex-1 overflow-y-auto px-4 pb-4 mt-0">
//           {selectedCptCodes.length > 0 ? (
//             <div className="space-y-2">
//               {selectedCptCodes.map((code) => (
//                 <div key={code.code} className="p-3 bg-secondary/30 rounded-md border border-border space-y-2">
//                   <div className="flex items-center gap-3">
//                     <Badge variant="outline" className="font-mono text-xs shrink-0">{code.code}</Badge>
//                     {getSelectedModifiers(code).length > 0 && (
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs font-medium text-muted-foreground">MOD:</span>
//                         <div className="flex flex-wrap gap-1">
//                           {getSelectedModifiers(code).map((mod) => (
//                             <Badge key={mod} variant="secondary" className="text-xs">{mod}</Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <p className="text-muted-foreground text-sm">No CPT codes selected</p>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="icd" className="flex-1 overflow-y-auto px-4 pb-4 mt-0">
//           {selectedIcdCodes.length > 0 ? (
//             <div className="space-y-2">
//               {selectedIcdCodes.map((code) => (
//                 <div key={code.code} className="p-3 bg-secondary/30 rounded-md border border-border">
//                   <Badge variant="outline" className="font-mono text-xs">{code.code}</Badge>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <p className="text-muted-foreground text-sm">No ICD codes selected</p>
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default FinalCodesSection;


// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export const FinalCodesSection = ({ cptCodes = [], icdCodes = [] }) => {
//   const selectedCptCodes = cptCodes.filter((c) => c.selected);
//   const selectedIcdCodes = icdCodes.filter((c) => c.selected);

//   const getSelectedModifiers = (code) => {
//     const allMods = new Set<string>();
//     ["openai", "claude", "gemini"].forEach((p) => {
//       const prov = code?.llmSuggestions?.[p] || {};
//       const mods = prov.selectedModifiers || prov.modifiers || [];
//       mods.forEach((m: string) => allMods.add(m));
//     });
//     (code?.customModifiers || [])
//       .filter((m) => m.selected)
//       .forEach((m) => allMods.add(m.code));
//     return Array.from(allMods);
//   };

//   if (selectedCptCodes.length === 0 && selectedIcdCodes.length === 0) {
//     return (
//       <div className="h-full flex items-center justify-center bg-card border-t border-border">
//         <p className="text-muted-foreground text-sm">No codes selected</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-card border-t border-border flex flex-col overflow-hidden">
//       <div className="px-4 py-3 border-b border-border bg-secondary">
//         <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
//           Final Approved Codes
//         </h3>
//       </div>

//       <Tabs defaultValue="cpt" className="flex-1 flex flex-col overflow-hidden">
//         <TabsList className="mx-4 mt-3 w-fit">
//           <TabsTrigger value="cpt">CPT Codes</TabsTrigger>
//           <TabsTrigger value="icd">ICD Codes</TabsTrigger>
//         </TabsList>

//         {/* CPT Codes Tab */}
//         <TabsContent
//           value="cpt"
//           className="flex-1 overflow-y-auto px-4 pb-4 mt-0"
//         >
//           {selectedCptCodes.length > 0 ? (
//             <div className="space-y-2">
//               {selectedCptCodes.map((code) => (
//                 <div
//                   key={String(code.code)}
//                   className="p-3 bg-secondary/30 rounded-md border border-border space-y-2"
//                 >
//                   <div className="flex items-center gap-3">
//                     <Badge
//                       variant="outline"
//                       className="font-mono text-xs shrink-0"
//                     >
//                       {String(code.code)}
//                     </Badge>
//                     {getSelectedModifiers(code).length > 0 && (
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs font-medium text-muted-foreground">
//                           MOD:
//                         </span>
//                         <div className="flex flex-wrap gap-1">
//                           {getSelectedModifiers(code).map((mod) => (
//                             <Badge
//                               key={String(mod)}
//                               variant="secondary"
//                               className="text-xs"
//                             >
//                               {String(mod)}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <p className="text-muted-foreground text-sm">
//                 No CPT codes selected
//               </p>
//             </div>
//           )}
//         </TabsContent>

//         {/* ICD Codes Tab */}
//         <TabsContent
//           value="icd"
//           className="flex-1 overflow-y-auto px-4 pb-4 mt-0"
//         >
//           {selectedIcdCodes.length > 0 ? (
//             <div className="space-y-2">
//               {selectedIcdCodes.map((code) => (
//                 <div
//                   key={String(code.code)}
//                   className="p-3 bg-secondary/30 rounded-md border border-border"
//                 >
//                   <Badge variant="outline" className="font-mono text-xs">
//                     {String(code.code)}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <p className="text-muted-foreground text-sm">
//                 No ICD codes selected
//               </p>
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default FinalCodesSection;

// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner"; // or any toast system you use

// export const FinalCodesSection = ({ chartId, cptCodes = [], icdCodes = [] }) => {
//   const [isSaving, setIsSaving] = useState(false);

//   const selectedCptCodes = cptCodes.filter((c) => c.selected);
//   const selectedIcdCodes = icdCodes.filter((c) => c.selected);

//   const getSelectedModifiers = (code) => {
//     const allMods = new Set();
//     ["openai", "claude", "gemini"].forEach((p) => {
//       const prov = code?.llmSuggestions?.[p] || {};
//       const mods = prov.selectedModifiers || prov.modifiers || [];
//       mods.forEach((m) => allMods.add(m));
//     });
//     (code?.customModifiers || [])
//       .filter((m) => m.selected)
//       .forEach((m) => allMods.add(m.code));
//     return Array.from(allMods);
//   };

//   const handleSave = async () => {
//     if (!chartId) {
//       toast.error("No chart selected");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Prepare payload that matches your backend schema
//       const payload = {
//         finalCptCodes: selectedCptCodes.map((c) => ({
//           code: c.code,
//           modifiers: getSelectedModifiers(c),
//         })),
//         finalIcdCodes: selectedIcdCodes.map((c) => c.code),
//       };

//       const res = await fetch(`http://localhost:8081/api/charts/${chartId}/final-codes`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save final codes");

//       toast.success("Final codes saved successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving final codes");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (selectedCptCodes.length === 0 && selectedIcdCodes.length === 0) {
//     return (
//       <div className="h-full flex items-center justify-center bg-card border-t border-border">
//         <p className="text-muted-foreground text-sm">No codes selected</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-card border-t border-border flex flex-col overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary">
//         <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
//           Final Approved Codes
//         </h3>
//         <Button
//           variant="default"
//           size="sm"
//           onClick={handleSave}
//           disabled={isSaving}
//         >
//           {isSaving ? "Saving..." : "💾 Save Final Codes"}
//         </Button>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="cpt" className="flex-1 flex flex-col overflow-hidden">
//         <TabsList className="mx-4 mt-3 w-fit">
//           <TabsTrigger value="cpt">CPT Codes</TabsTrigger>
//           <TabsTrigger value="icd">ICD Codes</TabsTrigger>
//         </TabsList>

//         {/* CPT Codes Tab */}
//         <TabsContent
//           value="cpt"
//           className="flex-1 overflow-y-auto px-4 pb-4 mt-0"
//         >
//           {selectedCptCodes.length > 0 ? (
//             <div className="space-y-2">
//               {selectedCptCodes.map((code) => (
//                 <div
//                   key={String(code.code)}
//                   className="p-3 bg-secondary/30 rounded-md border border-border space-y-2"
//                 >
//                   <div className="flex items-center gap-3">
//                     <Badge
//                       variant="outline"
//                       className="font-mono text-xs shrink-0"
//                     >
//                       {String(code.code)}
//                     </Badge>
//                     {getSelectedModifiers(code).length > 0 && (
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs font-medium text-muted-foreground">
//                           MOD:
//                         </span>
//                         <div className="flex flex-wrap gap-1">
//                           {getSelectedModifiers(code).map((mod) => (
//                             <Badge
//                               key={String(mod)}
//                               variant="secondary"
//                               className="text-xs"
//                             >
//                               {String(mod)}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <p className="text-muted-foreground text-sm">
//                 No CPT codes selected
//               </p>
//             </div>
//           )}
//         </TabsContent>

//         {/* ICD Codes Tab */}
//         <TabsContent
//           value="icd"
//           className="flex-1 overflow-y-auto px-4 pb-4 mt-0"
//         >
//           {selectedIcdCodes.length > 0 ? (
//             <div className="space-y-2">
//               {selectedIcdCodes.map((code) => (
//                 <div
//                   key={String(code.code)}
//                   className="p-3 bg-secondary/30 rounded-md border border-border"
//                 >
//                   <Badge variant="outline" className="font-mono text-xs">
//                     {String(code.code)}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <p className="text-muted-foreground text-sm">
//                 No ICD codes selected
//               </p>
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default FinalCodesSection;


// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export const FinalCodesSection = ({ chartId, cptCodes = [], icdCodes = [] }) => {
//   const [isSaving, setIsSaving] = useState(false);

//   const selectedCptCodes = cptCodes.filter((c) => c.selected);
//   const selectedIcdCodes = icdCodes.filter((c) => c.selected);

//   const getSelectedModifiers = (code) => {
//     const allMods = new Set();
//     ["openai", "claude", "gemini"].forEach((p) => {
//       const prov = code?.llmSuggestions?.[p] || {};
//       const mods = prov.selectedModifiers || prov.modifiers || [];
//       mods.forEach((m) => allMods.add(m));
//     });
//     (code?.customModifiers || [])
//       .filter((m) => m.selected)
//       .forEach((m) => allMods.add(m.code));
//     return Array.from(allMods);
//   };

//   const handleSave = async () => {
//     if (!chartId) return alert("No chart selected");

//     const payload = {
//       finalCptCodes: selectedCptCodes.map((c) => ({
//         code: c.code,
//         modifiers: getSelectedModifiers(c),
//       })),
//       finalIcdCodes: selectedIcdCodes.map((c) => c.code),
//     };

//     if (
//       payload.finalCptCodes.length === 0 &&
//       payload.finalIcdCodes.length === 0
//     ) {
//       return alert("No codes selected to save");
//     }

//     setIsSaving(true);
//     try {
//       const res = await fetch(
//         `http://localhost:8081/api/charts/${chartId}/final-codes`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to save final codes");

//       alert("✅ Final codes saved successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error saving final codes");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (selectedCptCodes.length === 0 && selectedIcdCodes.length === 0) {
//     return (
//       <div className="h-full flex items-center justify-center bg-card border-t border-border">
//         <p className="text-muted-foreground text-sm">No codes selected</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-card border-t border-border flex flex-col overflow-hidden">
//       <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary">
//         <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
//           Final Approved Codes
//         </h3>
//         <Button onClick={handleSave} disabled={isSaving}>
//           {isSaving ? "Saving..." : "Save"}
//         </Button>
//       </div>

//       <Tabs defaultValue="cpt" className="flex-1 flex flex-col overflow-hidden">
//         <TabsList className="mx-4 mt-3 w-fit">
//           <TabsTrigger value="cpt">CPT Codes</TabsTrigger>
//           <TabsTrigger value="icd">ICD Codes</TabsTrigger>
//         </TabsList>

//         <TabsContent
//           value="cpt"
//           className="flex-1 overflow-y-auto px-4 pb-4 mt-0"
//         >
//           {selectedCptCodes.length > 0 ? (
//             <div className="space-y-2">
//               {selectedCptCodes.map((code) => (
//                 <div
//                   key={String(code.code)}
//                   className="p-3 bg-secondary/30 rounded-md border border-border space-y-2"
//                 >
//                   <div className="flex items-center gap-3">
//                     <Badge
//                       variant="outline"
//                       className="font-mono text-xs shrink-0"
//                     >
//                       {String(code.code)}
//                     </Badge>
//                     {getSelectedModifiers(code).length > 0 && (
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs font-medium text-muted-foreground">
//                           MOD:
//                         </span>
//                         <div className="flex flex-wrap gap-1">
//                           {getSelectedModifiers(code).map((mod) => (
//                             <Badge
//                               key={String(mod)}
//                               variant="secondary"
//                               className="text-xs"
//                             >
//                               {String(mod)}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <p className="text-muted-foreground text-sm">
//                 No CPT codes selected
//               </p>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent
//           value="icd"
//           className="flex-1 overflow-y-auto px-4 pb-4 mt-0"
//         >
//           {selectedIcdCodes.length > 0 ? (
//             <div className="space-y-2">
//               {selectedIcdCodes.map((code) => (
//                 <div
//                   key={String(code.code)}
//                   className="p-3 bg-secondary/30 rounded-md border border-border"
//                 >
//                   <Badge variant="outline" className="font-mono text-xs">
//                     {String(code.code)}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <p className="text-muted-foreground text-sm">
//                 No ICD codes selected
//               </p>
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default FinalCodesSection;



import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveRunFinalCodes } from "@/services/api"; 

const FinalCodesSection = ({ chartId, runId, cptCodes = [], icdCodes = [] }) => {
  const [isSaving, setIsSaving] = useState(false);

  // Merge modifiers across models + custom
  const getSelectedModifiers = (code) => {
    const allMods = new Set();
    ["openai", "claude", "gemini"].forEach((p) => {
      const prov = code?.llmSuggestions?.[p] || {};
      const mods = prov.selectedModifiers || prov.modifiers || [];
      mods.forEach((m) => {
        if (m != null) allMods.add(String(m));
      });
    });

    (code?.customModifiers || [])
      .filter((m) => m.selected)
      .forEach((m) => allMods.add(String(m.code)));

    return Array.from(allMods);
  };

  // Audit trail preference: OpenAI -> Claude -> Gemini
  const getAuditTrail = (code) => {
    const order = ["openai", "claude", "gemini"];
    for (const p of order) {
      const prov = code?.llmSuggestions?.[p] || {};
      if (prov?.audit_trail) return prov.audit_trail;
      if (prov?.auditTrail) return prov.auditTrail;
      if (prov?.reasoning) return prov.reasoning;
    }
    return code?.feedback || "";
  };

  const selectedCptCodes = (cptCodes || []).filter((c) => c.selected);
  const selectedIcdCodes = (icdCodes || []).filter((c) => c.selected);

  const handleSave = async () => {
    if (!chartId) return alert("No chart selected");
    if (!runId) return alert("No run selected");

    const payload = {
      finalCptCodes: selectedCptCodes.map((c) => ({
        code: String(c.code),
        modifiers: getSelectedModifiers(c),
        auditTrail: getAuditTrail(c),
      })),
      finalIcdCodes: selectedIcdCodes.map((c) => ({
        code: String(c.code),
        auditTrail: getAuditTrail(c),
      })),
    };

    if (payload.finalCptCodes.length === 0 && payload.finalIcdCodes.length === 0) {
      return alert("No codes selected to save");
    }

    setIsSaving(true);

    try {
      await saveRunFinalCodes(chartId, runId, payload);

      window.dispatchEvent(
        new CustomEvent("finalCodesUpdated", {
          detail: { chartId, runId },
        })
      );

      alert("✅ Final codes saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving final codes");
    } finally {
      setIsSaving(false);
    }
  };

  if (selectedCptCodes.length === 0 && selectedIcdCodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-card border-t border-border">
        <p className="text-muted-foreground text-sm">No codes selected</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-card border-t border-border flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary">
        <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
          Final Approved Codes
        </h3>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Tabs defaultValue="cpt" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-3 w-fit">
          <TabsTrigger value="cpt">CPT Codes</TabsTrigger>
          <TabsTrigger value="icd">ICD Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="cpt" className="flex-1 overflow-y-auto px-4 pb-4 mt-0">
          {selectedCptCodes.length ? (
            <div className="space-y-2">
              {selectedCptCodes.map((code) => (
                <div
                  key={String(code.code)}
                  className="p-3 bg-secondary/30 rounded-md border border-border space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                      {String(code.code)}
                    </Badge>

                    {getSelectedModifiers(code).length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">MOD:</span>
                        <div className="flex flex-wrap gap-1">
                          {getSelectedModifiers(code).map((mod) => (
                            <Badge key={String(mod)} variant="secondary" className="text-xs">
                              {String(mod)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No CPT codes selected</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="icd" className="flex-1 overflow-y-auto px-4 pb-4 mt-0">
          {selectedIcdCodes.length ? (
            <div className="space-y-2">
              {selectedIcdCodes.map((code) => (
                <div
                  key={String(code.code)}
                  className="p-3 bg-secondary/30 rounded-md border border-border"
                >
                  <Badge variant="outline" className="font-mono text-xs">
                    {String(code.code)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No ICD codes selected</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinalCodesSection;
