import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Store,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  AlertCircle,
  Shield,
  Sparkles,
  X,
  ChevronRight,
  Target,
  BarChart3,
  Package,
  Heart,
  ClipboardCheck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Search,
  Clock,
  Eye,
  CheckCircle,
  CheckCircle2,
  Info,
  Megaphone,
  Send,
  ListChecks,
  CircleCheck,
  Timer,
  CircleAlert,
  FileText,
  Zap,
  Users,
  Calendar,
  Filter
} from 'lucide-react';
import './StoreCenter.css';
import './DistrictIntelligence.css';

// ── Types ──────────────────────────────────────────────
interface StoreMeta {
  id: string;
  name: string;
  number: string;
  cluster: string;
  format: string;
  dpi: number;
  dpiDelta: number;
  momentum: 'rising' | 'stable' | 'declining';
  rank: number;
  totalStores: number;
  risk: 'low' | 'moderate' | 'high';
  lastRefresh: string;
  tier: string;
}

interface KPITile {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: string;
  deltaDir: 'up' | 'down' | 'flat';
  deltaContext?: string;
  status: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  trendData: number[];
  trendLabels: string[];
  insight: string;
}

interface AuditWeek {
  weekLabel: string;
  date: string;
  overall: number;
  safety: number;
  planogram: number;
  signage: number;
  cleanliness: number;
  availability: number;
  staffing: number;
  stockRotation: number;
  pricing: number;
  backroom: number;
  customerArea: number;
}

interface VoCItem {
  theme: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  volume: number;
  delta: number;
  topComment: string;
  source: string;
}

interface InventoryItem {
  sku: string;
  name: string;
  status: 'in-stock' | 'low' | 'out-of-stock' | 'inbound';
  quantity: number;
  daysOfSupply: number;
  inboundEta?: string;
}

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  time: string;
  source: string;
}

// ── Mock Data ──────────────────────────────────────────
const storesData: StoreMeta[] = [
  { id: 's1', name: 'Downtown Plaza', number: '2034', cluster: 'Metro North', format: 'Flagship', dpi: 94, dpiDelta: 3.2, momentum: 'rising', rank: 1, totalStores: 8, risk: 'low', lastRefresh: '5 min ago', tier: 'Excellence' },
  { id: 's2', name: 'Riverside Mall', number: '1876', cluster: 'Metro North', format: 'Full-Line', dpi: 91, dpiDelta: 2.1, momentum: 'rising', rank: 2, totalStores: 8, risk: 'low', lastRefresh: '8 min ago', tier: 'Excellence' },
  { id: 's3', name: 'Central Station', number: '3421', cluster: 'Metro West', format: 'Full-Line', dpi: 85, dpiDelta: 0.5, momentum: 'stable', rank: 3, totalStores: 8, risk: 'low', lastRefresh: '12 min ago', tier: 'Excellence' },
  { id: 's4', name: 'Westfield Center', number: '2198', cluster: 'Metro West', format: 'Compact', dpi: 82, dpiDelta: -1.2, momentum: 'stable', rank: 4, totalStores: 8, risk: 'moderate', lastRefresh: '10 min ago', tier: 'Performing' },
  { id: 's5', name: 'Harbor View', number: '4532', cluster: 'South Bay', format: 'Full-Line', dpi: 78, dpiDelta: -3.5, momentum: 'declining', rank: 5, totalStores: 8, risk: 'moderate', lastRefresh: '15 min ago', tier: 'Performing' },
  { id: 's6', name: 'Oak Street', number: '1234', cluster: 'East Region', format: 'Compact', dpi: 72, dpiDelta: -6.8, momentum: 'declining', rank: 6, totalStores: 8, risk: 'high', lastRefresh: '9 min ago', tier: 'Needs Attention' },
  { id: 's7', name: 'Pine Grove', number: '5678', cluster: 'South Bay', format: 'Compact', dpi: 65, dpiDelta: -9.2, momentum: 'declining', rank: 7, totalStores: 8, risk: 'high', lastRefresh: '20 min ago', tier: 'Needs Attention' },
  { id: 's8', name: 'Maple Heights', number: '9012', cluster: 'East Region', format: 'Compact', dpi: 58, dpiDelta: -12.4, momentum: 'declining', rank: 8, totalStores: 8, risk: 'high', lastRefresh: '14 min ago', tier: 'Needs Attention' },
];

const getKPIsForStore = (store: StoreMeta): KPITile[] => [
  { id: 'sales', label: 'Sales vs Plan', value: store.dpi >= 85 ? '104.2%' : store.dpi >= 75 ? '97.8%' : '91.3%', delta: store.dpi >= 85 ? '+4.2%' : store.dpi >= 75 ? '-2.2%' : '-8.7%', deltaDir: store.dpi >= 85 ? 'up' : 'down', deltaContext: 'YoY', status: store.dpi >= 85 ? 'positive' : 'negative', icon: <DollarSign size={16} />, trendData: [96, 98, 97, 101, 99, 103, 104, 102, 105, 104, 103, 106], trendLabels: ['Feb 3','Feb 10','Feb 17','Feb 24','Mar 3','Mar 10','Mar 17','Mar 24','Mar 31','Apr 6','Apr 13','Apr 20'], insight: store.dpi >= 85 ? 'Consistently above plan for 6 weeks' : 'Below plan — weekend traffic declining' },
  { id: 'sea', label: 'SEA Score', value: store.dpi >= 80 ? '91' : '76', unit: '/100', delta: store.dpi >= 80 ? '+3 pts' : '-5 pts', deltaDir: store.dpi >= 80 ? 'up' : 'down', deltaContext: 'YoY', status: store.dpi >= 80 ? 'positive' : 'negative', icon: <Shield size={16} />, trendData: [85, 87, 88, 86, 89, 90, 88, 91, 90, 92, 91, 91], trendLabels: ['Feb 3','Feb 10','Feb 17','Feb 24','Mar 3','Mar 10','Mar 17','Mar 24','Mar 31','Apr 6','Apr 13','Apr 20'], insight: store.dpi >= 80 ? 'Audit scores improving steadily' : 'Safety category pulling score down' },
  { id: 'voc', label: 'VoC Score', value: store.dpi >= 80 ? '4.3' : '3.6', unit: '/5', delta: store.dpi >= 80 ? '+0.2 pts' : '-0.4 pts', deltaDir: store.dpi >= 80 ? 'up' : 'down', deltaContext: 'YoY', status: store.dpi >= 80 ? 'positive' : 'negative', icon: <Heart size={16} />, trendData: [4.0, 4.1, 4.0, 4.2, 4.1, 4.3, 4.2, 4.3, 4.4, 4.3, 4.2, 4.3], trendLabels: ['Feb 3','Feb 10','Feb 17','Feb 24','Mar 3','Mar 10','Mar 17','Mar 24','Mar 31','Apr 6','Apr 13','Apr 20'], insight: store.dpi >= 80 ? 'Customer satisfaction trending positively' : '"Messy aisles" theme rising — needs attention' },
  { id: 'avail', label: 'Availability', value: store.dpi >= 80 ? '96.8%' : '89.2%', delta: store.dpi >= 80 ? '+1.1%' : '-3.4%', deltaDir: store.dpi >= 80 ? 'up' : 'down', deltaContext: 'YoY', status: store.dpi >= 80 ? 'positive' : 'negative', icon: <Package size={16} />, trendData: [94, 95, 94, 96, 95, 97, 96, 97, 96, 97, 97, 97], trendLabels: ['Feb 3','Feb 10','Feb 17','Feb 24','Mar 3','Mar 10','Mar 17','Mar 24','Mar 31','Apr 6','Apr 13','Apr 20'], insight: store.dpi >= 80 ? 'Near-target availability maintained' : '3 SKUs out-of-stock contributing to drop' },
  { id: 'gm', label: 'Gross Margin', value: store.dpi >= 85 ? '42.1%' : store.dpi >= 75 ? '39.8%' : '37.2%', delta: store.dpi >= 85 ? '+80 bps' : '-120 bps', deltaDir: store.dpi >= 85 ? 'up' : 'down', deltaContext: 'YoY', status: store.dpi >= 85 ? 'positive' : 'negative', icon: <BarChart3 size={16} />, trendData: [40, 41, 40, 41, 42, 41, 42, 41, 42, 42, 42, 42], trendLabels: ['Feb 3','Feb 10','Feb 17','Feb 24','Mar 3','Mar 10','Mar 17','Mar 24','Mar 31','Apr 6','Apr 13','Apr 20'], insight: store.dpi >= 85 ? 'Margin improvement from better mix' : 'Markdown pressure from slow movers' },
  { id: 'alerts', label: 'Open Alerts', value: store.risk === 'high' ? '7' : store.risk === 'moderate' ? '3' : '1', delta: store.risk === 'high' ? '+4' : store.risk === 'moderate' ? '+1' : '-1', deltaDir: store.risk === 'high' ? 'up' : store.risk === 'moderate' ? 'up' : 'down', deltaContext: 'YoY', status: store.risk === 'high' ? 'negative' : store.risk === 'moderate' ? 'neutral' : 'positive', icon: <Bell size={16} />, trendData: [2, 3, 2, 4, 3, 5, 4, 3, 2, 3, 2, 1], trendLabels: ['Feb 3','Feb 10','Feb 17','Feb 24','Mar 3','Mar 10','Mar 17','Mar 24','Mar 31','Apr 6','Apr 13','Apr 20'], insight: store.risk === 'high' ? 'Alert volume spiking — 4 new this week' : 'Alert volume under control' },
];

