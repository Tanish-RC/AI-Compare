// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Card } from "@/components/ui/card";
// import { Search } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import MultiFileUpload from "@/components/MultiFileUpload.jsx";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // ✅ Persistent state for clients & runs
//   const [clients, setClients] = useState(() => {
//     const saved = localStorage.getItem("clients");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [runs, setRuns] = useState(() => {
//     const saved = localStorage.getItem("runs");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [results, setResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   // ✅ Automatically create new client + run when new analysis completes
//   useEffect(() => {
//     if (results.length === 0) return;

//     const runId = Date.now().toString();
//     const clientId = `client_${runId}`;
//     const clientName = `Client_${new Date().toLocaleString()}`;

//     // Save LLM results in localStorage
//     localStorage.setItem(`llm_results_${runId}`, JSON.stringify(results));
//     localStorage.setItem("latest_run_id", runId);

//     // Create new run
//     const newRun = {
//       id: runId,
//       clientName,
//       dateTime: new Date().toISOString(),
//       totalCharts: results.length,
//       processedCharts: results.length,
//       status: "completed" as const,
//     };

//     // Create new client
//     const newClient = {
//       id: clientId,
//       name: clientName,
//       totalRuns: 1,
//       lastRunDate: new Date().toISOString(),
//     };

//     // Update localStorage for runs and clients
//     const updatedRuns = [newRun, ...runs];
//     const updatedClients = [newClient, ...clients];

//     setRuns(updatedRuns);
//     setClients(updatedClients);

//     localStorage.setItem("runs", JSON.stringify(updatedRuns));
//     localStorage.setItem("clients", JSON.stringify(updatedClients));

//     toast({
//       title: "Charts processed",
//       description: `A new client "${clientName}" has been created automatically.`,
//     });
//   }, [results]);

//   // ✅ Filter clients by search
//   const filteredClients = clients.filter((client) =>
//     client.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ✅ Handle click → navigate to run page
//   const handleClientClick = (clientName: string) => {
//     const clientRun = runs.find((run) => run.clientName === clientName);
//     if (clientRun) navigate(`/run/${clientRun.id}`);
//   };

//   // ✅ Format last run date
//   const formatDateTime = (dateTime: string) => {
//     const date = new Date(dateTime);
//     return {
//       date: date.toLocaleDateString(),
//       time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     };
//   };

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       {/* Header */}
//       <header className="h-12 border-b border-border bg-card flex items-center px-4">
//         <h1 className="text-lg font-semibold text-card-foreground">
//           RCM Medical Coding System - Dashboard
//         </h1>
//       </header>

//       {/* Main Layout */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Left: Client List */}
//         <div className="w-2/5 border-r border-border flex flex-col">
//           <div className="p-4 border-b border-border">
//             <h2 className="text-lg font-semibold text-card-foreground">
//               Clients
//             </h2>
//             <div className="relative mt-3">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search clients..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>

//           <ScrollArea className="flex-1">
//             <div className="p-4 space-y-2">
//               {filteredClients.length > 0 ? (
//                 filteredClients.map((client) => {
//                   const { date } = formatDateTime(client.lastRunDate);
//                   return (
//                     <Card
//                       key={client.id}
//                       className="p-4 cursor-pointer hover:bg-accent transition-colors"
//                       onClick={() => handleClientClick(client.name)}
//                     >
//                       <div>
//                         <h3 className="font-semibold text-card-foreground">
//                           {client.name}
//                         </h3>
//                         <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
//                           <span>{client.totalRuns} run</span>
//                           <span>Last: {date}</span>
//                         </div>
//                       </div>
//                     </Card>
//                   );
//                 })
//               ) : (
//                 <p className="text-sm text-muted-foreground px-4">
//                   No clients yet. Upload files to start.
//                 </p>
//               )}
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Right: MultiFileUpload */}
//         <MultiFileUpload results={results} setResults={setResults} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import { useState, useEffect } from "react";
// import { getClients, addClient } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useToast } from "@/hooks/use-toast";

// const Dashboard = () => {
//   const { toast } = useToast();
//   const [clients, setClients] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newClient, setNewClient] = useState({ name: "", contactEmail: "", contactPhone: "" });

//   useEffect(() => {
//     getClients().then(setClients);
//   }, []);

