import { useState } from "react";
import { Modifier } from "@/types/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface ModifierSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modifiers: Modifier[];
  onToggleModifier: (code: string) => void;
  title: string;
}

export const ModifierSelectionDialog = ({
  open,
  onOpenChange,
  modifiers,
  onToggleModifier,
  title,
}: ModifierSelectionDialogProps) => {
  const [search, setSearch] = useState("");

  const filteredModifiers = modifiers.filter(
    (mod) =>
      mod.code.toLowerCase().includes(search.toLowerCase()) ||
      mod.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {filteredModifiers.map((modifier) => (
                <div
                  key={modifier.code}
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                >
                  <Checkbox
                    checked={modifier.selected}
                    onCheckedChange={() => onToggleModifier(modifier.code)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {modifier.code} - {modifier.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
