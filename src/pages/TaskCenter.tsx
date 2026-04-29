import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  ClipboardList,
  CheckCircle2,
  X,
  Calendar,
  User,
  Sparkles,
  ExternalLink,
  Clock,
  Store,
  AlertTriangle,
  Image,
  Shield,
  FileText,
  ChevronDown,
  Check,
  Wrench,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExecutionTasks, ExecutionTask, TaskStatus, Priority } from '../context/ExecutionTasksContext';
import './TaskCenter.css';

// ── Seed tasks so the Operations Queue isn't empty ──
const seedTasks: ExecutionTask[] = [
  {
    id: 'tc-seed-1',
    type: 'Reset Shelf',
    title: 'C&A Accessories Endcap — Compliance Reset Required',
    description: 'Multiple compliance deviations detected via AI Copilot audit. Scarves section shifted, sunglasses rotated, and belt display missing from fixture.',
    priority: 'High',
    reason: 'Compliance score 76.4% — below threshold',
    impact: 'Estimated $340/week lost sales from missing belt display alone',
    status: 'Pending',
    assignedTo: 'user-2',
    assignedToName: 'Sarah Johnson',
    dueDate: '2026-04-25',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'C&A Accessories Endcap v2.1',
    category: 'Accessories',
    createdAt: '2026-04-23T08:30:00Z',
    localizationId: 'loc-acc-01',
    source: 'AI POG Audit',
    sourceLink: '/planogram-intelligence/pog-localization-engine',
    slaHours: 24,
    severityRationale: 'Compliance score 76.4% is below 85% threshold — scarves shifted 6 inches left, sunglasses rotated 15°, belt display missing from fixture entirely.',
    confidenceScore: 94,
    beforeImage: '/audit-evidence/acc-endcap-before.jpg',
    afterImage: '/audit-evidence/acc-endcap-after.jpg',
  },
  {
    id: 'tc-seed-2',
    type: 'Add',
    title: 'Replenish OOS Items — Women\'s Wall Display',
    description: 'AI Copilot detected 4 out-of-stock positions on the Women\'s Wall Display requiring immediate replenishment.',
    priority: 'High',
    reason: '4 OOS items detected — V-Neck Tee, Floral Dress, Slim Denim, Classic Blouse',
    impact: 'Critical revenue loss on high-traffic display section',
    status: 'In Progress',
    assignedTo: 'user-3',
    assignedToName: 'Mike Chen',
    dueDate: '2026-04-23',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'Women\'s Wall Display v3.0',
    category: 'Women\'s Apparel',
    createdAt: '2026-04-23T09:00:00Z',
    localizationId: 'loc-wwd-01',
    source: 'AI POG Audit',
    sourceLink: '/planogram-intelligence/pog-localization-engine',
    slaHours: 12,
    severityRationale: '4 OOS positions detected on high-traffic Women\'s Wall — V-Neck Tee, Floral Dress, Slim Denim, Classic Blouse. Estimated $580/day revenue at risk.',
    confidenceScore: 97,
    beforeImage: '/audit-evidence/womens-wall-before.jpg',
  },
  {
    id: 'tc-seed-3',
    type: 'Update Label',
    title: 'Replace Missing Price Labels — Jewelry Section',
    description: '3 missing price labels detected in jewelry section during compliance audit. Labels need to be printed and aligned per planogram.',
    priority: 'Medium',
    reason: 'Price label compliance gap',
    impact: 'Customer confusion, potential pricing errors at checkout',
    status: 'Pending',
    assignedTo: null,
    assignedToName: undefined,
    dueDate: '2026-04-26',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'Jewelry Counter v1.5',
    category: 'Jewelry',
    createdAt: '2026-04-23T08:45:00Z',
    localizationId: 'loc-jew-01',
    source: 'AI POG Audit',
    sourceLink: '/planogram-intelligence/pog-localization-engine',
    slaHours: 48,
    severityRationale: '3 missing labels detected during compliance audit — customer confusion risk and potential checkout pricing errors.',
    confidenceScore: 91,
  },
  {
    id: 'tc-seed-4',
    type: 'Install Fixture',
    title: 'Submit Maintenance Ticket — LED Strip Shelf 2',
    description: 'LED strip lighting non-functional on shelf 2 of accessories endcap. Fixture needs replacement.',
    priority: 'Low',
    reason: 'Fixture maintenance required',
    impact: 'Reduced product visibility on shelf 2',
    status: 'Pending',
    assignedTo: 'user-5',
    assignedToName: 'Alex Rivera',
    dueDate: '2026-04-28',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'C&A Accessories Endcap v2.1',
    category: 'Accessories',
    createdAt: '2026-04-22T16:00:00Z',
    localizationId: 'loc-acc-01',
    source: 'Manual',
    slaHours: 72,
    severityRationale: 'Non-functional LED strip reduces product visibility on shelf 2 — low urgency but impacts premium display zone.',
  },
  {
    id: 'tc-seed-5',
    type: 'Move',
    title: 'Reposition Sunglasses Display to Eye-Level Center',
    description: 'Designer sunglasses currently on left side rotated 15°. Must be repositioned to center eye-level per planogram specification.',
    priority: 'High',
    reason: 'Premium visibility reduced — critical placement deviation',
    impact: '-12% conversion risk on premium category',
    status: 'Completed',
    assignedTo: 'user-2',
    assignedToName: 'Sarah Johnson',
    dueDate: '2026-04-22',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'C&A Accessories Endcap v2.1',
    category: 'Accessories',
    createdAt: '2026-04-21T14:00:00Z',
    localizationId: 'loc-acc-01',
    source: 'AI POG Audit',
    sourceLink: '/planogram-intelligence/pog-localization-engine',
    slaHours: 24,
    severityRationale: 'Premium sunglasses on left side rotated 15° from planogram spec — 12% conversion risk on high-margin category.',
    confidenceScore: 96,
    beforeImage: '/audit-evidence/sunglasses-before.jpg',
    afterImage: '/audit-evidence/sunglasses-after.jpg',
  },
  {
    id: 'tc-seed-6',
    type: 'Adjust Facing',
    title: 'Add 2 Facings to Hair Accessories Rack',
    description: 'Hair accessories showing 4 facings vs required 6 per planogram. Stock from backroom to add 2 additional facings.',
    priority: 'Medium',
    reason: 'Facing count compliance gap (-33%)',
    impact: '-8% category performance due to reduced selection visibility',
    status: 'Completed',
    assignedTo: 'user-3',
    assignedToName: 'Mike Chen',
    dueDate: '2026-04-22',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'C&A Accessories Endcap v2.1',
    category: 'Accessories',
    createdAt: '2026-04-21T14:30:00Z',
    localizationId: 'loc-acc-01',
    source: 'AI POG Audit',
    sourceLink: '/planogram-intelligence/pog-localization-engine',
    slaHours: 48,
    severityRationale: 'Hair accessories showing 4 facings vs required 6 per planogram — 33% facing gap reducing category visibility.',
    confidenceScore: 92,
    beforeImage: '/audit-evidence/hair-acc-before.jpg',
    afterImage: '/audit-evidence/hair-acc-after.jpg',
  },
  // Broadcast-linked tasks
  {
    id: 'tc-bc-001-1',
    type: 'Reset Shelf',
    title: '[RECALL] Remove Organic Baby Lotion Batch #7742 from shelf',
    description: 'Remove all units of Organic Baby Lotion Batch #7742 from sales floor shelves. Check all aisle locations and endcaps.',
    priority: 'High',
    reason: 'Product Recall — Compliance Office directive',
    impact: 'Regulatory compliance — immediate action required',
    status: 'Pending',
    assignedTo: 'user-2',
    assignedToName: 'Sarah Johnson',
    dueDate: '2026-04-24',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'Health & Beauty Aisle v1.2',
    category: 'Health & Beauty',
    createdAt: '2026-04-24T10:00:00Z',
    localizationId: 'bc-001',
    source: 'Broadcast',
    slaHours: 4,
    severityRationale: 'Product Recall — regulatory compliance requires immediate removal from all customer-accessible areas.',
  },
  {
    id: 'tc-bc-001-2',
    type: 'Move',
    title: '[RECALL] Remove Organic Baby Lotion Batch #7742 from backroom',
    description: 'Locate and quarantine all backroom inventory of Organic Baby Lotion Batch #7742. Tag for return shipment.',
    priority: 'High',
    reason: 'Product Recall — Compliance Office directive',
    impact: 'Regulatory compliance — immediate action required',
    status: 'Pending',
    assignedTo: 'user-3',
    assignedToName: 'Mike Chen',
    dueDate: '2026-04-24',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'Health & Beauty Aisle v1.2',
    category: 'Health & Beauty',
    createdAt: '2026-04-24T10:00:00Z',
    localizationId: 'bc-001',
    source: 'Broadcast',
    slaHours: 4,
    severityRationale: 'Product Recall — backroom quarantine required to prevent re-shelving of recalled inventory.',
  },
  {
    id: 'tc-bc-001-3',
    type: 'Update Label',
    title: '[RECALL] Confirm recalled item count and submit report',
    description: 'Count total units removed from shelf and backroom. Submit confirmation report to Regional HQ via compliance portal.',
    priority: 'High',
    reason: 'Product Recall — audit trail required',
    impact: 'Compliance documentation',
    status: 'Pending',
    assignedTo: null,
    assignedToName: undefined,
    dueDate: '2026-04-24',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'Health & Beauty Aisle v1.2',
    category: 'Health & Beauty',
    createdAt: '2026-04-24T10:00:00Z',
    localizationId: 'bc-001',
    source: 'Broadcast',
    slaHours: 8,
    severityRationale: 'Audit trail required for recalled product — compliance documentation must be submitted within shift.',
  },
  {
    id: 'tc-bc-002-1',
    type: 'Reset Shelf',
    title: '[PLANOGRAM] Implement Summer Collection Endcap layout',
    description: 'Set up new endcap display per visual guide v2.3. Remove winter clearance items and install summer fixtures.',
    priority: 'Medium',
    reason: 'Planogram Refresh — Visual Merchandising directive',
    impact: 'Seasonal transition — revenue impact on featured items',
    status: 'In Progress',
    assignedTo: 'user-2',
    assignedToName: 'Sarah Johnson',
    dueDate: '2026-04-25',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'Summer Collection Endcap v2.3',
    category: 'Seasonal',
    createdAt: '2026-04-23T08:00:00Z',
    localizationId: 'bc-002',
    source: 'Broadcast',
    slaHours: 48,
    severityRationale: 'Seasonal planogram refresh — revenue impact on featured endcap items during transition period.',
  },
  {
    id: 'tc-bc-003-1',
    type: 'Install Fixture',
    title: '[SAFETY] Complete fire safety checklist — Zone A & B',
    description: 'Walk through Zone A and B, verify fire extinguisher access, exit signage, and clear pathways. Submit photo evidence.',
    priority: 'High',
    reason: 'Fire Safety Audit Prep — Q2 Compliance Check',
    impact: 'Regulatory compliance — overdue',
    status: 'Completed',
    assignedTo: 'user-2',
    assignedToName: 'Sarah Johnson',
    dueDate: '2026-04-22',
    storeName: 'Downtown Plaza #2034',
    storeGroup: 'Urban Flagship Cluster',
    pogName: 'Store Safety Compliance',
    category: 'Safety',
    createdAt: '2026-04-21T09:00:00Z',
    localizationId: 'bc-003',
    source: 'Broadcast',
    slaHours: 24,
    severityRationale: 'Q2 fire safety audit preparation — overdue compliance check requires immediate walk-through and photo documentation.',
  },
];

