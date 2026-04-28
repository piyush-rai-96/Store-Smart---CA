import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Calendar,
  BarChart3,
  Clock,
  Radio,
  Eye,
  Target,
  Minus,
  MessageSquare,
  Send,
  X,
  Filter,
  Store,
  ThumbsUp,
  Bell,
  Check,
  Users,
  ShoppingCart,
  Zap,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HQHome.css';

// ─── Types ───
interface KPICard {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaType: 'positive' | 'negative' | 'neutral';
  trend: 'up' | 'down' | 'flat';
  navigateTo: string;
}

interface PriorityAction {
  id: string;
  title: string;
  impact: string;
  sla: string;
  slaOverdue: boolean;
  riskContext: string;
  severity: 'critical' | 'high' | 'medium';
}

interface DistrictRow {
  id: string;
  name: string;
  dpi: number;
  compliance: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'flat';
  dm: string;
  dmEmail: string;
}

interface BroadcastItem {
  id: string;
  title: string;
  description: string;
  type: 'critical' | 'info';
  category: string;
  sender: string;
  acknowledged: number;
  totalStores: number;
  timeSent: string;
  storesAffected: number;
  isRead: boolean;
}

// ─── Mock Data ───
const MOCK_KPIS: KPICard[] = [
  { id: 'exec-compliance', label: 'Execution Compliance', value: '87.2%', delta: '+2.4%', deltaType: 'positive', trend: 'up', navigateTo: '/store-operations/district-intelligence' },
  { id: 'critical-issues', label: 'Critical Issues', value: '14', delta: '+3', deltaType: 'negative', trend: 'up', navigateTo: '/command-center/operations-queue' },
  { id: 'broadcast-reach', label: 'Broadcast Reach', value: '94.1%', delta: '+1.8%', deltaType: 'positive', trend: 'up', navigateTo: '/command-center/communications' },
  { id: 'pog-compliance', label: 'Planogram Compliance', value: '91.6%', delta: '-0.7%', deltaType: 'negative', trend: 'down', navigateTo: '/planogram/master-pog' },
  { id: 'dpi', label: 'District Perf. Index', value: '78', delta: '+2 pts', deltaType: 'positive', trend: 'up', navigateTo: '/store-operations/district-intelligence' },
];

const MOCK_PRIORITY_ACTIONS: PriorityAction[] = [
  { id: 'pa1', title: 'Approve Planogram Reset — Women\'s Wall', impact: '12 stores affected', sla: '3h overdue', slaOverdue: true, riskContext: 'Blocking execution in 3 stores', severity: 'critical' },
  { id: 'pa2', title: 'Review Safety Audit Exceptions — District 14', impact: '4 stores flagged', sla: '6h remaining', slaOverdue: false, riskContext: 'Compliance deadline approaching', severity: 'high' },
  { id: 'pa3', title: 'Approve Inventory Rebalance — Southeast Region', impact: '8 stores affected', sla: '12h remaining', slaOverdue: false, riskContext: '$42K inventory exposure', severity: 'medium' },
];

const ACTION_MODAL_ITEMS: Record<string, { subtitle: string; selectLabel: string; ctaLabel: string; items: { id: string; code: string; name: string; supplier: string; severity: 'critical' | 'high' | 'medium'; progress: number; progressMax: number; units: string }[] }> = {
  pa1: {
    subtitle: 'SS26 Floor Reset · 3 stores waiting',
    selectLabel: 'Select stores to approve',
    ctaLabel: 'Approve',
    items: [
      { id: 's1', code: 'Store #5678', name: 'Women\'s Wall — Section A', supplier: 'District 14', severity: 'critical', progress: 3, progressMax: 15, units: 'Approve' },
      { id: 's2', code: 'Store #4321', name: 'Women\'s Wall — Section B', supplier: 'District 14', severity: 'critical', progress: 5, progressMax: 20, units: 'Approve' },
      { id: 's3', code: 'Store #8765', name: 'Women\'s Wall — End Cap', supplier: 'District 08', severity: 'high', progress: 8, progressMax: 25, units: 'Approve' },
    ],
  },
  pa2: {
    subtitle: 'District 14 · 4 stores flagged',
    selectLabel: 'Select audit exceptions to review',
    ctaLabel: 'Clear Exceptions',
    items: [
      { id: 'a1', code: 'AUD-2241', name: 'Fire exit signage missing', supplier: 'Store #5678', severity: 'critical', progress: 0, progressMax: 1, units: 'Flag' },
      { id: 'a2', code: 'AUD-2242', name: 'Expired product on shelf', supplier: 'Store #4321', severity: 'critical', progress: 0, progressMax: 1, units: 'Flag' },
      { id: 'a3', code: 'AUD-2243', name: 'Temperature log gap (4h)', supplier: 'Store #8765', severity: 'high', progress: 0, progressMax: 1, units: 'Flag' },
      { id: 'a4', code: 'AUD-2244', name: 'Cleaning schedule incomplete', supplier: 'Store #9012', severity: 'high', progress: 0, progressMax: 1, units: 'Flag' },
    ],
  },
  pa3: {
    subtitle: 'Southeast Region · $42K exposure',
    selectLabel: 'Select SKUs to rebalance',
    ctaLabel: 'Rebalance',
    items: [
      { id: 'i1', code: 'SKU-7823', name: 'Organic Milk 1L', supplier: 'DairyFresh Co.', severity: 'critical', progress: 3, progressMax: 15, units: '+50 units' },
      { id: 'i2', code: 'SKU-4521', name: 'Whole Wheat Bread', supplier: 'BakeryPlus', severity: 'critical', progress: 5, progressMax: 20, units: '+40 units' },
      { id: 'i3', code: 'SKU-9012', name: 'Free Range Eggs (12pk)', supplier: 'FarmFresh', severity: 'high', progress: 8, progressMax: 25, units: '+60 units' },
      { id: 'i4', code: 'SKU-3345', name: 'Greek Yogurt 500g', supplier: 'DairyFresh Co.', severity: 'high', progress: 12, progressMax: 30, units: '+45 units' },
      { id: 'i5', code: 'SKU-6678', name: 'Orange Juice 2L', supplier: 'CitrusBest', severity: 'critical', progress: 6, progressMax: 18, units: '+36 units' },
    ],
  },
};

