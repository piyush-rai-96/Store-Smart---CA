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
  Grid3X3,
  Send,
  Layers,
  Plus,
  Edit3,
  Package,
  MessageSquare,
  ExternalLink,
  Users,
  Check
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

interface DistrictAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium';
  title: string;
  reason: string;
  impact: string;
  storeCount: number;
  cta: string;
  ctaAction: string;
}

interface KPIData {
  id: string;
  label: string;
  value: string;
  variance: string;
  varianceType: 'positive' | 'negative' | 'neutral';
  secondaryVariance?: string;
  trend: number[];
}

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

const mockAlerts: (DistrictAlert & { category: string })[] = [
  { id: '1', severity: 'critical', category: 'Revenue', title: 'Revenue Leakage Alert', reason: '3 high-volume stores showing consecutive weekly decline', impact: '$45K potential monthly loss', storeCount: 3, cta: 'View Stores', ctaAction: 'stores' },
  { id: '2', severity: 'high', category: 'VoC', title: 'VoC Crisis Pattern Detected', reason: 'Staff availability complaints up 40% in cluster B', impact: 'Customer satisfaction at risk', storeCount: 4, cta: 'Investigate', ctaAction: 'voc' },
  { id: '3', severity: 'high', category: 'SEA', title: 'SEA Compliance Failure', reason: 'Planogram audit failures recurring in 3 stores', impact: 'Merchandising effectiveness compromised', storeCount: 3, cta: 'Open Audit', ctaAction: 'sea' },
  { id: '4', severity: 'medium', category: 'Broadcast', title: 'Broadcast Non-Compliance', reason: '5 stores have not acknowledged critical safety broadcast', impact: 'Compliance gap', storeCount: 5, cta: 'Follow Up', ctaAction: 'broadcast' },
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
  
  const days: (number | null)[] = [];
  
  // Add empty slots for days before the first day of month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
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
  useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingStore, setNavigatingStore] = useState<string | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<KPIData | null>(null);
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'risk' | 'top' | 'revenue'>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('week');
  const [viewingMonth, setViewingMonth] = useState(new Date().getMonth());
  const [viewingYear, setViewingYear] = useState(new Date().getFullYear());
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  
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
  
  // Toast notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  // Navigate to Store Deep Dive with loading
  const handleStoreClick = (store: typeof mockStores[0]) => {
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
    }
    return 'Select Period';
  };

  // District metrics - different values for Week vs Month
  const weekData: { dpi: number; tier: DistrictTier; rank: number; dpiChange: number; momentum: MomentumType; momentumDelta: number; chainAvg: number } = {
    dpi: 87,
    tier: 'Excellence',
    rank: 3,
    dpiChange: +2.4,
    momentum: 'Improving',
    momentumDelta: +3.2,
    chainAvg: 79
  };
  
  const monthData: { dpi: number; tier: DistrictTier; rank: number; dpiChange: number; momentum: MomentumType; momentumDelta: number; chainAvg: number } = {
    dpi: 82,
    tier: 'Stable',
    rank: 5,
    dpiChange: +1.8,
    momentum: 'Improving',
    momentumDelta: +2.1,
    chainAvg: 79
  };
  
  const currentData = calendarMode === 'week' ? weekData : monthData;
  const districtDPI = currentData.dpi;
  const districtTier: DistrictTier = currentData.tier;
  const districtRank = currentData.rank;
  const totalDistricts = 24;
  const dpiChange = currentData.dpiChange;
  const chainAvgDPI = currentData.chainAvg;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  const filteredStores = mockStores.filter(store => {
    if (leaderboardFilter === 'all') return true;
    if (leaderboardFilter === 'risk') return store.status === 'critical' || store.status === 'warning';
    if (leaderboardFilter === 'top') return store.status === 'excellent';
    if (leaderboardFilter === 'revenue') return store.netSalesVar < 0;
    return true;
  });

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
            <span className="district-badge">
              <MapPin size={14} />
              District 14 — Tennessee
            </span>
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
                      onClick={() => setCalendarMode('week')}
                    >
                      Week
                    </button>
                    <button 
                      className={`mode-btn ${calendarMode === 'month' ? 'active' : ''}`}
                      onClick={() => setCalendarMode('month')}
                    >
                      Month
                    </button>
                  </div>
                  
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
                      {calendarDays.map((day, index) => {
                        const date = day ? new Date(viewingYear, viewingMonth, day) : null;
                        const isDisabledWeek = date ? (isDateInFuture(date) || isDateInCurrentWeek(date)) : true;
                        const isDisabledMonth = viewingYear > new Date().getFullYear() || 
                          (viewingYear === new Date().getFullYear() && viewingMonth >= new Date().getMonth());
                        const isDisabled = calendarMode === 'week' ? isDisabledWeek : isDisabledMonth;
                        const isSelectedWeek = isInSelectedWeek(day);
                        const isSelectedMonth = selectedMonth && 
                          viewingYear === selectedMonth.getFullYear() && 
                          viewingMonth === selectedMonth.getMonth() && day !== null;
                        const isSelected = calendarMode === 'week' ? isSelectedWeek : isSelectedMonth;
                        
                        return (
                          <button
                            key={index}
                            className={`calendar-day ${!day ? 'empty' : ''} ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              if (calendarMode === 'week') {
                                handleDayClick(day);
                              } else if (day && !isDisabledMonth) {
                                setSelectedMonth(new Date(viewingYear, viewingMonth, 1));
                                setShowCalendar(false);
                              }
                            }}
                            disabled={!day || isDisabled}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
                <span className="dpi-change-label">{calendarMode === 'week' ? 'this week' : 'this month'}</span>
              </div>
            </div>

            {/* Score Breakdown - Card Grid */}
            <div className="dpi-breakdown-header">
              <span className="breakdown-title">Score Breakdown</span>
            </div>
            <div className="dpi-breakdown-grid">
              <div className="breakdown-card">
                <div className="breakdown-value">92</div>
                <div className="breakdown-label">Sales</div>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="breakdown-card">
                <div className="breakdown-value">85</div>
                <div className="breakdown-label">Execution</div>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="breakdown-card">
                <div className="breakdown-value">84</div>
                <div className="breakdown-label">VoC</div>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chain Comparison Card */}
        <div className="pulse-card comparison-card">
          <div className="pulse-card-header">
            <span className="pulse-card-label">vs Chain Average</span>
          </div>
          <div className="comparison-visual">
            <div className="comparison-bar">
              <div className="bar-district" style={{ width: `${(districtDPI / 100) * 100}%` }}>
                <span>{districtDPI}</span>
              </div>
              <div className="bar-chain-marker" style={{ left: `${(chainAvgDPI / 100) * 100}%` }}>
                <span className="chain-label">Chain: {chainAvgDPI}</span>
              </div>
            </div>
          </div>
          <div className="comparison-delta">
            <span className="positive">+{districtDPI - chainAvgDPI} pts above chain</span>
          </div>
        </div>

        {/* Triage Summary */}
        <div className="pulse-card triage-card">
          <div className="pulse-card-header">
            <AlertCircle size={16} className="triage-icon" />
            <span className="pulse-card-label">Triage Summary</span>
          </div>
          <div className="triage-items">
            <div className="triage-item">
              <div className="triage-item-header">
                <span className="triage-item-title">VoC: Messy Aisles</span>
              </div>
              <p className="triage-item-stores">Hamburg South · Cologne East · Berlin Mitte</p>
              <span className="triage-item-metric">+22% theme spike</span>
            </div>
            
            <div className="triage-item">
              <div className="triage-item-header">
                <span className="triage-item-title">SEA Auto-Fail: Fire Exit</span>
              </div>
              <p className="triage-item-stores">Hamburg South — Display blocking exit</p>
              <span className="triage-item-metric">Escalated to DM · Pending</span>
            </div>
            
            <div className="triage-item">
              <div className="triage-item-header">
                <span className="triage-item-title">Inbound OOS Risk</span>
              </div>
              <p className="triage-item-stores">Cologne East — 3 SKUs delayed 48h</p>
              <span className="triage-item-metric">Adaptation pending approval</span>
            </div>
          </div>
          
          <div className="ai-summary-section">
            <div className="ai-summary-label">
              <Sparkles size={12} />
              <span>AI Summary</span>
            </div>
            <p className="ai-summary-text">
              3 active triage items require attention. VoC theme spike indicates potential staffing or process issue across multiple stores. SEA fire exit violation is critical priority. Recommend immediate store manager follow-up.
            </p>
          </div>
        </div>

        {/* District Broadcasting */}
        <div className="pulse-card broadcast-card">
          <div className="pulse-card-header">
            <Megaphone size={16} className="broadcast-icon" />
            <span className="pulse-card-label">District Broadcasting</span>
          </div>
          <div className="broadcast-content">
            <div className="broadcast-stats">
              <div className="broadcast-stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="broadcast-stat">
                <span className="stat-number">12</span>
                <span className="stat-label">This Week</span>
              </div>
              <div className="broadcast-stat">
                <span className="stat-number">94%</span>
                <span className="stat-label">Acknowledged</span>
              </div>
            </div>
            
            <div className="recent-broadcasts">
              <div className="broadcast-item">
                <div className="broadcast-item-header">
                  <span className="broadcast-priority high">HIGH</span>
                  <span className="broadcast-time">2h ago</span>
                </div>
                <p className="broadcast-title">Safety Protocol Update</p>
                <span className="broadcast-ack">8/8 stores acknowledged</span>
              </div>
              <div className="broadcast-item">
                <div className="broadcast-item-header">
                  <span className="broadcast-priority medium">MEDIUM</span>
                  <span className="broadcast-time">Yesterday</span>
                </div>
                <p className="broadcast-title">Weekend Staffing Reminder</p>
                <span className="broadcast-ack">6/8 stores acknowledged</span>
              </div>
            </div>
            
            <button 
              className="create-broadcast-btn"
              onClick={() => {
                setShowChatWindow(true);
                setChatExpanded(true);
                setShowBroadcastComposer(true);
              }}
            >
              <Megaphone size={14} />
              Create Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* District Alerts Rail */}
      <div className="alerts-rail">
        <div className="alerts-header">
          <h2>
            <AlertTriangle size={18} />
            Priority Alerts
          </h2>
          <span className="alerts-count">{mockAlerts.length} active</span>
        </div>
        <div className="alerts-cards-grid">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className={`alert-card-new severity-${alert.severity}`}>
              <div className="alert-card-top">
                <div className="alert-card-badges">
                  <span className={`category-tag ${alert.category.toLowerCase()}`}>
                    {alert.category}
                  </span>
                  <span className={`severity-tag ${alert.severity}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <div className="alert-stores-pill">
                  <Store size={12} />
                  <span>{alert.storeCount} stores</span>
                </div>
              </div>
              <div className="alert-card-content">
                <h4 className="alert-card-title">{alert.title}</h4>
                <p className="alert-card-desc">{alert.reason}</p>
                <div className="alert-card-impact">
                  <AlertCircle size={14} />
                  <span>{alert.impact}</span>
                </div>
              </div>
              <div className="alert-card-footer">
                <button 
                  className="alert-card-btn"
                  onClick={() => {
                    if (alert.ctaAction === 'stores') {
                      // Scroll to store leaderboard
                      document.querySelector('.leaderboard-section-premium')?.scrollIntoView({ behavior: 'smooth' });
                      setLeaderboardFilter('risk');
                    } else if (alert.ctaAction === 'voc') {
                      // Open VoC investigation panel
                      setShowVocPanel(true);
                    } else if (alert.ctaAction === 'sea') {
                      // Open SEA audit panel
                      setShowSeaPanel(true);
                    } else if (alert.ctaAction === 'broadcast') {
                      // Open broadcast composer
                      setShowChatWindow(true);
                      setChatExpanded(true);
                      setShowBroadcastComposer(true);
                    }
                  }}
                >
                  {alert.cta}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      
      {/* Store Leaderboard - Premium */}
      <div className="leaderboard-section-premium">
        <div className="leaderboard-header-premium">
          <div className="header-title-row">
            <div className="title-group">
              <h2><Store size={20} /> Store Leaderboard</h2>
              <span className="header-subtitle">Performance ranking across all stores</span>
            </div>
            <div className="header-stats">
              <div className="stat-pill">
                <span className="stat-value">{mockStores.length}</span>
                <span className="stat-label">Stores</span>
              </div>
              <div className="stat-pill success">
                <span className="stat-value">{mockStores.filter(s => s.status === 'excellent').length}</span>
                <span className="stat-label">Excellent</span>
              </div>
              <div className="stat-pill warning">
                <span className="stat-value">{mockStores.filter(s => s.status === 'warning' || s.status === 'critical').length}</span>
                <span className="stat-label">Needs Attention</span>
              </div>
            </div>
          </div>
          <div className="leaderboard-controls">
            <div className="search-filter">
              <Search size={16} />
              <input type="text" placeholder="Search stores..." className="store-search-input" />
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
                <th className="th-rank">Rank</th>
                <th className="th-store">Store</th>
                <th className="th-dpi">DPI</th>
                <th className="th-sales">Net Sales</th>
                <th className="th-sea">SEA Score</th>
                <th className="th-voc">VoC %</th>
                <th className="th-issue">Top VoC Issue</th>
                <th className="th-issue">Top SEA Issue</th>
                <th className="th-trend">Trend</th>
                <th className="th-status">Status</th>
                <th className="th-action"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id} className={`row-${store.status.toLowerCase()}`}>
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
                  <td className="td-action">
                    <button 
                      className={`action-btn ${navigatingStore === store.storeNumber ? 'loading' : ''}`}
                      onClick={() => handleStoreClick(store)}
                      disabled={isNavigating}
                    >
                      {navigatingStore === store.storeNumber ? (
                        <RefreshCw size={16} className="spinning" />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* District Diagnostic Visual Zone */}
      <div className="diagnostic-zone">
        <div className="section-header">
          <h2>
            <Grid3X3 size={18} />
            District Diagnostics
          </h2>
          <span className="section-subtitle">Why the district looks this way</span>
        </div>
        <div className="diagnostic-grid">
          {/* Sales Performance 2x2 Matrix - Premium */}
          <div className="diagnostic-card-premium matrix-premium">
            <div className="card-header-premium">
              <div className="header-left">
                <h3>Sales Performance Matrix</h3>
                <span className="header-subtitle">Store positioning by momentum & performance</span>
              </div>
              <div className="header-legend">
                <span className="legend-item"><span className="dot excellence"></span>Excellence</span>
                <span className="legend-item"><span className="dot stable"></span>Stable</span>
                <span className="legend-item"><span className="dot atrisk"></span>At Risk</span>
              </div>
            </div>
            <div className="matrix-premium-chart">
              <div className="matrix-y-label">← L12M YoY Sales</div>
              <div className="matrix-grid-premium">
                <div className="quadrant-premium stars">
                  <div className="quad-header">Stars</div>
                  <div className="quad-desc">High growth, improving trend</div>
                </div>
                <div className="quadrant-premium champions">
                  <div className="quad-header">Champions</div>
                  <div className="quad-desc">Consistent top performers</div>
                </div>
                <div className="quadrant-premium turnaround">
                  <div className="quad-header">Turnaround</div>
                  <div className="quad-desc">Recent recovery signals</div>
                </div>
                <div className="quadrant-premium atrisk">
                  <div className="quad-header">At Risk</div>
                  <div className="quad-desc">Declining performance</div>
                </div>
                <div className="matrix-center-lines">
                  <div className="center-h"></div>
                  <div className="center-v"></div>
                </div>
                <div className="bubbles-container">
                  {mockStores.slice(0, 6).map((store) => (
                    <div
                      key={store.id}
                      className={`bubble-node tier-${store.dpiTier.toLowerCase()}`}
                      style={{
                        left: `${15 + (store.netSalesVar + 15) * 2.3}%`,
                        top: `${75 - (store.dpi - 50) * 1.3}%`,
                      }}
                    >
                      <div className="bubble-popup">
                        <div className="popup-title">Store #{store.storeNumber}</div>
                        <div className="popup-row">
                          <span className="popup-label">DPI Score</span>
                          <strong className="popup-value">{store.dpi}</strong>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">YoY Sales</span>
                          <strong className={`popup-value ${store.netSalesVar >= 0 ? 'positive' : 'negative'}`}>{store.netSalesVar > 0 ? '+' : ''}{store.netSalesVar}%</strong>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Volume</span>
                          <strong className="popup-value">${(store.netSales/1000).toFixed(0)}K</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="matrix-x-label">Current YoY Sales →</div>
            </div>
            <div className="diagnostic-insights-section">
              <div className="insights-header">
                <span className="insights-icon">💡</span>
                <span className="insights-title">Key Insights</span>
              </div>
              <div className="insights-list">
                <div className="insight-item">
                  <span className="insight-bullet success"></span>
                  <span className="insight-text"><strong>2 stores</strong> in Champions quadrant driving 45% of district revenue</span>
                </div>
                <div className="insight-item">
                  <span className="insight-bullet warning"></span>
                  <span className="insight-text"><strong>Store #1234</strong> showing early turnaround signals — monitor closely</span>
                </div>
                <div className="insight-item">
                  <span className="insight-bullet danger"></span>
                  <span className="insight-text"><strong>1 store</strong> at risk of slipping to Crisis tier if trend continues</span>
                </div>
              </div>
            </div>
          </div>

          {/* SEA Compliance Risk Grid - Premium */}
          <div className="diagnostic-card-premium compliance-premium">
            <div className="card-header-premium">
              <div className="header-left">
                <h3>SEA Compliance Risk</h3>
                <span className="header-subtitle">Last audit vs 12-month average</span>
              </div>
              <div className="compliance-score-badge">
                <span className="score-value">82%</span>
                <span className="score-label">Avg Score</span>
              </div>
            </div>
            <div className="compliance-grid-premium">
              <div className="compliance-tile healthy">
                <div className="tile-icon-wrap healthy">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="tile-count">3</div>
                <div className="tile-label">Healthy</div>
                <div className="tile-desc">Consistent high scores</div>
              </div>
              <div className="compliance-tile onetime">
                <div className="tile-icon-wrap onetime">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="7" x2="17" y2="17"></line>
                  </svg>
                </div>
                <div className="tile-count">2</div>
                <div className="tile-label">One-time Dip</div>
                <div className="tile-desc">Recent isolated failure</div>
              </div>
              <div className="compliance-tile recovering">
                <div className="tile-icon-wrap recovering">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
                <div className="tile-count">1</div>
                <div className="tile-label">Recovering</div>
                <div className="tile-desc">Improving from low</div>
              </div>
              <div className="compliance-tile chronic">
                <div className="tile-icon-wrap chronic">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="tile-count">2</div>
                <div className="tile-label">Chronic Risk</div>
                <div className="tile-desc">Persistent failures</div>
              </div>
            </div>
            <div className="diagnostic-insights-section">
              <div className="insights-header">
                <span className="insights-icon">🔍</span>
                <span className="insights-title">Top Compliance Issues</span>
              </div>
              <div className="insights-list">
                <div className="insight-item">
                  <span className="insight-bullet danger"></span>
                  <span className="insight-text"><strong>Planogram adherence</strong> — 3 stores failed shelf arrangement audit</span>
                </div>
                <div className="insight-item">
                  <span className="insight-bullet warning"></span>
                  <span className="insight-text"><strong>Signage compliance</strong> — Missing promotional displays in 2 stores</span>
                </div>
                <div className="insight-item">
                  <span className="insight-bullet info"></span>
                  <span className="insight-text"><strong>Stock rotation</strong> — FIFO violations detected in backroom areas</span>
                </div>
              </div>
            </div>
          </div>

          {/* VoC Sentiment Distribution - Premium */}
          <div className="diagnostic-card-premium sentiment-premium">
            <div className="card-header-premium">
              <div className="header-left">
                <h3>VoC Sentiment Distribution</h3>
                <span className="header-subtitle">District-wide customer experience</span>
              </div>
              <div className="sentiment-score-badge">
                <span className="score-value">78%</span>
                <span className="score-label">Satisfaction</span>
              </div>
            </div>
            <div className="sentiment-content-premium">
              <div className="donut-section">
                <div className="donut-premium">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="10"
                      strokeDasharray="143.3 238.8" strokeDashoffset="0" transform="rotate(-90 50 50)" 
                      style={{filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'}} />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="10"
                      strokeDasharray="47.8 238.8" strokeDashoffset="-143.3" transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="10"
                      strokeDasharray="47.8 238.8" strokeDashoffset="-191.1" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="donut-center-premium">
                    <span className="center-score">78%</span>
                  </div>
                </div>
              </div>
              <div className="sentiment-details">
                <div className="sentiment-item satisfied">
                  <div className="item-header">
                    <span className="item-dot"></span>
                    <span className="item-label">Satisfied</span>
                  </div>
                  <div className="item-bar-wrap">
                    <div className="item-bar"><div className="bar-fill" style={{width: '60%'}}></div></div>
                    <span className="item-value">60%</span>
                  </div>
                </div>
                <div className="sentiment-item neutral">
                  <div className="item-header">
                    <span className="item-dot"></span>
                    <span className="item-label">Neutral</span>
                  </div>
                  <div className="item-bar-wrap">
                    <div className="item-bar"><div className="bar-fill" style={{width: '20%'}}></div></div>
                    <span className="item-value">20%</span>
                  </div>
                </div>
                <div className="sentiment-item dissatisfied">
                  <div className="item-header">
                    <span className="item-dot"></span>
                    <span className="item-label">Dissatisfied</span>
                  </div>
                  <div className="item-bar-wrap">
                    <div className="item-bar"><div className="bar-fill" style={{width: '20%'}}></div></div>
                    <span className="item-value">20%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="diagnostic-insights-section">
              <div className="insights-header">
                <span className="insights-icon">📊</span>
                <span className="insights-title">Customer Feedback Themes</span>
              </div>
              <div className="insights-list">
                <div className="insight-item">
                  <span className="insight-bullet danger"></span>
                  <span className="insight-text"><strong>Staff availability</strong> — 34% of negative reviews mention long wait for assistance</span>
                </div>
                <div className="insight-item">
                  <span className="insight-bullet warning"></span>
                  <span className="insight-text"><strong>Checkout wait times</strong> — Peak hour queues averaging 8+ minutes</span>
                </div>
                <div className="insight-item">
                  <span className="insight-bullet success"></span>
                  <span className="insight-text"><strong>Product quality</strong> — Positive sentiment up 12% after new apparel launch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POG Cluster Manager Section */}
      <div className="cluster-section">
        <div className="section-header">
          <h2>
            <Layers size={18} />
            POG Cluster Manager
          </h2>
          <button className="create-cluster-btn">
            <Plus size={14} />
            Create Cluster
          </button>
        </div>
        <div className="cluster-content">
          {/* Cluster Summary Cards */}
          <div className="cluster-summary-cards">
            <div className="cluster-summary-card">
              <span className="summary-value">3</span>
              <span className="summary-label">Active Clusters</span>
            </div>
            <div className="cluster-summary-card">
              <span className="summary-value">1</span>
              <span className="summary-label">Draft</span>
            </div>
            <div className="cluster-summary-card">
              <span className="summary-value">8</span>
              <span className="summary-label">Stores Assigned</span>
            </div>
            <div className="cluster-summary-card warning">
              <span className="summary-value">2</span>
              <span className="summary-label">POG Reviews Due</span>
            </div>
          </div>

          {/* Cluster List Table */}
          <div className="cluster-table-wrapper">
            <table className="cluster-table">
              <thead>
                <tr>
                  <th>Cluster Name</th>
                  <th>Stores</th>
                  <th>Base POG</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th>Avg DPI</th>
                  <th>Avg SEA</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="cluster-name-cell">
                    <Package size={14} />
                    <span>High Volume Urban</span>
                  </td>
                  <td>3</td>
                  <td>POG-2024-A</td>
                  <td>Apr 10, 2026</td>
                  <td><span className="cluster-status active">Active</span></td>
                  <td className="dpi-cell"><span style={{color: '#10b981'}}>91</span></td>
                  <td>94</td>
                  <td>
                    <button className="cluster-action-btn">
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="cluster-name-cell">
                    <Package size={14} />
                    <span>Suburban Standard</span>
                  </td>
                  <td>3</td>
                  <td>POG-2024-B</td>
                  <td>Apr 8, 2026</td>
                  <td><span className="cluster-status active">Active</span></td>
                  <td className="dpi-cell"><span style={{color: '#0ea5e9'}}>82</span></td>
                  <td>85</td>
                  <td>
                    <button className="cluster-action-btn">
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="cluster-name-cell">
                    <Package size={14} />
                    <span>Low Traffic Rural</span>
                  </td>
                  <td>2</td>
                  <td>POG-2024-C</td>
                  <td>Apr 5, 2026</td>
                  <td><span className="cluster-status review">Review Due</span></td>
                  <td className="dpi-cell"><span style={{color: '#f59e0b'}}>68</span></td>
                  <td>72</td>
                  <td>
                    <button className="cluster-action-btn">
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cluster Analytics */}
          <div className="cluster-analytics">
            <div className="cluster-analytics-card perf-card">
              <h4>Performance by Cluster</h4>
              <div className="cluster-perf-grid">
                <div className="perf-ring-item excellence">
                  <div className="perf-ring">
                    <svg viewBox="0 0 100 100">
                      <circle className="ring-bg" cx="50" cy="50" r="42" />
                      <circle className="ring-fill" cx="50" cy="50" r="42" 
                        strokeDasharray={`${91 * 2.64} 264`} />
                    </svg>
                    <div className="ring-value">
                      <span className="ring-number">91</span>
                      <span className="ring-label">DPI</span>
                    </div>
                  </div>
                  <div className="perf-ring-info">
                    <span className="ring-title">High Volume Urban</span>
                    <span className="ring-stores">3 stores</span>
                    <span className="ring-trend positive">+4.2%</span>
                  </div>
                </div>
                <div className="perf-ring-item stable">
                  <div className="perf-ring">
                    <svg viewBox="0 0 100 100">
                      <circle className="ring-bg" cx="50" cy="50" r="42" />
                      <circle className="ring-fill" cx="50" cy="50" r="42" 
                        strokeDasharray={`${82 * 2.64} 264`} />
                    </svg>
                    <div className="ring-value">
                      <span className="ring-number">82</span>
                      <span className="ring-label">DPI</span>
                    </div>
                  </div>
                  <div className="perf-ring-info">
                    <span className="ring-title">Suburban Standard</span>
                    <span className="ring-stores">3 stores</span>
                    <span className="ring-trend positive">+1.8%</span>
                  </div>
                </div>
                <div className="perf-ring-item atrisk">
                  <div className="perf-ring">
                    <svg viewBox="0 0 100 100">
                      <circle className="ring-bg" cx="50" cy="50" r="42" />
                      <circle className="ring-fill" cx="50" cy="50" r="42" 
                        strokeDasharray={`${68 * 2.64} 264`} />
                    </svg>
                    <div className="ring-value">
                      <span className="ring-number">68</span>
                      <span className="ring-label">DPI</span>
                    </div>
                  </div>
                  <div className="perf-ring-info">
                    <span className="ring-title">Low Traffic Rural</span>
                    <span className="ring-stores">2 stores</span>
                    <span className="ring-trend negative">-2.1%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cluster-analytics-card trend-card">
              <h4>POG Compliance Trend</h4>
              <div className="trend-stats-row">
                <div className="trend-stat">
                  <span className="trend-stat-value">94%</span>
                  <span className="trend-stat-label">Current</span>
                </div>
                <div className="trend-stat">
                  <span className="trend-stat-value">86%</span>
                  <span className="trend-stat-label">Q1 Start</span>
                </div>
                <div className="trend-stat highlight">
                  <span className="trend-stat-value positive">+8%</span>
                  <span className="trend-stat-label">Change</span>
                </div>
              </div>
              <div className="compliance-trend-chart-enhanced">
                <div className="chart-y-axis">
                  <span>100%</span>
                  <span>90%</span>
                  <span>80%</span>
                </div>
                <div className="chart-area">
                  <svg viewBox="0 0 240 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <polygon fill="url(#trendGradient)" 
                      points="0,100 0,70 40,65 80,55 120,50 160,40 200,35 240,30 240,100" />
                    <polyline fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4"
                      points="0,50 240,50" />
                    <polyline fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      points="0,70 40,65 80,55 120,50 160,40 200,35 240,30" />
                    <circle cx="0" cy="70" r="4" fill="#10b981" />
                    <circle cx="40" cy="65" r="4" fill="#10b981" />
                    <circle cx="80" cy="55" r="4" fill="#10b981" />
                    <circle cx="120" cy="50" r="4" fill="#10b981" />
                    <circle cx="160" cy="40" r="4" fill="#10b981" />
                    <circle cx="200" cy="35" r="4" fill="#10b981" />
                    <circle cx="240" cy="30" r="5" fill="#059669" stroke="#fff" strokeWidth="2" />
                  </svg>
                  <div className="chart-x-axis">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                  </div>
                </div>
              </div>
              <div className="trend-insight">
                <span className="insight-icon">💡</span>
                <span className="insight-text">Consistent improvement driven by High Volume Urban cluster (+12%)</span>
              </div>
            </div>
          </div>
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
                  <span>MoM Change</span>
                  <span className="positive">+2.1%</span>
                </div>
                <div className="comparison-row">
                  <span>YoY Change</span>
                  <span className="positive">+4.2%</span>
                </div>
                <div className="comparison-row">
                  <span>Chain Average</span>
                  <span>$1.18M</span>
                </div>
              </div>
              <div className="panel-chart">
                <h4>Trend (Last 12 Weeks)</h4>
                <div className="chart-placeholder">
                  <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke={selectedKPI.varianceType === 'positive' ? '#10b981' : '#ef4444'}
                      strokeWidth="2"
                      points="0,80 30,75 60,70 90,65 120,68 150,60 180,55 210,50 240,45 270,40 300,35"
                    />
                    <polyline
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1"
                      strokeDasharray="4"
                      points="0,70 300,70"
                    />
                  </svg>
                  <span className="chart-legend">— District — Chain Avg</span>
                </div>
              </div>
              <div className="panel-ai-summary">
                <Sparkles size={14} />
                <p>Strong upward trend over the past 6 weeks. Performance is 6.8% above chain average. Recommend maintaining current strategies.</p>
              </div>
              <div className="panel-actions">
                <button className="panel-btn primary">
                  View Store Breakdown
                  <ChevronRight size={14} />
                </button>
                <button className="panel-btn secondary">
                  Add Annotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button 
        className="floating-chat-btn"
        onClick={() => setShowChatWindow(!showChatWindow)}
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
    </div>
  );
};

export default DistrictIntelligence;
