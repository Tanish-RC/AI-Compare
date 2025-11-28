// import { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { getClientPrompts, saveClientPrompt } from "../services/api.js";

// export default function PromptManagerModal({ open, onClose, clientId }) {
//   const [prompts, setPrompts] = useState([]);
//   const [editorText, setEditorText] = useState("");
//   const [promptName, setPromptName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedPromptId, setSelectedPromptId] = useState(null);

//   // Load prompts when modal opens
//   useEffect(() => {
//     if (!open || !clientId) return;

//     const load = async () => {
//       try {
//         const list = await getClientPrompts(clientId);
//         setPrompts(list);
//       } catch (err) {
//         console.error("Failed to load prompts", err);
//       }
//     };

//     load();
//   }, [open, clientId]);

//   // Load a prompt into editor
//   const handleSelectPrompt = (prompt) => {
//     setSelectedPromptId(prompt.promptId);
//     setEditorText(prompt.promptText);
//     setPromptName(""); // prevent renaming original
//   };

//   // Save a brand-new prompt
//   const handleSave = async () => {
//     if (!promptName.trim()) {
//       alert("Prompt name is required.");
//       return;
//     }

//     try {
//       setLoading(true);

//       await saveClientPrompt(clientId, promptName.trim(), editorText);

//       const updated = await getClientPrompts(clientId);
//       setPrompts(updated);

//       setEditorText("");
//       setPromptName("");
//       setSelectedPromptId(null);

//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save prompt.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent
//         className="p-0"
//         style={{
//           width: "70vw",
//           maxWidth: "70vw",
//           height: "80vh",
//           maxHeight: "80vh",
//         }}
//       >
//         <DialogHeader className="px-4 py-3 border-b">
//           <DialogTitle>Manage Prompts</DialogTitle>
//         </DialogHeader>

//         <div className="flex h-full">

//           {/* LEFT LIST PANEL (30%) */}
//           <div className="w-[30%] border-r p-3 overflow-y-auto bg-gray-50">
//             <h3 className="font-semibold mb-3">Existing Prompts</h3>

//             {prompts.length === 0 ? (
//               <p className="text-sm text-gray-500">No prompts yet.</p>
//             ) : (
//               <ul className="space-y-2">
//                 {prompts.map((p) => (
//                   <li
//                     key={p.promptId}
//                     className={`p-2 rounded cursor-pointer border ${
//                       selectedPromptId === p.promptId
//                         ? "bg-indigo-100 border-indigo-400"
//                         : "bg-white hover:bg-gray-100"
//                     }`}
//                     onClick={() => handleSelectPrompt(p)}
//                   >
//                     <p className="font-medium text-sm">{p.promptName}</p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* RIGHT EDITOR PANEL (70%) */}
//           <div className="w-[70%] p-4 flex flex-col">
//             <label className="text-sm font-medium mb-1">Prompt Text</label>
//             <textarea
//               className="flex-1 border rounded p-3 text-sm w-full resize-none"
//               value={editorText}
//               onChange={(e) => setEditorText(e.target.value)}
//               placeholder="Write or edit your prompt here..."
//             />

//             <div className="mt-4">
//               <label className="text-sm font-medium">New Prompt Name</label>
//               <input
//                 type="text"
//                 className="w-full border rounded px-3 py-2 mt-1 text-sm"
//                 placeholder={
//                   selectedPromptId
//                     ? "This will be saved as a NEW prompt (required)"
//                     : "Enter prompt name"
//                 }
//                 value={promptName}
//                 onChange={(e) => setPromptName(e.target.value)}
//               />
//             </div>

//             <div className="mt-4 flex justify-end">
//               <Button
//                 className="bg-indigo-600 text-white"
//                 onClick={handleSave}
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save Prompt"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


// src/components/PromptManagerModal.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { getClientPrompts, saveClientPrompt } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function PromptManagerModal({ open, onClose, clientId }) {
  const { toast } = useToast();

  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const [newPromptName, setNewPromptName] = useState("");
  const [newPromptText, setNewPromptText] = useState("");

  // Load prompts on open
  useEffect(() => {
    if (open) {
      loadPrompts();
      resetEditor();
    }
  }, [open]);

  const loadPrompts = async () => {
    try {
      const data = await getClientPrompts(clientId);
      setPrompts(data || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load prompts.",
        variant: "destructive",
      });
    }
  };

  const resetEditor = () => {
    setSelectedPrompt(null);
    setNewPromptName("");
    setNewPromptText("");
  };

  const handleSavePrompt = async () => {
    if (!newPromptName.trim() || !newPromptText.trim()) {
      return toast({
        title: "Missing Fields",
        description: "Prompt name and text are required.",
        variant: "destructive",
      });
    }

    try {
      await saveClientPrompt(clientId, newPromptName, newPromptText);
      toast({ title: "Saved", description: "New prompt created." });
      loadPrompts();
      resetEditor();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save prompt.",
        variant: "destructive",
      });
    }
  };

  const handleSelectPrompt = (p) => {
    setSelectedPrompt(p);
    // Load into editor, but as *read-only preview*
    setNewPromptName(p.promptName);
    setNewPromptText(p.promptText);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="
          w-[80vw] 
          h-[80vh] 
          max-w-none 
          max-h-none 
          p-4
          flex
          flex-col
        "
      >
        <DialogHeader className="mb-2">
          <h2 className="text-xl font-semibold">Prompt Manager</h2>
        </DialogHeader>

        {/* Main layout */}
        <div className="flex flex-1 gap-4 overflow-hidden">

          {/* LEFT: Prompt List */}
          <div
            className="border rounded p-3 overflow-auto"
            style={{ width: "28%" }}  // natural-ish width
          >
            <div className="text-sm font-semibold mb-2">Existing Prompts</div>

            {prompts.length === 0 ? (
              <p className="text-sm text-gray-500">No prompts yet.</p>
            ) : (
              prompts.map((p) => {
                const pid = p.promptId || p._id || p.id;
                const selected = selectedPrompt && selectedPrompt === p;

                return (
                  <div
                    key={pid}
                    className={`
                      p-2 rounded cursor-pointer mb-1
                      ${selected ? "bg-indigo-50 border-l-4 border-indigo-500" : "hover:bg-gray-100"}
                    `}
                    onClick={() => handleSelectPrompt(p)}
                  >
                    <div className="text-sm font-medium truncate">
                      {p.promptName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {(p.promptText || "").slice(0, 120)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Editor */}
          <div className="flex-1 border rounded p-4 flex flex-col overflow-hidden">
            {/* Prompt name */}
            <Input
              placeholder="Prompt Name"
              value={newPromptName}
              onChange={(e) => setNewPromptName(e.target.value)}
              className="mb-3"
            />

            {/* Full-height text editor */}
            <textarea
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              className="
                flex-1 
                w-full 
                p-3 
                border 
                rounded 
                bg-gray-50 
                font-mono 
                text-sm 
                resize-none 
                overflow-auto
              "
              placeholder="Enter prompt text here..."
            />

            <Button
              className="mt-4 self-end bg-indigo-600 text-white"
              onClick={handleSavePrompt}
            >
              Save as New Prompt
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
