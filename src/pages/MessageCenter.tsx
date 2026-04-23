import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Users,
  Megaphone,
  MessageSquare,
  Plus,
  Hash,
  Pin,
  X,
  ArrowLeft,
} from 'lucide-react';
import './MessageCenter.css';

// ── Types ──
type ChatType = 'direct' | 'group' | 'broadcast';
type MessageStatus = 'sent' | 'delivered' | 'read';
type Tab = 'all' | 'direct' | 'groups' | 'broadcast';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  store?: string;
  online: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  replyTo?: string;
  imageUrl?: string;
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
const currentUser: Contact = {
  id: 'me',
  name: 'John Doe',
  avatar: 'JD',
  role: 'Store Manager',
  store: 'Store #142',
  online: true,
};

const contacts: Contact[] = [
  { id: 'u1', name: 'Sarah Chen', avatar: 'SC', role: 'District Manager', online: true },
  { id: 'u2', name: 'Mike Rodriguez', avatar: 'MR', role: 'Regional VP', online: false, lastSeen: '2h ago' },
  { id: 'u3', name: 'Emily Parker', avatar: 'EP', role: 'Store Associate', store: 'Store #142', online: true },
  { id: 'u4', name: 'David Kim', avatar: 'DK', role: 'Loss Prevention', online: false, lastSeen: '30m ago' },
  { id: 'u5', name: 'Lisa Thompson', avatar: 'LT', role: 'Inventory Lead', store: 'Store #142', online: true },
  { id: 'u6', name: 'James Wilson', avatar: 'JW', role: 'Store Manager', store: 'Store #087', online: false, lastSeen: '1h ago' },
  { id: 'u7', name: 'Anna Martinez', avatar: 'AM', role: 'Planogram Specialist', online: true },
  { id: 'u8', name: 'Robert Chang', avatar: 'RC', role: 'Operations Director', online: true },
];

