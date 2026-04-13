import React, { useState, useEffect } from 'react';
import {
  Store,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Users,
  DollarSign,
  ShieldCheck,
  Package,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  BarChart3,
  Eye,
  X,
  ExternalLink,
  Zap,
  Award,
  Target,
  Layers,
  Truck,
  Camera,
  FileText,
  Grid3X3,
  ThumbsUp,
  Smile,
  Meh,
  Frown,
  AlertOctagon,
  LayoutGrid,
  ClipboardCheck,
  MessageCircle,
  Search,
  Check
} from 'lucide-react';
import './StoreDeepDive.css';

// Import localized planogram image
import LocalizedWomensWall from '../assets/localized_C&A_WOMENS_WALL_STANDARD.png';

// Custom Dropdown Component for premium styling
interface DropdownOption {
  value: string;
  label: string;
}

interface PremiumDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const PremiumDropdown: React.FC<PremiumDropdownProps> = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="premium-dropdown" ref={dropdownRef}>
      <button 
        className={`premium-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className={value ? 'has-value' : ''}>{selectedOption?.label || placeholder || options[0]?.label}</span>
        <ChevronDown size={14} className={`dropdown-chevron ${isOpen ? 'rotated' : ''}`} />
      </button>
      {isOpen && (
        <div className="premium-dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              className={`premium-dropdown-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              type="button"
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={16} className="check-icon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Types
type SPITier = 'Excellence' | 'Stable' | 'AtRisk' | 'Crisis';
type MomentumType = 'Improving' | 'Slipping' | 'Flat';
type StreamSeverity = 'healthy' | 'warning' | 'critical';
type DiscrepancyClass = 'Silent Risk' | 'Leading Indicator' | 'Imminent Gap' | 'Ground Truth Confirmed' | 'Stable';

interface StoreAction {
  id: string;
  title: string;
  reason: string;
  impactType: 'revenue' | 'compliance' | 'customer' | 'safety' | 'inventory';
  location?: string;
  priority: 'urgent' | 'high' | 'medium';
  cta: string;
}

interface StreamDiagnostic {
  stream: string;
  icon: React.ReactNode;
  primaryIssue: string;
  finding: string;
  variance: string;
  varianceType: 'positive' | 'negative' | 'neutral';
  severity: StreamSeverity;
}

interface KPIData {
  id: string;
  label: string;
  value: string;
  variance: string;
  varianceType: 'positive' | 'negative' | 'neutral';
  secondaryVariance?: string;
  trend: number[];
  tier?: 'excellent' | 'stable' | 'atrisk' | 'critical' | 'warning';
}

// District Stores for Filter
interface DistrictStore {
  id: string;
  storeNumber: string;
  storeName: string;
  format: string;
  cluster: string;
  spi: number;
  spiTier: SPITier;
}

const districtStores: DistrictStore[] = [
  { id: '1', storeNumber: '2034', storeName: 'Downtown Plaza', format: 'Urban Flagship', cluster: 'Urban Flagship', spi: 78, spiTier: 'AtRisk' },
  { id: '2', storeNumber: '2041', storeName: 'Riverside Mall', format: 'Mall Anchor', cluster: 'Mall Anchor', spi: 92, spiTier: 'Excellence' },
  { id: '3', storeNumber: '2056', storeName: 'Oak Street Market', format: 'Family Center', cluster: 'Family Center', spi: 85, spiTier: 'Stable' },
  { id: '4', storeNumber: '2078', storeName: 'Westfield Center', format: 'Urban Flagship', cluster: 'Urban Flagship', spi: 71, spiTier: 'AtRisk' },
  { id: '5', storeNumber: '2089', storeName: 'Lakeside Commons', format: 'Family Center', cluster: 'Family Center', spi: 88, spiTier: 'Stable' },
  { id: '6', storeNumber: '2095', storeName: 'Metro Junction', format: 'Outlet Value', cluster: 'Outlet Value', spi: 65, spiTier: 'Crisis' },
  { id: '7', storeNumber: '2102', storeName: 'Hillcrest Village', format: 'Family Center', cluster: 'Family Center', spi: 82, spiTier: 'Stable' },
  { id: '8', storeNumber: '2118', storeName: 'Parkway Plaza', format: 'Mall Anchor', cluster: 'Mall Anchor', spi: 76, spiTier: 'AtRisk' },
];

// Mock Data
const storeInfo = {
  storeNumber: '2034',
  storeName: 'Downtown Plaza',
  district: 'District 14 — Tennessee',
  format: 'Urban Flagship',
  cluster: 'Urban Flagship',
  lastRefresh: new Date(),
};

const storeMetrics = {
  spi: 78,
  spiTier: 'AtRisk' as SPITier,
  momentum: 'Slipping' as MomentumType,
  momentumDelta: -2.4,
  vsDistrictAvg: -4.2,
  compRank: 4,
  compTotal: 12,
  compMovement: -2,
  inboundRiskActive: true,
  delayedShipments: 2,
  oosRiskSkus: 8,
};

const mockActions: StoreAction[] = [
  { id: '1', title: "Fix planogram gap — Women's Wall Display", reason: 'Visual audit detected 8 missing facings in Dresses section, impacting trend items', impactType: 'revenue', location: "Section B, Women's Dresses", priority: 'urgent', cta: 'Open Visual Audit' },
  { id: '2', title: 'Address fitting room availability', reason: 'Customer complaints about fitting room wait times during peak hours', impactType: 'customer', location: 'Fitting Room Area', priority: 'urgent', cta: 'View VoC Details' },
  { id: '3', title: 'Restock size-run gaps in Basics', reason: 'Size M and L depleted in V-Neck Basics, high demand items', impactType: 'inventory', location: "Section D, Women's Basics", priority: 'high', cta: 'View Stock Levels' },
  { id: '4', title: 'Update mannequin styling for new arrivals', reason: 'Current season collection not featured on floor mannequins', impactType: 'revenue', location: 'Store Entrance', priority: 'high', cta: 'View Style Guide' },
  { id: '5', title: 'Review negative checkout experience comments', reason: '4 new comments about long queues during weekend peak', impactType: 'customer', location: 'Front Registers', priority: 'medium', cta: 'View Comments' },
];

const mockKPIs: KPIData[] = [
  { id: 'sales', label: 'Net Sales Comp', value: '$186K', variance: '-3.2%', varianceType: 'negative', secondaryVariance: 'vs LY', trend: [85, 82, 78, 75, 72, 70, 68], tier: 'atrisk' },
  { id: 'voc', label: 'VoC % Satisfied', value: '72%', variance: '-5.1%', varianceType: 'negative', secondaryVariance: 'vs LM', trend: [82, 80, 78, 75, 74, 73, 72], tier: 'atrisk' },
  { id: 'sea', label: 'SEA Score', value: '76.4', variance: '-2.8', varianceType: 'negative', secondaryVariance: 'vs LM', trend: [82, 80, 79, 78, 77, 76, 76], tier: 'atrisk' },
  { id: 'salesVar', label: 'Sales $ % Var', value: '-2.8%', variance: '-1.4pp', varianceType: 'negative', secondaryVariance: 'vs LY', trend: [2, 1, 0, -1, -2, -2.5, -2.8], tier: 'atrisk' },
  { id: 'gm', label: 'GM% bps Var', value: '-25 bps', variance: '-15 bps', varianceType: 'negative', secondaryVariance: 'vs LY', trend: [10, 5, 0, -10, -15, -20, -25], tier: 'warning' },
  { id: 'pog', label: 'POG Compliance', value: '74%', variance: '-8%', varianceType: 'negative', secondaryVariance: 'vs LM', trend: [88, 85, 82, 80, 78, 76, 74], tier: 'atrisk' },
];

const mockStreamDiagnostics: StreamDiagnostic[] = [
  { stream: 'Sales', icon: <DollarSign size={16} />, primaryIssue: 'Apparel Revenue Decline', finding: "Women's Dresses and Tops underperforming vs plan by 12%", variance: '-3.2% vs district', varianceType: 'negative', severity: 'critical' },
  { stream: 'VoC', icon: <MessageSquare size={16} />, primaryIssue: 'Fitting Room Wait', finding: 'Peak hour complaints up 28%, fitting room availability cited', variance: '-5.1% vs district', varianceType: 'negative', severity: 'critical' },
  { stream: 'Visual', icon: <ShieldCheck size={16} />, primaryIssue: 'Display Compliance', finding: 'Mannequin styling outdated, color blocking needs refresh', variance: '-4.8 vs district', varianceType: 'negative', severity: 'warning' },
  { stream: 'Inventory', icon: <Truck size={16} />, primaryIssue: 'Size-Run Gaps', finding: '12 SKUs with broken size runs, Basics most affected', variance: '8 styles impacted', varianceType: 'negative', severity: 'warning' },
  { stream: 'Field Intel', icon: <Eye size={16} />, primaryIssue: 'No Active Flags', finding: 'Last visual audit 3 days ago, no escalations', variance: 'On track', varianceType: 'neutral', severity: 'healthy' },
];

const crossStreamVerdict = {
  discrepancyClass: 'Leading Indicator' as DiscrepancyClass,
  assessment: "Fitting room wait times are preceding sales decline — customers abandoning purchase decisions due to inability to try on items, particularly in Women's Dresses.",
  recommendedAction: "Increase fitting room staffing during 11am–3pm peak. Prioritize restocking size-run gaps in Basics to recover conversion rate.",
  urgency: 'high' as const,
};

// Helper functions
const getSPIColor = (tier: SPITier) => {
  switch (tier) {
    case 'Excellence': return '#10b981';
    case 'Stable': return '#0ea5e9';
    case 'AtRisk': return '#f59e0b';
    case 'Crisis': return '#ef4444';
    default: return '#64748b';
  }
};

const getImpactIcon = (type: string) => {
  switch (type) {
    case 'revenue': return <DollarSign size={14} />;
    case 'compliance': return <ShieldCheck size={14} />;
    case 'customer': return <Users size={14} />;
    case 'safety': return <AlertOctagon size={14} />;
    case 'inventory': return <Package size={14} />;
    default: return <AlertCircle size={14} />;
  }
};

const getDiscrepancyColor = (cls: DiscrepancyClass) => {
  switch (cls) {
    case 'Silent Risk': return '#8b5cf6';
    case 'Leading Indicator': return '#f59e0b';
    case 'Imminent Gap': return '#ef4444';
    case 'Ground Truth Confirmed': return '#10b981';
    case 'Stable': return '#0ea5e9';
    default: return '#64748b';
  }
};

export const StoreDeepDive: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overall');
  const [selectedKPI, setSelectedKPI] = useState<KPIData | null>(null);
  const [selectedStore, setSelectedStore] = useState<DistrictStore>(districtStores[0]);
  const [isStoreFilterOpen, setIsStoreFilterOpen] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [pogSectionFilter, setPogSectionFilter] = useState('');
  const [pogCategoryFilter, setPogCategoryFilter] = useState('');

  const filteredStores = districtStores.filter(store => 
    store.storeName.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
    store.storeNumber.includes(storeSearchQuery)
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.store-filter-container')) {
        setIsStoreFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="store-deep-dive">
        <div className="store-deep-dive-loading">
          <div className="loading-spinner" />
          <p>Loading Store Deep Dive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="store-deep-dive">
      {/* Store Health Header - Premium */}
      <div className="store-health-header">
        {/* Store Filter + Identity Block */}
        <div className="store-identity">
          {/* Store Filter Dropdown */}
          <div className="store-filter-container">
            <button 
              className="store-filter-trigger"
              onClick={() => setIsStoreFilterOpen(!isStoreFilterOpen)}
            >
              <div className="store-filter-icon">
                <Store size={16} />
              </div>
              <div className="store-filter-info">
                <span className="store-filter-number">#{selectedStore.storeNumber}</span>
                <span className="store-filter-name">{selectedStore.storeName}</span>
              </div>
              <ChevronDown size={14} className={`store-filter-chevron ${isStoreFilterOpen ? 'open' : ''}`} />
            </button>

            {isStoreFilterOpen && (
              <div className="store-filter-dropdown">
                <div className="store-filter-search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search stores..."
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="store-filter-list">
                  {filteredStores.map((store) => (
                    <button
                      key={store.id}
                      className={`store-filter-option ${selectedStore.id === store.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedStore(store);
                        setIsStoreFilterOpen(false);
                        setStoreSearchQuery('');
                      }}
                    >
                      <div className="store-option-info">
                        <span className="store-option-number">#{store.storeNumber}</span>
                        <span className="store-option-name">{store.storeName}</span>
                        <span className="store-option-format">{store.format}</span>
                      </div>
                      <div className="store-option-metrics">
                        <span className={`store-option-spi tier-${store.spiTier.toLowerCase()}`}>
                          {store.spi}
                        </span>
                        {selectedStore.id === store.id && <Check size={14} className="store-option-check" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="store-filter-footer">
                  <span>{districtStores.length} stores in district</span>
                </div>
              </div>
            )}
          </div>

          <div className="store-meta-tags">
            <span className="meta-tag">
              <MapPin size={11} />
              {storeInfo.district}
            </span>
            <span className="meta-tag">{selectedStore.format}</span>
            <span className="meta-tag">{selectedStore.cluster}</span>
          </div>
          <div className="last-refresh">
            <Clock size={10} />
            Updated {storeInfo.lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* SPI Gauge */}
        <div className="spi-gauge-container">
          <div className="spi-gauge">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={getSPIColor(storeMetrics.spiTier)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(storeMetrics.spi / 100) * 327} 327`}
                transform="rotate(-90 60 60)"
                className="spi-progress-ring"
              />
            </svg>
            <div className="spi-center">
              <span className="spi-value">{storeMetrics.spi}</span>
              <span className="spi-label">SPI</span>
            </div>
          </div>
          <div className={`spi-tier-badge tier-${storeMetrics.spiTier.toLowerCase()}`}>
            {storeMetrics.spiTier === 'Excellence' && <Award size={12} />}
            {storeMetrics.spiTier === 'Stable' && <ThumbsUp size={12} />}
            {storeMetrics.spiTier === 'AtRisk' && <AlertTriangle size={12} />}
            {storeMetrics.spiTier === 'Crisis' && <AlertCircle size={12} />}
            {storeMetrics.spiTier === 'AtRisk' ? 'At Risk' : storeMetrics.spiTier}
          </div>
        </div>

        {/* Momentum & Comparison Strip */}
        <div className="momentum-strip">
          <div className="momentum-item">
            <span className="momentum-label">Momentum</span>
            <div className={`momentum-value ${storeMetrics.momentum.toLowerCase()}`}>
              {storeMetrics.momentum === 'Improving' && <TrendingUp size={16} />}
              {storeMetrics.momentum === 'Slipping' && <TrendingDown size={16} />}
              {storeMetrics.momentum === 'Flat' && <Minus size={16} />}
              <span>{storeMetrics.momentumDelta >= 0 ? '+' : ''}{storeMetrics.momentumDelta}%</span>
            </div>
            <span className="momentum-period">vs last month</span>
          </div>
          <div className="momentum-item">
            <span className="momentum-label">vs District</span>
            <div className={`momentum-value ${storeMetrics.vsDistrictAvg >= 0 ? 'improving' : 'slipping'}`}>
              {storeMetrics.vsDistrictAvg >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{storeMetrics.vsDistrictAvg >= 0 ? '+' : ''}{storeMetrics.vsDistrictAvg}%</span>
            </div>
            <span className="momentum-period">avg SPI</span>
          </div>
        </div>

        {/* Comp Rank Badge */}
        <div className="comp-rank-container">
          <div className={`comp-rank-badge ${storeMetrics.compRank <= 4 ? 'top' : storeMetrics.compRank <= 8 ? 'middle' : 'bottom'}`}>
            <span className="rank-number">#{storeMetrics.compRank}</span>
            <span className="rank-total">of {storeMetrics.compTotal}</span>
          </div>
          <div className="rank-movement">
            {storeMetrics.compMovement < 0 ? (
              <span className="movement-down">
                <ArrowDownRight size={12} />
                {Math.abs(storeMetrics.compMovement)} spots
              </span>
            ) : storeMetrics.compMovement > 0 ? (
              <span className="movement-up">
                <ArrowUpRight size={12} />
                {storeMetrics.compMovement} spots
              </span>
            ) : (
              <span className="movement-flat">No change</span>
            )}
          </div>
          <span className="comp-label">Comp Stores</span>
        </div>

        {/* Inbound Risk Banner */}
        {storeMetrics.inboundRiskActive && (
          <div className="inbound-risk-banner">
            <div className="risk-icon">
              <Truck size={18} />
            </div>
            <div className="risk-content">
              <span className="risk-title">Inbound Risk Active</span>
              <span className="risk-details">
                {storeMetrics.delayedShipments} delayed • {storeMetrics.oosRiskSkus} OOS-risk SKUs
              </span>
            </div>
            <button className="risk-cta">
              View Inbound
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* AI Store Narrative */}
        <div className="ai-narrative">
          <div className="narrative-icon">
            <Sparkles size={16} />
          </div>
          <div className="narrative-content">
            <p className="narrative-verdict">
              <strong>Store performance declining</strong> — SPI dropped 6 points in 4 weeks, now in At Risk tier.
            </p>
            <p className="narrative-explanation">
              VoC dissatisfaction (fitting room wait times) is preceding sales decline. Planogram gaps in Women's Wall Display compounding size-run availability issues before delayed inbound arrives.
            </p>
          </div>
        </div>
      </div>

      {/* Store Action Queue */}
      <div className="action-queue-section">
        <div className="section-header">
          <h2>
            <Zap size={18} />
            Priority Actions
          </h2>
          <span className="section-subtitle">What to fix first</span>
        </div>
        <div className="action-queue-grid">
          {mockActions.slice(0, 5).map((action, index) => (
            <div key={action.id} className={`action-card priority-${action.priority}`}>
              <div className="action-rank">{index + 1}</div>
              <div className={`action-impact-icon impact-${action.impactType}`}>
                {getImpactIcon(action.impactType)}
              </div>
              <div className="action-content">
                <h4 className="action-title">{action.title}</h4>
                <p className="action-reason">{action.reason}</p>
                {action.location && (
                  <span className="action-location">
                    <MapPin size={10} />
                    {action.location}
                  </span>
                )}
              </div>
              <button className={`action-cta priority-${action.priority}`}>
                {action.cta}
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Big Six KPI Strip */}
      <div className="kpi-strip">
        <div className="section-header">
          <h2>
            <BarChart3 size={18} />
            Key Performance Indicators
          </h2>
        </div>
        <div className="kpi-cards">
          {mockKPIs.map((kpi) => (
            <div
              key={kpi.id}
              className={`kpi-card tier-${kpi.tier} ${selectedKPI?.id === kpi.id ? 'selected' : ''}`}
              onClick={() => setSelectedKPI(selectedKPI?.id === kpi.id ? null : kpi)}
            >
              <span className="kpi-label">{kpi.label}</span>
              <span className="kpi-value">{kpi.value}</span>
              <div className="kpi-variance">
                <span className={`variance-primary ${kpi.varianceType}`}>
                  {kpi.varianceType === 'positive' && <ArrowUpRight size={12} />}
                  {kpi.varianceType === 'negative' && <ArrowDownRight size={12} />}
                  {kpi.variance}
                </span>
                {kpi.secondaryVariance && (
                  <span className="variance-secondary">{kpi.secondaryVariance}</span>
                )}
              </div>
              <div className="kpi-sparkline">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={kpi.varianceType === 'positive' ? '#10b981' : kpi.varianceType === 'negative' ? '#ef4444' : '#64748b'}
                    strokeWidth="2"
                    points={kpi.trend.map((v, i) => `${(i / (kpi.trend.length - 1)) * 100},${30 - ((v - Math.min(...kpi.trend)) / (Math.max(...kpi.trend) - Math.min(...kpi.trend) || 1)) * 25}`).join(' ')}
                  />
                </svg>
              </div>
              <div className="kpi-click-hint">
                <ExternalLink size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intersection Logic Diagnostic */}
      <div className="diagnostic-section">
        <div className="section-header">
          <h2>
            <Grid3X3 size={18} />
            Cross-Stream Diagnosis
          </h2>
          <span className="section-subtitle">Understanding the root cause</span>
        </div>
        <div className="diagnostic-layout">
          {/* Five-Stream Diagnostic Grid */}
          <div className="stream-grid">
            {mockStreamDiagnostics.map((stream) => (
              <div key={stream.stream} className={`stream-card severity-${stream.severity}`}>
                <div className="stream-header">
                  <div className={`stream-icon severity-${stream.severity}`}>
                    {stream.icon}
                  </div>
                  <span className="stream-name">{stream.stream}</span>
                  <span className={`severity-dot ${stream.severity}`} />
                </div>
                <div className="stream-issue">
                  <span className="issue-tag">{stream.primaryIssue}</span>
                </div>
                <p className="stream-finding">{stream.finding}</p>
                <div className={`stream-variance ${stream.varianceType}`}>
                  {stream.varianceType === 'negative' && <ArrowDownRight size={12} />}
                  {stream.varianceType === 'positive' && <ArrowUpRight size={12} />}
                  {stream.variance}
                </div>
              </div>
            ))}
          </div>

          {/* Cross-Stream Verdict Panel */}
          <div className="verdict-panel">
            <div className="verdict-header">
              <span 
                className="discrepancy-badge"
                style={{ backgroundColor: `${getDiscrepancyColor(crossStreamVerdict.discrepancyClass)}20`, color: getDiscrepancyColor(crossStreamVerdict.discrepancyClass) }}
              >
                {crossStreamVerdict.discrepancyClass}
              </span>
              <span className={`urgency-badge urgency-${crossStreamVerdict.urgency}`}>
                {crossStreamVerdict.urgency === 'high' ? 'High Urgency' : crossStreamVerdict.urgency === 'medium' ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="verdict-content">
              <h4>Assessment</h4>
              <p className="verdict-assessment">{crossStreamVerdict.assessment}</p>
              <h4>Recommended Action</h4>
              <p className="verdict-action">{crossStreamVerdict.recommendedAction}</p>
            </div>
            <div className="verdict-cta">
              <button className="verdict-btn primary">
                <Zap size={14} />
                Execute Action Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Tactical Deep Dive Area */}
      <div className="tactical-tabs-section">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'overall' ? 'active' : ''}`}
            onClick={() => setActiveTab('overall')}
          >
            <LayoutGrid size={14} />
            Overall Summary
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sea' ? 'active' : ''}`}
            onClick={() => setActiveTab('sea')}
          >
            <ClipboardCheck size={14} />
            SEA Audit
          </button>
          <button 
            className={`tab-btn ${activeTab === 'voc' ? 'active' : ''}`}
            onClick={() => setActiveTab('voc')}
          >
            <MessageCircle size={14} />
            VoC Survey
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shelf' ? 'active' : ''}`}
            onClick={() => setActiveTab('shelf')}
          >
            <Camera size={14} />
            Shelf Audit
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pog' ? 'active' : ''}`}
            onClick={() => setActiveTab('pog')}
          >
            <Layers size={14} />
            Store POG
          </button>
          <button 
            className={`tab-btn ${activeTab === 'inbound' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbound')}
          >
            <Truck size={14} />
            Inbound Delivery
          </button>
          <button 
            className={`tab-btn ${activeTab === 'comp' ? 'active' : ''}`}
            onClick={() => setActiveTab('comp')}
          >
            <Target size={14} />
            Comp Benchmarking
          </button>
        </div>

        <div className="tab-content">
          {/* Overall Summary Tab */}
          {activeTab === 'overall' && (
            <div className="tab-panel overall-panel">
              <div className="overall-grid">
                {/* Recent Alerts Timeline */}
                <div className="alerts-timeline">
                  <h3>Recent Alerts</h3>
                  <div className="timeline-list">
                    <div className="timeline-item critical">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <span className="timeline-time">2 hours ago</span>
                        <p>Safety checkpoint auto-fail detected in SEA audit</p>
                      </div>
                    </div>
                    <div className="timeline-item warning">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <span className="timeline-time">6 hours ago</span>
                        <p>Inbound shipment delayed — 8 SKUs at OOS risk</p>
                      </div>
                    </div>
                    <div className="timeline-item warning">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <span className="timeline-time">1 day ago</span>
                        <p>VoC satisfaction dropped below 75% threshold</p>
                      </div>
                    </div>
                    <div className="timeline-item info">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <span className="timeline-time">2 days ago</span>
                        <p>Shelf audit completed — 74% compliance</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Recommendations */}
                <div className="top-recommendations">
                  <h3>AI Recommendations</h3>
                  <div className="recommendation-list">
                    <div className="recommendation-item">
                      <div className="rec-icon urgent">
                        <AlertTriangle size={14} />
                      </div>
                      <div className="rec-content">
                        <span className="rec-title">Address safety compliance immediately</span>
                        <p>Emergency signage failure requires same-day resolution</p>
                      </div>
                    </div>
                    <div className="recommendation-item">
                      <div className="rec-icon high">
                        <Users size={14} />
                      </div>
                      <div className="rec-content">
                        <span className="rec-title">Review peak hour staffing</span>
                        <p>10am–2pm window showing 35% increase in wait time complaints</p>
                      </div>
                    </div>
                    <div className="recommendation-item">
                      <div className="rec-icon high">
                        <Package size={14} />
                      </div>
                      <div className="rec-content">
                        <span className="rec-title">Prepare for delayed inbound</span>
                        <p>Prioritize shelf recovery for 8 OOS-risk SKUs when shipment arrives</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEA Audit Tab */}
          {activeTab === 'sea' && (
            <div className="tab-panel sea-panel">
              <div className="sea-header">
                <div className="sea-score-card">
                  <span className="sea-score-label">Current SEA Score</span>
                  <span className="sea-score-value">76.4</span>
                  <span className="sea-score-change negative">-2.8 vs last audit</span>
                </div>
                <div className="sea-summary">
                  <div className="summary-stat">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Categories Audited</span>
                  </div>
                  <div className="summary-stat warning">
                    <span className="stat-value">1</span>
                    <span className="stat-label">Auto-Fail</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-value">3</span>
                    <span className="stat-label">Below Target</span>
                  </div>
                </div>
              </div>

              {/* What Must Be Fixed */}
              <div className="fix-before-visit">
                <h3>
                  <AlertTriangle size={16} />
                  What Must Be Fixed Before Next Visit
                </h3>
                <div className="fix-list">
                  <div className="fix-item critical">
                    <span className="fix-category">Safety</span>
                    <span className="fix-issue">Emergency exit signage not illuminated</span>
                    <span className="fix-status">Auto-Fail</span>
                  </div>
                  <div className="fix-item warning">
                    <span className="fix-category">Planogram</span>
                    <span className="fix-issue">Women's Wall Display — 8 missing facings</span>
                    <span className="fix-status">68% compliance</span>
                  </div>
                  <div className="fix-item warning">
                    <span className="fix-category">Cleanliness</span>
                    <span className="fix-issue">Restroom maintenance log incomplete</span>
                    <span className="fix-status">Below target</span>
                  </div>
                </div>
              </div>

              {/* Category Audit Table */}
              <div className="audit-table-wrapper">
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Q1 Score</th>
                      <th>Q2 Score</th>
                      <th>Q3 Score</th>
                      <th>Current</th>
                      <th>Trend</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="status-critical">
                      <td>Safety & Compliance</td>
                      <td>92</td>
                      <td>88</td>
                      <td>85</td>
                      <td>45</td>
                      <td><TrendingDown size={14} className="trend-down" /></td>
                      <td><span className="status-badge critical">Auto-Fail</span></td>
                    </tr>
                    <tr className="status-warning">
                      <td>Planogram Compliance</td>
                      <td>88</td>
                      <td>85</td>
                      <td>80</td>
                      <td>68</td>
                      <td><TrendingDown size={14} className="trend-down" /></td>
                      <td><span className="status-badge warning">Below Target</span></td>
                    </tr>
                    <tr>
                      <td>Store Cleanliness</td>
                      <td>90</td>
                      <td>88</td>
                      <td>86</td>
                      <td>82</td>
                      <td><TrendingDown size={14} className="trend-down" /></td>
                      <td><span className="status-badge stable">On Track</span></td>
                    </tr>
                    <tr>
                      <td>Staff Presentation</td>
                      <td>95</td>
                      <td>94</td>
                      <td>92</td>
                      <td>90</td>
                      <td><Minus size={14} className="trend-flat" /></td>
                      <td><span className="status-badge stable">On Track</span></td>
                    </tr>
                    <tr>
                      <td>Customer Service</td>
                      <td>88</td>
                      <td>86</td>
                      <td>84</td>
                      <td>82</td>
                      <td><TrendingDown size={14} className="trend-down" /></td>
                      <td><span className="status-badge stable">On Track</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VoC Survey Tab */}
          {activeTab === 'voc' && (
            <div className="tab-panel voc-panel">
              <div className="voc-header">
                <div className="voc-score-card">
                  <span className="voc-score-label">VoC Satisfaction</span>
                  <span className="voc-score-value">72%</span>
                  <span className="voc-score-change negative">-5.1% vs last month</span>
                </div>
                <div className="voc-volume">
                  <span className="volume-value">156</span>
                  <span className="volume-label">Responses this month</span>
                </div>
              </div>

              {/* Sentiment Distribution */}
              <div className="sentiment-section">
                <h3>Sentiment Distribution</h3>
                <div className="sentiment-bars">
                  <div className="sentiment-bar-row">
                    <span className="sentiment-label">
                      <Smile size={14} className="satisfied" />
                      Satisfied
                    </span>
                    <div className="sentiment-bar">
                      <div className="bar-fill satisfied" style={{ width: '45%' }} />
                    </div>
                    <span className="sentiment-pct">45%</span>
                  </div>
                  <div className="sentiment-bar-row">
                    <span className="sentiment-label">
                      <Meh size={14} className="neutral" />
                      Neutral
                    </span>
                    <div className="sentiment-bar">
                      <div className="bar-fill neutral" style={{ width: '27%' }} />
                    </div>
                    <span className="sentiment-pct">27%</span>
                  </div>
                  <div className="sentiment-bar-row">
                    <span className="sentiment-label">
                      <Frown size={14} className="dissatisfied" />
                      Dissatisfied
                    </span>
                    <div className="sentiment-bar">
                      <div className="bar-fill dissatisfied" style={{ width: '28%' }} />
                    </div>
                    <span className="sentiment-pct">28%</span>
                  </div>
                </div>
              </div>

              {/* Theme Breakdown */}
              <div className="theme-section">
                <h3>Top Issues by Theme</h3>
                <div className="theme-list">
                  <div className="theme-item">
                    <span className="theme-rank">1</span>
                    <span className="theme-name">Staff Availability</span>
                    <span className="theme-count">42 mentions</span>
                    <span className="theme-change negative">+35%</span>
                  </div>
                  <div className="theme-item">
                    <span className="theme-rank">2</span>
                    <span className="theme-name">Checkout Wait Time</span>
                    <span className="theme-count">28 mentions</span>
                    <span className="theme-change negative">+22%</span>
                  </div>
                  <div className="theme-item">
                    <span className="theme-rank">3</span>
                    <span className="theme-name">Product Availability</span>
                    <span className="theme-count">18 mentions</span>
                    <span className="theme-change negative">+15%</span>
                  </div>
                  <div className="theme-item">
                    <span className="theme-rank">4</span>
                    <span className="theme-name">Store Cleanliness</span>
                    <span className="theme-count">12 mentions</span>
                    <span className="theme-change neutral">+2%</span>
                  </div>
                </div>
              </div>

              {/* Recent Comments */}
              <div className="comments-section">
                <h3>Recent Comments</h3>
                <div className="comments-list">
                  <div className="comment-item negative">
                    <div className="comment-header">
                      <Frown size={14} />
                      <span className="comment-date">Today, 2:15 PM</span>
                    </div>
                    <p>"Waited 15 minutes in line with only 2 registers open during lunch rush. Very frustrating."</p>
                    <span className="comment-theme">Checkout Wait Time</span>
                  </div>
                  <div className="comment-item negative">
                    <div className="comment-header">
                      <Frown size={14} />
                      <span className="comment-date">Today, 11:30 AM</span>
                    </div>
                    <p>"Couldn't find anyone to help me in the electronics section. Ended up leaving without buying."</p>
                    <span className="comment-theme">Staff Availability</span>
                  </div>
                  <div className="comment-item positive">
                    <div className="comment-header">
                      <Smile size={14} />
                      <span className="comment-date">Yesterday, 4:45 PM</span>
                    </div>
                    <p>"Great selection and the staff member in produce was very helpful with my questions."</p>
                    <span className="comment-theme">Staff Helpfulness</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shelf Audit Tab */}
          {activeTab === 'shelf' && (
            <div className="tab-panel shelf-panel">
              <div className="shelf-header">
                <div className="shelf-score-card">
                  <span className="shelf-score-label">POG Compliance</span>
                  <span className="shelf-score-value">74%</span>
                  <span className="shelf-score-change negative">-8% vs last scan</span>
                </div>
                <div className="shelf-actions">
                  <button className="shelf-action-btn">
                    <Camera size={14} />
                    New Scan
                  </button>
                  <button className="shelf-action-btn secondary">
                    <RefreshCw size={14} />
                    Re-scan Section
                  </button>
                </div>
              </div>

              {/* Aisle Selector */}
              <div className="aisle-selector">
                <span className="selector-label">Select Section:</span>
                <div className="aisle-chips">
                  <button className="aisle-chip">All</button>
                  <button className="aisle-chip critical">Section B</button>
                  <button className="aisle-chip warning">Section D</button>
                  <button className="aisle-chip">Section A</button>
                  <button className="aisle-chip">Section C</button>
                  <button className="aisle-chip">Accessories</button>
                </div>
              </div>

              {/* Delta Task List */}
              <div className="delta-tasks">
                <h3>
                  <CheckCircle2 size={16} />
                  Delta Task List — Women's Wall Display
                </h3>
                <div className="task-list">
                  <div className="task-item">
                    <span className="task-action add">ADD</span>
                    <span className="task-detail">Add 3 facings — Floral Print Dress (SKU: WD-2024-FL01)</span>
                    <span className="task-location">Section B, Rail 2</span>
                  </div>
                  <div className="task-item">
                    <span className="task-action add">ADD</span>
                    <span className="task-detail">Add 2 facings — Classic Fit Tee White (SKU: WT-2024-CL01)</span>
                    <span className="task-location">Section A, Shelf 1</span>
                  </div>
                  <div className="task-item">
                    <span className="task-action move">MOVE</span>
                    <span className="task-detail">Move Slim Fit Denim to eye-level rail</span>
                    <span className="task-location">Section C, Rail 3</span>
                  </div>
                  <div className="task-item">
                    <span className="task-action replace">REPLACE</span>
                    <span className="task-detail">Replace size labels — V-Neck Basics collection</span>
                    <span className="task-location">Section D, Shelf 2</span>
                  </div>
                  <div className="task-item">
                    <span className="task-action remove">REMOVE</span>
                    <span className="task-detail">Remove last season item — Winter Cardigan</span>
                    <span className="task-location">Section A, Rail 4</span>
                  </div>
                </div>
              </div>

              {/* Compliance Breakdown */}
              <div className="compliance-breakdown">
                <h3>Compliance by Section</h3>
                <div className="breakdown-grid">
                  <div className="breakdown-item critical">
                    <span className="breakdown-section">Section B</span>
                    <span className="breakdown-score">58%</span>
                    <span className="breakdown-issues">7 issues</span>
                  </div>
                  <div className="breakdown-item warning">
                    <span className="breakdown-section">Section A</span>
                    <span className="breakdown-score">72%</span>
                    <span className="breakdown-issues">3 issues</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-section">Section C</span>
                    <span className="breakdown-score">85%</span>
                    <span className="breakdown-issues">2 issues</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-section">Section D</span>
                    <span className="breakdown-score">92%</span>
                    <span className="breakdown-issues">1 issue</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store POG Tab */}
          {activeTab === 'pog' && (
            <div className="tab-panel pog-panel">
              <div className="pog-header">
                <div className="pog-info">
                  <h3>Active Planogram</h3>
                  <span className="pog-version">Women's Wall Display v2.1</span>
                  <span className="pog-date">Published: Apr 1, 2026</span>
                </div>
                <button className="request-change-btn">
                  <FileText size={14} />
                  Request POG Change
                </button>
              </div>

              {/* POG Viewer */}
              <div className="pog-viewer">
                <div className="viewer-toolbar">
                  <PremiumDropdown
                    value={pogSectionFilter}
                    options={[
                      { value: '', label: 'All Sections' },
                      { value: 'section-a', label: "Section A — Women's Tops" },
                      { value: 'section-b', label: "Section B — Women's Dresses" },
                      { value: 'section-c', label: "Section C — Women's Denim" },
                      { value: 'section-d', label: "Section D — Women's Basics" },
                    ]}
                    onChange={setPogSectionFilter}
                  />
                  <PremiumDropdown
                    value={pogCategoryFilter}
                    options={[
                      { value: '', label: 'All Categories' },
                      { value: 'tops', label: 'Tops & Blouses' },
                      { value: 'dresses', label: 'Dresses' },
                      { value: 'denim', label: 'Denim & Pants' },
                      { value: 'basics', label: 'Basics & Essentials' },
                    ]}
                    onChange={setPogCategoryFilter}
                  />
                </div>
                <div className="viewer-content">
                  <img 
                    src={LocalizedWomensWall} 
                    alt="Women's Wall Display - Localized Planogram" 
                    className="pog-image"
                  />
                </div>
              </div>

              {/* Pending Requests */}
              <div className="pending-requests">
                <h3>Pending Requests</h3>
                <div className="request-list">
                  <div className="request-item">
                    <span className="request-status pending">Pending Review</span>
                    <span className="request-title">Request additional facing for high-velocity SKU</span>
                    <span className="request-date">Submitted Apr 10, 2026</span>
                  </div>
                </div>
              </div>

              {/* OOS Adaptations */}
              <div className="oos-adaptations">
                <h3>OOS Adaptation Notifications</h3>
                <div className="adaptation-list">
                  <div className="adaptation-item">
                    <AlertTriangle size={14} />
                    <span>Temporary substitution active for SKU 49000028904 — use adjacent facing</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inbound Delivery Tab */}
          {activeTab === 'inbound' && (
            <div className="tab-panel inbound-panel">
              <div className="inbound-header">
                <div className="inbound-summary">
                  <div className="summary-card">
                    <span className="summary-value">5</span>
                    <span className="summary-label">Shipments (7 days)</span>
                  </div>
                  <div className="summary-card warning">
                    <span className="summary-value">2</span>
                    <span className="summary-label">Delayed</span>
                  </div>
                  <div className="summary-card critical">
                    <span className="summary-value">8</span>
                    <span className="summary-label">OOS-Risk SKUs</span>
                  </div>
                </div>
              </div>

              {/* 7-Day Timeline */}
              <div className="shipment-timeline">
                <h3>7-Day Shipment Timeline</h3>
                <div className="timeline-grid">
                  <div className="timeline-day">
                    <span className="day-label">Today</span>
                    <div className="day-shipments">
                      <div className="shipment-badge delayed">
                        <Truck size={12} />
                        <span>APL-2041 (Delayed)</span>
                      </div>
                    </div>
                  </div>
                  <div className="timeline-day">
                    <span className="day-label">Tomorrow</span>
                    <div className="day-shipments">
                      <div className="shipment-badge delayed">
                        <Truck size={12} />
                        <span>APL-2042 (Delayed)</span>
                      </div>
                      <div className="shipment-badge scheduled">
                        <Truck size={12} />
                        <span>APL-2045</span>
                      </div>
                    </div>
                  </div>
                  <div className="timeline-day">
                    <span className="day-label">Apr 14</span>
                    <div className="day-shipments">
                      <div className="shipment-badge scheduled">
                        <Truck size={12} />
                        <span>APL-2048</span>
                      </div>
                    </div>
                  </div>
                  <div className="timeline-day">
                    <span className="day-label">Apr 15</span>
                    <div className="day-shipments">
                      <div className="shipment-badge scheduled">
                        <Truck size={12} />
                        <span>APL-2050</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* OOS Risk Prioritization */}
              <div className="oos-priority">
                <h3>OOS-Risk SKU Prioritization</h3>
                <div className="oos-list">
                  <div className="oos-item high">
                    <span className="oos-rank">1</span>
                    <span className="oos-sku">V-Neck Basic Tee — White (M)</span>
                    <span className="oos-velocity">High Velocity</span>
                    <span className="oos-eta">ETA: Tomorrow</span>
                  </div>
                  <div className="oos-item high">
                    <span className="oos-rank">2</span>
                    <span className="oos-sku">Floral Print Dress — Navy (S)</span>
                    <span className="oos-velocity">High Velocity</span>
                    <span className="oos-eta">ETA: Tomorrow</span>
                  </div>
                  <div className="oos-item medium">
                    <span className="oos-rank">3</span>
                    <span className="oos-sku">Slim Fit Denim — Dark Wash (L)</span>
                    <span className="oos-velocity">Medium Velocity</span>
                    <span className="oos-eta">ETA: Apr 14</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comp Benchmarking Tab */}
          {activeTab === 'comp' && (
            <div className="tab-panel comp-panel">
              <div className="comp-header">
                <div className="comp-rank-large">
                  <span className="rank-label">Comp Store Rank</span>
                  <span className="rank-value">#4 of 12</span>
                  <span className="rank-change negative">↓ 2 spots this month</span>
                </div>
                <div className="peer-group">
                  <h4>Peer Group Definition</h4>
                  <p>Urban High-Traffic stores in Tennessee region with similar sales volume ($150K–$200K weekly)</p>
                </div>
              </div>

              {/* KPI Gap Radar */}
              <div className="kpi-gap-section">
                <h3>KPI Gap vs Comp Median</h3>
                <div className="gap-grid">
                  <div className="gap-item negative">
                    <span className="gap-kpi">Net Sales</span>
                    <span className="gap-value">-4.2%</span>
                    <span className="gap-label">below median</span>
                  </div>
                  <div className="gap-item negative">
                    <span className="gap-kpi">VoC Satisfaction</span>
                    <span className="gap-value">-6.1%</span>
                    <span className="gap-label">below median</span>
                  </div>
                  <div className="gap-item negative">
                    <span className="gap-kpi">SEA Score</span>
                    <span className="gap-value">-3.8</span>
                    <span className="gap-label">below median</span>
                  </div>
                  <div className="gap-item neutral">
                    <span className="gap-kpi">GM%</span>
                    <span className="gap-value">-0.5%</span>
                    <span className="gap-label">near median</span>
                  </div>
                </div>
              </div>

              {/* Prescriptive Actions */}
              <div className="prescriptive-actions">
                <h3>
                  <Sparkles size={16} />
                  Prescriptive Actions Based on Comp Analysis
                </h3>
                <div className="prescriptive-list">
                  <div className="prescriptive-item">
                    <div className="prescriptive-icon">
                      <Users size={14} />
                    </div>
                    <div className="prescriptive-content">
                      <span className="prescriptive-title">Staffing optimization opportunity</span>
                      <p>Top 3 comp stores have 15% more staff during 10am–2pm. Consider shift reallocation.</p>
                    </div>
                  </div>
                  <div className="prescriptive-item">
                    <div className="prescriptive-icon">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="prescriptive-content">
                      <span className="prescriptive-title">SEA improvement potential</span>
                      <p>Addressing safety checkpoint would move store from #4 to #2 in comp ranking.</p>
                    </div>
                  </div>
                  <div className="prescriptive-item">
                    <div className="prescriptive-icon">
                      <DollarSign size={14} />
                    </div>
                    <div className="prescriptive-content">
                      <span className="prescriptive-title">Revenue recovery path</span>
                      <p>Fixing planogram gaps in high-velocity categories could recover ~$8K weekly based on comp performance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Detail Side Panel */}
      {selectedKPI && (
        <div className="kpi-panel-overlay" onClick={() => setSelectedKPI(null)}>
          <div className="kpi-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
              <h3>{selectedKPI.label}</h3>
              <button className="panel-close" onClick={() => setSelectedKPI(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="panel-content">
              <div className="panel-value-section">
                <span className="panel-current-value">{selectedKPI.value}</span>
                <span className={`panel-variance ${selectedKPI.varianceType}`}>
                  {selectedKPI.variance} {selectedKPI.secondaryVariance}
                </span>
              </div>
              <div className="panel-comparison">
                <div className="comparison-row">
                  <span>vs Last Month</span>
                  <span className="negative">-3.2%</span>
                </div>
                <div className="comparison-row">
                  <span>vs Last Year</span>
                  <span className="negative">-5.1%</span>
                </div>
                <div className="comparison-row">
                  <span>vs District Avg</span>
                  <span className="negative">-4.2%</span>
                </div>
              </div>
              <div className="panel-chart">
                <h4>Trend (Last 8 Weeks)</h4>
                <div className="chart-placeholder">
                  <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke={selectedKPI.varianceType === 'positive' ? '#10b981' : '#ef4444'}
                      strokeWidth="2"
                      points="0,20 40,25 80,35 120,40 160,50 200,60 240,70 300,80"
                    />
                  </svg>
                </div>
              </div>
              <div className="panel-ai-summary">
                <Sparkles size={14} />
                <p>Declining trend over 8 weeks. Performance is 4.2% below district average. Immediate attention required on staffing and shelf availability.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDeepDive;
