// import React, { Fragment, useMemo, useState } from "react";
// import {
//   Info,
//   Plus,
//   MessageSquare,
//   ChevronDown,
//   ChevronRight,
//   CheckCircle,
//   XCircle,
//   Check,
//   X,
// } from "lucide-react";
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
// import ModifierSelectionDialog from "./ModifierSelectionDialog";
// import { cn } from "@/lib/utils";

// /**
//  * Props expected:
//  * codes: array of code objects (each has .code, .selected, .customModifiers[], llmSuggestions: { openai, claude, gemini } )
//  * onToggleCode(code)
//  * onUpdateFeedback(code, feedback)
//  * onToggleModifier(code, provider, modifier) -> toggles provider-level selection for that modifier
//  * onToggleCustomModifier(code, modifier) -> toggles custom modifier selection (add/remove)
//  * onAddCustomModifier(code, modifierObj) -> adds a custom modifier { code, selected: true }
//  *
//  * The parent (ClientCharts) should update state based on these callbacks.
//  */

// export const CodeComparisonTable = ({
//   codes = [],
//   onToggleCode,
//   onUpdateFeedback,
//   onToggleModifier, // (codeStr, provider, mod)
//   onToggleCustomModifier, // (codeStr, mod)
//   onAddCustomModifier, // (codeStr, { code, selected })
//   type = "cpt",
// }) => {
//   const [expandedCodes, setExpandedCodes] = useState([]);
//   const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
//   const [selectedCodeForModifier, setSelectedCodeForModifier] = useState(null);
//   const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
//   const [selectedCodeForFeedback, setSelectedCodeForFeedback] = useState(null);

//   // local set of mods that are in fade-out animation so we can animate before parent updates
//   const [fadingMods, setFadingMods] = useState(new Set());

//   const toggleExpand = (code) => {
//     setExpandedCodes((prev) =>
//       prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
//     );
//   };

//   const openModifierDialog = (code) => {
//     setSelectedCodeForModifier(code);
//     setModifierDialogOpen(true);
//   };

//   const openFeedbackDialog = (code) => {
//     setSelectedCodeForFeedback(code);
//     setFeedbackDialogOpen(true);
//   };

//   // -----------------------
//   // Helpers to inspect provider data
//   // -----------------------
//   const providers = ["openai", "claude", "gemini"];

//   const providerHasModifier = (codeData, providerKey, modCode) => {
//     const prov = (codeData?.llmSuggestions || {})[providerKey] || {};
//     const mods = prov.modifiers || [];
//     return mods.includes(modCode);
//   };

//   const providerIsSelected = (codeData, providerKey, modCode) => {
//     const prov = (codeData?.llmSuggestions || {})[providerKey] || {};
//     const mods = prov.modifiers || [];
//     if (!mods.includes(modCode)) return false; // provider didn't suggest it
//     if (Array.isArray(prov.selectedModifiers)) {
//       return prov.selectedModifiers.includes(modCode);
//     }
//     // no selectedModifiers array -> default to selected
//     return true;
//   };

//   const getCustomModifierEntry = (codeData, modCode) =>
//     (codeData?.customModifiers || []).find((m) => m.code === modCode) || null;

//   // Build a combined list of modifiers for a code (unique) and indicate whether it's selected (combined logic)
//   // Modified to keep semantics clear: providerSelected = any provider has selected it; customSelected from customModifiers
//   const buildCombinedMods = (codeData) => {
//     const map = new Map(); // modCode -> { code, providers: Set, inCustom: boolean, customSelected: boolean, providerSelected: boolean }
//     providers.forEach((p) => {
//       const prov = (codeData?.llmSuggestions || {})[p] || {};
//       const mods = prov.modifiers || [];
//       const selectedMods = Array.isArray(prov.selectedModifiers)
//         ? prov.selectedModifiers
//         : mods; // if selectedModifiers not provided, default to selected
//       mods.forEach((m) => {
//         if (!map.has(m)) {
//           map.set(m, {
//             code: m,
//             providers: new Set(),
//             inCustom: false,
//             customSelected: false,
//             providerSelected: false,
//           });
//         }
//         const entry = map.get(m);
//         entry.providers.add(p);
//         if (selectedMods.includes(m)) entry.providerSelected = true;
//       });
//     });

