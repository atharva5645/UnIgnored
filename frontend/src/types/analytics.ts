// src/types/analytics.ts
export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  count: number;
  resolved: number;
}

export interface WardPerformance {
  wardId: string;
  wardName: string;
  totalComplaints: number;
  resolvedComplaints: number;
  resolutionRate: number;
  avgResolutionTime: number; // in days
  activeOfficers: number;
  satisfactionScore: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number; // 0 to 1
  category: string;
}

export interface SystemStats {
  totalComplaints: number;
  activeComplaints: number;
  resolvedToday: number;
  resolvedThisWeek: number;
  activeOfficers: number;
  citizenSatisfaction: number;
  avgSlaCompliance: number;
  rewardPointsDistributed: number;
}

export interface AnomalyAlert {
  id: string;
  type: 'spike' | 'delay' | 'resource_shortage';
  message: string;
  severity: 'low' | 'medium' | 'high';
  wardId?: string;
  category?: string;
  timestamp: string;
}
