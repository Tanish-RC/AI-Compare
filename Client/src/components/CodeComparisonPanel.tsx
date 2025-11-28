// import { useState } from "react";
// import { ChevronDown, ChevronUp, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { CodeComparisonTable } from "./CodeComparisonTable";
// import { ChartCodes } from "@/types/chart";
// import { cn } from "@/lib/utils";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// interface CodeComparisonPanelProps {
//   chartCodes: ChartCodes | null;
//   onToggleCPTCode: (code: string) => void;
//   onToggleICDCode: (code: string) => void;
//   onUpdateCPTFeedback: (code: string, feedback: string) => void;
//   onUpdateICDFeedback: (code: string, feedback: string) => void;
//   onAddCustomCode: (type: 'cpt' | 'icd', code: string, description: string) => void;
//   onToggleCPTModifier: (code: string, llmKey: 'llm1' | 'llm2' | 'llm3', modifierCode: string) => void;
//   onToggleICDModifier: (code: string, llmKey: 'llm1' | 'llm2' | 'llm3', modifierCode: string) => void;
//   onToggleCPTCustomModifier: (code: string, modifierCode: string) => void;
//   onToggleICDCustomModifier: (code: string, modifierCode: string) => void;
// }

// export const CodeComparisonPanel = ({
//   chartCodes,
//   onToggleCPTCode,
//   onToggleICDCode,
//   onUpdateCPTFeedback,
//   onUpdateICDFeedback,
//   onAddCustomCode,
//   onToggleCPTModifier,
//   onToggleICDModifier,
//   onToggleCPTCustomModifier,
//   onToggleICDCustomModifier,
// }: CodeComparisonPanelProps) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<'cpt' | 'icd'>('cpt');
//   const [newCode, setNewCode] = useState('');
//   const [newDescription, setNewDescription] = useState('');

//   const handleAddCode = () => {
//     if (newCode && newDescription) {
//       onAddCustomCode(activeTab, newCode, newDescription);
//       setNewCode('');
//       setNewDescription('');
//       setIsDialogOpen(false);
//     }
//   };

//   if (!chartCodes) {
//     return (
//       <div className="h-full flex items-center justify-center bg-card border-t border-border">
//         <p className="text-muted-foreground">Select a chart to view code comparisons</p>
//       </div>
//     );
//   }

//   return (
//     <div className={cn("flex flex-col bg-card border-t border-border panel-transition", isExpanded ? "h-full" : "h-12")}>
//       <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary">
//         <h2 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
//           Code Comparison
//         </h2>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="h-8 w-8 p-0"
//         >
//           {isExpanded ? (
//             <ChevronDown className="h-4 w-4" />
//           ) : (
//             <ChevronUp className="h-4 w-4" />
//           )}
//         </Button>
//       </div>
      
//       {isExpanded && (
//         <div className="flex-1 overflow-hidden">
//           <Tabs defaultValue="cpt" value={activeTab} onValueChange={(v) => setActiveTab(v as 'cpt' | 'icd')} className="h-full flex flex-col">
//             <TabsList className="w-full justify-start rounded-none border-b bg-secondary px-4">
//               <TabsTrigger value="cpt" className="text-xs">CPT Codes</TabsTrigger>
//               <TabsTrigger value="icd" className="text-xs">ICD Codes</TabsTrigger>
//               <div className="ml-auto">
//                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-7 gap-1">
//                       <Plus className="w-3 h-3" />
//                       Add {activeTab.toUpperCase()} Code
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Add Custom {activeTab.toUpperCase()} Code</DialogTitle>
//                       <DialogDescription>
//                         Add a custom code that will be marked as externally added.
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4 py-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="code">Code</Label>
//                         <Input
//                           id="code"
//                           placeholder={activeTab === 'cpt' ? "e.g., 99213" : "e.g., J20.9"}
//                           value={newCode}
//                           onChange={(e) => setNewCode(e.target.value)}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="description">Description</Label>
//                         <Textarea
//                           id="description"
//                           placeholder="Enter code description"
//                           value={newDescription}
//                           onChange={(e) => setNewDescription(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//                         Cancel
//                       </Button>
//                       <Button onClick={handleAddCode}>Add Code</Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </TabsList>
//             <TabsContent value="cpt" className="flex-1 m-0 overflow-hidden">
//               <CodeComparisonTable
//                 codes={chartCodes.cptCodes}
//                 onToggleCode={onToggleCPTCode}
//                 onUpdateFeedback={onUpdateCPTFeedback}
//                 onToggleModifier={onToggleCPTModifier}
//                 onToggleCustomModifier={onToggleCPTCustomModifier}
//                 onAddCustomModifier={(code, modifier) => {}}
//                 type="cpt"
//               />
//             </TabsContent>
//             <TabsContent value="icd" className="flex-1 m-0 overflow-hidden">
//               <CodeComparisonTable
//                 codes={chartCodes.icdCodes}
//                 onToggleCode={onToggleICDCode}
//                 onUpdateFeedback={onUpdateICDFeedback}
//                 onToggleModifier={onToggleICDModifier}
//                 onToggleCustomModifier={onToggleICDCustomModifier}
//                 onAddCustomModifier={(code, modifier) => {}}
//                 type="icd"
//               />
//             </TabsContent>
//           </Tabs>
//         </div>
//       )}
//     </div>
//   );
// };