const mockChats: Chat[] = [
  {
    id: 'c1',
    type: 'direct',
    name: 'Sarah Chen',
    avatar: 'SC',
    participants: [contacts[0]],
    unread: 2,
    pinned: true,
    lastActivity: new Date(Date.now() - 5 * 60000),
    messages: [
      { id: 'm1', senderId: 'u1', content: 'Hey! Did you see the new planogram for Aisle 7?', timestamp: new Date(Date.now() - 45 * 60000), status: 'read' },
      { id: 'm2', senderId: 'me', content: 'Yes! Implementing it this afternoon. The endcap layout looks great.', timestamp: new Date(Date.now() - 40 * 60000), status: 'read' },
      { id: 'm3', senderId: 'u1', content: 'Perfect. Let me know if you need help with the reset. I can send a team over.', timestamp: new Date(Date.now() - 30 * 60000), status: 'read' },
      { id: 'm4', senderId: 'me', content: 'That would be awesome, thanks! We\'re a bit short-staffed today.', timestamp: new Date(Date.now() - 25 * 60000), status: 'read' },
      { id: 'm5', senderId: 'u1', content: 'No problem. I\'ll have 2 people there by 2 PM. Also, the compliance audit results are in — your store scored 94%! 🎉', timestamp: new Date(Date.now() - 10 * 60000), status: 'delivered' },
      { id: 'm6', senderId: 'u1', content: 'Can you check the POG compliance report I shared?', timestamp: new Date(Date.now() - 5 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c2',
    type: 'group',
    name: 'Store #142 Team',
    avatar: 'ST',
    description: 'All hands for Store #142 operations',
    participants: [contacts[0], contacts[2], contacts[4]],
    unread: 5,
    pinned: true,
    lastActivity: new Date(Date.now() - 12 * 60000),
    messages: [
      { id: 'm10', senderId: 'u3', content: 'Morning shift check-in: all sections covered ✅', timestamp: new Date(Date.now() - 120 * 60000), status: 'read' },
      { id: 'm11', senderId: 'u5', content: 'Inventory count for dairy is done. We need to reorder milk — down to 15 units.', timestamp: new Date(Date.now() - 90 * 60000), status: 'read' },
      { id: 'm12', senderId: 'me', content: 'Thanks Lisa! I\'ll submit the PO right away.', timestamp: new Date(Date.now() - 85 * 60000), status: 'read' },
      { id: 'm13', senderId: 'u3', content: 'Customer reported a spill in Aisle 3. Cleanup in progress.', timestamp: new Date(Date.now() - 30 * 60000), status: 'read' },
      { id: 'm14', senderId: 'u5', content: '@everyone Quick reminder: stockroom audit at 4 PM today', timestamp: new Date(Date.now() - 12 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c3',
    type: 'broadcast',
    name: 'Regional Updates',
    avatar: 'RU',
    description: 'Official announcements from Regional HQ',
    participants: contacts,
    unread: 1,
    pinned: false,
    lastActivity: new Date(Date.now() - 60 * 60000),
    messages: [
      { id: 'm20', senderId: 'u2', content: '📋 Q4 Planogram Refresh — All stores must complete the Holiday reset by Nov 15. New POGs are available in the system. Contact your district manager for questions.', timestamp: new Date(Date.now() - 180 * 60000), status: 'read' },
      { id: 'm21', senderId: 'u2', content: '🏆 Congrats to Store #142, #087, and #215 for achieving 95%+ compliance this quarter! Keep up the great work.', timestamp: new Date(Date.now() - 60 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c4',
    type: 'direct',
    name: 'David Kim',
    avatar: 'DK',
    participants: [contacts[3]],
    unread: 0,
    pinned: false,
    lastActivity: new Date(Date.now() - 180 * 60000),
    messages: [
      { id: 'm30', senderId: 'u4', content: 'Completed the LP walkthrough for this week. Report is uploaded.', timestamp: new Date(Date.now() - 240 * 60000), status: 'read' },
      { id: 'm31', senderId: 'me', content: 'Thanks David. Any concerns I should know about?', timestamp: new Date(Date.now() - 200 * 60000), status: 'read' },
      { id: 'm32', senderId: 'u4', content: 'Camera 3 near the back exit needs adjustment. I\'ve raised a ticket.', timestamp: new Date(Date.now() - 180 * 60000), status: 'read' },
    ],
  },
  {
    id: 'c5',
    type: 'group',
    name: 'District Managers',
    avatar: 'DM',
    description: 'DM sync and coordination',
    participants: [contacts[0], contacts[5], contacts[7]],
    unread: 0,
    pinned: false,
    lastActivity: new Date(Date.now() - 300 * 60000),
    messages: [
      { id: 'm40', senderId: 'u1', content: 'Team — let\'s align on the holiday staffing plan. I\'ve shared a draft in the shared drive.', timestamp: new Date(Date.now() - 360 * 60000), status: 'read' },
      { id: 'm41', senderId: 'u8', content: 'Reviewed it. I think we need +20% coverage for Black Friday week. Let me know your thoughts.', timestamp: new Date(Date.now() - 300 * 60000), status: 'read' },
    ],
  },
  {
    id: 'c6',
    type: 'broadcast',
    name: 'Safety Alerts',
    avatar: 'SA',
    description: 'Critical safety and compliance alerts',
    participants: contacts,
    unread: 1,
    pinned: false,
    lastActivity: new Date(Date.now() - 30 * 60000),
    messages: [
      { id: 'm50', senderId: 'u8', content: '🔴 IMPORTANT: New fire safety protocol effective immediately. All fire exits must be inspected by end of week. Checklist attached to the operations queue.', timestamp: new Date(Date.now() - 480 * 60000), status: 'read' },
      { id: 'm51', senderId: 'u8', content: '📋 Mandatory safety training modules have been updated. All store managers must complete the new training by end of month. Access the training portal through the Learning Hub. Certificates will be issued upon completion.', timestamp: new Date(Date.now() - 30 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c8',
    type: 'broadcast',
    name: 'Operations — Holiday Schedule',
    avatar: 'HS',
    description: 'Holiday operations and scheduling updates',
    participants: contacts,
    unread: 1,
    pinned: true,
    lastActivity: new Date(Date.now() - 30 * 60000),
    messages: [
      { id: 'm70', senderId: 'u2', content: '📢 All stores will operate on modified hours during the upcoming holiday weekend (Dec 23-26). Please review the attached schedule and confirm your team\'s availability by Friday. Contact HR if you need to request time off.', timestamp: new Date(Date.now() - 30 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c9',
    type: 'broadcast',
    name: 'Performance Highlights',
    avatar: 'PH',
    description: 'Quarterly performance updates and recognition',
    participants: contacts,
    unread: 1,
    pinned: false,
    lastActivity: new Date(Date.now() - 120 * 60000),
    messages: [
      { id: 'm80', senderId: 'u2', content: '🏆 Great job on exceeding Q4 targets! Our district achieved 108% of sales goals. Top performers will be recognized at the regional meeting next week. Keep up the excellent work!', timestamp: new Date(Date.now() - 120 * 60000), status: 'delivered' },
    ],
  },
  {
    id: 'c7',
    type: 'direct',
    name: 'Anna Martinez',
    avatar: 'AM',
    participants: [contacts[6]],
    unread: 0,
    pinned: false,
    lastActivity: new Date(Date.now() - 600 * 60000),
    messages: [
      { id: 'm60', senderId: 'u7', content: 'The Aisle 5 planogram audit is ready for review. Score: 91%.', timestamp: new Date(Date.now() - 720 * 60000), status: 'read' },
      { id: 'm61', senderId: 'me', content: 'Great work Anna! I\'ll approve it today.', timestamp: new Date(Date.now() - 600 * 60000), status: 'read' },
    ],
  },
];

// ── Helper Functions ──
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

const formatFullTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getInitialColor = (initials: string) => {
  const colors = [
    'linear-gradient(135deg, #6366f1, #7c3aed)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #ec4899, #f43f5e)',
    'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'linear-gradient(135deg, #8b5cf6, #a855f7)',
    'linear-gradient(135deg, #14b8a6, #0d9488)',
    'linear-gradient(135deg, #f97316, #ea580c)',
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

// ── Component ──
export const MessageCenter: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<string | null>('c1');
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showNewChat, setShowNewChat] = useState(false);
  const [modalStep, setModalStep] = useState<'main' | 'group' | 'broadcast'>('main');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newChatName, setNewChatName] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectedChat = chats.find(c => c.id === activeChat);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages.length]);

  useEffect(() => {
    if (activeChat) inputRef.current?.focus();
  }, [activeChat]);

  const filteredChats = chats
    .filter(c => {
      if (activeTab === 'direct') return c.type === 'direct';
      if (activeTab === 'groups') return c.type === 'group';
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
      id: `msg-${Date.now()}`,
      senderId: 'me',
      content: inputValue.trim(),
      timestamp: new Date(),
      status: 'sent',
    };

    setChats(prev => prev.map(c =>
      c.id === activeChat
        ? { ...c, messages: [...c.messages, newMsg], lastActivity: new Date() }
        : c
    ));
    setInputValue('');

    // Simulate delivered status
    setTimeout(() => {
      setChats(prev => prev.map(c =>
        c.id === activeChat
          ? { ...c, messages: c.messages.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' as MessageStatus } : m) }
          : c
      ));
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const closeModal = () => {
    setShowNewChat(false);
    setModalStep('main');
    setSelectedMembers([]);
    setNewChatName('');
    setContactSearch('');
  };

  const toggleMember = (id: string) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const createGroupChat = () => {
    if (selectedMembers.length === 0) return;
    const members = contacts.filter(c => selectedMembers.includes(c.id));
    const autoName = newChatName.trim() || members.map(m => m.name.split(' ')[0]).join(', ');
    const newChat: Chat = {
      id: `c-${Date.now()}`,
      type: 'group',
      name: autoName,
      avatar: '👥',
      description: `Group with ${members.length} members`,
      participants: members,
      messages: [],
      unread: 0,
      pinned: false,
      lastActivity: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    closeModal();
  };

  const createBroadcast = () => {
    if (selectedMembers.length === 0) return;
    const members = contacts.filter(c => selectedMembers.includes(c.id));
    const autoName = newChatName.trim() || `Broadcast (${members.map(m => m.name.split(' ')[0]).join(', ')})`;
    const newChat: Chat = {
      id: `c-${Date.now()}`,
      type: 'broadcast',
      name: autoName,
      avatar: '📢',
      description: `Broadcast to ${members.length} recipients`,
      participants: members,
      messages: [],
      unread: 0,
      pinned: false,
      lastActivity: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setActiveTab('broadcast');
    closeModal();
  };

  const startDirectMessage = (contact: Contact) => {
    // Check if DM already exists
    const existing = chats.find(c => c.type === 'direct' && c.participants[0]?.id === contact.id);
    if (existing) {
      setActiveChat(existing.id);
      closeModal();
      return;
    }
    const newChat: Chat = {
      id: `c-${Date.now()}`,
      type: 'direct',
      name: contact.name,
      avatar: contact.avatar,
      participants: [contact],
      messages: [],
      unread: 0,
      pinned: false,
      lastActivity: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    closeModal();
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const getLastMessage = (chat: Chat) => {
    const last = chat.messages[chat.messages.length - 1];
    if (!last) return '';
    const prefix = last.senderId === 'me' ? 'You: ' : '';
    const text = last.content.length > 50 ? last.content.slice(0, 50) + '…' : last.content;
    return prefix + text;
  };

  const getOnlineParticipant = (chat: Chat) => {
    if (chat.type === 'direct') return chat.participants[0]?.online || false;
    return false;
  };

  const getChatTypeIcon = (type: ChatType) => {
    switch (type) {
      case 'group': return <Users size={10} />;
      case 'broadcast': return <Megaphone size={10} />;
      default: return null;
    }
  };

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sent': return <Check size={14} />;
      case 'delivered': return <CheckCheck size={14} />;
      case 'read': return <CheckCheck size={14} className="mc-status-read" />;
    }
  };

  const renderDateSeparator = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let label = date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    if (isToday) label = 'Today';
    if (isYesterday) label = 'Yesterday';

    return (
      <div className="mc-date-sep">
        <span>{label}</span>
      </div>
    );
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    messages.forEach(msg => {
      const dateStr = msg.timestamp.toDateString();
      const existing = groups.find(g => g.date === dateStr);
      if (existing) {
        existing.messages.push(msg);
      } else {
        groups.push({ date: dateStr, messages: [msg] });
      }
    });
    return groups;
  };

  return (
    <div className="mc-container">
      {/* Left Panel — Chat List */}
      <div className="mc-sidebar">
        {/* Sidebar Header */}
        <div className="mc-sidebar-header">
          <div className="mc-sidebar-title">
            <MessageSquare size={20} />
            <h2>Communications</h2>
          </div>
          <button className="mc-new-chat-btn" onClick={() => setShowNewChat(!showNewChat)}>
            <Plus size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="mc-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="mc-search-clear" onClick={() => setSearchQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mc-tabs">
          {([
            { id: 'all' as Tab, label: 'All', icon: null },
            { id: 'direct' as Tab, label: 'Direct', icon: <MessageSquare size={12} /> },
            { id: 'groups' as Tab, label: 'Groups', icon: <Users size={12} /> },
            { id: 'broadcast' as Tab, label: 'Broadcast', icon: <Megaphone size={12} /> },
          ]).map(tab => (
            <button
              key={tab.id}
              className={`mc-tab ${activeTab === tab.id ? 'mc-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Chat List */}
        <div className="mc-chat-list">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              className={`mc-chat-item ${activeChat === chat.id ? 'mc-chat-item--active' : ''}`}
              onClick={() => { setActiveChat(chat.id); setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c)); }}
            >
              <div className="mc-chat-avatar-wrap">
                <div className="mc-chat-avatar" style={{ background: getInitialColor(chat.avatar) }}>
                  <span className="mc-chat-avatar-text">{chat.avatar}</span>
                </div>
                {getOnlineParticipant(chat) && <span className="mc-online-dot" />}
                {chat.type !== 'direct' && (
                  <span className="mc-chat-type-badge">{getChatTypeIcon(chat.type)}</span>
                )}
              </div>
              <div className="mc-chat-info">
                <div className="mc-chat-info-top">
                  <span className="mc-chat-name">{chat.name}</span>
                  <span className="mc-chat-time">{formatTime(chat.lastActivity)}</span>
                </div>
                <div className="mc-chat-info-bottom">
                  <span className="mc-chat-preview">{getLastMessage(chat)}</span>
                  <div className="mc-chat-badges">
                    {chat.pinned && <Pin size={11} className="mc-pin-icon" />}
                    {chat.unread > 0 && <span className="mc-unread-badge">{chat.unread}</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel — Chat View */}
      <div className="mc-main">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="mc-chat-header">
              <div className="mc-chat-header-left">
                <div className="mc-chat-header-avatar" style={{ background: getInitialColor(selectedChat.avatar) }}>
                  <span className="mc-chat-avatar-text">{selectedChat.avatar}</span>
                </div>
                <div className="mc-chat-header-info">
                  <h3>{selectedChat.name}</h3>
                  <span className="mc-chat-header-sub">
                    {selectedChat.type === 'direct'
                      ? (selectedChat.participants[0]?.online ? '● Online' : `Last seen ${selectedChat.participants[0]?.lastSeen || 'recently'}`)
                      : `${selectedChat.participants.length} members`
                    }
                  </span>
                </div>
              </div>
              <div className="mc-chat-header-actions">
                {selectedChat.type === 'direct' && (
                  <>
                    <button className="mc-header-action"><Phone size={18} /></button>
                    <button className="mc-header-action"><Video size={18} /></button>
                  </>
                )}
                <button className="mc-header-action"><Search size={18} /></button>
                <button className="mc-header-action"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="mc-messages">
              {selectedChat.description && (
                <div className="mc-chat-description">
                  <Hash size={14} />
                  <span>{selectedChat.description}</span>
                </div>
              )}
              {groupMessagesByDate(selectedChat.messages).map(group => (
                <React.Fragment key={group.date}>
                  {renderDateSeparator(new Date(group.date))}
                  {group.messages.map((msg, idx) => {
                    const isMe = msg.senderId === 'me';
                    const sender = contacts.find(c => c.id === msg.senderId);
                    const showAvatar = !isMe && selectedChat.type !== 'direct' && (idx === 0 || group.messages[idx - 1].senderId !== msg.senderId);
                    const isConsecutive = idx > 0 && group.messages[idx - 1].senderId === msg.senderId;

                    return (
                      <div key={msg.id} className={`mc-msg ${isMe ? 'mc-msg--me' : 'mc-msg--them'} ${isConsecutive ? 'mc-msg--consecutive' : ''}`}>
                        {!isMe && selectedChat.type !== 'direct' && (
                          <div className="mc-msg-avatar-space">
                            {showAvatar && (
                              <div className="mc-msg-avatar" style={{ background: getInitialColor(sender?.avatar || '??') }}>
                                {sender?.avatar || '??'}
                              </div>
                            )}
                          </div>
                        )}
                        <div className={`mc-msg-bubble ${isMe ? 'mc-msg-bubble--me' : 'mc-msg-bubble--them'}`}>
                          {!isMe && selectedChat.type !== 'direct' && showAvatar && (
                            <span className="mc-msg-sender-name">{sender?.name}</span>
                          )}
                          <p className="mc-msg-text">{msg.content}</p>
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

            {/* Input Area */}
            {selectedChat.type !== 'broadcast' ? (
              <div className="mc-input-area">
                <div className="mc-input-row">
                  <button className="mc-input-action"><Smile size={20} /></button>
                  <button className="mc-input-action"><Paperclip size={20} /></button>
                  <textarea
                    ref={inputRef}
                    className="mc-input"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button
                    className={`mc-send-btn ${inputValue.trim() ? 'mc-send-btn--active' : ''}`}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mc-broadcast-footer">
                <Megaphone size={14} />
                <span>This is a broadcast channel. Only admins can send messages.</span>
              </div>
            )}
          </>
        ) : (
          <div className="mc-empty-state">
            <div className="mc-empty-icon">
              <MessageSquare size={48} />
            </div>
            <h2>Welcome to Communications</h2>
            <p>Select a conversation to start messaging, or create a new one.</p>
          </div>
        )}
      </div>

      {/* New Chat Modal — Multi-step */}
      {showNewChat && (
        <div className="mc-modal-overlay" onClick={closeModal}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="mc-modal-header">
              {modalStep !== 'main' && (
                <button className="mc-modal-back" onClick={() => { setModalStep('main'); setSelectedMembers([]); setNewChatName(''); setContactSearch(''); }}>
                  <ArrowLeft size={18} />
                </button>
              )}
              <h3>
                {modalStep === 'main' && 'New Conversation'}
                {modalStep === 'group' && 'New Group'}
                {modalStep === 'broadcast' && 'New Broadcast'}
              </h3>
              <button className="mc-modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            {/* Main Step — Choose type or DM a contact */}
            {modalStep === 'main' && (
              <>
                <div className="mc-modal-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={contactSearch}
                    onChange={e => setContactSearch(e.target.value)}
                  />
                  {contactSearch && (
                    <button className="mc-search-clear" onClick={() => setContactSearch('')}>
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div className="mc-modal-actions">
                  <button className="mc-modal-action-btn" onClick={() => setModalStep('group')}>
                    <Users size={18} />
                    <div>
                      <span className="mc-modal-action-title">New Group</span>
                      <span className="mc-modal-action-desc">Create a group chat with multiple people</span>
                    </div>
                  </button>
                  <button className="mc-modal-action-btn" onClick={() => setModalStep('broadcast')}>
                    <Megaphone size={18} />
                    <div>
                      <span className="mc-modal-action-title">New Broadcast</span>
                      <span className="mc-modal-action-desc">Send announcements to multiple people</span>
                    </div>
                  </button>
                </div>
                <div className="mc-modal-contacts-label">Contacts</div>
                <div className="mc-modal-contacts">
                  {filteredContacts.map(c => (
                    <button key={c.id} className="mc-modal-contact" onClick={() => startDirectMessage(c)}>
                      <div className="mc-modal-contact-avatar" style={{ background: getInitialColor(c.avatar) }}>
                        {c.avatar}
                      </div>
                      <div className="mc-modal-contact-info">
                        <span className="mc-modal-contact-name">{c.name}</span>
                        <span className="mc-modal-contact-role">{c.role}{c.store ? ` · ${c.store}` : ''}</span>
                      </div>
                      {c.online && <span className="mc-modal-contact-online" />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Group / Broadcast Creation Step */}
            {(modalStep === 'group' || modalStep === 'broadcast') && (
              <>
                <div className="mc-modal-name-input">
                  <input
                    type="text"
                    placeholder={modalStep === 'group' ? 'Group name...' : 'Broadcast name...'}
                    value={newChatName}
                    onChange={e => setNewChatName(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Selected Members Chips */}
                {selectedMembers.length > 0 && (
                  <div className="mc-selected-chips">
                    {selectedMembers.map(id => {
                      const c = contacts.find(ct => ct.id === id);
                      if (!c) return null;
                      return (
                        <span key={id} className="mc-chip">
                          {c.name.split(' ')[0]}
                          <button onClick={() => toggleMember(id)}><X size={11} /></button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="mc-modal-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder={modalStep === 'group' ? 'Add members...' : 'Add recipients...'}
                    value={contactSearch}
                    onChange={e => setContactSearch(e.target.value)}
                  />
                </div>

                <div className="mc-modal-contacts-label">
                  {modalStep === 'group' ? 'Select Members' : 'Select Recipients'} ({selectedMembers.length})
                </div>
                <div className="mc-modal-contacts">
                  {filteredContacts.map(c => {
                    const isSelected = selectedMembers.includes(c.id);
                    return (
                      <button key={c.id} className={`mc-modal-contact ${isSelected ? 'mc-modal-contact--selected' : ''}`} onClick={() => toggleMember(c.id)}>
                        <div className="mc-modal-contact-avatar" style={{ background: getInitialColor(c.avatar) }}>
                          {c.avatar}
                        </div>
                        <div className="mc-modal-contact-info">
                          <span className="mc-modal-contact-name">{c.name}</span>
                          <span className="mc-modal-contact-role">{c.role}{c.store ? ` · ${c.store}` : ''}</span>
                        </div>
                        <span className={`mc-checkbox ${isSelected ? 'mc-checkbox--checked' : ''}`}>
                          {isSelected && <Check size={12} />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Create Button */}
                <div className="mc-modal-footer">
                  <button
                    className={`mc-create-btn ${selectedMembers.length > 0 ? 'mc-create-btn--active' : ''}`}
                    disabled={selectedMembers.length === 0}
                    onClick={modalStep === 'group' ? createGroupChat : createBroadcast}
                  >
                    {modalStep === 'group' ? (
                      <><Users size={16} /> Create Group</>
                    ) : (
                      <><Megaphone size={16} /> Create Broadcast</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