const MSG_CONTACTS = [
  { id: 'c1', name: 'Sarah Johnson', role: 'Store Manager', initials: 'SJ', lastMsg: 'Got it! I\'ll review and c...', time: '3:08 PM' },
  { id: 'c2', name: 'Mike Chen', role: 'Assistant Manager', initials: 'MC', lastMsg: 'Already on it. Will send ...', time: '2:04 PM' },
  { id: 'c3', name: 'Lisa Park', role: 'Store Manager', initials: 'LP', lastMsg: '', time: '' },
  { id: 'c4', name: 'James Wilson', role: 'District Supervisor', initials: 'JW', lastMsg: '', time: '' },
  { id: 'c5', name: 'Emily Davis', role: 'Inventory Specialist', initials: 'ED', lastMsg: '', time: '' },
];

const MOCK_DISTRICTS: DistrictRow[] = [
  { id: 'd14', name: 'District 14 — Tennessee', dpi: 82, compliance: 91, riskLevel: 'low', trend: 'up', dm: 'John Doe', dmEmail: 'john.doe.dm@impactanalytics.co' },
  { id: 'd08', name: 'District 08 — Georgia', dpi: 76, compliance: 87, riskLevel: 'medium', trend: 'up', dm: 'Sarah Kim', dmEmail: 'sarah.kim@impactanalytics.co' },
  { id: 'd22', name: 'District 22 — Carolina', dpi: 71, compliance: 83, riskLevel: 'medium', trend: 'down', dm: 'Marcus Reed', dmEmail: 'marcus.reed@impactanalytics.co' },
  { id: 'd11', name: 'District 11 — Florida', dpi: 65, compliance: 78, riskLevel: 'high', trend: 'down', dm: 'Lisa Nguyen', dmEmail: 'lisa.nguyen@impactanalytics.co' },
  { id: 'd19', name: 'District 19 — Alabama', dpi: 73, compliance: 85, riskLevel: 'medium', trend: 'flat', dm: 'David Park', dmEmail: 'david.park@impactanalytics.co' },
];

const MOCK_BROADCASTS: BroadcastItem[] = [
  { id: 'b1', title: 'Holiday Season Execution Standards', description: 'All districts must complete holiday planogram execution by Dec 15. Updated guidelines attached for seasonal end-caps and promotional displays.', type: 'critical', category: 'Operations', sender: 'Regional Safety', acknowledged: 28, totalStores: 32, timeSent: '2h ago', storesAffected: 32, isRead: false },
  { id: 'b2', title: 'Q4 Compliance Reporting Deadline', description: 'Q4 compliance reports due by end of week. Please ensure all store audits are completed and submitted through the portal.', type: 'info', category: 'Compliance', sender: 'District Manager', acknowledged: 30, totalStores: 32, timeSent: '6h ago', storesAffected: 32, isRead: true },
  { id: 'b3', title: 'New Safety Protocol — Aisle Markings', description: 'Updated safety protocol for aisle markings effective immediately. All stores must comply within 48 hours. Training materials available in the portal.', type: 'critical', category: 'Safety', sender: 'Regional Safety', acknowledged: 18, totalStores: 32, timeSent: '1d ago', storesAffected: 32, isRead: false },
];

const EXECUTION_OVERVIEW = {
  totalActions: 248,
  completed: 78,
  overdue: 12,
  avgCompletionTime: '4.2h',
};

