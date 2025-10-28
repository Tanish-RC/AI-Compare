// import { CodeSuggestion, Modifier } from "@/types/chart";
// import { Info, Plus, MessageSquare } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ModifierSelectionDialog } from "./ModifierSelectionDialog";
// import { useState } from "react";

// interface CodeComparisonTableProps {
//   codes: CodeSuggestion[];
//   onToggleCode: (code: string) => void;
//   onUpdateFeedback: (code: string, feedback: string) => void;
//   onToggleModifier: (code: string, llmKey: 'llm1' | 'llm2' | 'llm3', modifierCode: string) => void;
//   onToggleCustomModifier: (code: string, modifierCode: string) => void;
//   onAddCustomModifier: (code: string, modifier: Modifier) => void;
//   type?: 'cpt' | 'icd';
// }

// export const CodeComparisonTable = ({ 
//   codes, 
//   onToggleCode, 
//   onUpdateFeedback,
//   onToggleModifier,
//   onToggleCustomModifier,
//   onAddCustomModifier,
//   type = 'cpt'
// }: CodeComparisonTableProps) => {
//   const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
//   const [selectedCodeForModifier, setSelectedCodeForModifier] = useState<string | null>(null);
//   const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
//   const [selectedCodeForFeedback, setSelectedCodeForFeedback] = useState<string | null>(null);

//   const handleOpenModifierDialog = (code: string) => {
//     setSelectedCodeForModifier(code);
//     setModifierDialogOpen(true);
//   };

//   const handleOpenFeedbackDialog = (code: string) => {
//     setSelectedCodeForFeedback(code);
//     setFeedbackDialogOpen(true);
//   };

//   const selectedCode = codes.find(c => c.code === selectedCodeForModifier);
//   const selectedCodeForFeedbackData = codes.find(c => c.code === selectedCodeForFeedback);

//   // Get all selected modifiers for a code
//   const getSelectedModifiers = (codeData: CodeSuggestion) => {
//     const allMods = new Set<string>();
    
//     // Add LLM selected modifiers (using selectedModifiers or falling back to modifiers)
//     (codeData.llmSuggestions.llm1.selectedModifiers || codeData.llmSuggestions.llm1.modifiers).forEach(mod => allMods.add(mod));
//     (codeData.llmSuggestions.llm2.selectedModifiers || codeData.llmSuggestions.llm2.modifiers).forEach(mod => allMods.add(mod));
//     (codeData.llmSuggestions.llm3.selectedModifiers || codeData.llmSuggestions.llm3.modifiers).forEach(mod => allMods.add(mod));
    
//     // Add custom modifiers that are selected
//     codeData.customModifiers.filter(m => m.selected).forEach(mod => allMods.add(mod.code));
    
