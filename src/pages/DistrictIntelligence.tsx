import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  AlertCircle,
  Store,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Clock,
  Calendar,
  RefreshCw,
  Search,
  Bell,
  Download,
  MapPin,
  Megaphone,
  Sparkles,
  X,
  Send,
  Package,
  MessageSquare,
  ExternalLink,
  Users,
  Check,
  DollarSign,
  Heart,
  ClipboardCheck,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  FileText,
  Zap,
  ArrowRight,
  Bot,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DistrictIntelligence.css';

// Types
interface StoreData {
  id: string;
  rank: number;
  storeNumber: string;
  storeName: string;
  dpi: number;
  dpiTier: 'Excellence' | 'Stable' | 'AtRisk' | 'Crisis';
  netSales: number;
  netSalesVar: number;
  seaScore: number;
  vocSatisfied: number;
  topVocIssue: string;
  topSeaIssue: string;
  trend: 'up' | 'down' | 'flat';
  status: 'critical' | 'warning' | 'stable' | 'excellent';
}

type DistrictTier = 'Excellence' | 'Stable' | 'AtRisk' | 'Crisis';
type MomentumType = 'Improving' | 'Slipping' | 'Flat';


// Mock Data
const mockStores: StoreData[] = [
  { id: '1', rank: 1, storeNumber: '2034', storeName: 'Downtown Plaza', dpi: 94, dpiTier: 'Excellence', netSales: 245000, netSalesVar: 8.2, seaScore: 96, vocSatisfied: 92, topVocIssue: 'Wait times', topSeaIssue: '-', trend: 'up', status: 'excellent' },
  { id: '2', rank: 2, storeNumber: '1876', storeName: 'Riverside Mall', dpi: 91, dpiTier: 'Excellence', netSales: 198000, netSalesVar: 5.4, seaScore: 94, vocSatisfied: 89, topVocIssue: 'Product availability', topSeaIssue: '-', trend: 'up', status: 'excellent' },
  { id: '3', rank: 3, storeNumber: '3421', storeName: 'Central Station', dpi: 85, dpiTier: 'Stable', netSales: 176000, netSalesVar: 2.1, seaScore: 88, vocSatisfied: 85, topVocIssue: 'Staff friendliness', topSeaIssue: 'Signage', trend: 'flat', status: 'stable' },
  { id: '4', rank: 4, storeNumber: '2198', storeName: 'Westfield Center', dpi: 82, dpiTier: 'Stable', netSales: 165000, netSalesVar: -1.2, seaScore: 85, vocSatisfied: 82, topVocIssue: 'Checkout speed', topSeaIssue: 'Planogram', trend: 'down', status: 'stable' },
  { id: '5', rank: 5, storeNumber: '4532', storeName: 'Harbor View', dpi: 78, dpiTier: 'Stable', netSales: 142000, netSalesVar: -3.5, seaScore: 82, vocSatisfied: 78, topVocIssue: 'Product quality', topSeaIssue: 'Cleanliness', trend: 'down', status: 'warning' },
  { id: '6', rank: 6, storeNumber: '1234', storeName: 'Oak Street', dpi: 72, dpiTier: 'AtRisk', netSales: 128000, netSalesVar: -6.8, seaScore: 75, vocSatisfied: 71, topVocIssue: 'Staff availability', topSeaIssue: 'Planogram', trend: 'down', status: 'warning' },
  { id: '7', rank: 7, storeNumber: '5678', storeName: 'Pine Grove', dpi: 65, dpiTier: 'AtRisk', netSales: 112000, netSalesVar: -9.2, seaScore: 68, vocSatisfied: 65, topVocIssue: 'Long queues', topSeaIssue: 'Safety', trend: 'down', status: 'critical' },
  { id: '8', rank: 8, storeNumber: '9012', storeName: 'Maple Heights', dpi: 58, dpiTier: 'Crisis', netSales: 95000, netSalesVar: -12.4, seaScore: 62, vocSatisfied: 58, topVocIssue: 'Overall experience', topSeaIssue: 'Multiple', trend: 'down', status: 'critical' },
];

// Audit Compliance Heatmap Data
const auditCategories = [
  'Planogram',
  'Signage',
  'Cleanliness',
  'Safety',
  'Stock Rotation',
  'Pricing',
  'Backroom',
  'Customer Area',
];

const auditComplianceData: Record<string, Record<string, number>> = {
  '2034': { Planogram: 98, Signage: 95, Cleanliness: 100, Safety: 97, 'Stock Rotation': 92, Pricing: 96, Backroom: 94, 'Customer Area': 99 },
  '1876': { Planogram: 95, Signage: 92, Cleanliness: 96, Safety: 94, 'Stock Rotation': 88, Pricing: 93, Backroom: 90, 'Customer Area': 97 },
  '3421': { Planogram: 82, Signage: 75, Cleanliness: 90, Safety: 88, 'Stock Rotation': 85, Pricing: 87, Backroom: 78, 'Customer Area': 91 },
  '2198': { Planogram: 68, Signage: 85, Cleanliness: 88, Safety: 82, 'Stock Rotation': 79, Pricing: 84, Backroom: 72, 'Customer Area': 86 },
  '4532': { Planogram: 72, Signage: 78, Cleanliness: 65, Safety: 80, 'Stock Rotation': 70, Pricing: 75, Backroom: 68, 'Customer Area': 74 },
  '1234': { Planogram: 55, Signage: 62, Cleanliness: 70, Safety: 58, 'Stock Rotation': 48, Pricing: 65, Backroom: 52, 'Customer Area': 60 },
  '5678': { Planogram: 42, Signage: 50, Cleanliness: 55, Safety: 38, 'Stock Rotation': 35, Pricing: 48, Backroom: 40, 'Customer Area': 45 },
  '9012': { Planogram: 28, Signage: 35, Cleanliness: 40, Safety: 22, 'Stock Rotation': 18, Pricing: 32, Backroom: 25, 'Customer Area': 30 },
};

// District options for HQ role selector
const HQ_DISTRICT_OPTIONS = [
  { id: 'd14', label: 'District 14 — Tennessee', dm: 'John Doe', storeCount: 8, seedOffset: 0 },
  { id: 'd08', label: 'District 08 — Georgia', dm: 'Sarah Kim', storeCount: 6, seedOffset: 1 },
  { id: 'd22', label: 'District 22 — Carolina', dm: 'Marcus Reed', storeCount: 7, seedOffset: 2 },
  { id: 'd11', label: 'District 11 — Florida', dm: 'Lisa Nguyen', storeCount: 9, seedOffset: 3 },
  { id: 'd19', label: 'District 19 — Alabama', dm: 'David Park', storeCount: 5, seedOffset: 4 },
];

// Generate district-varied store data
const DISTRICT_STORE_NAMES: string[][] = [
  ['Downtown Plaza', 'Riverside Mall', 'Central Station', 'Westfield Center', 'Harbor View', 'Oak Street', 'Pine Grove', 'Maple Heights'],
  ['Peachtree Plaza', 'Savannah Square', 'Augusta Mall', 'Athens Center', 'Macon Point', 'Columbus Walk'],
  ['Charlotte Hub', 'Raleigh Court', 'Durham Heights', 'Wilmington Bay', 'Greensboro Lane', 'Asheville Park', 'Chapel Hill'],
  ['Miami Central', 'Orlando Gateway', 'Tampa Bay Mall', 'Jacksonville Hub', 'Fort Lauderdale', 'St. Petersburg', 'Tallahassee', 'Gainesville', 'Naples Point'],
  ['Birmingham Center', 'Huntsville Plaza', 'Montgomery Mall', 'Mobile Bay', 'Tuscaloosa Walk'],
];

const getDistrictStores = (seedOffset: number): StoreData[] => {
  if (seedOffset === 0) return mockStores;
  const names = DISTRICT_STORE_NAMES[seedOffset] || mockStores.map(s => s.storeName);
  const baseDPIs = [94, 91, 85, 82, 78, 72, 65, 58, 70];
  return names.map((name, i) => {
    const shift = ((seedOffset * 7 + i * 3) % 11) - 4;
    const baseDpi = (baseDPIs[i % baseDPIs.length] || 75) + shift;
    const dpi = Math.max(48, Math.min(98, baseDpi));
    const salesBase = [245000, 198000, 176000, 165000, 142000, 128000, 112000, 95000, 135000];
    const salesShift = ((seedOffset * 11 + i * 5) % 20) - 10;
    return {
      id: `${seedOffset}-${i}`,
      rank: i + 1,
      storeNumber: String(1000 + seedOffset * 200 + i * 111),
      storeName: name,
      dpi,
      dpiTier: (dpi >= 90 ? 'Excellence' : dpi >= 75 ? 'Stable' : dpi >= 60 ? 'AtRisk' : 'Crisis') as StoreData['dpiTier'],
      netSales: Math.max(80000, (salesBase[i % salesBase.length] || 120000) + salesShift * 5000),
      netSalesVar: parseFloat(((i < 3 ? 5 : i < 5 ? 0 : -5) + shift * 0.5).toFixed(1)),
      seaScore: Math.max(55, Math.min(98, dpi + ((i * 3 + seedOffset) % 7) - 3)),
      vocSatisfied: Math.max(50, Math.min(95, dpi - 5 + ((i * 2 + seedOffset) % 6))),
      topVocIssue: ['Wait times', 'Product availability', 'Staff friendliness', 'Checkout speed', 'Product quality', 'Staff availability', 'Long queues', 'Overall experience'][i % 8],
      topSeaIssue: i < 2 ? '-' : ['Signage', 'Planogram', 'Cleanliness', 'Safety', 'Stock Rotation', 'Pricing'][i % 6],
      trend: (dpi >= 85 ? 'up' : dpi >= 70 ? 'flat' : 'down') as StoreData['trend'],
      status: (dpi >= 85 ? 'excellent' : dpi >= 70 ? 'stable' : dpi >= 60 ? 'warning' : 'critical') as StoreData['status'],
    };
  });
};

// Generate audit compliance data keyed by store numbers for a district
const getDistrictAuditData = (seedOffset: number): Record<string, Record<string, number>> => {
  if (seedOffset === 0) return auditComplianceData;
  const stores = getDistrictStores(seedOffset);
  const result: Record<string, Record<string, number>> = {};
  stores.forEach((store, i) => {
    const base = Math.max(30, Math.min(95, store.dpi + ((i * 3 + seedOffset) % 10) - 4));
    const row: Record<string, number> = {};
    auditCategories.forEach((cat, ci) => {
      const variation = ((seedOffset * 7 + i * 5 + ci * 3) % 25) - 12;
      row[cat] = Math.max(15, Math.min(100, base + variation));
    });
    result[store.storeNumber] = row;
  });
  return result;
};

// Generate district-varied metrics
const getDistrictMetrics = (seedOffset: number) => {
  const dpiShifts = [0, -3, -5, -8, -2];
  const s = dpiShifts[seedOffset] || 0;
  return {
    week: { dpi: 87 + s, tier: (87 + s >= 85 ? 'Excellence' : 'Stable') as DistrictTier, rank: 3 + seedOffset, dpiChange: +(2.4 - seedOffset * 0.3).toFixed(1), momentum: (s >= -2 ? 'Improving' : 'Slipping') as MomentumType, momentumDelta: +(3.2 + s * 0.2).toFixed(1), chainAvg: 79, scoreSales: 92 + s, scoreExecution: 85 + s, scoreVoC: 84 + s },
    month: { dpi: 82 + s, tier: (82 + s >= 85 ? 'Excellence' : 82 + s >= 70 ? 'Stable' : 'AtRisk') as DistrictTier, rank: 5 + seedOffset, dpiChange: +(1.8 - seedOffset * 0.2).toFixed(1), momentum: (s >= -3 ? 'Improving' : 'Flat') as MomentumType, momentumDelta: +(2.1 + s * 0.15).toFixed(1), chainAvg: 79, scoreSales: 86 + s, scoreExecution: 80 + s, scoreVoC: 79 + s },
    quarter: { dpi: 80 + s, tier: (80 + s >= 85 ? 'Excellence' : 80 + s >= 70 ? 'Stable' : 'AtRisk') as DistrictTier, rank: 6 + seedOffset, dpiChange: +(1.2 - seedOffset * 0.15).toFixed(1), momentum: 'Flat' as MomentumType, momentumDelta: +(0.8 + s * 0.1).toFixed(1), chainAvg: 79, scoreSales: 84 + s, scoreExecution: 78 + s, scoreVoC: 77 + s },
  };
};

// Per-district KPI overrides (weekly base values by district)
const DISTRICT_KPI_OVERRIDES: Record<string, Record<string, { primaryValue: string; delta: string; deltaDirection: 'up' | 'down' | 'flat'; microInsight: string; status: 'positive' | 'negative' | 'neutral' | 'warning' }>> = {
  d14: {}, // default — use base districtKPIs
  d08: {
    'sales-performance': { primaryValue: '$982K', delta: '+2.1%', deltaDirection: 'up', microInsight: '4W avg $945K', status: 'positive' },
    'voc-satisfaction': { primaryValue: '78%', delta: '-3.2pts', deltaDirection: 'down', microInsight: 'Top theme: Checkout Speed', status: 'warning' },
    'voc-issue-rate': { primaryValue: '4.2', delta: '+0.9', deltaDirection: 'up', microInsight: '4 of 6 stores affected', status: 'negative' },
    'shelf-audit': { primaryValue: '84%', delta: '-11pts', deltaDirection: 'down', microInsight: '8th week below target', status: 'negative' },
    'oos-rate': { primaryValue: '5.1%', delta: '+1.3pts', deltaDirection: 'up', microInsight: 'Shrinkage driving 45%', status: 'negative' },
    'margin-health': { primaryValue: '33.1%', delta: '-85 bps', deltaDirection: 'down', microInsight: 'Clearance markdown pressure', status: 'negative' },
  },
  d22: {
    'sales-performance': { primaryValue: '$1.08M', delta: '+1.4%', deltaDirection: 'up', microInsight: '4W avg $1.02M', status: 'positive' },
    'voc-satisfaction': { primaryValue: '75%', delta: '-4.8pts', deltaDirection: 'down', microInsight: 'Top theme: Staff Availability', status: 'negative' },
    'voc-issue-rate': { primaryValue: '4.6', delta: '+1.2', deltaDirection: 'up', microInsight: '5 of 7 stores affected', status: 'negative' },
    'shelf-audit': { primaryValue: '81%', delta: '-14pts', deltaDirection: 'down', microInsight: 'Planogram reset overdue', status: 'negative' },
    'oos-rate': { primaryValue: '4.8%', delta: '+1.1pts', deltaDirection: 'up', microInsight: 'Seasonal items drive 55%', status: 'negative' },
    'margin-health': { primaryValue: '33.6%', delta: '-60 bps', deltaDirection: 'down', microInsight: 'Promotional mix impact', status: 'warning' },
  },
  d11: {
    'sales-performance': { primaryValue: '$1.52M', delta: '+5.8%', deltaDirection: 'up', microInsight: '4W avg $1.41M', status: 'positive' },
    'voc-satisfaction': { primaryValue: '71%', delta: '-6.1pts', deltaDirection: 'down', microInsight: 'Top theme: Product Availability', status: 'negative' },
    'voc-issue-rate': { primaryValue: '5.1', delta: '+1.8', deltaDirection: 'up', microInsight: '7 of 9 stores affected', status: 'negative' },
    'shelf-audit': { primaryValue: '76%', delta: '-19pts', deltaDirection: 'down', microInsight: 'Cooler section dragging avg', status: 'negative' },
    'oos-rate': { primaryValue: '6.2%', delta: '+2.4pts', deltaDirection: 'up', microInsight: 'Perishables drive 65%', status: 'negative' },
    'margin-health': { primaryValue: '32.8%', delta: '-110 bps', deltaDirection: 'down', microInsight: 'Spoilage & markdown heavy', status: 'negative' },
  },
  d19: {
    'sales-performance': { primaryValue: '$640K', delta: '+3.6%', deltaDirection: 'up', microInsight: '4W avg $618K', status: 'positive' },
    'voc-satisfaction': { primaryValue: '85%', delta: '+1.2pts', deltaDirection: 'up', microInsight: 'Top theme: Staff Friendliness', status: 'positive' },
    'voc-issue-rate': { primaryValue: '2.4', delta: '-0.3', deltaDirection: 'down', microInsight: '1 of 5 stores affected', status: 'positive' },
    'shelf-audit': { primaryValue: '92%', delta: '-3pts', deltaDirection: 'down', microInsight: 'Near target, minor gaps', status: 'neutral' },
    'oos-rate': { primaryValue: '2.8%', delta: '+0.2pts', deltaDirection: 'up', microInsight: 'Well managed supply', status: 'neutral' },
    'margin-health': { primaryValue: '35.1%', delta: '+15 bps', deltaDirection: 'up', microInsight: 'Efficient ops, low markdown', status: 'positive' },
  },
};

