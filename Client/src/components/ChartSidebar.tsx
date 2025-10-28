import { Chart } from "@/types/chart";
import { FileText, Filter, Upload, RefreshCw, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartSidebarProps {
  charts: Chart[];
  selectedChartId: string | null;
  onSelectChart: (chartId: string) => void;
  filterStatus: "all" | "approved" | "unapproved";
  onFilterChange: (value: "all" | "approved" | "unapproved") => void;
  onImportCharts?: () => void;
  onRunAllCharts?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  selectedChartIds?: string[];
  onToggleChartSelection?: (chartId: string) => void;
  onSelectAllCharts?: (selected: boolean) => void;
}

export const ChartSidebar = ({ charts, selectedChartId, onSelectChart, filterStatus, onFilterChange, onImportCharts, onRunAllCharts, isCollapsed, onToggleCollapse, selectedChartIds = [], onToggleChartSelection, onSelectAllCharts }: ChartSidebarProps) => {
  const allSelected = charts.length > 0 && charts.every(chart => selectedChartIds.includes(chart.id));
  const someSelected = selectedChartIds.length > 0 && !allSelected;

  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-3 border-b border-sidebar-border space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wider">
            Charts
          </h2>
          <div className="flex items-center gap-1">
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-7 px-1.5"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
            )}
            {onRunAllCharts && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRunAllCharts}
                className="h-7 px-1.5"
                title="Run All Charts"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            )}
            {onImportCharts && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onImportCharts}
                className="h-7 px-1.5"
                title="Import Charts"
              >
                <Upload className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="h-8 text-sm bg-sidebar">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Charts</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="unapproved">Unapproved</SelectItem>
          </SelectContent>
        </Select>
        {onSelectAllCharts && (
          <div className="flex items-center gap-2 px-1">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => onSelectAllCharts(!!checked)}
              className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
            />
            <span className="text-sm text-sidebar-foreground">Select All</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {charts.map((chart) => (
          <div
            key={chart.id}
            className={cn(
              "w-full text-left px-3 py-2 flex items-start gap-2 border-b border-sidebar-border transition-colors hover:bg-sidebar-accent",
              selectedChartId === chart.id && "bg-sidebar-accent border-l-2 border-l-primary"
            )}
          >
            {onToggleChartSelection && (
              <Checkbox
                checked={selectedChartIds.includes(chart.id)}
                onCheckedChange={() => onToggleChartSelection(chart.id)}
                className="mt-0.5"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <button
              onClick={() => onSelectChart(chart.id)}
              className="flex-1 flex items-start gap-2 text-left"
            >
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-medium text-sidebar-foreground truncate">
                    {chart.name}
                  </div>
                  <Badge 
                    variant={chart.approved ? "default" : "secondary"} 
                    className="text-xs h-5 px-2 shrink-0"
                  >
                    {chart.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {chart.patientName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {chart.date}
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