const getAuditData = (store: StoreMeta): AuditWeek[] => {
  const base = store.dpi >= 80 ? 85 : 65;
  const variance = store.dpi >= 80 ? 8 : 15;
  const gen = (offset: number, trendFactor: number, i: number) =>
    Math.round(Math.min(100, Math.max(30, base + offset + Math.floor(Math.random() * variance) - variance / 2 + (i * trendFactor))));
  const tf = store.momentum === 'rising' ? 1.5 : store.momentum === 'declining' ? -1.5 : 0;
  const weekDates = ['Mar 2', 'Mar 9', 'Mar 16', 'Mar 23', 'Mar 30', 'Apr 6', 'Apr 13', 'Apr 20'];
  return Array.from({ length: 8 }, (_, i) => {
    const s = gen(0, tf, i);
    const p = gen(0, 0, i);
    const sg = gen(-2, 0, i);
    const c = gen(5, 0, i);
    const a = gen(3, 0, i);
    const st = gen(-2, 0, i);
    const sr = gen(-3, 0, i);
    const pr = gen(1, 0, i);
    const br = gen(-4, 0, i);
    const ca = gen(2, 0, i);
    return {
      weekLabel: weekDates[i],
      date: weekDates[i],
      overall: Math.round((s + p + sg + c + a + st + sr + pr + br + ca) / 10),
      safety: s,
      planogram: p,
      signage: sg,
      cleanliness: c,
      availability: a,
      staffing: st,
      stockRotation: sr,
      pricing: pr,
      backroom: br,
      customerArea: ca,
    };
  });
};

const getVoCData = (store: StoreMeta): VoCItem[] => [
  { theme: 'Staff Helpfulness', sentiment: store.dpi >= 80 ? 'positive' : 'negative', volume: store.dpi >= 80 ? 142 : 89, delta: store.dpi >= 80 ? 12 : -18, topComment: store.dpi >= 80 ? '"Staff was incredibly helpful finding sizes"' : '"Couldn\'t find anyone to help me"', source: 'Google Reviews' },
  { theme: 'Store Cleanliness', sentiment: store.dpi >= 80 ? 'positive' : 'negative', volume: store.dpi >= 80 ? 98 : 134, delta: store.dpi >= 80 ? 5 : 28, topComment: store.dpi >= 80 ? '"Always tidy and well-organized"' : '"Aisles were messy and cluttered"', source: 'In-App Survey' },
  { theme: 'Product Availability', sentiment: store.dpi >= 75 ? 'neutral' : 'negative', volume: 76, delta: store.dpi >= 75 ? -3 : 15, topComment: store.dpi >= 75 ? '"Most items were in stock"' : '"Basic sizes constantly out of stock"', source: 'Google Reviews' },
  { theme: 'Checkout Speed', sentiment: 'positive', volume: 54, delta: -8, topComment: '"Quick checkout, no waiting"', source: 'In-App Survey' },
  { theme: 'Store Ambience', sentiment: store.dpi >= 85 ? 'positive' : 'neutral', volume: 41, delta: 2, topComment: store.dpi >= 85 ? '"Love the new layout!"' : '"Nothing special but acceptable"', source: 'Social Media' },
];

const getInventoryData = (store: StoreMeta): InventoryItem[] => [
  { sku: 'WOM-BLZ-001', name: "Women's Classic Blazer", status: 'in-stock', quantity: 48, daysOfSupply: 14 },
  { sku: 'MEN-DNM-003', name: "Men's Slim Denim", status: store.dpi >= 80 ? 'in-stock' : 'low', quantity: store.dpi >= 80 ? 32 : 6, daysOfSupply: store.dpi >= 80 ? 10 : 2 },
  { sku: 'KID-TSH-012', name: "Kids Color Block Tee", status: 'in-stock', quantity: 64, daysOfSupply: 21 },
  { sku: 'ACC-BAG-005', name: "Canvas Tote Bag", status: store.risk === 'high' ? 'out-of-stock' : 'in-stock', quantity: store.risk === 'high' ? 0 : 22, daysOfSupply: store.risk === 'high' ? 0 : 8 },
  { sku: 'WOM-DRS-008', name: "Summer Midi Dress", status: 'inbound', quantity: 12, daysOfSupply: 3, inboundEta: '2 days' },
  { sku: 'MEN-PLO-002', name: "Men's Polo Classic", status: store.dpi >= 75 ? 'in-stock' : 'low', quantity: store.dpi >= 75 ? 28 : 4, daysOfSupply: store.dpi >= 75 ? 9 : 1 },
  { sku: 'SEA-JKT-004', name: "Seasonal Rain Jacket", status: 'inbound', quantity: 0, daysOfSupply: 0, inboundEta: '5 days' },
  { sku: 'ACC-SCF-009', name: "Silk Blend Scarf", status: 'in-stock', quantity: 36, daysOfSupply: 18 },
];

const getAlerts = (store: StoreMeta): AlertItem[] => {
  const base: AlertItem[] = [
    { id: 'a1', type: 'info', title: 'Weekly audit completed', detail: 'All categories assessed — overall score recorded', time: '2h ago', source: 'Audit System' },
  ];
  if (store.risk === 'high') {
    base.unshift(
      { id: 'a5', type: 'critical', title: 'SEA Auto-Fail: Fire Exit Blocked', detail: 'Display blocking emergency exit in Zone B — immediate action required', time: '1h ago', source: 'Safety Audit' },
      { id: 'a4', type: 'critical', title: 'OOS Spike: 3 SKUs depleted', detail: 'Men\'s Slim Denim, Canvas Tote, Men\'s Polo below safety stock', time: '3h ago', source: 'Inventory System' },
      { id: 'a3', type: 'warning', title: 'VoC Negative Spike', detail: '"Messy aisles" complaints up 28% this week', time: '5h ago', source: 'VoC Engine' },
    );
  }
  if (store.risk === 'moderate') {
    base.unshift(
      { id: 'a2', type: 'warning', title: 'Planogram deviation detected', detail: 'Women\'s wall section 40% non-compliant', time: '4h ago', source: 'POG System' },
      { id: 'a6', type: 'warning', title: 'Staffing gap predicted', detail: 'Saturday coverage 15% below optimal', time: '6h ago', source: 'Workforce Planner' },
    );
  }
  return base;
};

const getAIInsight = (store: StoreMeta) => ({
  rootCause: store.dpi >= 80
    ? `${store.name} is performing well overall, driven by strong sales execution and consistent audit compliance. Minor VoC fluctuations in "product availability" are being offset by positive staff interaction scores. The store's momentum is ${store.momentum}, with DPI trending ${store.dpiDelta >= 0 ? 'upward' : 'flat'} over the last 4 weeks.`
    : `${store.name}'s performance decline is driven by a combination of factors: audit compliance has dropped in Safety and Cleanliness categories for 3 consecutive weeks, leading to VoC complaints about "messy aisles" (up 28%). Simultaneously, 3 key SKUs went out-of-stock, reducing availability to ${store.dpi >= 75 ? '89.2%' : '84.1%'} and directly impacting sales conversion.`,
  causalChain: store.dpi >= 80
    ? [
        { factor: 'Staff Training', contribution: 35, direction: 'positive' as const },
        { factor: 'Planogram Compliance', contribution: 25, direction: 'positive' as const },
        { factor: 'Inventory Management', contribution: 20, direction: 'positive' as const },
        { factor: 'Customer Experience', contribution: 20, direction: 'positive' as const },
      ]
    : [
        { factor: 'Audit Compliance Drop', contribution: 40, direction: 'negative' as const },
        { factor: 'OOS / Availability', contribution: 30, direction: 'negative' as const },
        { factor: 'VoC Sentiment Decline', contribution: 20, direction: 'negative' as const },
        { factor: 'Staffing Gaps', contribution: 10, direction: 'negative' as const },
      ],
  actions: store.dpi >= 80
    ? [
        { priority: 1, action: 'Maintain current execution cadence', module: 'Audit', impact: 'Sustain top-tier performance' },
        { priority: 2, action: 'Address minor availability gaps in accessories', module: 'Inventory', impact: '+0.5% availability uplift' },
        { priority: 3, action: 'Replicate staff training model to nearby stores', module: 'Workforce', impact: 'District-wide improvement' },
      ]
    : [
        { priority: 1, action: 'Clear fire exit blockage immediately', module: 'Safety', impact: 'Regulatory compliance restored' },
        { priority: 2, action: 'Expedite OOS replenishment for 3 critical SKUs', module: 'Inventory', impact: '+3.4% availability recovery' },
        { priority: 3, action: 'Deploy cleaning protocol for aisles', module: 'Operations', impact: 'VoC complaint reduction by ~20%' },
        { priority: 4, action: 'Schedule weekend staffing reinforcement', module: 'Workforce', impact: 'Coverage gap closed' },
      ],
});