//   const handleAddClient = async () => {
//     const res = await addClient(newClient);
//     if (res.error) toast({ title: "Error", description: res.error });
//     else {
//       setClients((prev) => [res, ...prev]);
//       toast({ title: "Client added", description: `${res.name} created.` });
//       setShowModal(false);
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       <header className="h-12 border-b flex items-center justify-between px-4 bg-card">
//         <h1 className="text-lg font-semibold">RCM Medical Coding System - Dashboard</h1>
//         <Button onClick={() => setShowModal(true)}>+ Add Client</Button>
//       </header>

//       <ScrollArea className="p-4 space-y-2">
//         {clients.length > 0 ? (
//           clients.map((c) => (
//             <Card key={c._id} className="p-4">
//               <h3 className="font-semibold">{c.name}</h3>
//               <p className="text-sm text-muted-foreground">{c.contactEmail || "No email"}</p>
//             </Card>
//           ))
//         ) : (
//           <p className="text-sm text-muted-foreground">No clients yet. Add one to start.</p>
//         )}
//       </ScrollArea>

//       {showModal && (
//         <Dialog open={showModal} onOpenChange={setShowModal}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Client</DialogTitle>
//             </DialogHeader>
//             <Input placeholder="Client Name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
//             <Input placeholder="Email" value={newClient.contactEmail} onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })} />
//             <Input placeholder="Phone" value={newClient.contactPhone} onChange={(e) => setNewClient({ ...newClient, contactPhone: e.target.value })} />
//             <DialogFooter>
//               <Button onClick={handleAddClient}>Save</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// import { useState, useEffect } from "react";
// import { getClients, addClient } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const [clients, setClients] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newClient, setNewClient] = useState({
//     name: "",
//     contactEmail: "",
//     contactPhone: "",
//   });

//   // ✅ Fetch clients from backend
//   useEffect(() => {
//     getClients().then((res) => {
//       if (res.error) toast({ title: "Error", description: res.error });
//       else setClients(res);
//     });
//   }, []);

//   const handleAddClient = async () => {
//     const res = await addClient(newClient);
//     if (res.error) toast({ title: "Error", description: res.error });
//     else {
//       setClients((prev) => [res, ...prev]);
//       toast({ title: "Client added", description: `${res.name} created.` });
//       setShowModal(false);
//       setNewClient({ name: "", contactEmail: "", contactPhone: "" });
//     }
//   };

//   const handleOpenClient = (clientId) => {
//     navigate(`/client/${clientId}`); // ✅ Go to client charts page
//   };

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       <header className="h-12 border-b flex items-center justify-between px-4 bg-card">
//         <h1 className="text-lg font-semibold">
//           RCM Medical Coding System - Dashboard
//         </h1>
//         <Button onClick={() => setShowModal(true)}>+ Add Client</Button>
//       </header>

//       <ScrollArea className="p-4 space-y-2 flex-1">
//         {clients.length > 0 ? (
//           clients.map((c) => (
//             <Card
//               key={c._id}
//               className="p-4 cursor-pointer hover:bg-accent transition-colors"
//               onClick={() => handleOpenClient(c._id)}
//             >
//               <h3 className="font-semibold">{c.name}</h3>
//               <p className="text-sm text-muted-foreground">
//                 {c.contactEmail || "No email"}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 {c.contactPhone || "No phone"}
//               </p>
//             </Card>
//           ))
//         ) : (
//           <p className="text-sm text-muted-foreground">
//             No clients yet. Add one to start.
//           </p>
//         )}
//       </ScrollArea>

//       {/* Add Client Modal */}
//       {showModal && (
//         <Dialog open={showModal} onOpenChange={setShowModal}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Client</DialogTitle>
//             </DialogHeader>

//             <Input
//               placeholder="Client Name"
//               value={newClient.name}
//               onChange={(e) =>
//                 setNewClient({ ...newClient, name: e.target.value })
//               }
//             />
//             <Input
//               placeholder="Email"
//               value={newClient.contactEmail}
//               onChange={(e) =>
//                 setNewClient({ ...newClient, contactEmail: e.target.value })
//               }
//             />
//             <Input
//               placeholder="Phone"
//               value={newClient.contactPhone}
//               onChange={(e) =>
//                 setNewClient({ ...newClient, contactPhone: e.target.value })
//               }
//             />

//             <DialogFooter>
//               <Button onClick={handleAddClient}>Save</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// import { useState, useEffect } from "react";
// import { getClients, addClient } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const [clients, setClients] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newClient, setNewClient] = useState({ name: "" });
//   const [isAdding, setIsAdding] = useState(false);

