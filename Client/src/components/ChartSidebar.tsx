// import { FileText, RefreshCw } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   TooltipProvider,
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";

// export default function ChartSidebar({
//   charts = [],
//   selectedChartId,
//   selectedChartIds = [],
//   onSelectChart,
//   onToggleChartSelection,
//   onSelectAllCharts,
//   onRerunAllCharts,   // ✅ new prop
// }) {
//   const allSelected =
//     charts.length > 0 && charts.every((chart) => selectedChartIds.includes(chart.id));

//   return (
//     <TooltipProvider>
//       <div className="h-full flex flex-col bg-white border-r overflow-hidden">
        
//         {/* Header */}
//         <div className="flex items-center justify-between bg-indigo-50 border-b p-2 pr-3">
//           <h2 className="text-sm font-semibold text-indigo-800 tracking-wide">
//             Charts
//           </h2>

//           {onRerunAllCharts && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-7 px-2 flex items-center gap-1 text-xs"
//               onClick={onRerunAllCharts}
//             >
//               <RefreshCw className="w-3 h-3" />
//               Rerun
//             </Button>
//           )}
//         </div>

//         {/* Select All */}
//         <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
//           <Checkbox
//             checked={allSelected}
//             onCheckedChange={(checked) => onSelectAllCharts?.(!!checked)}
//           />
//           <span className="text-sm text-gray-700">Select All</span>
//         </div>

//         {/* Chart List */}
//         <div className="flex-1 overflow-y-auto">
//           {charts.length === 0 ? (
//             <p className="text-sm text-gray-500 p-4">No charts found.</p>
//           ) : (
//             charts.map((chart) => {
//               const isSelected = selectedChartIds.includes(chart.id);
//               const uploadDate = chart.createdAt
//                 ? new Date(chart.createdAt).toLocaleString()
//                 : "";

//               return (
//                 <div
//                   key={chart.id}
//                   className={cn(
//                     "px-3 py-2 flex items-start gap-2 border-b cursor-pointer transition-all hover:bg-indigo-50",
//                     selectedChartId === chart.id &&
//                       "bg-indigo-50 border-l-2 border-indigo-500"
//                   )}
//                   onClick={() => onSelectChart?.(chart.id)}
//                 >
//                   <Checkbox
//                     checked={isSelected}
//                     onCheckedChange={() => onToggleChartSelection?.(chart.id)}
//                     onClick={(e) => e.stopPropagation()}
//                     className="mt-0.5"
//                   />

//                   <div className="flex-1 flex flex-col items-start gap-1">
//                     <div className="flex items-center gap-2">
//                       <FileText className="w-4 h-4 text-gray-500" />
//                       <span className="text-sm font-medium text-gray-800 truncate">
//                         {chart.name}
//                       </span>
//                     </div>
//                     {uploadDate && (
//                       <span className="text-xs text-gray-500 truncate">
//                         {uploadDate}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }


// import { useState } from "react";
// import { FileText, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   TooltipProvider,
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";

// export default function ChartSidebar({
//   charts = [],
//   selectedChartId,
//   selectedChartIds = [],
//   onSelectChart,
//   onToggleChartSelection,
//   onSelectAllCharts,
//   onRerunAllCharts,
// }) {
//   const [collapsed, setCollapsed] = useState(false);

//   const allSelected =
//     charts.length > 0 && charts.every((chart) => selectedChartIds.includes(chart.id));

//   return (
//     <TooltipProvider>
//       <div
//         className={cn(
//           "h-full flex flex-col bg-white border-r transition-all duration-300 ease-in-out relative",
//           collapsed ? "w-12" : "w-full"
//         )}
//       >
//         {/* ⭐ Collapse button on left side, not overlapping anything */}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="
//             absolute left-2 top-2
//             w-6 h-6 rounded-md bg-white border border-gray-300 shadow-sm
//             flex items-center justify-center hover:bg-gray-100 z-10
//           "
//         >
//           {collapsed ? (
//             <ChevronRight className="h-4 w-4 text-gray-600" />
//           ) : (
//             <ChevronLeft className="h-4 w-4 text-gray-600" />
//           )}
//         </button>

//         {/* Collapsed View */}
//         {collapsed && (
//           <div className="flex flex-col items-center justify-center pt-12">
//             <FileText className="w-5 h-5 text-gray-600 mb-2" />
//             <div className="-rotate-90 font-semibold text-xs text-gray-600">
//               Charts
//             </div>
//           </div>
//         )}