//     // custom modifiers (list of { code, selected })
//     (codeData?.customModifiers || []).forEach((cm) => {
//       if (!map.has(cm.code)) {
//         map.set(cm.code, {
//           code: cm.code,
//           providers: new Set(),
//           inCustom: true,
//           customSelected: !!cm.selected,
//           providerSelected: false,
//         });
//       } else {
//         const entry = map.get(cm.code);
//         entry.inCustom = true;
//         entry.customSelected = !!cm.selected;
//       }
//     });

//     // final selected state for combined view: selected if customSelected true OR providerSelected true
//     return Array.from(map.values()).map((e) => ({
//       ...e,
//       selected: !!e.customSelected || !!e.providerSelected,
//     }));
//   };


//     // -----------------------
//   // Helper: determine whether a given LLM "gave" this code
//   // Returns true if we detect the LLM included this code in its suggestions (robust to varied shapes)
//   // -----------------------
//   const llmProvidedCode = (codeData, llmKey) => {
//     if (!codeData || !codeData.llmSuggestions) return false;
//     const prov = codeData.llmSuggestions[llmKey];
//     if (!prov) return false;

//     // 1) explicit 'suggested' flag (preferred)
//     if (prov.suggested === true) return true;

//     // 2) sometimes data may include explicit arrays of codes (CPT_Codes / ICD_Codes)
//     if (Array.isArray(prov.CPT_Codes) && prov.CPT_Codes.some((c) => String(c.code) === String(codeData.code))) return true;
//     if (Array.isArray(prov.ICD_Codes) && prov.ICD_Codes.some((c) => String(c.code) === String(codeData.code))) return true;

//     // 3) presence of reasoning or audit trail is a strong signal the LLM considered this code
//     if ((prov.reasoning && String(prov.reasoning).trim().length > 0) ||
//         (prov.audit_trail && String(prov.audit_trail).trim().length > 0) ||
//         (prov.auditTrail && String(prov.auditTrail).trim().length > 0)) return true;

//     // 4) modifiers or selectedModifiers presence indicates the LLM produced detail for this code
//     if ((Array.isArray(prov.modifiers) && prov.modifiers.length > 0) ||
//         (Array.isArray(prov.selectedModifiers) && prov.selectedModifiers.length > 0)) return true;

//     // otherwise assume it did not provide this code
//     return false;
//   };

//   // Check if a modifier is currently combined-selected for rendering badges
//   // (keeps same behavior but clearer naming)
//   const isCombinedSelected = (codeData, modCode) => {
//     // check custom first
//     const custom = getCustomModifierEntry(codeData, modCode);
//     if (custom) return !!custom.selected;
//     // otherwise if any provider has it selected
//     for (const p of providers) {
//       if (providerIsSelected(codeData, p, modCode)) return true;
//     }
//     return false;
//   };

//   // -----------------------
//   // Core: global-toggle handlers (enforce G1)
//   // -----------------------

//   // When user toggles inside provider checkbox: enforce global ON/OFF for this modifier
//   const handleProviderCheckboxChange = (codeStr, providerKey, modCode) => {
//     const codeData = codes.find((c) => String(c.code) === String(codeStr));
//     if (!codeData) return;

//     const currentlyProviderSelected = providerIsSelected(codeData, providerKey, modCode);
//     const customEntry = getCustomModifierEntry(codeData, modCode);
//     const customSelected = !!(customEntry && customEntry.selected);
//     const currentlyCombined = isCombinedSelected(codeData, modCode);