// Per-district triage data
interface TriageItem { id: string; title: string; priority: 'critical' | 'high' | 'medium'; stores: string; metric: string }
const DISTRICT_TRIAGE: Record<string, TriageItem[]> = {
  d14: [
    { id: 'voc-messy', title: 'VoC: Messy Aisles', priority: 'high', stores: 'Hamburg South · Cologne East · Berlin Mitte', metric: '+22% theme spike' },
    { id: 'sea-fire', title: 'SEA Auto-Fail: Fire Exit', priority: 'critical', stores: 'Hamburg South — Display blocking exit', metric: 'Escalated to DM · Pending' },
    { id: 'oos-risk', title: 'Inbound OOS Risk', priority: 'medium', stores: 'Cologne East — 3 SKUs delayed 48h', metric: 'Adaptation pending approval' },
  ],
  d08: [
    { id: 'shrink-spike', title: 'Shrinkage Spike', priority: 'critical', stores: 'Peachtree Plaza · Savannah Square', metric: '+18% vs 4-week avg' },
    { id: 'voc-checkout', title: 'VoC: Checkout Speed', priority: 'high', stores: 'Augusta Mall · Athens Center', metric: '+31% complaint volume' },
    { id: 'labor-gap', title: 'Labor Coverage Gap', priority: 'medium', stores: 'Macon Point — Weekend understaffed', metric: '3 shifts uncovered' },
  ],
  d22: [
    { id: 'compliance-drop', title: 'Planogram Compliance Drop', priority: 'high', stores: 'Charlotte Hub · Durham Heights', metric: 'Below 60% threshold' },
    { id: 'safety-incident', title: 'Safety Incident Reported', priority: 'critical', stores: 'Raleigh Court — Wet floor slip', metric: 'Investigation required' },
    { id: 'stock-expiry', title: 'Stock Expiry Alert', priority: 'medium', stores: 'Wilmington Bay — 28 items near expiry', metric: '48h window to clear' },
  ],
  d11: [
    { id: 'voc-availability', title: 'VoC: Product Availability', priority: 'high', stores: 'Miami Central · Orlando Gateway · Tampa Bay Mall', metric: '+26% theme spike' },
    { id: 'cooler-temp', title: 'Cooler Temp Deviation', priority: 'critical', stores: 'Jacksonville Hub — Dairy cooler at 48°F', metric: 'Maintenance dispatched' },
    { id: 'promo-execution', title: 'Promo Execution Miss', priority: 'medium', stores: 'Fort Lauderdale · St. Petersburg', metric: '4 endcaps incomplete' },
  ],
  d19: [
    { id: 'audit-backlog', title: 'Audit Backlog', priority: 'high', stores: 'Birmingham Center · Huntsville Plaza', metric: '6 audits overdue' },
    { id: 'receiving-delay', title: 'Receiving Dock Delay', priority: 'medium', stores: 'Montgomery Mall — 12h behind schedule', metric: 'Impacts floor replenishment' },
    { id: 'voc-cleanliness', title: 'VoC: Store Cleanliness', priority: 'high', stores: 'Mobile Bay · Tuscaloosa Walk', metric: '+19% negative mentions' },
  ],
};

// Per-district escalation data
const getDistrictEscalations = (seedOffset: number): EscalatedStore[] => {
  if (seedOffset === 0) return escalatedStores;
  const stores = getDistrictStores(seedOffset);
  const worstStores = [...stores].sort((a, b) => a.dpi - b.dpi).slice(0, Math.min(3, stores.length));
  const stages: EscalatedStore['stage'][] = ['critical', 'escalated', 'early-warning'];
  const reasons = [
    'Multiple audit categories below acceptable threshold',
    'Consecutive compliance misses across 2+ weeks',
    'DPI declined for 3 straight weeks',
  ];
  return worstStores.map((s, i) => ({
    storeNumber: s.storeNumber,
    storeName: s.storeName,
    stage: stages[i % 3],
    reason: reasons[i % 3],
    missStreak: 3 - i,
    lastAuditDate: [`2 days ago`, `4 days ago`, `1 day ago`][i % 3],
    dpiImpact: parseFloat((-4.2 + i * 1.1).toFixed(1)),
    categories: [['Safety', 'Planogram'], ['Cleanliness', 'Stock Rotation', 'Backroom'], ['Planogram']][i % 3],
  }));
};

// Per-district broadcast stats
interface DistrictBroadcastData {
  active: number; thisWeek: number; ackRate: string;
  broadcasts: { priority: 'high' | 'medium' | 'low'; title: string; time: string; ack: string }[];
  gap: string; topInsight: string;
}
const DISTRICT_BROADCASTS: Record<string, DistrictBroadcastData> = {
  d14: { active: 3, thisWeek: 12, ackRate: '94%', broadcasts: [
    { priority: 'high', title: 'Safety Protocol Update', time: '2h ago', ack: '8/8 stores acknowledged' },
    { priority: 'medium', title: 'Weekend Staffing Reminder', time: 'Yesterday', ack: '6/8 stores acknowledged' },
    { priority: 'low', title: 'Planogram Refresh Checklist', time: '3d ago', ack: '5/8 stores acknowledged' },
  ], gap: 'Cologne East — 3 pending acks', topInsight: 'Safety broadcasts get 98% ack rate within 2h' },
  d08: { active: 2, thisWeek: 8, ackRate: '88%', broadcasts: [
    { priority: 'high', title: 'Shrinkage Prevention Alert', time: '1h ago', ack: '5/6 stores acknowledged' },
    { priority: 'medium', title: 'Holiday Staffing Plan', time: '4h ago', ack: '4/6 stores acknowledged' },
    { priority: 'low', title: 'New POS Training Schedule', time: '2d ago', ack: '6/6 stores acknowledged' },
  ], gap: 'Macon Point — 2 pending acks', topInsight: 'Training broadcasts get 100% ack within 48h' },
  d22: { active: 4, thisWeek: 15, ackRate: '82%', broadcasts: [
    { priority: 'high', title: 'Wet Floor Safety Reminder', time: '30m ago', ack: '5/7 stores acknowledged' },
    { priority: 'high', title: 'Planogram Reset Deadline', time: '3h ago', ack: '4/7 stores acknowledged' },
    { priority: 'medium', title: 'Stock Rotation Checklist', time: 'Yesterday', ack: '6/7 stores acknowledged' },
  ], gap: 'Chapel Hill — 4 pending acks', topInsight: 'Compliance-related broadcasts have lowest ack rate (78%)' },
  d11: { active: 5, thisWeek: 18, ackRate: '79%', broadcasts: [
    { priority: 'high', title: 'Cooler Maintenance Alert', time: '45m ago', ack: '7/9 stores acknowledged' },
    { priority: 'high', title: 'Promo Execution Deadline', time: '2h ago', ack: '5/9 stores acknowledged' },
    { priority: 'medium', title: 'Product Recall Notice', time: 'Yesterday', ack: '8/9 stores acknowledged' },
  ], gap: 'Naples Point — 5 pending acks', topInsight: 'Recall notices get 89% ack within 1h' },
  d19: { active: 2, thisWeek: 6, ackRate: '91%', broadcasts: [
    { priority: 'high', title: 'Audit Compliance Reminder', time: '1h ago', ack: '4/5 stores acknowledged' },
    { priority: 'medium', title: 'Cleanliness Checklist Update', time: '5h ago', ack: '5/5 stores acknowledged' },
    { priority: 'low', title: 'Monthly Team Meeting', time: '2d ago', ack: '5/5 stores acknowledged' },
  ], gap: 'Birmingham Center — 1 pending ack', topInsight: 'Smaller district shows faster ack rates (avg 45min)' },
};

const getComplianceColor = (value: number): string => {
  if (value >= 90) return '#c6f0d4';
  if (value >= 75) return '#d9f2e0';
  if (value >= 50) return '#fef3c7';
  if (value >= 25) return '#fde2e2';
  return '#fcc';
};

const getComplianceTextColor = (value: number): string => {
  if (value >= 90) return '#15803d';
  if (value >= 75) return '#166534';
  if (value >= 50) return '#92400e';
  if (value >= 25) return '#991b1b';
  return '#7f1d1d';
};

// Dimension → AI Copilot skill mapping
interface DimensionSkillMap {
  dimension: string;
  skill: 'pog' | 'knowledge' | 'actions' | 'analytics';
  logic: string;
}

const dimensionSkillMapping: DimensionSkillMap[] = [
  { dimension: 'Planogram', skill: 'pog', logic: 'Shelf layout and planogram compliance validation' },
  { dimension: 'Signage', skill: 'knowledge', logic: 'Guideline-driven display and signage standards' },
  { dimension: 'Cleanliness', skill: 'actions', logic: 'Execution-focused operational tasks and upkeep' },
  { dimension: 'Safety', skill: 'knowledge', logic: 'SOP-based safety procedures and compliance' },
  { dimension: 'Stock Rotation', skill: 'analytics', logic: 'Data-driven validation of FIFO and inventory aging' },
  { dimension: 'Pricing', skill: 'analytics', logic: 'Price accuracy validation and mismatch detection' },
  { dimension: 'Backroom', skill: 'actions', logic: 'Operational handling and inventory organization tasks' },
  { dimension: 'Customer Area', skill: 'actions', logic: 'Store execution and customer experience improvements' },
  { dimension: 'Avg', skill: 'analytics', logic: 'Aggregated KPI derived from multiple audit dimensions' },
];

const getSkillForDimension = (dimension: string): DimensionSkillMap => {
  return dimensionSkillMapping.find(m => m.dimension === dimension) || dimensionSkillMapping[dimensionSkillMapping.length - 1];
};

// Audit detail findings for clickable heatmap cells
interface AuditCellDetail {
  findings: string[];
  lastAudit: string;
  auditor: string;
  trend: 'improving' | 'declining' | 'stable';
  recommendation: string;
}

// Auto-generated findings for cells without explicit detail data
const auditors = ['Sarah Chen', 'John Martinez', 'Emily Davis', 'James Wilson', 'Maria Lopez'];
const autoFindingsMap: Record<string, string[]> = {
  Planogram: ['Shelf facings not matching authorized planogram', 'Promotional endcap partially set up', 'Category flow disruption in adjacent aisles', 'Missing shelf labels for new SKUs'],
  Signage: ['Price signage outdated on 8+ items', 'Promotional banner not displayed per guidelines', 'Department wayfinding signs misaligned', 'Sale end-date signage still active post-promo'],
  Cleanliness: ['Floor maintenance below standard in aisles 3-5', 'Restroom cleaning log gaps detected', 'Deli counter area needs deep clean', 'Cart corral area debris accumulation'],
  Safety: ['Emergency exit signage needs replacement', 'Fire extinguisher inspection overdue', 'Wet floor protocol not followed during mopping', 'Staff safety training records incomplete'],
  'Stock Rotation': ['FIFO not followed in dairy section', 'Items approaching best-before date on shelf', 'Backstock rotation overdue by 48+ hours', 'Produce freshness check missed'],
  Pricing: ['Shelf price vs POS mismatch on 5 items', 'Clearance tags not updated after markdown', 'Price label missing on new arrivals', 'Multi-buy pricing error on promotional items'],
  Backroom: ['Receiving dock area congestion', 'Inventory count discrepancy in backroom', 'Overstock pallets blocking access paths', 'Returns processing backlog exceeded 72h'],
  'Customer Area': ['Shopping cart availability below 80%', 'Checkout queue exceeded 5-minute wait target', 'Customer service desk unstaffed during peak', 'Store entrance cleanliness needs attention'],
};

const generateAutoDetail = (storeNumber: string, category: string, score: number): AuditCellDetail => {
  const seed = parseInt(storeNumber) + category.length;
  const findings = autoFindingsMap[category] || autoFindingsMap['Planogram'];
  const count = score >= 90 ? 1 : score >= 75 ? 2 : score >= 50 ? 3 : 4;
  const selectedFindings = findings.slice(0, count);
  if (score >= 90) {
    const positiveFindings = [`${category} standards met or exceeded across all audited areas`];
    return {
      findings: positiveFindings,
      lastAudit: `${(seed % 5) + 1} days ago`,
      auditor: auditors[seed % auditors.length],
      trend: 'stable',
      recommendation: `Maintain current ${category.toLowerCase()} protocols. Strong performance.`,
    };
  }
  return {
    findings: selectedFindings,
    lastAudit: `${(seed % 7) + 1} days ago`,
    auditor: auditors[seed % auditors.length],
    trend: score >= 70 ? 'improving' : 'declining',
    recommendation: score >= 50
      ? `Schedule focused ${category.toLowerCase()} improvement review this week.`
      : `Critical: Immediate ${category.toLowerCase()} intervention required. Escalate to regional.`,
  };
};

const auditCellDetails: Record<string, AuditCellDetail> = {
  '9012-Safety': {
    findings: ['Fire extinguisher expired on Floor 2', 'Emergency exit B partially blocked by stock carts', 'Wet floor signs not deployed in produce section', 'First aid kit missing key supplies'],
    lastAudit: '2 days ago',
    auditor: 'Sarah Chen',
    trend: 'declining',
    recommendation: 'Immediate safety review required. Schedule re-audit within 48h.',
  },
  '5678-Safety': {
    findings: ['Emergency lighting non-functional in stockroom', 'Fire exit signage obscured by promotional displays', 'Safety drill not conducted this quarter'],
    lastAudit: '3 days ago',
    auditor: 'John Martinez',
    trend: 'declining',
    recommendation: 'Escalate to Regional Safety Officer. Mandatory corrective action.',
  },
  '1234-Planogram': {
    findings: ['Aisle 3 endcap missing promotional display', 'Beverage cooler facings off by 30%', 'New seasonal planogram not implemented (overdue 5 days)', 'Shelf tags mismatched in dairy section'],
    lastAudit: '1 day ago',
    auditor: 'Emily Davis',
    trend: 'declining',
    recommendation: 'Deploy planogram reset team. Prioritize Aisle 3 and beverage cooler.',
  },
  '4532-Cleanliness': {
    findings: ['Floor sticky residue in checkout zone', 'Restroom cleanliness below standard', 'Deli counter glass not cleaned on schedule'],
    lastAudit: '4 days ago',
    auditor: 'James Wilson',
    trend: 'stable',
    recommendation: 'Increase cleaning frequency during peak hours. Add evening deep-clean shift.',
  },
  '2198-Planogram': {
    findings: ['Promotional endcap partially set up', 'Category adjacency violation in snacks aisle', 'Missing price labels on 12 SKUs'],
    lastAudit: '2 days ago',
    auditor: 'Sarah Chen',
    trend: 'improving',
    recommendation: 'Complete endcap setup. Address price label gaps by end of shift.',
  },
  '1234-Stock Rotation': {
    findings: ['14 items past best-before date on shelf', 'FIFO not followed in dairy cooler', 'Backstock not rotated in 72+ hours', 'Clearance items blocking fresh stock'],
    lastAudit: '1 day ago',
    auditor: 'Emily Davis',
    trend: 'declining',
    recommendation: 'Urgent: Pull expired items immediately. Retrain staff on FIFO protocol.',
  },
  '9012-Stock Rotation': {
    findings: ['23 expired items found across 4 aisles', 'No FIFO practice observed during audit', 'Backroom stock untouched for 5+ days', 'Produce section 40% past prime freshness'],
    lastAudit: '2 days ago',
    auditor: 'John Martinez',
    trend: 'declining',
    recommendation: 'Critical intervention. Full stock rotation audit and staff retraining.',
  },
  '2034-Cleanliness': {
    findings: ['All areas meet or exceed cleanliness standards', 'Restrooms scored 100% on last 3 audits', 'Floor maintenance schedule fully compliant'],
    lastAudit: '1 day ago',
    auditor: 'James Wilson',
    trend: 'stable',
    recommendation: 'Maintain current protocols. Eligible for "Clean Store" recognition.',
  },
};

// Escalation Command Center Data
interface EscalatedStore {
  storeNumber: string;
  storeName: string;
  stage: 'early-warning' | 'escalated' | 'critical';
  reason: string;
  missStreak: number;
  lastAuditDate: string;
  dpiImpact: number;
  categories: string[];
}

const escalatedStores: EscalatedStore[] = [
  { storeNumber: '5678', storeName: 'Pine Grove', stage: 'critical', reason: 'Safety audit failed 3 consecutive weeks', missStreak: 3, lastAuditDate: '2 days ago', dpiImpact: -4.2, categories: ['Safety', 'Planogram'] },
  { storeNumber: '9012', storeName: 'Maple Heights', stage: 'escalated', reason: 'Multiple compliance categories below 40%', missStreak: 2, lastAuditDate: '4 days ago', dpiImpact: -3.1, categories: ['Cleanliness', 'Stock Rotation', 'Backroom'] },
  { storeNumber: '1234', storeName: 'Oak Street', stage: 'early-warning', reason: 'Planogram compliance dropped below 60% this week', missStreak: 1, lastAuditDate: '1 day ago', dpiImpact: -1.5, categories: ['Planogram'] },
];

const escalationRules = [
  { week: 'Week 1', trigger: 'Compliance < 60% in any category', action: 'Early warning flagged', stage: 'early-warning' as const },
  { week: 'Week 2', trigger: 'No improvement or additional miss', action: 'Auto-escalated to DM', stage: 'escalated' as const },
  { week: 'Week 3+', trigger: 'Consecutive misses across categories', action: 'Critical — DM action required', stage: 'critical' as const },
];

// KPI Cards Data
interface DistrictKPI {
  id: string;
  category: 'commercial' | 'customer' | 'execution' | 'profitability' | 'operations';
  label: string;
  primaryValue: string;
  primaryUnit?: string;
  microInsight?: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'flat';
  deltaContext?: string;
  status: 'positive' | 'negative' | 'neutral' | 'warning';
  clickable: boolean;
  trendData?: number[];
  trendInsight?: string;
  panelTitle?: string;
  panelDetails?: { label: string; value: string; status?: string }[];
}