//     return Array.from(allMods);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-auto">
//         <TooltipProvider>
//           <Table>
//             <TableHeader className="sticky top-0 bg-card z-10">
//               <TableRow>
//                 <TableHead className="w-12"></TableHead>
//                 <TableHead className="w-48">Code</TableHead>
//                 <TableHead className="w-80">Open AI</TableHead>
//                 <TableHead className="w-80">Claude</TableHead>
//                 <TableHead className="w-80">Gemini</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {codes.map((codeData) => (
//                 <TableRow key={codeData.code}>
//                     <TableCell className="align-top">
//                       <Checkbox
//                         checked={codeData.selected}
//                         onCheckedChange={() => onToggleCode(codeData.code)}
//                       />
//                     </TableCell>
//                     <TableCell className="font-mono font-medium align-top">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2">
//                           {codeData.code}
//                           <Tooltip>
//                             <TooltipTrigger>
//                               <Info className="w-4 h-4 text-muted-foreground" />
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p className="max-w-xs">{codeData.description}</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </div>
//                         {type === 'cpt' && getSelectedModifiers(codeData).length > 0 && (
//                           <div className="flex flex-wrap gap-1">
//                             {getSelectedModifiers(codeData).map(mod => (
//                               <Badge key={mod} variant="secondary" className="text-xs">
//                                 {mod}
//                               </Badge>
//                             ))}
//                           </div>
//                         )}
//                         {type === 'cpt' && (
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleOpenModifierDialog(codeData.code)}
//                             className="w-full text-sm"
//                           >
//                             <Plus className="w-4 h-4 mr-1" />
//                             Add MOD
//                           </Button>
//                         )}
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleOpenFeedbackDialog(codeData.code)}
//                           className="w-full text-sm"
//                         >
//                           <MessageSquare className="w-4 h-4 mr-1" />
//                           Feedback
//                         </Button>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-sm align-top">
//                       {codeData.isExternal ? (
//                         <span className="text-muted-foreground italic">Externally added</span>
//                       ) : (
//                         <div className="space-y-3">
//                           <div>
//                             <div className="font-semibold text-foreground mb-1">Reasoning:</div>
//                             <div className="text-muted-foreground">{codeData.llmSuggestions.llm1.reasoning}</div>
//                           </div>
//                           <div>
//                             <div className="font-semibold text-foreground mb-1">Audit Trail:</div>
//                             <div className="text-muted-foreground">{codeData.llmSuggestions.llm1.auditTrail}</div>
//                           </div>
//                           {type === 'cpt' && (
//                             <div>
//                               <div className="font-semibold text-foreground mb-1">MOD:</div>
//                               <div className="space-y-1">
//                                 {codeData.llmSuggestions.llm1.modifiers.length > 0 ? (
//                                   codeData.llmSuggestions.llm1.modifiers.map(mod => {
//                                     const selectedMods = codeData.llmSuggestions.llm1.selectedModifiers || codeData.llmSuggestions.llm1.modifiers;
//                                     const isChecked = selectedMods.includes(mod);
//                                     return (
//                                       <div key={mod} className="flex items-center gap-2">
//                                         <Checkbox
//                                           checked={isChecked}
//                                           onCheckedChange={() => onToggleModifier(codeData.code, 'llm1', mod)}
//                                         />
//                                         <span className="text-muted-foreground">{mod}</span>
//                                       </div>
//                                     );
//                                   })
//                                 ) : (
//                                   <span className="text-muted-foreground italic">No modifiers</span>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-sm align-top">
//                       {codeData.isExternal ? (
//                         <span className="text-muted-foreground italic">Externally added</span>
//                       ) : (
//                         <div className="space-y-3">
//                           <div>
//                             <div className="font-semibold text-foreground mb-1">Reasoning:</div>
//                             <div className="text-muted-foreground">{codeData.llmSuggestions.llm2.reasoning}</div>
//                           </div>
//                           <div>
//                             <div className="font-semibold text-foreground mb-1">Audit Trail:</div>
//                             <div className="text-muted-foreground">{codeData.llmSuggestions.llm2.auditTrail}</div>
//                           </div>
//                           {type === 'cpt' && (
//                             <div>
//                               <div className="font-semibold text-foreground mb-1">MOD:</div>
//                               <div className="space-y-1">
//                                 {codeData.llmSuggestions.llm2.modifiers.length > 0 ? (
//                                   codeData.llmSuggestions.llm2.modifiers.map(mod => {
//                                     const selectedMods = codeData.llmSuggestions.llm2.selectedModifiers || codeData.llmSuggestions.llm2.modifiers;
//                                     const isChecked = selectedMods.includes(mod);
//                                     return (
//                                       <div key={mod} className="flex items-center gap-2">
//                                         <Checkbox
//                                           checked={isChecked}
//                                           onCheckedChange={() => onToggleModifier(codeData.code, 'llm2', mod)}
//                                         />
//                                         <span className="text-muted-foreground">{mod}</span>
//                                       </div>
//                                     );
//                                   })
//                                 ) : (
//                                   <span className="text-muted-foreground italic">No modifiers</span>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-sm align-top">
//                       {codeData.isExternal ? (
//                         <span className="text-muted-foreground italic">Externally added</span>
//                       ) : (
//                         <div className="space-y-3">
//                           <div>
//                             <div className="font-semibold text-foreground mb-1">Reasoning:</div>
//                             <div className="text-muted-foreground">{codeData.llmSuggestions.llm3.reasoning}</div>
//                           </div>
//                           <div>
//                             <div className="font-semibold text-foreground mb-1">Audit Trail:</div>
//                             <div className="text-muted-foreground">{codeData.llmSuggestions.llm3.auditTrail}</div>
//                           </div>
//                           {type === 'cpt' && (
//                             <div>
//                               <div className="font-semibold text-foreground mb-1">MOD:</div>
//                               <div className="space-y-1">
//                                 {codeData.llmSuggestions.llm3.modifiers.length > 0 ? (
//                                   codeData.llmSuggestions.llm3.modifiers.map(mod => {
//                                     const selectedMods = codeData.llmSuggestions.llm3.selectedModifiers || codeData.llmSuggestions.llm3.modifiers;
//                                     const isChecked = selectedMods.includes(mod);
//                                     return (
//                                       <div key={mod} className="flex items-center gap-2">
//                                         <Checkbox
//                                           checked={isChecked}
//                                           onCheckedChange={() => onToggleModifier(codeData.code, 'llm3', mod)}
//                                         />
//                                         <span className="text-muted-foreground">{mod}</span>
//                                       </div>
//                                     );
//                                   })
//                                 ) : (
//                                   <span className="text-muted-foreground italic">No modifiers</span>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </TableCell>
//                   </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TooltipProvider>
//       </div>
      
