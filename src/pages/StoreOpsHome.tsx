import React, { useState, useEffect, useMemo } from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Users,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Zap,
  Package,
  ClipboardList,
  Store,
  Bell,
  Check,
  FileText,
  Target,
  BarChart3,
  ShoppingCart,
  Truck,
  ArrowRight,
  Info,
  Minus,
  ThumbsUp,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  SystemState,
  ActionItem,
  BroadcastMessage,
  CriticalBroadcast,
  Priority
} from '../types/storeOperations';
import './StoreOpsHome.css';

// Enhanced Insight type for headline-driven cards
interface InsightItem {
  id: string;
  type: 'risk' | 'positive' | 'watch' | 'info';
  headline: string;
  context: string;
  signal: string;
  trend?: 'up' | 'down' | 'neutral';
  actionHint?: string;
}

// Enhanced InsightItem with more actionable data
interface EnhancedInsightItem extends InsightItem {
  isHero?: boolean;
  actionCta?: string;
  impactDetail?: string;
  topStore?: string;
  overdueCount?: number;
}

// Mock data generators - headline-driven insights with hero card
const generateMockInsights = (): EnhancedInsightItem[] => [
  {
    id: '2',
    type: 'risk',
    headline: 'Inventory Risk',
    context: '12 SKUs below safety stock — immediate reorder needed',
    signal: '3 stores impacted',
    trend: 'down',
    actionHint: 'View impacted stores',
    actionCta: 'Review SKUs at Risk',
    isHero: true,
    impactDetail: 'Potential $24K revenue loss if unresolved',
    topStore: 'Store #1847 most critical',
    overdueCount: 2,
  },
  {
    id: '1',
    type: 'positive',
    headline: 'Strong Sales Performance',
    context: 'All stores exceeding targets — monitor sustainability',
    signal: '+8% vs target',
    trend: 'up',
    actionHint: 'View top performers',
    topStore: 'Store #1234 leading',
  },
  {
    id: '3',
    type: 'info',
    headline: 'Compliance On Track',
    context: 'All audits completed — no action needed',
    signal: '100% complete',
    trend: 'neutral',
  },
  {
    id: '4',
    type: 'positive',
    headline: 'Customer Satisfaction Up',
    context: 'NPS improved in North region — scale best practices',
    signal: '+12 points',
    trend: 'up',
    actionHint: 'View regional breakdown',
    topStore: 'Store #2156 top rated',
  },
];

// Enhanced Action Items with "why this matters"
interface EnhancedActionItem extends ActionItem {
  impact?: string;
}

// Enhanced action item with CTA and severity
interface ActionItemV2 extends EnhancedActionItem {
  severity: 'critical' | 'high' | 'medium' | 'low';
  cta: string;
  microContext?: string;
}

const generateMockActionItems = (): ActionItemV2[] => [
  {
    id: '2',
    title: 'Approve planogram change request',
    type: 'ASSIGNED',
    source_module: 'Planogram',
    priority_score: 98,
    due_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'overdue',
    context: 'Store #5678',
    impact: 'Blocking execution in 3 stores',
    severity: 'critical',
    cta: 'Approve Now',
    microContext: '3 stores waiting',
    deep_link: {
      target_module: 'planogram',
      context_payload: { store_id: '5678' },
    },
  },
  {
    id: '1',
    title: 'Review low stock alert',
    type: 'AI',
    source_module: 'Inventory',
    priority_score: 92,
    due_time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    context: 'Store #1234',
    impact: 'Risk affecting weekend sales',
    severity: 'high',
    cta: 'Fix Inventory',
    microContext: '5 SKUs critical',
    deep_link: {
      target_module: 'inventory',
      context_payload: { store_id: '1234' },
    },
  },
  {
    id: '3',
    title: 'Complete safety checklist',
    type: 'ASSIGNED',
    source_module: 'Compliance',
    priority_score: 82,
    due_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    context: 'District 14',
    impact: 'Required for certification',
    severity: 'medium',
    cta: 'Complete Checklist',
    deep_link: {
      target_module: 'compliance',
      context_payload: { task_id: 'safety-001' },
    },
  },
  {
    id: '4',
    title: 'Validate shipment #SH-9012',
    type: 'AI',
    source_module: 'Receiving',
    priority_score: 78,
    due_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    context: 'Store #3456',
    severity: 'medium',
    cta: 'Validate',
    microContext: '120 units',
    deep_link: {
      target_module: 'receiving',
      context_payload: { shipment_id: 'SH-9012' },
    },
  },
  {
    id: '5',
    title: 'Review VoC escalation',
    type: 'FOLLOW_UP',
    source_module: 'Customer',
    priority_score: 75,
    due_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    context: 'Store #7890',
    impact: 'Customer waiting',
    severity: 'low',
    cta: 'Review Feedback',
    microContext: '2 escalations',
    deep_link: {
      target_module: 'voc',
      context_payload: { store_id: '7890' },
    },
  },
];