const AI_BRIEF_INSIGHTS = [
  {
    id: 'ai1',
    type: 'risk' as const,
    category: 'Compliance Risk',
    icon: 'shield' as const,
    text: 'Execution compliance dropped 6% in District 11 due to audit misses in 3 stores.',
    detail: '3 stores missed Monday audit window. Revenue impact est. $18K. DM Lisa Nguyen notified.',
    navigateTo: '/store-operations/district-intelligence',
    actionType: 'escalate' as const,
    actionLabel: 'Raise Concern',
    actionRoute: '/command-center/communications',
  },
  {
    id: 'ai2',
    type: 'positive' as const,
    category: 'Performance Win',
    icon: 'check' as const,
    text: 'District 14 achieved 100% planogram compliance for 2nd consecutive week.',
    detail: 'All 8 stores at 100% POG adherence. Camera audit scores averaging 96.2. Top performer: Store #1234.',
    navigateTo: '/store-operations/district-intelligence',
    actionType: 'kudos' as const,
    actionLabel: 'Give Kudos',
    actionRoute: '/command-center/communications',
    dm: 'John Doe',
  },
  {
    id: 'ai3',
    type: 'watch' as const,
    category: 'Communication Gap',
    icon: 'alert' as const,
    text: 'Broadcast acknowledgement rate declining — 3 districts below 85%.',
    detail: 'Districts 11, 22, 19 below threshold. Avg response time increased from 2.1h to 4.8h over 7 days.',
    navigateTo: '/command-center/communications',
    actionType: 'escalate' as const,
    actionLabel: 'Escalate',
    actionRoute: '/command-center/communications',
  },
];

const HQ_TRENDING_DISTRICTS = [
  { name: 'District 14 — Tennessee', delta: '+4%' },
  { name: 'District 08 — Georgia', delta: '+2%' },
  { name: 'District 22 — Carolina', delta: '-3%' },
];

const getInsightIcon = (icon: string) => {
  switch (icon) {
    case 'shield': return <ShieldCheck size={15} />;
    case 'check': return <CheckCircle2 size={15} />;
    case 'alert': return <AlertTriangle size={15} />;
    case 'trending': return <TrendingUp size={15} />;
    default: return <AlertCircle size={15} />;
  }
};

// ─── Helpers ───
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', icon: '☀️' };
  if (h < 17) return { text: 'Good afternoon', icon: '🌤️' };
  return { text: 'Good evening', icon: '🌙' };
};