// Map broadcast IDs to search terms for filtering
const broadcastSearchMap: Record<string, string> = {
  'bc-001': '[RECALL]',
  'bc-002': '[PLANOGRAM]',
  'bc-003': '[SAFETY]',
};

type ViewMode = 'board' | 'list';
type FilterStatus = 'all' | 'Pending' | 'In Progress' | 'Completed';

export const TaskCenter: React.FC = () => {
  const navigate = useNavigate();
  const { tasks: contextTasks, addTasks, updateTaskStatus, assignTask, teamMembers } = useExecutionTasks();
  const [tcSearchParams, setTcSearchParams] = useSearchParams();
  const [view, setView] = useState<ViewMode>('board');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ExecutionTask | null>(null);
  const [seeded, setSeeded] = useState(false);
  const [broadcastHighlight, setBroadcastHighlight] = useState<string | null>(null);

  // Custom dropdown state for Create Task modal
  const [openDropdown, setOpenDropdown] = useState<null | 'priority' | 'type' | 'assignee'>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  // Handle broadcast deep-link from OCV
  useEffect(() => {
    const bcId = tcSearchParams.get('broadcast');
    if (bcId && broadcastSearchMap[bcId]) {
      setSearch(broadcastSearchMap[bcId]);
      setBroadcastHighlight(bcId);
      setFilter('all');
      setView('list');
      setTcSearchParams({}, { replace: true });
    }
  }, [tcSearchParams, setTcSearchParams]);

  // Seed tasks once
  useEffect(() => {
    if (!seeded) {
      const existingIds = new Set(contextTasks.map(t => t.id));
      const newSeeds = seedTasks.filter(t => !existingIds.has(t.id));
      if (newSeeds.length > 0) addTasks(newSeeds);
      setSeeded(true);
    }
  }, [seeded, contextTasks, addTasks]);

  // All tasks
  const allTasks = contextTasks;

  // Filtered tasks
  const filteredTasks = allTasks
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => {
      if (!search) return true;
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.assignedToName || '').toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const counts = {
    all: allTasks.length,
    pending: allTasks.filter(t => t.status === 'Pending').length,
    inProgress: allTasks.filter(t => t.status === 'In Progress').length,
    completed: allTasks.filter(t => t.status === 'Completed').length,
  };

  const boardTasks = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (d: string | null, status: string) => {
    if (!d || status === 'Completed') return false;
    return new Date(d) < new Date();
  };

  // ── Create Task ──
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Priority,
    assignedTo: '',
    dueDate: '',
    type: 'Reset Shelf' as ExecutionTask['type'],
  });

  const handleCreate = () => {
    if (!newTask.title.trim()) return;
    const member = teamMembers.find(m => m.id === newTask.assignedTo);
    const task: ExecutionTask = {
      id: `tc-${Date.now()}`,
      type: newTask.type,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      reason: 'Manually created',
      impact: '',
      status: 'Pending',
      assignedTo: newTask.assignedTo || null,
      assignedToName: member?.name,
      dueDate: newTask.dueDate || null,
      storeName: 'Downtown Plaza #2034',
      storeGroup: 'Urban Flagship Cluster',
      pogName: '',
      category: 'General',
      createdAt: new Date().toISOString(),
      localizationId: 'manual',
    };
    addTasks([task]);
    setShowCreateModal(false);
    setNewTask({ title: '', description: '', priority: 'Medium', assignedTo: '', dueDate: '', type: 'Reset Shelf' });
  };

  // ── Source badge helper ──
  const getSourceIcon = (source?: string) => {
    if (source === 'AI POG Audit') return <Sparkles size={10} />;
    if (source === 'Localization Engine') return <Sparkles size={10} />;
    if (source === 'Broadcast') return <AlertTriangle size={10} />;
    return null;
  };

  const getSourceClass = (source?: string) => {
    if (source === 'AI POG Audit' || source === 'Localization Engine') return 'tc-source--ai';
    if (source === 'Broadcast') return 'tc-source--broadcast';
    return 'tc-source--manual';
  };

  // ── SLA helper ──
  const getSlaStatus = (task: ExecutionTask) => {
    if (!task.slaHours || !task.createdAt) return null;
    const created = new Date(task.createdAt).getTime();
    const deadline = created + task.slaHours * 60 * 60 * 1000;
    const now = Date.now();
    const remaining = deadline - now;
    if (task.status === 'Completed') return { label: 'Met', className: 'tc-sla--met' };
    if (remaining < 0) return { label: 'Breached', className: 'tc-sla--breached' };
    if (remaining < 4 * 60 * 60 * 1000) return { label: `${Math.ceil(remaining / (60 * 60 * 1000))}h left`, className: 'tc-sla--urgent' };
    return { label: `${Math.ceil(remaining / (60 * 60 * 1000))}h left`, className: 'tc-sla--ok' };
  };

  // ── Task Card ──
  const renderCard = (task: ExecutionTask) => (
    <div key={task.id} className="tc-card" onClick={() => setSelectedTask(task)}>
      <div className="tc-card-top">
        <span className="tc-card-title">{task.title}</span>
        <span className={`tc-card-priority tc-pri--${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>
      {task.description && <div className="tc-card-desc">{task.description}</div>}
      {task.source && task.source !== 'Manual' && (
        <div className={`tc-card-source ${getSourceClass(task.source)}`}>
          {getSourceIcon(task.source)}
          <span>{task.source === 'AI POG Audit' ? 'Created from AI POG Audit' : task.source === 'Localization Engine' ? 'Created from Localization Engine' : task.source}</span>
          {task.confidenceScore && <span className="tc-card-source-conf">{task.confidenceScore}%</span>}
        </div>
      )}
      <div className="tc-card-meta">
        <div className="tc-card-meta-left">
          <span className="tc-card-type">{task.type}</span>
          {task.dueDate && (
            <span className={`tc-card-due ${isOverdue(task.dueDate, task.status) ? 'tc-due--overdue' : ''}`}>
              <Calendar size={10} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
        {task.assignedToName ? (
          <span className="tc-card-assignee" title={task.assignedToName}>
            {task.assignedToName.split(' ').map(n => n[0]).join('')}
          </span>
        ) : (
          <span className="tc-card-assignee tc-unassigned">
            <User size={12} />
          </span>
        )}
      </div>
    </div>
  );

  // ── Board View ──
  const renderBoard = () => (
    <div className="tc-board">
      {(['Pending', 'In Progress', 'Completed'] as TaskStatus[]).map(status => {
        const colClass = status === 'Pending' ? 'pending' : status === 'In Progress' ? 'inprogress' : 'completed';
        const tasks = boardTasks(status);
        return (
          <div key={status} className={`tc-board-col tc-board-col--${colClass}`}>
            <div className="tc-board-col-header">
              <span>{status}</span>
              <span className="tc-board-col-count">{tasks.length}</span>
            </div>
            <div className="tc-board-col-body">
              {tasks.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>No tasks</div>
              ) : (
                tasks.map(renderCard)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── List View (UAM-style table) ──
  const renderList = () => (
    <div className="tc-table-card">
      <table className="tc-table wow-table">
        <thead>
          <tr>
            <th className="tc-th-task">Task</th>
            <th className="tc-th-status">Status</th>
            <th className="tc-th-priority">Priority</th>
            <th className="tc-th-type">Type</th>
            <th className="tc-th-assignee">Assignee</th>
            <th className="tc-th-due">Due</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan={6} className="tc-table-empty">
                <Search size={20} />
                <span>No tasks match your search or filters</span>
              </td>
            </tr>
          ) : (
            filteredTasks.map(task => (
              <tr
                key={task.id}
                className={`tc-table-row${broadcastHighlight && task.localizationId === broadcastHighlight ? ' tc-table-row--highlighted' : ''}`}
                onClick={() => setSelectedTask(task)}
              >
                <td className="tc-td-task">
                  <div className="tc-td-task-inner">
                    <span className="tc-td-task-title">{task.title}</span>
                    {task.description && (
                      <span className="tc-td-task-desc">{task.description}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={`tc-status-pill tc-status-pill--${task.status === 'Pending' ? 'pending' : task.status === 'In Progress' ? 'inprogress' : 'completed'}`}>
                    <span className="tc-status-pill-dot" />
                    <span>{task.status}</span>
                  </div>
                </td>
                <td>
                  <span className={`tc-priority-tag tc-pri--${task.priority.toLowerCase()}`}>{task.priority}</span>
                </td>
                <td>
                  <span className="tc-type-tag">{task.type}</span>
                </td>
                <td>
                  {task.assignedToName ? (
                    <div className="tc-td-assignee">
                      <span className="tc-td-avatar">{task.assignedToName.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                      <span className="tc-td-assignee-name">{task.assignedToName}</span>
                    </div>
                  ) : (
                    <span className="tc-td-unassigned">Unassigned</span>
                  )}
                </td>
                <td>
                  <span className={`tc-td-due ${isOverdue(task.dueDate, task.status) ? 'tc-due--overdue' : ''}`}>{formatDate(task.dueDate)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="tc-container">
      {/* ── Header (mirrors User Access Management — touches breadcrumbs) ── */}
      <div className="district-intel-header tc-di-header">
        <div className="header-left">
          <div className="header-title">
            <ClipboardList size={22} />
            <h1>Operations Queue</h1>
          </div>
          <div className="header-meta">
            <span className="district-badge">
              <ClipboardList size={13} />
              Task Center
            </span>
            <span className="district-badge tc-meta-pill">
              <CheckCircle2 size={13} />
              {counts.all} tasks
            </span>
            <span className="tc-meta-updated">Manage, assign &amp; track tasks across your stores</span>
          </div>
        </div>
        <div className="tc-header-right">
          <button className="tc-create-btn" onClick={() => setShowCreateModal(true)}>
            <Plus size={15} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* ── Summary Strip (Store Leaderboard mini-card style) ── */}
      <div className="tc-summary-strip">
        <div className="tc-stat-pill">
          <span className="tc-stat-pill-value">{counts.all}</span>
          <span className="tc-stat-pill-label">Total</span>
        </div>
        <div className="tc-stat-pill tc-stat-pill--neutral">
          <span className="tc-stat-pill-value">{counts.pending}</span>
          <span className="tc-stat-pill-label">To Do</span>
        </div>
        <div className="tc-stat-pill tc-stat-pill--warning">
          <span className="tc-stat-pill-value">{counts.inProgress}</span>
          <span className="tc-stat-pill-label">In Progress</span>
        </div>
        <div className="tc-stat-pill tc-stat-pill--success">
          <span className="tc-stat-pill-value">{counts.completed}</span>
          <span className="tc-stat-pill-label">Done</span>
        </div>
      </div>

      {/* ── Toolbar (Store Leaderboard style — search left, filter pills right) ── */}
      <div className="tc-toolbar tc-toolbar--leaderboard">
        <div className="tc-search-bar">
          <Search size={15} />
          <input
            placeholder="Search tasks, assignees, stores..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="tc-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="tc-toolbar-right">
          <div className="tc-filter-tabs">
            {([['all', 'All Tasks'], ['Pending', 'To Do'], ['In Progress', 'In Progress'], ['Completed', 'Done']] as [FilterStatus, string][]).map(([key, label]) => (
              <button
                key={key}
                className={`tc-filter-tab ${filter === key ? 'tc-filter-tab--active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="tc-view-toggle">
            <button className={`tc-view-btn ${view === 'board' ? 'tc-view-btn--active' : ''}`} onClick={() => setView('board')} title="Board"><LayoutGrid size={15} /></button>
            <button className={`tc-view-btn ${view === 'list' ? 'tc-view-btn--active' : ''}`} onClick={() => setView('list')} title="List"><List size={15} /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="tc-content">
        {allTasks.length === 0 ? (
          <div className="tc-empty">
            <div className="tc-empty-icon"><ClipboardList size={28} /></div>
            <h3>No Tasks Yet</h3>
            <p>Create a task or use AI Copilot to generate tasks from shelf audits.</p>
            <button className="tc-create-btn" onClick={() => setShowCreateModal(true)}>
              <Plus size={15} /> Create First Task
            </button>
          </div>
        ) : view === 'board' ? renderBoard() : renderList()}
      </div>

      {/* ── Create Task Modal (mirrors Create User look) ── */}
      {showCreateModal && (
        <div className="tc-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="tc-modal tc-modal--wow" onClick={e => e.stopPropagation()}>
            {/* Header with icon block + title + subtitle + close */}
            <div className="tc-m-header">
              <div className="tc-m-header-icon">
                <ClipboardList size={18} />
              </div>
              <div className="tc-m-header-text">
                <h3>Create New Task</h3>
                <p>Add a task and assign it to your team</p>
              </div>
              <button className="tc-m-close" onClick={() => setShowCreateModal(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="tc-m-body">
              {/* Section: Task Details */}
              <div className="tc-m-section">
                <div className="tc-m-section-label">
                  <FileText size={13} />
                  <span>Task Details</span>
                </div>
                <div className="tc-m-field" style={{ marginBottom: 14 }}>
                  <label>Title <span className="tc-m-req">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Reset shelf for Energy Drinks"
                    value={newTask.title}
                    onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="tc-m-field">
                  <label>Description</label>
                  <textarea
                    placeholder="Add context, instructions, or notes for the assignee..."
                    value={newTask.description}
                    onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Section: Classification */}
              <div className="tc-m-section">
                <div className="tc-m-section-label">
                  <Shield size={13} />
                  <span>Classification</span>
                </div>
                <div className="tc-m-fields-row">
                  {/* Priority */}
                  <div className="tc-m-field">
                    <label>Priority</label>
                    <div className="tc-dd-wrap" ref={openDropdown === 'priority' ? dropdownRef : undefined}>
                      <button
                        type="button"
                        className="tc-dd-trigger"
                        onClick={() => setOpenDropdown(openDropdown === 'priority' ? null : 'priority')}
                      >
                        <span className={`tc-dd-pri-dot tc-dd-pri-dot--${newTask.priority.toLowerCase()}`} />
                        <span className="tc-dd-trigger-text">{newTask.priority}</span>
                        <ChevronDown size={14} className={`tc-dd-chevron ${openDropdown === 'priority' ? 'tc-dd-chevron--open' : ''}`} />
                      </button>
                      {openDropdown === 'priority' && (
                        <div className="tc-dd-menu">
                          {(['High', 'Medium', 'Low'] as Priority[]).map(p => (
                            <button
                              key={p}
                              type="button"
                              className={`tc-dd-item ${p === newTask.priority ? 'tc-dd-item--active' : ''}`}
                              onClick={() => { setNewTask(prev => ({ ...prev, priority: p })); setOpenDropdown(null); }}
                            >
                              <span className="tc-dd-item-left">
                                <span className={`tc-dd-pri-dot tc-dd-pri-dot--${p.toLowerCase()}`} />
                                <span className="tc-dd-item-name">{p}</span>
                              </span>
                              {p === newTask.priority && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="tc-m-field">
                    <label>Type</label>
                    <div className="tc-dd-wrap" ref={openDropdown === 'type' ? dropdownRef : undefined}>
                      <button
                        type="button"
                        className="tc-dd-trigger"
                        onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                      >
                        <Wrench size={14} className="tc-dd-icon-muted" />
                        <span className="tc-dd-trigger-text">{newTask.type}</span>
                        <ChevronDown size={14} className={`tc-dd-chevron ${openDropdown === 'type' ? 'tc-dd-chevron--open' : ''}`} />
                      </button>
                      {openDropdown === 'type' && (
                        <div className="tc-dd-menu">
                          {(['Reset Shelf', 'Add', 'Remove', 'Move', 'Adjust Facing', 'Update Label', 'Install Fixture'] as ExecutionTask['type'][]).map(t => (
                            <button
                              key={t}
                              type="button"
                              className={`tc-dd-item ${t === newTask.type ? 'tc-dd-item--active' : ''}`}
                              onClick={() => { setNewTask(prev => ({ ...prev, type: t })); setOpenDropdown(null); }}
                            >
                              <span className="tc-dd-item-left">
                                <span className="tc-dd-item-name">
                                  {t === 'Add' ? 'Add / Replenish' : t === 'Move' ? 'Move / Reposition' : t}
                                </span>
                              </span>
                              {t === newTask.type && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Assignment & Schedule */}
              <div className="tc-m-section tc-m-section--last">
                <div className="tc-m-section-label">
                  <User size={13} />
                  <span>Assignment & Schedule</span>
                </div>
                <div className="tc-m-fields-row">
                  {/* Assignee */}
                  <div className="tc-m-field">
                    <label>Assignee</label>
                    <div className="tc-dd-wrap" ref={openDropdown === 'assignee' ? dropdownRef : undefined}>
                      <button
                        type="button"
                        className="tc-dd-trigger"
                        onClick={() => setOpenDropdown(openDropdown === 'assignee' ? null : 'assignee')}
                      >
                        {newTask.assignedTo ? (
                          <>
                            <span className="tc-dd-avatar">
                              {(teamMembers.find(m => m.id === newTask.assignedTo)?.name || '')
                                .split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                            <span className="tc-dd-trigger-text">
                              {teamMembers.find(m => m.id === newTask.assignedTo)?.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <User size={14} className="tc-dd-icon-muted" />
                            <span className="tc-dd-trigger-text tc-dd-trigger-text--placeholder">Select assignee...</span>
                          </>
                        )}
                        <ChevronDown size={14} className={`tc-dd-chevron ${openDropdown === 'assignee' ? 'tc-dd-chevron--open' : ''}`} />
                      </button>
                      {openDropdown === 'assignee' && (
                        <div className="tc-dd-menu tc-dd-menu--scroll">
                          <button
                            type="button"
                            className={`tc-dd-item ${!newTask.assignedTo ? 'tc-dd-item--active' : ''}`}
                            onClick={() => { setNewTask(prev => ({ ...prev, assignedTo: '' })); setOpenDropdown(null); }}
                          >
                            <span className="tc-dd-item-left">
                              <span className="tc-dd-avatar tc-dd-avatar--unassigned"><User size={11} /></span>
                              <span className="tc-dd-item-name">Unassigned</span>
                            </span>
                            {!newTask.assignedTo && <Check size={14} />}
                          </button>
                          {teamMembers.map(m => (
                            <button
                              key={m.id}
                              type="button"
                              className={`tc-dd-item ${m.id === newTask.assignedTo ? 'tc-dd-item--active' : ''}`}
                              onClick={() => { setNewTask(prev => ({ ...prev, assignedTo: m.id })); setOpenDropdown(null); }}
                            >
                              <span className="tc-dd-item-left">
                                <span className="tc-dd-avatar">{m.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                                <span className="tc-dd-item-text">
                                  <span className="tc-dd-item-name">{m.name}</span>
                                  <span className="tc-dd-item-desc">{m.role}</span>
                                </span>
                              </span>
                              {m.id === newTask.assignedTo && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="tc-m-field">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="tc-m-footer">
              <button className="tc-m-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="tc-m-submit" onClick={handleCreate} disabled={!newTask.title.trim()}>
                <Plus size={14} /> Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Drawer (structured & wow) ── */}
      {selectedTask && (() => {
        const sla = getSlaStatus(selectedTask);
        const statusKey = selectedTask.status === 'Pending' ? 'pending' : selectedTask.status === 'In Progress' ? 'inprogress' : 'completed';
        return (
          <div className="tc-detail-overlay" onClick={() => setSelectedTask(null)}>
            <div className="tc-detail" onClick={e => e.stopPropagation()}>
              {/* Hero header */}
              <div className="tc-detail-hero">
                <div className="tc-detail-hero-top">
                  <div className="tc-detail-hero-id">
                    <ClipboardList size={13} />
                    <span>{selectedTask.id.toUpperCase()}</span>
                  </div>
                  <button className="tc-detail-close" onClick={() => setSelectedTask(null)}><X size={16} /></button>
                </div>
                <h2 className="tc-detail-hero-title">{selectedTask.title}</h2>
                <div className="tc-detail-hero-pills">
                  <div className={`tc-status-pill tc-status-pill--${statusKey} tc-status-pill--lg`}>
                    <span className="tc-status-pill-dot" />
                    <span>{selectedTask.status}</span>
                  </div>
                  <span className={`tc-priority-tag tc-pri--${selectedTask.priority.toLowerCase()} tc-priority-tag--lg`}>
                    {selectedTask.priority} priority
                  </span>
                  <span className="tc-type-tag tc-type-tag--lg">{selectedTask.type}</span>
                  {sla && (
                    <span className={`tc-detail-sla-pill ${sla.className}`}>
                      <Clock size={11} /> {sla.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="tc-detail-body">
                {/* Description */}
                {selectedTask.description && (
                  <div className="tc-detail-block">
                    <div className="tc-detail-block-label"><FileText size={12} /> Description</div>
                    <p className="tc-detail-desc">{selectedTask.description}</p>
                  </div>
                )}

                {/* Source */}
                {selectedTask.source && selectedTask.source !== 'Manual' && (
                  <div
                    className={`tc-detail-source-badge ${getSourceClass(selectedTask.source)}`}
                    onClick={() => selectedTask.sourceLink && navigate(selectedTask.sourceLink)}
                    style={{ cursor: selectedTask.sourceLink ? 'pointer' : 'default' }}
                  >
                    <div className="tc-detail-source-left">
                      {getSourceIcon(selectedTask.source)}
                      <span>Created from <strong>{selectedTask.source}</strong></span>
                    </div>
                    <div className="tc-detail-source-right">
                      {selectedTask.confidenceScore && (
                        <span className="tc-detail-source-conf">
                          <Sparkles size={10} /> {selectedTask.confidenceScore}% confidence
                        </span>
                      )}
                      {selectedTask.sourceLink && <ExternalLink size={12} />}
                    </div>
                  </div>
                )}

                {/* Assignment & Schedule (editable controls) */}
                <div className="tc-detail-block">
                  <div className="tc-detail-block-label"><User size={12} /> Assignment & Schedule</div>
                  <div className="tc-detail-grid">
                    <div className="tc-detail-cell">
                      <span className="tc-detail-cell-label">Status</span>
                      <select
                        className="tc-detail-input-select"
                        value={selectedTask.status}
                        onChange={e => {
                          updateTaskStatus(selectedTask.id, e.target.value as TaskStatus);
                          setSelectedTask({ ...selectedTask, status: e.target.value as TaskStatus });
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="tc-detail-cell">
                      <span className="tc-detail-cell-label">Owner</span>
                      <select
                        className="tc-detail-input-select"
                        value={selectedTask.assignedTo || ''}
                        onChange={e => {
                          const member = teamMembers.find(m => m.id === e.target.value);
                          if (member) {
                            assignTask(selectedTask.id, member.id, member.name);
                            setSelectedTask({ ...selectedTask, assignedTo: member.id, assignedToName: member.name });
                          }
                        }}
                      >
                        <option value="">Unassigned</option>
                        {teamMembers.map(m => (
                          <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="tc-detail-cell">
                      <span className="tc-detail-cell-label">Due Date</span>
                      <span className={`tc-detail-cell-value ${isOverdue(selectedTask.dueDate, selectedTask.status) ? 'tc-due--overdue' : ''}`}>
                        <Calendar size={12} /> {formatDate(selectedTask.dueDate)}
                      </span>
                    </div>
                    <div className="tc-detail-cell">
                      <span className="tc-detail-cell-label">Created</span>
                      <span className="tc-detail-cell-value">
                        <Clock size={12} /> {formatDate(selectedTask.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Store & Context */}
                {(selectedTask.storeName || selectedTask.pogName) && (
                  <div className="tc-detail-block">
                    <div className="tc-detail-block-label"><Store size={12} /> Store & Context</div>
                    <div className="tc-detail-grid">
                      {selectedTask.storeName && (
                        <div className="tc-detail-cell">
                          <span className="tc-detail-cell-label">Store</span>
                          <span className="tc-detail-cell-value">{selectedTask.storeName}</span>
                        </div>
                      )}
                      {selectedTask.storeGroup && (
                        <div className="tc-detail-cell">
                          <span className="tc-detail-cell-label">Store Group</span>
                          <span className="tc-detail-cell-value">{selectedTask.storeGroup}</span>
                        </div>
                      )}
                      {selectedTask.pogName && (
                        <div className="tc-detail-cell">
                          <span className="tc-detail-cell-label">Planogram</span>
                          <span className="tc-detail-cell-value">{selectedTask.pogName}</span>
                        </div>
                      )}
                      {selectedTask.category && (
                        <div className="tc-detail-cell">
                          <span className="tc-detail-cell-label">Category</span>
                          <span className="tc-detail-cell-value">{selectedTask.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SLA breakdown (only if SLA exists) */}
                {selectedTask.slaHours && sla && (
                  <div className="tc-detail-block">
                    <div className="tc-detail-block-label"><Clock size={12} /> SLA Tracking</div>
                    <div className="tc-detail-sla-card">
                      <div className="tc-detail-sla-card-row">
                        <span className="tc-detail-sla-card-label">Target window</span>
                        <span className="tc-detail-sla-card-value">{selectedTask.slaHours} hours from creation</span>
                      </div>
                      <div className="tc-detail-sla-card-row">
                        <span className="tc-detail-sla-card-label">Status</span>
                        <span className={`tc-detail-sla-pill ${sla.className}`}>{sla.label}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Severity Rationale */}
                {selectedTask.severityRationale && (
                  <div className="tc-detail-block">
                    <div className="tc-detail-block-label"><Shield size={12} /> Severity Rationale</div>
                    <div className="tc-detail-rationale">
                      {selectedTask.severityRationale}
                    </div>
                    {selectedTask.impact && (
                      <div className="tc-detail-impact">
                        <span className="tc-detail-impact-label">Estimated impact</span>
                        <span className="tc-detail-impact-value">{selectedTask.impact}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Before / After Proof */}
                {(selectedTask.beforeImage || selectedTask.afterImage) && (
                  <div className="tc-detail-block">
                    <div className="tc-detail-block-label"><Image size={12} /> Audit Evidence</div>
                    <div className="tc-detail-proof-grid">
                      {selectedTask.beforeImage && (
                        <div className="tc-detail-proof-card">
                          <div className="tc-detail-proof-label">Before</div>
                          <div className="tc-detail-proof-placeholder">
                            <Image size={22} />
                            <span>Shelf photo captured</span>
                            <span className="tc-detail-proof-file">{selectedTask.beforeImage.split('/').pop()}</span>
                          </div>
                        </div>
                      )}
                      {selectedTask.afterImage && (
                        <div className="tc-detail-proof-card">
                          <div className="tc-detail-proof-label after">After</div>
                          <div className="tc-detail-proof-placeholder">
                            <Image size={22} />
                            <span>Expected layout</span>
                            <span className="tc-detail-proof-file">{selectedTask.afterImage.split('/').pop()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