//   // ✅ Fetch clients
//   useEffect(() => {
//     getClients().then((res) => {
//       if (res.error) toast({ title: "Error", description: res.error });
//       else setClients(res);
//     });
//   }, [toast]);

//   // ✅ Add new client
//   const handleAddClient = async () => {
//     if (!newClient.name.trim()) {
//       toast({ title: "Error", description: "Client name is required" });
//       return;
//     }

//     setIsAdding(true);
//     const res = await addClient({ name: newClient.name });
//     setIsAdding(false);

//     if (res.error) {
//       toast({ title: "Error", description: res.error });
//     } else {
//       setClients((prev) => [res, ...prev]);
//       toast({ title: "Client added", description: `${res.name} created.` });
//       setShowModal(false);
//       setNewClient({ name: "" });
//     }
//   };

//   const handleOpenClient = (clientId) => {
//     navigate(`/client/${clientId}`);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Never run";
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch {
//       return "Invalid date";
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       {/* Header */}
//       <header className="h-12 border-b flex items-center justify-between px-4 bg-card">
//         <h1 className="text-lg font-semibold">
//           RCM Medical Coding System - Dashboard
//         </h1>
//         <Button onClick={() => setShowModal(true)}>+ Add Client</Button>
//       </header>

//       {/* Client List */}
//       <ScrollArea className="p-4 space-y-2 flex-1">
//         {clients.length > 0 ? (
//           clients.map((c) => (
//             <Card
//               key={c._id}
//               className="p-4 cursor-pointer hover:bg-accent transition-colors"
//               onClick={() => handleOpenClient(c._id)}
//             >
//               <h3 className="font-semibold text-lg">{c.name}</h3>
//               <p className="text-sm text-muted-foreground">
//                 Total Runs: {c.totalRuns ?? 0}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 Last Run: {formatDate(c.lastRunTime)}
//               </p>
//             </Card>
//           ))
//         ) : (
//           <p className="text-sm text-muted-foreground">
//             No clients yet. Add one to start.
//           </p>
//         )}
//       </ScrollArea>

//       {/* Add Client Modal */}
//       {showModal && (
//         <Dialog open={showModal} onOpenChange={setShowModal}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Client</DialogTitle>
//             </DialogHeader>

//             <Input
//               placeholder="Client Name"
//               value={newClient.name}
//               onChange={(e) => setNewClient({ name: e.target.value })}
//             />

//             <DialogFooter>
//               <Button
//                 onClick={handleAddClient}
//                 disabled={!newClient.name.trim() || isAdding}
//               >
//                 {isAdding ? "Saving..." : "Save"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from "react";
import { getClients, addClient } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "" });
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Fetch clients
  useEffect(() => {
    getClients().then((res) => {
      if (res.error) toast({ title: "Error", description: res.error });
      else setClients(res);
    });
  }, [toast]);

  // ✅ Add new client
  const handleAddClient = async () => {
    if (!newClient.name.trim()) {
      toast({ title: "Error", description: "Client name is required" });
      return;
    }

    setIsAdding(true);
    const res = await addClient({ name: newClient.name });
    setIsAdding(false);

    if (res.error) {
      toast({ title: "Error", description: res.error });
    } else {
      setClients((prev) => [res, ...prev]);
      toast({ title: "Client added", description: `${res.name} created.` });
      setShowModal(false);
      setNewClient({ name: "" });
    }
  };

  const handleOpenClient = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b flex items-center justify-between px-4 bg-card">
        <h1 className="text-lg font-semibold">
          RCM Medical Coding System - Dashboard
        </h1>
        <Button onClick={() => setShowModal(true)}>+ Add Client</Button>
      </header>

      {/* Client List */}
      <ScrollArea className="p-4 space-y-2 flex-1">
        {clients.length > 0 ? (
          clients.map((c) => (
            <Card
              key={c._id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleOpenClient(c._id)}
            >
              <h3 className="font-semibold text-lg">{c.name}</h3>

              {/* ⭐ Show only Total Charts */}
              <p className="text-sm text-muted-foreground">
                Total Charts: {c.totalCharts ?? 0}
              </p>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No clients yet. Add one to start.
          </p>
        )}
      </ScrollArea>

      {/* Add Client Modal */}
      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Client Name"
              value={newClient.name}
              onChange={(e) => setNewClient({ name: e.target.value })}
            />

            <DialogFooter>
              <Button
                onClick={handleAddClient}
                disabled={!newClient.name.trim() || isAdding}
              >
                {isAdding ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