//       {selectedCode && (
//         <ModifierSelectionDialog
//           open={modifierDialogOpen}
//           onOpenChange={setModifierDialogOpen}
//           modifiers={selectedCode.customModifiers}
//           onToggleModifier={(modifierCode) => onToggleCustomModifier(selectedCode.code, modifierCode)}
//           title={`Select Modifiers for ${selectedCode.code}`}
//         />
//       )}

//       {selectedCodeForFeedbackData && (
//         <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Feedback for {selectedCodeForFeedbackData.code}</DialogTitle>
//             </DialogHeader>
//             <div className="py-4">
//               <Textarea
//                 value={selectedCodeForFeedbackData.feedback}
//                 onChange={(e) => onUpdateFeedback(selectedCodeForFeedbackData.code, e.target.value)}
//                 placeholder="Add feedback for this code..."
//                 className="min-h-[120px]"
//               />
//             </div>
//             <DialogFooter>
//               <Button onClick={() => setFeedbackDialogOpen(false)}>Done</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// import { CodeSuggestion, Modifier } from "@/types/chart";
// import { Info, Plus, MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ModifierSelectionDialog } from "./ModifierSelectionDialog";
// import { useState } from "react";

// interface CodeComparisonTableProps {
//   codes: CodeSuggestion[];
//   onToggleCode: (code: string) => void;
//   onUpdateFeedback: (code: string, feedback: string) => void;
//   onToggleModifier: (code: string, llmKey: "llm1" | "llm2" | "llm3", modifierCode: string) => void;
//   onToggleCustomModifier: (code: string, modifierCode: string) => void;
//   onAddCustomModifier: (code: string, modifier: Modifier) => void;
//   type?: "cpt" | "icd";
// }

// export const CodeComparisonTable = ({
//   codes,
//   onToggleCode,
//   onUpdateFeedback,
//   onToggleModifier,
//   onToggleCustomModifier,
//   onAddCustomModifier,
//   type = "cpt",
// }: CodeComparisonTableProps) => {
//   const [expandedCodes, setExpandedCodes] = useState<string[]>([]);
//   const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
//   const [selectedCodeForModifier, setSelectedCodeForModifier] = useState<string | null>(null);
//   const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
//   const [selectedCodeForFeedback, setSelectedCodeForFeedback] = useState<string | null>(null);

//   const toggleExpand = (code: string) => {
//     setExpandedCodes((prev) =>
//       prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
//     );
//   };

//   const handleOpenModifierDialog = (code: string) => {
//     setSelectedCodeForModifier(code);
//     setModifierDialogOpen(true);
//   };

//   const handleOpenFeedbackDialog = (code: string) => {
//     setSelectedCodeForFeedback(code);
//     setFeedbackDialogOpen(true);
//   };

//   const selectedCode = codes.find((c) => c.code === selectedCodeForModifier);
//   const selectedCodeForFeedbackData = codes.find(
//     (c) => c.code === selectedCodeForFeedback
//   );

