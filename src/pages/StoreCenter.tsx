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
  Download,
  RefreshCw,
  Clock,
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
import { AIDailyBrief, AIDailyBriefData } from '../components/common/AIDailyBrief';
import { useAuth } from '../context/AuthContext';
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

// ── Store-level AI Daily Brief — tier-aware narrative ──────────
const getStoreBrief = (store: StoreMeta): AIDailyBriefData => {
  const isExcellent = store.dpi >= 88;
  const isStable = store.dpi >= 78 && store.dpi < 88;
  const isAtRisk = store.dpi >= 65 && store.dpi < 78;
  if (isExcellent) {
    return {
      greeting: `${store.name} (#${store.number}) is leading the district at SPI ${store.dpi} — benchmark performance with all streams in green.`,
      sections: [
        { title: 'Performance Highlights', icon: 'performance', bullets: [
          `SPI of <strong>${store.dpi}</strong> ranks <strong>#${store.rank} of ${store.totalStores}</strong> — Excellence tier sustained.`,
          'Net sales tracking <strong>+4.2% vs plan</strong> consistently for 6 weeks.',
          'VoC satisfaction at <strong>4.3/5</strong> — top theme \"Friendly Staff\" mentioned in 38% of positive reviews.',
        ]},
        { title: 'Operational Excellence', icon: 'ops', bullets: [
          'Shelf audit compliance <strong>91/100</strong>, planogram adherence at 96% — no critical SEA findings open.',
          'Stock availability <strong>96.8%</strong> with zero OOS-risk SKUs flagged for the week.',
          'Margin held at <strong>42.1%</strong> with markdown discipline preserved through season.',
        ]},
        { title: 'Recommended Actions', icon: 'recommendations', bullets: [
          'Codify your playbook — schedule a knowledge-share with peer-store managers next week.',
          'Begin preparing for seasonal transition: review markdown plan and pre-stage incoming Spring assortment.',
        ]},
      ],
      closing: 'Sustain momentum and protect against complacency. Consider mentoring a peer store currently in At-Risk tier.',
    };
  }
  if (isStable) {
    return {
      greeting: `${store.name} (#${store.number}) is tracking plan at SPI ${store.dpi} — execution steady with minor opportunities to push into Excellence.`,
      sections: [
        { title: 'Performance & Trends', icon: 'performance', bullets: [
          `SPI of <strong>${store.dpi}</strong> places you mid-pack at #${store.rank} of ${store.totalStores} — momentum is ${store.momentum}.`,
          'Net sales at <strong>+1.2% vs plan</strong> — opportunity in Footwear which is trailing district by 3.4 pts.',
          'VoC satisfaction at <strong>4.0/5</strong>, slight dip from 4.2 — \"Checkout Speed\" mentions trending up.',
        ]},
        { title: 'Operational Notes', icon: 'ops', bullets: [
          'Shelf audit compliance <strong>86/100</strong> — Cleanliness category needs attention (-4 pts vs target).',
          '2 OOS-risk SKUs in Basics — replenishment scheduled for tomorrow.',
        ]},
        { title: 'Recommended Actions', icon: 'recommendations', bullets: [
          'Run a Footwear category review with the dept lead to identify the assortment gap vs peer stores.',
          'Increase checkout coverage during peak (12-2pm, 5-7pm) to address the rising VoC theme.',
        ]},
      ],
      closing: 'Small, focused interventions on Footwear and Checkout Speed could lift SPI 2-3 points within 2 weeks.',
    };
  }
  if (isAtRisk) {
    return {
      greeting: `${store.name} (#${store.number}) is in At-Risk territory at SPI ${store.dpi} — trend declining over the last 4 weeks. Targeted intervention required this week.`,
      sections: [
        { title: 'Triage & Critical Issues', icon: 'triage', bullets: [
          '<strong>VoC: Fitting Room Wait</strong> — complaints up <strong>+34%</strong> over 2 weeks, hitting conversion rate.',
          '<strong>OOS Risk</strong>: 8 size-run gaps in Basics, 4 SKUs critical. Replenishment delayed 36h from DC.',
          '<strong>Planogram Drift</strong>: Women\'s Wall Display 78% compliance — featured items missing or misplaced.',
        ]},
        { title: 'Performance & Trends', icon: 'performance', bullets: [
          `SPI declined <strong>${store.dpiDelta} pts</strong> over 4 weeks — trajectory points to Crisis tier within 2 weeks if uncorrected.`,
          'Net sales at <strong>-3.8% vs plan</strong>, conversion rate down 2.1 pts.',
          `Currently ranked <strong>#${store.rank} of ${store.totalStores}</strong> in district peer cluster.`,
        ]},
        { title: 'Recommended Actions', icon: 'recommendations', bullets: [
          'Increase fitting room staffing during 11am–3pm peak — biggest sales recovery lever.',
          'Expedite the 4 critical Basics SKUs from regional DC; clear backroom for inbound.',
          'Reset Women\'s Wall Display tonight — POG team can deploy in 90 minutes.',
        ]},
      ],
      closing: 'This is a recoverable position — focused execution on the three actions above should stabilize SPI within 1 week.',
    };
  }
  // Crisis
  return {
    greeting: `${store.name} (#${store.number}) is in CRISIS at SPI ${store.dpi} — multiple compounding failures across SEA, VoC, OOS and Sales. District Manager intervention today is required.`,
    sections: [
      { title: 'Triage & Critical Issues', icon: 'triage', bullets: [
        '<strong>SEA Auto-Fail</strong>: Fire exit blocked in Zone B — <strong>regulatory exposure</strong>. Must be cleared before close today.',
        '<strong>VoC Crisis</strong>: \"Messy Aisles\" and \"Staff Unavailable\" complaints up <strong>+38%</strong> in 2 weeks. NPS dropped 14 pts.',
        '<strong>OOS Surge</strong>: 14 SKUs out-of-stock, 4 shipments delayed. Estimated revenue impact €4,200 this week.',
        '<strong>Sales Miss</strong>: 4 consecutive weeks of comp sales -12%. Apparel leading the decline.',
      ]},
      { title: 'Performance & Trends', icon: 'performance', bullets: [
        `SPI dropped <strong>${store.dpiDelta} pts</strong> in 4 weeks — momentum strongly negative.`,
        'Net sales at <strong>-9.1% vs district avg</strong>; conversion rate at lowest level in 12 months.',
        `Ranked <strong>last (#${store.rank} of ${store.totalStores})</strong> in district peer cluster.`,
      ]},
      { title: 'Recommended Actions', icon: 'recommendations', bullets: [
        'Dispatch DM for on-site intervention today — escalation protocol triggered.',
        'Clear SEA auto-fail before close. Document remediation; submit to Compliance.',
        'Expedite top-10 OOS SKUs from RDC; restore baseline staffing for next 48h.',
        'Deep-clean store overnight; reset planograms in priority categories before tomorrow open.',
      ]},
    ],
    closing: 'This store requires hands-on leadership today. Escalation to Regional VP recommended if conditions persist by end of week.',
  };
};

