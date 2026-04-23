import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  BarChart3,
  Image as ImageIcon,
  Zap,
  Send,
  Bot,
  User,
  FileText,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BookOpen,
  ClipboardList,
  ArrowUpRight,
  X,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Wrench,
  CheckCircle,
} from 'lucide-react';
import './AICopilot.css';

// ── Types ──
type SkillMode = 'knowledge' | 'analytics' | 'pog' | 'actions';

interface ComplianceAuditReport {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  planogramName: string;
  storeInfo: string;
  auditDate: string;
  categories: {
    name: string;
    score: number;
    maxScore: number;
    status: 'pass' | 'warning' | 'fail';
    findings: string[];
  }[];
  deviations: {
    item: string;
    expected: string;
    actual: string;
    severity: 'critical' | 'warning' | 'info';
    impact: string;
  }[];
  recommendations: string[];
  comparisonImages: {
    expected: string;
    actual: string;
  };
}

interface OosItem {
  name: string;
  shelf: string;
  position: string;
}

interface ProcessingStep {
  step: string;
  status: 'pending' | 'active' | 'completed';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  skill: SkillMode;
  // Rich content
  sources?: { doc: string; section: string; page: string }[];
  kpiCards?: { label: string; value: string; delta: string; direction: 'up' | 'down' }[];
  pogResults?: { status: 'pass' | 'fail'; item: string; detail: string }[];
  taskCreated?: { title: string; assignee: string; priority: string; due: string };
  isTyping?: boolean;
  imageUrl?: string;
  suggestedQueries?: string[];
  // ShelfIQ-style rich content
  complianceReport?: ComplianceAuditReport;
  oosItems?: OosItem[];
  oosImage?: string;
  processingSteps?: ProcessingStep[];
  isProcessing?: boolean;
}

// ── Mock Knowledge Base ──
const knowledgeResponses: Record<string, { answer: string; sources: { doc: string; section: string; page: string }[] }> = {
  'fire exit': {
    answer: 'Fire exit blockage must be cleared immediately and reported to store management within 15 minutes. If the blockage cannot be removed, the store manager must escalate to the Regional Safety Officer and initiate an emergency evacuation route assessment. All staff must be trained on fire exit protocols during quarterly safety drills.',
    sources: [
      { doc: 'Store Operations SOP', section: 'Section 4.2 — Fire Safety Protocols', page: 'Page 18' },
      { doc: 'Emergency Procedures Manual', section: 'Section 2.1 — Evacuation Routes', page: 'Page 7' },
    ],
  },
  'planogram notice': {
    answer: 'The notice period for planogram changes is 14 business days. Store managers must acknowledge receipt within 48 hours. New planograms must be fully implemented within 5 business days of the effective date. Any deviation requires written approval from the Category Manager.',
    sources: [
      { doc: 'Planogram Compliance SOP', section: 'Section 3.1 — Change Management', page: 'Page 12' },
      { doc: 'Visual Merchandising Standards', section: 'Section 1.4 — Implementation Timelines', page: 'Page 5' },
    ],
  },
  'product recall': {
    answer: 'Product recall steps:\n1. Immediately remove affected products from shelves and backroom\n2. Quarantine products in designated recall holding area\n3. Log all affected SKUs with batch numbers in the Recall Tracker system\n4. Notify the District Manager within 1 hour\n5. Place recall signage at the shelf location\n6. Process customer returns for affected items with full refund\n7. Complete recall verification checklist within 24 hours',
    sources: [
      { doc: 'Product Safety & Recall SOP', section: 'Section 6.1 — Recall Execution', page: 'Page 31' },
      { doc: 'Quality Assurance Manual', section: 'Section 8.3 — Product Withdrawal', page: 'Page 44' },
    ],
  },
  'safety audit': {
    answer: 'Safety audits must be conducted weekly by the designated Safety Champion. The audit covers 7 categories: fire safety, electrical safety, slip/trip hazards, chemical storage, emergency equipment, PPE compliance, and general housekeeping. A minimum score of 85% is required to pass. Failed audits trigger a mandatory corrective action plan within 48 hours.',
    sources: [
      { doc: 'Health & Safety Compliance Guide', section: 'Section 5.2 — Audit Schedule & Scoring', page: 'Page 22' },
    ],
  },
  'store opening': {
    answer: 'Store opening procedures:\n1. Arrive 30 minutes before opening time\n2. Disarm security system and log entry time\n3. Complete morning walkthrough checklist (lighting, temperature, cleanliness)\n4. Power on all POS terminals and verify connectivity\n5. Count and verify cash drawer floats\n6. Review overnight delivery receipts and prioritize stocking\n7. Brief team on daily targets and promotions\n8. Unlock customer entrances at scheduled opening time',
    sources: [
      { doc: 'Daily Operations Manual', section: 'Section 1.1 — Opening Procedures', page: 'Page 3' },
    ],
  },
};