// import { useState } from "react";
// import { ChevronDown, ChevronUp, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { CodeComparisonTable } from "./CodeComparisonTable";
// import { ChartCodes } from "@/types/chart";
// import { cn } from "@/lib/utils";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// interface CodeComparisonPanelProps {
//   chartCodes: ChartCodes | null;
//   onToggleCPTCode: (code: string) => void;
//   onToggleICDCode: (code: string) => void;
//   onUpdateCPTFeedback: (code: string, feedback: string) => void;
//   onUpdateICDFeedback: (code: string, feedback: string) => void;
//   onAddCustomCode: (
//     type: "cpt" | "icd",
//     code: string,
//     description: string
//   ) => void;

//   // ✅ add missing props
//   onToggleCPTModifier: (
//     code: string,
//     llmKey: "openai" | "claude" | "gemini",
//     modifierCode: string
//   ) => void;
//   onToggleICDModifier: (
//     code: string,
//     llmKey: "openai" | "claude" | "gemini",
//     modifierCode: string
//   ) => void;
//   onToggleCPTCustomModifier: (code: string, modifierCode: string) => void;
//   onToggleICDCustomModifier: (code: string, modifierCode: string) => void;
//   onAddCustomModifier: (code: string, modifier: { code: string }) => void; // ✅ added
// }

// export const CodeComparisonPanel = ({
//   chartCodes,
//   onToggleCPTCode,
//   onToggleICDCode,
//   onUpdateCPTFeedback,
//   onUpdateICDFeedback,
//   onAddCustomCode,
//   onToggleCPTModifier,
//   onToggleICDModifier,
//   onToggleCPTCustomModifier,
//   onToggleICDCustomModifier,
//   onAddCustomModifier, // ✅ new prop
// }: CodeComparisonPanelProps) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<"cpt" | "icd">("cpt");
//   const [newCode, setNewCode] = useState("");
//   const [newDescription, setNewDescription] = useState("");

//   const handleAddCode = () => {
//     if (newCode && newDescription) {
//       onAddCustomCode(activeTab, newCode, newDescription);
//       setNewCode("");
//       setNewDescription("");
//       setIsDialogOpen(false);
//     }
//   };