// Broadcasts - excluding critical (shown in ribbon)
const generateMockBroadcasts = (): BroadcastMessage[] => [
  {
    id: '2',
    priority: 'HIGH',
    title: 'Holiday Schedule Update',
    description: 'Updated store hours for upcoming holiday weekend.',
    sender: 'District Manager',
    senderRole: 'DM',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'Operations',
    isRead: false,
    isAcknowledged: false,
    requiresAcknowledgement: false,
  },
  {
    id: '3',
    priority: 'MEDIUM',
    title: 'New Planogram Guidelines',
    description: 'Updated merchandising standards for Q2.',
    sender: 'Merchandising Team',
    senderRole: 'HQ',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'Merchandising',
    isRead: true,
    isAcknowledged: false,
    requiresAcknowledgement: false,
  },
  {
    id: '4',
    priority: 'LOW',
    title: 'Training Module Available',
    description: 'New customer service training in learning portal.',
    sender: 'HR Department',
    senderRole: 'HQ',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    category: 'HR',
    isRead: true,
    isAcknowledged: true,
    requiresAcknowledgement: false,
  },
];

// Critical broadcast data (separate) - Enhanced with impact context
const getCriticalBroadcast = (): CriticalBroadcast | null => ({
  id: '1',
  title: 'Product Recall',
  message: 'SKU #12345 must be removed immediately',
  context: 'FDA safety alert issued 2 hours ago. Customer complaints reported in Region North.',
  timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  isAcknowledged: false,
  impactCount: 3,
  impactLabel: 'stores impacted',
});

const getGreeting = (): { text: string; icon: React.ReactNode } => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: <Sun size={20} /> };
  if (hour < 17) return { text: 'Good afternoon', icon: <CloudSun size={20} /> };
  return { text: 'Good evening', icon: <Moon size={20} /> };
};

const getTaskTypeLabel = (type: string) => {
  switch (type) {
    case 'AI':
      return 'AI Suggestion';
    case 'ASSIGNED':
      return 'Mandatory';
    case 'FOLLOW_UP':
      return 'Follow-up';
    default:
      return type;
  }
};

const getTaskTypeIcon = (type: string) => {
  switch (type) {
    case 'AI':
      return <Zap size={14} />;
    case 'ASSIGNED':
      return <ClipboardList size={14} />;
    case 'FOLLOW_UP':
      return <RefreshCw size={14} />;
    default:
      return <Circle size={14} />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 size={14} />;
    case 'overdue':
      return <AlertCircle size={14} />;
    case 'in_progress':
      return <Clock size={14} />;
    default:
      return <Circle size={14} />;
  }
};

const getModuleIcon = (module: string) => {
  switch (module.toLowerCase()) {
    case 'inventory':
      return <Package size={16} />;
    case 'planogram':
      return <Target size={16} />;
    case 'compliance':
      return <Shield size={16} />;
    case 'receiving':
      return <Truck size={16} />;
    case 'customer':
    case 'voc':
      return <Users size={16} />;
    case 'merchandising':
      return <ShoppingCart size={16} />;
    case 'hr':
      return <FileText size={16} />;
    default:
      return <Store size={16} />;
  }
};

