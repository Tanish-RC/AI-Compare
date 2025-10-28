// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { mockRuns, mockClients } from "@/data/mockRunsData";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Card } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Play, Plus, Search, Upload } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import JSZip from "jszip";
// import MultiFileUpload from "@/components/MultiFileUpload.jsx";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [runs, setRuns] = useState(mockRuns);
//   const [results, setResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedClient, setSelectedClient] = useState<string>("");
//   const [newClientName, setNewClientName] = useState<string>("");
//   const [runMode, setRunMode] = useState<"new" | "append">("new");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [progress, setProgress] = useState({ current: 0, total: 0 });
//   const [chartsImported, setChartsImported] = useState(false);

//   const filteredClients = mockClients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()));

//   const handleRunClick = (runId: string) => {
//     navigate(`/run/${runId}`);
//   };

//   function handleImportCharts() {

//   }

//   const handleClientClick = (clientId: string) => {
//     const clientRuns = runs.filter((run) => mockClients.find((c) => c.id === clientId)?.name === run.clientName);
//     if (clientRuns.length > 0) {
//       navigate(`/run/${clientRuns[0].id}`);
//     }
//   };

//   const handleNewRun = () => {
//     if (runMode === "new") {
//       if (!newClientName.trim()) {
//         toast({
//           title: "Enter client name",
//           description: "Please enter a client name to start a new run",
//           variant: "destructive",
//         });
//         return;
//       }
//     } else {
//       if (!selectedClient) {
//         toast({
//           title: "Select a client",
//           description: "Please select a client to append charts",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     if (!chartsImported) {
//       toast({
//         title: "Import charts",
//         description: "Please import charts before starting the run",
//         variant: "destructive",
//       });


//       return;
//     }

//     setIsProcessing(true);
//     const totalCharts = Math.floor(Math.random() * 50) + 10;
//     setProgress({ current: 0, total: totalCharts });

//     // Simulate processing
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev.current >= prev.total) {
//           clearInterval(interval);
//           setIsProcessing(false);

//           const clientName =
//             runMode === "new" ? newClientName : mockClients.find((c) => c.id === selectedClient)?.name || "";

//           const newRun = {
//             id: `run_${Date.now()}`,
//             clientName,
//             dateTime: new Date().toISOString(),
//             totalCharts,
//             processedCharts: totalCharts,
//             status: "completed" as const,
//           };

//           setRuns((prev) => [newRun, ...prev]);

//           toast({
//             title: runMode === "new" ? "Run completed" : "Charts appended",
//             description: `Successfully processed ${totalCharts} charts`,
//           });

//           setNewClientName("");
//           setSelectedClient("");
//           setChartsImported(false);
//           // navigate(`/run/${newRun.id}`);
//           const latestRunId = localStorage.getItem("latest_run_id");
//           if (latestRunId) {
//             navigate(`/run/${latestRunId}`);
//           } else {
//             navigate(`/run/${newRun.id}`);
//           }

//           return prev;
//         }
//         return { ...prev, current: prev.current + 1 };
//       });
//     }, 200);
//   };

//   const formatDateTime = (dateTime: string) => {
//     const date = new Date(dateTime);
//     return {
//       date: date.toLocaleDateString(),
//       time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     };
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-500/10 text-green-500";
//       case "processing":
//         return "bg-blue-500/10 text-blue-500";
//       case "pending":
//         return "bg-yellow-500/10 text-yellow-500";
//       default:
//         return "bg-muted text-muted-foreground";
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       <header className="h-12 border-b border-border bg-card flex items-center px-4">
//         <h1 className="text-lg font-semibold text-card-foreground">RCM Medical Coding System - Dashboard</h1>
//       </header>

//       <div className="flex-1 flex overflow-hidden">
//         {/* Left Section - Quick Access */}
//         <div className="w-2/5 border-r border-border flex flex-col">
//           <div className="p-4 border-b border-border">
//             <h2 className="text-lg font-semibold text-card-foreground">Quick Access</h2>
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
//               {filteredClients.map((client) => {
//                 const { date, time } = formatDateTime(client.lastRunDate);
//                 return (
//                   <Card
//                     key={client.id}
//                     className="p-4 cursor-pointer hover:bg-accent transition-colors"
//                     onClick={() => handleClientClick(client.id)}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h3 className="font-semibold text-card-foreground">{client.name}</h3>
//                         <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
//                           <span>{client.totalRuns} runs</span>
//                           <span>Last: {date}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </Card>
//                 );
//               })}
//             </div>
//           </ScrollArea>
//         </div>

//         <MultiFileUpload results={results} setResults={setResults} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MultiFileUpload from "@/components/MultiFileUpload.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ Persistent state for clients & runs
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : [];
  });

  const [runs, setRuns] = useState(() => {
    const saved = localStorage.getItem("runs");
    return saved ? JSON.parse(saved) : [];
  });

  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Automatically create new client + run when new analysis completes
  useEffect(() => {
    if (results.length === 0) return;

    const runId = Date.now().toString();
    const clientId = `client_${runId}`;
    const clientName = `Client_${new Date().toLocaleString()}`;

    // Save LLM results in localStorage
    localStorage.setItem(`llm_results_${runId}`, JSON.stringify(results));
    localStorage.setItem("latest_run_id", runId);

    // Create new run
    const newRun = {
      id: runId,
      clientName,
      dateTime: new Date().toISOString(),
      totalCharts: results.length,
      processedCharts: results.length,
      status: "completed" as const,
    };

    // Create new client
    const newClient = {
      id: clientId,
      name: clientName,
      totalRuns: 1,
      lastRunDate: new Date().toISOString(),
    };

    // Update localStorage for runs and clients
    const updatedRuns = [newRun, ...runs];
    const updatedClients = [newClient, ...clients];

    setRuns(updatedRuns);
    setClients(updatedClients);

    localStorage.setItem("runs", JSON.stringify(updatedRuns));
    localStorage.setItem("clients", JSON.stringify(updatedClients));

    toast({
      title: "Charts processed",
      description: `A new client "${clientName}" has been created automatically.`,
    });
  }, [results]);

  // ✅ Filter clients by search
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Handle click → navigate to run page
  const handleClientClick = (clientName: string) => {
    const clientRun = runs.find((run) => run.clientName === clientName);
    if (clientRun) navigate(`/run/${clientRun.id}`);
  };

  // ✅ Format last run date
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b border-border bg-card flex items-center px-4">
        <h1 className="text-lg font-semibold text-card-foreground">
          RCM Medical Coding System - Dashboard
        </h1>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Client List */}
        <div className="w-2/5 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">
              Clients
            </h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const { date } = formatDateTime(client.lastRunDate);
                  return (
                    <Card
                      key={client.id}
                      className="p-4 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleClientClick(client.name)}
                    >
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {client.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{client.totalRuns} run</span>
                          <span>Last: {date}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground px-4">
                  No clients yet. Upload files to start.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right: MultiFileUpload */}
        <MultiFileUpload results={results} setResults={setResults} />
      </div>
    </div>
  );
};

export default Dashboard;
