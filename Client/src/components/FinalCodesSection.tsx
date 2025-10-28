import { CodeSuggestion } from "@/types/chart";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinalCodesSectionProps {
  cptCodes: CodeSuggestion[];
  icdCodes: CodeSuggestion[];
}

export const FinalCodesSection = ({ cptCodes, icdCodes }: FinalCodesSectionProps) => {
  const selectedCptCodes = cptCodes.filter(code => code.selected);
  const selectedIcdCodes = icdCodes.filter(code => code.selected);

  // Get all selected modifiers for a code
  const getSelectedModifiers = (code: CodeSuggestion) => {
    const allMods = new Set<string>();
    
    // Add LLM selected modifiers (using selectedModifiers or falling back to modifiers)
    (code.llmSuggestions.llm1.selectedModifiers || code.llmSuggestions.llm1.modifiers).forEach(mod => allMods.add(mod));
    (code.llmSuggestions.llm2.selectedModifiers || code.llmSuggestions.llm2.modifiers).forEach(mod => allMods.add(mod));
    (code.llmSuggestions.llm3.selectedModifiers || code.llmSuggestions.llm3.modifiers).forEach(mod => allMods.add(mod));
    
    // Add custom modifiers that are selected
    code.customModifiers.filter(m => m.selected).forEach(mod => allMods.add(mod.code));
    
    return Array.from(allMods);
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
      <div className="px-4 py-3 border-b border-border bg-secondary">
        <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">
          Final Approved Codes
        </h3>
      </div>
      
      <Tabs defaultValue="cpt" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-3 w-fit">
          <TabsTrigger value="cpt">CPT Codes</TabsTrigger>
          <TabsTrigger value="icd">ICD Codes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cpt" className="flex-1 overflow-y-auto px-4 pb-4 mt-0">
          {selectedCptCodes.length > 0 ? (
            <div className="space-y-2">
              {selectedCptCodes.map((code) => (
                <div key={code.code} className="p-3 bg-secondary/30 rounded-md border border-border space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                      {code.code}
                    </Badge>
                    {getSelectedModifiers(code).length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">MOD:</span>
                        <div className="flex flex-wrap gap-1">
                          {getSelectedModifiers(code).map(mod => (
                            <Badge key={mod} variant="secondary" className="text-xs">
                              {mod}
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
          {selectedIcdCodes.length > 0 ? (
            <div className="space-y-2">
              {selectedIcdCodes.map((code) => (
                <div key={code.code} className="p-3 bg-secondary/30 rounded-md border border-border">
                  <Badge variant="outline" className="font-mono text-xs">
                    {code.code}
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
