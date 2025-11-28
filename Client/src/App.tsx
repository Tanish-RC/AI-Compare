// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// //abc

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/run/:runId" element={<Index />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import ClientCharts from "./pages/ClientCharts"; // ✅ added this line
import NotFound from "./pages/NotFound";
import AllCharts from "./pages/AllCharts";
import RunsPage from "./pages/RunsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>          
          <Route path="/" element={<Dashboard />} />
          <Route path="/client/:clientId/runs" element={<RunsPage />} />
          <Route path="/client/:clientId" element={<ClientCharts />} />
          <Route path="/client/:clientId/chart/:chartId" element={<Index />} />
          <Route path="/run/:runId" element={<Index />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/client/:clientId/charts" element={<AllCharts />} />

          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