const districtKPIs: DistrictKPI[] = [
  // 1. Commercial (Combined)
  {
    id: 'sales-performance',
    category: 'commercial',
    label: 'Sales Performance',
    primaryValue: '$1.26M',
    primaryUnit: 'MTD',
    microInsight: '4W avg $1.19M',
    delta: '+4.2%',
    deltaDirection: 'up',
    deltaContext: 'vs LY',
    status: 'positive',
    clickable: true,
    trendData: [980, 1020, 1050, 1010, 1080, 1120, 1060, 1100, 1150, 1180, 1200, 1260],
    trendInsight: 'Consistent upward trend. Q4 seasonality effect visible. Rolling 4-week avg: $1.19M.',
    panelTitle: 'Sales $ — 52-Week Trend',
    panelDetails: [
      { label: 'Best Week', value: '$1.32M (Mar 23)', status: 'positive' },
      { label: 'Worst Week', value: '$940K (Jun 23)', status: 'negative' },
      { label: 'Rolling 4W Avg', value: '$1.19M', status: 'neutral' },
      { label: 'YoY Δ', value: '+4.2%', status: 'positive' },
    ]
  },
  // 2. Customer — VoC Satisfaction
  {
    id: 'voc-satisfaction',
    category: 'customer',
    label: 'VoC Satisfaction',
    primaryValue: '82%',
    microInsight: 'Top theme: Messy Aisles',
    delta: '-1.4pts',
    deltaDirection: 'down',
    deltaContext: 'WoW',
    status: 'warning',
    clickable: true,
    trendData: [88, 87, 86, 85, 84, 85, 83, 84, 82, 83, 82, 82],
    trendInsight: 'Gradual decline over 12 weeks. "Messy Aisles" and "Staff Availability" are top negative themes.',
    panelTitle: 'VoC Satisfaction — 52-Week Trend',
    panelDetails: [
      { label: 'Peak', value: '91% (Jul 21)', status: 'positive' },
      { label: 'Low', value: '80% (Jan 5)', status: 'negative' },
      { label: 'Top Theme (↑)', value: 'Messy Aisles (+34%)', status: 'negative' },
      { label: 'Top Theme (↓)', value: 'Checkout Speed (improved)', status: 'positive' },
    ]
  },
  // 2. Customer — VoC Issue Rate
  {
    id: 'voc-issue-rate',
    category: 'customer',
    label: 'VoC Issue Rate',
    primaryValue: '3.8',
    primaryUnit: '/ 100 visits',
    microInsight: '3 of 8 stores affected',
    delta: '+0.6',
    deltaDirection: 'up',
    deltaContext: 'WoW',
    status: 'negative',
    clickable: true,
    trendData: [2.8, 2.9, 3.0, 3.1, 2.9, 3.2, 3.4, 3.2, 3.5, 3.6, 3.4, 3.8],
    trendInsight: 'Spike detected in last 2 weeks. Driven primarily by "Messy Aisles" theme across 3 stores.',
    panelTitle: 'VoC Issue Rate — 52-Week Trend',
    panelDetails: [
      { label: 'Best', value: '2.1 / 100 (Jun 2)', status: 'positive' },
      { label: 'Worst', value: '4.2 / 100 (Feb 2)', status: 'negative' },
      { label: 'Spike Driver', value: 'Messy Aisles (+34%)', status: 'negative' },
      { label: 'Stores Affected', value: '3 of 8', status: 'warning' },
    ]
  },
  // 3. Execution — Shelf Audit Compliance
  {
    id: 'shelf-audit',
    category: 'execution',
    label: 'Shelf Audit Compliance',
    primaryValue: '89%',
    microInsight: '6th week below target',
    delta: '-6pts',
    deltaDirection: 'down',
    deltaContext: 'vs target',
    status: 'warning',
    clickable: true,
    trendData: [92, 93, 91, 90, 92, 91, 89, 90, 88, 89, 90, 89],
    trendInsight: 'Below target for 6 consecutive weeks. Store variance: 78% (Pine Grove) to 97% (Brussels Nord).',
    panelTitle: 'Shelf Audit Compliance — 52-Week Trend',
    panelDetails: [
      { label: 'Target', value: '95%', status: 'neutral' },
      { label: 'Gap', value: '-6pts', status: 'negative' },
      { label: 'Best Store', value: 'Brussels Nord (97%)', status: 'positive' },
      { label: 'Worst Store', value: 'Pine Grove (78%)', status: 'negative' },
    ]
  },
  // 3. Execution — OOS Rate
  {
    id: 'oos-rate',
    category: 'execution',
    label: 'OOS Rate',
    primaryValue: '4.1%',
    microInsight: 'Apparel drives 60%',
    delta: '+0.8pts',
    deltaDirection: 'up',
    deltaContext: 'WoW',
    status: 'negative',
    clickable: true,
    trendData: [3.0, 2.8, 3.1, 3.3, 3.0, 3.2, 3.5, 3.3, 3.6, 3.8, 3.5, 4.1],
    trendInsight: 'Rising trend over 8 weeks. Apparel category driving 60% of OOS. Cologne East shipment delay a key factor.',
    panelTitle: 'OOS Rate — 52-Week Trend',
    panelDetails: [
      { label: 'Best', value: '2.1% (Jun 30)', status: 'positive' },
      { label: 'Worst', value: '4.5% (Feb 23)', status: 'negative' },
      { label: 'Top Category', value: 'Apparel (60% of OOS)', status: 'negative' },
      { label: 'Key Driver', value: 'Cologne East delay', status: 'warning' },
    ]
  },
  // 4. Profitability (Combined)
  {
    id: 'margin-health',
    category: 'profitability',
    label: 'Margin Health',
    primaryValue: '34.2%',
    primaryUnit: 'GM',
    microInsight: 'Apparel markdown pressure',
    delta: '-40 bps',
    deltaDirection: 'down',
    deltaContext: 'vs LY',
    status: 'warning',
    clickable: true,
    trendData: [35.1, 35.0, 34.8, 34.9, 34.6, 34.7, 34.5, 34.4, 34.3, 34.2, 34.3, 34.2],
    trendInsight: 'Margin pressure from increased markdowns in Apparel. Promotional mix shift impacting blended margin.',
    panelTitle: 'Gross Margin — 52-Week Trend',
    panelDetails: [
      { label: 'Peak', value: '36.1% (Aug 4)', status: 'positive' },
      { label: 'Low', value: '33.8% (Jan 12)', status: 'negative' },
      { label: 'Pressure Source', value: 'Apparel markdowns', status: 'negative' },
      { label: 'YoY Δ', value: '-40 bps', status: 'warning' },
    ]
  },
];

// Team members for chat/broadcast (same as Home Screen)
const teamMembers = [
  { id: 'sm1', name: 'Sarah Mitchell', role: 'Store Manager - Hamburg South', avatar: 'SM', status: 'online' },
  { id: 'sm2', name: 'Marcus Chen', role: 'Store Manager - Cologne East', avatar: 'MC', status: 'online' },
  { id: 'sm3', name: 'Lisa Weber', role: 'Store Manager - Berlin Mitte', avatar: 'LW', status: 'away' },
  { id: 'am1', name: 'Thomas Müller', role: 'Area Manager - North', avatar: 'TM', status: 'online' },
  { id: 'am2', name: 'Anna Schmidt', role: 'Area Manager - South', avatar: 'AS', status: 'offline' },
];

// Helper functions
const getDPIColor = (tier: string) => {
  switch (tier) {
    case 'Excellence': return '#10b981';
    case 'Stable': return '#0ea5e9';
    case 'AtRisk': return '#f59e0b';
    case 'Crisis': return '#ef4444';
    default: return '#64748b';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

// Calendar helper functions
const getCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const days: { day: number; trailing: boolean }[] = [];
  
  // Add previous month's trailing days
  if (startDayOfWeek > 0) {
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, trailing: true });
    }
  }
  
  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, trailing: false });
  }
  
  return days;
};

const isDateInCurrentWeek = (date: Date) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
};

const isDateInFuture = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