//   if (!chartCodes) {
//     return (
//       <div className="h-full flex items-center justify-center bg-card border-t border-border">
//         <p className="text-muted-foreground">
//           Select a chart to view code comparisons
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={cn(
//         "flex flex-col bg-card border-t border-border panel-transition",
//         isExpanded ? "h-full" : "h-12"
//       )}
//     >
//       <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary">
//         <h2 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
//           Code Comparison
//         </h2>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="h-8 w-8 p-0"
//         >
//           {isExpanded ? (
//             <ChevronDown className="h-4 w-4" />
//           ) : (
//             <ChevronUp className="h-4 w-4" />
//           )}
//         </Button>
//       </div>

//       {isExpanded && (
//         <div className="flex-1 overflow-hidden">
//           <Tabs
//             defaultValue="cpt"
//             value={activeTab}
//             onValueChange={(v) => setActiveTab(v as "cpt" | "icd")}
//             className="h-full flex flex-col"
//           >
//             <TabsList className="w-full justify-start rounded-none border-b bg-secondary px-4">
//               <TabsTrigger value="cpt" className="text-xs">
//                 CPT Codes
//               </TabsTrigger>
//               <TabsTrigger value="icd" className="text-xs">
//                 ICD Codes
//               </TabsTrigger>

//               <div className="ml-auto">
//                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-7 gap-1">
//                       <Plus className="w-3 h-3" />
//                       Add {activeTab.toUpperCase()} Code
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>
//                         Add Custom {activeTab.toUpperCase()} Code
//                       </DialogTitle>
//                       <DialogDescription>
//                         Add a custom code that will be marked as externally
//                         added.
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4 py-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="code">Code</Label>
//                         <Input
//                           id="code"
//                           placeholder={
//                             activeTab === "cpt" ? "e.g., 99213" : "e.g., J20.9"
//                           }
//                           value={newCode}
//                           onChange={(e) => setNewCode(e.target.value)}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="description">Description</Label>
//                         <Textarea
//                           id="description"
//                           placeholder="Enter code description"
//                           value={newDescription}
//                           onChange={(e) => setNewDescription(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button
//                         variant="outline"
//                         onClick={() => setIsDialogOpen(false)}
//                       >
//                         Cancel
//                       </Button>
//                       <Button onClick={handleAddCode}>Add Code</Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </TabsList>

//             {/* ✅ CPT TABLE */}
//             <TabsContent value="cpt" className="flex-1 m-0 overflow-hidden">
//               <CodeComparisonTable
//                 codes={chartCodes.cptCodes}
//                 onToggleCode={onToggleCPTCode}
//                 onUpdateFeedback={onUpdateCPTFeedback}
//                 onToggleModifier={onToggleCPTModifier}
//                 onToggleCustomModifier={onToggleCPTCustomModifier}
//                 onAddCustomModifier={onAddCustomModifier} // ✅ fixed
//                 type="cpt"
//               />
//             </TabsContent>

//             {/* ✅ ICD TABLE */}
//             <TabsContent value="icd" className="flex-1 m-0 overflow-hidden">
//               <CodeComparisonTable
//                 codes={chartCodes.icdCodes}
//                 onToggleCode={onToggleICDCode}
//                 onUpdateFeedback={onUpdateICDFeedback}
//                 onToggleModifier={onToggleICDModifier}
//                 onToggleCustomModifier={onToggleICDCustomModifier}
//                 onAddCustomModifier={onAddCustomModifier} // ✅ also here
//                 type="icd"
//               />
//             </TabsContent>
//           </Tabs>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CodeComparisonPanel;



import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeComparisonTable } from "./CodeComparisonTable";
import { ChartCodes } from "@/types/chart";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CodeComparisonPanelProps {
  chartCodes: ChartCodes | null;
  onToggleCPTCode: (code: string) => void;
  onToggleICDCode: (code: string) => void;
  onUpdateCPTFeedback: (code: string, feedback: string) => void;
  onUpdateICDFeedback: (code: string, feedback: string) => void;

  // ✅ Updated: description removed
  onAddCustomCode: (type: "cpt" | "icd", code: string) => void;

  onToggleCPTModifier: (
    code: string,
    llmKey: "openai" | "claude" | "gemini",
    modifierCode: string
  ) => void;
  onToggleICDModifier: (
    code: string,
    llmKey: "openai" | "claude" | "gemini",
    modifierCode: string
  ) => void;
  onToggleCPTCustomModifier: (code: string, modifierCode: string) => void;
  onToggleICDCustomModifier: (code: string, modifierCode: string) => void;

  onAddCustomModifier: (code: string, modifier: { code: string }) => void;
}

export const CodeComparisonPanel = ({
  chartCodes,
  onToggleCPTCode,
  onToggleICDCode,
  onUpdateCPTFeedback,
  onUpdateICDFeedback,
  onAddCustomCode,
  onToggleCPTModifier,
  onToggleICDModifier,
  onToggleCPTCustomModifier,
  onToggleICDCustomModifier,
  onAddCustomModifier,
}: CodeComparisonPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cpt" | "icd">("cpt");
  const [newCode, setNewCode] = useState("");

  const handleAddCode = () => {
    if (newCode.trim()) {
      onAddCustomCode(activeTab, newCode.trim());
      setNewCode("");
      setIsDialogOpen(false);
    }
  };

  if (!chartCodes) {
    return (
      <div className="h-full flex items-center justify-center bg-card border-t border-border">
        <p className="text-muted-foreground">
          Select a chart to view code comparisons
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-t border-border panel-transition",
        isExpanded ? "h-full" : "h-12"
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary">
        <h2 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
          Code Comparison
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="flex-1 overflow-hidden">
          <Tabs
            defaultValue="cpt"
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "cpt" | "icd")}
            className="h-full flex flex-col"
          >
            <TabsList className="w-full justify-start rounded-none border-b bg-secondary px-4">
              <TabsTrigger value="cpt" className="text-xs">
                CPT Codes
              </TabsTrigger>
              <TabsTrigger value="icd" className="text-xs">
                ICD Codes
              </TabsTrigger>

              <div className="ml-auto">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 gap-1">
                      <Plus className="w-3 h-3" />
                      Add {activeTab.toUpperCase()} Code
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Add Custom {activeTab.toUpperCase()} Code
                      </DialogTitle>
                      <DialogDescription>
                        Add a custom code that will be marked as externally
                        added.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Input
                          id="code"
                          placeholder={
                            activeTab === "cpt" ? "e.g., 99213" : "e.g., J20.9"
                          }
                          value={newCode}
                          onChange={(e) => setNewCode(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddCode}>Add Code</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsList>

            {/* CPT TABLE */}
            <TabsContent value="cpt" className="flex-1 m-0 overflow-hidden">
              <CodeComparisonTable
                codes={chartCodes.cptCodes}
                onToggleCode={onToggleCPTCode}
                onUpdateFeedback={onUpdateCPTFeedback}
                onToggleModifier={onToggleCPTModifier}
                onToggleCustomModifier={onToggleCPTCustomModifier}
                onAddCustomModifier={onAddCustomModifier}
                type="cpt"
              />
            </TabsContent>

            {/* ICD TABLE */}
            <TabsContent value="icd" className="flex-1 m-0 overflow-hidden">
              <CodeComparisonTable
                codes={chartCodes.icdCodes}
                onToggleCode={onToggleICDCode}
                onUpdateFeedback={onUpdateICDFeedback}
                onToggleModifier={onToggleICDModifier}
                onToggleCustomModifier={onToggleICDCustomModifier}
                onAddCustomModifier={onAddCustomModifier}
                type="icd"
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default CodeComparisonPanel;
