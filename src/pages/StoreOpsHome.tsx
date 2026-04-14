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
  Users,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Package,
  Store,
  Bell,
  Check,
  BarChart3,
  ArrowRight,
  Info,
  Minus,
  ThumbsUp,
  MessageSquare,
  Calendar,
  X,
  MapPin,
  Phone,
  Mail,
  Search,
  Download,
  ExternalLink,
  ClipboardCheck,
  Archive,
  UserPlus,
  Send,
  ShoppingCart,
  Truck,
  MessageCircle,
  Star
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

// Planogram action item
interface PlanogramAction {
  id: string;
  description: string;
  section: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

// Inventory item for low stock alerts
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  minStock: number;
  reorderQty: number;
  supplier: string;
  priority: 'critical' | 'high' | 'medium';
}

// Safety checklist item
interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'pending' | 'completed' | 'failed';
}

// Shipment details
interface ShipmentDetails {
  shipmentId: string;
  carrier: string;
  expectedDate: string;
  totalItems: number;
  totalValue: number;
  poNumber: string;
}

// Shipment item
interface ShipmentItem {
  id: string;
  sku: string;
  name: string;
  ordered: number;
  received: number;
  status: 'complete' | 'short' | 'over';
  variance?: number;
}

// VoC Escalation
interface VoCEscalation {
  id: string;
  customerName: string;
  date: string;
  category: string;
  rating: number;
  summary: string;
  details: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'very_negative';
  responseRequired: boolean;
}

// Enhanced action item with CTA and severity
interface ActionItemV2 extends EnhancedActionItem {
  severity: 'critical' | 'high' | 'medium' | 'low';
  cta: string;
  microContext?: string;
  planogramImage?: string;
  planogramActions?: PlanogramAction[];
  inventoryItems?: InventoryItem[];
  checklistItems?: ChecklistItem[];
  shipmentDetails?: ShipmentDetails;
  shipmentItems?: ShipmentItem[];
  escalations?: VoCEscalation[];
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
    planogramImage: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=60',
    planogramActions: [
      { id: 'pa1', description: 'Move energy drinks to eye-level shelf (Aisle 3)', section: 'Beverages', priority: 'high' },
      { id: 'pa2', description: 'Restock protein bars - minimum 20 units front-facing', section: 'Snacks', priority: 'high' },
      { id: 'pa3', description: 'Add new promotional end-cap for seasonal items', section: 'Seasonal', priority: 'medium' },
      { id: 'pa4', description: 'Remove discontinued SKUs from bottom shelf', section: 'Clearance', priority: 'low' },
      { id: 'pa5', description: 'Update price tags for all items in Section B', section: 'Pricing', priority: 'medium' },
    ],
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
    inventoryItems: [
      { id: 'sku1', sku: 'SKU-7823', name: 'Organic Milk 1L', currentStock: 3, minStock: 15, reorderQty: 50, supplier: 'DairyFresh Co.', priority: 'critical' },
      { id: 'sku2', sku: 'SKU-4521', name: 'Whole Wheat Bread', currentStock: 5, minStock: 20, reorderQty: 40, supplier: 'BakeryPlus', priority: 'critical' },
      { id: 'sku3', sku: 'SKU-9012', name: 'Free Range Eggs (12pk)', currentStock: 8, minStock: 25, reorderQty: 60, supplier: 'FarmFresh', priority: 'high' },
      { id: 'sku4', sku: 'SKU-3345', name: 'Greek Yogurt 500g', currentStock: 12, minStock: 30, reorderQty: 45, supplier: 'DairyFresh Co.', priority: 'high' },
      { id: 'sku5', sku: 'SKU-6678', name: 'Orange Juice 2L', currentStock: 6, minStock: 18, reorderQty: 36, supplier: 'CitrusBest', priority: 'critical' },
    ],
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
    checklistItems: [
      { id: 'cl1', category: 'Fire Safety', item: 'Verify all fire extinguishers are charged and accessible', status: 'pending' },
      { id: 'cl2', category: 'Fire Safety', item: 'Check emergency exit signs are illuminated', status: 'pending' },
      { id: 'cl3', category: 'Electrical', item: 'Inspect electrical panels for damage or hazards', status: 'pending' },
      { id: 'cl4', category: 'Electrical', item: 'Verify no exposed wiring in customer areas', status: 'pending' },
      { id: 'cl5', category: 'Floor Safety', item: 'Check for wet floor signs availability', status: 'pending' },
      { id: 'cl6', category: 'Floor Safety', item: 'Inspect floor mats for trip hazards', status: 'pending' },
      { id: 'cl7', category: 'Emergency', item: 'Verify first aid kit is fully stocked', status: 'pending' },
      { id: 'cl8', category: 'Emergency', item: 'Confirm emergency contact list is posted', status: 'pending' },
    ],
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
    shipmentDetails: {
      shipmentId: 'SH-9012',
      carrier: 'FastFreight Logistics',
      expectedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      totalItems: 120,
      totalValue: 4850.00,
      poNumber: 'PO-2024-0892',
    },
    shipmentItems: [
      { id: 'si1', sku: 'SKU-1122', name: 'Paper Towels (6pk)', ordered: 40, received: 40, status: 'complete' },
      { id: 'si2', sku: 'SKU-3344', name: 'Hand Sanitizer 500ml', ordered: 30, received: 28, status: 'short', variance: -2 },
      { id: 'si3', sku: 'SKU-5566', name: 'Trash Bags (50ct)', ordered: 25, received: 25, status: 'complete' },
      { id: 'si4', sku: 'SKU-7788', name: 'Cleaning Spray', ordered: 15, received: 15, status: 'complete' },
      { id: 'si5', sku: 'SKU-9900', name: 'Disposable Gloves (Box)', ordered: 10, received: 12, status: 'over', variance: 2 },
    ],
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
    escalations: [
      { 
        id: 'esc1', 
        customerName: 'Jennifer M.', 
        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: 'Product Quality',
        rating: 2,
        summary: 'Purchased expired dairy products',
        details: 'Customer found that the milk carton purchased yesterday was already past its expiration date. Requesting refund and concerned about quality control processes.',
        sentiment: 'negative',
        responseRequired: true
      },
      { 
        id: 'esc2', 
        customerName: 'Robert K.', 
        date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        category: 'Staff Behavior',
        rating: 1,
        summary: 'Unhelpful staff at checkout',
        details: 'Customer reports that checkout staff was dismissive when asked about a price discrepancy. Customer felt ignored and disrespected. Wants acknowledgment and assurance of better service.',
        sentiment: 'very_negative',
        responseRequired: true
      },
    ],
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
  