// ── Mock Analytics Responses ──
const analyticsResponses: Record<string, { answer: string; kpiCards: { label: string; value: string; delta: string; direction: 'up' | 'down' }[] }> = {
  'sales down': {
    answer: 'Sales are down 3.2% this week across the district, primarily driven by 3 underperforming stores. The main factors are:\n\n• **Weekend foot traffic** dropped 12% due to local events competition\n• **Conversion rate** fell from 34% to 28% at Harbor View and Oak Street\n• **Average basket size** declined 8% — fewer promotional items in baskets\n\nRecommendation: Deploy targeted weekend promotions and staff Harbor View with additional floor associates during peak hours.',
    kpiCards: [
      { label: 'District Sales', value: '$1.26M', delta: '-3.2%', direction: 'down' },
      { label: 'Foot Traffic', value: '42.1K', delta: '-12%', direction: 'down' },
      { label: 'Conversion', value: '31.2%', delta: '-2.8pp', direction: 'down' },
      { label: 'Avg Basket', value: '$38.40', delta: '-8%', direction: 'down' },
    ],
  },
  'underperforming': {
    answer: 'Three stores are currently underperforming against their targets:\n\n1. **Maple Heights #9012** — DPI 58, Sales -12.4% vs plan. Multiple compliance categories below 40%. Safety and cleanliness are critical.\n\n2. **Pine Grove #5678** — DPI 65, Sales -9.2% vs plan. Safety audit failed 3 consecutive weeks. Staff turnover at 34%.\n\n3. **Oak Street #1234** — DPI 72, Sales -6.8% vs plan. Planogram compliance dropped below 60%. Staff availability issues during peak hours.\n\nAll three stores have escalated to the Escalation Command Center.',
    kpiCards: [
      { label: 'At-Risk Stores', value: '3', delta: '+1', direction: 'down' },
      { label: 'Avg DPI (Bottom 3)', value: '65', delta: '-8.4', direction: 'down' },
      { label: 'Sales Gap', value: '-$94K', delta: 'vs plan', direction: 'down' },
      { label: 'Escalations', value: '3', delta: 'active', direction: 'down' },
    ],
  },
  'best performing': {
    answer: 'Top performing stores this period:\n\n1. **Downtown Plaza #2034** — DPI 94, Sales +8.2% vs plan. Perfect cleanliness scores. VoC at 92%.\n\n2. **Riverside Mall #1876** — DPI 91, Sales +5.4% vs plan. Excellent product availability. Strong weekend conversion.\n\n3. **Central Station #3421** — DPI 85, Sales +2.1% vs plan. Consistent execution across all audit categories.\n\nKey success patterns: proactive planogram compliance, full weekend staffing, and rapid response to VoC alerts.',
    kpiCards: [
      { label: 'Excellence Stores', value: '3', delta: 'stable', direction: 'up' },
      { label: 'Avg DPI (Top 3)', value: '90', delta: '+2.1', direction: 'up' },
      { label: 'Sales Surplus', value: '+$132K', delta: 'vs plan', direction: 'up' },
      { label: 'Avg VoC', value: '88.7%', delta: '+3.2pp', direction: 'up' },
    ],
  },
  'voc trend': {
    answer: 'VoC (Voice of Customer) trends over the last 4 weeks:\n\n• **Overall satisfaction**: 82% → 79% (declining)\n• **Top complaint**: "Messy aisles" — 134 mentions, up 28%\n• **Second complaint**: "Product availability" — 76 mentions, up 15%\n• **Positive theme**: "Checkout speed" — improved at 5/8 stores\n\nThe decline is concentrated in Pine Grove and Maple Heights. Recommended action: Deploy targeted cleaning protocols and increase stock-check frequency at affected stores.',
    kpiCards: [
      { label: 'VoC Score', value: '79%', delta: '-3pp', direction: 'down' },
      { label: 'Top Issue', value: 'Cleanliness', delta: '+28%', direction: 'down' },
      { label: 'Positive Theme', value: 'Checkout', delta: 'improving', direction: 'up' },
      { label: 'Response Rate', value: '67%', delta: '+5%', direction: 'up' },
    ],
  },
};


