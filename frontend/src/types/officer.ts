// src/types/officer.ts
export interface OfficerPerformance {
  totalAssigned: number;
  totalResolved: number;
  avgResolutionTime: number; // hours
  onTimeRate: number; // percentage
  satisfactionScore: number; // 0-5
  escalationRate: number; // percentage
  currentWorkload: number; // percentage of capacity
}

export interface Officer {
  id: string;
  name: string;
  badge: string;
  department: string;
  wardId: string;
  wardName: string;
  avatar?: string;
  status: 'on_duty' | 'off_duty' | 'on_break';
  lastActive: string;
  location?: { lat: number; lng: number };
  metrics: OfficerPerformance;
}

export interface Ward {
  id: string;
  name: string;
  bounds: [number, number][]; // Polygon bounds
  totalComplaints: number;
  resolvedComplaints: number;
  slaComplianceRate: number;
  population: number;
  officerCount: number;
}
