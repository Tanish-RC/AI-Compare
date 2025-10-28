import { Run, Client } from "@/types/run";

export const mockRuns: Run[] = [
  {
    id: "run_001",
    clientName: "General Hospital",
    dateTime: "2024-01-15T14:30:00",
    totalCharts: 50,
    processedCharts: 50,
    status: "completed",
  },
  {
    id: "run_002",
    clientName: "City Medical Center",
    dateTime: "2024-01-16T09:15:00",
    totalCharts: 35,
    processedCharts: 35,
    status: "completed",
  },
  {
    id: "run_003",
    clientName: "Regional Clinic",
    dateTime: "2024-01-17T11:00:00",
    totalCharts: 42,
    processedCharts: 42,
    status: "completed",
  },
  {
    id: "run_004",
    clientName: "General Hospital",
    dateTime: "2024-01-18T16:45:00",
    totalCharts: 28,
    processedCharts: 28,
    status: "completed",
  },
  {
    id: "run_005",
    clientName: "Metro Health",
    dateTime: "2024-01-19T10:30:00",
    totalCharts: 60,
    processedCharts: 45,
    status: "processing",
  },
];

export const mockClients: Client[] = [
  {
    id: "client_001",
    name: "General Hospital",
    totalRuns: 12,
    lastRunDate: "2024-01-18T16:45:00",
  },
  {
    id: "client_002",
    name: "City Medical Center",
    totalRuns: 8,
    lastRunDate: "2024-01-16T09:15:00",
  },
  {
    id: "client_003",
    name: "Regional Clinic",
    totalRuns: 5,
    lastRunDate: "2024-01-17T11:00:00",
  },
  {
    id: "client_004",
    name: "Metro Health",
    totalRuns: 15,
    lastRunDate: "2024-01-19T10:30:00",
  },
  {
    id: "client_005",
    name: "Downtown Urgent Care",
    totalRuns: 3,
    lastRunDate: "2024-01-10T13:20:00",
  },
];