//     // Determine user intent: if they clicked a currently-checked checkbox -> they intend to UNCHECK
//     // otherwise they intend to CHECK
//     const userIntendsToCheck = !currentlyProviderSelected;

//     if (userIntendsToCheck) {
//       // GLOBAL ON: for all providers that suggested this mod, ensure they are selected
//       providers.forEach((p) => {
//         if (providerHasModifier(codeData, p, modCode)) {
//           // if provider currently not selected, call parent to toggle it on
//           if (!providerIsSelected(codeData, p, modCode)) {
//             onToggleModifier?.(codeStr, p, modCode);
//           }
//         }
//       });

//       // If custom exists and not selected, select it (per rules: select custom if it exists)
//       if (customEntry && !customSelected) {
//         onToggleCustomModifier?.(codeStr, modCode);
//       }

//       // If custom doesn't exist, do NOT create one (Q1 = A)
//       // End: Global ON enforced for providers that suggested the modifier
//     } else {
//       // userIntendsToUncheck -> GLOBAL OFF:
//       // For all providers that suggested it and are currently selected, call parent to toggle off
//       providers.forEach((p) => {
//         if (providerHasModifier(codeData, p, modCode)) {
//           if (providerIsSelected(codeData, p, modCode)) {
//             onToggleModifier?.(codeStr, p, modCode);
//           }
//         }
//       });

//       // If custom exists and is selected, toggle it off
//       if (customEntry && customSelected) {
//         onToggleCustomModifier?.(codeStr, modCode);
//       }
//     }
//   };

//   // When user clicks a badge outside (toggle/deselect): animate fade, then call parent toggles -> global OFF
//   const handleBadgeToggle = (codeStr, modCode) => {
//     // animate fade (add to fading set)
//     setFadingMods((s) => new Set(s).add(`${codeStr}::${modCode}`));

//     // after short fade, call parent handlers to unselect globally
//     setTimeout(() => {
//       setFadingMods((s) => {
//         const copy = new Set(s);
//         copy.delete(`${codeStr}::${modCode}`);
//         return copy;
//       });

//       const codeData = codes.find((c) => String(c.code) === String(codeStr));
//       if (!codeData) return;

//       // 1) turn off all providers that suggested it and are currently selected
//       providers.forEach((p) => {
//         if (providerHasModifier(codeData, p, modCode) && providerIsSelected(codeData, p, modCode)) {
//           onToggleModifier?.(codeStr, p, modCode);
//         }
//       });

//       // 2) if custom exists and is selected, toggle it off
//       const custom = getCustomModifierEntry(codeData, modCode);
//       if (custom && custom.selected) {
//         onToggleCustomModifier?.(codeStr, modCode);
//       }
//     }, 160); // fade duration (ms) — matches CSS transition
//   };

//   // -----------------------
//   // Modifier dialog helpers
//   // -----------------------
//   // Dialog will receive currently selected combined mods (badges) — unchanged behavior
//   // But when toggling inside dialog we should enforce global on/off like above
//   // The dialog uses onToggleModifier(modCode) which we implement to call the same global handler
//   // We expose a small wrapper to handle this for the selected code:
//   const handleDialogToggleModifier = (modCode) => {
//     if (!selectedCodeForModifier) return;
//     // pick any provider to drive the toggle; use first provider that suggested the mod
//     const cd = codes.find((c) => c.code === selectedCodeForModifier);
//     if (!cd) return;