export const DistrictIntelligence: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isHQ = user?.role === 'HQ' || user?.role === 'ADMIN';
  const [selectedDistrictId, setSelectedDistrictId] = useState('d14');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const selectedDistrictOption = HQ_DISTRICT_OPTIONS.find(d => d.id === selectedDistrictId) || HQ_DISTRICT_OPTIONS[0];
  const activeStores = isHQ ? getDistrictStores(selectedDistrictOption.seedOffset) : mockStores;
  const activeAuditData = isHQ ? getDistrictAuditData(selectedDistrictOption.seedOffset) : auditComplianceData;
  const activeTriageItems = DISTRICT_TRIAGE[selectedDistrictId] || DISTRICT_TRIAGE['d14'];
  const activeEscalations = isHQ ? getDistrictEscalations(selectedDistrictOption.seedOffset) : escalatedStores;
  const activeBroadcasts = DISTRICT_BROADCASTS[selectedDistrictId] || DISTRICT_BROADCASTS['d14'];
  const activeMetricsSet = isHQ ? getDistrictMetrics(selectedDistrictOption.seedOffset) : undefined;
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingStore, setNavigatingStore] = useState<string | null>(null);
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'risk' | 'top' | 'revenue'>('all');
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  type SortKey = 'rank' | 'store' | 'dpi' | 'sales' | 'sea' | 'voc' | 'vocIssue' | 'seaIssue' | 'trend' | 'status';
  const [leaderboardSort, setLeaderboardSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'rank', dir: 'asc' });

  const handleLeaderboardSort = (key: SortKey) => {
    setLeaderboardSort(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'rank' || key === 'store' || key === 'vocIssue' || key === 'seaIssue' ? 'asc' : 'desc' });
  };
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'week' | 'month' | 'quarter'>('week');
  const [viewingMonth, setViewingMonth] = useState(new Date().getMonth());
  const [viewingYear, setViewingYear] = useState(new Date().getFullYear());
  // Auto-select last available week on landing
  const getLastAvailableWeekStart = () => {
    const today = new Date();
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);
    const lastWeekStart = new Date(startOfThisWeek);
    lastWeekStart.setDate(startOfThisWeek.getDate() - 7);
    return lastWeekStart;
  };
  const getLastAvailableMonth = () => {
    const today = new Date();
    const m = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const y = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    return new Date(y, m, 1);
  };
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(getLastAvailableWeekStart);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(getLastAvailableMonth);
  const [selectedQuarter, setSelectedQuarter] = useState<{ label: string; quarter: number; year: number } | null>(() => {
    const now = new Date();
    const currentQ = Math.floor(now.getMonth() / 3) + 1;
    const currentY = now.getFullYear();
    let q = currentQ - 1;
    let y = currentY;
    if (q <= 0) { q += 4; y -= 1; }
    const qMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startM = (q - 1) * 3;
    return { label: `Q${q} ${y} (${qMonths[startM]}–${qMonths[startM + 2]})`, quarter: q, year: y };
  });
  
  // Escalation policy modal
  const [showEscPolicy, setShowEscPolicy] = useState(false);

  // Heatmap tooltip state
  const [heatmapTip, setHeatmapTip] = useState<{ x: number; y: number; store: string; cat: string; val: number } | null>(null);
  // Heatmap cell detail modal
  const [heatmapDetail, setHeatmapDetail] = useState<{ storeNumber: string; storeName: string; category: string; score: number; detail: AuditCellDetail; skill: string; skillLogic: string } | null>(null);
  // Heatmap chip popover (inline on-click)
  const [chipPopover, setChipPopover] = useState<{ cellKey: string; storeNumber: string; storeName: string; category: string; score: number; detail: AuditCellDetail; skill: string; skillLogic: string; rect: { top: number; left: number; width: number; height: number } } | null>(null);

  // Chat Window States (same as Home Screen)
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [selectedChatContact, setSelectedChatContact] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showBroadcastComposer, setShowBroadcastComposer] = useState(false);
  const [broadcastRecipients, setBroadcastRecipients] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showVocPanel, setShowVocPanel] = useState(false);
  const [showSeaPanel, setShowSeaPanel] = useState(false);
  const [showTriageDetail, setShowTriageDetail] = useState<string | null>(null);
  const [activeKPIPanel, setActiveKPIPanel] = useState<DistrictKPI | null>(null);
  
  // Toast notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  // Navigate to Store Deep Dive with loading
  const handleStoreClick = (store: typeof activeStores[0]) => {
    setIsNavigating(true);
    setNavigatingStore(store.storeNumber);
    
    // Simulate 1.5 second loading for realistic feel
    setTimeout(() => {
      navigate(`/store-operations/store-deep-dive?store=${store.storeNumber}&name=${encodeURIComponent(store.storeName)}`);
    }, 1500);
  };
  
  const calendarDays = getCalendarDays(viewingYear, viewingMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (viewingMonth === 0) {
        setViewingMonth(11);
        setViewingYear(viewingYear - 1);
      } else {
        setViewingMonth(viewingMonth - 1);
      }
    } else {
      if (viewingMonth === 11) {
        setViewingMonth(0);
        setViewingYear(viewingYear + 1);
      } else {
        setViewingMonth(viewingMonth + 1);
      }
    }
  };
  
  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const clickedDate = new Date(viewingYear, viewingMonth, day);
    
    if (isDateInFuture(clickedDate) || isDateInCurrentWeek(clickedDate)) return;
    
    if (calendarMode === 'week') {
      const weekStart = new Date(clickedDate);
      weekStart.setDate(clickedDate.getDate() - clickedDate.getDay());
      setSelectedWeekStart(weekStart);
      setShowCalendar(false);
    }
  };
  
  const isInSelectedWeek = (day: number | null) => {
    if (!day || !selectedWeekStart || calendarMode !== 'week') return false;
    const date = new Date(viewingYear, viewingMonth, day);
    const weekEnd = new Date(selectedWeekStart);
    weekEnd.setDate(selectedWeekStart.getDate() + 6);
    return date >= selectedWeekStart && date <= weekEnd;
  };
  
  const getSelectedPeriodLabel = () => {
    if (calendarMode === 'week' && selectedWeekStart) {
      const weekEnd = new Date(selectedWeekStart);
      weekEnd.setDate(selectedWeekStart.getDate() + 6);
      return `${selectedWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else if (calendarMode === 'month' && selectedMonth) {
      return selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (calendarMode === 'quarter' && selectedQuarter) {
      return selectedQuarter.label;
    }
    return 'Select Period';
  };

  // Generate last 4 completed quarters (exclude running quarter)
  const getAvailableQuarters = () => {
    const now = new Date();
    const currentQ = Math.floor(now.getMonth() / 3) + 1;
    const currentY = now.getFullYear();
    const quarters: { label: string; quarter: number; year: number }[] = [];
    let q = currentQ - 1;
    let y = currentY;
    if (q <= 0) { q += 4; y -= 1; }
    for (let i = 0; i < 4; i++) {
      const qMonths = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
      const startM = (q - 1) * 3;
      quarters.push({ label: `Q${q} ${y} (${qMonths[startM]}–${qMonths[startM + 2]})`, quarter: q, year: y });
      q -= 1;
      if (q <= 0) { q = 4; y -= 1; }
    }
    return quarters;
  };
  const availableQuarters = getAvailableQuarters();

  // District metrics - different values for Week vs Month vs Quarter
  type DistrictMetrics = { dpi: number; tier: DistrictTier; rank: number; dpiChange: number; momentum: MomentumType; momentumDelta: number; chainAvg: number; scoreSales: number; scoreExecution: number; scoreVoC: number };
  const weekData: DistrictMetrics = activeMetricsSet ? activeMetricsSet.week : {
    dpi: 87, tier: 'Excellence', rank: 3, dpiChange: +2.4, momentum: 'Improving', momentumDelta: +3.2, chainAvg: 79, scoreSales: 92, scoreExecution: 85, scoreVoC: 84
  };
  
  const monthData: DistrictMetrics = activeMetricsSet ? activeMetricsSet.month : {
    dpi: 82, tier: 'Stable', rank: 5, dpiChange: +1.8, momentum: 'Improving', momentumDelta: +2.1, chainAvg: 79, scoreSales: 86, scoreExecution: 80, scoreVoC: 79
  };

  const quarterData: DistrictMetrics = activeMetricsSet ? activeMetricsSet.quarter : {
    dpi: 80, tier: 'Stable', rank: 6, dpiChange: +1.2, momentum: 'Flat', momentumDelta: +0.8, chainAvg: 79, scoreSales: 84, scoreExecution: 78, scoreVoC: 77
  };
  
  const currentData = calendarMode === 'quarter' ? quarterData : calendarMode === 'month' ? monthData : weekData;

  // Transform KPI data based on selected district + time period
  const getAdjustedKPIs = (): DistrictKPI[] => {
    // Step 1: apply district overrides to base KPIs
    const districtOverrides = DISTRICT_KPI_OVERRIDES[selectedDistrictId] || {};
    const baseKPIs = districtKPIs.map(kpi => {
      const ov = districtOverrides[kpi.id];
      if (!ov) return kpi;
      return { ...kpi, primaryValue: ov.primaryValue, delta: ov.delta, deltaDirection: ov.deltaDirection, microInsight: ov.microInsight, status: ov.status };
    });
    if (calendarMode === 'week') return baseKPIs;
    
    const contextLabel = calendarMode === 'month' ? 'MoM' : 'QoQ';
    
    // Month and Quarter KPI overrides for realistic data
    const monthOverrides: Record<string, { primaryValue: string; primaryUnit?: string; delta: string; deltaDirection: 'up' | 'down' | 'flat'; microInsight: string }> = {
      'sales-performance': { primaryValue: '$4.92M', primaryUnit: 'MTD', delta: '+3.8%', deltaDirection: 'up', microInsight: 'Monthly total across 8 stores' },
      'voc-satisfaction': { primaryValue: '81%', delta: '-2.1pts', deltaDirection: 'down', microInsight: 'Avg across 4 weeks' },
      'voc-issue-rate': { primaryValue: '3.4', delta: '+0.4', deltaDirection: 'up', microInsight: '4 of 8 stores affected' },
      'shelf-audit': { primaryValue: '88%', delta: '-7pts', deltaDirection: 'down', microInsight: 'Monthly avg below target' },
      'oos-rate': { primaryValue: '3.8%', delta: '+0.6pts', deltaDirection: 'up', microInsight: 'Apparel drives 55%' },
      'margin-health': { primaryValue: '34.0%', primaryUnit: 'GM', delta: '-55 bps', deltaDirection: 'down', microInsight: 'Markdown pressure sustained' },
    };
    
    const quarterOverrides: Record<string, { primaryValue: string; primaryUnit?: string; delta: string; deltaDirection: 'up' | 'down' | 'flat'; microInsight: string }> = {
      'sales-performance': { primaryValue: '$14.8M', primaryUnit: 'QTD', delta: '+2.9%', deltaDirection: 'up', microInsight: 'Q1 total across 8 stores' },
      'voc-satisfaction': { primaryValue: '83%', delta: '-1.8pts', deltaDirection: 'down', microInsight: 'Quarterly avg across stores' },
      'voc-issue-rate': { primaryValue: '3.2', delta: '+0.3', deltaDirection: 'up', microInsight: '3 of 8 stores impacted' },
      'shelf-audit': { primaryValue: '90%', delta: '-5pts', deltaDirection: 'down', microInsight: 'Quarterly avg below target' },
      'oos-rate': { primaryValue: '3.5%', delta: '+0.4pts', deltaDirection: 'up', microInsight: 'Apparel drives 52%' },
      'margin-health': { primaryValue: '34.4%', primaryUnit: 'GM', delta: '-30 bps', deltaDirection: 'down', microInsight: 'Seasonal markdown impact' },
    };
    
    const overrides = calendarMode === 'month' ? monthOverrides : quarterOverrides;
    
    return baseKPIs.map(kpi => {
      const override = overrides[kpi.id];
      if (!override) return { ...kpi, deltaContext: kpi.deltaContext === 'WoW' ? contextLabel : kpi.deltaContext };
      return {
        ...kpi,
        primaryValue: override.primaryValue,
        primaryUnit: override.primaryUnit ?? kpi.primaryUnit,
        delta: override.delta,
        deltaDirection: override.deltaDirection,
        microInsight: override.microInsight,
        deltaContext: kpi.deltaContext === 'WoW' || kpi.deltaContext === 'MoM' || kpi.deltaContext === 'QoQ' ? contextLabel : kpi.deltaContext,
      };
    });
  };
  
  const adjustedKPIs = getAdjustedKPIs();
  const districtDPI = currentData.dpi;
  const districtTier: DistrictTier = currentData.tier;
  const districtRank = currentData.rank;
  const totalDistricts = 24;
  const dpiChange = currentData.dpiChange;
  const chainAvgDPI = currentData.chainAvg;

  // Always true — a period is always pre-selected on landing and mode switch
  const isDateFilterActive = true;
  // True when HQ user has selected a non-default district
  const isDistrictFilterActive = isHQ && selectedDistrictId !== 'd14';
  const isAnyFilterActive = isDateFilterActive || isDistrictFilterActive;

  // Period-adjusted store leaderboard data
  const getAdjustedStores = () => {
    if (calendarMode === 'week') return activeStores;
    // Slight variations for month/quarter to show data reactivity
    const factor = calendarMode === 'month' ? 4.1 : 12.8;
    const varShift = calendarMode === 'month' ? -0.3 : -0.6;
    const dpiShift = calendarMode === 'month' ? -2 : -4;
    return activeStores.map(store => ({
      ...store,
      dpi: Math.max(45, store.dpi + dpiShift + Math.round((parseInt(store.storeNumber) % 5) - 2)),
      netSales: Math.round(store.netSales * factor),
      netSalesVar: parseFloat((store.netSalesVar + varShift).toFixed(1)),
      seaScore: Math.max(50, store.seaScore + dpiShift + (parseInt(store.storeNumber) % 3)),
      vocSatisfied: Math.max(45, store.vocSatisfied + dpiShift + (parseInt(store.storeNumber) % 4)),
    }));
  };
  const adjustedStores = getAdjustedStores();

  // Period-adjusted audit compliance heatmap
  const getAdjustedAuditData = () => {
    if (calendarMode === 'week') return activeAuditData;
    const shift = calendarMode === 'month' ? -2 : -4;
    const adjusted: Record<string, Record<string, number>> = {};
    for (const [store, cats] of Object.entries(activeAuditData)) {
      adjusted[store] = {};
      for (const [cat, val] of Object.entries(cats)) {
        const seed = parseInt(store) % 7;
        adjusted[store][cat] = Math.max(10, Math.min(100, val + shift + (seed % 3 - 1)));
      }
    }
    return adjusted;
  };
  const adjustedAuditData = getAdjustedAuditData();

  // Period-adjusted + district-aware AI Summary
  const DISTRICT_AI_SUMMARIES: Record<string, { week: { situation: string; pattern: string; risk: string; action: string }; month: { situation: string; pattern: string; risk: string; action: string }; quarter: { situation: string; pattern: string; risk: string; action: string } }> = {
    d14: {
      week: {
        situation: 'Three concurrent triage issues across Hamburg South, Cologne East, and Berlin Mitte show execution stability slipping this week.',
        pattern: 'VoC complaints and the SEA violation both originate at Hamburg South, pointing to a shared root cause—messy aisles blocking emergency paths during peak hours.',
        risk: 'The SEA fire-exit block is a regulatory and safety exposure; any delay risks store closure and penalties.',
        action: 'Deploy Hamburg South team now to clear the exit, confirm compliance, then approve Cologne East adaptation plan to protect sales.',
      },
      month: {
        situation: 'Monthly analysis reveals systemic execution gaps in 3 of 8 stores. Hamburg South and Pine Grove consistently lag on audit compliance across all 4 weeks.',
        pattern: 'VoC "Messy Aisles" theme correlates strongly with declining audit scores in Cleanliness and Customer Area categories—month-long pattern, not a one-off.',
        risk: 'Sustained underperformance at Pine Grove (DPI 63) risks sliding into Crisis tier. Monthly NPS trending -4pts with no recovery signal.',
        action: 'Schedule a focused DM visit to Pine Grove and Hamburg South. Assign dedicated reset crews for Cleanliness category improvement plan.',
      },
      quarter: {
        situation: 'Quarterly view shows the district stabilizing at DPI 80 after a Q4 dip. Two stores (Pine Grove, Maple Heights) remain chronically underperforming across all quarters.',
        pattern: 'Seasonal markdown pressure drove 30bps margin erosion. VoC satisfaction follows a consistent Q1 dip pattern across the last 3 years—likely weather and staffing-related.',
        risk: 'If Pine Grove and Maple Heights remain in Crisis through Q2, district tier risks downgrade from Stable to AtRisk at the half-year review.',
        action: 'Present quarterly turnaround plan for bottom-2 stores at regional review. Lock in staffing uplift for Q2 peak season to prevent repeat VoC decline.',
      },
    },
    d08: {
      week: {
        situation: 'Shrinkage spike at Peachtree Plaza and Savannah Square is the dominant risk this week—+18% above 4-week average with checkout speed complaints rising in parallel.',
        pattern: 'Shrinkage increase coincides with reduced floor staffing during afternoon shifts. Checkout speed complaints map to the same 2–5 PM window.',
        risk: 'Uncontrolled shrinkage erodes GM by an estimated 85 bps this month. Checkout delays are dragging VoC satisfaction below the 80% threshold.',
        action: 'Increase afternoon floor coverage at Peachtree Plaza immediately. Deploy loss-prevention audit at Savannah Square within 48 hours.',
      },
      month: {
        situation: 'Georgia district shows persistent margin pressure—clearance markdowns drove GM down 85 bps. Peachtree Plaza and Augusta Mall underperforming on SEA scores for 3 straight weeks.',
        pattern: 'Shrinkage and clearance issues are concentrated in high-traffic stores. Smaller-format stores (Savannah Square, Macon Center) are outperforming on compliance.',
        risk: 'Continued shrinkage trend at current rate projects a $42K loss for the quarter. DPI at risk of dropping below Stable tier.',
        action: 'Implement targeted loss prevention measures at top-2 stores. Review clearance markdown strategy with merchandising team.',
      },
      quarter: {
        situation: 'District 08 closed Q1 at DPI 84 with mixed signals—strong sales growth (+2.1%) but compliance gaps pulling the average down.',
        pattern: 'Urban flagship stores consistently outperform on sales but lag on execution metrics. Shrinkage is a structural issue, not seasonal.',
        risk: 'Without addressing the shrinkage root cause, Q2 margin target is at risk. Two stores trending toward AtRisk tier.',
        action: 'Propose shrinkage reduction initiative at regional review. Benchmark against District 14 playbook for execution improvement.',
      },
    },
    d22: {
      week: {
        situation: 'Carolina district faces a planogram compliance drop across 5 of 7 stores—worst at Raleigh Commons (62%). A safety incident at Durham Hub adds to the urgency.',
        pattern: 'Planogram non-compliance spikes correlate with the seasonal reset that began last week. Stores without dedicated visual teams are falling behind.',
        risk: 'Safety incident at Durham Hub is unresolved—potential regulatory exposure. Planogram gaps are costing an estimated $8K/week in lost impulse sales.',
        action: 'Prioritize safety resolution at Durham Hub today. Dispatch visual merchandising support to bottom-3 stores for planogram reset completion.',
      },
      month: {
        situation: 'Monthly trend shows Carolina district struggling with seasonal transition—POG compliance at 81% is the lowest across all districts.',
        pattern: 'Staff availability is the bottleneck. Stores with part-time-heavy rosters are 15% less compliant on planogram execution.',
        risk: 'If planogram reset is not completed by week-end, promotional tie-ins for next month launch will be compromised.',
        action: 'Accelerate visual reset with temp staffing. Schedule DM walk-throughs at Charlotte North and Raleigh Commons.',
      },
      quarter: {
        situation: 'Q1 performance for Carolina at DPI 82 is mid-pack but declining. Execution scores dragged the average down despite reasonable sales performance.',
        pattern: 'Consistent staff turnover in Q1 correlates with compliance dips. Onboarding gaps are visible in audit scores for stores with >30% new hires.',
        risk: 'Staff retention issues threaten Q2 execution if not addressed. District risks falling to bottom quartile.',
        action: 'Present retention incentive proposal at regional review. Pair underperforming stores with top-performer mentors from District 14.',
      },
    },
    d11: {
      week: {
        situation: 'Florida district has 7 of 9 stores affected by product availability issues this week. OOS rate spiked to 6.2%—highest in the chain.',
        pattern: 'Perishable and cooler categories drive 65% of OOS incidents. Distribution center delays are compounding local replenishment failures.',
        risk: 'High OOS rate is directly impacting VoC (71% satisfaction) and driving customers to competitors. Revenue leakage estimated at $28K this week.',
        action: 'Escalate DC delivery issues to supply chain leadership. Deploy emergency stock transfers from adjacent districts for top-20 OOS SKUs.',
      },
      month: {
        situation: 'Florida district has the highest sales volume ($1.52M) but also the worst execution scores in the region—a classic "busy but broken" pattern.',
        pattern: 'High foot traffic stores are overwhelmed—staffing ratios are 20% below optimal during peak hours. Cooler temperature compliance failures recurring weekly.',
        risk: 'Spoilage losses are 3x the chain average. VoC at 71% risks triggering a formal regional review if not improved within 2 weeks.',
        action: 'Reallocate staffing budget to peak-hour coverage. Install cooler monitoring alerts at Miami Beach and Orlando Central.',
      },
      quarter: {
        situation: 'Q1 shows Florida as a high-revenue, low-efficiency district. DPI 79 masks significant variance—top store at 91, bottom at 54.',
        pattern: 'Store performance is bimodal: coastal flagship stores excel on sales, inland stores struggle on every metric. No middle ground.',
        risk: 'Bottom-3 stores are consuming disproportionate DM time without improvement. Q2 seasonal surge will amplify existing gaps.',
        action: 'Consider restructuring district—separate coastal and inland into sub-clusters with dedicated support. Present plan at half-year review.',
      },
    },
    d19: {
      week: {
        situation: 'Alabama district is performing well this week—DPI 85, only 1 of 5 stores flagged for minor audit backlog. Overall execution is healthy.',
        pattern: 'Small district size enables tighter DM oversight. Audit completion rates are highest in the region at 92%.',
        risk: 'Low risk this week. Minor concern: Huntsville South audit backlog could cascade if not cleared by Friday.',
        action: 'Clear Huntsville South audit backlog. Otherwise, maintain current cadence—this district can serve as a best-practice benchmark.',
      },
      month: {
        situation: 'Alabama district continues to outperform on efficiency metrics despite being the smallest district. VoC at 85% leads the region.',
        pattern: 'Staff friendliness and store cleanliness are consistent strengths. The focused store count allows deep attention per location.',
        risk: 'Minimal. The only watch item is a slight OOS uptick (+0.2pts) driven by a single supplier delay.',
        action: 'Document the Alabama playbook for replication. Nominate David Park for the best-practice sharing session at regional meeting.',
      },
      quarter: {
        situation: 'Q1 at DPI 85 places Alabama in the top quartile. Consistent performance across all three months with no crisis moments.',
        pattern: 'Stable staffing, low turnover, and strong DM engagement are the differentiators. Margin health at 35.1% is best in class.',
        risk: 'Growth ceiling—small store count limits revenue upside. Risk of complacency if not given stretch targets.',
        action: 'Propose expansion plan for Alabama district. Use Q1 results to build the business case for 2 additional stores.',
      },
    },
  };

  const getAISummaryContent = () => {
    const districtSummary = DISTRICT_AI_SUMMARIES[selectedDistrictId] || DISTRICT_AI_SUMMARIES['d14'];
    if (calendarMode === 'month') return districtSummary.month;
    if (calendarMode === 'quarter') return districtSummary.quarter;
    return districtSummary.week;
  };
  const aiSummary = getAISummaryContent();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  const filteredStores = (() => {
    const q = leaderboardSearch.trim().toLowerCase();
    const trendOrder: Record<string, number> = { up: 2, flat: 1, down: 0 };
    const statusOrder: Record<string, number> = { excellent: 0, stable: 1, warning: 2, critical: 3 };
    const sorters: Record<SortKey, (a: typeof activeStores[0], b: typeof activeStores[0]) => number> = {
      rank: (a, b) => a.rank - b.rank,
      store: (a, b) => a.storeName.localeCompare(b.storeName),
      dpi: (a, b) => a.dpi - b.dpi,
      sales: (a, b) => a.netSales - b.netSales,
      sea: (a, b) => a.seaScore - b.seaScore,
      voc: (a, b) => a.vocSatisfied - b.vocSatisfied,
      vocIssue: (a, b) => (a.topVocIssue || '').localeCompare(b.topVocIssue || ''),
      seaIssue: (a, b) => (a.topSeaIssue || '').localeCompare(b.topSeaIssue || ''),
      trend: (a, b) => (trendOrder[a.trend] ?? 0) - (trendOrder[b.trend] ?? 0),
      status: (a, b) => (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0),
    };
    return adjustedStores
      .filter(store => {
        if (leaderboardFilter === 'risk' && !(store.status === 'critical' || store.status === 'warning')) return false;
        if (leaderboardFilter === 'top' && store.status !== 'excellent') return false;
        if (leaderboardFilter === 'revenue' && store.netSalesVar >= 0) return false;
        if (!q) return true;
        return (
          store.storeName.toLowerCase().includes(q) ||
          store.storeNumber.toLowerCase().includes(q) ||
          (store.topVocIssue || '').toLowerCase().includes(q) ||
          (store.topSeaIssue || '').toLowerCase().includes(q) ||
          store.status.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const cmp = sorters[leaderboardSort.key](a, b);
        return leaderboardSort.dir === 'asc' ? cmp : -cmp;
      });
  })();

  const SortIcon: React.FC<{ col: SortKey }> = ({ col }) => (
    leaderboardSort.key !== col
      ? <ArrowUpDown size={12} className="sort-icon sort-icon--idle" />
      : leaderboardSort.dir === 'asc'
        ? <ChevronUp size={12} className="sort-icon sort-icon--active" />
        : <ChevronDown size={12} className="sort-icon sort-icon--active" />
  );

  if (isLoading) {
    return (
      <div className="district-intel">
        <div className="district-intel-loading">
          <div className="loading-spinner" />
          <p>Loading District Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="district-intel">
      {/* Global Header */}
      <div className="district-intel-header">
        <div className="header-left">
          <div className="header-title">
            <Activity size={24} />
            <h1>District Intelligence Center</h1>
          </div>
          <div className="header-meta">
            {isHQ ? (
              <div className="di-district-picker-wrap">
                <button className="di-district-picker" onClick={() => setShowDistrictDropdown(prev => !prev)}>
                  <MapPin size={14} />
                  <span>{selectedDistrictOption.label}</span>
                  <span className="di-district-dm">DM: {selectedDistrictOption.dm}</span>
                  <ChevronDown size={14} className={showDistrictDropdown ? 'rotated' : ''} />
                </button>
                {showDistrictDropdown && (
                  <div className="di-district-dropdown">
                    {HQ_DISTRICT_OPTIONS.map(d => (
                      <button
                        key={d.id}
                        className={`di-district-option ${d.id === selectedDistrictId ? 'active' : ''}`}
                        onClick={() => { setSelectedDistrictId(d.id); setShowDistrictDropdown(false); }}
                      >
                        <div className="di-district-option-main">
                          <MapPin size={13} />
                          <span className="di-district-option-label">{d.label}</span>
                        </div>
                        <div className="di-district-option-meta">
                          <span>DM: {d.dm}</span>
                          <span>{d.storeCount} stores</span>
                        </div>
                        {d.id === selectedDistrictId && <Check size={14} className="di-district-check" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className="district-badge">
                <MapPin size={14} />
                District 14 — Tennessee
              </span>
            )}
            <div className="calendar-picker-wrapper">
              <button 
                className="period-selector"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <Calendar size={14} />
                <span>{getSelectedPeriodLabel()}</span>
                <ChevronDown size={14} className={showCalendar ? 'rotated' : ''} />
              </button>
              
              {showCalendar && (
                <div className="calendar-dropdown">
                  <div className="calendar-mode-toggle">
                    <button 
                      className={`mode-btn ${calendarMode === 'week' ? 'active' : ''}`}
                      onClick={() => {
                        setCalendarMode('week');
                        if (selectedWeekStart) {
                          setViewingMonth(selectedWeekStart.getMonth());
                          setViewingYear(selectedWeekStart.getFullYear());
                        }
                      }}
                    >
                      Week
                    </button>
                    <button 
                      className={`mode-btn ${calendarMode === 'month' ? 'active' : ''}`}
                      onClick={() => {
                        setCalendarMode('month');
                        if (selectedMonth) {
                          setViewingMonth(selectedMonth.getMonth());
                          setViewingYear(selectedMonth.getFullYear());
                        }
                      }}
                    >
                      Month
                    </button>
                    <button 
                      className={`mode-btn ${calendarMode === 'quarter' ? 'active' : ''}`}
                      onClick={() => setCalendarMode('quarter')}
                    >
                      Quarter
                    </button>
                  </div>
                  
                  {calendarMode === 'quarter' ? (
                    <div className="quarter-list">
                      {availableQuarters.map((q, idx) => (
                        <button
                          key={idx}
                          className={`quarter-option ${selectedQuarter?.quarter === q.quarter && selectedQuarter?.year === q.year ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedQuarter(q);
                            setShowCalendar(false);
                          }}
                        >
                          <span className="quarter-label">Q{q.quarter} {q.year}</span>
                          <span className="quarter-range">{q.label.match(/\((.+)\)/)?.[1]}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="calendar-nav">
                        <button className="nav-btn" onClick={() => navigateMonth('prev')}>
                          <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />
                        </button>
                        <div className="calendar-month-year">
                          <span className="calendar-month">{monthNames[viewingMonth]}</span>
                          <span className="calendar-year">{viewingYear}</span>
                        </div>
                        <button className="nav-btn" onClick={() => navigateMonth('next')}>
                          <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                      </div>
                      
                      <div className="calendar-grid">
                        <div className="calendar-weekdays">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="calendar-days">
                          {calendarDays.map((entry, index) => {
                            if (entry.trailing) {
                              return (
                                <button key={index} className="calendar-day trailing" disabled>
                                  {entry.day}
                                </button>
                              );
                            }
                            const day = entry.day;
                            const date = new Date(viewingYear, viewingMonth, day);
                            const isDisabledWeek = isDateInFuture(date) || isDateInCurrentWeek(date);
                            const isDisabledMonth = viewingYear > new Date().getFullYear() || 
                              (viewingYear === new Date().getFullYear() && viewingMonth >= new Date().getMonth());
                            const isDisabled = calendarMode === 'week' ? isDisabledWeek : isDisabledMonth;
                            const isSelectedWeek = isInSelectedWeek(day);
                            const isSelectedMonth = selectedMonth && 
                              viewingYear === selectedMonth.getFullYear() && 
                              viewingMonth === selectedMonth.getMonth();
                            const isSelected = calendarMode === 'week' ? isSelectedWeek : isSelectedMonth;
                            
                            return (
                              <button
                                key={index}
                                className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                  if (calendarMode === 'week') {
                                    handleDayClick(day);
                                  } else if (!isDisabledMonth) {
                                    setSelectedMonth(new Date(viewingYear, viewingMonth, 1));
                                    setShowCalendar(false);
                                  }
                                }}
                                disabled={isDisabled}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <span className="last-refresh">
              <Clock size={12} />
              Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="header-right">
          <div className="header-search">
            <Search size={16} />
            <input type="text" placeholder="Search stores, metrics..." />
          </div>
          <button className="header-action-btn secondary">
            <Download size={16} />
            Export
          </button>
          <button className="header-icon-btn" onClick={handleRefresh}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Executive Pulse Hero Section - Matching Home Screen DPI Card */}
      <div className="executive-pulse">
        {/* DPI Card - Home Screen Style */}
        <div className="dpi-card-v2">
          {/* Hero Score Section */}
          <div className="dpi-hero-section">
            {isAnyFilterActive && <Filter size={12} className="filter-active-icon dpi-card-filter" />}
            <div className="dpi-gauge-wrapper-v2">
              <svg className="dpi-gauge-v2" viewBox="0 0 160 160">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="10"
                />
                {/* Progress arc with gradient */}
                <defs>
                  <linearGradient id="dpiGradientDI" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="url(#dpiGradientDI)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(districtDPI / 100) * 427} 427`}
                  transform="rotate(-90 80 80)"
                  className="dpi-progress-v2"
                />
              </svg>
              <div className="dpi-score-center-v2">
                <span className="dpi-score-value-v2">{districtDPI}</span>
                <span className="dpi-score-label-v2">Performance Index</span>
              </div>
            </div>
          </div>

          {/* Performance Story */}
          <div className="dpi-story-section">
            {/* Excellence Badge */}
            <div className="dpi-tier-badge-v2">
              <div className="tier-text">
                <span className="tier-title">{districtTier} Tier</span>
                <span className="tier-subtitle">Top 10% of all districts</span>
              </div>
            </div>

            {/* Rank & Change Stats */}
            <div className="dpi-rank-stats">
              <div className="dpi-rank-card">
                <span className="dpi-rank-value">#{districtRank}</span>
                <span className="dpi-rank-label">of {totalDistricts}</span>
              </div>
              <div className="dpi-change-card">
                <div className={`dpi-change-value ${dpiChange < 0 ? 'negative' : ''}`}>
                  <TrendingUp size={18} />
                  <span>{dpiChange >= 0 ? '+' : ''}{dpiChange}%</span>
                </div>
                <span className="dpi-change-label">{calendarMode === 'week' ? 'this week' : calendarMode === 'month' ? 'this month' : 'this quarter'}</span>
              </div>
            </div>

            {/* Score Breakdown - Card Grid */}
            <div className="dpi-breakdown-header">
              <span className="breakdown-title">Score Breakdown</span>
            </div>
            <div className="dpi-breakdown-grid">
              <div className="breakdown-card">
                <div className="breakdown-value">{currentData.scoreSales}</div>
                <div className="breakdown-label">Sales</div>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${currentData.scoreSales}%` }}></div>
                </div>
              </div>
              <div className="breakdown-card">
                <div className="breakdown-value">{currentData.scoreExecution}</div>
                <div className="breakdown-label">Execution</div>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${currentData.scoreExecution}%` }}></div>
                </div>
              </div>
              <div className="breakdown-card">
                <div className="breakdown-value">{currentData.scoreVoC}</div>
                <div className="breakdown-label">VoC</div>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${currentData.scoreVoC}%` }}></div>
                </div>
              </div>
            </div>
            {/* Chain Comparison - Integrated */}
            <div className="dpi-chain-comparison">
              <div className="chain-comparison-header">
                <span className="chain-label-title">vs Chain Average</span>
                <span className="chain-delta positive">+{districtDPI - chainAvgDPI} pts</span>
              </div>
              <div className="chain-comparison-bar">
                <div className="chain-bar-track">
                  <div className="chain-bar-fill" style={{ width: `${(districtDPI / 100) * 100}%` }}></div>
                  <div className="chain-marker" style={{ left: `${(chainAvgDPI / 100) * 100}%` }}>
                    <div className="chain-marker-line"></div>
                    <span className="chain-marker-label">Chain: {chainAvgDPI}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Triage + AI Summary combined */}
        <div className="pulse-right-panel">
          {/* Triage Summary */}
          <div className="triage-section">
            <div className="ai-summary-label" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: 6 }}>
              <AlertCircle size={12} style={{ color: '#6366f1', width: 12, height: 12 }} />
              <span>Triage Summary</span>
              {isAnyFilterActive && <Filter size={10} className="filter-active-icon" />}
            </div>
            <div className="triage-items">
              {activeTriageItems.map(item => (
                <div key={item.id} className="triage-item" onClick={() => setShowTriageDetail(item.id)}>
                  <div className="triage-item-content">
                    <div className="triage-item-header">
                      <span className="triage-item-title">{item.title}</span>
                      <span className={`triage-item-priority ${item.priority}`}>{item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}</span>
                    </div>
                    <p className="triage-item-stores">{item.stores}</p>
                    <div className="triage-item-footer">
                      <span className="triage-item-metric">{item.metric}</span>
                      <button className="triage-action-btn" onClick={(e) => { e.stopPropagation(); setShowTriageDetail(item.id); }}>
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div className="ai-summary-section">
            <div className="ai-summary-label">
              <Sparkles size={12} />
              <span>AI Summary</span>
              {isAnyFilterActive && <Filter size={10} className="filter-active-icon" />}
            </div>
            <div className="ai-summary-points">
              <div className="ai-summary-point">
                <span className="point-label">Overall situation</span>
                <span className="point-text">{aiSummary.situation}</span>
              </div>
              <div className="ai-summary-point">
                <span className="point-label">Pattern spotted</span>
                <span className="point-text">{aiSummary.pattern}</span>
              </div>
              <div className="ai-summary-point">
                <span className="point-label">Biggest risk</span>
                <span className="point-text">{aiSummary.risk}</span>
              </div>
              <div className="ai-summary-point">
                <span className="point-label">Manager's first move</span>
                <span className="point-text">{aiSummary.action}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Broadcasting — full width below executive pulse */}
      <div className="broadcast-section-fw">
        <div className="broadcast-fw-header">
          <div className="broadcast-section-header">
            <Megaphone size={16} className="broadcast-icon" />
            <span>District Broadcasting</span>
            {isAnyFilterActive && <Filter size={12} className="filter-active-icon" />}
          </div>
          <button
            className="create-broadcast-btn-sm"
            onClick={() => {
              setShowChatWindow(true);
              setChatExpanded(true);
              setShowBroadcastComposer(true);
            }}
          >
            <Megaphone size={12} />
            Create Broadcast
          </button>
        </div>
        <div className="broadcast-grid">
          {/* Column 1 — Stats */}
          <div className="broadcast-col broadcast-col-stats">
            <div className="broadcast-stats-vertical">
              <div className="broadcast-stat-compact">
                <span className="stat-number">{activeBroadcasts.active}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="broadcast-stat-compact">
                <span className="stat-number">{activeBroadcasts.thisWeek}</span>
                <span className="stat-label">This Week</span>
              </div>
              <div className="broadcast-stat-compact">
                <span className="stat-number">{activeBroadcasts.ackRate}</span>
                <span className="stat-label">Acknowledged</span>
              </div>
            </div>
          </div>
          {/* Column 2 — Recent Broadcasts */}
          <div className="broadcast-col broadcast-col-recent">
            <span className="broadcast-col-title">Recent Broadcasts</span>
            {activeBroadcasts.broadcasts.map((b, idx) => (
              <div key={idx} className="broadcast-item-compact">
                <div className="broadcast-item-row">
                  <span className={`broadcast-priority ${b.priority}`}>{b.priority.toUpperCase()}</span>
                  <span className="broadcast-title-sm">{b.title}</span>
                  <span className="broadcast-time">{b.time}</span>
                </div>
                {idx === activeBroadcasts.broadcasts.length - 1 && b.priority === 'low' ? (
                  <div className="broadcast-item-actions">
                    <span className="broadcast-ack">{b.ack}</span>
                    <button className="copilot-link-btn" onClick={() => navigate('/command-center/ai-copilot?mode=pog&context=pog-self-audit')}>
                      <Bot size={12} />
                      POG Self Audit in AI Copilot
                      <ChevronRight size={12} />
                    </button>
                  </div>
                ) : (
                  <span className="broadcast-ack">{b.ack}</span>
                )}
              </div>
            ))}
          </div>
          {/* Column 3 — Insights */}
          <div className="broadcast-col broadcast-col-insights">
            <span className="broadcast-col-title">Insights</span>
            <div className="broadcast-insight-compact risk">
              <AlertTriangle size={14} />
              <div className="insight-copy">
                <span className="insight-label">Biggest gap</span>
                <p>{activeBroadcasts.gap}</p>
              </div>
              <button className="insight-action" onClick={() => {
                setShowChatWindow(true);
                setChatExpanded(true);
                setShowBroadcastComposer(true);
              }}>
                Nudge <ChevronRight size={12} />
              </button>
            </div>
            <div className="broadcast-insight-compact engagement">
              <Users size={14} />
              <div className="insight-copy">
                <span className="insight-label">Top insight</span>
                <p>{activeBroadcasts.topInsight}</p>
              </div>
            </div>
            <div className="broadcast-insight-compact planning">
              <Megaphone size={14} />
              <div className="insight-copy">
                <span className="insight-label">Next broadcast</span>
                <p>Safety refresher — Friday AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Command Center */}
      <div className="esc-command-center">
        <div className="esc-header">
          <div className="esc-header-left">
            <div className="esc-title-row">
              <Shield size={20} />
              <h2>Escalation Command Center {isAnyFilterActive && <Filter size={12} className="filter-active-icon" />}</h2>
            </div>
            <p className="esc-subtitle">System-detected compliance escalations requiring DM action</p>
          </div>
          <div className="esc-header-right">
            <div className="esc-impact-badge">
              <Zap size={14} />
              <span className="esc-impact-count">{activeEscalations.length} stores</span>
              <span className="esc-impact-label">escalated</span>
            </div>
            <div className="esc-impact-badge esc-impact-dpi">
              <TrendingDown size={14} />
              <span className="esc-impact-count">{activeEscalations.reduce((s, e) => s + e.dpiImpact, 0).toFixed(1)} pts</span>
              <span className="esc-impact-label">potential drag</span>
            </div>
          </div>
        </div>
        <div className="esc-context-strip">
          <Sparkles size={13} />
          <span>Despite +2.4% overall growth, escalations are limiting performance — execution issues reducing DPI by {Math.abs(activeEscalations.reduce((s, e) => s + e.dpiImpact, 0)).toFixed(1)} pts</span>
        </div>

        <div className="esc-body">
          {/* Store Escalation Snapshot */}
          <div className="esc-snapshot">
            <div className="esc-snapshot-list">
              {activeEscalations.map(store => (
                <div
                  key={store.storeNumber}
                  className={`esc-store-row esc-stage--${store.stage}`}
                  onClick={() => {
                    navigate(`/store-operations/store-deep-dive?store=${store.storeNumber}`);
                  }}
                >
                  <div className="esc-store-indicator">
                    <div className="esc-stage-dot" />
                    <div className="esc-streak-line">
                      {Array.from({ length: store.missStreak }).map((_, i) => (
                        <span key={i} className="esc-streak-mark" />
                      ))}
                    </div>
                  </div>
                  <div className="esc-store-info">
                    <div className="esc-store-name-row">
                      <span className="esc-store-name">{store.storeName}</span>
                      <span className="esc-store-id">#{store.storeNumber}</span>
                    </div>
                    <p className="esc-store-reason">{store.reason}</p>
                    <div className="esc-store-meta">
                      <span className="esc-meta-tag">{store.lastAuditDate}</span>
                      {store.categories.map(cat => (
                        <span key={cat} className="esc-meta-cat">{cat}</span>
                      ))}
                    </div>
                  </div>
                  <div className="esc-store-right">
                    <span className={`esc-stage-label esc-stage-label--${store.stage}`}>
                      {store.stage === 'early-warning' ? 'Early Warning' : store.stage === 'escalated' ? 'Escalated' : 'Critical'}
                    </span>
                    <span className="esc-dpi-impact">{store.dpiImpact} DPI</span>
                    <ChevronRight size={14} className="esc-row-arrow" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation Logic */}
          <div className="esc-logic">
            <div className="esc-logic-header">
              <span className="esc-logic-title">Escalation Logic</span>
              <span className="esc-logic-desc">How the system progresses stores through stages</span>
            </div>
            <div className="esc-logic-steps">
              {escalationRules.map((rule, i) => (
                <div key={rule.week} className={`esc-logic-step esc-stage--${rule.stage}`}>
                  <div className="esc-logic-step-marker">
                    <span className="esc-logic-week">{rule.week}</span>
                    {i < escalationRules.length - 1 && <div className="esc-logic-connector" />}
                  </div>
                  <div className="esc-logic-step-content">
                    <span className="esc-logic-trigger">{rule.trigger}</span>
                    <span className="esc-logic-action">{rule.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="esc-actions">
          <button className="esc-action-btn esc-action-primary" onClick={() => navigate('/command-center/operations-queue')}>
            <Target size={14} />
            View DM Action Queue
            <ArrowRight size={14} />
          </button>
          <button className="esc-action-btn esc-action-secondary" onClick={() => {
            setShowChatWindow(true);
            setChatExpanded(true);
            setShowBroadcastComposer(true);
          }}>
            <Send size={14} />
            Send Reminder
          </button>
          <button className="esc-action-btn esc-action-tertiary" onClick={() => setShowEscPolicy(true)}>
            <FileText size={14} />
            View Policy
          </button>
        </div>
      </div>

      {/* District KPI Cards */}
      <div className="kpi-cards-section">
        <div className="kpi-cards-header">
          <div className="kpi-header-title-row">
            <div className="kpi-title-group">
              <h2><BarChart3 size={20} /> District KPIs {isAnyFilterActive && <Filter size={12} className="filter-active-icon" />}</h2>
              <span className="kpi-header-subtitle">Click any metric to explore 52-week trend</span>
            </div>
            <div className="kpi-header-stats">
              <div className="kpi-stat-pill kpi-stat-positive">
                <span className="kpi-stat-value">{adjustedKPIs.filter(k => k.status === 'positive').length}</span>
                <span className="kpi-stat-label">On Track</span>
              </div>
              <div className="kpi-stat-pill kpi-stat-warning">
                <span className="kpi-stat-value">{adjustedKPIs.filter(k => k.status === 'warning').length}</span>
                <span className="kpi-stat-label">Watch</span>
              </div>
              <div className="kpi-stat-pill kpi-stat-negative">
                <span className="kpi-stat-value">{adjustedKPIs.filter(k => k.status === 'negative').length}</span>
                <span className="kpi-stat-label">Needs Attention</span>
              </div>
            </div>
          </div>
        </div>
        <div className="kpi-cards-grid">
          {/* 1. Commercial */}
          {adjustedKPIs.filter(k => k.category === 'commercial').map(kpi => (
            <div
              key={kpi.id}
              className={`kpi-tile kpi-tile--${kpi.status} ${kpi.clickable ? 'kpi-tile--clickable' : ''} ${activeKPIPanel?.id === kpi.id ? 'kpi-tile--active' : ''}`}
              onClick={() => kpi.clickable && setActiveKPIPanel(activeKPIPanel?.id === kpi.id ? null : kpi)}
            >
              <div className="kpi-tile-category kpi-tile-category--commercial">
                <DollarSign size={12} />
                <span>Commercial</span>
              </div>
              <div className="kpi-tile-value-row">
                <span className="kpi-tile-primary">{kpi.primaryValue}</span>
                {kpi.primaryUnit && <span className="kpi-tile-unit">{kpi.primaryUnit}</span>}
              </div>
              <span className="kpi-tile-label">{kpi.label}</span>
              {kpi.microInsight && (
                <div className="kpi-tile-insight">
                  <span className="kpi-tile-insight-dot" />
                  <span>{kpi.microInsight}</span>
                </div>
              )}
              <div className={`kpi-tile-delta delta-${kpi.deltaDirection}`}>
                {kpi.deltaDirection === 'up' && <ArrowUpRight size={12} />}
                {kpi.deltaDirection === 'down' && <ArrowDownRight size={12} />}
                <span>{kpi.delta}</span>
                {kpi.deltaContext && <span className="kpi-delta-ctx">{kpi.deltaContext}</span>}
              </div>
              {kpi.trendData && (() => {
                const data = kpi.trendData;
                const min = Math.min(...data);
                const max = Math.max(...data);
                const range = max - min || 1;
                const W = 120, H = 44, P = 3;
                const points = data.map((v, i) => ({
                  x: (i / (data.length - 1)) * W,
                  y: H - P - ((v - min) / range) * (H - P * 2),
                }));
                // Linear (straight-line) path — sharp angles convey precision
                const path = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');
                const areaPath = `${path} L ${W},${H} L 0,${H} Z`;
                const last = points[points.length - 1];
                const color = kpi.status === 'positive' ? '#047857' : kpi.status === 'negative' ? '#991b1b' : kpi.status === 'warning' ? '#b45309' : '#4338ca';
                return (
                  <div className="kpi-tile-sparkline">
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity="0.06" />
                          <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill={`url(#spark-${kpi.id})`} />
                      <path d={path} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter" />
                      <circle cx={last.x} cy={last.y} r="1.8" fill={color} stroke="#ffffff" strokeWidth="1" />
                    </svg>
                  </div>
                );
              })()}
              {kpi.clickable && <ChevronRight size={14} className="kpi-tile-arrow" />}
            </div>
          ))}

          {/* 2. Customer */}
          {adjustedKPIs.filter(k => k.category === 'customer').map(kpi => (
            <div
              key={kpi.id}
              className={`kpi-tile kpi-tile--${kpi.status} ${kpi.clickable ? 'kpi-tile--clickable' : ''} ${activeKPIPanel?.id === kpi.id ? 'kpi-tile--active' : ''}`}
              onClick={() => kpi.clickable && setActiveKPIPanel(activeKPIPanel?.id === kpi.id ? null : kpi)}
            >
              <div className="kpi-tile-category kpi-tile-category--customer">
                <Heart size={12} />
                <span>Customer</span>
              </div>
              <div className="kpi-tile-value-row">
                <span className="kpi-tile-primary">{kpi.primaryValue}</span>
                {kpi.primaryUnit && <span className="kpi-tile-unit">{kpi.primaryUnit}</span>}
              </div>
              <span className="kpi-tile-label">{kpi.label}</span>
              <div className={`kpi-tile-delta delta-${kpi.deltaDirection}`}>
                {kpi.deltaDirection === 'up' && <ArrowUpRight size={12} />}
                {kpi.deltaDirection === 'down' && <ArrowDownRight size={12} />}
                <span>{kpi.delta}</span>
                {kpi.deltaContext && <span className="kpi-delta-ctx">{kpi.deltaContext}</span>}
              </div>
              {kpi.trendData && (() => {
                const data = kpi.trendData;
                const min = Math.min(...data);
                const max = Math.max(...data);
                const range = max - min || 1;
                const W = 120, H = 44, P = 3;
                const points = data.map((v, i) => ({
                  x: (i / (data.length - 1)) * W,
                  y: H - P - ((v - min) / range) * (H - P * 2),
                }));
                // Linear (straight-line) path — sharp angles convey precision
                const path = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');
                const areaPath = `${path} L ${W},${H} L 0,${H} Z`;
                const last = points[points.length - 1];
                const color = kpi.status === 'positive' ? '#047857' : kpi.status === 'negative' ? '#991b1b' : kpi.status === 'warning' ? '#b45309' : '#4338ca';
                return (
                  <div className="kpi-tile-sparkline">
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity="0.06" />
                          <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill={`url(#spark-${kpi.id})`} />
                      <path d={path} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter" />
                      <circle cx={last.x} cy={last.y} r="1.8" fill={color} stroke="#ffffff" strokeWidth="1" />
                    </svg>
                  </div>
                );
              })()}
              {kpi.clickable && <ChevronRight size={14} className="kpi-tile-arrow" />}
            </div>
          ))}

          {/* 3. Execution */}
          {adjustedKPIs.filter(k => k.category === 'execution').map(kpi => (
            <div
              key={kpi.id}
              className={`kpi-tile kpi-tile--${kpi.status} ${kpi.clickable ? 'kpi-tile--clickable' : ''} ${activeKPIPanel?.id === kpi.id ? 'kpi-tile--active' : ''}`}
              onClick={() => kpi.clickable && setActiveKPIPanel(activeKPIPanel?.id === kpi.id ? null : kpi)}
            >
              <div className="kpi-tile-category kpi-tile-category--execution">
                <ClipboardCheck size={12} />
                <span>Execution</span>
              </div>
              <div className="kpi-tile-value-row">
                <span className="kpi-tile-primary">{kpi.primaryValue}</span>
                {kpi.primaryUnit && <span className="kpi-tile-unit">{kpi.primaryUnit}</span>}
              </div>
              <span className="kpi-tile-label">{kpi.label}</span>
              <div className={`kpi-tile-delta delta-${kpi.deltaDirection}`}>
                {kpi.deltaDirection === 'up' && <ArrowUpRight size={12} />}
                {kpi.deltaDirection === 'down' && <ArrowDownRight size={12} />}
                <span>{kpi.delta}</span>
                {kpi.deltaContext && <span className="kpi-delta-ctx">{kpi.deltaContext}</span>}
              </div>
              {kpi.trendData && (() => {
                const data = kpi.trendData;
                const min = Math.min(...data);
                const max = Math.max(...data);
                const range = max - min || 1;
                const W = 120, H = 44, P = 3;
                const points = data.map((v, i) => ({
                  x: (i / (data.length - 1)) * W,
                  y: H - P - ((v - min) / range) * (H - P * 2),
                }));
                // Linear (straight-line) path — sharp angles convey precision
                const path = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');
                const areaPath = `${path} L ${W},${H} L 0,${H} Z`;
                const last = points[points.length - 1];
                const color = kpi.status === 'positive' ? '#047857' : kpi.status === 'negative' ? '#991b1b' : kpi.status === 'warning' ? '#b45309' : '#4338ca';
                return (
                  <div className="kpi-tile-sparkline">
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity="0.06" />
                          <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill={`url(#spark-${kpi.id})`} />
                      <path d={path} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter" />
                      <circle cx={last.x} cy={last.y} r="1.8" fill={color} stroke="#ffffff" strokeWidth="1" />
                    </svg>
                  </div>
                );
              })()}
              {kpi.clickable && <ChevronRight size={14} className="kpi-tile-arrow" />}
            </div>
          ))}

          {/* 4. Profitability */}
          {adjustedKPIs.filter(k => k.category === 'profitability').map(kpi => (
            <div
              key={kpi.id}
              className={`kpi-tile kpi-tile--${kpi.status} ${kpi.clickable ? 'kpi-tile--clickable' : ''} ${activeKPIPanel?.id === kpi.id ? 'kpi-tile--active' : ''}`}
              onClick={() => kpi.clickable && setActiveKPIPanel(activeKPIPanel?.id === kpi.id ? null : kpi)}
            >
              <div className="kpi-tile-category kpi-tile-category--profitability">
                <Target size={12} />
                <span>Profitability</span>
              </div>
              <div className="kpi-tile-value-row">
                <span className="kpi-tile-primary">{kpi.primaryValue}</span>
                {kpi.primaryUnit && <span className="kpi-tile-unit">{kpi.primaryUnit}</span>}
              </div>
              <span className="kpi-tile-label">{kpi.label}</span>
              {kpi.microInsight && (
                <div className="kpi-tile-insight">
                  <span className="kpi-tile-insight-dot" />
                  <span>{kpi.microInsight}</span>
                </div>
              )}
              <div className={`kpi-tile-delta delta-${kpi.deltaDirection}`}>
                {kpi.deltaDirection === 'up' && <ArrowUpRight size={12} />}
                {kpi.deltaDirection === 'down' && <ArrowDownRight size={12} />}
                <span>{kpi.delta}</span>
                {kpi.deltaContext && <span className="kpi-delta-ctx">{kpi.deltaContext}</span>}
              </div>
              {kpi.trendData && (() => {
                const data = kpi.trendData;
                const min = Math.min(...data);
                const max = Math.max(...data);
                const range = max - min || 1;
                const W = 120, H = 44, P = 3;
                const points = data.map((v, i) => ({
                  x: (i / (data.length - 1)) * W,
                  y: H - P - ((v - min) / range) * (H - P * 2),
                }));
                // Linear (straight-line) path — sharp angles convey precision
                const path = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');
                const areaPath = `${path} L ${W},${H} L 0,${H} Z`;
                const last = points[points.length - 1];
                const color = kpi.status === 'positive' ? '#047857' : kpi.status === 'negative' ? '#991b1b' : kpi.status === 'warning' ? '#b45309' : '#4338ca';
                return (
                  <div className="kpi-tile-sparkline">
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity="0.06" />
                          <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill={`url(#spark-${kpi.id})`} />
                      <path d={path} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter" />
                      <circle cx={last.x} cy={last.y} r="1.8" fill={color} stroke="#ffffff" strokeWidth="1" />
                    </svg>
                  </div>
                );
              })()}
              {kpi.clickable && <ChevronRight size={14} className="kpi-tile-arrow" />}
            </div>
          ))}

        </div>

        {/* KPI Trend Panel (slide-open) */}
        {activeKPIPanel && (
          <div className="kpi-trend-panel">
            <div className="kpi-trend-panel-header">
              <h3>{activeKPIPanel.panelTitle}</h3>
              <button className="kpi-trend-close" onClick={() => setActiveKPIPanel(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="kpi-trend-chart">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="kpi-trend-svg">
                <defs>
                  <linearGradient id={`grad-${activeKPIPanel.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeKPIPanel.status === 'positive' ? '#047857' : activeKPIPanel.status === 'negative' ? '#991b1b' : '#92400e'} stopOpacity="0.06" />
                    <stop offset="100%" stopColor={activeKPIPanel.status === 'positive' ? '#047857' : activeKPIPanel.status === 'negative' ? '#991b1b' : '#92400e'} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {activeKPIPanel.trendData && (
                  <>
                    <polygon
                      fill={`url(#grad-${activeKPIPanel.id})`}
                      points={`0,120 ${activeKPIPanel.trendData.map((v, i) => {
                        const min = Math.min(...activeKPIPanel.trendData!);
                        const max = Math.max(...activeKPIPanel.trendData!);
                        const range = max - min || 1;
                        return `${(i / (activeKPIPanel.trendData!.length - 1)) * 400},${120 - ((v - min) / range) * 100}`;
                      }).join(' ')} 400,120`}
                    />
                    <polyline
                      fill="none"
                      stroke={activeKPIPanel.status === 'positive' ? '#047857' : activeKPIPanel.status === 'negative' ? '#991b1b' : '#92400e'}
                      strokeWidth="1.5"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      points={activeKPIPanel.trendData.map((v, i) => {
                        const min = Math.min(...activeKPIPanel.trendData!);
                        const max = Math.max(...activeKPIPanel.trendData!);
                        const range = max - min || 1;
                        return `${(i / (activeKPIPanel.trendData!.length - 1)) * 400},${120 - ((v - min) / range) * 100}`;
                      }).join(' ')}
                    />
                  </>
                )}
              </svg>
            </div>
            {activeKPIPanel.trendInsight && (
              <div className="kpi-trend-insight">
                <Sparkles size={13} />
                <p>{activeKPIPanel.trendInsight}</p>
              </div>
            )}
            {activeKPIPanel.panelDetails && (
              <div className="kpi-trend-details">
                {activeKPIPanel.panelDetails.map((detail, i) => (
                  <div key={i} className={`kpi-trend-detail-row status-${detail.status}`}>
                    <span className="kpi-detail-label">{detail.label}</span>
                    <span className="kpi-detail-value">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>


      
      {/* Store Leaderboard - Premium */}
      <div className="leaderboard-section-premium">
        <div className="leaderboard-header-premium">
          <div className="header-title-row">
            <div className="title-group">
              <h2><Store size={20} /> Store Leaderboard {isAnyFilterActive && <Filter size={12} className="filter-active-icon" />}</h2>
              <span className="header-subtitle">Performance ranking across all stores</span>
            </div>
            <div className="header-stats">
              <div className="stat-pill">
                <span className="stat-value">{activeStores.length}</span>
                <span className="stat-label">Stores</span>
              </div>
              <div className="stat-pill success">
                <span className="stat-value">{activeStores.filter(s => s.status === 'excellent').length}</span>
                <span className="stat-label">Excellent</span>
              </div>
              <div className="stat-pill warning">
                <span className="stat-value">{activeStores.filter(s => s.status === 'warning' || s.status === 'critical').length}</span>
                <span className="stat-label">Needs Attention</span>
              </div>
            </div>
          </div>
          <div className="leaderboard-controls">
            <div className="search-filter">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search stores, issues, status..."
                className="store-search-input"
                value={leaderboardSearch}
                onChange={(e) => setLeaderboardSearch(e.target.value)}
              />
              {leaderboardSearch && (
                <button className="store-search-clear" onClick={() => setLeaderboardSearch('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${leaderboardFilter === 'all' ? 'active' : ''}`}
                onClick={() => setLeaderboardFilter('all')}
              >
                All Stores
              </button>
              <button
                className={`filter-tab ${leaderboardFilter === 'risk' ? 'active' : ''}`}
                onClick={() => setLeaderboardFilter('risk')}
              >
                At Risk
              </button>
              <button
                className={`filter-tab ${leaderboardFilter === 'top' ? 'active' : ''}`}
                onClick={() => setLeaderboardFilter('top')}
              >
                Top Performers
              </button>
              <button
                className={`filter-tab ${leaderboardFilter === 'revenue' ? 'active' : ''}`}
                onClick={() => setLeaderboardFilter('revenue')}
              >
                Revenue Leakers
              </button>
            </div>
          </div>
        </div>
        <div className="leaderboard-table-premium">
          <table>
            <thead>
              <tr>
                <th className="th-rank th-sortable" onClick={() => handleLeaderboardSort('rank')}><span>Rank</span><SortIcon col="rank" /></th>
                <th className="th-store th-sortable" onClick={() => handleLeaderboardSort('store')}><span>Store</span><SortIcon col="store" /></th>
                <th className="th-dpi th-sortable" onClick={() => handleLeaderboardSort('dpi')}><span>DPI</span><SortIcon col="dpi" /></th>
                <th className="th-sales th-sortable" onClick={() => handleLeaderboardSort('sales')}><span>Net Sales</span><SortIcon col="sales" /></th>
                <th className="th-sea th-sortable" onClick={() => handleLeaderboardSort('sea')}><span>SEA Score</span><SortIcon col="sea" /></th>
                <th className="th-voc th-sortable" onClick={() => handleLeaderboardSort('voc')}><span>VoC %</span><SortIcon col="voc" /></th>
                <th className="th-issue th-sortable" onClick={() => handleLeaderboardSort('vocIssue')}><span>Top VoC Issue</span><SortIcon col="vocIssue" /></th>
                <th className="th-issue th-sortable" onClick={() => handleLeaderboardSort('seaIssue')}><span>Top SEA Issue</span><SortIcon col="seaIssue" /></th>
                <th className="th-trend th-sortable" onClick={() => handleLeaderboardSort('trend')}><span>Trend</span><SortIcon col="trend" /></th>
                <th className="th-status th-sortable" onClick={() => handleLeaderboardSort('status')}><span>Status</span><SortIcon col="status" /></th>
                {!isHQ && <th className="th-action"></th>}
              </tr>
            </thead>
            <tbody>
              {filteredStores.length === 0 && (
                <tr>
                  <td colSpan={11} className="leaderboard-empty">
                    No stores match your search or filters.
                  </td>
                </tr>
              )}
              {filteredStores.map((store) => (
                <tr 
                  key={store.id} 
                  className={`row-${store.status.toLowerCase()} ${!isHQ ? 'clickable-row' : ''} ${navigatingStore === store.storeNumber ? 'navigating' : ''}`}
                  onClick={() => !isHQ && !isNavigating && handleStoreClick(store)}
                >
                  <td className="td-rank">
                    <span className="rank-text">{store.rank}</span>
                  </td>
                  <td className="td-store">
                    <div className="store-info">
                      <span className="store-id">#{store.storeNumber}</span>
                      <span className="store-name">{store.storeName}</span>
                    </div>
                  </td>
                  <td className="td-dpi">
                    <span className="dpi-text" style={{ color: getDPIColor(store.dpiTier) }}>
                      {store.dpi}
                    </span>
                  </td>
                  <td className="td-sales">
                    <div className="sales-info">
                      <span className="sales-amount">{formatCurrency(store.netSales)}</span>
                      <span className={`sales-change ${store.netSalesVar >= 0 ? 'positive' : 'negative'}`}>
                        {store.netSalesVar >= 0 ? '+' : ''}{store.netSalesVar}%
                      </span>
                    </div>
                  </td>
                  <td className="td-sea">{store.seaScore}</td>
                  <td className="td-voc">
                    <span className={`voc-text ${store.vocSatisfied >= 85 ? 'good' : store.vocSatisfied >= 70 ? 'ok' : 'poor'}`}>
                      {store.vocSatisfied}%
                    </span>
                  </td>
                  <td className="td-issue">{store.topVocIssue || '-'}</td>
                  <td className="td-issue">{store.topSeaIssue || '-'}</td>
                  <td className="td-trend">
                    <span className={`trend-icon ${store.trend}`}>
                      {store.trend === 'up' && <TrendingUp size={14} />}
                      {store.trend === 'down' && <TrendingDown size={14} />}
                      {store.trend === 'flat' && <Minus size={14} />}
                    </span>
                  </td>
                  <td className="td-status">
                    <span className={`status-pill ${store.status.toLowerCase()}`}>{store.status}</span>
                  </td>
                  {!isHQ && (
                    <td className="td-action">
                      <span className={`view-store-link ${navigatingStore === store.storeNumber ? 'loading' : ''}`}>
                        {navigatingStore === store.storeNumber ? (
                          <>
                            <RefreshCw size={13} className="spinning" />
                            <span>Loading…</span>
                          </>
                        ) : (
                          <>
                            <span>View store</span>
                            <ChevronRight size={14} />
                          </>
                        )}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Compliance Heatmap */}
      <div className="heatmap-section">
        <div className="heatmap-header">
          <div className="header-title-row">
            <div className="title-group">
              <h2><ClipboardCheck size={20} /> Audit Compliance Heatmap {isAnyFilterActive && <Filter size={12} className="filter-active-icon" />}</h2>
              <span className="header-subtitle">Store-level compliance across audit categories</span>
            </div>
            <div className="heatmap-legend">
              <span className="heatmap-legend-label">Compliance:</span>
              <div className="heatmap-legend-scale">
                <div className="legend-swatch" style={{ background: '#fcc' }}></div>
                <span className="legend-text">0%</span>
                <div className="legend-swatch" style={{ background: '#fde2e2' }}></div>
                <span className="legend-text">25%</span>
                <div className="legend-swatch" style={{ background: '#fef3c7' }}></div>
                <span className="legend-text">50%</span>
                <div className="legend-swatch" style={{ background: '#d9f2e0' }}></div>
                <span className="legend-text">75%</span>
                <div className="legend-swatch" style={{ background: '#c6f0d4' }}></div>
                <span className="legend-text">100%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="heatmap-table-wrapper">
          <table className="heatmap-table">
            <thead>
              <tr>
                <th className="heatmap-th-store">Store</th>
                {auditCategories.map(cat => (
                  <th key={cat} className="heatmap-th-cat">{cat}</th>
                ))}
                <th className="heatmap-th-cat">Avg</th>
              </tr>
            </thead>
            <tbody>
              {activeStores.map(store => {
                const scores = adjustedAuditData[store.storeNumber];
                const avg = Math.round(auditCategories.reduce((sum, cat) => sum + (scores?.[cat] || 0), 0) / auditCategories.length);
                return (
                  <tr key={store.id}>
                    <td className={`heatmap-store-cell ${!isHQ ? 'heatmap-store-clickable' : ''}`} onClick={() => !isHQ && handleStoreClick(store)}>
                      <span className="heatmap-store-number">#{store.storeNumber}</span>
                      <span className="heatmap-store-name">{store.storeName}</span>
                    </td>
                    {auditCategories.map(cat => {
                      const val = scores?.[cat] || 0;
                      const cellKey = `${store.storeNumber}-${cat}`;
                      const detail = cellKey in auditCellDetails ? auditCellDetails[cellKey] : generateAutoDetail(store.storeNumber, cat, val);
                      const skillMap = getSkillForDimension(cat);
                      const isActive = chipPopover?.cellKey === cellKey;
                      return (
                        <td key={cat} className="heatmap-cell">
                          <div
                            className={`heatmap-chip ${isActive ? 'heatmap-chip--active' : ''}`}
                            style={{
                              background: getComplianceColor(val),
                              color: getComplianceTextColor(val),
                            }}
                            onMouseEnter={(e) => {
                              if (!chipPopover) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHeatmapTip({ x: rect.left + rect.width / 2, y: rect.top, store: store.storeName, cat, val });
                              }
                            }}
                            onMouseLeave={() => setHeatmapTip(null)}
                            onClick={(e) => {
                              setHeatmapTip(null);
                              if (isActive) {
                                setChipPopover(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const spaceBelow = window.innerHeight - rect.bottom;
                                const popoverHeight = 220;
                                const flipAbove = spaceBelow < popoverHeight;
                                setChipPopover({
                                  cellKey,
                                  storeNumber: store.storeNumber,
                                  storeName: store.storeName,
                                  category: cat,
                                  score: val,
                                  detail,
                                  skill: skillMap.skill,
                                  skillLogic: skillMap.logic,
                                  rect: { top: flipAbove ? rect.top : rect.bottom, left: rect.left + rect.width / 2, width: rect.width, height: rect.height },
                                });
                              }
                            }}
                          >
                            <span className="heatmap-value">{val}%</span>
                            <span className={`heatmap-chip-trend heatmap-chip-trend--${detail.trend}`}>
                              {detail.trend === 'improving' ? '↑' : detail.trend === 'declining' ? '↓' : '—'}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="heatmap-cell">
                      <div
                        className="heatmap-cell-inner heatmap-avg heatmap-cell-clickable"
                        style={{
                          background: getComplianceColor(avg),
                          color: getComplianceTextColor(avg),
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHeatmapTip({ x: rect.left + rect.width / 2, y: rect.top, store: store.storeName, cat: 'Average', val: avg });
                        }}
                        onMouseLeave={() => setHeatmapTip(null)}
                        onClick={() => {
                          setHeatmapTip(null);
                          const avgSkillMap = getSkillForDimension('Avg');
                          setHeatmapDetail({
                            storeNumber: store.storeNumber,
                            storeName: store.storeName,
                            category: 'Avg',
                            score: avg,
                            detail: generateAutoDetail(store.storeNumber, 'Avg', avg),
                            skill: avgSkillMap.skill,
                            skillLogic: avgSkillMap.logic,
                          });
                        }}
                      >
                        <span className="heatmap-value">{avg}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {heatmapTip && (
          <div
            className="heatmap-tooltip heatmap-tooltip--visible"
            style={{ left: heatmapTip.x, top: heatmapTip.y }}
          >
            <strong>{heatmapTip.store}</strong>
            <span>{heatmapTip.cat}: {heatmapTip.val}%</span>
          </div>
        )}
      </div>

      {/* Chip Popover — inline detail on heatmap cell click */}
      {chipPopover && (() => {
        const spaceBelow = window.innerHeight - chipPopover.rect.top;
        const isFlipped = spaceBelow < 230;
        return (
        <div className="chip-popover-backdrop" onClick={() => setChipPopover(null)}>
          <div
            className={`chip-popover ${isFlipped ? 'chip-popover--above' : ''}`}
            style={isFlipped
              ? { bottom: window.innerHeight - chipPopover.rect.top + 6, left: chipPopover.rect.left }
              : { top: chipPopover.rect.top + 6, left: chipPopover.rect.left }
            }
            onClick={(e) => e.stopPropagation()}
          >
            {!isFlipped && <div className="chip-popover-arrow" />}
            {isFlipped && <div className="chip-popover-arrow chip-popover-arrow--bottom" />}
            <div className="chip-popover-header">
              <span className="chip-popover-title">{chipPopover.category}</span>
              <span className="chip-popover-score" style={{ background: getComplianceColor(chipPopover.score), color: getComplianceTextColor(chipPopover.score) }}>
                {chipPopover.score}%
              </span>
            </div>
            <div className="chip-popover-rows">
              <div className="chip-popover-row">
                <span className="chip-popover-label">Trend</span>
                <span className={`chip-popover-trend chip-popover-trend--${chipPopover.detail.trend}`}>
                  {chipPopover.detail.trend === 'improving' && <TrendingUp size={12} />}
                  {chipPopover.detail.trend === 'declining' && <TrendingDown size={12} />}
                  {chipPopover.detail.trend === 'stable' && <Minus size={12} />}
                  {chipPopover.detail.trend.charAt(0).toUpperCase() + chipPopover.detail.trend.slice(1)}
                </span>
              </div>
              <div className="chip-popover-row">
                <span className="chip-popover-label">Owner</span>
                <span className="chip-popover-value">{chipPopover.detail.auditor}</span>
              </div>
              <div className="chip-popover-row chip-popover-row--intervention">
                <span className="chip-popover-label">Intervention</span>
                <span className="chip-popover-value chip-popover-value--rec">{chipPopover.detail.recommendation}</span>
              </div>
            </div>
            <div className="chip-popover-actions">
              <button className="chip-popover-btn" onClick={() => {
                const cp = chipPopover;
                setChipPopover(null);
                setHeatmapDetail({
                  storeNumber: cp.storeNumber,
                  storeName: cp.storeName,
                  category: cp.category,
                  score: cp.score,
                  detail: cp.detail,
                  skill: cp.skill,
                  skillLogic: cp.skillLogic,
                });
              }}>
                View Full Details <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Heatmap Cell Detail Modal */}
      {heatmapDetail && (
        <div className="heatmap-detail-overlay" onClick={() => setHeatmapDetail(null)}>
          <div className="heatmap-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="heatmap-detail-header">
              <div className="heatmap-detail-title-row">
                <div className="heatmap-detail-badge" style={{ background: getComplianceColor(heatmapDetail.score), color: getComplianceTextColor(heatmapDetail.score) }}>
                  {heatmapDetail.score}%
                </div>
                <div className="heatmap-detail-title">
                  <h3>{heatmapDetail.category} Audit</h3>
                  <span className="heatmap-detail-store">#{heatmapDetail.storeNumber} — {heatmapDetail.storeName}</span>
                </div>
              </div>
              <button className="heatmap-detail-close" onClick={() => setHeatmapDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="heatmap-detail-meta">
              <div className="heatmap-detail-meta-item">
                <Clock size={13} />
                <span>Last audit: {heatmapDetail.detail.lastAudit}</span>
              </div>
              <div className="heatmap-detail-meta-item">
                <Users size={13} />
                <span>Auditor: {heatmapDetail.detail.auditor}</span>
              </div>
              <div className={`heatmap-detail-trend heatmap-trend--${heatmapDetail.detail.trend}`}>
                {heatmapDetail.detail.trend === 'improving' && <TrendingUp size={13} />}
                {heatmapDetail.detail.trend === 'declining' && <TrendingDown size={13} />}
                {heatmapDetail.detail.trend === 'stable' && <Minus size={13} />}
                <span>{heatmapDetail.detail.trend.charAt(0).toUpperCase() + heatmapDetail.detail.trend.slice(1)}</span>
              </div>
            </div>

            <div className="heatmap-detail-findings">
              <span className="heatmap-detail-section-label">
                <AlertCircle size={13} />
                Findings ({heatmapDetail.detail.findings.length})
              </span>
              <div className="heatmap-detail-findings-list">
                {heatmapDetail.detail.findings.map((finding, idx) => (
                  <div key={idx} className="heatmap-finding-item">
                    <span className="heatmap-finding-num">{idx + 1}</span>
                    <span className="heatmap-finding-text">{finding}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="heatmap-detail-recommendation">
              <span className="heatmap-detail-section-label">
                <Sparkles size={13} />
                AI Recommendation
              </span>
              <p>{heatmapDetail.detail.recommendation}</p>
            </div>

            <div className="heatmap-detail-skill-tag">
              <span className="heatmap-skill-label">AI Copilot Skill:</span>
              <span className={`heatmap-skill-pill heatmap-skill--${heatmapDetail.skill}`}>
                {heatmapDetail.skill === 'pog' ? 'POG' : heatmapDetail.skill === 'knowledge' ? 'Knowledge' : heatmapDetail.skill === 'actions' ? 'Action' : 'Analytics'}
              </span>
              <span className="heatmap-skill-logic">{heatmapDetail.skillLogic}</span>
            </div>

            <div className="heatmap-detail-actions">
              <button className="heatmap-action-btn heatmap-action-primary" onClick={() => {
                const d = heatmapDetail;
                setHeatmapDetail(null);
                navigate(`/command-center/ai-copilot?mode=${d.skill}&context=audit-${d.category.toLowerCase().replace(/ /g, '-')}&store=${d.storeNumber}&storeName=${encodeURIComponent(d.storeName)}&score=${d.score}`);
              }}>
                <Sparkles size={14} />
                Investigate in AI Copilot
                <ChevronRight size={14} />
              </button>
              {!isHQ && (
                <button className="heatmap-action-btn heatmap-action-secondary" onClick={() => {
                  setHeatmapDetail(null);
                  navigate(`/store-operations/store-deep-dive?store=${heatmapDetail.storeNumber}`);
                }}>
                  <Store size={14} />
                  View Store
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button 
        className="floating-chat-btn"
        onClick={() => setShowChatWindow(!showChatWindow)}
        aria-label="Messages & Broadcasts"
        title="Messages & Broadcasts"
      >
        <MessageSquare size={24} />
      </button>

      {/* Floating Chat Window - Same as Home Screen */}
      {showChatWindow && (
        <div className={`chat-window ${chatExpanded ? 'expanded' : ''}`}>
          <div className="chat-window-header">
            <div className="chat-header-title">
              <MessageSquare size={18} />
              <h3>Messages & Broadcasts</h3>
            </div>
            <div className="chat-header-actions">
              <button 
                className="chat-expand-btn" 
                onClick={() => setChatExpanded(!chatExpanded)}
                title={chatExpanded ? 'Collapse' : 'Expand'}
              >
                {chatExpanded ? <Minus size={16} /> : <ExternalLink size={16} />}
              </button>
              <button className="chat-close-btn" onClick={() => {
                setShowChatWindow(false);
                setChatExpanded(false);
                setShowBroadcastComposer(false);
              }}>
                <X size={18} />
              </button>
            </div>
          </div>
          
          <div className={`chat-window-body ${chatExpanded ? 'split-view' : ''}`}>
            {/* Left Panel - Messages & Create Broadcast */}
            <div className="chat-left-panel">
              {showBroadcastComposer ? (
                /* Broadcast Composer */
                <div className="broadcast-composer">
                  <div className="broadcast-composer-header">
                    <button 
                      className="chat-back-btn"
                      onClick={() => {
                        setShowBroadcastComposer(false);
                        setBroadcastRecipients([]);
                        setBroadcastMessage('');
                      }}
                    >
                      <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <div className="broadcast-composer-title">
                      <Bell size={18} />
                      <span>New Broadcast</span>
                    </div>
                  </div>
                  
                  <div className="broadcast-recipients-section">
                    <div className="broadcast-section-label">
                      <Users size={14} />
                      <span>Select Recipients ({broadcastRecipients.length} selected)</span>
                    </div>
                    <div className="broadcast-recipients-list">
                      {teamMembers.map((member) => (
                        <div 
                          key={member.id}
                          className={`broadcast-recipient-item ${broadcastRecipients.includes(member.id) ? 'selected' : ''}`}
                          onClick={() => {
                            if (broadcastRecipients.includes(member.id)) {
                              setBroadcastRecipients(prev => prev.filter(id => id !== member.id));
                            } else {
                              setBroadcastRecipients(prev => [...prev, member.id]);
                            }
                          }}
                        >
                          <div className={`recipient-checkbox ${broadcastRecipients.includes(member.id) ? 'checked' : ''}`}>
                            {broadcastRecipients.includes(member.id) && <Check size={12} />}
                          </div>
                          <div className="chat-contact-avatar small">{member.avatar}</div>
                          <div className="recipient-info">
                            <span className="recipient-name">{member.name}</span>
                            <span className="recipient-role">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      className="select-all-recipients-btn"
                      onClick={() => {
                        if (broadcastRecipients.length === teamMembers.length) {
                          setBroadcastRecipients([]);
                        } else {
                          setBroadcastRecipients(teamMembers.map(m => m.id));
                        }
                      }}
                    >
                      {broadcastRecipients.length === teamMembers.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  <div className="broadcast-message-section">
                    <div className="broadcast-section-label">
                      <MessageSquare size={14} />
                      <span>Broadcast Message</span>
                    </div>
                    <textarea 
                      placeholder="Type your broadcast message..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="broadcast-actions">
                    <button 
                      className="broadcast-send-btn"
                      disabled={!broadcastMessage.trim() || broadcastRecipients.length === 0}
                      onClick={() => {
                        const recipientCount = broadcastRecipients.length;
                        showToast(`✓ Broadcast sent to ${recipientCount} recipient${recipientCount > 1 ? 's' : ''}`);
                        setBroadcastMessage('');
                        setBroadcastRecipients([]);
                        setShowBroadcastComposer(false);
                      }}
                    >
                      <Send size={16} />
                      Send Broadcast ({broadcastRecipients.length})
                    </button>
                  </div>
                </div>
              ) : !selectedChatContact ? (
                /* Contacts List */
                <div className="chat-contacts-list">
                  <button 
                    className={`new-broadcast-btn ${chatExpanded ? 'compact' : ''}`}
                    onClick={() => setShowBroadcastComposer(true)}
                  >
                    {chatExpanded ? (
                      <>
                        <span className="plus-icon">+</span>
                        <span>Create Broadcast</span>
                      </>
                    ) : (
                      <>
                        <Bell size={16} />
                        <span>New Broadcast</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                  {teamMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="chat-contact-item"
                      onClick={() => setSelectedChatContact(member.id)}
                    >
                      <div className="chat-contact-avatar">{member.avatar}</div>
                      <div className="chat-contact-info">
                        <span className="chat-contact-name">{member.name}</span>
                        <span className="chat-contact-role">{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Conversation View */
                <div className="chat-conversation">
                  <div className="chat-conversation-header">
                    <button 
                      className="chat-back-btn"
                      onClick={() => setSelectedChatContact(null)}
                    >
                      <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <div className="chat-contact-avatar small">
                      {teamMembers.find(m => m.id === selectedChatContact)?.avatar}
                    </div>
                    <div className="chat-conversation-info">
                      <span className="chat-conversation-name">
                        {teamMembers.find(m => m.id === selectedChatContact)?.name}
                      </span>
                      <span className="chat-conversation-status">Online</span>
                    </div>
                  </div>
                  
                  <div className="chat-messages">
                    <div className="chat-message incoming">
                      <div className="message-content">
                        <p>Hi! How can I help you today?</p>
                        <span className="message-time">2:30 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-input-area">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <button className="chat-send-btn">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Escalation Policy Modal */}
      {showEscPolicy && (
        <div className="esc-policy-overlay" onClick={() => setShowEscPolicy(false)}>
          <div className="esc-policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="esc-policy-modal-header">
              <div className="esc-policy-modal-title">
                <Shield size={20} />
                <div>
                  <h3>Escalation Policy</h3>
                  <span className="esc-policy-modal-sub">Progressive compliance enforcement framework</span>
                </div>
              </div>
              <button className="esc-policy-close" onClick={() => setShowEscPolicy(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="esc-policy-modal-body">
              <div className="esc-policy-timeline">
                <div className="esc-policy-stage esc-policy-stage--warning">
                  <div className="esc-policy-stage-bar" />
                  <div className="esc-policy-stage-header">
                    <span className="esc-policy-stage-badge warning">Week 1</span>
                    <span className="esc-policy-stage-name">Early Warning</span>
                  </div>
                  <div className="esc-policy-stage-details">
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">Trigger</span>
                      <span className="esc-policy-rule-value">Any audit category drops below 60% compliance</span>
                    </div>
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">System Action</span>
                      <span className="esc-policy-rule-value">Flag raised in DM dashboard, store tagged for monitoring</span>
                    </div>
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">DM Expectation</span>
                      <span className="esc-policy-rule-value">Acknowledge flag, review store audit details within 48 hours</span>
                    </div>
                  </div>
                </div>

                <div className="esc-policy-stage esc-policy-stage--escalated">
                  <div className="esc-policy-stage-bar" />
                  <div className="esc-policy-stage-header">
                    <span className="esc-policy-stage-badge escalated">Week 2</span>
                    <span className="esc-policy-stage-name">Auto-Escalated</span>
                  </div>
                  <div className="esc-policy-stage-details">
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">Trigger</span>
                      <span className="esc-policy-rule-value">No improvement or additional category miss in second consecutive week</span>
                    </div>
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">System Action</span>
                      <span className="esc-policy-rule-value">Auto-escalated to DM action queue, reminder sent to store manager</span>
                    </div>
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">DM Expectation</span>
                      <span className="esc-policy-rule-value">Direct intervention required — assign corrective task within 24 hours</span>
                    </div>
                  </div>
                </div>

                <div className="esc-policy-stage esc-policy-stage--critical">
                  <div className="esc-policy-stage-bar" />
                  <div className="esc-policy-stage-header">
                    <span className="esc-policy-stage-badge critical">Week 3+</span>
                    <span className="esc-policy-stage-name">Critical</span>
                  </div>
                  <div className="esc-policy-stage-details">
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">Trigger</span>
                      <span className="esc-policy-rule-value">Consecutive misses across multiple categories, no corrective action logged</span>
                    </div>
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">System Action</span>
                      <span className="esc-policy-rule-value">Critical flag, regional visibility enabled, DPI impact tracked</span>
                    </div>
                    <div className="esc-policy-rule">
                      <span className="esc-policy-rule-label">DM Expectation</span>
                      <span className="esc-policy-rule-value">Immediate store visit, documented action plan, regional review scheduled</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="esc-policy-footer-note">
                <Sparkles size={13} />
                <span>Escalation stages reset automatically when a store achieves two consecutive weeks of 75%+ compliance across all categories.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      {/* VoC Investigation Panel */}
      {showVocPanel && (
        <div className="investigation-panel-overlay" onClick={() => setShowVocPanel(false)}>
          <div className="investigation-panel" onClick={(e) => e.stopPropagation()}>
            <div className="investigation-panel-header">
              <div className="panel-header-title">
                <AlertCircle size={20} />
                <h3>VoC Crisis Investigation</h3>
              </div>
              <button className="panel-close-btn" onClick={() => setShowVocPanel(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="investigation-panel-content">
              <div className="investigation-summary">
                <div className="summary-badge high">HIGH PRIORITY</div>
                <h4>Staff Availability Complaints +40%</h4>
                <p>Cluster B stores showing significant increase in customer complaints related to staff availability and service wait times.</p>
              </div>
              
              <div className="investigation-stores">
                <div className="section-label">Affected Stores (4)</div>
                <div className="store-list">
                  <div className="store-item">
                    <span className="store-name">Hamburg South</span>
                    <span className="store-metric negative">+52% complaints</span>
                  </div>
                  <div className="store-item">
                    <span className="store-name">Cologne East</span>
                    <span className="store-metric negative">+45% complaints</span>
                  </div>
                  <div className="store-item">
                    <span className="store-name">Berlin Mitte</span>
                    <span className="store-metric negative">+38% complaints</span>
                  </div>
                  <div className="store-item">
                    <span className="store-name">Munich Central</span>
                    <span className="store-metric negative">+31% complaints</span>
                  </div>
                </div>
              </div>
              
              <div className="investigation-actions">
                <button className="action-btn primary" onClick={() => {
                  setShowVocPanel(false);
                  showToast('Scheduling review meeting with store managers...');
                }}>
                  Schedule Review
                  <ChevronRight size={14} />
                </button>
                <button className="action-btn secondary" onClick={() => {
                  setShowVocPanel(false);
                  setShowChatWindow(true);
                  setChatExpanded(true);
                  setShowBroadcastComposer(true);
                }}>
                  Send Broadcast
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEA Audit Panel */}
      {showSeaPanel && (
        <div className="investigation-panel-overlay" onClick={() => setShowSeaPanel(false)}>
          <div className="investigation-panel" onClick={(e) => e.stopPropagation()}>
            <div className="investigation-panel-header">
              <div className="panel-header-title">
                <AlertCircle size={20} />
                <h3>SEA Compliance Audit</h3>
              </div>
              <button className="panel-close-btn" onClick={() => setShowSeaPanel(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="investigation-panel-content">
              <div className="investigation-summary">
                <div className="summary-badge high">HIGH PRIORITY</div>
                <h4>Planogram Audit Failures</h4>
                <p>Recurring planogram compliance failures detected in 3 stores. Merchandising effectiveness is compromised.</p>
              </div>
              
              <div className="investigation-stores">
                <div className="section-label">Failing Stores (3)</div>
                <div className="store-list">
                  <div className="store-item">
                    <span className="store-name">Hamburg South</span>
                    <span className="store-metric negative">3 failures</span>
                  </div>
                  <div className="store-item">
                    <span className="store-name">Cologne East</span>
                    <span className="store-metric negative">2 failures</span>
                  </div>
                  <div className="store-item">
                    <span className="store-name">Berlin Mitte</span>
                    <span className="store-metric negative">2 failures</span>
                  </div>
                </div>
              </div>
              
              <div className="investigation-actions">
                <button className="action-btn primary" onClick={() => {
                  setShowSeaPanel(false);
                  showToast('Opening full SEA audit report...');
                }}>
                  View Full Audit
                  <ChevronRight size={14} />
                </button>
                <button className="action-btn secondary" onClick={() => {
                  setShowSeaPanel(false);
                  showToast('Assigning corrective actions to store managers...');
                }}>
                  Assign Actions
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Triage Detail Modal */}
      {showTriageDetail && (
        <div className="investigation-panel-overlay" onClick={() => setShowTriageDetail(null)}>
          <div className="investigation-panel triage-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="investigation-panel-header">
              <div className="panel-header-title">
                <AlertTriangle size={20} />
                <h3>{activeTriageItems.find(t => t.id === showTriageDetail)?.title || 'Triage Detail'}</h3>
              </div>
              <button className="panel-close-btn" onClick={() => setShowTriageDetail(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="investigation-panel-content">
              {showTriageDetail === 'voc-messy' && (
                <>
                  <div className="investigation-summary">
                    <div className="summary-badge high">HIGH PRIORITY</div>
                    <h4>Customer Feedback Spike Detected</h4>
                    <p>+22% increase in "messy aisles" complaints across 3 stores this week. Pattern suggests staffing or process issue during peak hours.</p>
                  </div>
                  
                  <div className="investigation-stores">
                    <div className="section-label">Affected Stores (3)</div>
                    <div className="store-list">
                      <div className="store-item">
                        <span className="store-name">Hamburg South</span>
                        <span className="store-metric negative">+45% complaints</span>
                      </div>
                      <div className="store-item">
                        <span className="store-name">Cologne East</span>
                        <span className="store-metric negative">+38% complaints</span>
                      </div>
                      <div className="store-item">
                        <span className="store-name">Berlin Mitte</span>
                        <span className="store-metric negative">+31% complaints</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="investigation-actions">
                    <button className="action-btn primary" onClick={() => {
                      setShowTriageDetail(null);
                      showToast('Assigning task to store managers...');
                    }}>
                      <Store size={14} />
                      Assign to Store
                    </button>
                    <button className="action-btn secondary" onClick={() => {
                      setShowTriageDetail(null);
                      showToast('Escalating to Regional Manager...');
                    }}>
                      <AlertTriangle size={14} />
                      Escalate
                    </button>
                    <button className="action-btn tertiary" onClick={() => {
                      setShowTriageDetail(null);
                      setShowChatWindow(true);
                      setChatExpanded(true);
                      setShowBroadcastComposer(true);
                    }}>
                      <Megaphone size={14} />
                      Send Broadcast
                    </button>
                  </div>
                </>
              )}
              
              {showTriageDetail === 'sea-fire' && (
                <>
                  <div className="investigation-summary">
                    <div className="summary-badge critical">CRITICAL</div>
                    <h4>Fire Exit Blocked - Safety Violation</h4>
                    <p>Display fixture blocking emergency exit at Hamburg South. Immediate action required. Auto-escalated to District Manager.</p>
                  </div>
                  
                  <div className="investigation-stores">
                    <div className="section-label">Violation Details</div>
                    <div className="store-list">
                      <div className="store-item">
                        <span className="store-name">Hamburg South</span>
                        <span className="store-metric negative">Fire Exit B - Blocked</span>
                      </div>
                    </div>
                    <div className="violation-timeline">
                      <div className="timeline-item">
                        <span className="timeline-time">2h ago</span>
                        <span className="timeline-event">Violation detected by SEA audit</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-time">1h ago</span>
                        <span className="timeline-event">Auto-escalated to DM</span>
                      </div>
                      <div className="timeline-item pending">
                        <span className="timeline-time">Pending</span>
                        <span className="timeline-event">Store manager acknowledgment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="investigation-actions">
                    <button className="action-btn primary" onClick={() => {
                      setShowTriageDetail(null);
                      showToast('Calling store manager...');
                    }}>
                      <MessageSquare size={14} />
                      Contact Store
                    </button>
                    <button className="action-btn secondary" onClick={() => {
                      setShowTriageDetail(null);
                      showToast('Escalating to Regional Safety Officer...');
                    }}>
                      <AlertTriangle size={14} />
                      Escalate Further
                    </button>
                    <button className="action-btn tertiary" onClick={() => {
                      setShowTriageDetail(null);
                      showToast('Opening full audit report...');
                    }}>
                      <ExternalLink size={14} />
                      View Full Audit
                    </button>
                  </div>
                </>
              )}
              
              {showTriageDetail === 'oos-risk' && (
                <>
                  <div className="investigation-summary">
                    <div className="summary-badge medium">MEDIUM PRIORITY</div>
                    <h4>Inbound Shipment Delay</h4>
                    <p>3 SKUs delayed 48 hours affecting Cologne East. Adaptation plan pending approval. Estimated revenue impact: €2,400.</p>
                  </div>
                  
                  <div className="investigation-stores">
                    <div className="section-label">Affected SKUs (3)</div>
                    <div className="store-list">
                      <div className="store-item">
                        <span className="store-name">SKU-4521 - Summer Dress</span>
                        <span className="store-metric negative">48h delay</span>
                      </div>
                      <div className="store-item">
                        <span className="store-name">SKU-4522 - Linen Pants</span>
                        <span className="store-metric negative">48h delay</span>
                      </div>
                      <div className="store-item">
                        <span className="store-name">SKU-4523 - Cotton Blouse</span>
                        <span className="store-metric negative">48h delay</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="investigation-actions">
                    <button className="action-btn primary" onClick={() => {
                      setShowTriageDetail(null);
                      showToast('Approving adaptation plan...');
                    }}>
                      <Check size={14} />
                      Approve Adaptation
                    </button>
                    <button className="action-btn secondary" onClick={() => {
                      setShowTriageDetail(null);
                      showToast('Assigning to store for local sourcing...');
                    }}>
                      <Store size={14} />
                      Assign to Store
                    </button>
                    <button className="action-btn tertiary" onClick={() => {
                      setShowTriageDetail(null);
                      showToast('Opening supply chain details...');
                    }}>
                      <Package size={14} />
                      View Supply Chain
                    </button>
                  </div>
                </>
              )}

              {/* Generic fallback for non-d14 triage items */}
              {showTriageDetail && !['voc-messy', 'sea-fire', 'oos-risk'].includes(showTriageDetail) && (() => {
                const triageItem = activeTriageItems.find(t => t.id === showTriageDetail);
                if (!triageItem) return null;
                const priorityLabel = triageItem.priority === 'critical' ? 'CRITICAL' : triageItem.priority === 'high' ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY';
                return (
                  <>
                    <div className="investigation-summary">
                      <div className={`summary-badge ${triageItem.priority}`}>{priorityLabel}</div>
                      <h4>{triageItem.title}</h4>
                      <p>{triageItem.stores}. Current status: {triageItem.metric}. Requires immediate DM review and action.</p>
                    </div>
                    
                    <div className="investigation-stores">
                      <div className="section-label">Affected Locations</div>
                      <div className="store-list">
                        {triageItem.stores.split(' · ').map((s, i) => (
                          <div key={i} className="store-item">
                            <span className="store-name">{s.split(' — ')[0]}</span>
                            <span className="store-metric negative">{triageItem.metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="investigation-actions">
                      <button className="action-btn primary" onClick={() => {
                        setShowTriageDetail(null);
                        showToast('Assigning task to store managers...');
                      }}>
                        <Store size={14} />
                        Assign to Store
                      </button>
                      <button className="action-btn secondary" onClick={() => {
                        setShowTriageDetail(null);
                        showToast('Escalating to Regional Manager...');
                      }}>
                        <AlertTriangle size={14} />
                        Escalate
                      </button>
                      <button className="action-btn tertiary" onClick={() => {
                        setShowTriageDetail(null);
                        setShowChatWindow(true);
                        setChatExpanded(true);
                        setShowBroadcastComposer(true);
                      }}>
                        <Megaphone size={14} />
                        Send Broadcast
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictIntelligence;
