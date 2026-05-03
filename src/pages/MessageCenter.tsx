import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import VideocamOutlined from '@mui/icons-material/VideocamOutlined';
import MoreVert from '@mui/icons-material/MoreVert';
import SentimentSatisfiedOutlined from '@mui/icons-material/SentimentSatisfiedOutlined';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import Check from '@mui/icons-material/Check';
import DoneAll from '@mui/icons-material/DoneAll';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import ChatOutlined from '@mui/icons-material/ChatOutlined';
import Add from '@mui/icons-material/Add';
import TagOutlined from '@mui/icons-material/TagOutlined';
import PushPinOutlined from '@mui/icons-material/PushPinOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import { Button, Chips, Badge, Tabs, EmptyState } from 'impact-ui';
import './MessageCenter.css';

// ── Types ──
type ChatType = 'direct' | 'group' | 'broadcast';
type MessageStatus = 'sent' | 'delivered' | 'read';
type Tab = 'all' | 'direct' | 'groups' | 'broadcast';
type UserRole = 'ADMIN' | 'DM' | 'SM' | 'HQ' | 'OPS' | 'LP' | 'INV' | 'POG';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  roleCode: UserRole;
  store?: string;
  online: boolean;
  lastSeen?: string;
}

interface MessageContext {
  label: string;
  route: string;
  kind: 'pog' | 'task' | 'localization' | 'audit' | 'broadcast' | 'store';
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  replyTo?: string;
  imageUrl?: string;
  context?: MessageContext;
}

interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar: string;
  participants: Contact[];
  messages: Message[];
  unread: number;
  pinned: boolean;
  lastActivity: Date;
  description?: string;
}

// ── Mock Data ──
const contacts: Contact[] = [
  { id: 'u1', name: 'Sarah Chen',     avatar: 'SC', role: 'District Manager',       roleCode: 'DM',    online: true },
  { id: 'u2', name: 'Mike Rodriguez', avatar: 'MR', role: 'Regional VP',            roleCode: 'HQ',    online: false, lastSeen: '2h ago' },
  { id: 'u3', name: 'Emily Parker',   avatar: 'EP', role: 'Store Associate',        roleCode: 'SM',    store: 'Store #2341 - Nashville', online: true },
  { id: 'u4', name: 'David Kim',      avatar: 'DK', role: 'Loss Prevention',        roleCode: 'LP',    online: false, lastSeen: '30m ago' },
  { id: 'u5', name: 'Lisa Thompson',  avatar: 'LT', role: 'Inventory Lead',         roleCode: 'INV',   store: 'Store #2341 - Nashville', online: true },
  { id: 'u6', name: 'James Wilson',   avatar: 'JW', role: 'Store Manager',          roleCode: 'SM',    store: 'Store #1142 - Memphis',   online: false, lastSeen: '1h ago' },
  { id: 'u7', name: 'Anna Martinez',  avatar: 'AM', role: 'POG Specialist',         roleCode: 'POG',   online: true },
  { id: 'u8', name: 'Robert Chang',   avatar: 'RC', role: 'Operations Director',    roleCode: 'OPS',   online: true },
  { id: 'u9', name: 'Clarke T',       avatar: 'CT', role: 'Platform Administrator', roleCode: 'ADMIN', online: true },
];

const ROLE_BADGE: Record<UserRole, { label: string; cls: string }> = {
  ADMIN: { label: 'Admin', cls: 'mc-role--admin' },
  DM:    { label: 'DM',    cls: 'mc-role--dm' },
  SM:    { label: 'SM',    cls: 'mc-role--sm' },
  HQ:    { label: 'HQ',    cls: 'mc-role--hq' },
  OPS:   { label: 'Ops',   cls: 'mc-role--ops' },
  LP:    { label: 'LP',    cls: 'mc-role--lp' },
  INV:   { label: 'Inv',   cls: 'mc-role--inv' },
  POG:   { label: 'POG',   cls: 'mc-role--pog' },
};

const roleBadgeColor = (role: UserRole): 'error' | 'warning' | 'info' | 'success' => {
  switch (role) {
    case 'ADMIN': case 'HQ':   return 'error';
    case 'DM':    case 'OPS':  return 'warning';
    case 'SM':    case 'INV':  return 'success';
    default:                   return 'info';
  }
};

const R = {
  district: '/store-operations/district-intelligence',
  storeDD:  '/store-operations/store-deep-dive',
  pog:      '/planogram/master-pog',
  pogRule:  '/planogram/rule-management',
  loc:      '/planogram/localization-engine',
  copilot:  '/command-center/ai-copilot',
  ops:      '/command-center/operations-queue',
};