//     // If any provider that suggested this mod is currently selected -> user wants to unselect (global OFF)
//     // Otherwise user wants to select (global ON)
//     // We'll drive via onToggleModifier calls per-provider similar to handleProviderCheckboxChange
//     const existsProviderSelected = providers.some((p) => providerHasModifier(cd, p, modCode) && providerIsSelected(cd, p, modCode));
//     if (existsProviderSelected) {
//       // global off
//       providers.forEach((p) => {
//         if (providerHasModifier(cd, p, modCode) && providerIsSelected(cd, p, modCode)) {
//           onToggleModifier?.(cd.code, p, modCode);
//         }
//       });
//       const custom = getCustomModifierEntry(cd, modCode);
//       if (custom && custom.selected) {
//         onToggleCustomModifier?.(cd.code, modCode);
//       }
//     } else {
//       // global on
//       providers.forEach((p) => {
//         if (providerHasModifier(cd, p, modCode) && !providerIsSelected(cd, p, modCode)) {
//           onToggleModifier?.(cd.code, p, modCode);
//         }
//       });
//       const custom = getCustomModifierEntry(cd, modCode);
//       if (custom && !custom.selected) {
//         onToggleCustomModifier?.(cd.code, modCode);
//       }
//     }
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
//                 <TableHead className="w-80">OpenAI</TableHead>
//                 <TableHead className="w-80">Claude</TableHead>
//                 <TableHead className="w-80">Gemini</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {codes.map((codeData) => {
//                 const isExpanded = expandedCodes.includes(codeData.code);
//                 const combined = buildCombinedMods(codeData);
//                 const selectedCombined = combined.filter((m) => m.selected);

//                 return (
//                   <Fragment key={String(codeData.code)}>
//                     {/* MAIN ROW */}
//                     <TableRow className="cursor-pointer hover:bg-muted/30">
//                       <TableCell>
//                         <Checkbox
//                           checked={!!codeData.selected}
//                           onCheckedChange={() => onToggleCode?.(codeData.code)}
//                         />
//                       </TableCell>

//                       <TableCell
//                         onClick={() => toggleExpand(codeData.code)}
//                         className="align-middle"
//                       >
//                         {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//                       </TableCell>

//                       {/* Code cell */}
//                       <TableCell onClick={() => toggleExpand(codeData.code)} className="font-mono font-medium align-top">
//                         <div className="flex items-center gap-2">
//                           <div>{String(codeData.code)}</div>
//                           <Tooltip>
//                             <TooltipTrigger>
//                               <Info className="w-4 h-4 text-muted-foreground" />
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p className="max-w-xs text-sm">{String(codeData.description || "—")}</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </div>

//                         {/* ONLY show badges for CPT and only those that are currently selected */}
//                         {type === "cpt" && selectedCombined.length > 0 && (
//                           <div className="flex flex-wrap items-center gap-2 mt-2">
//                             {selectedCombined.map((m) => {
//                               const key = `${codeData.code}::${m.code}`;
//                               const isFading = fadingMods.has(key);
//                               const selected = true; // selectedCombined only contains selected ones

//                               return (
//                                 <button
//                                   key={m.code}
//                                   type="button"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     // clicking badge toggles (global deselect)
//                                     handleBadgeToggle(codeData.code, m.code);
//                                   }}
//                                   className={cn(
//                                     "inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium transition-transform transition-opacity duration-150",
//                                     selected
//                                       ? "bg-indigo-600 text-white border border-indigo-700"
//                                       : "bg-transparent border border-gray-200 text-gray-700"
//                                   )}
//                                   style={{
//                                     opacity: isFading ? 0 : 1,
//                                     transform: isFading ? "scale(0.95)" : "scale(1)",
//                                     transition: "opacity 150ms ease-out, transform 150ms ease-out",
//                                   }}
//                                   title={selected ? `Click to deselect ${m.code}` : `Click to select ${m.code}`}
//                                 >
//                                   <span className="font-mono">{m.code}</span>
//                                   {/* show small X icon for affordance */}
//                                   <X className="w-3 h-3 opacity-90" />
//                                 </button>
//                               );
//                             })}
//                           </div>
//                         )}
//                       </TableCell>

//                       {/* per-LLM icons */}
//                       {["openai", "claude", "gemini"].map((key) => {
//                         const provided = llmProvidedCode(codeData, key);
//                         return (
//                           <TableCell key={key} className="text-center align-middle">
//                             {provided ? <CheckCircle className="text-green-500 w-5 h-5 mx-auto" /> : <XCircle className="text-red-500 w-5 h-5 mx-auto" />}
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>