  // Action Modal States
  const [showViewStoresModal, setShowViewStoresModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSkuReviewModal, setShowSkuReviewModal] = useState(false);
  const [showActionApprovalModal, setShowActionApprovalModal] = useState(false);
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItemV2 | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [assignSearchQuery, setAssignSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [showNotificationSent, setShowNotificationSent] = useState(false);
  const [notifiedStores, setNotifiedStores] = useState<typeof impactedStores>([]);
  
  // SKU Reorder States
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [showReorderSent, setShowReorderSent] = useState(false);
  const [reorderedSkus, setReorderedSkus] = useState<typeof atRiskSkus>([]);
  
  // Archived Actions
  const [archivedActions, setArchivedActions] = useState<{id: string; title: string; completedAt: Date; type: string}[]>([]);
  
  // Regional & Top Performers Modal States
  const [showRegionalModal, setShowRegionalModal] = useState(false);
  const [showTopPerformersModal, setShowTopPerformersModal] = useState(false);
  
  // Planogram Modal States
  const [showPlanogramModal, setShowPlanogramModal] = useState(false);
  const [selectedPlanogramItem, setSelectedPlanogramItem] = useState<ActionItemV2 | null>(null);
  const [planogramActionAssignments, setPlanogramActionAssignments] = useState<{[key: string]: string}>({});
  const [, setCreatedActionItems] = useState<{id: string; description: string; assignedTo: string; section: string; priority: string}[]>([]);
  
  // Inventory Modal States
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<ActionItemV2 | null>(null);
  const [selectedSkusForReorder, setSelectedSkusForReorder] = useState<string[]>([]);
  
  // Checklist Modal States
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<ActionItemV2 | null>(null);
  const [checklistProgress, setChecklistProgress] = useState<{[key: string]: 'pending' | 'completed' | 'failed'}>({});
  
  // Shipment Modal States
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [selectedShipmentItem, setSelectedShipmentItem] = useState<ActionItemV2 | null>(null);
  const [shipmentValidations, setShipmentValidations] = useState<{[key: string]: boolean}>({});
  
  // VoC Modal States
  const [showVoCModal, setShowVoCModal] = useState(false);
  const [selectedVoCItem, setSelectedVoCItem] = useState<ActionItemV2 | null>(null);
  const [selectedEscalation, setSelectedEscalation] = useState<VoCEscalation | null>(null);
  const [escalationResponse, setEscalationResponse] = useState('');
  
  // Chat Window States
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [selectedChatContact, setSelectedChatContact] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showBroadcastComposer, setShowBroadcastComposer] = useState(false);
  const [broadcastRecipients, setBroadcastRecipients] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{id: string; contactId: string; text: string; timestamp: Date; isOutgoing: boolean; type?: string; recipients?: string[]}[]>([
    { id: '1', contactId: '1', text: 'Hi Sarah, please review the holiday schedule update.', timestamp: new Date(Date.now() - 3600000), isOutgoing: true, type: 'broadcast' },
    { id: '2', contactId: '1', text: 'Got it! I\'ll review and confirm by end of day.', timestamp: new Date(Date.now() - 3000000), isOutgoing: false },
    { id: '3', contactId: '2', text: 'Mike, can you check the inventory levels at Store #2341?', timestamp: new Date(Date.now() - 7200000), isOutgoing: true },
    { id: '4', contactId: '2', text: 'Already on it. Will send report shortly.', timestamp: new Date(Date.now() - 6800000), isOutgoing: false },
  ]);
  
  // Incoming broadcasts from others
  const incomingBroadcasts = [
    { 
      id: 'ib1', 
      sender: 'Regional Manager', 
      senderAvatar: 'RM',
      title: 'Holiday Schedule Update',
      message: 'All stores will operate on modified hours during the upcoming holiday weekend (Dec 23-26). Please review the attached schedule and confirm your team\'s availability by Friday. Contact HR if you need to request time off.',
      timestamp: new Date(Date.now() - 1800000),
      priority: 'high',
      category: 'Operations'
    },
    { 
      id: 'ib2', 
      sender: 'District Manager', 
      senderAvatar: 'DM',
      title: 'Q4 Performance Review',
      message: 'Great job on exceeding Q4 targets! Our district achieved 108% of sales goals. Top performers will be recognized at the regional meeting next week. Keep up the excellent work!',
      timestamp: new Date(Date.now() - 7200000),
      priority: 'medium',
      category: 'Announcement'
    },
    { 
      id: 'ib3', 
      sender: 'Compliance Team', 
      senderAvatar: 'CT',
      title: 'New Safety Protocol Training',
      message: 'Mandatory safety training modules have been updated. All store managers must complete the new training by end of month. Access the training portal through the Learning Hub. Certificates will be issued upon completion.',
      timestamp: new Date(Date.now() - 86400000),
      priority: 'high',
      category: 'Training'
    },
  ];
  const [selectedIncomingBroadcast, setSelectedIncomingBroadcast] = useState<typeof incomingBroadcasts[0] | null>(null);

  // Mock data for modals
  const impactedStores = [
    { id: '1847', name: 'Store #1847', address: '123 Main St, Nashville, TN', status: 'critical', skuCount: 5, manager: 'Sarah Johnson', phone: '(615) 555-0123' },
    { id: '2341', name: 'Store #2341', address: '456 Oak Ave, Memphis, TN', status: 'warning', skuCount: 3, manager: 'Mike Chen', phone: '(901) 555-0456' },
    { id: '3892', name: 'Store #3892', address: '789 Pine Rd, Knoxville, TN', status: 'warning', skuCount: 4, manager: 'Lisa Park', phone: '(865) 555-0789' },
  ];

  const atRiskSkus = [
    { sku: 'SKU-12345', name: 'Premium Coffee Blend 12oz', currentStock: 2, safetyStock: 15, reorderQty: 50, supplier: 'Coffee Co.', leadTime: '3 days' },
    { sku: 'SKU-23456', name: 'Organic Milk 1 Gallon', currentStock: 5, safetyStock: 20, reorderQty: 40, supplier: 'Dairy Fresh', leadTime: '1 day' },
    { sku: 'SKU-34567', name: 'Whole Wheat Bread', currentStock: 3, safetyStock: 12, reorderQty: 30, supplier: 'Baker Bros', leadTime: '2 days' },
    { sku: 'SKU-45678', name: 'Free Range Eggs 12ct', currentStock: 8, safetyStock: 25, reorderQty: 60, supplier: 'Farm Direct', leadTime: '2 days' },
    { sku: 'SKU-56789', name: 'Greek Yogurt 32oz', currentStock: 4, safetyStock: 18, reorderQty: 45, supplier: 'Dairy Fresh', leadTime: '1 day' },
  ];

  const teamMembers = [
    { id: '1', name: 'Sarah Johnson', role: 'Store Manager', store: 'Store #1847', avatar: 'SJ' },
    { id: '2', name: 'Mike Chen', role: 'Assistant Manager', store: 'Store #2341', avatar: 'MC' },
    { id: '3', name: 'Lisa Park', role: 'Store Manager', store: 'Store #3892', avatar: 'LP' },
    { id: '4', name: 'James Wilson', role: 'District Supervisor', store: 'District 14', avatar: 'JW' },
    { id: '5', name: 'Emily Davis', role: 'Inventory Specialist', store: 'Regional', avatar: 'ED' },
  ];

  const regionalData = [
    { region: 'North', nps: 78, change: +12, stores: 8, topStore: 'Store #2156' },
    { region: 'South', nps: 72, change: +5, stores: 6, topStore: 'Store #3421' },
    { region: 'East', nps: 68, change: +3, stores: 5, topStore: 'Store #1892' },
    { region: 'West', nps: 65, change: -2, stores: 5, topStore: 'Store #4521' },
  ];

  const topPerformers = [
    { rank: 1, store: 'Store #1234', manager: 'Sarah Johnson', sales: '+12%', target: '108%', trend: 'up' },
    { rank: 2, store: 'Store #2156', manager: 'Mike Chen', sales: '+10%', target: '105%', trend: 'up' },
    { rank: 3, store: 'Store #3421', manager: 'Lisa Park', sales: '+8%', target: '103%', trend: 'up' },
    { rank: 4, store: 'Store #1892', manager: 'James Wilson', sales: '+6%', target: '101%', trend: 'up' },
    { rank: 5, store: 'Store #4521', manager: 'Emily Davis', sales: '+4%', target: '100%', trend: 'neutral' },
  ];

  // Toast notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
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

  const handleActionClick = (item: ActionItemV2) => {
    // Route to context-specific modal based on source_module
    switch (item.source_module) {
      case 'Planogram':
        if (item.planogramImage) {
          handleOpenPlanogramModal(item);
        }
        break;
      case 'Inventory':
        if (item.inventoryItems) {
          setSelectedInventoryItem(item);
          setSelectedSkusForReorder([]);
          setShowInventoryModal(true);
        }
        break;
      case 'Compliance':
        if (item.checklistItems) {
          setSelectedChecklistItem(item);
          setChecklistProgress({});
          setShowChecklistModal(true);
        }
        break;
      case 'Receiving':
        if (item.shipmentItems) {
          setSelectedShipmentItem(item);
          setShipmentValidations({});
          setShowShipmentModal(true);
        }
        break;
      case 'Customer':
        if (item.escalations) {
          setSelectedVoCItem(item);
          setSelectedEscalation(null);
          setEscalationResponse('');
          setShowVoCModal(true);
        }
        break;
      default:
        setSelectedActionItem(item);
        setShowActionApprovalModal(true);
    }
  };

