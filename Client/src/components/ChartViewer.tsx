import { Chart } from "@/types/chart";
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
import { useState } from "react";

interface ChartViewerProps {
  chart: Chart | null;
  onToggleApproval?: () => void;
  onRerun?: () => void;
}

export const ChartViewer = ({ chart, onToggleApproval, onRerun }: ChartViewerProps) => {
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [prompt, setPrompt] = useState("You are a medical coding assistant. Analyze the following chart and suggest appropriate CPT and ICD codes based on the documented procedures and diagnoses.");

  const handleRerunCurrent = () => {
    setIsPromptDialogOpen(false);
    if (onRerun) {
      onRerun();
    }
  };

  const handleRerunAll = () => {
    setIsPromptDialogOpen(false);
    if (onRerun) {
      onRerun();
    }
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
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-card-foreground">{chart.name}</h2>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span>Patient: {chart.patientName}</span>
              <span>Date: {chart.date}</span>
            </div>
          </div>
          {onToggleApproval && (
            <div className="flex items-center gap-2">
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
                    <Button variant="outline" onClick={() => setIsPromptDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={handleRerunCurrent}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-run This Chart
                    </Button>
                    <Button onClick={handleRerunAll}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-run All Charts
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
      {/* <ScrollArea className="flex-1">
        <div className="p-6">
          <pre className="whitespace-pre-wrap text-sm text-card-foreground font-sans leading-relaxed">
            {chart.content}
          </pre>
        </div>
      </ScrollArea> */}
      <ScrollArea className="flex-1 relative">
  <div className="p-6">
    {chart?.pdfUrl ? (
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