//                     {/* EXPANDED */}
//                     {isExpanded && (
//                       <TableRow className="bg-muted/10">
//                         <TableCell colSpan={6}>
//                           <div className="grid grid-cols-3 gap-6 p-4">
//                             {(["openai", "claude", "gemini"]).map((key) => {
//                               const llm = (codeData?.llmSuggestions || {})[key] || {};
//                               const mods = llm.modifiers || [];
//                               const provSelected = Array.isArray(llm.selectedModifiers) ? llm.selectedModifiers : mods; // default selected

//                               return (
//                                 <div key={key} className="text-sm space-y-3">
//                                   <h4 className="font-semibold">{key === "openai" ? "OpenAI" : key === "claude" ? "Claude" : "Gemini"}</h4>

//                                   <div>
//                                     <div className="font-semibold mb-1">Reasoning:</div>
//                                     <div className="text-muted-foreground whitespace-pre-line">{llm.reasoning || "—"}</div>
//                                   </div>

//                                   <div>
//                                     <div className="font-semibold mb-1">Audit Trail:</div>
//                                     <div className="text-muted-foreground whitespace-pre-line">{llm.audit_trail || llm.auditTrail || "—"}</div>
//                                   </div>

//                                   {type === "cpt" && (
//                                     <div>
//                                       <div className="font-semibold mb-1">Modifiers:</div>
//                                       <div className="space-y-1">
//                                         {mods.length ? (
//                                           mods.map((mod) => {
//                                             // Checkbox checked state: provider reports selected AND combined selected (keeps sync)
//                                             const providerReportsSelected = Array.isArray(llm.selectedModifiers) ? llm.selectedModifiers.includes(mod) : true;
//                                             const checked = providerReportsSelected && isCombinedSelected(codeData, mod);
//                                             return (
//                                               <div key={mod} className="flex items-center gap-2">
//                                                 <Checkbox
//                                                   checked={!!checked}
//                                                   onCheckedChange={() => handleProviderCheckboxChange(codeData.code, key, mod)}
//                                                 />
//                                                 <span className="text-muted-foreground">{mod}</span>
//                                               </div>
//                                             );
//                                           })
//                                         ) : (
//                                           <span className="text-muted-foreground italic">No modifiers</span>
//                                         )}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                           </div>

//                           <div className="flex gap-3 mt-4 border-t pt-3">
//                             {type === "cpt" && (
//                               <Button variant="outline" size="sm" onClick={() => openModifierDialog(codeData.code)}>
//                                 <Plus className="w-4 h-4 mr-1" /> Add MOD
//                               </Button>
//                             )}
//                             <Button variant="outline" size="sm" onClick={() => openFeedbackDialog(codeData.code)}>
//                               <MessageSquare className="w-4 h-4 mr-1" /> Feedback
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </Fragment>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TooltipProvider>
//       </div>

//       {/* Modifier dialog: we pass currently selected combined mods (so dialog shows what's selected) */}
//       {selectedCodeForModifier && (
//         <ModifierSelectionDialog
//           open={modifierDialogOpen}
//           onOpenChange={setModifierDialogOpen}
//           // Build modifiers array for the dialog: include only currently selected combined mods (the ones that appear as badges)
//           modifiers={
//             (() => {
//               const cd = codes.find((c) => c.code === selectedCodeForModifier);
//               if (!cd) return [];
//               const combined = buildCombinedMods(cd);
//               // Only pass selected ones (per your requirement that deselected mods disappear from dialog)
//               return combined.filter((m) => m.selected).map((m) => ({ code: m.code, selected: true }));
//             })()
//           }
//           onToggleModifier={(modCode) => {
//             // use wrapper that enforces global ON/OFF for the selected code
//             handleDialogToggleModifier(modCode);
//           }}
//           onAddCustomModifier={(modifier) => {
//             const cd = codes.find((c) => c.code === selectedCodeForModifier);
//             if (!cd) return;
//             onAddCustomModifier?.(cd.code, modifier);
//           }}
//           title={`Modify modifiers for ${selectedCodeForModifier}`}
//         />
//       )}