const compBenchmarks = [
  { metric: 'Sales vs Plan', unit: '%', clusterAvg: 99.1, chainAvg: 97.4 },
  { metric: 'SEA Score', unit: '/100', clusterAvg: 87, chainAvg: 84 },
  { metric: 'VoC Score', unit: '/5', clusterAvg: 4.1, chainAvg: 3.9 },
  { metric: 'Availability', unit: '%', clusterAvg: 94.5, chainAvg: 93.1 },
  { metric: 'Gross Margin', unit: '%', clusterAvg: 40.2, chainAvg: 39.5 },
];

// ── Operational Compliance View Data ────────────────────
interface BroadcastAction {
  broadcastId: string;
  broadcastTitle: string;
  priority: 'critical' | 'high' | 'medium';
  sentAt: string;
  sender: string;
  source: string;
  actionTitle: string;
  actionCount: number;
  slaDue: string;
  storeStatus: 'completed' | 'in-progress' | 'pending' | 'overdue';
  completionPct: number;
  pendingStores: number;
  overdueStores: number;
  storeBreakdown: { storeNumber: string; storeName: string; status: 'completed' | 'in-progress' | 'pending' | 'overdue'; completedBy?: string; completionTs?: string }[];
}

const broadcastActions: BroadcastAction[] = [
  {
    broadcastId: 'bc-001',
    broadcastTitle: 'Product Recall — Organic Baby Lotion Batch #7742',
    priority: 'critical',
    sentAt: '2 hours ago',
    sender: 'Regional HQ',
    source: 'Compliance Office',
    actionTitle: 'Remove recalled items from shelf & backroom, confirm count',
    actionCount: 8,
    slaDue: 'Today, 5:00 PM',
    storeStatus: 'in-progress',
    completionPct: 62,
    pendingStores: 3,
    overdueStores: 0,
    storeBreakdown: [
      { storeNumber: '2034', storeName: 'Downtown Plaza', status: 'completed', completedBy: 'Sarah M.', completionTs: '1h ago' },
      { storeNumber: '1876', storeName: 'Riverside Mall', status: 'completed', completedBy: 'Marcus C.', completionTs: '45m ago' },
      { storeNumber: '3421', storeName: 'Central Station', status: 'completed', completedBy: 'Lisa W.', completionTs: '30m ago' },
      { storeNumber: '2198', storeName: 'Westfield Center', status: 'completed', completedBy: 'Tom B.', completionTs: '20m ago' },
      { storeNumber: '4532', storeName: 'Harbor View', status: 'completed', completedBy: 'Amy R.', completionTs: '15m ago' },
      { storeNumber: '1234', storeName: 'Oak Street', status: 'in-progress' },
      { storeNumber: '5678', storeName: 'Pine Grove', status: 'pending' },
      { storeNumber: '9012', storeName: 'Maple Heights', status: 'pending' },
    ],
  },
  {
    broadcastId: 'bc-002',
    broadcastTitle: 'Planogram Refresh — Summer Collection Endcaps',
    priority: 'high',
    sentAt: '1 day ago',
    sender: 'Visual Merchandising',
    source: 'VM Team',
    actionTitle: 'Implement new endcap planogram per visual guide v2.3',
    actionCount: 8,
    slaDue: 'Tomorrow, 12:00 PM',
    storeStatus: 'pending',
    completionPct: 38,
    pendingStores: 5,
    overdueStores: 0,
    storeBreakdown: [
      { storeNumber: '2034', storeName: 'Downtown Plaza', status: 'completed', completedBy: 'Sarah M.', completionTs: '6h ago' },
      { storeNumber: '1876', storeName: 'Riverside Mall', status: 'completed', completedBy: 'Marcus C.', completionTs: '4h ago' },
      { storeNumber: '3421', storeName: 'Central Station', status: 'completed', completedBy: 'Lisa W.', completionTs: '2h ago' },
      { storeNumber: '2198', storeName: 'Westfield Center', status: 'in-progress' },
      { storeNumber: '4532', storeName: 'Harbor View', status: 'pending' },
      { storeNumber: '1234', storeName: 'Oak Street', status: 'pending' },
      { storeNumber: '5678', storeName: 'Pine Grove', status: 'pending' },
      { storeNumber: '9012', storeName: 'Maple Heights', status: 'pending' },
    ],
  },
  {
    broadcastId: 'bc-003',
    broadcastTitle: 'Fire Safety Audit Prep — Q2 Compliance Check',
    priority: 'high',
    sentAt: '3 days ago',
    sender: 'Safety & Compliance',
    source: 'District Manager',
    actionTitle: 'Complete fire safety checklist & photo evidence submission',
    actionCount: 8,
    slaDue: 'Overdue (was 2 days ago)',
    storeStatus: 'overdue',
    completionPct: 75,
    pendingStores: 2,
    overdueStores: 2,
    storeBreakdown: [
      { storeNumber: '2034', storeName: 'Downtown Plaza', status: 'completed', completedBy: 'Sarah M.', completionTs: '2d ago' },
      { storeNumber: '1876', storeName: 'Riverside Mall', status: 'completed', completedBy: 'Marcus C.', completionTs: '2d ago' },
      { storeNumber: '3421', storeName: 'Central Station', status: 'completed', completedBy: 'Lisa W.', completionTs: '1d ago' },
      { storeNumber: '2198', storeName: 'Westfield Center', status: 'completed', completedBy: 'Tom B.', completionTs: '1d ago' },
      { storeNumber: '4532', storeName: 'Harbor View', status: 'completed', completedBy: 'Amy R.', completionTs: '1d ago' },
      { storeNumber: '1234', storeName: 'Oak Street', status: 'completed', completedBy: 'Dan K.', completionTs: '12h ago' },
      { storeNumber: '5678', storeName: 'Pine Grove', status: 'overdue' },
      { storeNumber: '9012', storeName: 'Maple Heights', status: 'overdue' },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────
const getComplianceColor = (val: number) => {
  if (val >= 90) return '#dcfce7';
  if (val >= 75) return '#d9f2e0';
  if (val >= 60) return '#fef3c7';
  if (val >= 40) return '#fde2e2';
  return '#fcc';
};
const getComplianceTextColor = (val: number) => {
  if (val >= 90) return '#15803d';
  if (val >= 75) return '#166534';
  if (val >= 60) return '#92400e';
  if (val >= 40) return '#991b1b';
  return '#7f1d1d';
};

// ── Component ──────────────────────────────────────────
export const StoreCenter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedStoreId, setSelectedStoreId] = useState(storesData[0].id);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');
  const [trendModal, setTrendModal] = useState<KPITile | null>(null);
  const [auditWeekDetail, setAuditWeekDetail] = useState<AuditWeek | null>(null);
  const [activeTab, setActiveTab] = useState<'voc' | 'inventory' | 'benchmarking' | 'alerts'>('voc');
  const [showCausalChain, setShowCausalChain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // OCV state
  const [activeBroadcast, setActiveBroadcast] = useState<BroadcastAction>(broadcastActions[0]);
  const [ocvCompletedActions, setOcvCompletedActions] = useState<Set<string>>(new Set());
  const [ocvExpandedRow, setOcvExpandedRow] = useState<string | null>(null);

  // ── Calendar / Period Filter State ──
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'week' | 'month' | 'quarter'>('week');
  const [viewingMonth, setViewingMonth] = useState(new Date().getMonth());
  const [viewingYear, setViewingYear] = useState(new Date().getFullYear());

  const getLastAvailableWeekStart = () => {
    const today = new Date();
    const sow = new Date(today);
    sow.setDate(today.getDate() - today.getDay());
    sow.setHours(0, 0, 0, 0);
    const lw = new Date(sow);
    lw.setDate(sow.getDate() - 7);
    return lw;
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
    const cq = Math.floor(now.getMonth() / 3) + 1;
    const cy = now.getFullYear();
    let q = cq - 1, y = cy;
    if (q <= 0) { q += 4; y -= 1; }
    const mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const s = (q - 1) * 3;
    return { label: `Q${q} ${y} (${mn[s]}–${mn[s + 2]})`, quarter: q, year: y };
  });

  const isDateInCurrentWeek = (date: Date) => {
    const today = new Date();
    const sow = new Date(today);
    sow.setDate(today.getDate() - today.getDay());
    sow.setHours(0, 0, 0, 0);
    const eow = new Date(sow);
    eow.setDate(sow.getDate() + 6);
    eow.setHours(23, 59, 59, 999);
    return date >= sow && date <= eow;
  };
  const isDateInFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const getCalendarDays = (yr: number, mo: number) => {
    const firstDay = new Date(yr, mo, 1);
    const lastDay = new Date(yr, mo + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDow = firstDay.getDay();
    const days: { day: number; trailing: boolean }[] = [];
    if (startDow > 0) {
      const pmLast = new Date(yr, mo, 0).getDate();
      for (let i = startDow - 1; i >= 0; i--) days.push({ day: pmLast - i, trailing: true });
    }
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, trailing: false });
    return days;
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const cd = new Date(viewingYear, viewingMonth, day);
    if (isDateInFuture(cd) || isDateInCurrentWeek(cd)) return;
    if (calendarMode === 'week') {
      const ws = new Date(cd);
      ws.setDate(cd.getDate() - cd.getDay());
      setSelectedWeekStart(ws);
      setShowCalendar(false);
    }
  };

  const isInSelectedWeek = (day: number | null) => {
    if (!day || !selectedWeekStart || calendarMode !== 'week') return false;
    const date = new Date(viewingYear, viewingMonth, day);
    const we = new Date(selectedWeekStart);
    we.setDate(selectedWeekStart.getDate() + 6);
    return date >= selectedWeekStart && date <= we;
  };

  const getAvailableQuarters = () => {
    const now = new Date();
    const cq = Math.floor(now.getMonth() / 3) + 1;
    const cy = now.getFullYear();
    const quarters: { label: string; quarter: number; year: number }[] = [];
    let q = cq - 1, y = cy;
    if (q <= 0) { q += 4; y -= 1; }
    const mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (let i = 0; i < 4; i++) {
      const s = (q - 1) * 3;
      quarters.push({ label: `Q${q} ${y} (${mn[s]}–${mn[s + 2]})`, quarter: q, year: y });
      q -= 1;
      if (q <= 0) { q = 4; y -= 1; }
    }
    return quarters;
  };
  const availableQuarters = getAvailableQuarters();

  const getSelectedPeriodLabel = () => {
    if (calendarMode === 'week' && selectedWeekStart) {
      const we = new Date(selectedWeekStart);
      we.setDate(selectedWeekStart.getDate() + 6);
      return `${selectedWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${we.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (calendarMode === 'month' && selectedMonth) return selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (calendarMode === 'quarter' && selectedQuarter) return selectedQuarter.label;
    return 'Select Period';
  };

  const navigateMonth = (dir: number) => {
    let nm = viewingMonth + dir, ny = viewingYear;
    if (nm < 0) { nm = 11; ny -= 1; }
    if (nm > 11) { nm = 0; ny += 1; }
    setViewingMonth(nm);
    setViewingYear(ny);
  };

  const calendarDays = getCalendarDays(viewingYear, viewingMonth);
  const isDateFilterActive = true;

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.calendar-picker-wrapper')) setShowCalendar(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Handle incoming store selection via URL query param
  useEffect(() => {
    const storeParam = searchParams.get('store');
    if (storeParam) {
      const match = storesData.find(s => s.number === storeParam);
      if (match) {
        setIsLoading(true);
        setSelectedStoreId(match.id);
        window.scrollTo(0, 0);
        scrollRef.current?.scrollTo(0, 0);
        const timer = setTimeout(() => {
          setIsLoading(false);
          window.scrollTo(0, 0);
          scrollRef.current?.scrollTo(0, 0);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams]);

  const store = storesData.find(s => s.id === selectedStoreId) || storesData[0];
  const baseKpis = getKPIsForStore(store);
  // Period-adjusted KPIs — default deltaContext is YoY; time filter swaps to WoW / MoM / QoQ
  const kpis = (() => {
    const ctx = calendarMode === 'week' ? 'WoW' : calendarMode === 'month' ? 'MoM' : 'QoQ';
    if (calendarMode === 'week') return baseKpis.map(kpi => ({ ...kpi, deltaContext: kpi.deltaContext === 'YoY' ? ctx : kpi.deltaContext }));
    const monthOverrides: Record<string, Partial<KPITile>> = {
      sales: { value: store.dpi >= 85 ? '437.6%' : store.dpi >= 75 ? '410.8%' : '383.5%', delta: store.dpi >= 85 ? '+3.8%' : '-1.9%', insight: 'Monthly aggregate vs plan', trendData: [395, 402, 410, 418, 425, 430, 438], trendLabels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'] },
      sea: { value: store.dpi >= 80 ? '89' : '74', delta: store.dpi >= 80 ? '+2 pts' : '-3 pts', insight: 'Monthly avg audit score', trendData: [84, 85, 86, 87, 88, 88, 89], trendLabels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'] },
      voc: { value: store.dpi >= 80 ? '4.2' : '3.5', delta: store.dpi >= 80 ? '+0.1 pts' : '-0.3 pts', insight: 'Monthly avg satisfaction', trendData: [3.9, 4.0, 4.0, 4.1, 4.1, 4.2, 4.2], trendLabels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'] },
      avail: { value: store.dpi >= 80 ? '96.2%' : '88.5%', delta: store.dpi >= 80 ? '+0.8%' : '-2.1%', insight: 'Monthly avg availability', trendData: [94.5, 95.0, 95.2, 95.8, 96.0, 96.1, 96.2], trendLabels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'] },
      gm: { value: store.dpi >= 85 ? '41.8%' : store.dpi >= 75 ? '39.5%' : '36.9%', delta: store.dpi >= 85 ? '+60 bps' : '-90 bps', insight: 'Monthly margin trend', trendData: [40.2, 40.5, 40.8, 41.0, 41.2, 41.5, 41.8], trendLabels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'] },
      alerts: { value: store.risk === 'high' ? '28' : store.risk === 'moderate' ? '12' : '4', delta: store.risk === 'high' ? '+8' : store.risk === 'moderate' ? '+2' : '-2', insight: 'Monthly alert volume', trendData: [8, 6, 10, 5, 7, 4, 4], trendLabels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'] },
    };
    const quarterOverrides: Record<string, Partial<KPITile>> = {
      sales: { value: store.dpi >= 85 ? '1,364%' : store.dpi >= 75 ? '1,281%' : '1,196%', delta: store.dpi >= 85 ? '+5.1%' : '-2.8%', insight: 'Quarterly aggregate vs plan', trendData: [1180, 1220, 1280, 1364], trendLabels: ['Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
      sea: { value: store.dpi >= 80 ? '88' : '73', delta: store.dpi >= 80 ? '+3 pts' : '-4 pts', insight: 'Quarterly avg audit score', trendData: [82, 84, 86, 88], trendLabels: ['Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
      voc: { value: store.dpi >= 80 ? '4.1' : '3.4', delta: store.dpi >= 80 ? '+0.2 pts' : '-0.5 pts', insight: 'Quarterly avg satisfaction', trendData: [3.8, 3.9, 4.0, 4.1], trendLabels: ['Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
      avail: { value: store.dpi >= 80 ? '95.8%' : '87.9%', delta: store.dpi >= 80 ? '+1.2%' : '-3.0%', insight: 'Quarterly avg availability', trendData: [93.5, 94.2, 95.0, 95.8], trendLabels: ['Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
      gm: { value: store.dpi >= 85 ? '41.5%' : store.dpi >= 75 ? '39.2%' : '36.6%', delta: store.dpi >= 85 ? '+90 bps' : '-140 bps', insight: 'Quarterly margin trend', trendData: [39.8, 40.2, 40.8, 41.5], trendLabels: ['Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
      alerts: { value: store.risk === 'high' ? '84' : store.risk === 'moderate' ? '36' : '12', delta: store.risk === 'high' ? '+18' : store.risk === 'moderate' ? '+4' : '-5', insight: 'Quarterly alert volume', trendData: [24, 18, 30, 12], trendLabels: ['Q2 2025','Q3 2025','Q4 2025','Q1 2026'] },
    };
    const overrides = calendarMode === 'month' ? monthOverrides : quarterOverrides;
    return baseKpis.map(kpi => {
      const ov = overrides[kpi.id];
      return { ...kpi, deltaContext: ctx, ...ov };
    });
  })();
  const auditData = getAuditData(store);
  const aiInsight = getAIInsight(store);
  const vocData = getVoCData(store);
  const inventoryData = getInventoryData(store);
  const alerts = getAlerts(store);

  // Filter broadcasts to only those where this store has a non-completed status
  const storeBroadcasts = broadcastActions.filter(bc => {
    const storeRow = bc.storeBreakdown.find(s => s.storeNumber === store.number);
    return storeRow && storeRow.status !== 'completed';
  });

  // Reset active broadcast when store changes
  useEffect(() => {
    if (storeBroadcasts.length > 0) {
      setActiveBroadcast(storeBroadcasts[0]);
    }
  }, [selectedStoreId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredStores = storesData.filter(s =>
    s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
    s.number.includes(storeSearch)
  );

  const getBenchmarks = () => compBenchmarks.map(b => {
    const storeVal = b.metric === 'Sales vs Plan' ? (store.dpi >= 85 ? 104.2 : store.dpi >= 75 ? 97.8 : 91.3)
      : b.metric === 'SEA Score' ? (store.dpi >= 80 ? 91 : 76)
      : b.metric === 'VoC Score' ? (store.dpi >= 80 ? 4.3 : 3.6)
      : b.metric === 'Availability' ? (store.dpi >= 80 ? 96.8 : 89.2)
      : (store.dpi >= 85 ? 42.1 : store.dpi >= 75 ? 39.8 : 37.2);
    const vsCluster = storeVal - b.clusterAvg;
    const vsChain = storeVal - b.chainAvg;
    return { ...b, storeVal, vsCluster, vsChain };
  });

  return (
    <div className="sc-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="sc-loading-overlay">
          <div className="sc-loading-card">
            <div className="sc-loading-spinner" />
            <h3>Loading Store Profile</h3>
            <p>Fetching data for <strong>{store.name}</strong> #{store.number}</p>
          </div>
        </div>
      )}

      {/* ── Page Title ──────────────────────────────────── */}
      <div className="sc-page-title-bar">
        <h1 className="sc-page-title">Store Deep Dive</h1>
      </div>

      {/* ── Context Header ──────────────────────────────── */}
      <div className="sc-context-header">
        <div className="sc-ctx-left">
          <div className="sc-store-selector-wrap">
            <button className="sc-store-selector" onClick={() => setShowStoreSelector(!showStoreSelector)}>
              <Store size={18} />
              <div className="sc-selector-text">
                <span className="sc-selector-name">{store.name}</span>
                <span className="sc-selector-meta">#{store.number} · {store.format} · {store.cluster}</span>
              </div>
              <ChevronDown size={16} className={`sc-selector-chevron ${showStoreSelector ? 'open' : ''}`} />
            </button>

            {showStoreSelector && (
              <div className="sc-store-dropdown">
                <div className="sc-dropdown-search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search stores..."
                    value={storeSearch}
                    onChange={e => setStoreSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="sc-dropdown-list">
                  {filteredStores.map(s => (
                    <button
                      key={s.id}
                      className={`sc-dropdown-item ${s.id === selectedStoreId ? 'active' : ''}`}
                      onClick={() => { setSelectedStoreId(s.id); setShowStoreSelector(false); setStoreSearch(''); }}
                    >
                      <div className="sc-dropdown-item-left">
                        <span className="sc-dropdown-item-name">{s.name}</span>
                        <span className="sc-dropdown-item-meta">#{s.number} · {s.format}</span>
                      </div>
                      <div className="sc-dropdown-item-right">
                        <span className={`sc-dropdown-dpi sc-dpi--${s.risk}`}>{s.dpi}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="sc-ctx-badges">
            <span className={`sc-badge sc-badge--tier-${store.tier.toLowerCase().replace(/\s+/g, '-')}`}>{store.tier}</span>
            <span className={`sc-badge sc-badge--risk-${store.risk}`}>
              {store.risk === 'high' ? <AlertTriangle size={11} /> : store.risk === 'moderate' ? <AlertCircle size={11} /> : <CheckCircle size={11} />}
              {store.risk.charAt(0).toUpperCase() + store.risk.slice(1)} Risk
            </span>
          </div>

          {/* Period Selector — uses same classes as District Intelligence Hub */}
          <div className="calendar-picker-wrapper">
            <button className="period-selector" onClick={() => setShowCalendar(!showCalendar)}>
              <Calendar size={14} />
              <span>{getSelectedPeriodLabel()}</span>
              <ChevronDown size={14} className={showCalendar ? 'rotated' : ''} />
            </button>

            {showCalendar && (
              <div className="calendar-dropdown">
                <div className="calendar-mode-toggle">
                  <button
                    className={`mode-btn ${calendarMode === 'week' ? 'active' : ''}`}
                    onClick={() => { setCalendarMode('week'); if (selectedWeekStart) { setViewingMonth(selectedWeekStart.getMonth()); setViewingYear(selectedWeekStart.getFullYear()); } }}
                  >Week</button>
                  <button
                    className={`mode-btn ${calendarMode === 'month' ? 'active' : ''}`}
                    onClick={() => { setCalendarMode('month'); if (selectedMonth) { setViewingMonth(selectedMonth.getMonth()); setViewingYear(selectedMonth.getFullYear()); } }}
                  >Month</button>
                  <button
                    className={`mode-btn ${calendarMode === 'quarter' ? 'active' : ''}`}
                    onClick={() => setCalendarMode('quarter')}
                  >Quarter</button>
                </div>

                {calendarMode === 'quarter' ? (
                  <div className="quarter-list">
                    {availableQuarters.map((q, idx) => (
                      <button
                        key={idx}
                        className={`quarter-option ${selectedQuarter?.quarter === q.quarter && selectedQuarter?.year === q.year ? 'selected' : ''}`}
                        onClick={() => { setSelectedQuarter(q); setShowCalendar(false); }}
                      >
                        <span className="quarter-label">Q{q.quarter} {q.year}</span>
                        <span className="quarter-range">{q.label.match(/\((.+)\)/)?.[1]}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="calendar-nav">
                      <button className="nav-btn" onClick={() => navigateMonth(-1)}>
                        <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />
                      </button>
                      <div className="calendar-month-year">
                        <span className="calendar-month">{['January','February','March','April','May','June','July','August','September','October','November','December'][viewingMonth]}</span>
                        <span className="calendar-year">{viewingYear}</span>
                      </div>
                      <button className="nav-btn" onClick={() => navigateMonth(1)}>
                        <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                      </button>
                    </div>

                    <div className="calendar-grid">
                      <div className="calendar-weekdays">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="calendar-days">
                        {calendarDays.map((entry, index) => {
                          if (entry.trailing) {
                            return <button key={index} className="calendar-day trailing" disabled>{entry.day}</button>;
                          }
                          const day = entry.day;
                          const date = new Date(viewingYear, viewingMonth, day);
                          const isDisabledWeek = isDateInFuture(date) || isDateInCurrentWeek(date);
                          const isDisabledMonth = viewingYear > new Date().getFullYear() || (viewingYear === new Date().getFullYear() && viewingMonth >= new Date().getMonth());
                          const isDisabled = calendarMode === 'week' ? isDisabledWeek : isDisabledMonth;
                          const isSelectedWeek = isInSelectedWeek(day);
                          const isSelectedMo = selectedMonth && viewingYear === selectedMonth.getFullYear() && viewingMonth === selectedMonth.getMonth();
                          const isSelected = calendarMode === 'week' ? isSelectedWeek : !!isSelectedMo;
                          return (
                            <button
                              key={index}
                              className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                              disabled={isDisabled}
                              onClick={() => {
                                if (calendarMode === 'week') { handleDayClick(day); }
                                else if (!isDisabledMonth) { setSelectedMonth(new Date(viewingYear, viewingMonth, 1)); setShowCalendar(false); }
                              }}
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
        </div>

        <div className="sc-ctx-right">
          <div className="sc-ctx-stat sc-ctx-dpi">
            <span className="sc-ctx-stat-value">{store.dpi}</span>
            <div className="sc-ctx-stat-info">
              <span className="sc-ctx-stat-label">DPI</span>
              <span className={`sc-ctx-stat-delta sc-delta--${store.dpiDelta >= 0 ? 'up' : 'down'}`}>
                {store.dpiDelta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {store.dpiDelta >= 0 ? '+' : ''}{store.dpiDelta}
              </span>
            </div>
          </div>
          <div className="sc-ctx-stat">
            <span className="sc-ctx-stat-value">#{store.rank}</span>
            <div className="sc-ctx-stat-info">
              <span className="sc-ctx-stat-label">Rank</span>
              <span className="sc-ctx-stat-sub">of {store.totalStores}</span>
            </div>
          </div>
          <div className="sc-ctx-stat">
            <span className={`sc-ctx-momentum sc-momentum--${store.momentum}`}>
              {store.momentum === 'rising' ? <TrendingUp size={14} /> : store.momentum === 'declining' ? <TrendingDown size={14} /> : <Minus size={14} />}
            </span>
            <div className="sc-ctx-stat-info">
              <span className="sc-ctx-stat-label">Momentum</span>
              <span className="sc-ctx-stat-sub">{store.momentum}</span>
            </div>
          </div>
          <div className="sc-ctx-refresh">
            <Clock size={12} />
            <span>{store.lastRefresh}</span>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showStoreSelector && <div className="sc-overlay" onClick={() => { setShowStoreSelector(false); setStoreSearch(''); }} />}

      <div className="sc-scroll-area" ref={scrollRef}>
        {/* ── KPI Tiles ──────────────────────────────────── */}
        <div className="sc-kpi-section">
          {isDateFilterActive && <div className="sc-section-filter-badge"><Filter size={11} className="filter-active-icon" /><span>{getSelectedPeriodLabel()}</span></div>}
          <div className="sc-kpi-grid">
            {kpis.map(kpi => {
              const data = kpi.trendData;
              const min = Math.min(...data);
              const max = Math.max(...data);
              const range = max - min || 1;
              const W = 120, H = 44, P = 3;
              const points = data.map((v, i) => ({
                x: (i / (data.length - 1)) * W,
                y: H - P - ((v - min) / range) * (H - P * 2),
              }));
              const path = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');
              const areaPath = `${path} L ${W},${H} L 0,${H} Z`;
              const last = points[points.length - 1];
              const color = kpi.status === 'positive' ? '#047857' : kpi.status === 'negative' ? '#991b1b' : '#4338ca';
              return (
                <button key={kpi.id} className={`sc-kpi-tile sc-kpi--${kpi.status}`} onClick={() => setTrendModal(kpi)}>
                  <div className="sc-kpi-tile-header">
                    <span className="sc-kpi-icon">{kpi.icon}</span>
                    <span className="sc-kpi-label">{kpi.label}</span>
                  </div>
                  <div className="sc-kpi-tile-body">
                    <span className="sc-kpi-value">{kpi.value}<span className="sc-kpi-unit">{kpi.unit}</span></span>
                    <span className={`sc-kpi-delta sc-delta--${kpi.deltaDir}`}>
                      {kpi.deltaDir === 'up' ? <ArrowUpRight size={12} /> : kpi.deltaDir === 'down' ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                      {kpi.delta}
                      {kpi.deltaContext && <span className="sc-kpi-delta-ctx">{kpi.deltaContext}</span>}
                    </span>
                  </div>
                  {kpi.insight && (
                    <div className="sc-kpi-insight">
                      <span className="sc-kpi-insight-dot" />
                      <span>{kpi.insight}</span>
                    </div>
                  )}
                  <div className="sc-kpi-spark">
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="sc-spark-svg">
                      <defs>
                        <linearGradient id={`sc-spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity="0.08" />
                          <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill={`url(#sc-spark-${kpi.id})`} />
                      <path d={path} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter" />
                      <circle cx={last.x} cy={last.y} r="1.8" fill={color} stroke="#ffffff" strokeWidth="1" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Operational Compliance View ──────────────────── */}
        <div className="ocv-section">
          <div className="ocv-header">
            <div className="ocv-title-row">
              <div className="ocv-icon-wrap">
                <ClipboardCheck size={18} />
              </div>
              <div className="ocv-title-text">
                <h3>Operational Compliance View</h3>
                <span className="ocv-subtitle">Broadcast → Action → Execution tracking</span>
              </div>
            </div>
            {storeBroadcasts.length > 0 ? (
              <div className="ocv-kpi-pills">
                <div className="ocv-kpi-pill">
                  <span className="ocv-kpi-val">{activeBroadcast.completionPct}%</span>
                  <span className="ocv-kpi-lbl">Completion</span>
                </div>
                <div className="ocv-kpi-pill ocv-kpi--pending">
                  <span className="ocv-kpi-val">{activeBroadcast.pendingStores}</span>
                  <span className="ocv-kpi-lbl">Pending</span>
                </div>
                <div className="ocv-kpi-pill ocv-kpi--overdue">
                  <span className="ocv-kpi-val">{activeBroadcast.overdueStores}</span>
                  <span className="ocv-kpi-lbl">Overdue</span>
                </div>
              </div>
            ) : (
              <div className="ocv-kpi-pills">
                <div className="ocv-kpi-pill" style={{ background: '#dcfce7', borderColor: '#bbf7d0' }}>
                  <span className="ocv-kpi-val" style={{ color: '#15803d' }}>All Clear</span>
                </div>
              </div>
            )}
          </div>

          {storeBroadcasts.length > 0 ? (
            <>
              <div className="ocv-broadcast-tabs">
                {storeBroadcasts.map(bc => (
                  <button
                    key={bc.broadcastId}
                    className={`ocv-bc-tab ${activeBroadcast.broadcastId === bc.broadcastId ? 'active' : ''}`}
                    onClick={() => setActiveBroadcast(bc)}
                  >
                    <span className={`ocv-bc-tab-dot ocv-status--${bc.storeStatus}`} />
                    <span className="ocv-bc-tab-title">{bc.broadcastTitle.length > 40 ? bc.broadcastTitle.slice(0, 40) + '…' : bc.broadcastTitle}</span>
                    <span className={`ocv-bc-tab-priority ocv-pri--${bc.priority}`}>{bc.priority}</span>
                  </button>
                ))}
              </div>

              <div className="ocv-zones">
            {/* LEFT: Broadcast Feed */}
            <div className="ocv-zone ocv-zone-broadcast">
              <div className="ocv-zone-label">
                <Megaphone size={14} />
                <span>Broadcast Feed</span>
              </div>
              <div className="ocv-broadcast-card">
                <div className="ocv-bc-title">{activeBroadcast.broadcastTitle}</div>
                <div className="ocv-bc-meta">
                  <span className={`ocv-bc-priority ocv-pri--${activeBroadcast.priority}`}>
                    {activeBroadcast.priority === 'critical' && <CircleAlert size={11} />}
                    {activeBroadcast.priority === 'high' && <AlertTriangle size={11} />}
                    {activeBroadcast.priority === 'medium' && <Bell size={11} />}
                    {activeBroadcast.priority}
                  </span>
                  <span className="ocv-bc-time">
                    <Clock size={11} />
                    {activeBroadcast.sentAt}
                  </span>
                </div>
                <div className="ocv-bc-sender">
                  <Send size={11} />
                  <span>{activeBroadcast.sender}</span>
                  <span className="ocv-bc-source">· {activeBroadcast.source}</span>
                </div>
                <button className="ocv-cta-btn" onClick={() => setOcvExpandedRow(ocvExpandedRow === 'instructions' ? null : 'instructions')}>
                  <FileText size={13} />
                  View Instructions
                  <ChevronRight size={13} />
                </button>
                {ocvExpandedRow === 'instructions' && (
                  <div className="ocv-instructions-panel">
                    <p className="ocv-instr-heading">Broadcast Instructions</p>
                    <p><strong>Action Required:</strong> {activeBroadcast.actionTitle}</p>
                    <p><strong>Priority:</strong> {activeBroadcast.priority.charAt(0).toUpperCase() + activeBroadcast.priority.slice(1)}</p>
                    <p><strong>SLA / Due:</strong> {activeBroadcast.slaDue}</p>
                    <p><strong>Issued By:</strong> {activeBroadcast.sender} — {activeBroadcast.source}</p>
                    <p><strong>Scope:</strong> {activeBroadcast.actionCount} stores assigned</p>
                    <p><strong>Sent:</strong> {activeBroadcast.sentAt}</p>
                  </div>
                )}
              </div>
            </div>

            {/* CENTER: Action Mapping */}
            <div className="ocv-zone ocv-zone-actions">
              <div className="ocv-zone-label">
                <ListChecks size={14} />
                <span>Action Mapping</span>
              </div>
              <div className="ocv-action-card">
                <div className="ocv-action-flow">
                  <div className="ocv-flow-step">
                    <Megaphone size={13} />
                    <span>Broadcast</span>
                  </div>
                  <div className="ocv-flow-arrow">→</div>
                  <div className="ocv-flow-step">
                    <ListChecks size={13} />
                    <span>Action Created</span>
                  </div>
                  <div className="ocv-flow-arrow">→</div>
                  <div className="ocv-flow-step">
                    <CircleCheck size={13} />
                    <span>Execution</span>
                  </div>
                </div>
                <div className="ocv-action-detail">
                  <div className="ocv-action-title">{activeBroadcast.actionTitle}</div>
                  <div className="ocv-action-meta-row">
                    <div className="ocv-action-meta-item">
                      <Store size={12} />
                      <span>{activeBroadcast.actionCount} store actions</span>
                    </div>
                    <div className="ocv-action-meta-item">
                      <Timer size={12} />
                      <span>SLA: {activeBroadcast.slaDue}</span>
                    </div>
                  </div>
                </div>
                <div className="ocv-progress-bar-wrap">
                  <div className="ocv-progress-label">
                    <span>Progress</span>
                    <span className="ocv-progress-pct">{activeBroadcast.completionPct}%</span>
                  </div>
                  <div className="ocv-progress-bar">
                    <div
                      className={`ocv-progress-fill ocv-status--${activeBroadcast.storeStatus}`}
                      style={{ width: `${activeBroadcast.completionPct}%` }}
                    />
                  </div>
                </div>
                <button className="ocv-cta-btn" onClick={() => navigate(`/command-center/operations-queue?broadcast=${activeBroadcast.broadcastId}`)}>
                  <Zap size={13} />
                  View Operation Queue
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* RIGHT: Execution Status */}
            <div className="ocv-zone ocv-zone-execution">
              <div className="ocv-zone-label">
                <CircleCheck size={14} />
                <span>Execution Status</span>
              </div>
              <div className="ocv-execution-card">
                {(() => {
                  const storeRow = activeBroadcast.storeBreakdown.find(s => s.storeNumber === store.number);
                  const isMarkedDone = ocvCompletedActions.has(`${activeBroadcast.broadcastId}-${store.number}`);
                  const effectiveStatus = isMarkedDone ? 'completed' : storeRow?.status || 'pending';
                  return (
                    <div className="ocv-store-status">
                      <div className="ocv-store-status-header">
                        <span className="ocv-store-label">Store #{store.number} — {store.name}</span>
                        <span className={`ocv-status-badge ocv-status--${effectiveStatus}`}>
                          {effectiveStatus === 'completed' && <CircleCheck size={12} />}
                          {effectiveStatus === 'in-progress' && <Timer size={12} />}
                          {effectiveStatus === 'pending' && <Clock size={12} />}
                          {effectiveStatus === 'overdue' && <CircleAlert size={12} />}
                          {effectiveStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      {(effectiveStatus === 'completed' || isMarkedDone) && (
                        <div className="ocv-completed-info">
                          <div className="ocv-completed-row">
                            <Users size={12} />
                            <span>Completed by: {isMarkedDone ? 'You (just now)' : storeRow?.completedBy || '—'}</span>
                          </div>
                          <div className="ocv-completed-row">
                            <Clock size={12} />
                            <span>{isMarkedDone ? 'Just now' : storeRow?.completionTs || '—'}</span>
                          </div>
                        </div>
                      )}
                      {effectiveStatus !== 'completed' && !isMarkedDone && (
                        <button
                          className="ocv-mark-done-btn"
                          onClick={() => {
                            setOcvCompletedActions(prev => {
                              const next = new Set(prev);
                              next.add(`${activeBroadcast.broadcastId}-${store.number}`);
                              return next;
                            });
                          }}
                        >
                          <CheckCircle2 size={14} />
                          Mark Done
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
              </div>
            </>
          ) : (
            <div className="ocv-all-clear">
              <div className="ocv-all-clear-icon">
                <CheckCircle2 size={24} />
              </div>
              <p className="ocv-all-clear-text">No active compliance actions for <strong>{store.name}</strong>. All broadcasts have been completed.</p>
            </div>
          )}
        </div>

        {/* ── 8-Week Audit Lens ──────────────────────────── */}
        <div className="sc-audit-section">
          <div className="sc-section-header">
            <div className="sc-section-title-row">
              <ClipboardCheck size={18} />
              <h3>8-Week Audit Lens</h3>
              {isDateFilterActive && <Filter size={12} className="filter-active-icon" />}
            </div>
            <span className="sc-section-subtitle">Execution consistency across audit categories</span>
          </div>
          <div className="sc-audit-grid">
            <div className="sc-audit-row sc-audit-header-row">
              <span className="sc-audit-cat-label">Category</span>
              {auditData.map(w => (
                <button key={w.weekLabel} className="sc-audit-week-btn" onClick={() => setAuditWeekDetail(w)}>
                  <span className="sc-audit-week-label">{w.weekLabel}</span>
                  <span className="sc-audit-week-date">{w.date}</span>
                </button>
              ))}
            </div>
            {['overall', 'safety', 'planogram', 'signage', 'cleanliness', 'availability', 'staffing', 'stockRotation', 'pricing', 'backroom', 'customerArea'].map(cat => (
              <div key={cat} className={`sc-audit-row ${cat === 'overall' ? 'sc-audit-row--overall' : ''}`}>
                <span className="sc-audit-cat-label">{cat === 'stockRotation' ? 'Stock Rotation' : cat === 'customerArea' ? 'Customer Area' : cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                {auditData.map(w => {
                  const val = w[cat as keyof AuditWeek] as number;
                  return (
                    <div
                      key={w.weekLabel}
                      className="sc-audit-cell"
                      style={{ background: getComplianceColor(val), color: getComplianceTextColor(val) }}
                      onClick={() => setAuditWeekDetail(w)}
                    >
                      {val}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Insight ─────────────────────────────────── */}
        <div className="sc-ai-section">
          <div className="sc-section-header">
            <div className="sc-section-title-row">
              <Sparkles size={18} />
              <h3>AI Insight</h3>
              {isDateFilterActive && <Filter size={12} className="filter-active-icon" />}
            </div>
            <span className="sc-section-subtitle">Root cause analysis and recommended actions</span>
          </div>

          <div className="sc-ai-body">
            <div className="sc-ai-narrative">
              <div className="sc-ai-narrative-label">
                <Eye size={13} />
                Root Cause
              </div>
              <p>{aiInsight.rootCause}</p>
              <button className="sc-ai-expand-btn" onClick={() => setShowCausalChain(!showCausalChain)}>
                {showCausalChain ? 'Hide' : 'Show'} Causal Chain
                <ChevronDown size={14} className={showCausalChain ? 'rotated' : ''} />
              </button>

              {showCausalChain && (
                <div className="sc-causal-chain">
                  {aiInsight.causalChain.map(item => (
                    <div key={item.factor} className={`sc-causal-item sc-causal--${item.direction}`}>
                      <div className="sc-causal-bar" style={{ width: `${item.contribution}%` }} />
                      <span className="sc-causal-factor">{item.factor}</span>
                      <span className="sc-causal-pct">{item.contribution}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sc-ai-actions">
              <div className="sc-ai-actions-label">
                <Target size={13} />
                Ranked Actions
              </div>
              <div className="sc-ai-action-list">
                {aiInsight.actions.map(a => (
                  <div key={a.priority} className="sc-ai-action-item">
                    <span className="sc-ai-action-rank">#{a.priority}</span>
                    <div className="sc-ai-action-content">
                      <span className="sc-ai-action-text">{a.action}</span>
                      <div className="sc-ai-action-meta">
                        <span className="sc-ai-action-module">{a.module}</span>
                        <span className="sc-ai-action-impact">{a.impact}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="sc-ai-action-arrow" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Multi-Tab Deep Dive ────────────────────────── */}
        <div className="sc-deepdive-section">
          <div className="sc-deepdive-tabs">
            {[
              { id: 'voc' as const, label: 'VoC Analysis', icon: <Heart size={14} /> },
              { id: 'inventory' as const, label: 'Inventory & Inbound', icon: <Package size={14} /> },
              { id: 'benchmarking' as const, label: 'Comp Benchmarking', icon: <BarChart3 size={14} /> },
              { id: 'alerts' as const, label: 'Alert Stream', icon: <Bell size={14} />, count: alerts.filter(a => a.type === 'critical').length },
            ].map(tab => (
              <button
                key={tab.id}
                className={`sc-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && <span className="sc-tab-badge">{tab.count}</span>}
              </button>
            ))}
          </div>

          <div className="sc-deepdive-content">
            {/* VoC Tab */}
            {activeTab === 'voc' && (
              <div className="sc-voc-tab">
                {vocData.map(item => (
                  <div key={item.theme} className={`sc-voc-card sc-voc--${item.sentiment}`}>
                    <div className="sc-voc-card-header">
                      <span className="sc-voc-theme">{item.theme}</span>
                      <span className={`sc-voc-sentiment sc-sentiment--${item.sentiment}`}>{item.sentiment}</span>
                    </div>
                    <div className="sc-voc-stats">
                      <span className="sc-voc-volume">{item.volume} mentions</span>
                      <span className={`sc-voc-delta ${item.delta >= 0 ? 'sc-delta--up' : 'sc-delta--down'}`}>
                        {item.delta >= 0 ? '+' : ''}{item.delta}%
                      </span>
                    </div>
                    <p className="sc-voc-comment">{item.topComment}</p>
                    <span className="sc-voc-source">{item.source}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="sc-inventory-tab">
                <table className="sc-inv-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Qty</th>
                      <th>Days of Supply</th>
                      <th>ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.map(item => (
                      <tr key={item.sku} className={`sc-inv-row sc-inv--${item.status}`}>
                        <td className="sc-inv-sku">{item.sku}</td>
                        <td>{item.name}</td>
                        <td><span className={`sc-inv-status sc-inv-status--${item.status}`}>{item.status.replace('-', ' ')}</span></td>
                        <td className="sc-inv-qty">{item.quantity}</td>
                        <td className="sc-inv-dos">{item.daysOfSupply > 0 ? `${item.daysOfSupply}d` : '—'}</td>
                        <td className="sc-inv-eta">{item.inboundEta || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Benchmarking Tab */}
            {activeTab === 'benchmarking' && (
              <div className="sc-bench-tab">
                <div className="sc-bench-legend">
                  <span className="sc-bench-legend-item"><span className="sc-legend-dot sc-legend-dot--store" />This Store</span>
                  <span className="sc-bench-legend-item"><span className="sc-legend-dot sc-legend-dot--cluster" />Cluster Avg</span>
                  <span className="sc-bench-legend-item"><span className="sc-legend-dot sc-legend-dot--chain" />Chain Avg</span>
                </div>
                <div className="sc-bench-cards">
                  {getBenchmarks().map(b => {
                    const fmt = (v: number) => (v % 1 !== 0 ? v.toFixed(1) : String(v));
                    const fmtDelta = (v: number) => (v >= 0 ? '+' : '') + (v % 1 !== 0 ? v.toFixed(1) : String(v));
                    return (
                      <div key={b.metric} className="sc-bench-card">
                        <div className="sc-bench-card-header">
                          <span className="sc-bench-metric">{b.metric}</span>
                          <span className="sc-bench-unit">{b.unit}</span>
                        </div>
                        <div className="sc-bench-card-body">
                          <div className="sc-bench-store-val">
                            <span className="sc-bench-big-num">{fmt(b.storeVal)}</span>
                            <span className="sc-bench-unit-small">{b.unit}</span>
                          </div>
                          <div className="sc-bench-comparisons">
                            <div className="sc-bench-comp-row">
                              <span className="sc-bench-comp-label">vs Cluster</span>
                              <div className="sc-bench-comp-pill-wrap">
                                <span className={`sc-bench-comp-pill ${b.vsCluster >= 0 ? 'sc-comp-positive' : 'sc-comp-negative'}`}>
                                  {b.vsCluster >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                                  {fmtDelta(b.vsCluster)}
                                </span>
                                <span className="sc-bench-comp-avg">{fmt(b.clusterAvg)}</span>
                              </div>
                            </div>
                            <div className="sc-bench-comp-row">
                              <span className="sc-bench-comp-label">vs Chain</span>
                              <div className="sc-bench-comp-pill-wrap">
                                <span className={`sc-bench-comp-pill ${b.vsChain >= 0 ? 'sc-comp-positive' : 'sc-comp-negative'}`}>
                                  {b.vsChain >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                                  {fmtDelta(b.vsChain)}
                                </span>
                                <span className="sc-bench-comp-avg">{fmt(b.chainAvg)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="sc-bench-visual-bar">
                          <div className="sc-bench-vbar-track">
                            <div className="sc-bench-vbar-chain" style={{ left: `${Math.min(95, (b.chainAvg / (Math.max(b.storeVal, b.clusterAvg, b.chainAvg) * 1.15)) * 100)}%` }} />
                            <div className="sc-bench-vbar-cluster" style={{ left: `${Math.min(95, (b.clusterAvg / (Math.max(b.storeVal, b.clusterAvg, b.chainAvg) * 1.15)) * 100)}%` }} />
                            <div className={`sc-bench-vbar-store ${b.storeVal >= b.clusterAvg ? 'sc-vbar-ahead' : 'sc-vbar-behind'}`} style={{ width: `${Math.min(98, (b.storeVal / (Math.max(b.storeVal, b.clusterAvg, b.chainAvg) * 1.15)) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="sc-alerts-tab">
                {alerts.map(alert => (
                  <div key={alert.id} className={`sc-alert-card sc-alert--${alert.type}`}>
                    <div className="sc-alert-icon">
                      {alert.type === 'critical' ? <AlertTriangle size={16} /> : alert.type === 'warning' ? <AlertCircle size={16} /> : <Info size={16} />}
                    </div>
                    <div className="sc-alert-body">
                      <div className="sc-alert-header">
                        <span className="sc-alert-title">{alert.title}</span>
                        <span className="sc-alert-time">{alert.time}</span>
                      </div>
                      <p className="sc-alert-detail">{alert.detail}</p>
                      <span className="sc-alert-source">{alert.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Trend Modal ──────────────────────────────────── */}
      {trendModal && (
        <div className="sc-modal-overlay" onClick={() => setTrendModal(null)}>
          <div className="sc-modal" onClick={e => e.stopPropagation()}>
            <div className="sc-modal-header">
              <div className="sc-modal-title-row">
                {trendModal.icon}
                <h3>{trendModal.label} — {calendarMode === 'week' ? '12-Week' : calendarMode === 'month' ? '7-Month' : '4-Quarter'} Trend</h3>
              </div>
              <button className="sc-modal-close" onClick={() => setTrendModal(null)}><X size={18} /></button>
            </div>
            <div className="sc-modal-body">
              <div className="sc-trend-chart">
                {(() => {
                  const n = trendModal.trendData.length;
                  const padL = 50, padR = 30;
                  const spacing = 60;
                  const chartW = padL + (n - 1) * spacing + padR;
                  const color = trendModal.status === 'positive' ? '#10b981' : trendModal.status === 'negative' ? '#ef4444' : '#6366f1';
                  const min = Math.min(...trendModal.trendData) * 0.95;
                  const max = Math.max(...trendModal.trendData) * 1.05;
                  const range = max - min || 1;
                  const pts = trendModal.trendData.map((v, i) => ({
                    x: padL + i * spacing,
                    y: 155 - ((v - min) / range) * 130,
                    v,
                  }));
                  return (
                    <svg viewBox={`0 0 ${chartW} 190`} className="sc-trend-svg">
                      {[0, 1, 2, 3, 4].map(i => (
                        <line key={i} x1={padL - 10} y1={20 + i * 35} x2={chartW - padR + 10} y2={20 + i * 35} stroke="#f1f5f9" strokeWidth="1" />
                      ))}
                      <polyline
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                      />
                      {pts.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="2" />
                          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="#64748b">{p.v}</text>
                        </g>
                      ))}
                      {trendModal.trendLabels.map((label, i) => (
                        <text key={i} x={padL + i * spacing} y={182} textAnchor="middle" fontSize="10" fill="#94a3b8">{label}</text>
                      ))}
                    </svg>
                  );
                })()}
              </div>
              <div className="sc-trend-insight">
                <Sparkles size={14} />
                <span>{trendModal.insight}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Audit Week Detail Modal ──────────────────────── */}
      {auditWeekDetail && (
        <div className="sc-modal-overlay" onClick={() => setAuditWeekDetail(null)}>
          <div className="sc-modal sc-modal--audit" onClick={e => e.stopPropagation()}>
            <div className="sc-modal-header">
              <div className="sc-modal-title-row">
                <ClipboardCheck size={18} />
                <h3>Audit Detail — {auditWeekDetail.weekLabel} ({auditWeekDetail.date})</h3>
              </div>
              <button className="sc-modal-close" onClick={() => setAuditWeekDetail(null)}><X size={18} /></button>
            </div>
            <div className="sc-modal-body">
              <div className="sc-audit-detail-grid">
                {(['safety', 'planogram', 'signage', 'cleanliness', 'availability', 'staffing', 'stockRotation', 'pricing', 'backroom', 'customerArea'] as const).map(cat => {
                  const val = auditWeekDetail[cat];
                  const label = cat === 'stockRotation' ? 'Stock Rotation' : cat === 'customerArea' ? 'Customer Area' : cat.charAt(0).toUpperCase() + cat.slice(1);
                  return (
                    <div key={cat} className="sc-audit-detail-card">
                      <div className="sc-audit-detail-bar" style={{ background: getComplianceColor(val), width: `${val}%` }} />
                      <div className="sc-audit-detail-info">
                        <span className="sc-audit-detail-cat">{label}</span>
                        <span className="sc-audit-detail-val" style={{ color: getComplianceTextColor(val) }}>{val}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="sc-audit-overall-row">
                <span>Overall Score</span>
                <span className="sc-audit-overall-val" style={{ color: getComplianceTextColor(auditWeekDetail.overall) }}>{auditWeekDetail.overall}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