// ─── Component ───
export const HQHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const greeting = getGreeting();

  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState<'dpi' | 'riskLevel'>('dpi');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [aiBriefExpanded, setAiBriefExpanded] = useState(true);
  const [broadcastsExpanded, setBroadcastsExpanded] = useState(true);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [broadcastToast, setBroadcastToast] = useState<string | null>(null);
  const [kudosToast, setKudosToast] = useState<string | null>(null);
  const [selectedBroadcast, setSelectedBroadcast] = useState<BroadcastItem | null>(null);
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>(MOCK_BROADCASTS);
  const [execDistrictFilter, setExecDistrictFilter] = useState<string>('all');
  const [showExecFilter, setShowExecFilter] = useState(false);
  const [workflowAction, setWorkflowAction] = useState<PriorityAction | null>(null);
  const [actionSelectedItems, setActionSelectedItems] = useState<string[]>([]);
  const [msgPanelOpen, setMsgPanelOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const sortedDistricts = [...MOCK_DISTRICTS].sort((a, b) => {
    if (sortField === 'dpi') {
      return sortDir === 'desc' ? b.dpi - a.dpi : a.dpi - b.dpi;
    }
    const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return sortDir === 'desc'
      ? riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
      : riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });

  const handleSort = (field: 'dpi' | 'riskLevel') => {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const toggleDistrict = (id: string) => {
    setSelectedDistricts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAllDistricts = () => {
    if (selectedDistricts.length === sortedDistricts.length) {
      setSelectedDistricts([]);
    } else {
      setSelectedDistricts(sortedDistricts.map(d => d.id));
    }
  };

  const handleBroadcast = () => {
    const names = MOCK_DISTRICTS.filter(d => selectedDistricts.includes(d.id)).map(d => d.dm);
    setBroadcastToast(`Broadcast sent to ${names.join(', ')}`);
    setSelectedDistricts([]);
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const handleBroadcastClick = (broadcast: BroadcastItem) => {
    setBroadcasts(prev => prev.map(b => b.id === broadcast.id ? { ...b, isRead: true } : b));
    setSelectedBroadcast(broadcast);
  };

  const closeBroadcastModal = () => setSelectedBroadcast(null);

  const handleMarkAsRead = () => {
    if (selectedBroadcast) {
      setBroadcasts(prev => prev.map(b => b.id === selectedBroadcast.id ? { ...b, isRead: true } : b));
    }
    closeBroadcastModal();
  };

  const handleGiveKudos = (dmName: string) => {
    setKudosToast(`🎉 Kudos sent to ${dmName}!`);
    setTimeout(() => setKudosToast(null), 4000);
  };

  const handleRaiseConcern = (context: string) => {
    setBroadcastToast(`Broadcast sent to District Owners: ${context}`);
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const openWorkflow = (action: PriorityAction) => {
    setWorkflowAction(action);
    setActionSelectedItems([]);
  };

  const closeWorkflow = () => {
    setWorkflowAction(null);
    setActionSelectedItems([]);
  };

  const toggleActionItem = (id: string) => {
    setActionSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAllActionItems = () => {
    if (!workflowAction) return;
    const modal = ACTION_MODAL_ITEMS[workflowAction.id];
    if (!modal) return;
    if (actionSelectedItems.length === modal.items.length) {
      setActionSelectedItems([]);
    } else {
      setActionSelectedItems(modal.items.map(i => i.id));
    }
  };

  const submitAction = () => {
    if (!workflowAction) return;
    const modal = ACTION_MODAL_ITEMS[workflowAction.id];
    setBroadcastToast(`${modal?.ctaLabel || 'Action'} completed for ${actionSelectedItems.length} items`);
    setTimeout(() => setBroadcastToast(null), 4000);
    closeWorkflow();
  };

  const unreadCount = broadcasts.filter(b => !b.isRead).length;

  const completionPct = Math.round((EXECUTION_OVERVIEW.completed / EXECUTION_OVERVIEW.totalActions) * 100);
  const overduePct = Math.round((EXECUTION_OVERVIEW.overdue / EXECUTION_OVERVIEW.totalActions) * 100);

  if (isLoading) {
    return (
      <div className="hq-home">
        <div className="hq-loading">
          <div className="hq-loading-spinner" />
          <p>Loading command center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hq-home">
      {/* ═══ 1. HEADER ═══ */}
      <div className="hq-welcome">
        <div className="hq-welcome-left">
          <div className="hq-greeting">
            <span className="hq-greeting-icon">{greeting.icon}</span>
            <h1>{greeting.text}, <span className="hq-user-name">{user?.name || 'User'}</span></h1>
          </div>
          <div className="hq-welcome-meta">
            <span className="hq-role-badge">HQ — Merchandising</span>
            <span className="hq-scope-info">
              <Eye size={13} />
              {user?.region || 'North America'} · Global View
            </span>
            <span className="hq-refresh-time">
              <Calendar size={13} />
              {lastRefresh.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {lastRefresh.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
            <button className={`hq-refresh-btn ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ 2. TOP ROW: AI Brief + Broadcasts (same as DM home) ═══ */}
      <div className="hq-top-row">
        <div className="hq-ai-brief">
          <div className="hq-ai-header" onClick={() => setAiBriefExpanded(!aiBriefExpanded)}>
            <div className="hq-ai-header-left">
              <div className={`hq-ai-toggle ${aiBriefExpanded ? '' : 'collapsed'}`}>
                <ChevronDown size={14} />
              </div>
              <div className="hq-ai-badge">
                <Sparkles size={14} />
                <span>AI Strategic Brief</span>
              </div>
            </div>
            <div className="hq-ai-meta">
              <span>Today, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="hq-ai-meta-sep">·</span>
              <span>5 data streams analysed</span>
            </div>
          </div>
          {aiBriefExpanded && (
            <div className="hq-ai-body">
              <div className="hq-ai-greeting-text">
                <h2>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name || 'Elena'}. Here's what changed across your regions overnight.</h2>
              </div>

              {/* Trending District Spotlight — matching DM VoC pattern */}
              <div className="hq-trending-spotlight">
                <div className="hq-trending-accent" />
                <div className="hq-trending-body">
                  <div className="hq-trending-header">
                    <div className="hq-trending-badge">
                      <TrendingUp size={12} />
                      <span>District Performance Trending</span>
                    </div>
                    <div className="hq-trending-severity">
                      <AlertTriangle size={12} />
                      <span>Action Needed</span>
                    </div>
                  </div>
                  <h3 className="hq-trending-title">Execution Gaps Widening in 2 Districts</h3>
                  <p className="hq-trending-desc">Compliance scores declining in <strong>District 11</strong> and <strong>District 22</strong>. Correlated with audit misses and late broadcast acknowledgements.</p>
                  <div className="hq-trending-stores">
                    {HQ_TRENDING_DISTRICTS.map((d, i) => (
                      <div key={i} className="hq-store-chip">
                        <Store size={11} />
                        <span>{d.name}</span>
                        <span className={`hq-chip-delta ${d.delta.startsWith('-') ? 'negative' : ''}`}>{d.delta}</span>
                      </div>
                    ))}
                  </div>
                  <div className="hq-trending-action">
                    <span className="hq-copilot-hint"><Sparkles size={12} /> AI Copilot has prepared an action plan</span>
                    <button className="hq-trending-cta" onClick={(e) => { e.stopPropagation(); navigate('/command-center/ai-copilot?mode=actions&context=district-gaps'); }}>
                      <span>Open in AI Copilot</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Signal Cards — matching DM home pattern */}
              <div className="hq-signal-grid">
                {AI_BRIEF_INSIGHTS.map(insight => (
                  <div key={insight.id} className={`hq-signal-card hq-signal--${insight.type}`} onClick={() => navigate(insight.navigateTo)}>
                    <div className={`hq-signal-icon hq-signal-icon--${insight.type}`}>
                      {getInsightIcon(insight.icon)}
                    </div>
                    <div className="hq-signal-content">
                      <span className={`hq-signal-label hq-signal-label--${insight.type}`}>{insight.category}</span>
                      <p className="hq-signal-text">{insight.text}</p>
                      <p className="hq-signal-detail">{insight.detail}</p>
                      <div className="hq-signal-actions">
                        {insight.actionType === 'kudos' && (
                          <button className="hq-signal-action-btn hq-signal-action--kudos" onClick={(e) => { e.stopPropagation(); handleGiveKudos(insight.dm || 'District Manager'); }}>
                            <ThumbsUp size={12} />
                            {insight.actionLabel}
                          </button>
                        )}
                        {insight.actionType === 'escalate' && (
                          <button className="hq-signal-action-btn hq-signal-action--escalate" onClick={(e) => { e.stopPropagation(); handleRaiseConcern(insight.category); }}>
                            <AlertTriangle size={12} />
                            {insight.actionLabel}
                          </button>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14} className="hq-signal-arrow" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hq-right-col">
        <div className="hq-broadcast-panel">
          <div className="hq-broadcast-header" onClick={() => setBroadcastsExpanded(!broadcastsExpanded)}>
            <div className="hq-broadcast-header-left">
              <Bell size={15} />
              <span>HQ Broadcasts</span>
              {unreadCount > 0 && <span className="hq-broadcast-count">{unreadCount}</span>}
            </div>
            <ChevronDown size={14} className={`hq-expand-icon ${broadcastsExpanded ? 'expanded' : ''}`} />
          </div>
          {broadcastsExpanded && (
            <div className="hq-broadcast-body">
              <div className="hq-broadcast-list">
                {broadcasts.map(b => (
                  <div
                    key={b.id}
                    className={`hq-bcast-item ${!b.isRead ? 'unread' : ''} ${b.type === 'critical' ? 'critical' : ''}`}
                    onClick={() => handleBroadcastClick(b)}
                  >
                    <div className="hq-bcast-content">
                      <div className="hq-bcast-title-row">
                        {b.type === 'critical' && (
                          <span className="hq-bcast-priority-badge critical">
                            <AlertTriangle size={10} />
                            CRITICAL
                          </span>
                        )}
                        {b.type === 'info' && (
                          <span className="hq-bcast-priority-badge info">
                            <Radio size={10} />
                            INFO
                          </span>
                        )}
                        <span className="hq-bcast-title">{b.title}</span>
                        {!b.isRead && <span className="hq-bcast-unread-dot" />}
                      </div>
                      <p className="hq-bcast-desc">{b.description}</p>
                      <div className="hq-bcast-meta">
                        <span className="hq-bcast-sender">{b.sender}</span>
                        <span className="hq-bcast-time">{b.timeSent}</span>
                      </div>
                      {b.type === 'critical' && (
                        <button
                          className="hq-bcast-view-stores"
                          onClick={(e) => { e.stopPropagation(); navigate('/command-center/communications'); }}
                        >
                          <Send size={13} />
                          Create Broadcast
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Execution Overview — stacked below broadcast */}
        <div className="hq-execution-card">
          <div className="hq-execution-header">
            <div className="hq-section-title">
              <Target size={16} className="hq-section-icon hq-section-icon--exec" />
              <h2>Execution Overview</h2>
            </div>
            <div className="hq-exec-filter-wrap">
              <button className="hq-exec-filter-btn" onClick={() => setShowExecFilter(!showExecFilter)}>
                <Filter size={12} />
                {execDistrictFilter === 'all' ? 'All Districts' : MOCK_DISTRICTS.find(d => d.id === execDistrictFilter)?.name || 'All Districts'}
                <ChevronDown size={11} />
              </button>
              {showExecFilter && (
                <div className="hq-exec-filter-dropdown">
                  <div className={`hq-exec-filter-option ${execDistrictFilter === 'all' ? 'active' : ''}`} onClick={() => { setExecDistrictFilter('all'); setShowExecFilter(false); }}>All Districts</div>
                  {MOCK_DISTRICTS.map(d => (
                    <div key={d.id} className={`hq-exec-filter-option ${execDistrictFilter === d.id ? 'active' : ''}`} onClick={() => { setExecDistrictFilter(d.id); setShowExecFilter(false); }}>{d.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="hq-exec-metrics">
            <div className="hq-exec-metric">
              <span className="hq-exec-metric-value">{EXECUTION_OVERVIEW.totalActions}</span>
              <span className="hq-exec-metric-label">Total Actions</span>
            </div>
            <div className="hq-exec-metric">
              <span className="hq-exec-metric-value hq-exec-metric--green">{completionPct}%</span>
              <span className="hq-exec-metric-label">Completed</span>
            </div>
            <div className="hq-exec-metric">
              <span className="hq-exec-metric-value hq-exec-metric--red">{overduePct}%</span>
              <span className="hq-exec-metric-label">Overdue</span>
            </div>
            <div className="hq-exec-metric">
              <span className="hq-exec-metric-value">{EXECUTION_OVERVIEW.avgCompletionTime}</span>
              <span className="hq-exec-metric-label">Avg Completion</span>
            </div>
          </div>
          <div className="hq-exec-bar-wrap">
            <div className="hq-exec-bar">
              <div className="hq-exec-bar-fill hq-exec-bar--completed" style={{ width: `${completionPct}%` }} />
              <div className="hq-exec-bar-fill hq-exec-bar--overdue" style={{ width: `${overduePct}%` }} />
            </div>
            <div className="hq-exec-bar-legend">
              <span className="hq-exec-legend-item"><span className="hq-legend-dot hq-legend-dot--completed" /> Completed</span>
              <span className="hq-exec-legend-item"><span className="hq-legend-dot hq-legend-dot--overdue" /> Overdue</span>
              <span className="hq-exec-legend-item"><span className="hq-legend-dot hq-legend-dot--remaining" /> Remaining</span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* ═══ 3. KPI PULSE STRIP (Snapshot 4 style — non-clickable) ═══ */}
      <div className="hq-pulse-strip">
        <div className="hq-pulse-card">
          <div className="hq-pulse-icon stores"><Store size={18} /></div>
          <div className="hq-pulse-data">
            <span className="hq-pulse-value">{MOCK_KPIS[0].value}</span>
            <span className="hq-pulse-label">Execution Compliance</span>
          </div>
          <span className="hq-pulse-badge positive">{MOCK_KPIS[0].delta}</span>
        </div>
        <div className="hq-pulse-card">
          <div className="hq-pulse-icon tasks"><Zap size={18} /></div>
          <div className="hq-pulse-data">
            <span className="hq-pulse-value">{MOCK_KPIS[1].value}</span>
            <span className="hq-pulse-label">Critical Issues</span>
          </div>
          <span className="hq-pulse-badge warning">{MOCK_KPIS[1].delta}</span>
        </div>
        <div className="hq-pulse-card">
          <div className="hq-pulse-icon compliance"><CheckCircle2 size={18} /></div>
          <div className="hq-pulse-data">
            <span className="hq-pulse-value">{MOCK_KPIS[2].value}</span>
            <span className="hq-pulse-label">Broadcast Reach</span>
          </div>
          <span className="hq-pulse-badge positive">{MOCK_KPIS[2].delta}</span>
        </div>
        <div className="hq-pulse-card">
          <div className="hq-pulse-icon nps"><Star size={18} /></div>
          <div className="hq-pulse-data">
            <span className="hq-pulse-value">{MOCK_KPIS[4].value}</span>
            <span className="hq-pulse-label">District Perf. Index</span>
          </div>
          <span className="hq-pulse-badge positive">{MOCK_KPIS[4].delta}</span>
        </div>
      </div>

      {/* ═══ 4. ACTION QUEUE (AI Brief theme) ═══ */}
      <div className="hq-combined-section">
        <div className="hq-combined-header">
          <div className="hq-section-title">
            <Zap size={16} className="hq-combined-icon" />
            <h2>Action Queue</h2>
            <span className="hq-combined-count">{MOCK_PRIORITY_ACTIONS.length}</span>
          </div>
          <span className="hq-action-queue-meta">{MOCK_PRIORITY_ACTIONS.length} tasks requiring attention</span>
        </div>

        <div className="hq-action-queue">
          <div className="hq-action-queue-list">
            {MOCK_PRIORITY_ACTIONS.slice(0, 3).map((action, idx) => (
              <div key={action.id} className="hq-aq-item">
                <div className="hq-aq-number">
                  <span>{idx + 1}</span>
                </div>
                <div className="hq-aq-content">
                  <div className="hq-aq-title">{action.title}</div>
                  <div className="hq-aq-desc">{action.riskContext}</div>
                  <div className="hq-aq-meta">
                    <span className="hq-aq-impact">{action.impact}</span>
                    <span className="hq-aq-sep">·</span>
                    <span className={`hq-aq-sla ${action.slaOverdue ? 'overdue' : ''}`}>
                      {action.slaOverdue && <AlertTriangle size={11} />}
                      {action.sla}
                    </span>
                  </div>
                </div>
                <button className={`hq-aq-cta ${action.slaOverdue ? 'hq-aq-cta--urgent' : ''}`} onClick={() => openWorkflow(action)}>
                  {action.slaOverdue ? 'Approve Now' : 'Take Action'}
                  <ChevronRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 5. DISTRICT LEADERBOARD (full width) ═══ */}
      <div className="hq-full-section">
        <div className="hq-district-card">
          <div className="hq-district-header">
            <div className="hq-section-title">
              <BarChart3 size={16} className="hq-section-icon hq-section-icon--district" />
              <h2>District Leaderboard</h2>
              <span className="hq-district-badge">{MOCK_DISTRICTS.length} Districts</span>
            </div>
          </div>

          {selectedDistricts.length > 0 && (
            <div className="hq-dt-toolbar">
              <div className="hq-dt-toolbar-left">
                <span className="hq-dt-toolbar-count">{selectedDistricts.length} selected</span>
                <button className="hq-dt-toolbar-clear" onClick={() => setSelectedDistricts([])}>
                  <X size={12} /> Clear
                </button>
              </div>
              <button className="hq-dt-broadcast-btn" onClick={handleBroadcast}>
                <Send size={13} />
                Broadcast to Selected
              </button>
            </div>
          )}

          {broadcastToast && (
            <div className="hq-dt-toast">
              <CheckCircle2 size={14} />
              <span>{broadcastToast}</span>
            </div>
          )}

          <div className="hq-district-table-wrap">
            <table className="hq-district-table wow-table">
              <thead>
                <tr>
                  <th className="hq-th-check">
                    <label className="hq-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={selectedDistricts.length === sortedDistricts.length && sortedDistricts.length > 0}
                        onChange={toggleAllDistricts}
                      />
                      <span className="hq-checkbox" />
                    </label>
                  </th>
                  <th>District</th>
                  <th className="hq-th-sortable" onClick={() => handleSort('dpi')}>
                    DPI {sortField === 'dpi' && <ChevronDown size={11} className={sortDir === 'asc' ? 'flipped' : ''} />}
                  </th>
                  <th>Compliance</th>
                  <th className="hq-th-sortable" onClick={() => handleSort('riskLevel')}>
                    Risk {sortField === 'riskLevel' && <ChevronDown size={11} className={sortDir === 'asc' ? 'flipped' : ''} />}
                  </th>
                  <th>District Manager</th>
                  <th className="hq-th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedDistricts.map(d => (
                  <tr key={d.id} className={selectedDistricts.includes(d.id) ? 'hq-row-selected' : ''}>
                    <td className="hq-td-check">
                      <label className="hq-checkbox-wrap" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedDistricts.includes(d.id)}
                          onChange={() => toggleDistrict(d.id)}
                        />
                        <span className="hq-checkbox" />
                      </label>
                    </td>
                    <td className="hq-district-name">
                      <span className="hq-district-name-link" onClick={() => navigate(`/store-operations/district-intelligence?district=${d.id}`)}>{d.name}</span>
                      <span className="hq-district-trend">
                        {d.trend === 'up' && <TrendingUp size={11} />}
                        {d.trend === 'down' && <TrendingDown size={11} />}
                        {d.trend === 'flat' && <Minus size={11} />}
                      </span>
                    </td>
                    <td>
                      <span className={`hq-dpi-value ${d.dpi >= 75 ? 'good' : d.dpi >= 65 ? 'warning' : 'poor'}`}>{d.dpi}</span>
                    </td>
                    <td>
                      <div className="hq-compliance-bar-wrap">
                        <div className="hq-compliance-bar">
                          <div className="hq-compliance-fill" style={{ width: `${d.compliance}%` }} />
                        </div>
                        <span className="hq-compliance-val">{d.compliance}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`hq-risk-level hq-risk-level--${d.riskLevel}`}>{d.riskLevel}</span>
                    </td>
                    <td>
                      <div className="hq-dm-cell">
                        <div className="hq-dm-avatar">{d.dm.split(' ').map(n => n[0]).join('')}</div>
                        <div className="hq-dm-info">
                          <span className="hq-dm-name">{d.dm}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hq-td-actions">
                      <button
                        className="hq-action-btn hq-action-btn--msg"
                        title={`Message ${d.dm}`}
                        onClick={() => { setMsgPanelOpen(true); }}
                      >
                        <MessageSquare size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══ BROADCAST DETAIL MODAL (Snapshot 5 style) ═══ */}
      {selectedBroadcast && (
        <div className="hq-modal-overlay" onClick={closeBroadcastModal}>
          <div className="hq-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="hq-modal-close" onClick={closeBroadcastModal}>
              <X size={18} />
            </button>

            <div className="hq-modal-badges">
              <span className={`hq-modal-badge hq-modal-badge--${selectedBroadcast.type === 'critical' ? 'high' : 'info'}`}>
                {selectedBroadcast.type === 'critical' ? 'HIGH' : 'INFO'}
              </span>
              <span className="hq-modal-badge hq-modal-badge--category">
                {selectedBroadcast.category.toUpperCase()}
              </span>
            </div>

            <h2 className="hq-modal-title">{selectedBroadcast.title}</h2>
            <p className="hq-modal-desc">{selectedBroadcast.description}</p>

            <div className="hq-modal-meta">
              <div className="hq-modal-meta-item">
                <Users size={14} />
                <span>{selectedBroadcast.sender}</span>
              </div>
              <div className="hq-modal-meta-item">
                <Clock size={14} />
                <span>{selectedBroadcast.timeSent}</span>
              </div>
            </div>

            <div className="hq-modal-actions">
              <button className="hq-modal-btn hq-modal-btn--secondary" onClick={() => { closeBroadcastModal(); navigate('/command-center/communications'); }}>
                <MessageSquare size={16} />
                Chat
              </button>
              <button className="hq-modal-btn hq-modal-btn--primary" onClick={handleMarkAsRead}>
                <Check size={16} />
                Mark as Read
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOASTS ═══ */}
      {broadcastToast && (
        <div className="hq-toast hq-toast--broadcast">
          <Send size={14} />
          {broadcastToast}
        </div>
      )}
      {kudosToast && (
        <div className="hq-toast hq-toast--kudos">
          <ThumbsUp size={14} />
          {kudosToast}
        </div>
      )}

      {/* ═══ ACTION MODAL (Snapshot 1/3 style) ═══ */}
      {workflowAction && ACTION_MODAL_ITEMS[workflowAction.id] && (() => {
        const modal = ACTION_MODAL_ITEMS[workflowAction.id];
        return (
          <div className="hq-modal-overlay" onClick={closeWorkflow}>
            <div className="hq-am-modal" onClick={e => e.stopPropagation()}>
              <div className="hq-am-header">
                <Zap size={20} className="hq-am-header-icon" />
                <h2 className="hq-am-title">{workflowAction.title}</h2>
                <button className="hq-modal-close" onClick={closeWorkflow}><X size={18} /></button>
              </div>
              <p className="hq-am-subtitle">{modal.subtitle} · {modal.items.length} items {workflowAction.severity === 'critical' ? 'critical' : ''}</p>

              <div className="hq-am-toolbar">
                <span className="hq-am-select-label">{modal.selectLabel}</span>
                <button className="hq-am-select-all" onClick={selectAllActionItems}>
                  {actionSelectedItems.length === modal.items.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="hq-am-list">
                {modal.items.map(item => (
                  <div
                    key={item.id}
                    className={`hq-am-item ${actionSelectedItems.includes(item.id) ? 'selected' : ''}`}
                    onClick={() => toggleActionItem(item.id)}
                  >
                    <label className="hq-checkbox-wrap" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={actionSelectedItems.includes(item.id)} onChange={() => toggleActionItem(item.id)} />
                      <span className="hq-checkbox" />
                    </label>
                    <div className="hq-am-item-info">
                      <div className="hq-am-item-row1">
                        <span className="hq-am-item-code">{item.code}</span>
                        <span className={`hq-am-sev hq-am-sev--${item.severity}`}>{item.severity.toUpperCase()}</span>
                      </div>
                      <div className="hq-am-item-name">{item.name}</div>
                      <div className="hq-am-item-supplier">Supplier: {item.supplier}</div>
                    </div>
                    <div className="hq-am-item-right">
                      <div className="hq-am-progress-wrap">
                        <div className="hq-am-progress-bar">
                          <div className="hq-am-progress-fill" style={{ width: `${(item.progress / item.progressMax) * 100}%` }} />
                        </div>
                        <span className="hq-am-progress-text">{item.progress} / {item.progressMax} min</span>
                      </div>
                      <span className="hq-am-units">{item.units}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hq-am-footer">
                <button className="hq-am-cancel" onClick={closeWorkflow}>Cancel</button>
                <button
                  className="hq-am-submit"
                  disabled={actionSelectedItems.length === 0}
                  onClick={submitAction}
                >
                  <ShoppingCart size={15} />
                  {modal.ctaLabel} {actionSelectedItems.length} {actionSelectedItems.length === 1 ? 'item' : 'items'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ MESSAGES & BROADCASTS FLYOUT (Snapshot 4 style) ═══ */}
      {msgPanelOpen && (
        <div className="hq-msgpanel">
          <div className="hq-msgpanel-header">
            <MessageSquare size={18} />
            <span>Messages & Broadcasts</span>
            <div className="hq-msgpanel-header-actions">
              <button className="hq-msgpanel-compose" onClick={() => { setMsgPanelOpen(false); navigate('/command-center/communications'); }}>
                <Send size={14} />
              </button>
              <button className="hq-msgpanel-close" onClick={() => setMsgPanelOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>
          <button className="hq-msgpanel-new" onClick={() => { setMsgPanelOpen(false); navigate('/command-center/communications'); }}>
            <Bell size={16} />
            <span>New Broadcast</span>
            <ChevronRight size={16} />
          </button>
          <div className="hq-msgpanel-list">
            {MSG_CONTACTS.map(c => (
              <div key={c.id} className="hq-msgpanel-contact" onClick={() => { setMsgPanelOpen(false); navigate('/command-center/communications'); }}>
                <div className="hq-msgpanel-avatar">{c.initials}</div>
                <div className="hq-msgpanel-contact-info">
                  <span className="hq-msgpanel-name">{c.name}</span>
                  <span className="hq-msgpanel-role">{c.role}</span>
                  {c.lastMsg && <span className="hq-msgpanel-lastmsg">{c.lastMsg}</span>}
                </div>
                {c.time && <span className="hq-msgpanel-time">{c.time}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ FLOATING MESSAGE BUTTON ═══ */}
      <button className="hq-floating-chatbot" onClick={() => setMsgPanelOpen(prev => !prev)} title="Messages & Broadcasts">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};