// ── Skill Config ──
const skills: { id: SkillMode; label: string; icon: React.ReactNode; description: string; placeholder: string; suggestions: string[] }[] = [
  {
    id: 'knowledge',
    label: 'Knowledge',
    icon: <Brain size={16} />,
    description: 'Ask SOP & policy questions — get cited answers',
    placeholder: 'Ask about SOPs, policies, procedures...',
    suggestions: ['What are the fire exit blockage rules?', 'What is the planogram notice period?', 'What are the product recall steps?', 'How do safety audits work?'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 size={16} />,
    description: 'Ask performance questions — get KPI insights',
    placeholder: 'Ask about sales, performance, trends...',
    suggestions: ['Why are sales down this week?', 'Which stores are underperforming?', 'Show me the best performing stores', 'What are the VoC trends?'],
  },
  {
    id: 'pog',
    label: 'POG Audit',
    icon: <ImageIcon size={16} />,
    description: 'Upload shelf images — detect OOS, check compliance, or create tasks',
    placeholder: 'Upload a shelf image to detect OOS, check compliance, or create tasks',
    suggestions: ['Detect OOS items', 'Check compliance'],
  },
  {
    id: 'actions',
    label: 'Actions',
    icon: <Zap size={16} />,
    description: 'Create tasks & assignments via natural language',
    placeholder: 'Tell me what task to create...',
    suggestions: ['Create a restocking task for Aisle 5', 'Assign safety audit follow-up to John', 'Schedule planogram reset for next Monday', 'Create urgent task for fire exit clearance'],
  },
];

// ── Helper: match query to response ──
const findKnowledgeResponse = (query: string) => {
  const q = query.toLowerCase();
  for (const [key, val] of Object.entries(knowledgeResponses)) {
    if (q.includes(key)) return val;
  }
  return {
    answer: 'I found relevant information in the knowledge base:\n\nBased on current store operations policies, the standard procedure involves notifying the store manager, documenting the issue in the incident log, and following the escalation matrix if not resolved within the specified SLA. Please refer to the specific SOP section for detailed steps.',
    sources: [{ doc: 'General Store Operations SOP', section: 'Section 1.1 — General Procedures', page: 'Page 2' }],
  };
};

const findAnalyticsResponse = (query: string) => {
  const q = query.toLowerCase();
  for (const [key, val] of Object.entries(analyticsResponses)) {
    if (q.includes(key)) return val;
  }
  return {
    answer: 'Based on current district performance data:\n\n• District DPI averages 81.2, which is within the "Performing" tier\n• 5 of 8 stores are meeting or exceeding targets\n• Key opportunity areas: weekend conversion optimization and inventory availability\n\nWould you like me to drill deeper into any specific metric or store?',
    kpiCards: [
      { label: 'District DPI', value: '81.2', delta: '+0.8', direction: 'up' as const },
      { label: 'On-Target Stores', value: '5/8', delta: '62.5%', direction: 'up' as const },
    ],
  };
};

// ── Component ──
export const AICopilot: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<SkillMode>('knowledge');
  const [messages, setMessages] = useState<Record<SkillMode, ChatMessage[]>>({
    knowledge: [],
    analytics: [],
    pog: [],
    actions: [],
  });
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [pendingPogAction, setPendingPogAction] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMessages = messages[activeSkill];
  const currentSkill = skills.find(s => s.id === activeSkill)!;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeSkill]);

  const addMessage = (msg: ChatMessage) => {
    setMessages(prev => ({
      ...prev,
      [activeSkill]: [...prev[activeSkill], msg],
    }));
  };

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const simulateResponse = (userQuery: string) => {
    setIsProcessing(true);

    // Add typing indicator
    const typingId = generateId();
    const typingMsg: ChatMessage = {
      id: typingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      skill: activeSkill,
      isTyping: true,
    };
    setMessages(prev => ({
      ...prev,
      [activeSkill]: [...prev[activeSkill], typingMsg],
    }));

    setTimeout(() => {
      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev[activeSkill].filter(m => m.id !== typingId);
        let response: ChatMessage;

        if (activeSkill === 'knowledge') {
          const result = findKnowledgeResponse(userQuery);
          response = {
            id: generateId(),
            role: 'assistant',
            content: result.answer,
            timestamp: new Date(),
            skill: 'knowledge',
            sources: result.sources,
          };
        } else if (activeSkill === 'analytics') {
          const result = findAnalyticsResponse(userQuery);
          response = {
            id: generateId(),
            role: 'assistant',
            content: result.answer,
            timestamp: new Date(),
            skill: 'analytics',
            kpiCards: result.kpiCards,
          };
        } else if (activeSkill === 'pog') {
          // POG skill handled by simulatePogAgentic — should not reach here
          response = { id: generateId(), role: 'assistant', content: '', timestamp: new Date(), skill: 'pog' };
        } else {
          // Actions skill
          const taskTitle = userQuery.replace(/^(create|assign|schedule)\s+(a\s+)?/i, '').replace(/\s+task\s+/i, ' ');
          response = {
            id: generateId(),
            role: 'assistant',
            content: `Task created successfully and pushed to Operations Queue.`,
            timestamp: new Date(),
            skill: 'actions',
            taskCreated: {
              title: taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1),
              assignee: userQuery.toLowerCase().includes('john') ? 'John Martinez' : 'Store Manager',
              priority: userQuery.toLowerCase().includes('urgent') || userQuery.toLowerCase().includes('fire') ? 'Critical' : 'Medium',
              due: userQuery.toLowerCase().includes('monday') ? 'Next Monday' : userQuery.toLowerCase().includes('today') ? 'Today' : 'Tomorrow',
            },
            suggestedQueries: ['Create another task', 'View all active tasks', 'Assign to a different team member'],
          };
        }

        return { ...prev, [activeSkill]: [...filtered, response] };
      });

      setIsProcessing(false);
    }, 1500 + Math.random() * 1000);
  };

  const simulatePogAgentic = async (userQuery: string, userImage?: string) => {
    setIsProcessing(true);
    const q = userQuery.toLowerCase();
    const isOos = q.includes('oos') || q.includes('out of stock') || q.includes('detect oos');

    // Define processing steps based on type
    const steps: ProcessingStep[] = isOos ? [
      { step: 'Receiving shelf image...', status: 'active' },
      { step: 'AI Agent reviewing image...', status: 'pending' },
      { step: 'Scanning for empty shelf positions...', status: 'pending' },
      { step: 'Cross-referencing with store planogram...', status: 'pending' },
      { step: 'Identifying out-of-stock products...', status: 'pending' },
      { step: 'Generating OOS detection report...', status: 'pending' },
    ] : [
      { step: 'Receiving store shelf capture...', status: 'active' },
      { step: 'Loading reference planogram (C&A Accessories Endcap)...', status: 'pending' },
      { step: 'AI Vision analyzing product positions...', status: 'pending' },
      { step: 'Comparing facings and placement accuracy...', status: 'pending' },
      { step: 'Evaluating category adjacency rules...', status: 'pending' },
      { step: 'Checking price label alignment...', status: 'pending' },
      { step: 'Calculating compliance metrics...', status: 'pending' },
      { step: 'Generating audit report...', status: 'pending' },
    ];

    // Add processing message
    const processingId = generateId();
    const processingMsg: ChatMessage = {
      id: processingId,
      role: 'assistant',
      content: isOos ? 'Analyzing shelf for out-of-stock items...' : 'Running compliance audit...',
      timestamp: new Date(),
      skill: 'pog',
      isProcessing: true,
      processingSteps: [...steps],
    };
    setMessages(prev => ({ ...prev, pog: [...prev.pog, processingMsg] }));

    // Animate steps one by one
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 400));
      setMessages(prev => ({
        ...prev,
        pog: prev.pog.map(m =>
          m.id === processingId ? {
            ...m,
            processingSteps: m.processingSteps?.map((s, idx) => ({
              ...s,
              status: idx <= i ? 'completed' as const : idx === i + 1 ? 'active' as const : 'pending' as const,
            })),
          } : m
        ),
      }));
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Remove processing message and add result
    if (isOos) {
      const oosResult: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '🚨 **Critical Out-of-Stock Alert!**\n\nI detected **4 out-of-stock positions** requiring immediate replenishment:',
        timestamp: new Date(),
        skill: 'pog',
        oosImage: userImage || '/oos-case-1-detected.png',
        oosItems: [
          { name: 'V-Neck Basic Tee — White (M)', shelf: 'Section A', position: 'Rail 2, Position 3-4' },
          { name: 'Floral Print Dress — Navy (S)', shelf: 'Section B', position: 'Rail 1, Position 5-6' },
          { name: 'Slim Fit Denim — Dark Wash (L)', shelf: 'Section C', position: 'Rail 3, Position 1-2' },
          { name: 'Classic Fit Blouse — Cream (M)', shelf: 'Section A', position: 'Rail 1, Position 7-8' },
        ],
        suggestedQueries: ['Create replenishment task', 'Check backroom inventory', 'Schedule shelf restocking'],
      };
      setMessages(prev => ({ ...prev, pog: [...prev.pog.filter(m => m.id !== processingId), oosResult] }));
    } else {
      // Compliance report
      const report: ComplianceAuditReport = {
        overallScore: 76.4,
        grade: 'C',
        planogramName: 'C&A Accessories Endcap — Localized v2.1',
        storeInfo: 'Downtown Plaza #2034 — Urban Flagship Cluster',
        auditDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        categories: [
          { name: 'Product Placement Accuracy', score: 18, maxScore: 25, status: 'warning', findings: ['Scarves section shifted 2 positions left from planogram', 'Sunglasses display rotated incorrectly', 'Belt rack missing from designated hook position'] },
          { name: 'Facing Count Compliance', score: 15, maxScore: 20, status: 'warning', findings: ['Hair accessories: 4 facings vs. required 6 (-33%)', 'Jewelry display: 8 facings vs. required 10 (-20%)', 'Watch section: Compliant at 4 facings'] },
          { name: 'Category Adjacency', score: 20, maxScore: 20, status: 'pass', findings: ['All category groupings follow planogram sequence', 'Premium items correctly positioned at eye level', 'Impulse items properly placed near checkout zone'] },
          { name: 'Price Label Alignment', score: 12, maxScore: 15, status: 'warning', findings: ['3 missing price labels in jewelry section', '2 labels misaligned with product position', 'Promotional tags correctly displayed'] },
          { name: 'Fixture & Signage', score: 11.4, maxScore: 20, status: 'fail', findings: ['Header signage partially obscured', 'One shelf bracket needs replacement', 'Endcap topper missing promotional insert', 'LED strip lighting non-functional on shelf 2'] },
        ],
        deviations: [
          { item: 'Silk Scarves Collection', expected: 'Shelf 1, Position 1-4 (4 facings)', actual: 'Shelf 1, Position 3-6 (shifted right)', severity: 'warning', impact: 'Reduces visual flow, -5% category sales risk' },
          { item: 'Designer Sunglasses', expected: 'Shelf 2, Eye-level center', actual: 'Shelf 2, Left side (rotated 15°)', severity: 'critical', impact: 'Premium visibility reduced, -12% conversion risk' },
          { item: 'Leather Belt Display', expected: 'Hook Panel A, Position 1-8', actual: 'Missing from fixture', severity: 'critical', impact: 'Complete category gap, estimated $340/week lost sales' },
          { item: 'Hair Accessories Rack', expected: '6 facings minimum', actual: '4 facings displayed', severity: 'warning', impact: 'Reduced selection visibility, -8% category performance' },
          { item: 'Statement Jewelry', expected: 'Shelf 3, Positions 1-10', actual: 'Shelf 3, Positions 1-8 (2 short)', severity: 'warning', impact: 'Incomplete assortment display' },
          { item: 'Watch Display Case', expected: 'Locked case, 4 facings', actual: 'Compliant', severity: 'info', impact: 'No action required' },
        ],
        recommendations: [
          'IMMEDIATE: Reinstall leather belt display on Hook Panel A — Critical revenue impact',
          'HIGH: Reposition sunglasses to center eye-level per planogram — Premium category at risk',
          'HIGH: Add 2 facings to hair accessories rack — Stock from backroom',
          'MEDIUM: Realign scarves section 2 positions left to match planogram',
          'MEDIUM: Replace missing price labels in jewelry section (3 labels)',
          'LOW: Submit maintenance ticket for LED strip repair on shelf 2',
          'LOW: Request replacement shelf bracket from facilities',
        ],
        comparisonImages: {
          expected: '/localized-accessories-endcap.png',
          actual: userImage || '/compliance-usecase.png',
        },
      };

      const complianceResult: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '📋 **Compliance Audit Report Generated**',
        timestamp: new Date(),
        skill: 'pog',
        complianceReport: report,
        suggestedQueries: ['Create compliance reset task', 'View reference planogram', 'Re-audit after corrections'],
      };
      setMessages(prev => ({ ...prev, pog: [...prev.pog.filter(m => m.id !== processingId), complianceResult] }));
    }

    setIsProcessing(false);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text && !uploadedImage) return;
    if (isProcessing) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text || 'Audit this shelf image',
      timestamp: new Date(),
      skill: activeSkill,
      imageUrl: uploadedImage || undefined,
    };

    addMessage(userMsg);
    const currentImage = uploadedImage;
    setInputValue('');
    setUploadedImage(null);

    if (activeSkill === 'pog') {
      simulatePogAgentic(text || 'audit shelf', currentImage || undefined);
    } else {
      simulateResponse(text || 'audit shelf');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (query: string) => {
    // For POG skill — "Detect OOS items" and "Check compliance" should trigger image upload first
    if (activeSkill === 'pog' && (query === 'Detect OOS items' || query === 'Check compliance')) {
      setPendingPogAction(query);
      fileInputRef.current?.click();
      return;
    }

    setInputValue(query);
    setTimeout(() => {
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: query,
        timestamp: new Date(),
        skill: activeSkill,
      };
      addMessage(userMsg);
      setInputValue('');
      simulateResponse(query);
    }, 100);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageData = ev.target?.result as string;

        // If there's a pending POG action, auto-send with the image
        if (pendingPogAction) {
          const action = pendingPogAction;
          setPendingPogAction(null);
          const userMsg: ChatMessage = {
            id: generateId(),
            role: 'user',
            content: action,
            timestamp: new Date(),
            skill: activeSkill,
            imageUrl: imageData,
          };
          addMessage(userMsg);
          simulatePogAgentic(action, imageData);
        } else {
          setUploadedImage(imageData);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSkillLabel = (skill: SkillMode) => {
    const map: Record<SkillMode, string> = { knowledge: 'Searching knowledge base...', analytics: 'Analyzing performance data...', pog: 'Running planogram audit...', actions: 'Creating task...' };
    return map[skill];
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.isTyping) {
      return (
        <div className="cop-thinking">
          <div className="cop-thinking-bar">
            <div className="cop-thinking-pulse" />
            <span>{getSkillLabel(msg.skill)}</span>
          </div>
          <div className="cop-typing-indicator">
            <span /><span /><span />
          </div>
        </div>
      );
    }

    // Agentic processing steps (ShelfIQ-style)
    if (msg.isProcessing && msg.processingSteps) {
      return (
        <div className="cop-agent-processing">
          <div className="cop-processing-header">
            <div className="cop-processing-spinner" />
            <span>Analyzing image...</span>
          </div>
          <div className="cop-processing-steps">
            {msg.processingSteps.map((step, idx) => (
              <div key={idx} className={`cop-processing-step cop-step--${step.status}`}>
                <div className="cop-step-indicator">
                  {step.status === 'completed' && <span className="cop-step-check">✓</span>}
                  {step.status === 'active' && <span className="cop-step-dot cop-step-dot--active" />}
                  {step.status === 'pending' && <span className="cop-step-dot" />}
                </div>
                <span className="cop-step-text">{step.step}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        {msg.content && (
          <div className="cop-msg-text" dangerouslySetInnerHTML={{
            __html: msg.content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br />')
          }} />
        )}

        {msg.imageUrl && (
          <div className="cop-msg-image">
            <img src={msg.imageUrl} alt="Uploaded" />
          </div>
        )}

        {/* Knowledge Sources */}
        {msg.sources && msg.sources.length > 0 && (
          <div className="cop-sources">
            <div className="cop-sources-label"><BookOpen size={13} /> Sources</div>
            {msg.sources.map((src, i) => (
              <div key={i} className="cop-source-card">
                <FileText size={14} />
                <div className="cop-source-info">
                  <span className="cop-source-doc">{src.doc}</span>
                  <span className="cop-source-detail">{src.section} — {src.page}</span>
                </div>
                <ExternalLink size={12} className="cop-source-link" />
              </div>
            ))}
          </div>
        )}

        {/* Analytics KPI Cards */}
        {msg.kpiCards && msg.kpiCards.length > 0 && (
          <div className="cop-kpi-grid">
            {msg.kpiCards.map((kpi, i) => (
              <div key={i} className={`cop-kpi-card cop-kpi--${kpi.direction}`}>
                <span className="cop-kpi-label">{kpi.label}</span>
                <span className="cop-kpi-value">{kpi.value}</span>
                <span className={`cop-kpi-delta cop-kpi-delta--${kpi.direction}`}>
                  {kpi.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.delta}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* OOS Alert — ShelfIQ Style */}
        {msg.oosItems && msg.oosItems.length > 0 && (
          <div className="cop-oos-alert">
            <div className="cop-oos-header">
              <div className="cop-oos-badge">
                <span className="cop-oos-pulse" />
                Critical Alert
              </div>
              <span className="cop-oos-count">{msg.oosItems.length} Items Detected</span>
            </div>
            <h3 className="cop-oos-title">Out-of-Stock Detection Complete</h3>
            {msg.oosImage && (
              <div className="cop-oos-image">
                <img src={msg.oosImage} alt="Analyzed shelf" />
                <div className="cop-oos-image-overlay">
                  <Eye size={20} />
                  <span>Analyzed Image</span>
                </div>
              </div>
            )}
            <div className="cop-oos-items">
              {msg.oosItems.map((item, idx) => (
                <div key={idx} className="cop-oos-item">
                  <div className="cop-oos-item-num">{idx + 1}</div>
                  <div className="cop-oos-item-info">
                    <strong>{item.name}</strong>
                    <span>{item.shelf} • {item.position}</span>
                  </div>
                  <span className="cop-oos-item-badge">OOS</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Audit Report — ShelfIQ Style */}
        {msg.complianceReport && (
          <div className="cop-audit-report">
            {/* Report Header */}
            <div className="cop-audit-header">
              <div className="cop-audit-header-top">
                <div className="cop-audit-badge">
                  <FileText size={16} />
                  <span>Compliance Audit Report</span>
                </div>
                <span className="cop-audit-date">{msg.complianceReport.auditDate}</span>
              </div>
              <h2 className="cop-audit-pog-name">{msg.complianceReport.planogramName}</h2>
              <p className="cop-audit-store">{msg.complianceReport.storeInfo}</p>
            </div>

            {/* Score Card */}
            <div className="cop-audit-score-card">
              <div className="cop-audit-score-main">
                <div className={`cop-audit-score-circle cop-grade-${msg.complianceReport.grade.toLowerCase()}`}>
                  <span className="cop-score-value">{msg.complianceReport.overallScore}</span>
                  <span className="cop-score-max">/100</span>
                </div>
                <div className="cop-audit-grade-info">
                  <span className={`cop-grade-badge cop-grade-${msg.complianceReport.grade.toLowerCase()}`}>
                    Grade {msg.complianceReport.grade}
                  </span>
                  <span className="cop-grade-label">
                    {msg.complianceReport.grade === 'A' ? 'Excellent' :
                     msg.complianceReport.grade === 'B' ? 'Good' :
                     msg.complianceReport.grade === 'C' ? 'Needs Improvement' :
                     msg.complianceReport.grade === 'D' ? 'Poor' : 'Critical'}
                  </span>
                </div>
              </div>
              <div className="cop-audit-score-breakdown">
                {msg.complianceReport.categories.map((cat, idx) => (
                  <div key={idx} className={`cop-category-bar-item cop-cat--${cat.status}`}>
                    <div className="cop-category-bar-info">
                      <span className="cop-category-bar-name">{cat.name}</span>
                      <span className="cop-category-bar-score">{cat.score}/{cat.maxScore}</span>
                    </div>
                    <div className="cop-category-bar">
                      <div className="cop-category-bar-fill" style={{ width: `${(cat.score / cat.maxScore) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="cop-audit-comparison">
              <h3 className="cop-audit-section-title">
                <Eye size={16} />
                Visual Comparison
              </h3>
              <div className="cop-audit-comparison-grid">
                <div className="cop-audit-comparison-item">
                  <span className="cop-comparison-label">Reference Planogram</span>
                  <div className="cop-comparison-img-wrap">
                    <img src={msg.complianceReport.comparisonImages.expected} alt="Expected" />
                  </div>
                </div>
                <div className="cop-audit-comparison-arrow">
                  <ChevronRight size={24} />
                </div>
                <div className="cop-audit-comparison-item">
                  <span className="cop-comparison-label">Actual Store Capture</span>
                  <div className="cop-comparison-img-wrap">
                    <img src={msg.complianceReport.comparisonImages.actual} alt="Actual" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="cop-audit-categories">
              <h3 className="cop-audit-section-title">
                <BarChart3 size={16} />
                Category Breakdown
              </h3>
              <div className="cop-audit-categories-grid">
                {msg.complianceReport.categories.map((cat, idx) => (
                  <div key={idx} className={`cop-audit-cat-card cop-cat--${cat.status}`}>
                    <div className="cop-cat-card-header">
                      <span className="cop-cat-card-name">{cat.name}</span>
                      <span className={`cop-cat-status-badge cop-cat-status--${cat.status}`}>
                        {cat.status === 'pass' ? '✓ Pass' : cat.status === 'warning' ? '⚠ Warning' : '✗ Fail'}
                      </span>
                    </div>
                    <div className="cop-cat-card-score">
                      <span className="cop-cat-score-num">{cat.score}</span>
                      <span className="cop-cat-score-denom">/{cat.maxScore} pts</span>
                    </div>
                    <ul className="cop-cat-findings">
                      {cat.findings.map((f, fIdx) => (
                        <li key={fIdx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Deviations Table */}
            <div className="cop-audit-deviations">
              <h3 className="cop-audit-section-title">
                <AlertCircle size={16} />
                Identified Deviations
              </h3>
              <div className="cop-audit-dev-table">
                <div className="cop-dev-table-header">
                  <span>Item</span>
                  <span>Expected</span>
                  <span>Actual</span>
                  <span>Impact</span>
                </div>
                {msg.complianceReport.deviations.map((dev, idx) => (
                  <div key={idx} className={`cop-dev-row cop-dev--${dev.severity}`}>
                    <div className="cop-dev-item-cell">
                      <span className={`cop-dev-severity cop-dev-sev--${dev.severity}`}>
                        {dev.severity === 'critical' ? <X size={14} /> :
                         dev.severity === 'warning' ? <AlertTriangle size={14} /> :
                         <CheckCircle size={14} />}
                      </span>
                      <span>{dev.item}</span>
                    </div>
                    <div className="cop-dev-cell">{dev.expected}</div>
                    <div className="cop-dev-cell">{dev.actual}</div>
                    <div className="cop-dev-cell">{dev.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="cop-audit-recs">
              <h3 className="cop-audit-section-title">
                <Wrench size={16} />
                Recommended Actions
              </h3>
              <div className="cop-audit-recs-list">
                {msg.complianceReport.recommendations.map((rec, idx) => {
                  const priority = rec.startsWith('IMMEDIATE') ? 'critical' :
                                   rec.startsWith('HIGH') ? 'high' :
                                   rec.startsWith('MEDIUM') ? 'medium' : 'low';
                  return (
                    <div key={idx} className={`cop-audit-rec-item cop-rec--${priority}`}>
                      <span className="cop-rec-num">{idx + 1}</span>
                      <span className="cop-rec-text">{rec}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Task Created Card */}
        {msg.taskCreated && (
          <div className="cop-task-card">
            <div className="cop-task-header">
              <ClipboardList size={15} />
              <span>Task Created</span>
              <CheckCircle2 size={14} className="cop-task-check" />
            </div>
            <div className="cop-task-body">
              <div className="cop-task-row"><span className="cop-task-label">Title</span><span className="cop-task-value">{msg.taskCreated.title}</span></div>
              <div className="cop-task-row"><span className="cop-task-label">Assigned To</span><span className="cop-task-value">{msg.taskCreated.assignee}</span></div>
              <div className="cop-task-row"><span className="cop-task-label">Priority</span><span className={`cop-task-priority cop-pri--${msg.taskCreated.priority.toLowerCase()}`}>{msg.taskCreated.priority}</span></div>
              <div className="cop-task-row"><span className="cop-task-label">Due</span><span className="cop-task-value">{msg.taskCreated.due}</span></div>
            </div>
            <button className="cop-task-view-btn">
              Open in Operations Queue <ArrowUpRight size={13} />
            </button>
          </div>
        )}

        {/* Suggested Follow-ups */}
        {msg.suggestedQueries && msg.suggestedQueries.length > 0 && (
          <div className="cop-suggestions-inline">
            {msg.suggestedQueries.map((q, i) => (
              <button key={i} className="cop-suggestion-chip" onClick={() => handleSuggestionClick(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  // Build conversation history entries from all skills
  const historyEntries = Object.entries(messages)
    .flatMap(([skill, msgs]) =>
      msgs.filter(m => m.role === 'user').map(m => ({
        skill: skill as SkillMode,
        label: skills.find(s => s.id === skill)!.label,
        icon: skills.find(s => s.id === skill)!.icon,
        query: m.content.length > 50 ? m.content.slice(0, 50) + '…' : m.content,
        time: m.timestamp,
      }))
    )
    .sort((a, b) => b.time.getTime() - a.time.getTime());

  const totalConversations = historyEntries.length;

  return (
    <div className="cop-container">
      {/* Header — Skill pills + actions */}
      <div className="cop-chat-header">
        <div className="cop-chat-header-left">
          <span className="cop-chat-header-icon"><Sparkles size={16} /></span>
          <h3>AI Copilot</h3>
        </div>

        <div className="cop-header-skills">
          {skills.map(s => (
            <button
              key={s.id}
              className={`cop-header-pill ${activeSkill === s.id ? 'cop-header-pill--active' : ''}`}
              onClick={() => setActiveSkill(s.id)}
            >
              {s.icon}
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <div className="cop-header-actions">
          <button className="cop-clear-btn" onClick={() => setMessages(prev => ({ ...prev, [activeSkill]: [] }))}>
            <RefreshCw size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Messages Area — Full screen */}
      <div className="cop-messages">
        {currentMessages.length === 0 ? (
          <div className="cop-welcome">
            <div className="cop-welcome-top">
              <div className="cop-welcome-logo">
                <Sparkles size={28} />
              </div>
              <h2>Hello, how can I help you today?</h2>
              <p>I'm your <strong>AI Copilot</strong> — I can answer SOP questions, analyze store performance, audit planograms, and create tasks. Select a skill or just start typing.</p>
            </div>

            <div className="cop-welcome-grid">
              {skills.map(skill => (
                <button
                  key={skill.id}
                  className={`cop-welcome-card ${activeSkill === skill.id ? 'cop-welcome-card--active' : ''}`}
                  onClick={() => setActiveSkill(skill.id)}
                >
                  <span className="cop-welcome-card-icon">{skill.icon}</span>
                  <span className="cop-welcome-card-name">{skill.label}</span>
                  <span className="cop-welcome-card-desc">{skill.description}</span>
                </button>
              ))}
            </div>

            <div className="cop-welcome-suggestions">
              <span className="cop-welcome-suggestions-label">Suggested prompts</span>
              <div className="cop-welcome-suggestions-grid">
                {currentSkill.suggestions.map((q, i) => (
                  <button key={i} className="cop-suggestion-btn" onClick={() => handleSuggestionClick(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          currentMessages.map(msg => (
            <div key={msg.id} className={`cop-msg cop-msg--${msg.role}`}>
              <div className="cop-msg-inner">
                <div className="cop-msg-avatar">
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="cop-msg-content">
                  <div className="cop-msg-meta">
                    <span className="cop-msg-sender">{msg.role === 'user' ? 'You' : 'AI Copilot'}</span>
                    <span className="cop-msg-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  {renderMessageContent(msg)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="cop-input-area">
        <div className="cop-input-inner">
          {uploadedImage && (
            <div className="cop-upload-preview">
              <img src={uploadedImage} alt="Upload preview" />
              <button className="cop-upload-remove" onClick={() => setUploadedImage(null)}>
                <X size={14} />
              </button>
            </div>
          )}
          <div className="cop-input-row">
            {activeSkill === 'pog' && (
              <>
                <button className="cop-upload-btn" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </>
            )}
            <textarea
              ref={inputRef}
              className="cop-input"
              placeholder={currentSkill.placeholder}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className={`cop-send-btn ${(inputValue.trim() || uploadedImage) && !isProcessing ? 'cop-send-btn--active' : ''}`}
              onClick={handleSend}
              disabled={(!inputValue.trim() && !uploadedImage) || isProcessing}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="cop-input-footer">
            AI Copilot uses retrieval-augmented generation. Responses are sourced from your organization's knowledge base.
          </div>
        </div>
      </div>

      {/* Bottom History Drawer */}
      {totalConversations > 0 && (
        <div className={`cop-drawer ${historyOpen ? 'cop-drawer--open' : ''}`}>
          <button className="cop-drawer-toggle" onClick={() => setHistoryOpen(!historyOpen)}>
            <Clock size={14} />
            <span>Recent ({totalConversations})</span>
            {historyOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          {historyOpen && (
            <div className="cop-drawer-body">
              {historyEntries.map((entry, i) => (
                <button
                  key={i}
                  className="cop-drawer-item"
                  onClick={() => { setActiveSkill(entry.skill); setHistoryOpen(false); }}
                >
                  <span className="cop-drawer-item-icon">{entry.icon}</span>
                  <div className="cop-drawer-item-text">
                    <span className="cop-drawer-item-query">{entry.query}</span>
                    <span className="cop-drawer-item-meta">{entry.label} · {entry.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