const mockChats: Chat[] = [
  {
    id: 'c1', type: 'direct', name: 'Sarah Chen', avatar: 'SC',
    participants: [contacts[0]], unread: 2, pinned: true,
    lastActivity: new Date(Date.now() - 5 * 60000),
    messages: [
      { id: 'm1', senderId: 'u1', content: 'Heads up — AI Copilot flagged 3 POG drift issues for Energy Drinks at Store #2341 this morning.', timestamp: new Date(Date.now() - 45 * 60000), status: 'read' },
      { id: 'm2', senderId: 'me', content: 'Saw it. I\'ve already pushed a Reset Shelf task to the Operations Queue.', timestamp: new Date(Date.now() - 40 * 60000), status: 'read', context: { label: 'Open Operations Queue', route: R.ops, kind: 'task' } },
      { id: 'm3', senderId: 'u1', content: 'Perfect. Loop in Anna if anything escalates — she owns the POG approvals this week.', timestamp: new Date(Date.now() - 30 * 60000), status: 'read' },
      { id: 'm5', senderId: 'u1', content: 'Also: District 14 compliance is back to 94%. Nashville drove most of the lift 📈', timestamp: new Date(Date.now() - 10 * 60000), status: 'delivered', context: { label: 'View District Intelligence', route: R.district, kind: 'audit' } },
      { id: 'm6', senderId: 'u1', content: 'Can you review the Energy Drinks POG audit before EOD?', timestamp: new Date(Date.now() - 5 * 60000), status: 'delivered', context: { label: 'Open AI Copilot audit', route: R.copilot, kind: 'audit' } },
    ],
  },
  {
    id: 'c2', type: 'group', name: 'Store #2341 — Nashville', avatar: 'S2',
    description: 'Day-to-day ops for Store #2341 (Nashville)',
    participants: [contacts[0], contacts[2], contacts[4]], unread: 5, pinned: true,
    lastActivity: new Date(Date.now() - 12 * 60000),
    messages: [
      { id: 'm10', senderId: 'u3', content: 'Morning shift check-in: all sections covered ✅', timestamp: new Date(Date.now() - 120 * 60000), status: 'read' },
      { id: 'm11', senderId: 'u5', content: 'Inventory count for Dairy done. Need to reorder milk — down to 15 units.', timestamp: new Date(Date.now() - 90 * 60000), status: 'read' },
      { id: 'm12', senderId: 'me', content: 'Submitting the PO now. Logged it as a task too.', timestamp: new Date(Date.now() - 85 * 60000), status: 'read', context: { label: 'View task in Operations Queue', route: R.ops, kind: 'task' } },
      { id: 'm13', senderId: 'u3', content: 'POG drift on Aisle 7 endcap — facing count is off by 2. Re-shooting now.', timestamp: new Date(Date.now() - 30 * 60000), status: 'read', context: { label: 'Open POG Audit', route: R.copilot, kind: 'audit' } },
      { id: 'm14', senderId: 'u5', content: '@everyone Stockroom audit at 4 PM. Everyone needs to confirm by 3:30.', timestamp: new Date(Date.now() - 12 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c3', type: 'broadcast', name: 'Regional Updates', avatar: 'RU',
    description: 'Official announcements from Regional HQ',
    participants: contacts, unread: 1, pinned: false,
    lastActivity: new Date(Date.now() - 60 * 60000),
    messages: [
      { id: 'm20', senderId: 'u2', content: 'Q2 Planogram Refresh — all stores must complete the Spring Reset by May 20.', timestamp: new Date(Date.now() - 180 * 60000), status: 'read', context: { label: 'Open Master POG Management', route: R.pog, kind: 'pog' } },
      { id: 'm21', senderId: 'u2', content: '🏆 Congrats to Store #2341, #1142, and #3021 for hitting 95%+ compliance this quarter.', timestamp: new Date(Date.now() - 60 * 60000), status: 'delivered', context: { label: 'View leaderboard', route: R.district, kind: 'audit' } },
    ],
  },
  {
    id: 'c4', type: 'direct', name: 'David Kim', avatar: 'DK',
    participants: [contacts[3]], unread: 0, pinned: false,
    lastActivity: new Date(Date.now() - 180 * 60000),
    messages: [
      { id: 'm30', senderId: 'u4', content: 'Weekly LP walkthrough done for Store #2341. Report uploaded.', timestamp: new Date(Date.now() - 240 * 60000), status: 'read' },
      { id: 'm31', senderId: 'me', content: 'Thanks David. Anything I should escalate?', timestamp: new Date(Date.now() - 200 * 60000), status: 'read' },
      { id: 'm32', senderId: 'u4', content: 'Camera 3 near the back exit needs adjustment. I logged a Fixture task.', timestamp: new Date(Date.now() - 180 * 60000), status: 'read', context: { label: 'View task in Operations Queue', route: R.ops, kind: 'task' } },
    ],
  },
  {
    id: 'c5', type: 'group', name: 'District 14 — Managers', avatar: 'D1',
    description: 'DM sync for District 14 (Tennessee)',
    participants: [contacts[0], contacts[5], contacts[7]], unread: 0, pinned: false,
    lastActivity: new Date(Date.now() - 300 * 60000),
    messages: [
      { id: 'm40', senderId: 'u1', content: 'Team — spring staffing schedule is up. Pls review by tomorrow.', timestamp: new Date(Date.now() - 360 * 60000), status: 'read' },
      { id: 'm41', senderId: 'u8', content: 'Reviewed. We need +20% coverage for Black Friday — mostly at #2341 and #1142.', timestamp: new Date(Date.now() - 320 * 60000), status: 'read', context: { label: 'View District Intelligence', route: R.district, kind: 'audit' } },
      { id: 'm42', senderId: 'u6', content: 'Memphis is good. We can absorb +15% without new hires — OT only.', timestamp: new Date(Date.now() - 300 * 60000), status: 'read' },
    ],
  },
  {
    id: 'c6', type: 'broadcast', name: 'Safety Alerts', avatar: 'SA',
    description: 'Critical safety and compliance alerts',
    participants: contacts, unread: 1, pinned: false,
    lastActivity: new Date(Date.now() - 30 * 60000),
    messages: [
      { id: 'm50', senderId: 'u8', content: '🔴 New fire safety protocol effective immediately. All fire exits must be inspected by EOW.', timestamp: new Date(Date.now() - 480 * 60000), status: 'read', context: { label: 'Open Operations Queue', route: R.ops, kind: 'task' } },
      { id: 'm51', senderId: 'u8', content: 'Mandatory safety training modules have been updated. All SMs must complete by EOM.', timestamp: new Date(Date.now() - 30 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c-pog', type: 'group', name: 'POG Compliance — District 14', avatar: 'PC',
    description: 'AI Copilot audits, drift triage and POG approvals',
    participants: [contacts[0], contacts[6], contacts[1], contacts[7]], unread: 3, pinned: false,
    lastActivity: new Date(Date.now() - 22 * 60000),
    messages: [
      { id: 'mp1', senderId: 'u7', content: 'Pushed the Spring Refresh Beverage template to Localization Engine for Tennessee stores.', timestamp: new Date(Date.now() - 240 * 60000), status: 'read', context: { label: 'Open Localization Engine', route: R.loc, kind: 'localization' } },
      { id: 'mp2', senderId: 'u1', content: 'Nashville is approved. Memphis still has 2 SKUs failing the SLA rule — reviewing.', timestamp: new Date(Date.now() - 180 * 60000), status: 'read', context: { label: 'Open POG Rules', route: R.pogRule, kind: 'pog' } },
      { id: 'mp3', senderId: 'u7', content: 'Copilot just opened 4 new audits across Beverages — confidence 88–94%.', timestamp: new Date(Date.now() - 60 * 60000), status: 'delivered', context: { label: 'Triage in AI Copilot', route: R.copilot, kind: 'audit' } },
      { id: 'mp4', senderId: 'u1', content: 'Pinning this thread. Anna will own approvals through Friday.', timestamp: new Date(Date.now() - 22 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c-loc', type: 'group', name: 'Localization Reviewers', avatar: 'LR',
    description: 'Final sign-off on localized POGs before publish',
    participants: [contacts[6], contacts[1], contacts[8]], unread: 1, pinned: false,
    lastActivity: new Date(Date.now() - 45 * 60000),
    messages: [
      { id: 'ml1', senderId: 'u7', content: 'Beverages — Tennessee variant is ready for review. 12 stores included.', timestamp: new Date(Date.now() - 90 * 60000), status: 'read', context: { label: 'Open in Localization Engine', route: R.loc, kind: 'localization' } },
      { id: 'ml2', senderId: 'u2', content: 'LGTM on assortment. One question on facing rules for #3021.', timestamp: new Date(Date.now() - 45 * 60000), status: 'delivered', context: { label: 'View POG Rules', route: R.pogRule, kind: 'pog' } },
    ],
  },
  {
    id: 'c8', type: 'broadcast', name: 'Operations — Spring Schedule', avatar: 'SS',
    description: 'Spring operations & scheduling updates',
    participants: contacts, unread: 1, pinned: true,
    lastActivity: new Date(Date.now() - 30 * 60000),
    messages: [
      { id: 'm70', senderId: 'u2', content: 'All stores will operate on modified hours during Dec 23–26. Confirm your team\'s availability by Friday.', timestamp: new Date(Date.now() - 30 * 60000), status: 'delivered', context: { label: 'View tasks in Operations Queue', route: R.ops, kind: 'task' } },
    ],
  },
  {
    id: 'c9', type: 'broadcast', name: 'Performance Highlights', avatar: 'PH',
    description: 'Quarterly performance updates and recognition',
    participants: contacts, unread: 1, pinned: false,
    lastActivity: new Date(Date.now() - 120 * 60000),
    messages: [
      { id: 'm80', senderId: 'u2', content: '🏆 Great start to Q2! District 14 hit 104% of April plan. Top performers will be recognized at the regional sync.', timestamp: new Date(Date.now() - 120 * 60000), status: 'delivered', context: { label: 'View leaderboard', route: R.district, kind: 'audit' } },
    ],
  },
  {
    id: 'c7', type: 'direct', name: 'Anna Martinez', avatar: 'AM',
    participants: [contacts[6]], unread: 0, pinned: false,
    lastActivity: new Date(Date.now() - 600 * 60000),
    messages: [
      { id: 'm60', senderId: 'u7', content: 'Aisle 5 planogram audit ready for sign-off — 91% match.', timestamp: new Date(Date.now() - 720 * 60000), status: 'read', context: { label: 'Open AI Copilot audit', route: R.copilot, kind: 'audit' } },
      { id: 'm61', senderId: 'me', content: 'Looks great Anna — approving now.', timestamp: new Date(Date.now() - 600 * 60000), status: 'read' },
    ],
  },
];

// ── Helpers ──
const formatTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatFullTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** 6-stop distinct pastel palette — vivid enough to distinguish, soft enough for enterprise */
const getAvatarGradient = (initials: string) => {
  const palette = [
    { bg: '#e8eeff', ink: '#3730a3' },   // indigo
    { bg: '#dcfce7', ink: '#15803d' },   // emerald
    { bg: '#fef9c3', ink: '#a16207' },   // amber
    { bg: '#fee2e2', ink: '#b91c1c' },   // rose
    { bg: '#ede9fe', ink: '#6d28d9' },   // violet
    { bg: '#e0f2fe', ink: '#0369a1' },   // sky
  ];
  const code = initials.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return palette[code % palette.length];
};

const getContextIcon = (kind: MessageContext['kind']) => {
  switch (kind) {
    case 'pog':          return <LayersOutlined sx={{ fontSize: 11 }} />;
    case 'task':         return <AssignmentOutlined sx={{ fontSize: 11 }} />;
    case 'localization': return <PlaceOutlined sx={{ fontSize: 11 }} />;
    case 'audit':        return <AutoAwesomeOutlined sx={{ fontSize: 11 }} />;
    case 'broadcast':    return <CampaignOutlined sx={{ fontSize: 11 }} />;
    case 'store':        return <TagOutlined sx={{ fontSize: 11 }} />;
    default:             return <OpenInNewOutlined sx={{ fontSize: 11 }} />;
  }
};

// ── Component ──
export const MessageCenter: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading]           = useState(true);
  const [chats, setChats]                   = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat]         = useState<string | null>('c1');
  const [inputValue, setInputValue]         = useState('');
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeTab, setActiveTab]           = useState<Tab>('all');
  const [showNewChat, setShowNewChat]       = useState(false);
  const [modalStep, setModalStep]           = useState<'main' | 'group' | 'broadcast'>('main');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newChatName, setNewChatName]       = useState('');
  const [contactSearch, setContactSearch]   = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const chatEndRef  = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);

  const selectedChat = chats.find(c => c.id === activeChat);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages.length]);

  useEffect(() => {
    if (activeChat) inputRef.current?.focus();
  }, [activeChat]);

  const filteredChats = chats
    .filter(c => {
      if (activeTab === 'direct')    return c.type === 'direct';
      if (activeTab === 'groups')    return c.type === 'group';
      if (activeTab === 'broadcast') return c.type === 'broadcast';
      return true;
    })
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastActivity.getTime() - a.lastActivity.getTime();
    });

  const handleSend = () => {
    if (!inputValue.trim() || !activeChat) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`, senderId: 'me',
      content: inputValue.trim(), timestamp: new Date(), status: 'sent',
    };
    setChats(prev => prev.map(c =>
      c.id === activeChat ? { ...c, messages: [...c.messages, newMsg], lastActivity: new Date() } : c
    ));
    setInputValue('');
    setTimeout(() => {
      setChats(prev => prev.map(c =>
        c.id === activeChat
          ? { ...c, messages: c.messages.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' as MessageStatus } : m) }
          : c
      ));
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const closeModal = () => {
    setShowNewChat(false); setModalStep('main');
    setSelectedMembers([]); setNewChatName(''); setContactSearch(''); setBroadcastMessage('');
  };

  const toggleMember = (id: string) =>
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const createGroupChat = () => {
    if (!selectedMembers.length) return;
    const members = contacts.filter(c => selectedMembers.includes(c.id));
    const name = newChatName.trim() || members.map(m => m.name.split(' ')[0]).join(', ');
    const newChat: Chat = {
      id: `c-${Date.now()}`, type: 'group', name, avatar: '👥',
      description: `Group with ${members.length} members`,
      participants: members, messages: [], unread: 0, pinned: false, lastActivity: new Date(),
    };
    setChats(prev => [newChat, ...prev]); setActiveChat(newChat.id); closeModal();
  };

  const createBroadcast = () => {
    if (!selectedMembers.length) return;
    const members = contacts.filter(c => selectedMembers.includes(c.id));
    const name = newChatName.trim() || `Broadcast (${members.map(m => m.name.split(' ')[0]).join(', ')})`;
    const initialMessages: Message[] = broadcastMessage.trim() ? [{
      id: `msg-${Date.now()}`,
      senderId: 'me',
      content: broadcastMessage.trim(),
      timestamp: new Date(),
      status: 'sent' as MessageStatus,
    }] : [];
    const newChat: Chat = {
      id: `c-${Date.now()}`, type: 'broadcast', name, avatar: '📢',
      description: `Broadcast to ${members.length} recipients`,
      participants: members, messages: initialMessages, unread: 0, pinned: false, lastActivity: new Date(),
    };
    setChats(prev => [newChat, ...prev]); setActiveChat(newChat.id); setActiveTab('broadcast'); closeModal();
  };

  const startDirectMessage = (contact: Contact) => {
    const existing = chats.find(c => c.type === 'direct' && c.participants[0]?.id === contact.id);
    if (existing) { setActiveChat(existing.id); closeModal(); return; }
    const newChat: Chat = {
      id: `c-${Date.now()}`, type: 'direct', name: contact.name, avatar: contact.avatar,
      participants: [contact], messages: [], unread: 0, pinned: false, lastActivity: new Date(),
    };
    setChats(prev => [newChat, ...prev]); setActiveChat(newChat.id); closeModal();
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sent':      return <Check sx={{ fontSize: 14 }} />;
      case 'delivered': return <DoneAll sx={{ fontSize: 14 }} />;
      case 'read':      return <DoneAll sx={{ fontSize: 14 }} className="mc-status-read" />;
    }
  };

  const renderDateSeparator = (date: Date) => {
    const today     = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    let label = date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    if (date.toDateString() === today.toDateString())     label = 'Today';
    if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    return <div className="mc-date-sep"><span>{label}</span></div>;
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    messages.forEach(msg => {
      const dateStr = msg.timestamp.toDateString();
      const g = groups.find(g => g.date === dateStr);
      if (g) g.messages.push(msg);
      else groups.push({ date: dateStr, messages: [msg] });
    });
    return groups;
  };

  if (isLoading) {
    return (
      <div className="mc-container mc-container--loading">
        <div className="page-loading">
          <div className="page-loading-spinner" />
          <p>Loading Communications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mc-container">

      {/* ── Left Sidebar ── */}
      <div className="mc-sidebar">

        {/* Header */}
        <div className="mc-sidebar-header">
          <div className="mc-sidebar-title">
            <ForumOutlined sx={{ fontSize: 20 }} />
            <h2>Communications</h2>
          </div>
          <Button
            variant="contained" color="primary" size="small"
            className="mc-new-chat-btn"
            onClick={() => setShowNewChat(true)}
            aria-label="New conversation"
          >
            <Add sx={{ fontSize: 18 }} />
          </Button>
        </div>

        {/* Search */}
        <div className="mc-search">
          <SearchOutlined sx={{ fontSize: 15 }} />
          <input
            type="text" placeholder="Search conversations..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="mc-search-clear-btn" onClick={() => setSearchQuery('')} aria-label="Clear">
              <CloseOutlined sx={{ fontSize: 13 }} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs
          tabNames={[
            { value: 'all',       label: 'All' },
            { value: 'direct',    label: 'Direct',    icon: <ChatOutlined sx={{ fontSize: 12 }} /> },
            { value: 'groups',    label: 'Groups',    icon: <GroupOutlined sx={{ fontSize: 12 }} /> },
            { value: 'broadcast', label: 'Broadcast', icon: <CampaignOutlined sx={{ fontSize: 12 }} /> },
          ]}
          tabPanels={[]} value={activeTab}
          onChange={(_, val) => setActiveTab(val as Tab)}
        />

        {/* Chat List */}
        <div className="mc-chat-list">
          {filteredChats.length === 0 && (
            <div className="mc-chat-list-empty">
              <SearchOutlined sx={{ fontSize: 22 }} />
              <span>No conversations found</span>
            </div>
          )}
          {filteredChats.map(chat => {
            const av = getAvatarGradient(chat.avatar);
            const hasUnread = chat.unread > 0;
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isOnline = chat.type === 'direct' && chat.participants[0]?.online;
            return (
              <button
                key={chat.id}
                className={`mc-chat-item ${activeChat === chat.id ? 'mc-chat-item--active' : ''} ${hasUnread ? 'mc-chat-item--unread' : ''}`}
                onClick={() => { setActiveChat(chat.id); setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c)); }}
              >
                {/* Avatar */}
                <div
                  className="mc-chat-item-avatar"
                  style={{ background: av.bg, borderRadius: chat.type === 'broadcast' ? '50%' : undefined }}
                >
                  <span style={{ color: av.ink }}>{chat.avatar}</span>
                  {isOnline && <span className="mc-chat-item-online-dot" />}
                </div>

                {/* Info */}
                <div className="mc-chat-item-body">
                  <div className="mc-chat-item-row">
                    <span className="mc-chat-name">{chat.name}</span>
                    <div className="mc-chat-meta">
                      {chat.pinned && <PushPinOutlined sx={{ fontSize: 10 }} className="mc-pin-icon" />}
                      {hasUnread
                        ? <span className="mc-unread-badge-wrap"><Badge label={String(chat.unread)} color="error" size="small" /></span>
                        : null
                      }
                      <span className="mc-chat-time">{formatTime(chat.lastActivity)}</span>
                    </div>
                  </div>
                  {lastMsg && (
                    <p className="mc-chat-preview">
                      {lastMsg.senderId === 'me' ? 'You: ' : ''}
                      {lastMsg.content.slice(0, 55)}{lastMsg.content.length > 55 ? '…' : ''}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Panel ── */}
      <div className="mc-main">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="mc-chat-header">
              <div className="mc-chat-header-left">
                <div className="mc-chat-header-avatar" style={{ background: getAvatarGradient(selectedChat.avatar).bg }}>
                  <span className="mc-chat-avatar-text" style={{ color: getAvatarGradient(selectedChat.avatar).ink }}>
                    {selectedChat.avatar}
                  </span>
                </div>
                <div className="mc-chat-header-info">
                  <h3>{selectedChat.name}</h3>
                  <span className="mc-chat-header-sub">
                    {selectedChat.type === 'direct'
                      ? (selectedChat.participants[0]?.online
                          ? <><span className="mc-online-indicator" />Online</>
                          : `Last seen ${selectedChat.participants[0]?.lastSeen || 'recently'}`)
                      : selectedChat.type === 'broadcast'
                      ? <><span className="mc-broadcast-pill"><CampaignOutlined sx={{ fontSize: 10 }} />Broadcast</span><span>{selectedChat.participants.length} recipients</span></>
                      : `${selectedChat.participants.length} members`
                    }
                  </span>
                </div>
              </div>
              <div className="mc-chat-header-actions">
                {selectedChat.type === 'direct' && (
                  <>
                    <Button variant="outlined" size="small" className="mc-header-action" aria-label="Call"><PhoneOutlined sx={{ fontSize: 18 }} /></Button>
                    <Button variant="outlined" size="small" className="mc-header-action" aria-label="Video"><VideocamOutlined sx={{ fontSize: 18 }} /></Button>
                  </>
                )}
                <Button variant="outlined" size="small" className="mc-header-action" aria-label="Search"><SearchOutlined sx={{ fontSize: 18 }} /></Button>
                <Button variant="outlined" size="small" className="mc-header-action" aria-label="More"><MoreVert sx={{ fontSize: 18 }} /></Button>
              </div>
            </div>

            {/* Messages */}
            <div className="mc-messages">
              {selectedChat.description && (
                <div className="mc-chat-description">
                  <TagOutlined sx={{ fontSize: 14 }} />
                  <span>{selectedChat.description}</span>
                </div>
              )}
              {groupMessagesByDate(selectedChat.messages).map(group => (
                <React.Fragment key={group.date}>
                  {renderDateSeparator(new Date(group.date))}
                  {group.messages.map((msg, idx) => {
                    const isMe     = msg.senderId === 'me';
                    const sender   = contacts.find(c => c.id === msg.senderId);
                    const showAv   = !isMe && selectedChat.type !== 'direct' && (idx === 0 || group.messages[idx - 1].senderId !== msg.senderId);
                    const isConsec = idx > 0 && group.messages[idx - 1].senderId === msg.senderId;
                    const sav      = sender ? getAvatarGradient(sender.avatar) : { bg: '', ink: '' };

                    return (
                      <div key={msg.id} className={`mc-msg ${isMe ? 'mc-msg--me' : 'mc-msg--them'} ${isConsec ? 'mc-msg--consecutive' : ''}`}>
                        {!isMe && selectedChat.type !== 'direct' && (
                          <div className="mc-msg-avatar-space">
                            {showAv && (
                              <div className="mc-msg-avatar" style={{ background: sav.bg, color: sav.ink }}>
                                {sender?.avatar || '??'}
                              </div>
                            )}
                          </div>
                        )}
                        <div className={`mc-msg-bubble ${isMe ? 'mc-msg-bubble--me' : 'mc-msg-bubble--them'}`}>
                          {!isMe && selectedChat.type !== 'direct' && showAv && (
                            <span className="mc-msg-sender-name">
                              <span>{sender?.name}</span>
                              {sender && (
                                <Badge
                                  className="mc-role-pill"
                                  label={ROLE_BADGE[sender.roleCode].label}
                                  size="small"
                                  color={roleBadgeColor(sender.roleCode)}
                                />
                              )}
                            </span>
                          )}
                          <p className="mc-msg-text">{msg.content}</p>
                          {msg.context && (
                            <button
                              type="button"
                              className={`mc-msg-context mc-msg-context--${msg.context.kind} ${isMe ? 'mc-msg-context--me' : ''}`}
                              onClick={() => navigate(msg.context!.route)}
                            >
                              <span className="mc-msg-context-icon">{getContextIcon(msg.context.kind)}</span>
                              <span className="mc-msg-context-label">{msg.context.label}</span>
                              <OpenInNewOutlined sx={{ fontSize: 10 }} className="mc-msg-context-arrow" />
                            </button>
                          )}
                          <div className="mc-msg-footer">
                            <span className="mc-msg-time">{formatFullTime(msg.timestamp)}</span>
                            {isMe && <span className="mc-msg-status">{getStatusIcon(msg.status)}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Composer */}
            {selectedChat.type === 'broadcast' ? (
              <div className="mc-broadcast-composer">
                <div className="mc-broadcast-banner">
                  <CampaignOutlined sx={{ fontSize: 13 }} />
                  <span>Broadcast · message will be sent to {selectedChat.participants.length} recipients</span>
                </div>
                <div className="mc-input-row mc-input-row--broadcast">
                  <Button variant="text" size="small" className="mc-input-action" aria-label="Attach">
                    <AttachFileOutlined sx={{ fontSize: 20 }} />
                  </Button>
                  <textarea
                    ref={inputRef} className="mc-input"
                    placeholder="Write a broadcast announcement..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown} rows={1}
                  />
                  <Button
                    variant="contained" color="primary" size="medium"
                    className={`mc-send-btn mc-send-btn--broadcast ${inputValue.trim() ? 'mc-send-btn--active' : ''}`}
                    onClick={handleSend} disabled={!inputValue.trim()} aria-label="Broadcast"
                  >
                    <CampaignOutlined sx={{ fontSize: 18 }} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mc-input-area">
                <div className="mc-input-row">
                  <Button variant="text" size="small" className="mc-input-action" aria-label="Emoji">
                    <SentimentSatisfiedOutlined sx={{ fontSize: 20 }} />
                  </Button>
                  <Button variant="text" size="small" className="mc-input-action" aria-label="Attach">
                    <AttachFileOutlined sx={{ fontSize: 20 }} />
                  </Button>
                  <textarea
                    ref={inputRef} className="mc-input"
                    placeholder="Type a message..." value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown} rows={1}
                  />
                  <Button
                    variant="contained" color="primary" size="medium"
                    className={`mc-send-btn ${inputValue.trim() ? 'mc-send-btn--active' : ''}`}
                    onClick={handleSend} disabled={!inputValue.trim()} aria-label="Send"
                  >
                    <SendOutlined sx={{ fontSize: 18 }} />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mc-empty-state">
            <EmptyState
              heading="No Conversation Selected"
              description="Select a conversation from the left to start messaging, or create a new one."
              emptyStateIcon={<ForumOutlined sx={{ fontSize: 48 }} />}
            />
          </div>
        )}
      </div>

      {/* ── New Chat Modal ── */}
      {showNewChat && (
        <div className="mc-modal-overlay" onClick={closeModal}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <div className="mc-modal-header">
              {modalStep !== 'main' && (
                <button className="mc-modal-nav-btn" onClick={() => { setModalStep('main'); setSelectedMembers([]); setNewChatName(''); setContactSearch(''); setBroadcastMessage(''); }} aria-label="Back">
                  <ArrowBackOutlined sx={{ fontSize: 18 }} />
                </button>
              )}
              <h3>
                {modalStep === 'main' && 'New Conversation'}
                {modalStep === 'group' && 'New Group'}
                {modalStep === 'broadcast' && 'New Broadcast'}
              </h3>
              <button className="mc-modal-nav-btn mc-modal-nav-btn--close" onClick={closeModal} aria-label="Close">
                <CloseOutlined sx={{ fontSize: 18 }} />
              </button>
            </div>

            {modalStep === 'main' && (
              <>
                <div className="mc-modal-search">
                  <SearchOutlined sx={{ fontSize: 15 }} />
                  <input type="text" placeholder="Search people..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} />
                  {contactSearch && (
                    <button className="mc-search-clear-btn" onClick={() => setContactSearch('')} aria-label="Clear">
                      <CloseOutlined sx={{ fontSize: 13 }} />
                    </button>
                  )}
                </div>
                <div className="mc-modal-actions">
                  <button className="mc-modal-action-btn" onClick={() => setModalStep('group')}>
                    <span className="mc-modal-action-icon mc-modal-action-icon--group"><GroupOutlined sx={{ fontSize: 18 }} /></span>
                    <div>
                      <span className="mc-modal-action-title">New Group</span>
                      <span className="mc-modal-action-desc">Create a group chat with multiple people</span>
                    </div>
                  </button>
                  <button className="mc-modal-action-btn" onClick={() => setModalStep('broadcast')}>
                    <span className="mc-modal-action-icon mc-modal-action-icon--broadcast"><CampaignOutlined sx={{ fontSize: 18 }} /></span>
                    <div>
                      <span className="mc-modal-action-title">New Broadcast</span>
                      <span className="mc-modal-action-desc">Send announcements to multiple people</span>
                    </div>
                  </button>
                </div>
                <div className="mc-modal-contacts-label">Contacts</div>
                <div className="mc-modal-contacts">
                  {filteredContacts.map(c => {
                    const av = getAvatarGradient(c.avatar);
                    return (
                      <button key={c.id} className="mc-modal-contact" onClick={() => startDirectMessage(c)}>
                        <div className="mc-modal-contact-avatar" style={{ background: av.bg, color: av.ink }}>{c.avatar}</div>
                        <div className="mc-modal-contact-info">
                          <span className="mc-modal-contact-name">{c.name}</span>
                          <span className="mc-modal-contact-role">{c.role}{c.store ? ` · ${c.store}` : ''}</span>
                        </div>
                        {c.online && <span className="mc-modal-contact-online" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {(modalStep === 'group' || modalStep === 'broadcast') && (
              <>
                <div className="mc-modal-name-input">
                  <input type="text" placeholder={modalStep === 'group' ? 'Group name...' : 'Broadcast name...'} value={newChatName} onChange={e => setNewChatName(e.target.value)} autoFocus />
                </div>

                {/* Message field — broadcast only */}
                {modalStep === 'broadcast' && (
                  <div className="mc-modal-message-input">
                    <div className="mc-modal-message-label">
                      <CampaignOutlined sx={{ fontSize: 13 }} />
                      <span>Announcement message</span>
                    </div>
                    <textarea
                      className="mc-modal-message-textarea"
                      placeholder="Write your broadcast announcement here..."
                      value={broadcastMessage}
                      onChange={e => setBroadcastMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
                {selectedMembers.length > 0 && (
                  <div className="mc-selected-chips">
                    {selectedMembers.map(id => {
                      const c = contacts.find(ct => ct.id === id);
                      if (!c) return null;
                      return (
                        <Chips key={id} label={c.name.split(' ')[0]} size="small" variant="solid" isRemovable onDelete={() => toggleMember(id)} />
                      );
                    })}
                  </div>
                )}
                <div className="mc-modal-search">
                  <SearchOutlined sx={{ fontSize: 15 }} />
                  <input type="text" placeholder={modalStep === 'group' ? 'Add members...' : 'Add recipients...'} value={contactSearch} onChange={e => setContactSearch(e.target.value)} />
                </div>
                <div className="mc-modal-contacts-label">
                  {modalStep === 'group' ? 'Select Members' : 'Select Recipients'} ({selectedMembers.length})
                </div>
                <div className="mc-modal-contacts">
                  {filteredContacts.map(c => {
                    const isSelected = selectedMembers.includes(c.id);
                    const av = getAvatarGradient(c.avatar);
                    return (
                      <button key={c.id} className={`mc-modal-contact ${isSelected ? 'mc-modal-contact--selected' : ''}`} onClick={() => toggleMember(c.id)}>
                        <div className="mc-modal-contact-avatar" style={{ background: av.bg, color: av.ink }}>{c.avatar}</div>
                        <div className="mc-modal-contact-info">
                          <span className="mc-modal-contact-name">{c.name}</span>
                          <span className="mc-modal-contact-role">{c.role}{c.store ? ` · ${c.store}` : ''}</span>
                        </div>
                        <span className={`mc-checkbox ${isSelected ? 'mc-checkbox--checked' : ''}`}>
                          {isSelected && <Check sx={{ fontSize: 12 }} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mc-modal-footer">
                  <Button
                    variant="contained" color="primary" size="large"
                    className="mc-create-btn" disabled={!selectedMembers.length}
                    onClick={modalStep === 'group' ? createGroupChat : createBroadcast}
                    startIcon={modalStep === 'group' ? <GroupOutlined sx={{ fontSize: 16 }} /> : <CampaignOutlined sx={{ fontSize: 16 }} />}
                  >
                    {modalStep === 'group' ? 'Create Group' : 'Create Broadcast'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