//   const getSelectedModifiers = (codeData: CodeSuggestion) => {
//     const allMods = new Set<string>();
//     const llms = ["llm1", "llm2", "llm3"] as const;
//     llms.forEach((key) => {
//       const mods =
//         codeData.llmSuggestions[key].selectedModifiers ||
//         codeData.llmSuggestions[key].modifiers;
//       mods.forEach((m) => allMods.add(m));
//     });
//     codeData.customModifiers
//       .filter((m) => m.selected)
//       .forEach((m) => allMods.add(m.code));
//     return Array.from(allMods);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-auto">
//         <TooltipProvider>
//           <Table>
//             <TableHeader className="sticky top-0 bg-card z-10">
//               <TableRow>
//                 <TableHead className="w-12"></TableHead>
//                 <TableHead className="w-12"></TableHead>
//                 <TableHead className="w-48">Code</TableHead>
//                 <TableHead className="w-80">LLM 1</TableHead>
//                 <TableHead className="w-80">LLM 2</TableHead>
//                 <TableHead className="w-80">LLM 3</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {codes.map((codeData) => {
//                 const isExpanded = expandedCodes.includes(codeData.code);
//                 return (
//                   <>
//                     {/* Main Row */}
//                     <TableRow
//                       key={codeData.code}
//                       className="cursor-pointer hover:bg-muted/30"
//                     >
//                       <TableCell className="align-top">
//                         <Checkbox
//                           checked={codeData.selected}
//                           onCheckedChange={() => onToggleCode(codeData.code)}
//                         />
//                       </TableCell>
//                       <TableCell
//                         onClick={() => toggleExpand(codeData.code)}
//                         className="align-top"
//                       >
//                         {isExpanded ? (
//                           <ChevronDown className="w-4 h-4" />
//                         ) : (
//                           <ChevronRight className="w-4 h-4" />
//                         )}
//                       </TableCell>
//                       <TableCell
//                         onClick={() => toggleExpand(codeData.code)}
//                         className="font-mono font-medium align-top"
//                       >
//                         <div className="flex items-center gap-2">
//                           {codeData.code}
//                           <Tooltip>
//                             <TooltipTrigger>
//                               <Info className="w-4 h-4 text-muted-foreground" />
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p className="max-w-xs">{codeData.description}</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </div>
//                         {type === "cpt" && getSelectedModifiers(codeData).length > 0 && (
//                           <div className="flex flex-wrap gap-1 mt-2">
//                             {getSelectedModifiers(codeData).map((mod) => (
//                               <Badge key={mod} variant="secondary" className="text-xs">
//                                 {mod}
//                               </Badge>
//                             ))}
//                           </div>
//                         )}
//                       </TableCell>

//                       {!isExpanded && (
//                         <>
//                           <TableCell colSpan={3}>
//                             <p className="text-muted-foreground text-sm italic">
//                               Click to view details
//                             </p>
//                           </TableCell>
//                         </>
//                       )}
//                     </TableRow>

//                     {/* Expanded Details */}
//                     {isExpanded && (
//                       <TableRow className="bg-muted/10">
//                         <TableCell colSpan={6}>
//                           <div className="grid grid-cols-3 gap-6 p-4">
//                             {(["llm1", "llm2", "llm3"] as const).map((key, i) => (
//                               <div key={key} className="text-sm space-y-3">
//                                 <h4 className="font-semibold">LLM {i + 1}</h4>

//                                 <div>
//                                   <div className="font-semibold text-foreground mb-1">
//                                     Reasoning:
//                                   </div>
//                                   <div className="text-muted-foreground">
//                                     {codeData.llmSuggestions?.[key]?.reasoning || "—"}
//                                   </div>
//                                 </div>

//                                 <div>
//                                   <div className="font-semibold text-foreground mb-1">
//                                     Audit Trail:
//                                   </div>
//                                   <div className="text-muted-foreground">
//                                     {codeData.llmSuggestions?.[key]?.auditTrail || "—"}
//                                   </div>
//                                 </div>

//                                 {type === "cpt" && (
//                                   <div>
//                                     <div className="font-semibold text-foreground mb-1">
//                                       Modifiers:
//                                     </div>
//                                     <div className="space-y-1">
//                                       {codeData.llmSuggestions?.[key]?.modifiers?.length ? (
//                                         codeData.llmSuggestions[key].modifiers.map((mod) => {
//                                           const selectedMods =
//                                             codeData.llmSuggestions[key]
//                                               .selectedModifiers ||
//                                             codeData.llmSuggestions[key].modifiers;
//                                           const isChecked = selectedMods.includes(mod);
//                                           return (
//                                             <div
//                                               key={mod}
//                                               className="flex items-center gap-2"
//                                             >
//                                               <Checkbox
//                                                 checked={isChecked}
//                                                 onCheckedChange={() =>
//                                                   onToggleModifier(codeData.code, key, mod)
//                                                 }
//                                               />
//                                               <span className="text-muted-foreground">
//                                                 {mod}
//                                               </span>
//                                             </div>
//                                           );
//                                         })
//                                       ) : (
//                                         <span className="text-muted-foreground italic">
//                                           No modifiers
//                                         </span>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           </div>