//       {/* Feedback dialog */}
//       {selectedCodeForFeedback && (() => {
//         const data = codes.find((c) => c.code === selectedCodeForFeedback);
//         return data ? (
//           <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Feedback for {data.code}</DialogTitle>
//               </DialogHeader>
//               <div className="py-4">
//                 <Textarea value={data.feedback || ""} onChange={(e) => onUpdateFeedback?.(data.code, e.target.value)} placeholder="Add feedback..." className="min-h-[120px]" />
//               </div>
//               <DialogFooter>
//                 <Button onClick={() => setFeedbackDialogOpen(false)}>Done</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         ) : null;
//       })()}
//     </div>
//   );
// };

// export default CodeComparisonTable;


import React, { Fragment, useMemo, useState } from "react";
import {
  Info,
  Plus,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import ModifierSelectionDialog from "./ModifierSelectionDialog";
import { cn } from "@/lib/utils";

export const CodeComparisonTable = ({
  codes = [],
  onToggleCode,
  onUpdateFeedback,
  onToggleModifier,
  onToggleCustomModifier,
  onAddCustomModifier,
  type = "cpt",
}) => {
  const [expandedCodes, setExpandedCodes] = useState([]);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [selectedCodeForModifier, setSelectedCodeForModifier] = useState(null);

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedCodeForFeedback, setSelectedCodeForFeedback] = useState(null);

  const [fadingMods, setFadingMods] = useState(new Set());

  const providers = ["openai", "claude", "gemini"];

  const toggleExpand = (code) => {
    setExpandedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const openModifierDialog = (code) => {
    setSelectedCodeForModifier(code);
    setModifierDialogOpen(true);
  };

  const openFeedbackDialog = (code) => {
    setSelectedCodeForFeedback(code);
    setFeedbackDialogOpen(true);
  };

  // Provider helpers
  const providerHasModifier = (codeData, providerKey, modCode) => {
    return (
      codeData?.llmSuggestions?.[providerKey]?.modifiers?.includes(modCode) ||
      false
    );
  };

  const providerIsSelected = (codeData, providerKey, modCode) => {
    const prov = codeData?.llmSuggestions?.[providerKey];
    if (!prov) return false;
    const mods = prov.modifiers || [];
    if (!mods.includes(modCode)) return false;
    return prov.selectedModifiers
      ? prov.selectedModifiers.includes(modCode)
      : true;
  };

  const getCustomModifierEntry = (codeData, modCode) =>
    (codeData.customModifiers || []).find((m) => m.code === modCode) || null;

  // Build all modifier states from LLM + custom
  const buildCombinedMods = (codeData) => {
    const map = new Map();

    providers.forEach((p) => {
      const llm = codeData?.llmSuggestions?.[p];
      if (!llm) return;
      const mods = llm.modifiers || [];
      const selectedMods = llm.selectedModifiers || mods;

      mods.forEach((m) => {
        if (!map.has(m)) {
          map.set(m, {
            code: m,
            providerSelected: false,
            customSelected: false,
          });
        }
        if (selectedMods.includes(m)) {
          map.get(m).providerSelected = true;
        }
      });
    });

    (codeData.customModifiers || []).forEach((cm) => {
      if (!map.has(cm.code)) {
        map.set(cm.code, {
          code: cm.code,
          providerSelected: false,
          customSelected: !!cm.selected,
        });
      } else {
        map.get(cm.code).customSelected = !!cm.selected;
      }
    });

    return [...map.values()].map((m) => ({
      ...m,
      selected: m.providerSelected || m.customSelected,
    }));
  };

  // NEW — **FIX MODAL CHECKBOXES**
  const handleDialogToggleModifier = (modCode) => {
    if (!selectedCodeForModifier) return;

    const cd = codes.find((c) => c.code === selectedCodeForModifier);
    if (!cd) return;

    const combined = buildCombinedMods(cd);
    const entry = combined.find((m) => m.code === modCode);
    const currentlySelected = entry?.selected || false;

    // Check if LLM suggested it
    const providerSuggested = providers.some((p) =>
      providerHasModifier(cd, p, modCode)
    );

    // Check if custom exists
    const customExists = cd.customModifiers?.some((m) => m.code === modCode);

    // If neither LLM nor custom contains it → auto-create custom entry
    if (!providerSuggested && !customExists) {
      onAddCustomModifier(cd.code, { code: modCode, selected: false });
    }

    if (!currentlySelected) {
      // Turn ON for all LLM providers
      providers.forEach((p) => {
        if (providerSuggested && !providerIsSelected(cd, p, modCode)) {
          onToggleModifier(cd.code, p, modCode);
        }
      });

      // Turn ON custom
      onToggleCustomModifier(cd.code, modCode);
    } else {
      // Turn OFF for all LLM providers
      providers.forEach((p) => {
        if (providerSuggested && providerIsSelected(cd, p, modCode)) {
          onToggleModifier(cd.code, p, modCode);
        }
      });

      // Turn OFF custom
      if (customExists) onToggleCustomModifier(cd.code, modCode);
    }
  };

  const isCombinedSelected = (codeData, modCode) => {
    const custom = getCustomModifierEntry(codeData, modCode);
    if (custom) return custom.selected;

    return providers.some((p) => providerIsSelected(codeData, p, modCode));
  };

  const handleBadgeToggle = (codeStr, modCode) => {
    setFadingMods((s) => new Set(s).add(`${codeStr}::${modCode}`));
    setTimeout(() => {
      setFadingMods((s) => {
        const newSet = new Set(s);
        newSet.delete(`${codeStr}::${modCode}`);
        return newSet;
      });

      const cd = codes.find((c) => c.code === codeStr);
      if (!cd) return;

      providers.forEach((p) => {
        if (providerHasModifier(cd, p, modCode) && providerIsSelected(cd, p, modCode)) {
          onToggleModifier(codeStr, p, modCode);
        }
      });

      const custom = getCustomModifierEntry(cd, modCode);
      if (custom?.selected) onToggleCustomModifier(codeStr, modCode);
    }, 150);
  };

  const llmProvidedCode = (codeData, key) => {
  const llm = codeData?.llmSuggestions?.[key];
  if (!llm) return false;

  // LLM must have at least one meaningful field
  const hasMeaningfulData =
    (llm.modifiers && llm.modifiers.length > 0) ||
    llm.reasoning ||
    llm.audit_trail ||
    llm.auditTrail;

  return !!hasMeaningfulData;
};


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <TooltipProvider>
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead>Code</TableHead>
                <TableHead>OpenAI</TableHead>
                <TableHead>Claude</TableHead>
                <TableHead>Gemini</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {codes.map((codeData) => {
                const expanded = expandedCodes.includes(codeData.code);
                const combined = buildCombinedMods(codeData);
                const selectedMods = combined.filter((m) => m.selected);

                return (
                  <Fragment key={String(codeData.code)}>
                    <TableRow className="cursor-pointer hover:bg-muted/30">
                      <TableCell>
                        <Checkbox
                          checked={codeData.selected}
                          onCheckedChange={() => onToggleCode(codeData.code)}
                        />
                      </TableCell>

                      <TableCell onClick={() => toggleExpand(codeData.code)}>
                        {expanded ? <ChevronDown /> : <ChevronRight />}
                      </TableCell>

                      <TableCell onClick={() => toggleExpand(codeData.code)}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">
                            {codeData.code}
                          </span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{codeData.description || "—"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {type === "cpt" && selectedMods.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedMods.map((m) => {
                              const key = `${codeData.code}::${m.code}`;
                              const fading = fadingMods.has(key);
                              return (
                                <button
                                  key={m.code}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBadgeToggle(codeData.code, m.code);
                                  }}
                                  className={cn(
                                    "inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white border border-indigo-700",
                                    "transition-all duration-150",
                                    fading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                  )}
                                >
                                  <span className="font-mono">{m.code}</span>
                                  <X className="w-3 h-3" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </TableCell>

                      {providers.map((key) => (
                        <TableCell key={key} className="text-center">
                          {llmProvidedCode(codeData, key) ? (
                            <CheckCircle className="text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="text-red-500 mx-auto" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {expanded && (
                      <TableRow className="bg-muted/10">
                        <TableCell colSpan={6}>
                          {/* LLM Expanded */}
                          <div className="grid grid-cols-3 gap-6 p-4">
                            {providers.map((key) => {
                              const llm = codeData.llmSuggestions?.[key] || {};
                              const mods = llm.modifiers || [];
                              const selectedMods = llm.selectedModifiers || mods;

                              return (
                                <div key={key} className="space-y-3">
                                  <h4 className="font-semibold capitalize">{key}</h4>

                                  <div>
                                    <div className="font-semibold">Reasoning:</div>
                                    <p className="text-muted-foreground whitespace-pre-line">
                                      {llm.reasoning || "—"}
                                    </p>
                                  </div>

                                  <div>
                                    <div className="font-semibold">Audit Trail:</div>
                                    <p className="text-muted-foreground whitespace-pre-line">
                                      {llm.audit_trail || llm.auditTrail || "—"}
                                    </p>
                                  </div>

                                  {type === "cpt" && (
                                    <div>
                                      <div className="font-semibold">Modifiers:</div>
                                      <div className="space-y-1">
                                        {mods.map((mod) => (
                                          <div key={mod} className="flex items-center gap-2">
                                            <Checkbox
                                              checked={
                                                selectedMods.includes(mod) &&
                                                isCombinedSelected(codeData, mod)
                                              }
                                              onCheckedChange={() =>
                                                onToggleModifier(
                                                  codeData.code,
                                                  key,
                                                  mod
                                                )
                                              }
                                            />
                                            <span>{mod}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex gap-2 mt-4 border-t pt-3">
                            {type === "cpt" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openModifierDialog(codeData.code)}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add MOD
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                openFeedbackDialog(codeData.code)
                              }
                            >
                              <MessageSquare className="w-4 h-4 mr-1" /> Feedback
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>

      {/* ---------------- MODIFIER DIALOG ---------------- */}
      {selectedCodeForModifier && (
        <ModifierSelectionDialog
          open={modifierDialogOpen}
          onOpenChange={setModifierDialogOpen}
          modifiers={(() => {
            const cd = codes.find((c) => c.code === selectedCodeForModifier);
            if (!cd) return [];
            return buildCombinedMods(cd).map((m) => ({
              code: m.code,
              selected: m.selected,
            }));
          })()}
          onToggleModifier={handleDialogToggleModifier}
          onAddCustomModifier={(modifier) => {
            const cd = codes.find((c) => c.code === selectedCodeForModifier);
            if (!cd) return;
            onAddCustomModifier(cd.code, modifier);
          }}
          title={`Modify modifiers for ${selectedCodeForModifier}`}
        />
      )}

      {/* ---------------- FEEDBACK DIALOG ---------------- */}
      {selectedCodeForFeedback && (
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Feedback for {selectedCodeForFeedback}
              </DialogTitle>
            </DialogHeader>
            <Textarea
              value={
                codes.find((c) => c.code === selectedCodeForFeedback)
                  ?.feedback || ""
              }
              onChange={(e) =>
                onUpdateFeedback(selectedCodeForFeedback, e.target.value)
              }
            />
            <DialogFooter>
              <Button onClick={() => setFeedbackDialogOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CodeComparisonTable;