// ── KPI Data — mirrors DI's 6 categories (Sales / VoC Sat / VoC Issue / Shelf Audit / OOS / Margin) ──
interface StoreKPI {
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

const getStoreKPIs = (store: StoreMeta): StoreKPI[] => {
  const isStrong = store.dpi >= 85;
  const isOk = store.dpi >= 75 && store.dpi < 85;
  // Use same shape and values as DI districtKPIs, lightly adjusted to store tier
  return [
    {
      id: 'sales-performance',
      category: 'commercial',
      label: 'Sales Performance',
      primaryValue: isStrong ? '$1.32M' : isOk ? '$1.18M' : '$0.94M',
      primaryUnit: 'MTD',
      microInsight: isStrong ? '4W avg $1.24M' : isOk ? '4W avg $1.12M' : '4W avg $0.97M',
      delta: isStrong ? '+4.2%' : isOk ? '+1.1%' : '-5.8%',
      deltaDirection: isStrong || isOk ? 'up' : 'down',
      deltaContext: 'YoY',
      status: isStrong ? 'positive' : isOk ? 'neutral' : 'negative',
      clickable: true,
      trendData: isStrong
        ? [980, 1020, 1050, 1010, 1080, 1120, 1060, 1100, 1150, 1180, 1200, 1320]
        : isOk
          ? [960, 970, 1000, 990, 1020, 1030, 1010, 1050, 1080, 1090, 1100, 1180]
          : [1010, 990, 980, 970, 980, 960, 950, 950, 940, 945, 935, 940],
      trendInsight: isStrong
        ? 'Consistent upward trend. Q4 seasonality effect visible. Rolling 4-week avg: $1.24M.'
        : isOk
          ? 'Plan tracking, mild upward bias. Footwear lagging peer-store contribution.'
          : 'Sales softening for 6 weeks. Conversion rate the primary drag; weekend traffic flat.',
      panelTitle: 'Sales $ — 52-Week Trend',
      panelDetails: [
        { label: 'Best Week', value: isStrong ? '$1.40M (Mar 23)' : '$1.18M (Mar 23)', status: 'positive' },
        { label: 'Worst Week', value: isStrong ? '$1.04M (Jun 23)' : '$0.92M (Jun 23)', status: 'negative' },
        { label: 'Rolling 4W Avg', value: isStrong ? '$1.24M' : '$1.05M', status: 'neutral' },
        { label: 'YoY Δ', value: isStrong ? '+4.2%' : isOk ? '+1.1%' : '-5.8%', status: isStrong || isOk ? 'positive' : 'negative' },
      ],
    },
    {
      id: 'voc-satisfaction',
      category: 'customer',
      label: 'VoC Satisfaction',
      primaryValue: isStrong ? '88%' : isOk ? '82%' : '74%',
      microInsight: isStrong ? 'Top theme: Friendly Staff' : isOk ? 'Top theme: Checkout Speed' : 'Top theme: Messy Aisles',
      delta: isStrong ? '+2.1 pts' : isOk ? '-1.4 pts' : '-4.8 pts',
      deltaDirection: isStrong ? 'up' : 'down',
      deltaContext: 'YoY',
      status: isStrong ? 'positive' : isOk ? 'warning' : 'negative',
      clickable: true,
      trendData: isStrong
        ? [82, 83, 84, 85, 84, 86, 86, 87, 86, 87, 88, 88]
        : isOk
          ? [86, 85, 85, 84, 84, 83, 84, 83, 83, 82, 82, 82]
          : [80, 79, 78, 77, 76, 76, 75, 75, 74, 75, 74, 74],
      trendInsight: isStrong
        ? 'Steady positive trend over 12 weeks. "Friendly Staff" mentioned in 38% of positive reviews.'
        : 'Gradual decline. "Messy Aisles" and "Staff Availability" emerging as top negative themes.',
      panelTitle: 'VoC Satisfaction — 52-Week Trend',
      panelDetails: [
        { label: 'Peak', value: isStrong ? '93% (Jul 21)' : '85% (Jul 21)', status: 'positive' },
        { label: 'Low', value: isStrong ? '82% (Jan 5)' : '74% (Jan 5)', status: 'negative' },
        { label: 'Top Theme (↑)', value: isStrong ? 'Friendly Staff' : 'Messy Aisles (+34%)', status: isStrong ? 'positive' : 'negative' },
        { label: 'Top Theme (↓)', value: 'Checkout Speed (improved)', status: 'positive' },
      ],
    },
    {
      id: 'voc-issue-rate',
      category: 'customer',
      label: 'VoC Issue Rate',
      primaryValue: isStrong ? '2.4' : isOk ? '3.6' : '5.1',
      primaryUnit: '/ 100 visits',
      microInsight: isStrong ? 'Below district avg' : isOk ? 'In-line with peer cluster' : 'Top quartile of issues',
      delta: isStrong ? '-0.4' : isOk ? '+0.6' : '+1.4',
      deltaDirection: isStrong ? 'down' : 'up',
      deltaContext: 'YoY',
      status: isStrong ? 'positive' : isOk ? 'warning' : 'negative',
      clickable: true,
      trendData: isStrong
        ? [2.9, 2.8, 2.7, 2.8, 2.6, 2.7, 2.5, 2.6, 2.4, 2.5, 2.4, 2.4]
        : isOk
          ? [2.8, 2.9, 3.0, 3.1, 2.9, 3.2, 3.4, 3.2, 3.5, 3.6, 3.4, 3.6]
          : [4.0, 4.2, 4.3, 4.4, 4.6, 4.7, 4.8, 4.9, 4.9, 5.0, 5.1, 5.1],
      trendInsight: isStrong
        ? 'Issue rate trending down. Strong staff coverage during peak windows.'
        : 'Spike detected in last 2 weeks. Driven primarily by "Messy Aisles" theme.',
      panelTitle: 'VoC Issue Rate — 52-Week Trend',
      panelDetails: [
        { label: 'Best', value: isStrong ? '1.9 / 100 (Jun 2)' : '2.4 / 100 (Jun 2)', status: 'positive' },
        { label: 'Worst', value: isStrong ? '3.0 / 100 (Feb 2)' : '5.1 / 100 (Feb 2)', status: 'negative' },
        { label: 'Spike Driver', value: isStrong ? 'None — stable' : 'Messy Aisles (+34%)', status: isStrong ? 'positive' : 'negative' },
        { label: 'Vs District Avg', value: isStrong ? '-1.4 (better)' : '+1.3 (worse)', status: isStrong ? 'positive' : 'warning' },
      ],
    },
    {
      id: 'shelf-audit',
      category: 'execution',
      label: 'Shelf Audit Compliance',
      primaryValue: isStrong ? '94%' : isOk ? '89%' : '78%',
      microInsight: isStrong ? 'Above target' : isOk ? '6th week below target' : 'Critical — well below target',
      delta: isStrong ? '+1 pt' : isOk ? '-6 pts' : '-17 pts',
      deltaDirection: isStrong ? 'up' : 'down',
      deltaContext: 'vs target',
      status: isStrong ? 'positive' : isOk ? 'warning' : 'negative',
      clickable: true,
      trendData: isStrong
        ? [92, 93, 91, 90, 92, 91, 93, 90, 92, 93, 94, 94]
        : isOk
          ? [92, 93, 91, 90, 92, 91, 89, 90, 88, 89, 90, 89]
          : [86, 84, 82, 80, 81, 79, 80, 78, 79, 78, 78, 78],
      trendInsight: isStrong
        ? 'Above target consistently. Cleanliness and Planogram dimensions leading.'
        : 'Below target for 6 consecutive weeks. Safety and Cleanliness pulling overall score down.',
      panelTitle: 'Shelf Audit Compliance — 52-Week Trend',
      panelDetails: [
        { label: 'Target', value: '95%', status: 'neutral' },
        { label: 'Gap', value: isStrong ? '-1pt' : isOk ? '-6pts' : '-17pts', status: isStrong ? 'warning' : 'negative' },
        { label: 'Top Category', value: 'Pricing (97%)', status: 'positive' },
        { label: 'Bottom Category', value: 'Backroom (78%)', status: 'negative' },
      ],
    },
    {
      id: 'oos-rate',
      category: 'operations',
      label: 'OOS Rate',
      primaryValue: isStrong ? '1.8%' : isOk ? '3.2%' : '6.4%',
      microInsight: isStrong ? 'Apparel 0.8%, Home 1.2%' : isOk ? 'Apparel drives 55%' : 'Apparel drives 62%',
      delta: isStrong ? '-0.3 pts' : isOk ? '+0.5 pts' : '+2.1 pts',
      deltaDirection: isStrong ? 'down' : 'up',
      deltaContext: 'WoW',
      status: isStrong ? 'positive' : isOk ? 'warning' : 'negative',
      clickable: true,
      trendData: isStrong
        ? [2.4, 2.2, 2.1, 2.0, 1.9, 2.0, 1.9, 1.8, 1.9, 1.8, 1.8, 1.8]
        : isOk
          ? [2.6, 2.7, 2.8, 2.9, 2.8, 3.0, 3.1, 3.0, 3.1, 3.2, 3.1, 3.2]
          : [4.1, 4.4, 4.7, 5.0, 5.2, 5.4, 5.6, 5.9, 6.1, 6.2, 6.3, 6.4],
      trendInsight: isStrong
        ? 'OOS contained. Replenishment SLA met 100% over last 30 days.'
        : 'Driven by Basics size-runs and delayed inbound. 4 SKUs critical this week.',
      panelTitle: 'OOS Rate — 52-Week Trend',
      panelDetails: [
        { label: 'Best', value: isStrong ? '1.4% (Jun 9)' : '2.1% (Jun 9)', status: 'positive' },
        { label: 'Worst', value: isStrong ? '2.8% (Jan 19)' : '6.8% (Jan 19)', status: 'negative' },
        { label: 'Top Driver', value: 'Basics size-run gaps', status: 'warning' },
        { label: 'Inbound Delays', value: isStrong ? '0 shipments' : '4 shipments', status: isStrong ? 'positive' : 'negative' },
      ],
    },
    {
      id: 'margin-health',
      category: 'profitability',
      label: 'Margin Health',
      primaryValue: isStrong ? '36.4%' : isOk ? '34.2%' : '31.8%',
      primaryUnit: 'GM',
      microInsight: isStrong ? 'Markdown discipline strong' : isOk ? 'In-line with district' : 'Markdown pressure rising',
      delta: isStrong ? '+30 bps' : isOk ? '+10 bps' : '-90 bps',
      deltaDirection: isStrong || isOk ? 'up' : 'down',
      deltaContext: 'WoW',
      status: isStrong ? 'positive' : isOk ? 'neutral' : 'negative',
      clickable: true,
      trendData: isStrong
        ? [35.4, 35.6, 35.8, 36.0, 35.9, 36.1, 36.0, 36.2, 36.1, 36.3, 36.2, 36.4]
        : isOk
          ? [33.8, 33.9, 34.0, 34.0, 34.1, 34.0, 34.1, 34.0, 34.1, 34.2, 34.1, 34.2]
          : [33.6, 33.4, 33.2, 33.0, 32.8, 32.6, 32.4, 32.2, 32.0, 31.9, 31.8, 31.8],
      trendInsight: isStrong
        ? 'Margin expanding through markdown discipline and full-price mix.'
        : 'Markdown pressure driving compression. Apparel category leading the decline.',
      panelTitle: 'Margin Health — 52-Week Trend',
      panelDetails: [
        { label: 'Peak', value: isStrong ? '37.0% (Aug 18)' : '34.8% (Aug 18)', status: 'positive' },
        { label: 'Low', value: isStrong ? '34.9% (Feb 9)' : '31.8% (Feb 9)', status: 'negative' },
        { label: 'Markdown Mix', value: isStrong ? '12.4%' : '18.6%', status: isStrong ? 'positive' : 'warning' },
        { label: 'Full-Price Mix', value: isStrong ? '74.2%' : '64.8%', status: isStrong ? 'positive' : 'warning' },
      ],
    },
  ];
};

// ── Audit cell findings + recommendations (mirror DI's autoFindingsMap structure) ──
const scAuditFindings: Record<string, string[]> = {
  Overall: ['Multiple sub-dimensions trending below target', 'Cross-category execution gaps observed', 'Score driven by 2-3 weak dimensions'],
  Safety: ['Fire extinguisher inspection overdue', 'Emergency exit signage faded in Zone B', 'Wet floor sign protocol inconsistent', 'First aid kit needs restocking'],
  Planogram: ['Shelf facings deviating from authorized POG', 'Endcap promotion not fully set', 'Adjacency disruption in Women\'s Wall', 'Missing labels for 3 newly added SKUs'],
  Signage: ['Price signage outdated on 6+ items', 'Promotional banner not visible from main aisle', 'Department wayfinding misaligned', 'Sale end-date signage still live post-promo'],
  Cleanliness: ['Aisle floor needs deeper clean (3, 5, 7)', 'Fitting room mirrors smudged', 'Restroom restocking schedule lapsed', 'Customer-facing endcaps dusty'],
  Availability: ['8 size-run gaps in Basics', '4 OOS-risk SKUs flagged this week', 'Backroom replenishment lagging', 'Featured promo SKU low stock'],
  Staffing: ['Coverage thin during 11am–3pm peak', 'Fitting room attendant absent during weekend', 'Cashier coverage 1 short on Fri evening', 'New hire onboarding behind schedule'],
  'Stock Rotation': ['FIFO violations in Grocery aisles', 'Date-coded items not rotated weekly', 'Backstock organization needs reset', 'Aged inventory increasing in Footwear'],
  Pricing: ['Shelf-tag mismatches on 4 SKUs', 'Promo pricing not loaded for Tuesday refresh', 'Multi-buy signage confusing in Snacks', 'Markdown stickers obscuring base price'],
  Backroom: ['Receiving area cluttered, blocking aisle access', 'Pallet rotation not following SLA', 'Hazmat segregation needs review', 'Empty cardboard buildup at dock'],
  'Customer Area': ['Shopping cart availability below 80%', 'Checkout queue exceeded 5-min wait', 'Customer service desk unstaffed during peak', 'Store entrance cleanliness needs attention'],
};

const scCategorySkill: Record<string, { skill: string; logic: string }> = {
  Overall: { skill: 'analytics', logic: 'Aggregated KPI derived from all audit dimensions' },
  Safety: { skill: 'knowledge', logic: 'Compliance-driven; surfaces the relevant safety SOP and remediation steps' },
  Planogram: { skill: 'pog', logic: 'POG drift detected; AI generates corrective shelf-set' },
  Signage: { skill: 'knowledge', logic: 'Surfaces signage standards and missing-asset checklist' },
  Cleanliness: { skill: 'actions', logic: 'Triggers cleaning task with assigned owner and SLA' },
  Availability: { skill: 'analytics', logic: 'Cross-references OOS feed to identify root cause' },
  Staffing: { skill: 'actions', logic: 'Recommends shift adjustments based on traffic forecast' },
  'Stock Rotation': { skill: 'knowledge', logic: 'Reinforces FIFO and rotation SOP for relevant team' },
  Pricing: { skill: 'pog', logic: 'Validates shelf-tag against master price file' },
  Backroom: { skill: 'actions', logic: 'Generates reset task with priority based on aisle blockage risk' },
  'Customer Area': { skill: 'actions', logic: 'Auto-creates tasks targeting peak coverage windows' },
};

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
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedStoreId, setSelectedStoreId] = useState(storesData[0].id);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');
  const [trendModal, setTrendModal] = useState<KPITile | null>(null);
  const [auditWeekDetail, setAuditWeekDetail] = useState<AuditWeek | null>(null);
  const [activeKPIPanel, setActiveKPIPanel] = useState<StoreKPI | null>(null);
  const [auditCellDetail, setAuditCellDetail] = useState<{
    weekLabel: string;
    weekDate: string;
    category: string;
    score: number;
    findings: string[];
    skill: string;
    skillLogic: string;
    trend: 'improving' | 'declining' | 'stable';
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'voc' | 'inventory' | 'benchmarking' | 'alerts'>('voc');
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

      {/* ── Header (matches District Intelligence look & feel) ─── */}
      <div className="district-intel-header sc-di-header">
        <div className="header-left">
          <div className="header-title">
            <Store size={24} />
            <h1>Store Deep Dive</h1>
          </div>
          <div className="header-meta">
            <div className="sc-store-selector-wrap">
              <button className="di-district-picker sc-store-picker" onClick={() => setShowStoreSelector(!showStoreSelector)}>
                <Store size={14} />
                <span>{store.name}</span>
                <span className="di-district-dm">#{store.number} · {store.format}</span>
                <ChevronDown size={14} className={showStoreSelector ? 'rotated' : ''} />
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
            <span className="last-refresh">
              <Clock size={12} />
              Updated {store.lastRefresh}
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
          <button className="header-icon-btn">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showStoreSelector && <div className="sc-overlay" onClick={() => { setShowStoreSelector(false); setStoreSearch(''); }} />}

      <div className="sc-scroll-area" ref={scrollRef}>
        {/* ── Hero Pulse: SPI Card + AI Daily Brief (matches DI) ── */}
        <div className="executive-pulse sc-pulse">
          {/* SPI Card — reuses DI dpi-card-v2 visuals */}
          <div className="dpi-card-v2">
            <div className="dpi-hero-section">
              <div className="dpi-gauge-wrapper-v2">
                <svg className="dpi-gauge-v2" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <defs>
                    <linearGradient id="spiGradientSC" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={store.risk === 'high' ? '#ef4444' : store.risk === 'moderate' ? '#f59e0b' : '#10b981'} />
                      <stop offset="50%" stopColor={store.risk === 'high' ? '#dc2626' : store.risk === 'moderate' ? '#d97706' : '#059669'} />
                      <stop offset="100%" stopColor={store.risk === 'high' ? '#b91c1c' : store.risk === 'moderate' ? '#b45309' : '#047857'} />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="80" cy="80" r="68"
                    fill="none"
                    stroke="url(#spiGradientSC)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(store.dpi / 100) * 427} 427`}
                    transform="rotate(-90 80 80)"
                    className="dpi-progress-v2"
                  />
                </svg>
                <div className="dpi-score-center-v2">
                  <span className="dpi-score-value-v2">{store.dpi}</span>
                  <span className="dpi-score-label-v2">Performance Index</span>
                </div>
              </div>
            </div>

            <div className="dpi-story-section">
              <div className="dpi-tier-badge-v2">
                <div className="tier-text">
                  <span className="tier-title">{store.tier} Tier</span>
                  <span className="tier-subtitle">{store.tier === 'Excellence' ? 'Top performer in district' : store.tier === 'Performing' ? 'Tracking plan' : 'Requires intervention'}</span>
                </div>
              </div>

              <div className="dpi-rank-stats">
                <div className="dpi-rank-card">
                  <span className="dpi-rank-value">#{store.rank}</span>
                  <span className="dpi-rank-label">of {store.totalStores}</span>
                </div>
                <div className="dpi-change-card">
                  <div className={`dpi-change-value ${store.dpiDelta < 0 ? 'negative' : ''}`}>
                    {store.dpiDelta >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    <span>{store.dpiDelta >= 0 ? '+' : ''}{store.dpiDelta}%</span>
                  </div>
                  <span className="dpi-change-label">vs last period</span>
                </div>
              </div>

              <div className="dpi-breakdown-header">
                <span className="breakdown-title">Score Breakdown</span>
              </div>
              <div className="dpi-breakdown-grid">
                {(() => {
                  const sales = Math.max(45, Math.min(98, store.dpi + 2));
                  const exec = Math.max(45, Math.min(98, store.dpi - 1));
                  const voc = Math.max(45, Math.min(98, store.dpi - 3));
                  return (
                    <>
                      <div className="breakdown-card">
                        <div className="breakdown-value">{sales}</div>
                        <div className="breakdown-label">Sales</div>
                        <div className="breakdown-bar"><div className="breakdown-fill" style={{ width: `${sales}%` }} /></div>
                      </div>
                      <div className="breakdown-card">
                        <div className="breakdown-value">{exec}</div>
                        <div className="breakdown-label">Execution</div>
                        <div className="breakdown-bar"><div className="breakdown-fill" style={{ width: `${exec}%` }} /></div>
                      </div>
                      <div className="breakdown-card">
                        <div className="breakdown-value">{voc}</div>
                        <div className="breakdown-label">VoC</div>
                        <div className="breakdown-bar"><div className="breakdown-fill" style={{ width: `${voc}%` }} /></div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="dpi-chain-comparison">
                <div className="chain-comparison-header">
                  <span className="chain-label-title">vs District Average</span>
                  <span className={`chain-delta ${store.dpi >= 79 ? 'positive' : 'negative'}`}>{store.dpi >= 79 ? '+' : ''}{store.dpi - 79} pts</span>
                </div>
                <div className="chain-comparison-bar">
                  <div className="chain-bar-track">
                    <div className="chain-bar-fill" style={{ width: `${store.dpi}%` }} />
                    <div className="chain-marker" style={{ left: `79%` }}>
                      <div className="chain-marker-line" />
                      <span className="chain-marker-label">District: 79</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Daily Brief (shared component) — merges tier narrative + AI Insight */}
          <div className="pulse-right-panel">
            {(() => {
              const baseBrief = getStoreBrief(store);
              const mergedBrief: AIDailyBriefData = {
                ...baseBrief,
                sections: [
                  {
                    title: 'Root Cause',
                    icon: 'triage',
                    bullets: [
                      aiInsight.rootCause,
                      ...aiInsight.causalChain.map(c =>
                        `<strong>${c.factor}</strong> — ${c.contribution}% contribution <em>(${c.direction})</em>`
                      ),
                    ],
                  },
                  ...baseBrief.sections,
                  {
                    title: 'Ranked Actions',
                    icon: 'recommendations',
                    bullets: aiInsight.actions.map(a =>
                      `<strong>#${a.priority} — ${a.action}</strong> · <em>${a.module}</em> · ${a.impact}`
                    ),
                  },
                ],
              };
              return (
                <AIDailyBrief
                  brief={mergedBrief}
                  userName={user?.name}
                  metaSuffix={`SPI ${store.dpi} · ${store.tier}`}
                />
              );
            })()}
          </div>
        </div>

        {/* ── KPI Tiles (matches District Intelligence look/feel) ── */}
        <div className="sc-kpi-section">
          {isDateFilterActive && <div className="sc-section-filter-badge"><Filter size={11} className="filter-active-icon" /><span>{getSelectedPeriodLabel()}</span></div>}
          <div className="kpi-cards-grid">
            {getStoreKPIs(store).map(kpi => {
              const categoryIcon =
                kpi.category === 'commercial' ? <DollarSign size={12} /> :
                kpi.category === 'customer' ? <Heart size={12} /> :
                kpi.category === 'execution' ? <ClipboardCheck size={12} /> :
                kpi.category === 'profitability' ? <Target size={12} /> :
                <Package size={12} />;
              const categoryLabel =
                kpi.category === 'commercial' ? 'Commercial' :
                kpi.category === 'customer' ? 'Customer' :
                kpi.category === 'execution' ? 'Execution' :
                kpi.category === 'profitability' ? 'Profitability' :
                'Operations';
              return (
                <div
                  key={kpi.id}
                  className={`kpi-tile kpi-tile--${kpi.status} ${kpi.clickable ? 'kpi-tile--clickable' : ''} ${activeKPIPanel?.id === kpi.id ? 'kpi-tile--active' : ''}`}
                  onClick={() => kpi.clickable && setActiveKPIPanel(activeKPIPanel?.id === kpi.id ? null : kpi)}
                >
                  <div className={`kpi-tile-category kpi-tile-category--${kpi.category}`}>
                    {categoryIcon}
                    <span>{categoryLabel}</span>
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
                    const path = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');
                    const areaPath = `${path} L ${W},${H} L 0,${H} Z`;
                    const last = points[points.length - 1];
                    const color = kpi.status === 'positive' ? '#047857' : kpi.status === 'negative' ? '#991b1b' : kpi.status === 'warning' ? '#b45309' : '#4338ca';
                    return (
                      <div className="kpi-tile-sparkline">
                        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id={`sc-spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity="0.06" />
                              <stop offset="100%" stopColor={color} stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={areaPath} fill={`url(#sc-spark-${kpi.id})`} />
                          <path d={path} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter" />
                          <circle cx={last.x} cy={last.y} r="1.8" fill={color} stroke="#ffffff" strokeWidth="1" />
                        </svg>
                      </div>
                    );
                  })()}
                  {kpi.clickable && <ChevronRight size={14} className="kpi-tile-arrow" />}
                </div>
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
                </button>
              ))}
            </div>
            {['overall', 'safety', 'planogram', 'signage', 'cleanliness', 'availability', 'staffing', 'stockRotation', 'pricing', 'backroom', 'customerArea'].map(cat => (
              <div key={cat} className={`sc-audit-row ${cat === 'overall' ? 'sc-audit-row--overall' : ''}`}>
                <span className="sc-audit-cat-label">{cat === 'stockRotation' ? 'Stock Rotation' : cat === 'customerArea' ? 'Customer Area' : cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                {auditData.map((w, wi) => {
                  const val = w[cat as keyof AuditWeek] as number;
                  const catLabel = cat === 'stockRotation' ? 'Stock Rotation' : cat === 'customerArea' ? 'Customer Area' : cat.charAt(0).toUpperCase() + cat.slice(1);
                  // Compare to prior week for trend
                  const prevVal = wi > 0 ? (auditData[wi - 1][cat as keyof AuditWeek] as number) : val;
                  const trend: 'improving' | 'declining' | 'stable' = val > prevVal + 1 ? 'improving' : val < prevVal - 1 ? 'declining' : 'stable';
                  const findings = scAuditFindings[catLabel] || scAuditFindings.Overall;
                  const skillMap = scCategorySkill[catLabel] || scCategorySkill.Overall;
                  const isActive = auditCellDetail?.weekLabel === w.weekLabel && auditCellDetail?.category === catLabel;
                  return (
                    <div
                      key={w.weekLabel}
                      className={`sc-audit-cell ${isActive ? 'sc-audit-cell--active' : ''}`}
                      style={{ background: getComplianceColor(val), color: getComplianceTextColor(val) }}
                      onClick={() => setAuditCellDetail({
                        weekLabel: w.weekLabel,
                        weekDate: w.date,
                        category: catLabel,
                        score: val,
                        findings: findings.slice(0, val >= 90 ? 1 : val >= 75 ? 2 : val >= 50 ? 3 : 4),
                        skill: skillMap.skill,
                        skillLogic: skillMap.logic,
                        trend,
                      })}
                    >
                      {val}%
                    </div>
                  );
                })}
              </div>
            ))}
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
                <table className="sc-inv-table wow-table">
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

      {/* ── KPI Right-Side Detail Panel (mirrors District Intelligence) ── */}
      {activeKPIPanel && (() => {
        const td = activeKPIPanel.trendData || [];
        const accent = activeKPIPanel.status === 'positive' ? '#047857' : activeKPIPanel.status === 'negative' ? '#991b1b' : activeKPIPanel.status === 'warning' ? '#b45309' : '#4338ca';
        return (
          <>
            <div className="detail-panel-overlay" onClick={() => setActiveKPIPanel(null)} />
            <div className="detail-panel">
              <div className="detail-panel-header">
                <button className="detail-panel-close" onClick={() => setActiveKPIPanel(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="detail-panel-body">
                <div className="dp-severity-row">
                  <span className={`dp-severity-badge ${activeKPIPanel.status === 'negative' ? 'critical' : activeKPIPanel.status === 'warning' ? 'warning' : 'risk'}`}>
                    {activeKPIPanel.category.toUpperCase()}
                  </span>
                  <span className="dp-source">
                    <BarChart3 size={11} />
                    52-Week Trend
                  </span>
                </div>

                <h2 className="dp-title">{activeKPIPanel.label}</h2>
                <p className="dp-description">
                  Current: <strong>{activeKPIPanel.primaryValue}</strong>{activeKPIPanel.primaryUnit ? ` ${activeKPIPanel.primaryUnit}` : ''}
                  {activeKPIPanel.microInsight && <> · {activeKPIPanel.microInsight}</>}
                </p>

                {/* Period vs YoY */}
                <div className="dp-section">
                  <h3 className="dp-section-title">
                    <BarChart3 size={14} />
                    Period Comparison
                  </h3>
                  <div className="kpi-period-metrics">
                    <div className="kpi-period-metric">
                      <span className="kpi-period-label">YoY</span>
                      <span className={`kpi-period-val delta-${activeKPIPanel.deltaDirection || 'flat'}`}>
                        {activeKPIPanel.deltaDirection === 'up' && <ArrowUpRight size={14} />}
                        {activeKPIPanel.deltaDirection === 'down' && <ArrowDownRight size={14} />}
                        {activeKPIPanel.delta}
                      </span>
                      <span className="kpi-period-sub">{activeKPIPanel.deltaContext || 'Year over Year'}</span>
                    </div>
                    {td.length >= 2 && (() => {
                      const curr = td[td.length - 1];
                      const prev = td[td.length - 2];
                      const diff = curr - prev;
                      const dir: 'up' | 'down' | 'flat' = Math.abs(diff) < 0.01 ? 'flat' : diff > 0 ? 'up' : 'down';
                      return (
                        <div className="kpi-period-metric">
                          <span className="kpi-period-label">WoW</span>
                          <span className={`kpi-period-val delta-${dir}`}>
                            {dir === 'up' && <ArrowUpRight size={14} />}
                            {dir === 'down' && <ArrowDownRight size={14} />}
                            {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                          </span>
                          <span className="kpi-period-sub">vs prior week</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Trend Graph */}
                {td.length > 0 && (
                  <div className="dp-section">
                    <h3 className="dp-section-title">
                      <BarChart3 size={14} />
                      Trend
                    </h3>
                    <div className="kpi-panel-chart">
                      <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="kpi-panel-svg">
                        <defs>
                          <linearGradient id={`sc-kpi-grad-${activeKPIPanel.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
                            <stop offset="100%" stopColor={accent} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {(() => {
                          const min = Math.min(...td);
                          const max = Math.max(...td);
                          const range = max - min || 1;
                          const W = 400, H = 140, P = 8;
                          const points = td.map((v, i) => ({
                            x: (i / (td.length - 1)) * W,
                            y: H - P - ((v - min) / range) * (H - P * 2),
                          }));
                          const linePath = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');
                          const areaPath = `${linePath} L ${W},${H} L 0,${H} Z`;
                          const last = points[points.length - 1];
                          return (
                            <>
                              <path d={areaPath} fill={`url(#sc-kpi-grad-${activeKPIPanel.id})`} />
                              <path d={linePath} fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx={last.x} cy={last.y} r="3" fill={accent} stroke="#ffffff" strokeWidth="1.5" />
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                )}

                {/* AI Insight */}
                {activeKPIPanel.trendInsight && (
                  <div className="dp-section">
                    <h3 className="dp-section-title">
                      <Sparkles size={14} />
                      AI Insight
                    </h3>
                    <div className="kpi-ai-insight">
                      <Sparkles size={14} className="kpi-ai-insight-icon" />
                      <p>{activeKPIPanel.trendInsight}</p>
                    </div>
                  </div>
                )}

                {/* Key Details */}
                {activeKPIPanel.panelDetails && activeKPIPanel.panelDetails.length > 0 && (
                  <div className="dp-section">
                    <h3 className="dp-section-title">
                      <ClipboardCheck size={14} />
                      Key Details
                    </h3>
                    <div className="kpi-panel-details">
                      {activeKPIPanel.panelDetails.map((d, i) => (
                        <div key={i} className={`kpi-panel-detail-row status-${d.status || 'neutral'}`}>
                          <span className="kpi-panel-detail-label">{d.label}</span>
                          <span className="kpi-panel-detail-value">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="dp-timestamp">
                  <Clock size={11} />
                  <span>Updated just now · Showing weekly comparison</span>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ── Audit Cell Right-Side Detail Panel (mirrors DI heatmap detail) ── */}
      {auditCellDetail && (() => {
        const d = auditCellDetail;
        const accent = d.score >= 90 ? '#16a34a' : d.score >= 75 ? '#d97706' : '#dc2626';
        // Synthesize 12-week score history biased by trend
        const seed = (d.category.length * 7 + d.weekLabel.length * 3) || 1;
        const history: number[] = [];
        for (let i = 0; i < 12; i++) {
          const t = i / 11;
          const trendOffset = d.trend === 'improving' ? -8 * (1 - t) : d.trend === 'declining' ? 8 * (1 - t) : 0;
          const jitter = ((seed * (i + 1)) % 7) - 3;
          history.push(Math.max(40, Math.min(100, Math.round(d.score + trendOffset + jitter))));
        }
        history[history.length - 1] = d.score;
        const min = Math.min(...history);
        const max = Math.max(...history);
        const range = max - min || 1;
        const W = 400, H = 100, P = 6;
        const points = history.map((v, i) => ({
          x: (i / (history.length - 1)) * W,
          y: H - P - ((v - min) / range) * (H - P * 2),
        }));
        const linePath = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');
        const areaPath = `${linePath} L ${W},${H} L 0,${H} Z`;
        const last = points[points.length - 1];
        const recommendation = d.score >= 90
          ? `${d.category} performance is strong at ${d.score}%. Maintain SOP cadence and codify the playbook for peer-store knowledge sharing.`
          : d.score >= 75
            ? `${d.category} at ${d.score}% — ${d.findings.length} findings. Address top 2 in the next audit cycle to lift score above 90%.`
            : `${d.category} is critical at ${d.score}%. Trigger immediate corrective actions on all ${d.findings.length} findings; assign owner and SLA today.`;
        return (
          <>
            <div className="detail-panel-overlay" onClick={() => setAuditCellDetail(null)} />
            <div className="detail-panel">
              <div className="detail-panel-header">
                <button className="detail-panel-close" onClick={() => setAuditCellDetail(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="detail-panel-body">
                <div className="dp-severity-row">
                  <span
                    className="dp-severity-badge"
                    style={{ background: getComplianceColor(d.score), color: getComplianceTextColor(d.score) }}
                  >
                    {d.score}% COMPLIANCE
                  </span>
                  <span className="dp-source">
                    <ClipboardCheck size={11} />
                    8-Week Audit Lens
                  </span>
                </div>

                <h2 className="dp-title">{d.category} Audit</h2>
                <p className="dp-description">
                  {store.name} #{store.number} · Week of {d.weekDate} ({d.weekLabel})
                </p>

                <div className="dp-impact-summary">
                  {d.trend === 'improving' && <TrendingUp size={14} />}
                  {d.trend === 'declining' && <TrendingDown size={14} />}
                  {d.trend === 'stable' && <Minus size={14} />}
                  <span>Trend: {d.trend.charAt(0).toUpperCase() + d.trend.slice(1)}</span>
                </div>

                {/* Performance Comparison */}
                <div className="dp-section">
                  <h3 className="dp-section-title">
                    <BarChart3 size={14} />
                    Performance Comparison
                  </h3>
                  <div className="kpi-period-metrics">
                    <div className="kpi-period-metric">
                      <span className="kpi-period-label">This Week</span>
                      <span className="kpi-period-val">{d.score}%</span>
                      <span className="kpi-period-sub">current score</span>
                    </div>
                    <div className="kpi-period-metric">
                      <span className="kpi-period-label">8W Avg</span>
                      <span className="kpi-period-val">{Math.round(history.slice(-8).reduce((a, b) => a + b, 0) / 8)}%</span>
                      <span className="kpi-period-sub">rolling 8-week</span>
                    </div>
                    <div className="kpi-period-metric">
                      <span className="kpi-period-label">Best Week</span>
                      <span className="kpi-period-val">{max}%</span>
                      <span className="kpi-period-sub">{max - d.score} pts to close gap</span>
                    </div>
                    <div className="kpi-period-metric">
                      <span className="kpi-period-label">Target</span>
                      <span className="kpi-period-val">95%</span>
                      <span className={`kpi-period-sub delta-${d.score >= 95 ? 'up' : 'down'}`}>
                        {d.score >= 95 ? 'on target' : `${95 - d.score} pts below`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score History */}
                <div className="dp-section">
                  <h3 className="dp-section-title">
                    <BarChart3 size={14} />
                    Score History (12 weeks)
                  </h3>
                  <div className="kpi-panel-chart">
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 100, display: 'block' }}>
                      <defs>
                        <linearGradient id={`sc-hm-grad-${d.weekLabel}-${d.category}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
                          <stop offset="100%" stopColor={accent} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill={`url(#sc-hm-grad-${d.weekLabel}-${d.category})`} />
                      <path d={linePath} fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx={last.x} cy={last.y} r="3" fill={accent} stroke="#ffffff" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="kpi-panel-details" style={{ marginTop: 8 }}>
                    <div className="kpi-panel-detail-row status-neutral">
                      <span className="kpi-panel-detail-label">12-Week Range</span>
                      <span className="kpi-panel-detail-value">{min}% – {max}%</span>
                    </div>
                    <div className="kpi-panel-detail-row status-neutral">
                      <span className="kpi-panel-detail-label">12-Week Avg</span>
                      <span className="kpi-panel-detail-value">{Math.round(history.reduce((a, b) => a + b, 0) / history.length)}%</span>
                    </div>
                  </div>
                </div>

                {/* Findings */}
                <div className="dp-section">
                  <h3 className="dp-section-title">
                    <AlertCircle size={14} />
                    Findings ({d.findings.length})
                  </h3>
                  <div className="dp-stores-list">
                    {d.findings.map((finding, idx) => (
                      <div key={idx} className="dp-store-card warning">
                        <div className="dp-store-header">
                          <span className="dp-store-name">Finding {idx + 1}</span>
                        </div>
                        <p className="dp-store-detail">{finding}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="dp-section">
                  <h3 className="dp-section-title">
                    <Sparkles size={14} />
                    AI Recommendation
                  </h3>
                  <div className="kpi-ai-insight">
                    <Sparkles size={14} className="kpi-ai-insight-icon" />
                    <p>{recommendation}</p>
                  </div>
                </div>

                {/* Action Plan */}
                {d.findings.length > 0 && (
                  <div className="dp-section">
                    <h3 className="dp-section-title">
                      <CheckCircle2 size={14} />
                      Action Plan
                    </h3>
                    <div className="hm-action-plan">
                      {d.findings.map((finding, idx) => {
                        const owners = ['Store Manager', 'Dept Lead', 'Asst Manager', 'Floor Lead'];
                        const dueDays = [1, 2, 3, 5];
                        const owner = owners[idx % owners.length];
                        const due = dueDays[idx % dueDays.length];
                        return (
                          <div key={idx} className="hm-action-item">
                            <div className="hm-action-checkbox" />
                            <div className="hm-action-content">
                              <span className="hm-action-title">{finding}</span>
                              <div className="hm-action-meta">
                                <span className="hm-action-owner"><Users size={11} /> {owner}</span>
                                <span className={`hm-action-due ${due <= 2 ? 'urgent' : ''}`}>
                                  <Clock size={11} /> Due in {due} day{due > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* AI Copilot Skill */}
                <div className="dp-section">
                  <h3 className="dp-section-title">
                    <BarChart3 size={14} />
                    AI Copilot Skill
                  </h3>
                  <div className="kpi-panel-detail-row status-neutral">
                    <span className="kpi-panel-detail-label">
                      {d.skill === 'pog' ? 'POG' : d.skill === 'knowledge' ? 'Knowledge' : d.skill === 'actions' ? 'Action' : 'Analytics'}
                    </span>
                    <span className="kpi-panel-detail-value" style={{ fontWeight: 500, fontSize: 11, color: '#475569' }}>
                      {d.skillLogic}
                    </span>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="dp-actions">
                  <button className="dp-action-btn outlined" onClick={() => {
                    const cat = d.category;
                    setAuditCellDetail(null);
                    navigate(`/command-center/ai-copilot?mode=${d.skill}&context=audit-${cat.toLowerCase().replace(/ /g, '-')}&store=${store.number}&storeName=${encodeURIComponent(store.name)}&score=${d.score}`);
                  }}>
                    <Sparkles size={14} />
                    <span>Investigate in AI Copilot</span>
                  </button>
                </div>

                <div className="dp-timestamp">
                  <Clock size={11} />
                  <span>Audit week of {d.weekDate}</span>
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
};