  const handleApproveAction = () => {
    if (selectedActionItem) {
      // Archive the action
      setArchivedActions(prev => [...prev, {
        id: selectedActionItem.id,
        title: selectedActionItem.title,
        completedAt: new Date(),
        type: 'approved'
      }]);
      setActionItems(prev => prev.filter(a => a.id !== selectedActionItem.id));
      showToast(`✓ ${selectedActionItem.title} approved successfully`);
      setShowActionApprovalModal(false);
      setSelectedActionItem(null);
    }
  };

  const handleRejectAction = () => {
    if (selectedActionItem) {
      // Archive as rejected
      setArchivedActions(prev => [...prev, {
        id: selectedActionItem.id,
        title: selectedActionItem.title,
        completedAt: new Date(),
        type: 'rejected'
      }]);
      setActionItems(prev => prev.filter(a => a.id !== selectedActionItem.id));
      showToast(`Action "${selectedActionItem.title}" sent back for review`);
      setShowActionApprovalModal(false);
      setSelectedActionItem(null);
    }
  };

  const handleViewStores = () => {
    setShowViewStoresModal(true);
  };

  const handleAssign = () => {
    setShowAssignModal(true);
  };

  const handleAssignSubmit = () => {
    if (selectedAssignee) {
      const assignee = teamMembers.find(t => t.id === selectedAssignee);
      // Archive the assignment
      setArchivedActions(prev => [...prev, {
        id: `assign-${Date.now()}`,
        title: `Task assigned to ${assignee?.name}`,
        completedAt: new Date(),
        type: 'assigned'
      }]);
      showToast(`✓ Task assigned to ${assignee?.name}`);
      setShowAssignModal(false);
      setSelectedAssignee(null);
      setAssignSearchQuery('');
    }
  };

  const handleReviewSkus = () => {
    setSelectedSkus([]);
    setShowSkuReviewModal(true);
  };

  const handleSendReorderAction = () => {
    const skus = atRiskSkus.filter(s => selectedSkus.includes(s.sku));
    setReorderedSkus(skus);
    setShowReorderSent(true);
  };

