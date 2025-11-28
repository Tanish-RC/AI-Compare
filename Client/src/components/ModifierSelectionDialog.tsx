

// import React, { useEffect, useRef, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";

// /**
//  * Props:
//  * open: boolean
//  * onOpenChange: (open: boolean) => void
//  * modifiers: Array<{ code: string, selected: boolean }>  // NOTE: per your request, only selected mods are passed here
//  * onToggleModifier: (modifierCode: string) => void  // toggles (removes) modifier
//  * onAddCustomModifier: (modifier: { code: string, selected: boolean }) => void
//  * title?: string
//  */

// const ModifierSelectionDialog = ({
//   open,
//   onOpenChange,
//   modifiers = [],
//   onToggleModifier,
//   onAddCustomModifier,
//   title = "Select Modifiers",
// }) => {
//   const [newMod, setNewMod] = useState("");
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (open) {
//       setTimeout(() => inputRef.current?.focus(), 120);
//     }
//   }, [open]);

//   const handleAdd = () => {
//     const trimmed = (newMod || "").trim();
//     if (!trimmed) return;
//     // add as selected by default
//     onAddCustomModifier?.({ code: trimmed, selected: true });
//     setNewMod("");
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-3 max-h-[300px] overflow-y-auto">
//           {modifiers.length ? (
//             modifiers.map((m) => (
//               <div key={m.code} className="flex items-center justify-between border-b py-2">
//                 <div className="flex items-center gap-3">
//                   <Checkbox checked={!!m.selected} onCheckedChange={() => onToggleModifier?.(m.code)} />
//                   <span className="text-sm">{m.code}</span>
//                 </div>
//                 <div className="text-sm text-muted-foreground">{m.selected ? "Selected" : "Not selected"}</div>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-500 italic">No active modifiers. Add one below to start.</p>
//           )}
//         </div>

//         <div className="flex items-center gap-2 pt-3">
//           <Input ref={inputRef} value={newMod} onChange={(e) => setNewMod(e.target.value)} placeholder="Enter new modifier (e.g., 25)" className="flex-1" />
//           <Button variant="secondary" onClick={handleAdd}>Add</Button>
//         </div>

//         <DialogFooter>
//           <Button onClick={() => onOpenChange(false)}>Close</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ModifierSelectionDialog;


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import modifiersData from "@/data/modifiers.json"; // <-- uses the JSON file

// interface Modifier {
//   code: string;
//   description: string;
//   selected: boolean;
// }

// interface ModifierSelectionDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   modifiers: Array<{ code: string; selected: boolean }>;
//   onToggleModifier: (modifierCode: string) => void;
//   onAddCustomModifier: (modifier: { code: string; selected: boolean }) => void;
//   title?: string;
// }

// const ModifierSelectionDialog: React.FC<ModifierSelectionDialogProps> = ({
//   open,
//   onOpenChange,
//   modifiers = [],
//   onToggleModifier,
//   onAddCustomModifier,
//   title = "Select Modifiers",
// }) => {
//   const [newMod, setNewMod] = useState("");
//   const [search, setSearch] = useState("");
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (open) {
//       setTimeout(() => inputRef.current?.focus(), 120);
//     }
//   }, [open]);

//   const handleAdd = () => {
//     const trimmed = newMod.trim().toUpperCase();
//     if (!trimmed) return;
//     onAddCustomModifier?.({ code: trimmed, selected: true });
//     setNewMod("");
//   };

//   // Build full list (merge known modifiers and currently selected)
//   const allModifiers: Modifier[] = useMemo(() => {
//     const allCodes = new Set([
//       ...Object.keys(modifiersData),
//       ...modifiers.map((m) => m.code),
//     ]);

//     return Array.from(allCodes)
//       .map((code) => {
//         const existing = modifiers.find((m) => m.code === code);
//         return {
//           code,
//           description: modifiersData[code] || "Custom modifier",
//           selected: existing ? existing.selected : false,
//         };
//       })
//       .filter((m) =>
//         `${m.code} ${m.description}`
//           .toLowerCase()
//           .includes(search.toLowerCase().trim())
//       )
//       .sort((a, b) => {
//         if (a.selected === b.selected) return a.code.localeCompare(b.code);
//         return a.selected ? -1 : 1;
//       });
//   }, [modifiers, search]);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>

//         {/* Search bar */}
//         <div className="flex items-center gap-2 mb-2">
//           <Input
//             placeholder="Search modifier by code or description..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="flex-1"
//           />
//         </div>

//         {/* Modifier list */}
//         <ScrollArea className="max-h-[400px] border rounded-md pr-2">
//           <div className="space-y-1">
//             {allModifiers.length ? (
//               allModifiers.map((m) => (
//                 <div
//                   key={m.code}
//                   className="flex items-start justify-between border-b py-2 px-2 hover:bg-gray-50 transition"
//                 >
//                   <div className="flex items-start gap-3">
//                     <Checkbox
//                       checked={!!m.selected}
//                       onCheckedChange={() => onToggleModifier?.(m.code)}
//                     />
//                     <div>
//                       <div className="font-mono text-sm font-medium">
//                         {m.code}
//                       </div>
//                       <div className="text-xs text-gray-600 max-w-[500px]">
//                         {m.description}
//                       </div>
//                     </div>
//                   </div>
//                   {m.selected && (
//                     <span className="text-xs text-indigo-600 font-medium pr-2">
//                       Selected
//                     </span>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500 italic p-3">
//                 No modifiers match your search.
//               </p>
//             )}
//           </div>
//         </ScrollArea>

//         {/* Add custom */}
//         <div className="flex items-center gap-2 mt-3">
//           <Input
//             ref={inputRef}
//             value={newMod}
//             onChange={(e) => setNewMod(e.target.value)}
//             placeholder="Enter new modifier code (e.g., 25)"
//             className="flex-1"
//           />
//           <Button variant="secondary" onClick={handleAdd}>
//             Add
//           </Button>
//         </div>

//         <DialogFooter>
//           <Button onClick={() => onOpenChange(false)}>Close</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ModifierSelectionDialog;


import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import modifiersData from "@/data/modifiers.json";

interface Modifier {
  code: string;
  description: string;
  selected: boolean;
}

interface ModifierSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modifiers: Array<{ code: string; selected: boolean }>;
  onToggleModifier: (modifierCode: string) => void;
  onAddCustomModifier: (modifier: { code: string; selected: boolean }) => void;
  title?: string;
}

const ModifierSelectionDialog: React.FC<ModifierSelectionDialogProps> = ({
  open,
  onOpenChange,
  modifiers = [],
  onToggleModifier,
  onAddCustomModifier,
  title = "Select Modifiers",
}) => {
  const [newMod, setNewMod] = useState("");
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const allModifiers: Modifier[] = useMemo(() => {
    const selectedMap = new Map(modifiers.map((m) => [m.code, m.selected]));

    return Object.keys(modifiersData)
      .map((code) => ({
        code,
        description: modifiersData[code] || "Modifier",
        selected: !!selectedMap.get(code),
      }))
      .filter((m) =>
        `${m.code} ${m.description}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) =>
        a.selected === b.selected
          ? a.code.localeCompare(b.code)
          : a.selected
          ? -1
          : 1
      );
  }, [modifiers, search]);

  const handleAdd = () => {
    const value = newMod.trim().toUpperCase();
    if (!value) return;

    onAddCustomModifier({ code: value, selected: true });
    setNewMod("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search modifier by code or description..."
          className="mb-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ScrollArea className="max-h-[400px] border rounded-md pr-2">
          <div className="space-y-1">
            {allModifiers.map((m) => (
              <div
                key={m.code}
                className="flex items-start justify-between border-b py-2 px-2 hover:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={m.selected}
                    onCheckedChange={() => onToggleModifier(m.code)}
                  />
                  <div>
                    <div className="font-mono text-sm font-medium">{m.code}</div>
                    <div className="text-xs text-gray-600 max-w-[500px]">
                      {m.description}
                    </div>
                  </div>
                </div>

                {m.selected && (
                  <span className="text-xs text-indigo-600 font-medium pr-2">
                    Selected
                  </span>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 mt-3">
          <Input
            ref={inputRef}
            value={newMod}
            onChange={(e) => setNewMod(e.target.value)}
            placeholder="Enter new modifier code (e.g., 25)"
            className="flex-1"
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifierSelectionDialog;