const getPriorityColor = (priority: Priority | 'HIGH' | 'MEDIUM' | 'LOW') => {
  switch (priority) {
    case 'CRITICAL':
      return 'critical';
    case 'HIGH':
      return 'high';
    case 'MEDIUM':
      return 'medium';
    case 'LOW':
      return 'low';
    default:
      return 'medium';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const formatDueTime = (timestamp: string) => {
  const diff = new Date(timestamp).getTime() - Date.now();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (diff < 0) {
    const absMinutes = Math.abs(minutes);
    const absHours = Math.abs(hours);
    if (absMinutes < 60) return `${absMinutes}m overdue`;
    return `${absHours}h overdue`;
  }
  if (minutes < 60) return `Due in ${minutes}m`;
  if (hours < 24) return `Due in ${hours}h`;
  return `Due in ${days}d`;
};

// Calendar helper functions
const getCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const days: (number | null)[] = [];
  
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  
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

export const StoreOpsHome: React.FC = () => {
  const { user } = useAuth();
  const greeting = getGreeting();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, setSystemState] = useState<SystemState>('HIGH_ACTIVITY');
  const [insights, setInsights] = useState<EnhancedInsightItem[]>([]);
  const [actionItems, setActionItems] = useState<ActionItemV2[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [criticalBroadcast, setCriticalBroadcast] = useState<CriticalBroadcast | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [broadcastsExpanded, setBroadcastsExpanded] = useState(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<BroadcastMessage | null>(null);
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('week');
  const [viewingMonth, setViewingMonth] = useState(new Date().getMonth());
  const [viewingYear, setViewingYear] = useState(new Date().getFullYear());
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  
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
  
  const handleMonthSelect = () => {
    const today = new Date();
    if (viewingYear === today.getFullYear() && viewingMonth === today.getMonth()) return;
    if (viewingYear > today.getFullYear() || (viewingYear === today.getFullYear() && viewingMonth > today.getMonth())) return;
    
    setSelectedMonth(new Date(viewingYear, viewingMonth, 1));
    setShowCalendar(false);
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

  // District Performance Index mock data - Enhanced with story elements
  const dpiData = {
    score: 87,
    tier: 'Excellence' as 'Excellence' | 'Stable' | 'AtRisk' | 'Crisis',
    rank: 3,
    totalDistricts: 24,
    change: +2.4,
    changePeriod: 'this week',
    percentile: 'Top 10%',
    narrative: 'Performing at Excellence Level',
    subNarrative: 'Consistently above benchmark',
    segments: {
      sales: 92,
      execution: 85,
      voc: 84
    },
    actionHint: 'View performance drivers'
  };

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setInsights(generateMockInsights());
      setActionItems(generateMockActionItems());
      setBroadcasts(generateMockBroadcasts());
      setCriticalBroadcast(getCriticalBroadcast());
      setSystemState('HIGH_ACTIVITY');
      setLastRefresh(new Date());
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const handleAcknowledgeCritical = () => {
    setCriticalBroadcast(null);
    setBroadcasts((prev) =>
      prev.map((b) =>
        b.priority === 'CRITICAL' ? { ...b, isAcknowledged: true, isRead: true } : b
      )
    );
  };

  const handleActionClick = (item: ActionItem) => {
    // Navigate to the target module with context
    console.log('Navigating to:', item.deep_link);
    // In real implementation, this would navigate to the appropriate module
  };

  const handleBroadcastClick = (broadcast: BroadcastMessage) => {
    // Mark as read
    setBroadcasts((prev) =>
      prev.map((b) => (b.id === broadcast.id ? { ...b, isRead: true } : b))
    );
    // Show broadcast details
    setSelectedBroadcast(broadcast);
  };

  const closeBroadcastModal = () => {
    setSelectedBroadcast(null);
  };

  // Calculate system state summary
  const overdueCount = actionItems.filter(a => a.status === 'overdue').length;
  const pendingCount = actionItems.filter(a => a.status === 'pending').length;
  const riskInsights = insights.filter(i => i.type === 'risk').length;
  const positiveInsights = insights.filter(i => i.type === 'positive').length;
  
  const getSystemSummary = () => {
    if (criticalBroadcast) return `1 critical alert needs attention`;
    if (overdueCount > 0) return `${overdueCount} overdue task${overdueCount > 1 ? 's' : ''} need attention`;
    if (riskInsights > 0) return `${riskInsights} risk${riskInsights > 1 ? 's' : ''} detected today`;
    if (pendingCount > 0) return `${pendingCount} task${pendingCount > 1 ? 's' : ''} pending today`;
    return 'Operations running smoothly';
  };
  
  // Dynamic section header
  const getInsightsSummary = () => {
    if (riskInsights > 0 && positiveInsights > 0) {
      return `${riskInsights} Risk${riskInsights > 1 ? 's' : ''} • ${positiveInsights} Opportunit${positiveInsights > 1 ? 'ies' : 'y'}`;
    }
    if (riskInsights > 0) return `${riskInsights} Risk${riskInsights > 1 ? 's' : ''} Today`;
    if (positiveInsights > 0) return `${positiveInsights} Positive Signal${positiveInsights > 1 ? 's' : ''}`;
    return 'What changed today';
  };

  const unreadBroadcastCount = broadcasts.filter((b) => !b.isRead).length;
  
  // Sort actions: overdue first, then by priority score
  const sortedActions = useMemo(() => {
    return [...actionItems].sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (b.status === 'overdue' && a.status !== 'overdue') return 1;
      return b.priority_score - a.priority_score;
    });
  }, [actionItems]);
  
  const displayedActions = sortedActions.slice(0, 5);

  if (isLoading) {
    return (
      <div className="store-ops-home">
        <div className="store-ops-loading">
          <div className="store-ops-loading-spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="store-ops-home">
      {/* ZONE 1: Welcome Header with System State */}
      <div className="store-ops-welcome-bar">
        <div className="welcome-bar-left">
          <div className="welcome-greeting">
            <span className="greeting-icon">{greeting.icon}</span>
            <h1>
              {greeting.text}, <span className="user-name">{user?.name || 'User'}</span>
            </h1>
          </div>
          <div className="welcome-meta">
            <span className="role-badge">{user?.role || 'DM'}</span>
            <span className="scope-info">
              <Store size={14} />
              {user?.store || user?.district || 'District 14'}
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
            <span className="meta-divider">•</span>
            <span className="last-refresh-inline">
              <Clock size={12} />
              {formatTimeAgo(lastRefresh.toISOString())}
            </span>
            <button
              className={`refresh-btn-inline ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
        {/* System State Awareness */}
        <div className={`system-state-summary ${criticalBroadcast ? 'critical' : overdueCount > 0 ? 'warning' : 'normal'}`}>
          <Info size={14} />
          <span>{getSystemSummary()}</span>
        </div>
      </div>

      {/* ZONE 2: Critical Alert Action Card (if exists) */}
      {criticalBroadcast && (
        <div className="critical-action-card">
          <div className="critical-card-accent"></div>
          <div className="critical-card-content">
            <div className="critical-card-header">
              <div className="critical-severity-badge">
                <AlertTriangle size={14} />
                <span>CRITICAL</span>
              </div>
              <h3 className="critical-card-title">{criticalBroadcast.title}</h3>
            </div>
            <p className="critical-card-message">{criticalBroadcast.message}</p>
            {criticalBroadcast.context && (
              <p className="critical-card-context">{criticalBroadcast.context}</p>
            )}
            {criticalBroadcast.impactCount && (
              <div className="critical-card-impact">
                <Store size={14} />
                <span>{criticalBroadcast.impactCount} {criticalBroadcast.impactLabel}</span>
              </div>
            )}
            <div className="critical-card-actions">
              <button className="critical-action-primary">
                <Store size={16} />
                <span>View Stores</span>
              </button>
              <button className="critical-action-assign">
                <Users size={16} />
                <span>Assign</span>
              </button>
              <button 
                className="critical-action-secondary"
                onClick={handleAcknowledgeCritical}
              >
                <Check size={16} />
                <span>Acknowledge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="store-ops-content-v2">
        {/* LEFT: Main Content */}
        <div className="store-ops-main">
          {/* ZONE 3: Today's Key Insights - Hero + Compact Layout */}
          <div className="store-ops-section insights-section-v3">
            <div className="section-header-v3">
              <div className="section-title-v3">
                {insights.some(i => i.type === 'risk') ? (
                  <>
                    <AlertTriangle size={18} className="header-icon-risk" />
                    <h2>1 Issue Needs Attention</h2>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="header-icon-positive" />
                    <h2>All Systems Healthy</h2>
                  </>
                )}
              </div>
              <div className="insights-meta">
                <span className="meta-positive">{insights.filter(i => i.type === 'positive').length} Positive</span>
                <span className="meta-divider">•</span>
                <span className="meta-neutral">{insights.filter(i => i.type === 'info').length} On Track</span>
              </div>
            </div>
            <div className="insights-content-v3">
              {insights.length > 0 ? (
                <>
                  {/* HERO CARD - Risk/Primary Issue */}
                  {insights.filter(i => i.isHero || i.type === 'risk').slice(0, 1).map((item) => (
                    <div key={item.id} className="insight-hero-card">
                      <div className="hero-card-accent"></div>
                      <div className="hero-card-content">
                        <div className="hero-card-header">
                          <div className="hero-signal">
                            <TrendingDown size={14} />
                            <span>{item.signal}</span>
                          </div>
                          {item.overdueCount && (
                            <div className="hero-overdue">
                              <Clock size={12} />
                              <span>{item.overdueCount} overdue actions</span>
                            </div>
                          )}
                        </div>
                        <h2 className="hero-headline">{item.headline}</h2>
                        <p className="hero-context">{item.context}</p>
                        {item.impactDetail && (
                          <div className="hero-impact">
                            <AlertCircle size={14} />
                            <span>{item.impactDetail}</span>
                          </div>
                        )}
                        {item.topStore && (
                          <div className="hero-top-store">
                            <Store size={12} />
                            <span>{item.topStore}</span>
                          </div>
                        )}
                        <div className="hero-actions">
                          <button className="hero-action-primary">
                            <Package size={16} />
                            <span>{item.actionCta || 'View Details'}</span>
                          </button>
                          <button className="hero-action-secondary">
                            <ArrowRight size={16} />
                            <span>{item.actionHint || 'View impacted stores'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* COMPACT CARDS - Supporting Insights */}
                  <div className="insights-compact-grid">
                    {insights.filter(i => !i.isHero && i.type !== 'risk').slice(0, 3).map((item) => (
                      <div key={item.id} className={`insight-compact-card type-${item.type}`}>
                        <div className={`compact-signal type-${item.type}`}>
                          {item.trend === 'up' && <TrendingUp size={11} />}
                          {item.trend === 'neutral' && <Minus size={11} />}
                          <span>{item.signal}</span>
                        </div>
                        <h4 className="compact-headline">{item.headline}</h4>
                        <p className="compact-context">{item.context}</p>
                        {item.topStore && (
                          <div className="compact-meta">
                            <Store size={10} />
                            <span>{item.topStore}</span>
                          </div>
                        )}
                        {item.actionHint && (
                          <button className="compact-action">
                            <ArrowRight size={12} />
                            <span>{item.actionHint}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="insights-empty-v2">
                  <div className="empty-icon-wrapper">
                    <ThumbsUp size={28} />
                  </div>
                  <h3>All Systems Running Smoothly</h3>
                  <p>No risks detected across your stores today</p>
                  <div className="empty-suggestions">
                    <button className="suggestion-chip">
                      <BarChart3 size={14} />
                      Review trends
                    </button>
                    <button className="suggestion-chip">
                      <Users size={14} />
                      Check feedback
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ZONE 4: Action Queue (Execution Engine) */}
          <div className="store-ops-section action-queue-v2">
            <div className="action-queue-header">
              <div className="queue-title-row">
                <Zap size={18} className="queue-icon" />
                <h2>Action Queue</h2>
              </div>
              <span className="queue-subtitle">{displayedActions.length} tasks requiring attention</span>
            </div>
            <div className="action-queue-content-v2">
              {displayedActions.length > 0 ? (
                <div className="action-cards-v2">
                  {displayedActions.map((item, index) => (
                    <div
                      key={item.id}
                      className={`action-card-v2 severity-${item.severity} ${index === 0 ? 'hero-task' : ''}`}
                    >
                      {/* Integrated Rank */}
                      <div className="action-rank-v2">
                        <span>{index + 1}</span>
                      </div>
                      
                      {/* Main Content */}
                      <div className="action-main">
                        {/* Title Row */}
                        <div className="action-title-row">
                          <h4 className="action-title-v2">{item.title}</h4>
                          {item.severity === 'critical' && (
                            <span className="severity-badge critical">BLOCKING</span>
                          )}
                        </div>
                        
                        {/* Impact - Most Prominent */}
                        {item.impact && (
                          <p className="action-impact-v2">{item.impact}</p>
                        )}
                        
                        {/* Context Row */}
                        <div className="action-meta-row">
                          <span className="action-context-v2">{item.context}</span>
                          {item.microContext && (
                            <span className="action-micro">• {item.microContext}</span>
                          )}
                          <span className={`action-time-v2 ${item.status === 'overdue' ? 'overdue' : ''}`}>
                            {item.status === 'overdue' ? '⚠️ ' : ''}
                            {formatDueTime(item.due_time)}
                          </span>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <button 
                        className={`action-cta severity-${item.severity}`}
                        onClick={() => handleActionClick(item)}
                      >
                        {item.cta}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="action-queue-empty all-clear">
                  <CheckCircle2 size={32} />
                  <h3>You're all caught up!</h3>
                  <p>No pending tasks. Here are some suggestions:</p>
                  <div className="empty-suggestions">
                    <button className="suggestion-btn">
                      <BarChart3 size={16} />
                      Review trends
                    </button>
                    <button className="suggestion-btn">
                      <Users size={16} />
                      Check VoC
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT: Sidebar */}
        <div className="store-ops-sidebar">
          {/* District Performance Story Card - Premium */}
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
                    <linearGradient id="dpiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                    stroke="url(#dpiGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(dpiData.score / 100) * 427} 427`}
                    transform="rotate(-90 80 80)"
                    className="dpi-progress-v2"
                  />
                </svg>
                <div className="dpi-score-center-v2">
                  <span className="dpi-score-value-v2">{dpiData.score}</span>
                  <span className="dpi-score-label-v2">Performance Index</span>
                </div>
              </div>
            </div>

            {/* Performance Story */}
            <div className="dpi-story-section">
              {/* Excellence Badge */}
              <div className="dpi-tier-badge-v2">
                <div className="tier-text">
                  <span className="tier-title">Excellence Tier</span>
                  <span className="tier-subtitle">Top 10% of all districts</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="dpi-stats-v2">
                <div className="dpi-stat-v2 rank">
                  <span className="stat-value-large">#{dpiData.rank}</span>
                  <span className="stat-context">of {dpiData.totalDistricts}</span>
                </div>
                <div className="dpi-stat-v2 change">
                  <div className="change-indicator positive">
                    <TrendingUp size={18} />
                    <span className="change-value">+{dpiData.change}%</span>
                  </div>
                  <span className="stat-context">{dpiData.changePeriod}</span>
                </div>
              </div>

              {/* Score Breakdown - Card Grid */}
              <div className="dpi-breakdown-header">
                <span className="breakdown-title">Score Breakdown</span>
              </div>
              <div className="dpi-breakdown-grid">
                <div className="breakdown-card">
                  <div className="breakdown-score">{dpiData.segments.sales}</div>
                  <div className="breakdown-label">Sales</div>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${dpiData.segments.sales}%` }}></div>
                  </div>
                </div>
                <div className="breakdown-card">
                  <div className="breakdown-score">{dpiData.segments.execution}</div>
                  <div className="breakdown-label">Execution</div>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${dpiData.segments.execution}%` }}></div>
                  </div>
                </div>
                <div className="breakdown-card">
                  <div className="breakdown-score">{dpiData.segments.voc}</div>
                  <div className="breakdown-label">VoC</div>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${dpiData.segments.voc}%` }}></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Broadcasts Section - Enhanced */}
          <div className="store-ops-section broadcasts-section-v2">
            <div 
              className="broadcasts-header-v2"
              onClick={() => setBroadcastsExpanded(!broadcastsExpanded)}
            >
              <div className="broadcasts-title-row">
                <Bell size={16} />
                <h2>Broadcasts</h2>
              </div>
              {unreadBroadcastCount > 0 && (
                <div className="action-required-badge">
                  <span>{unreadBroadcastCount} Action Required</span>
                </div>
              )}
              <ChevronDown size={18} className={`expand-icon ${broadcastsExpanded ? 'expanded' : ''}`} />
            </div>
            
            {broadcastsExpanded && (
              <div className="broadcasts-list-v2">
                {broadcasts.map((broadcast) => (
                  <div
                    key={broadcast.id}
                    className={`broadcast-item-v2 priority-${getPriorityColor(broadcast.priority)} ${!broadcast.isRead ? 'unread' : ''}`}
                    onClick={() => handleBroadcastClick(broadcast)}
                  >
                    <div className="broadcast-item-header">
                      <span className={`broadcast-priority-indicator priority-${getPriorityColor(broadcast.priority)}`} />
                      <span className="broadcast-item-title">{broadcast.title}</span>
                      {!broadcast.isRead && <span className="new-tag">NEW</span>}
                    </div>
                    <div className="broadcast-item-action">
                      <span className="action-text">
                        {broadcast.category === 'HR' ? 'Action: Confirm staffing' : 
                         broadcast.category === 'Merchandising' ? 'Action: Review guidelines' :
                         broadcast.category === 'Operations' ? 'Action: Complete training' : 'View details'}
                      </span>
                      <span className="broadcast-time">{formatTimeAgo(broadcast.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Detail Modal */}
      {selectedBroadcast && (
        <div className="broadcast-modal-overlay" onClick={closeBroadcastModal}>
          <div className="broadcast-modal-v2" onClick={(e) => e.stopPropagation()}>
            <button className="broadcast-modal-close-v2" onClick={closeBroadcastModal}>
              ×
            </button>
            
            <div className="broadcast-modal-badges">
              <span className={`broadcast-badge priority-${getPriorityColor(selectedBroadcast.priority)}`}>
                {selectedBroadcast.priority.toUpperCase()}
              </span>
              <span className="broadcast-badge category">
                {selectedBroadcast.category}
              </span>
            </div>
            
            <h2 className="broadcast-modal-title-v2">{selectedBroadcast.title}</h2>
            
            <p className="broadcast-modal-description">
              {selectedBroadcast.description || 'Updated store hours for upcoming holiday weekend. Please review and confirm your availability.'}
            </p>
            
            <div className="broadcast-modal-meta-v2">
              <div className="meta-item">
                <Users size={14} />
                <span>{selectedBroadcast.sender}</span>
              </div>
              <div className="meta-item">
                <Clock size={14} />
                <span>{formatTimeAgo(selectedBroadcast.timestamp)}</span>
              </div>
            </div>
            
            <div className="broadcast-modal-actions-v2">
              <button className="broadcast-btn-secondary">
                <MessageSquare size={16} />
                Chat
              </button>
              <button className="broadcast-btn-primary" onClick={closeBroadcastModal}>
                <Check size={16} />
                Mark as Read
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOpsHome;