//         {/* Expanded View */}
//         {!collapsed && (
//           <>
//             {/* Header */}
//             <div className="flex items-center justify-between bg-indigo-50 border-b p-2 pr-3 pl-10">
//               {/* pl-10 ensures space so collapse button doesn't overlap text */}
//               <h2 className="text-sm font-semibold text-indigo-800 tracking-wide">
//                 Charts
//               </h2>

//               {onRerunAllCharts && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-7 px-2 flex items-center gap-1 text-xs"
//                   onClick={onRerunAllCharts}
//                 >
//                   <RefreshCw className="w-3 h-3" />
//                   Rerun
//                 </Button>
//               )}
//             </div>

//             {/* Select All */}
//             <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
//               <Checkbox
//                 checked={allSelected}
//                 onCheckedChange={(checked) => onSelectAllCharts?.(!!checked)}
//               />
//               <span className="text-sm text-gray-700">Select All</span>
//             </div>

//             {/* Chart List */}
//             <div className="flex-1 overflow-y-auto">
//               {charts.length === 0 ? (
//                 <p className="text-sm text-gray-500 p-4">No charts found.</p>
//               ) : (
//                 charts.map((chart) => {
//                   const isSelected = selectedChartIds.includes(chart.id);
//                   const uploadDate = chart.createdAt
//                     ? new Date(chart.createdAt).toLocaleString()
//                     : "";

//                   return (
//                     <div
//                       key={chart.id}
//                       className={cn(
//                         "px-3 py-2 flex items-start gap-2 border-b cursor-pointer transition-all hover:bg-indigo-50",
//                         selectedChartId === chart.id &&
//                           "bg-indigo-50 border-l-2 border-indigo-500"
//                       )}
//                       onClick={() => onSelectChart?.(chart.id)}
//                     >
//                       <Checkbox
//                         checked={isSelected}
//                         onCheckedChange={() => onToggleChartSelection?.(chart.id)}
//                         onClick={(e) => e.stopPropagation()}
//                         className="mt-0.5"
//                       />

//                       <div className="flex-1 flex flex-col items-start gap-1">
//                         <div className="flex items-center gap-2">
//                           <FileText className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm font-medium text-gray-800 truncate">
//                             {chart.name}
//                           </span>
//                         </div>

//                         {uploadDate && (
//                           <span className="text-xs text-gray-500 truncate">
//                             {uploadDate}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </TooltipProvider>
//   );
// }



// import { FileText, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   TooltipProvider,
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";

// export default function ChartSidebar({
//   charts = [],
//   selectedChartId,
//   selectedChartIds = [],
//   onSelectChart,
//   onToggleChartSelection,
//   onSelectAllCharts,
//   onRerunAllCharts,
//   onCollapseToggle,
//   collapsed = false,
// }) {
//   const allSelected =
//     charts.length > 0 && charts.every((chart) => selectedChartIds.includes(chart.id));

//   return (
//     <TooltipProvider>
//       <div
//         className={cn(
//           "h-full flex flex-col bg-white border-r overflow-hidden transition-all",
//           collapsed ? "w-full px-1" : "w-full"
//         )}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between bg-indigo-50 border-b p-2 pr-3">
//           <div className="flex items-center gap-2">
//             <h2 className="text-sm font-semibold text-indigo-800 tracking-wide">
//               {!collapsed && "Charts"}
//             </h2>
//           </div>

//           <div className="flex items-center gap-1">
//             {/* Rerun Button */}
//             {onRerunAllCharts && !collapsed && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-7 px-2 text-xs"
//                 onClick={onRerunAllCharts}
//               >
//                 <RefreshCw className="w-3 h-3" />
//                 Run
//               </Button>
//             )}

//             {/* Collapse Toggle Button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-7 px-2"
//               onClick={() => onCollapseToggle?.(!collapsed)}
//             >
//               {collapsed ? (
//                 <ChevronRight className="w-4 h-4" />
//               ) : (
//                 <ChevronLeft className="w-4 h-4" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Select All */}
//         {!collapsed && (
//           <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
//             <Checkbox
//               checked={allSelected}
//               onCheckedChange={(checked) => onSelectAllCharts?.(!!checked)}
//             />
//             <span className="text-sm text-gray-700">Select All</span>
//           </div>
//         )}