//                           <div className="flex gap-3 mt-4 border-t pt-3">
//                             {type === "cpt" && (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleOpenModifierDialog(codeData.code)}
//                               >
//                                 <Plus className="w-4 h-4 mr-1" /> Add MOD
//                               </Button>
//                             )}
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleOpenFeedbackDialog(codeData.code)}
//                             >
//                               <MessageSquare className="w-4 h-4 mr-1" />
//                               Feedback
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TooltipProvider>
//       </div>

//       {selectedCode && (
//         <ModifierSelectionDialog
//           open={modifierDialogOpen}
//           onOpenChange={setModifierDialogOpen}
//           modifiers={selectedCode.customModifiers}
//           onToggleModifier={(modifierCode) =>
//             onToggleCustomModifier(selectedCode.code, modifierCode)
//           }
//           title={`Select Modifiers for ${selectedCode.code}`}
//         />
//       )}

//       {selectedCodeForFeedbackData && (
//         <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>
//                 Feedback for {selectedCodeForFeedbackData.code}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="py-4">
//               <Textarea
//                 value={selectedCodeForFeedbackData.feedback}
//                 onChange={(e) =>
//                   onUpdateFeedback(selectedCodeForFeedbackData.code, e.target.value)
//                 }
//                 placeholder="Add feedback for this code..."
//                 className="min-h-[120px]"
//               />
//             </div>
//             <DialogFooter>
//               <Button onClick={() => setFeedbackDialogOpen(false)}>Done</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };


import { CodeSuggestion, Modifier } from "@/types/chart";
import {
  Info,
  Plus,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModifierSelectionDialog } from "./ModifierSelectionDialog";
import { useState } from "react";

interface CodeComparisonTableProps {
  codes: CodeSuggestion[];
  onToggleCode: (code: string) => void;
  onUpdateFeedback: (code: string, feedback: string) => void;
  onToggleModifier: (
    code: string,
    llmKey: "llm1" | "llm2" | "llm3",
    modifierCode: string
  ) => void;
  onToggleCustomModifier: (code: string, modifierCode: string) => void;
  onAddCustomModifier: (code: string, modifier: Modifier) => void;
  type?: "cpt" | "icd";
}