  const handleReorderAll = () => {
    setSelectedSkus(atRiskSkus.map(s => s.sku));
    setReorderedSkus(atRiskSkus);
    setShowReorderSent(true);
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

  const handleOpenChat = (contactId?: string) => {
    if (contactId) {
      setSelectedChatContact(contactId);
    }
    setShowChatWindow(true);
    if (selectedBroadcast) {
      setSelectedBroadcast(null);
    }
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim() && selectedChatContact) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        contactId: selectedChatContact,
        text: chatMessage,
        timestamp: new Date(),
        isOutgoing: true
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const getContactMessages = (contactId: string) => {
    return chatMessages.filter(m => m.contactId === contactId);
  };

  const getLastMessage = (contactId: string) => {
    const messages = getContactMessages(contactId);
    return messages.length > 0 ? messages[messages.length - 1] : null;
  };

  const handleOpenPlanogramModal = (item: ActionItemV2) => {
    setSelectedPlanogramItem(item);
    setPlanogramActionAssignments({});
    setShowPlanogramModal(true);
  };

  const handleAssignPlanogramAction = (actionId: string, assignee: string) => {
    setPlanogramActionAssignments(prev => ({
      ...prev,
      [actionId]: assignee
    }));
  };

  const handleCreateActionItems = () => {
    if (!selectedPlanogramItem?.planogramActions) return;
    
    const newItems = selectedPlanogramItem.planogramActions
      .filter(action => planogramActionAssignments[action.id])
      .map(action => ({
        id: `created-${action.id}`,
        description: action.description,
        assignedTo: planogramActionAssignments[action.id],
        section: action.section,
        priority: action.priority
      }));
    
    setCreatedActionItems(prev => [...prev, ...newItems]);
    showToast(`✓ ${newItems.length} action items created and assigned`);
    setShowPlanogramModal(false);
    setSelectedPlanogramItem(null);
    setPlanogramActionAssignments({});
  };

  const handleSendBroadcast = () => {
    if (broadcastMessage.trim() && broadcastRecipients.length > 0) {
      // Add broadcast message to each recipient's chat
      broadcastRecipients.forEach(recipientId => {
        const newMessage = {
          id: `broadcast-${Date.now()}-${recipientId}`,
          contactId: recipientId,
          text: broadcastMessage,
          timestamp: new Date(),
          isOutgoing: true,
          type: 'broadcast',
          recipients: broadcastRecipients
        };
        setChatMessages(prev => [...prev, newMessage]);
      });
      
      showToast(`✓ Broadcast sent to ${broadcastRecipients.length} recipient${broadcastRecipients.length > 1 ? 's' : ''}`);
      setBroadcastMessage('');
      setBroadcastRecipients([]);
      setShowBroadcastComposer(false);
    }
  };

  // Calculate system state summary
  const overdueCount = actionItems.filter(a => a.status === 'overdue').length;
  const pendingCount = actionItems.filter(a => a.status === 'pending').length;
  const riskInsights = insights.filter(i => i.type === 'risk').length;
  const getSystemSummary = () => {
    if (criticalBroadcast) return `1 critical alert needs attention`;
    if (overdueCount > 0) return `${overdueCount} overdue task${overdueCount > 1 ? 's' : ''} need attention`;
    if (riskInsights > 0) return `${riskInsights} risk${riskInsights > 1 ? 's' : ''} detected today`;
    if (pendingCount > 0) return `${pendingCount} task${pendingCount > 1 ? 's' : ''} pending today`;
    return 'Operations running smoothly';
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
            <span className="last-refresh-date">
              <Calendar size={14} />
              Last refreshed: {lastRefresh.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {lastRefresh.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
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

      {/* AI Daily Brief Section */}
      <div className="ai-daily-brief">
        <div className="ai-brief-header">
          <div className="ai-brief-badge-clean">
            <Sparkles size={14} />
            <span>AI DAILY BRIEF</span>
          </div>
          <div className="ai-brief-meta">
            <span>Today, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="meta-separator">•</span>
            <span>5 data streams analysed</span>
          </div>
        </div>
        <div className="ai-brief-greeting">
          <h2>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name || 'Sarah'}. Here's what changed overnight in your district.</h2>
        </div>
        <div className="ai-brief-insights-clean">
          <div className="ai-insight-item-clean">
            <span className="insight-bullet">•</span>
            <div className="insight-content-clean">
              <span className="insight-title-clean">Hamburg South (Store #2041):</span>
              <span className="insight-text-clean"> VoC theme "Messy Aisles" spiked +22% this week while SEA Cleanliness score dropped to 64 — a Silent Risk forming. Sales still healthy, but trajectory is negative.</span>
            </div>
          </div>
          <div className="ai-insight-item-clean">
            <span className="insight-bullet">•</span>
            <div className="insight-content-clean">
              <span className="insight-title-clean">Inbound delay alert:</span>
              <span className="insight-text-clean"> Store #2034 (Cologne East) has a 48-hr shipment delay on 3 high-velocity SKUs — Nike Fleece Jacket, Levi's 501, H&M Basics Bundle. OOS risk flagged.</span>
            </div>
          </div>
          <div className="ai-insight-item-clean">
            <span className="insight-bullet">•</span>
            <div className="insight-content-clean">
              <span className="insight-title-clean">District DPI:</span>
              <span className="insight-text-clean"> Moved from 76 → 78 (+2pts MoM). Amsterdam Central continues top performer at 91. Driven by SEA compliance improvement across 4 stores post-audit cycle.</span>
            </div>
          </div>
          <div className="ai-insight-item-clean">
            <span className="insight-bullet">•</span>
            <div className="insight-content-clean">
              <span className="insight-title-clean">Brussels Nord</span>
              <span className="insight-text-clean"> achieved 100% Camera Shelf Audit compliance for 3rd consecutive week. POG adherence now at 97% — best in district.</span>
            </div>
          </div>
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
              <button className="critical-action-primary" onClick={handleViewStores}>
                <Store size={16} />
                <span>View Stores</span>
              </button>
              <button className="critical-action-assign" onClick={handleAssign}>
                <Users size={16} />
                <span>Assign</span>
              </button>
              <button 
                className="critical-action-secondary"
                onClick={() => {
                  handleAcknowledgeCritical();
                  showToast('✓ Alert acknowledged');
                }}
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
                          <button className="hero-action-primary" onClick={handleReviewSkus}>
                            <Package size={16} />
                            <span>{item.actionCta || 'View Details'}</span>
                          </button>
                          <button className="hero-action-secondary" onClick={handleViewStores}>
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
                          <button 
                            className="compact-action"
                            onClick={() => {
                              if (item.actionHint?.includes('top performers')) {
                                setShowTopPerformersModal(true);
                              } else if (item.actionHint?.includes('regional')) {
                                setShowRegionalModal(true);
                              }
                            }}
                          >
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
          {/* Broadcasts Section - Clean Style */}
          <div className="store-ops-section broadcasts-section-clean">
            <div 
              className="broadcasts-header-clean"
              onClick={() => setBroadcastsExpanded(!broadcastsExpanded)}
            >
              <div className="broadcasts-title-clean">
                <Bell size={16} />
                <h2>Broadcasts</h2>
                {unreadBroadcastCount > 0 && (
                  <span className="broadcast-count">{unreadBroadcastCount}</span>
                )}
              </div>
              <ChevronDown size={16} className={`expand-icon ${broadcastsExpanded ? 'expanded' : ''}`} />
            </div>
            
            {broadcastsExpanded && (
              <div className="broadcasts-list-clean">
                {broadcasts.map((broadcast) => (
                  <div
                    key={broadcast.id}
                    className={`broadcast-item-clean ${!broadcast.isRead ? 'unread' : ''}`}
                    onClick={() => handleBroadcastClick(broadcast)}
                  >
                    <div className="broadcast-content-clean">
                      <div className="broadcast-title-row">
                        <span className="broadcast-title-clean">{broadcast.title}</span>
                        {!broadcast.isRead && <span className="unread-dot"></span>}
                      </div>
                      <p className="broadcast-description">
                        {broadcast.category === 'Operations' 
                          ? 'Updated store hours for upcoming holiday weekend. Please review and confirm your availability by Friday.'
                          : broadcast.category === 'Merchandising'
                          ? 'New planogram guidelines have been released. Review the updated shelf layouts for seasonal products.'
                          : 'New training module available for team members. Please confirm staffing assignments.'}
                      </p>
                      <div className="broadcast-meta-clean">
                        <span className="broadcast-sender">{broadcast.sender}</span>
                        <span className="broadcast-time-clean">{formatTimeAgo(broadcast.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

              {/* Rank & Change Stats */}
              <div className="dpi-rank-stats">
                <div className="dpi-rank-card">
                  <span className="dpi-rank-value">#{dpiData.rank}</span>
                  <span className="dpi-rank-label">of {dpiData.totalDistricts}</span>
                </div>
                <div className="dpi-change-card">
                  <div className={`dpi-change-value ${dpiData.change < 0 ? 'negative' : ''}`}>
                    <TrendingUp size={18} />
                    <span>+{dpiData.change}%</span>
                  </div>
                  <span className="dpi-change-label">{dpiData.changePeriod}</span>
                </div>
              </div>

              {/* Score Breakdown - Card Grid */}
              <div className="dpi-breakdown-header">
                <span className="breakdown-title">Score Breakdown</span>
              </div>
              <div className="dpi-breakdown-grid">
                <div className="breakdown-card">
                  <div className="breakdown-value">{dpiData.segments.sales}</div>
                  <div className="breakdown-label">Sales</div>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${dpiData.segments.sales}%` }}></div>
                  </div>
                </div>
                <div className="breakdown-card">
                  <div className="breakdown-value">{dpiData.segments.execution}</div>
                  <div className="breakdown-label">Execution</div>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${dpiData.segments.execution}%` }}></div>
                  </div>
                </div>
                <div className="breakdown-card">
                  <div className="breakdown-value">{dpiData.segments.voc}</div>
                  <div className="breakdown-label">VoC</div>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${dpiData.segments.voc}%` }}></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Archived Actions Section */}
          {archivedActions.length > 0 && (
            <div className="store-ops-section archived-section">
              <div className="archived-header">
                <div className="archived-title-row">
                  <Archive size={16} />
                  <h2>Completed Actions</h2>
                </div>
                <span className="archived-count">{archivedActions.length}</span>
              </div>
              <div className="archived-list">
                {archivedActions.slice(-5).reverse().map((action) => (
                  <div key={action.id} className={`archived-item type-${action.type}`}>
                    <div className={`archived-icon type-${action.type}`}>
                      {action.type === 'approved' && <Check size={12} />}
                      {action.type === 'rejected' && <X size={12} />}
                      {action.type === 'assigned' && <Users size={12} />}
                      {action.type === 'reorder' && <Package size={12} />}
                    </div>
                    <div className="archived-info">
                      <span className="archived-title">{action.title}</span>
                      <span className="archived-time">
                        {action.completedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <button className="broadcast-btn-secondary" onClick={() => handleOpenChat('1')}>
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

      {/* View Stores Modal */}
      {showViewStoresModal && !showNotificationSent && (
        <div className="action-modal-overlay" onClick={() => {
          setShowViewStoresModal(false);
          setSelectedStores([]);
        }}>
          <div className="action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <Store size={20} />
                <h2>Impacted Stores</h2>
              </div>
              <button className="action-modal-close" onClick={() => {
                setShowViewStoresModal(false);
                setSelectedStores([]);
              }}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <div className="subtitle-row">
                <span>{impactedStores.length} stores require attention for Product Recall</span>
                <button 
                  className="select-all-btn"
                  onClick={() => {
                    if (selectedStores.length === impactedStores.length) {
                      setSelectedStores([]);
                    } else {
                      setSelectedStores(impactedStores.map(s => s.id));
                    }
                  }}
                >
                  {selectedStores.length === impactedStores.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            <div className="action-modal-content">
              <div className="stores-list">
                {impactedStores.map((store) => (
                  <div 
                    key={store.id} 
                    className={`store-card status-${store.status} ${selectedStores.includes(store.id) ? 'selected' : ''}`}
                    onClick={() => {
                      if (selectedStores.includes(store.id)) {
                        setSelectedStores(prev => prev.filter(id => id !== store.id));
                      } else {
                        setSelectedStores(prev => [...prev, store.id]);
                      }
                    }}
                  >
                    <div className="store-checkbox">
                      <div className={`checkbox ${selectedStores.includes(store.id) ? 'checked' : ''}`}>
                        {selectedStores.includes(store.id) && <Check size={12} />}
                      </div>
                    </div>
                    <div className="store-card-main">
                      <div className="store-card-header">
                        <div className="store-info">
                          <h4>{store.name}</h4>
                          <span className={`store-status-badge ${store.status}`}>
                            {store.status === 'critical' ? 'Critical' : 'Warning'}
                          </span>
                        </div>
                        <div className="store-sku-count">{store.skuCount} SKUs affected</div>
                      </div>
                      <div className="store-card-details">
                        <div className="store-detail">
                          <MapPin size={14} />
                          <span>{store.address}</span>
                        </div>
                        <div className="store-detail">
                          <Users size={14} />
                          <span>{store.manager}</span>
                        </div>
                        <div className="store-detail">
                          <Phone size={14} />
                          <span>{store.phone}</span>
                        </div>
                      </div>
                      <div className="store-card-actions">
                        <button className="store-action-btn" onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Calling ${store.manager}...`);
                        }}>
                          <Phone size={14} />
                          Call
                        </button>
                        <button className="store-action-btn" onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Email sent to ${store.manager}`);
                        }}>
                          <Mail size={14} />
                          Email
                        </button>
                        <button className="store-action-btn primary" onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Opening ${store.name} details...`);
                        }}>
                          <ExternalLink size={14} />
                          View Store
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => {
                setShowViewStoresModal(false);
                setSelectedStores([]);
              }}>
                Close
              </button>
              <button 
                className="modal-btn primary" 
                disabled={selectedStores.length === 0}
                onClick={() => {
                  const stores = impactedStores.filter(s => selectedStores.includes(s.id));
                  setNotifiedStores(stores);
                  setShowNotificationSent(true);
                }}
              >
                <Send size={16} />
                {selectedStores.length === 0 
                  ? 'Select Stores to Notify' 
                  : selectedStores.length === impactedStores.length 
                    ? 'Notify All Stores' 
                    : `Notify ${selectedStores.length} Store${selectedStores.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Sent Confirmation */}
      {showNotificationSent && (
        <div className="action-modal-overlay" onClick={() => {
          setShowNotificationSent(false);
          setShowViewStoresModal(false);
          setSelectedStores([]);
          setNotifiedStores([]);
        }}>
          <div className="action-modal notification-sent" onClick={(e) => e.stopPropagation()}>
            <div className="notification-sent-content">
              <div className="notification-sent-icon">
                <CheckCircle2 size={48} />
              </div>
              <h2>Notifications Sent Successfully!</h2>
              <p>Alert messages have been delivered to the following store managers:</p>
              
              <div className="notified-stores-list">
                {notifiedStores.map((store) => (
                  <div key={store.id} className="notified-store-item">
                    <div className="notified-store-avatar">
                      {store.manager.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="notified-store-info">
                      <span className="notified-store-name">{store.manager}</span>
                      <span className="notified-store-location">{store.name}</span>
                    </div>
                    <div className="notified-store-status">
                      <Check size={14} />
                      <span>Sent</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notification-message-preview">
                <div className="message-preview-header">
                  <Bell size={14} />
                  <span>Message Preview</span>
                </div>
                <div className="message-preview-content">
                  <strong>🚨 URGENT: Product Recall Alert</strong>
                  <p>SKU #12345 must be removed from shelves immediately. FDA safety alert issued. Please confirm action completion within 2 hours.</p>
                </div>
              </div>

              <button 
                className="modal-btn primary full-width"
                onClick={() => {
                  setShowNotificationSent(false);
                  setShowViewStoresModal(false);
                  setSelectedStores([]);
                  setNotifiedStores([]);
                  showToast('✓ All notifications delivered');
                }}
              >
                <Check size={16} />
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="action-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <UserPlus size={20} />
                <h2>Assign Task</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowAssignModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <span>Select a team member to handle this task</span>
            </div>
            <div className="action-modal-content">
              <div className="assign-search">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search team members..."
                  value={assignSearchQuery}
                  onChange={(e) => setAssignSearchQuery(e.target.value)}
                />
              </div>
              <div className="team-members-list">
                {teamMembers
                  .filter(m => m.name.toLowerCase().includes(assignSearchQuery.toLowerCase()) ||
                              m.role.toLowerCase().includes(assignSearchQuery.toLowerCase()))
                  .map((member) => (
                  <div 
                    key={member.id} 
                    className={`team-member-card ${selectedAssignee === member.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAssignee(member.id)}
                  >
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-info">
                      <h4>{member.name}</h4>
                      <span className="member-role">{member.role}</span>
                      <span className="member-store">{member.store}</span>
                    </div>
                    {selectedAssignee === member.id && (
                      <div className="member-selected">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => {
                setShowAssignModal(false);
                setSelectedAssignee(null);
                setAssignSearchQuery('');
              }}>
                Cancel
              </button>
              <button 
                className="modal-btn primary" 
                disabled={!selectedAssignee}
                onClick={handleAssignSubmit}
              >
                <Send size={16} />
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SKU Review Modal */}
      {showSkuReviewModal && !showReorderSent && (
        <div className="action-modal-overlay" onClick={() => {
          setShowSkuReviewModal(false);
          setSelectedSkus([]);
        }}>
          <div className="action-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <Package size={20} />
                <h2>SKUs at Risk</h2>
              </div>
              <button className="action-modal-close" onClick={() => {
                setShowSkuReviewModal(false);
                setSelectedSkus([]);
              }}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <div className="subtitle-row">
                <span>{atRiskSkus.length} SKUs below safety stock levels</span>
                <button 
                  className="select-all-btn"
                  onClick={() => {
                    if (selectedSkus.length === atRiskSkus.length) {
                      setSelectedSkus([]);
                    } else {
                      setSelectedSkus(atRiskSkus.map(s => s.sku));
                    }
                  }}
                >
                  {selectedSkus.length === atRiskSkus.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            <div className="action-modal-content">
              <div className="sku-table">
                <div className="sku-table-header with-checkbox">
                  <span></span>
                  <span>SKU</span>
                  <span>Product</span>
                  <span>Current</span>
                  <span>Safety</span>
                  <span>Reorder Qty</span>
                  <span>Supplier</span>
                  <span>Lead Time</span>
                </div>
                {atRiskSkus.map((sku) => (
                  <div 
                    key={sku.sku} 
                    className={`sku-table-row with-checkbox ${selectedSkus.includes(sku.sku) ? 'selected' : ''}`}
                    onClick={() => {
                      if (selectedSkus.includes(sku.sku)) {
                        setSelectedSkus(prev => prev.filter(s => s !== sku.sku));
                      } else {
                        setSelectedSkus(prev => [...prev, sku.sku]);
                      }
                    }}
                  >
                    <div className="sku-checkbox">
                      <div className={`checkbox ${selectedSkus.includes(sku.sku) ? 'checked' : ''}`}>
                        {selectedSkus.includes(sku.sku) && <Check size={12} />}
                      </div>
                    </div>
                    <span className="sku-id">{sku.sku}</span>
                    <span className="sku-name">{sku.name}</span>
                    <span className={`sku-stock ${sku.currentStock < sku.safetyStock * 0.3 ? 'critical' : 'warning'}`}>
                      {sku.currentStock}
                    </span>
                    <span className="sku-safety">{sku.safetyStock}</span>
                    <span className="sku-reorder">{sku.reorderQty}</span>
                    <span className="sku-supplier">{sku.supplier}</span>
                    <span className="sku-lead">{sku.leadTime}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => {
                showToast('Report downloaded');
              }}>
                <Download size={16} />
                Export Report
              </button>
              <button 
                className="modal-btn primary" 
                disabled={selectedSkus.length === 0}
                onClick={selectedSkus.length === atRiskSkus.length ? handleReorderAll : handleSendReorderAction}
              >
                <Send size={16} />
                {selectedSkus.length === 0 
                  ? 'Select SKUs to Reorder' 
                  : selectedSkus.length === atRiskSkus.length 
                    ? `Send Reorder Action (All ${atRiskSkus.length})` 
                    : `Send Reorder Action (${selectedSkus.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reorder Sent Confirmation */}
      {showReorderSent && (
        <div className="action-modal-overlay" onClick={() => {
          setShowReorderSent(false);
          setShowSkuReviewModal(false);
          setSelectedSkus([]);
          setReorderedSkus([]);
        }}>
          <div className="action-modal notification-sent" onClick={(e) => e.stopPropagation()}>
            <div className="notification-sent-content">
              <div className="notification-sent-icon">
                <CheckCircle2 size={48} />
              </div>
              <h2>Reorder Action Sent!</h2>
              <p>Reorder requests have been sent to store owners for the following SKUs:</p>
              
              <div className="reordered-skus-list">
                {reorderedSkus.map((sku) => (
                  <div key={sku.sku} className="reordered-sku-item">
                    <div className="reordered-sku-icon">
                      <Package size={16} />
                    </div>
                    <div className="reordered-sku-info">
                      <span className="reordered-sku-name">{sku.name}</span>
                      <span className="reordered-sku-details">{sku.sku} • Qty: {sku.reorderQty} • {sku.supplier}</span>
                    </div>
                    <div className="reordered-sku-status">
                      <Check size={14} />
                      <span>Sent</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notification-message-preview">
                <div className="message-preview-header">
                  <Bell size={14} />
                  <span>Action Sent to Store Owners</span>
                </div>
                <div className="message-preview-content">
                  <strong>📦 Inventory Reorder Required</strong>
                  <p>{reorderedSkus.length} SKU{reorderedSkus.length > 1 ? 's' : ''} below safety stock. Please review and confirm reorder quantities with suppliers. Expected lead time: 1-3 days.</p>
                </div>
              </div>

              <button 
                className="modal-btn primary full-width"
                onClick={() => {
                  // Archive the reorder action
                  setArchivedActions(prev => [...prev, {
                    id: `reorder-${Date.now()}`,
                    title: `Reorder action sent for ${reorderedSkus.length} SKUs`,
                    completedAt: new Date(),
                    type: 'reorder'
                  }]);
                  setShowReorderSent(false);
                  setShowSkuReviewModal(false);
                  setSelectedSkus([]);
                  setReorderedSkus([]);
                  showToast('✓ Reorder actions delivered to store owners');
                }}
              >
                <Check size={16} />
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Approval Modal */}
      {showActionApprovalModal && selectedActionItem && (
        <div className="action-modal-overlay" onClick={() => setShowActionApprovalModal(false)}>
          <div className="action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <ClipboardCheck size={20} />
                <h2>{selectedActionItem.cta}</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowActionApprovalModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-content">
              <div className="approval-details">
                <div className="approval-header">
                  <h3>{selectedActionItem.title}</h3>
                  <span className={`severity-tag ${selectedActionItem.severity}`}>
                    {selectedActionItem.severity.toUpperCase()}
                  </span>
                </div>
                {selectedActionItem.impact && (
                  <div className="approval-impact">
                    <AlertCircle size={16} />
                    <span>{selectedActionItem.impact}</span>
                  </div>
                )}
                <div className="approval-meta">
                  <div className="meta-row">
                    <span className="meta-label">Source</span>
                    <span className="meta-value">{selectedActionItem.source_module}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Context</span>
                    <span className="meta-value">{selectedActionItem.context}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Due</span>
                    <span className={`meta-value ${selectedActionItem.status === 'overdue' ? 'overdue' : ''}`}>
                      {formatDueTime(selectedActionItem.due_time)}
                    </span>
                  </div>
                </div>
                <div className="approval-note">
                  <label>Add a note (optional)</label>
                  <textarea placeholder="Enter any comments or instructions..."></textarea>
                </div>
              </div>
            </div>
            <div className="action-modal-footer">
              <button className="modal-btn reject" onClick={handleRejectAction}>
                <X size={16} />
                Send Back
              </button>
              <button className="modal-btn primary" onClick={handleApproveAction}>
                <Check size={16} />
                {selectedActionItem.cta}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Performers Modal */}
      {showTopPerformersModal && (
        <div className="action-modal-overlay" onClick={() => setShowTopPerformersModal(false)}>
          <div className="action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <TrendingUp size={20} />
                <h2>Top Performers</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowTopPerformersModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <span>Stores exceeding sales targets this period</span>
            </div>
            <div className="action-modal-content">
              <div className="performers-list">
                {topPerformers.map((performer) => (
                  <div key={performer.rank} className="performer-card">
                    <div className={`performer-rank rank-${performer.rank}`}>
                      #{performer.rank}
                    </div>
                    <div className="performer-info">
                      <h4>{performer.store}</h4>
                      <span className="performer-manager">{performer.manager}</span>
                    </div>
                    <div className="performer-stats">
                      <div className="performer-stat">
                        <span className="stat-value positive">{performer.sales}</span>
                        <span className="stat-label">vs Target</span>
                      </div>
                      <div className="performer-stat">
                        <span className="stat-value">{performer.target}</span>
                        <span className="stat-label">Achievement</span>
                      </div>
                    </div>
                    <div className={`performer-trend ${performer.trend}`}>
                      {performer.trend === 'up' ? <TrendingUp size={16} /> : <Minus size={16} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowTopPerformersModal(false)}>
                Close
              </button>
              <button className="modal-btn primary" onClick={() => {
                showToast('✓ Performance report exported successfully');
                setShowTopPerformersModal(false);
              }}>
                <Download size={16} />
                Export Full Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regional Breakdown Modal */}
      {showRegionalModal && (
        <div className="action-modal-overlay" onClick={() => setShowRegionalModal(false)}>
          <div className="action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <MapPin size={20} />
                <h2>Regional Breakdown</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowRegionalModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <span>Customer Satisfaction (NPS) by Region</span>
            </div>
            <div className="action-modal-content">
              <div className="regional-list">
                {regionalData.map((region) => (
                  <div key={region.region} className="regional-card">
                    <div className="regional-header">
                      <h4>{region.region} Region</h4>
                      <span className="regional-stores">{region.stores} stores</span>
                    </div>
                    <div className="regional-stats">
                      <div className="regional-nps">
                        <span className="nps-value">{region.nps}</span>
                        <span className="nps-label">NPS Score</span>
                      </div>
                      <div className={`regional-change ${region.change >= 0 ? 'positive' : 'negative'}`}>
                        {region.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{region.change >= 0 ? '+' : ''}{region.change} pts</span>
                      </div>
                    </div>
                    <div className="regional-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${region.nps}%` }}></div>
                      </div>
                    </div>
                    <div className="regional-top">
                      <Store size={12} />
                      <span>Top: {region.topStore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowRegionalModal(false)}>
                Close
              </button>
              <button className="modal-btn primary" onClick={() => {
                showToast('Opening regional analytics...');
                setShowRegionalModal(false);
              }}>
                <BarChart3 size={16} />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Planogram Modal */}
      {showPlanogramModal && selectedPlanogramItem && (
        <div className="action-modal-overlay" onClick={() => setShowPlanogramModal(false)}>
          <div className="planogram-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <Package size={20} />
                <h2>{selectedPlanogramItem.title}</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowPlanogramModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <span>{selectedPlanogramItem.context} • {selectedPlanogramItem.microContext}</span>
            </div>
            
            <div className="planogram-modal-content">
              {/* Planogram Image */}
              <div className="planogram-image-section">
                <h4>Planogram Preview</h4>
                <div className="planogram-image-container">
                  <img 
                    src={selectedPlanogramItem.planogramImage} 
                    alt="Planogram" 
                    className="planogram-image"
                  />
                </div>
              </div>
              
              {/* Action Items from Planogram */}
              <div className="planogram-actions-section">
                <div className="planogram-actions-header">
                  <h4>Action Items</h4>
                  <span className="actions-count">{selectedPlanogramItem.planogramActions?.length || 0} tasks to assign</span>
                </div>
                <p className="planogram-actions-desc">Select assignee for each action item to create tasks</p>
                
                <div className="planogram-actions-list">
                  {selectedPlanogramItem.planogramActions?.map((action) => (
                    <div key={action.id} className={`planogram-action-item priority-${action.priority}`}>
                      <div className="planogram-action-content">
                        <div className="planogram-action-header">
                          <span className={`action-priority-badge ${action.priority}`}>
                            {action.priority.toUpperCase()}
                          </span>
                          <span className="action-section-badge">{action.section}</span>
                        </div>
                        <p className="planogram-action-desc">{action.description}</p>
                      </div>
                      <div className="planogram-action-assign">
                        <select 
                          value={planogramActionAssignments[action.id] || ''}
                          onChange={(e) => handleAssignPlanogramAction(action.id, e.target.value)}
                          className="assign-select"
                        >
                          <option value="">Select assignee...</option>
                          <option value="self">Assign to myself</option>
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name} ({member.role})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowPlanogramModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn primary"
                disabled={Object.keys(planogramActionAssignments).length === 0}
                onClick={handleCreateActionItems}
              >
                <Check size={16} />
                Create {Object.keys(planogramActionAssignments).length} Action Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventoryModal && selectedInventoryItem && (
        <div className="action-modal-overlay" onClick={() => setShowInventoryModal(false)}>
          <div className="context-modal inventory-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <Package size={20} />
                <h2>{selectedInventoryItem.title}</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowInventoryModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="context-modal-subtitle">
              <span>{selectedInventoryItem.context} • {selectedInventoryItem.microContext}</span>
            </div>
            
            <div className="context-modal-content">
              
              <div className="inventory-list">
                <div className="list-header">
                  <span>Select SKUs to reorder</span>
                  <button 
                    className="select-all-btn"
                    onClick={() => setSelectedSkusForReorder(
                      selectedSkusForReorder.length === selectedInventoryItem.inventoryItems?.length 
                        ? [] 
                        : selectedInventoryItem.inventoryItems?.map(i => i.id) || []
                    )}
                  >
                    {selectedSkusForReorder.length === selectedInventoryItem.inventoryItems?.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                {selectedInventoryItem.inventoryItems?.map((item) => (
                  <div key={item.id} className={`inventory-item priority-${item.priority}`}>
                    <label className="inventory-checkbox">
                      <input 
                        type="checkbox"
                        checked={selectedSkusForReorder.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkusForReorder(prev => [...prev, item.id]);
                          } else {
                            setSelectedSkusForReorder(prev => prev.filter(id => id !== item.id));
                          }
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <div className="inventory-item-info">
                      <div className="item-header">
                        <span className="item-sku">{item.sku}</span>
                        <span className={`priority-badge ${item.priority}`}>{item.priority.toUpperCase()}</span>
                      </div>
                      <span className="item-name">{item.name}</span>
                      <span className="item-supplier">Supplier: {item.supplier}</span>
                    </div>
                    <div className="inventory-item-stock">
                      <div className="stock-bar">
                        <div className="stock-fill" style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}></div>
                      </div>
                      <span className="stock-text">{item.currentStock} / {item.minStock} min</span>
                    </div>
                    <div className="inventory-item-reorder">
                      <span className="reorder-qty">+{item.reorderQty} units</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowInventoryModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn primary"
                disabled={selectedSkusForReorder.length === 0}
                onClick={() => {
                  showToast(`✓ Reorder placed for ${selectedSkusForReorder.length} SKUs`);
                  setShowInventoryModal(false);
                }}
              >
                <ShoppingCart size={16} />
                Reorder {selectedSkusForReorder.length} SKUs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Modal */}
      {showChecklistModal && selectedChecklistItem && (
        <div className="action-modal-overlay" onClick={() => setShowChecklistModal(false)}>
          <div className="context-modal checklist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <ClipboardCheck size={20} />
                <h2>{selectedChecklistItem.title}</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowChecklistModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <span>{selectedChecklistItem.context} • {selectedChecklistItem.impact}</span>
            </div>
            
            <div className="context-modal-content">
              <div className="checklist-progress-bar">
                <div className="progress-fill" style={{ 
                  width: `${(Object.values(checklistProgress).filter(s => s === 'completed').length / (selectedChecklistItem.checklistItems?.length || 1)) * 100}%` 
                }}></div>
              </div>
              <div className="checklist-progress-text">
                {Object.values(checklistProgress).filter(s => s === 'completed').length} of {selectedChecklistItem.checklistItems?.length} completed
              </div>
              
              <div className="checklist-categories">
                {Array.from(new Set(selectedChecklistItem.checklistItems?.map(i => i.category))).map(category => (
                  <div key={category} className="checklist-category">
                    <h4 className="category-title">{category}</h4>
                    <div className="category-items">
                      {selectedChecklistItem.checklistItems?.filter(i => i.category === category).map(item => (
                        <div key={item.id} className={`checklist-item ${checklistProgress[item.id] || 'pending'}`}>
                          <div className="checklist-item-content">
                            <span className="item-text">{item.item}</span>
                          </div>
                          <div className="checklist-item-actions">
                            <button 
                              className={`check-btn pass ${checklistProgress[item.id] === 'completed' ? 'active' : ''}`}
                              onClick={() => setChecklistProgress(prev => ({ ...prev, [item.id]: 'completed' }))}
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              className={`check-btn fail ${checklistProgress[item.id] === 'failed' ? 'active' : ''}`}
                              onClick={() => setChecklistProgress(prev => ({ ...prev, [item.id]: 'failed' }))}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowChecklistModal(false)}>
                Save Draft
              </button>
              <button 
                className="modal-btn primary"
                disabled={Object.keys(checklistProgress).length !== selectedChecklistItem.checklistItems?.length}
                onClick={() => {
                  const failed = Object.values(checklistProgress).filter(s => s === 'failed').length;
                  if (failed > 0) {
                    showToast(`⚠️ Checklist submitted with ${failed} failed items`);
                  } else {
                    showToast('✓ Safety checklist completed successfully');
                  }
                  setShowChecklistModal(false);
                }}
              >
                <ClipboardCheck size={16} />
                Submit Checklist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Modal */}
      {showShipmentModal && selectedShipmentItem && (
        <div className="action-modal-overlay" onClick={() => setShowShipmentModal(false)}>
          <div className="context-modal shipment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <Truck size={20} />
                <h2>{selectedShipmentItem.title}</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowShipmentModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <span>{selectedShipmentItem.context} • {selectedShipmentItem.microContext}</span>
            </div>
            
            <div className="context-modal-content">
              <div className="shipment-details-card">
                <div className="shipment-detail">
                  <span className="detail-label">Shipment ID</span>
                  <span className="detail-value">{selectedShipmentItem.shipmentDetails?.shipmentId}</span>
                </div>
                <div className="shipment-detail">
                  <span className="detail-label">Carrier</span>
                  <span className="detail-value">{selectedShipmentItem.shipmentDetails?.carrier}</span>
                </div>
                <div className="shipment-detail">
                  <span className="detail-label">PO Number</span>
                  <span className="detail-value">{selectedShipmentItem.shipmentDetails?.poNumber}</span>
                </div>
                <div className="shipment-detail">
                  <span className="detail-label">Total Value</span>
                  <span className="detail-value">${selectedShipmentItem.shipmentDetails?.totalValue.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="shipment-items-list">
                <div className="list-header">
                  <span>Validate received items</span>
                  <span className="variance-legend">
                    <span className="legend-item complete">✓ Complete</span>
                    <span className="legend-item short">↓ Short</span>
                    <span className="legend-item over">↑ Over</span>
                  </span>
                </div>
                {selectedShipmentItem.shipmentItems?.map((item) => (
                  <div key={item.id} className={`shipment-item status-${item.status}`}>
                    <div className="shipment-item-info">
                      <span className="item-sku">{item.sku}</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <div className="shipment-item-qty">
                      <span className="qty-ordered">Ordered: {item.ordered}</span>
                      <span className="qty-received">Received: {item.received}</span>
                      {item.variance && (
                        <span className={`qty-variance ${item.variance > 0 ? 'over' : 'short'}`}>
                          {item.variance > 0 ? '+' : ''}{item.variance}
                        </span>
                      )}
                    </div>
                    <div className="shipment-item-validate">
                      <label className="validate-checkbox">
                        <input 
                          type="checkbox"
                          checked={shipmentValidations[item.id] || false}
                          onChange={(e) => setShipmentValidations(prev => ({ ...prev, [item.id]: e.target.checked }))}
                        />
                        <span className="checkmark"></span>
                        <span>Verified</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowShipmentModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn primary"
                disabled={Object.keys(shipmentValidations).length !== selectedShipmentItem.shipmentItems?.length}
                onClick={() => {
                  showToast('✓ Shipment validated and received');
                  setShowShipmentModal(false);
                }}
              >
                <Check size={16} />
                Validate Shipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VoC Escalation Modal */}
      {showVoCModal && selectedVoCItem && (
        <div className="action-modal-overlay" onClick={() => setShowVoCModal(false)}>
          <div className="context-modal voc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="action-modal-header">
              <div className="action-modal-title-row">
                <MessageCircle size={20} />
                <h2>{selectedVoCItem.title}</h2>
              </div>
              <button className="action-modal-close" onClick={() => setShowVoCModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="action-modal-subtitle">
              <span>{selectedVoCItem.context} • {selectedVoCItem.microContext}</span>
            </div>
            
            <div className="context-modal-content voc-split">
              <div className="escalations-list">
                <h4>Customer Escalations</h4>
                {selectedVoCItem.escalations?.map((esc) => (
                  <div 
                    key={esc.id} 
                    className={`escalation-card ${selectedEscalation?.id === esc.id ? 'selected' : ''} sentiment-${esc.sentiment}`}
                    onClick={() => setSelectedEscalation(esc)}
                  >
                    <div className="escalation-header">
                      <span className="customer-name">{esc.customerName}</span>
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={12} className={star <= esc.rating ? 'filled' : ''} />
                        ))}
                      </div>
                    </div>
                    <span className="escalation-category">{esc.category}</span>
                    <p className="escalation-summary">{esc.summary}</p>
                    <span className="escalation-time">{formatTimeAgo(esc.date)}</span>
                  </div>
                ))}
              </div>
              
              <div className="escalation-detail">
                {selectedEscalation ? (
                  <>
                    <div className="detail-header">
                      <h4>{selectedEscalation.customerName}</h4>
                      <span className={`sentiment-badge ${selectedEscalation.sentiment}`}>
                        {selectedEscalation.sentiment.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="detail-meta">
                      <span className="meta-item">{selectedEscalation.category}</span>
                      <span className="meta-item">{formatTimeAgo(selectedEscalation.date)}</span>
                    </div>
                    <div className="detail-content">
                      <h5>Customer Feedback</h5>
                      <p>{selectedEscalation.details}</p>
                    </div>
                    <div className="response-section">
                      <h5>Your Response</h5>
                      <textarea 
                        placeholder="Type your response to the customer..."
                        value={escalationResponse}
                        onChange={(e) => setEscalationResponse(e.target.value)}
                        rows={4}
                      />
                      <div className="response-actions">
                        <button 
                          className="modal-btn primary"
                          disabled={!escalationResponse.trim()}
                          onClick={() => {
                            showToast('✓ Response sent to customer');
                            setSelectedEscalation(null);
                            setEscalationResponse('');
                          }}
                        >
                          <Send size={14} />
                          Send Response
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="no-selection">
                    <MessageCircle size={32} />
                    <p>Select an escalation to view details and respond</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="action-modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowVoCModal(false)}>
                Close
              </button>
              <button 
                className="modal-btn primary"
                onClick={() => {
                  showToast('✓ All escalations reviewed');
                  setShowVoCModal(false);
                }}
              >
                <Check size={16} />
                Mark All Reviewed
              </button>
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

      {/* Floating Chat Window */}
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
                setSelectedIncomingBroadcast(null);
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
                      onClick={handleSendBroadcast}
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
                  {teamMembers.map((member) => {
                    const lastMsg = getLastMessage(member.id);
                    return (
                      <div 
                        key={member.id} 
                        className="chat-contact-item"
                        onClick={() => setSelectedChatContact(member.id)}
                      >
                        <div className="chat-contact-avatar">{member.avatar}</div>
                        <div className="chat-contact-info">
                          <span className="chat-contact-name">{member.name}</span>
                          <span className="chat-contact-role">{member.role}</span>
                          {lastMsg && (
                            <span className="chat-contact-preview">
                              {lastMsg.type === 'broadcast' && <Bell size={10} />}
                              {lastMsg.isOutgoing ? 'You: ' : ''}{lastMsg.text.substring(0, 25)}...
                            </span>
                          )}
                        </div>
                      {lastMsg && (
                        <span className="chat-contact-time">
                          {lastMsg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  );
                })}
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
                  {getContactMessages(selectedChatContact).map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`chat-message ${msg.isOutgoing ? 'outgoing' : 'incoming'} ${msg.type === 'broadcast' ? 'broadcast' : ''}`}
                    >
                      {msg.type === 'broadcast' && (
                        <div className="message-broadcast-tag">
                          <Bell size={10} />
                          Broadcast
                          {msg.recipients && msg.recipients.length > 1 && (
                            <span className="broadcast-recipient-count">to {msg.recipients.length} people</span>
                          )}
                        </div>
                      )}
                      <p>{msg.text}</p>
                      <span className="message-time">
                        {msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="chat-input-area">
                  <input 
                    type="text"
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  />
                  <button 
                    className="chat-send-btn"
                    onClick={handleSendChatMessage}
                    disabled={!chatMessage.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
            </div>

            {/* Right Panel - Incoming Broadcasts (only in expanded view) */}
            {chatExpanded && (
              <div className="chat-right-panel">
                <div className="incoming-broadcasts-header">
                  <Bell size={16} />
                  <h4>Incoming Broadcasts</h4>
                </div>
                <div className="incoming-broadcasts-list">
                  {!selectedIncomingBroadcast ? (
                    incomingBroadcasts.map((broadcast) => (
                      <div 
                        key={broadcast.id} 
                        className={`incoming-broadcast-card priority-${broadcast.priority}`}
                        onClick={() => setSelectedIncomingBroadcast(broadcast)}
                      >
                        <div className="broadcast-card-header">
                          <div className="broadcast-sender-avatar">{broadcast.senderAvatar}</div>
                          <div className="broadcast-sender-info">
                            <span className="broadcast-sender-name">{broadcast.sender}</span>
                            <span className="broadcast-category">{broadcast.category}</span>
                          </div>
                          <span className={`broadcast-priority-badge ${broadcast.priority}`}>
                            {broadcast.priority.toUpperCase()}
                          </span>
                        </div>
                        <h5 className="broadcast-card-title">{broadcast.title}</h5>
                        <p className="broadcast-card-preview">{broadcast.message.substring(0, 80)}...</p>
                        <span className="broadcast-card-time">
                          {formatTimeAgo(broadcast.timestamp.toISOString())}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="incoming-broadcast-detail">
                      <button 
                        className="chat-back-btn"
                        onClick={() => setSelectedIncomingBroadcast(null)}
                      >
                        <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                        <span>Back to all</span>
                      </button>
                      <div className="broadcast-detail-header">
                        <div className="broadcast-sender-avatar large">{selectedIncomingBroadcast.senderAvatar}</div>
                        <div className="broadcast-detail-meta">
                          <span className="broadcast-sender-name">{selectedIncomingBroadcast.sender}</span>
                          <div className="broadcast-detail-badges">
                            <span className={`broadcast-priority-badge ${selectedIncomingBroadcast.priority}`}>
                              {selectedIncomingBroadcast.priority.toUpperCase()}
                            </span>
                            <span className="broadcast-category-badge">{selectedIncomingBroadcast.category}</span>
                          </div>
                        </div>
                      </div>
                      <h4 className="broadcast-detail-title">{selectedIncomingBroadcast.title}</h4>
                      <p className="broadcast-detail-message">{selectedIncomingBroadcast.message}</p>
                      <div className="broadcast-detail-footer">
                        <span className="broadcast-detail-time">
                          <Clock size={14} />
                          {formatTimeAgo(selectedIncomingBroadcast.timestamp.toISOString())}
                        </span>
                        <button className="broadcast-acknowledge-btn" onClick={() => {
                          showToast('✓ Broadcast acknowledged');
                          setSelectedIncomingBroadcast(null);
                        }}>
                          <Check size={14} />
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default StoreOpsHome;