//         {/* Chart List */}
//         <div className={cn("flex-1 overflow-y-auto", collapsed && "py-2")}>
//           {charts.length === 0 ? (
//             !collapsed && <p className="text-sm text-gray-500 p-4">No charts found.</p>
//           ) : (
//             charts.map((chart) => {
//               const isSelected = selectedChartIds.includes(chart.id);
//               const uploadDate = chart.createdAt
//                 ? new Date(chart.createdAt).toLocaleString()
//                 : "";

//               return (
//                 <div
//                   key={chart.id}
//                   className={cn(
//                     "px-3 py-2 flex items-center gap-2 border-b cursor-pointer transition-all hover:bg-indigo-50",
//                     selectedChartId === chart.id &&
//                       "bg-indigo-50 border-l-2 border-indigo-500",
//                     collapsed && "px-1 justify-center"
//                   )}
//                   onClick={() => onSelectChart?.(chart.id)}
//                 >
//                   {/* Checkbox */}
//                   {!collapsed && (
//                     <Checkbox
//                       checked={isSelected}
//                       onCheckedChange={() => onToggleChartSelection?.(chart.id)}
//                       onClick={(e) => e.stopPropagation()}
//                       className="mt-0.5"
//                     />
//                   )}

//                   {/* Info */}
//                   <div className={cn("flex-1 flex flex-col", collapsed && "hidden")}>
//                     <div className="flex items-center gap-2">
//                       <FileText className="w-4 h-4 text-gray-500" />
//                       <span className="text-sm font-medium text-gray-800 truncate">
//                         {chart.name}
//                       </span>
//                     </div>
//                     {uploadDate && (
//                       <span className="text-xs text-gray-500 truncate">
//                         {uploadDate}
//                       </span>
//                     )}
//                   </div>

//                   {/* Mini icon when collapsed */}
//                   {collapsed && (
//                     <FileText className="w-5 h-5 text-gray-600" />
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }


// src/components/ChartSidebar.tsx
import { FileText, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function ChartSidebar({
  charts = [],
  selectedChartId,
  selectedChartIds = [],
  onSelectChart,
  onToggleChartSelection,
  onSelectAllCharts,
  onRunCharts,        // 🔥 added
  onCollapseToggle,
  collapsed = false,
}) {
  const allSelected =
    charts.length > 0 && charts.every((chart) => selectedChartIds.includes(chart.id));

  return (
    <TooltipProvider>
      <div
        className={cn(
          "h-full flex flex-col bg-white border-r overflow-hidden transition-all",
          collapsed ? "w-full px-1" : "w-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-indigo-50 border-b p-2 pr-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-indigo-800 tracking-wide">
              {!collapsed && "Charts"}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {/* Run Button */}
            {onRunCharts && !collapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onRunCharts()}
              >
                <RefreshCw className="w-3 h-3" />
                Run
              </Button>
            )}

            {/* Collapse Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => onCollapseToggle?.(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Select All */}
        {!collapsed && (
          <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => onSelectAllCharts?.(!!checked)}
            />
            <span className="text-sm text-gray-700">Select All</span>
          </div>
        )}

        {/* Chart List */}
        <div className={cn("flex-1 overflow-y-auto", collapsed && "py-2")}>
          {charts.length === 0 ? (
            !collapsed && <p className="text-sm text-gray-500 p-4">No charts found.</p>
          ) : (
            charts.map((chart) => {
              const isSelected = selectedChartIds.includes(chart.id);
              const uploadDate = chart.createdAt
                ? new Date(chart.createdAt).toLocaleString()
                : "";

              return (
                <div
                  key={chart.id}
                  className={cn(
                    "px-3 py-2 flex items-center gap-2 border-b cursor-pointer transition-all hover:bg-indigo-50",
                    selectedChartId === chart.id &&
                      "bg-indigo-50 border-l-2 border-indigo-500",
                    collapsed && "px-1 justify-center"
                  )}
                  onClick={() => onSelectChart?.(chart.id)}
                >
                  {/* Checkbox */}
                  {!collapsed && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleChartSelection?.(chart.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5"
                    />
                  )}

                  {/* Info */}
                  <div className={cn("flex-1 flex flex-col", collapsed && "hidden")}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {chart.name}
                      </span>
                    </div>
                    {uploadDate && (
                      <span className="text-xs text-gray-500 truncate">
                        {uploadDate}
                      </span>
                    )}
                  </div>

                  {/* Mini icon when collapsed */}
                  {collapsed && (
                    <FileText className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