export const CodeComparisonTable = ({
  codes,
  onToggleCode,
  onUpdateFeedback,
  onToggleModifier,
  onToggleCustomModifier,
  onAddCustomModifier,
  type = "cpt",
}: CodeComparisonTableProps) => {
  const [expandedCodes, setExpandedCodes] = useState<string[]>([]);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [selectedCodeForModifier, setSelectedCodeForModifier] =
    useState<string | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedCodeForFeedback, setSelectedCodeForFeedback] =
    useState<string | null>(null);

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleOpenModifierDialog = (code: string) => {
    setSelectedCodeForModifier(code);
    setModifierDialogOpen(true);
  };

  const handleOpenFeedbackDialog = (code: string) => {
    setSelectedCodeForFeedback(code);
    setFeedbackDialogOpen(true);
  };

  const selectedCode = codes.find((c) => c.code === selectedCodeForModifier);
  const selectedCodeForFeedbackData = codes.find(
    (c) => c.code === selectedCodeForFeedback
  );

  const getSelectedModifiers = (codeData: CodeSuggestion) => {
    const allMods = new Set<string>();
    const llms = ["llm1", "llm2", "llm3"] as const;
    llms.forEach((key) => {
      const mods =
        codeData.llmSuggestions[key].selectedModifiers ||
        codeData.llmSuggestions[key].modifiers;
      mods.forEach((m) => allMods.add(m));
    });
    codeData.customModifiers
      .filter((m) => m.selected)
      .forEach((m) => allMods.add(m.code));
    return Array.from(allMods);
  };

  const llmLabels: Record<"llm1" | "llm2" | "llm3", string> = {
    llm1: "OpenAI",
    llm2: "Claude",
    llm3: "Gemini",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <TooltipProvider>
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-48">Code</TableHead>
                <TableHead className="w-80">OpenAI</TableHead>
                <TableHead className="w-80">Claude</TableHead>
                <TableHead className="w-80">Gemini</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {codes.map((codeData) => {
                const isExpanded = expandedCodes.includes(codeData.code);
                return (
                  <>
                    {/* Collapsed summary row */}
                    <TableRow
                      key={codeData.code}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => toggleExpand(codeData.code)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={codeData.selected}
                          onCheckedChange={() => onToggleCode(codeData.code)}
                        />
                      </TableCell>

                      <TableCell>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </TableCell>

                      <TableCell className="font-mono font-medium">
                        <div className="flex items-center gap-2">
                          {codeData.code}
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{codeData.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        {type === "cpt" &&
                          getSelectedModifiers(codeData).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {getSelectedModifiers(codeData).map((mod) => (
                                <Badge
                                  key={mod}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {mod}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </TableCell>

                      {/* ✅ / ❌ summary */}
                      {(["llm1", "llm2", "llm3"] as const).map((key) => {
                        const suggested =
                          codeData.llmSuggestions?.[key]?.suggested ?? false;
                        return (
                          <TableCell
                            key={key}
                            className="text-center align-middle"
                          >
                            {suggested ? (
                              <CheckCircle className="text-green-500 w-5 h-5 mx-auto" />
                            ) : (
                              <XCircle className="text-red-500 w-5 h-5 mx-auto" />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Expanded details row */}
                    {isExpanded && (
                      <TableRow className="bg-muted/10">
                        <TableCell colSpan={6}>
                          <div className="grid grid-cols-3 gap-6 p-4">
                            {(["llm1", "llm2", "llm3"] as const).map((key) => (
                              <div key={key} className="text-sm space-y-3">
                                <h4 className="font-semibold">
                                  {llmLabels[key]}
                                </h4>

                                <div>
                                  <div className="font-semibold text-foreground mb-1">
                                    Reasoning:
                                  </div>
                                  <div className="text-muted-foreground">
                                    {codeData.llmSuggestions?.[key]?.reasoning ||
                                      "—"}
                                  </div>
                                </div>

                                <div>
                                  <div className="font-semibold text-foreground mb-1">
                                    Audit Trail:
                                  </div>
                                  <div className="text-muted-foreground">
                                    {codeData.llmSuggestions?.[key]?.auditTrail ||
                                      "—"}
                                  </div>
                                </div>

                                {type === "cpt" && (
                                  <div>
                                    <div className="font-semibold text-foreground mb-1">
                                      Modifiers:
                                    </div>
                                    <div className="space-y-1">
                                      {codeData.llmSuggestions?.[key]
                                        ?.modifiers?.length ? (
                                        codeData.llmSuggestions[key].modifiers.map(
                                          (mod) => {
                                            const selectedMods =
                                              codeData.llmSuggestions[key]
                                                .selectedModifiers ||
                                              codeData.llmSuggestions[key]
                                                .modifiers;
                                            const isChecked =
                                              selectedMods.includes(mod);
                                            return (
                                              <div
                                                key={mod}
                                                className="flex items-center gap-2"
                                              >
                                                <Checkbox
                                                  checked={isChecked}
                                                  onCheckedChange={() =>
                                                    onToggleModifier(
                                                      codeData.code,
                                                      key,
                                                      mod
                                                    )
                                                  }
                                                />
                                                <span className="text-muted-foreground">
                                                  {mod}
                                                </span>
                                              </div>
                                            );
                                          }
                                        )
                                      ) : (
                                        <span className="text-muted-foreground italic">
                                          No modifiers
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-3 mt-4 border-t pt-3">
                            {type === "cpt" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleOpenModifierDialog(codeData.code)
                                }
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add MOD
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleOpenFeedbackDialog(codeData.code)
                              }
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Feedback
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>

      {selectedCode && (
        <ModifierSelectionDialog
          open={modifierDialogOpen}
          onOpenChange={setModifierDialogOpen}
          modifiers={selectedCode.customModifiers}
          onToggleModifier={(modifierCode) =>
            onToggleCustomModifier(selectedCode.code, modifierCode)
          }
          title={`Select Modifiers for ${selectedCode.code}`}
        />
      )}

      {selectedCodeForFeedbackData && (
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Feedback for {selectedCodeForFeedbackData.code}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={selectedCodeForFeedbackData.feedback}
                onChange={(e) =>
                  onUpdateFeedback(
                    selectedCodeForFeedbackData.code,
                    e.target.value
                  )
                }
                placeholder="Add feedback for this code..."
                className="min-h-[120px]"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setFeedbackDialogOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
