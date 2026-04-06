// District Intelligence Center Type Definitions

export interface DPIScore {
  current: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  nationalAvg: number;
  vsNational: number;
}

export interface DistrictMetrics {
  netSalesComp: {
    value: string;
    yoyPercent: number;
  };
  vocSatisfied: {
    value: number;
    change: number;
  };
  seaScore: {
    value: number;
    qoqChange: number;
  };
  salesVsLY: {
    value: number;
  };
  gmBpsVsLY: {
    value: number;
  };
}

export interface StorePerformance {
  id: string;
  storeNumber: string;
  name: string;
  city: string;
  state: string;
  dpi: number;
  sales: string;
  salesValue: number;
  seaScore: number;
  vocScore: number;
  alertCount: number;
  rank?: number;
  yoyGrowth: number;
  momGrowth: number;
  gmPercent: number;
}

export type ExceptionSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ExceptionType = 'compliance' | 'sales' | 'audit' | 'inventory' | 'gm';

export interface StoreException {
  id: string;
  storeNumber: string;
  storeName: string;
  severity: ExceptionSeverity;
  type: ExceptionType;
  title: string;
  description: string;
  impact?: string;
  daysOverdue?: number;
}

export interface VoCIssue {
  category: string;
  percentage: number;
  affectedStores: string[];
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export interface VoCDistribution {
  satisfied: number;
  neutral: number;
  dissatisfied: number;
  topIssues: VoCIssue[];
}

export interface TriageIssue {
  type: 'voc' | 'sales' | 'sea';
  title: string;
  affectedStores: string[];
  trend: string;
  details: string;
  category?: string;
}

export interface BroadcastSummary {
  active: number;
  scheduled: number;
  pendingAcknowledgements: number;
  latest?: {
    title: string;
    unacknowledgedStores: number;
  };
}

export interface POGCluster {
  id: string;
  name: string;
  type: 'High Volume Urban' | 'Suburban Standard' | 'Low Volume Rural';
  storeCount: number;
  avgDPI: number;
  stores: string[];
}

export interface DistrictContext {
  districtNumber: string;
  districtName: string;
  state: string;
  period: string;
  lastUpdated: Date;
}

export interface DistrictIntelligence {
  context: DistrictContext;
  dpi: DPIScore;
  narrative: string;
  unreadBroadcasts: number;
  metrics: DistrictMetrics;
  exceptions: StoreException[];
  topStores: StorePerformance[];
  strugglingStores: StorePerformance[];
  allStores: StorePerformance[];
  vocDistribution: VoCDistribution;
  triageIssues: TriageIssue[];
  broadcastSummary: BroadcastSummary;
  clusters: POGCluster[];
}

// Chart data types
export interface Sales2x2Point {
  storeNumber: string;
  storeName: string;
  x: number; // Sales performance
  y: number; // Growth rate
  size: number; // Store size/volume
  quadrant: 'growth-engines' | 'critical' | 'struggling' | 'stable';
}

export interface SEARiskPoint {
  storeNumber: string;
  storeName: string;
  riskLevel: 'chronic' | 'one-time-dip' | 'strong' | 'moderate';
  seaScore: number;
  failureCount: number;
}
