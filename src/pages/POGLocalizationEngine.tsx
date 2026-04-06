import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Lock,
  Play,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Package,
  Zap,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Info,
  Layers,
  Store,
  Users,
  Coffee,
  Home,
  Loader2,
  Search,
  Download,
  Share2,
  Eye,
  Calendar,
  AlertCircle,
  PieChart,
  TrendingUp
} from 'lucide-react';
import './POGLocalizationEngine.css';

// Types
type WorkflowStep = 'category' | 'corporate' | 'storeGroup' | 'engine';
type EngineStage = 'geometry' | 'demand' | 'policy' | 'execution';
type StageStatus = 'pending' | 'running' | 'completed';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  pogCount: number;
}

interface CorporatePOG {
  id: string;
  name: string;
  version: string;
  sectionSize: string;
  shelfCount: number;
  image: string;
  insights: string[];
  categoryId: string;
  rules: { name: string; type: string; status: 'Active' | 'Warning' }[];
}

interface StoreGroup {
  id: string;
  name: string;
  description: string;
  storeCount: number;
  tags: string[];
  assortment: {
    totalSKUs: number;
    premium: number;
    core: number;
    value: number;
    newItems: number;
  };
}

interface EngineStageData {
  id: EngineStage;
  name: string;
  icon: React.ReactNode;
  status: StageStatus;
  reasoning: string;
  details?: string[];
}

interface LocalizationResult {
  id: string;
  cluster: string;
  version: string;
  status: 'Ready' | 'Published';
  confidenceScore: number;
  corporatePOG: string;
  corporatePOGId: string;
  storeGroup: string;
  category: string;
  createdAt: string;
  changes: {
    facingsAdjusted: number;
    premiumShift: string;
    valuePLShift: string;
    tasksGenerated: number;
  };
  whyChanged: { title: string; reason: string }[];
  agenticSummary: string[];
  diffHighlights: string[];
}

// Mock Data
const categories: Category[] = [
  { id: 'beverages', name: 'Beverages', icon: <Coffee size={24} />, pogCount: 12 },
  { id: 'holiday', name: 'Holiday Decor', icon: <Home size={24} />, pogCount: 8 },
];

const allCorporatePOGs: CorporatePOG[] = [
  {
    id: 'bev-corp-001',
    name: 'Beverage Cooler - Standard',
    version: 'v2.1',
    sectionSize: '8ft',
    shelfCount: 5,
    image: '/planograms/beverage-cooler-standard.svg',
    insights: ['Energy at premium position', 'Cola-led core structure', 'Private label interspersed'],
    categoryId: 'beverages',
    rules: [
      { name: 'Brand Blocking - Cola', type: 'Brand Blocking', status: 'Active' },
      { name: 'Min Facing - Energy', type: 'Facing', status: 'Active' },
      { name: 'Adjacency - Water/Sports', type: 'Adjacency', status: 'Active' },
      { name: 'Eye-Level Premium', type: 'Priority', status: 'Warning' },
    ],
  },
  {
    id: 'bev-corp-002',
    name: 'Beverage Aisle - Premium',
    version: 'v1.5',
    sectionSize: '12ft',
    shelfCount: 6,
    image: '/planograms/beverage-aisle-premium.svg',
    insights: ['Premium-first layout', 'Craft beverages highlighted', 'Impulse zone at checkout'],
    categoryId: 'beverages',
    rules: [
      { name: 'Premium Positioning', type: 'Priority', status: 'Active' },
      { name: 'Craft Brand Blocking', type: 'Brand Blocking', status: 'Active' },
      { name: 'Min 3 Facings', type: 'Facing', status: 'Active' },
    ],
  },
  {
    id: 'bev-corp-003',
    name: 'Beverage End Cap',
    version: 'v3.0',
    sectionSize: '4ft',
    shelfCount: 4,
    image: '/planograms/beverage-end-cap.svg',
    insights: ['High-velocity items', 'Promotional focus', 'Seasonal rotation'],
    categoryId: 'beverages',
    rules: [
      { name: 'Promo SKU Priority', type: 'Priority', status: 'Active' },
      { name: 'Max 2 Brands', type: 'Brand Blocking', status: 'Active' },
    ],
  },
  {
    id: 'hol-corp-001',
    name: 'Holiday Display - Standard',
    version: 'v1.3',
    sectionSize: '6ft',
    shelfCount: 4,
    image: '/planograms/holiday-decor-display.svg',
    insights: ['Seasonal items at eye-level', 'Gift sets prominently placed', 'Value items at bottom'],
    categoryId: 'holiday',
    rules: [
      { name: 'Gift Set Positioning', type: 'Priority', status: 'Active' },
      { name: 'Seasonal Rotation', type: 'Fixture-Specific', status: 'Active' },
    ],
  },
  {
    id: 'hol-corp-002',
    name: 'Holiday End Cap - Premium',
    version: 'v2.0',
    sectionSize: '4ft',
    shelfCount: 3,
    image: '/planograms/home-accent-shelf.svg',
    insights: ['Premium gift focus', 'Impulse purchase zone', 'Cross-category bundling'],
    categoryId: 'holiday',
    rules: [
      { name: 'Premium Gift Priority', type: 'Priority', status: 'Active' },
      { name: 'Bundle Adjacency', type: 'Adjacency', status: 'Warning' },
    ],
  },
];

const storeGroups: StoreGroup[] = [
  { 
    id: 'campus', 
    name: 'Campus Pulse', 
    description: 'Urban locations near universities with high foot traffic', 
    storeCount: 145, 
    tags: ['High Impulse', 'Single-Serve Focus', 'Premium Preference'],
    assortment: { totalSKUs: 156, premium: 45, core: 78, value: 23, newItems: 10 }
  },
  { 
    id: 'family', 
    name: 'Family Stock-Up', 
    description: 'Suburban stores with family-oriented shopping patterns', 
    storeCount: 312, 
    tags: ['Bulk Buyers', 'Value Seekers', 'Weekly Shoppers'],
    assortment: { totalSKUs: 198, premium: 32, core: 95, value: 56, newItems: 15 }
  },
  { 
    id: 'rural', 
    name: 'Rural Core', 
    description: 'Rural locations with essential-focused inventory', 
    storeCount: 89, 
    tags: ['Essential Focus', 'Limited SKUs', 'Price Sensitive'],
    assortment: { totalSKUs: 112, premium: 18, core: 62, value: 28, newItems: 4 }
  },
];

const storeGroupInsights: Record<string, string> = {
  campus: 'High impulse store → prioritize single-serve and premium beverages',
  family: 'Family-oriented → emphasize multi-packs and value bundles',
  rural: 'Essential-focused → optimize for core SKUs and everyday value',
};

// Mock Published Results
const mockPublishedResults: LocalizationResult[] = [
  {
    id: 'loc-001',
    cluster: 'Campus Pulse',
    version: 'v1.2',
    status: 'Published',
    confidenceScore: 96,
    corporatePOG: 'Beverage Cooler - Standard',
    corporatePOGId: 'bev-corp-001',
    storeGroup: 'Campus Pulse',
    category: 'Beverages',
    createdAt: '2024-03-15',
    changes: { facingsAdjusted: 22, premiumShift: '+15%', valuePLShift: '-10%', tasksGenerated: 28 },
    whyChanged: [
      { title: 'Energy drinks expanded', reason: 'High velocity in campus stores (+35% vs avg)' },
      { title: 'Single-serve prioritized', reason: 'Impulse purchase behavior dominates' },
    ],
    agenticSummary: ['Policy validated', 'Execution complete', 'Demand optimized'],
    diffHighlights: ['Energy +3 facings', 'Water -2 facings', 'Premium moved to shelf 2'],
  },
  {
    id: 'loc-002',
    cluster: 'Family Stock-Up',
    version: 'v1.0',
    status: 'Ready',
    confidenceScore: 91,
    corporatePOG: 'Beverage Aisle - Premium',
    corporatePOGId: 'bev-corp-002',
    storeGroup: 'Family Stock-Up',
    category: 'Beverages',
    createdAt: '2024-03-14',
    changes: { facingsAdjusted: 18, premiumShift: '-5%', valuePLShift: '+12%', tasksGenerated: 20 },
    whyChanged: [
      { title: 'Multi-pack emphasis', reason: 'Family shoppers prefer bulk purchases' },
      { title: 'Value tier expanded', reason: 'Price sensitivity in suburban markets' },
    ],
    agenticSummary: ['Policy validated', 'Execution ready', 'Value optimized'],
    diffHighlights: ['Multi-pack +4 facings', 'Premium -2 facings', 'Value moved to eye-level'],
  },
  {
    id: 'loc-003',
    cluster: 'Rural Core',
    version: 'v1.1',
    status: 'Published',
    confidenceScore: 88,
    corporatePOG: 'Beverage End Cap',
    corporatePOGId: 'bev-corp-003',
    storeGroup: 'Rural Core',
    category: 'Beverages',
    createdAt: '2024-03-12',
    changes: { facingsAdjusted: 12, premiumShift: '-8%', valuePLShift: '+15%', tasksGenerated: 14 },
    whyChanged: [
      { title: 'Core SKU focus', reason: 'Limited shelf space requires essential items only' },
      { title: 'Value positioning', reason: 'Price-sensitive rural demographic' },
    ],
    agenticSummary: ['Policy validated', 'Execution complete', 'Essentials optimized'],
    diffHighlights: ['Core +2 facings', 'Premium removed', 'Value at eye-level'],
  },
];

export const POGLocalizationEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'run' | 'results'>('run');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPOG, setSelectedPOG] = useState<CorporatePOG | null>(null);
  const [selectedStoreGroup, setSelectedStoreGroup] = useState<string | null>(null);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [engineStages, setEngineStages] = useState<EngineStageData[]>([
    { id: 'geometry', name: 'Geometry & Localization', icon: <Layers size={20} />, status: 'pending', reasoning: '' },
    { id: 'demand', name: 'Demand Rebalancing', icon: <BarChart3 size={20} />, status: 'pending', reasoning: '' },
    { id: 'policy', name: 'Policy Validation', icon: <ShieldCheck size={20} />, status: 'pending', reasoning: '' },
    { id: 'execution', name: 'Execution Packaging', icon: <Package size={20} />, status: 'pending', reasoning: '' },
  ]);
  const [localizationResult, setLocalizationResult] = useState<LocalizationResult | null>(null);
  const [publishedResults, setPublishedResults] = useState<LocalizationResult[]>(mockPublishedResults);
  const [showCorporateView, setShowCorporateView] = useState(false);
  const [expandedReasons, setExpandedReasons] = useState<string[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [resultsSearch, setResultsSearch] = useState('');
  const [resultsFilter, setResultsFilter] = useState<'all' | 'Ready' | 'Published'>('all');
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const workflowSteps = [
    { id: 'category' as WorkflowStep, label: 'Category', number: 1 },
    { id: 'corporate' as WorkflowStep, label: 'Corporate Standard', number: 2 },
    { id: 'storeGroup' as WorkflowStep, label: 'Store Group', number: 3 },
    { id: 'engine' as WorkflowStep, label: 'Localization Engine', number: 4 },
  ];

  const categoryPOGs = allCorporatePOGs.filter(p => p.categoryId === selectedCategory);

  const getStepStatus = (stepId: WorkflowStep): 'completed' | 'current' | 'locked' => {
    const stepOrder: WorkflowStep[] = ['category', 'corporate', 'storeGroup', 'engine'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'locked';
  };

  const transitionToStep = async (nextStep: WorkflowStep) => {
    setIsStepLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    setIsStepLoading(false);
    setCurrentStep(nextStep);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedPOG(null);
    transitionToStep('corporate');
  };

  const handlePOGSelect = (pog: CorporatePOG) => {
    setSelectedPOG(pog);
  };


  const runLocalizationEngine = async () => {
    setIsEngineRunning(true);
    
    const stageReasonings = {
      geometry: {
        reasoning: 'Adjusted shelf spacing for 6ft fixture constraint',
        details: ['Reduced shelf depth by 2 inches', 'Optimized vertical spacing for product visibility', 'Configured end-cap integration points'],
      },
      demand: {
        reasoning: 'Increased energy drink facings by 12% due to high velocity',
        details: ['Premium SKUs moved to eye-level (+8% visibility)', 'Single-serve expanded by 15%', 'Reduced bulk water allocation by 10%'],
      },
      policy: {
        reasoning: 'Validated against adjacency and facing rules',
        details: ['Brand blocking rule: Compliant', 'Adjacency rule: Adjusted cola placement', 'Minimum facing rule: All SKUs compliant'],
      },
      execution: {
        reasoning: 'Generated 22 store-level execution steps',
        details: ['12 shelf resets required', '8 product relocations', '2 new fixture installations'],
      },
    };

    const stages: EngineStage[] = ['geometry', 'demand', 'policy', 'execution'];
    
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      
      setEngineStages(prev => prev.map(s => 
        s.id === stage ? { ...s, status: 'running' as StageStatus } : s
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      setEngineStages(prev => prev.map(s => 
        s.id === stage ? { 
          ...s, 
          status: 'completed' as StageStatus, 
          reasoning: stageReasonings[stage].reasoning,
          details: stageReasonings[stage].details,
        } : s
      ));
    }

    const storeGroup = storeGroups.find(g => g.id === selectedStoreGroup);
    const result: LocalizationResult = {
      id: `loc-${Date.now()}`,
      cluster: storeGroup?.name || 'Unknown',
      version: 'v1.0',
      status: 'Ready',
      confidenceScore: 94,
      corporatePOG: selectedPOG?.name || '',
      corporatePOGId: selectedPOG?.id || '',
      storeGroup: storeGroup?.name || '',
      category: categories.find(c => c.id === selectedCategory)?.name || '',
      createdAt: new Date().toISOString().split('T')[0],
      changes: {
        facingsAdjusted: 18,
        premiumShift: '+12%',
        valuePLShift: '-8%',
        tasksGenerated: 22,
      },
      whyChanged: [
        { title: 'Energy drinks moved to top shelf', reason: 'High impulse behavior drives 23% higher conversion at eye-level' },
        { title: 'Bulk water reduced', reason: 'Lower demand velocity (-15%) allows reallocation to premium single-serve' },
        { title: 'Cola brand blocking adjusted', reason: 'Adjacency rule compliance required repositioning to maintain brand separation' },
        { title: 'Private label interspersed', reason: 'Strategic placement next to national brands increases trial rate by 8%' },
      ],
      agenticSummary: ['Policy validated', 'Execution ready', 'Demand optimized'],
      diffHighlights: ['Energy +3 facings', 'Water -2 facings', 'Premium moved to shelf 2', 'Value tier consolidated'],
    };

    setLocalizationResult(result);
    setPublishedResults(prev => [result, ...prev]);
    setIsEngineRunning(false);
  };

  const toggleReasonExpand = (title: string) => {
    setExpandedReasons(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handlePublish = (resultId: string) => {
    setPublishedResults(prev => prev.map(r => 
      r.id === resultId ? { ...r, status: 'Published' as const } : r
    ));
  };

  // Get unique values for filter dropdowns
  const uniqueClusters = [...new Set(publishedResults.map(r => r.cluster))];
  const uniqueCategories = [...new Set(publishedResults.map(r => r.category))];
  const uniqueDates = [...new Set(publishedResults.map(r => r.createdAt))].sort().reverse();

  const filteredResults = publishedResults.filter(r => {
    const matchesSearch = r.cluster.toLowerCase().includes(resultsSearch.toLowerCase()) ||
      r.corporatePOG.toLowerCase().includes(resultsSearch.toLowerCase()) ||
      r.category.toLowerCase().includes(resultsSearch.toLowerCase());
    const matchesStatus = resultsFilter === 'all' || r.status === resultsFilter;
    const matchesCluster = clusterFilter === 'all' || r.cluster === clusterFilter;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesDate = dateFilter === 'all' || r.createdAt === dateFilter;
    return matchesSearch && matchesStatus && matchesCluster && matchesCategory && matchesDate;
  });

  const clearAllFilters = () => {
    setResultsSearch('');
    setResultsFilter('all');
    setClusterFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
  };

  const activeFilterCount = [
    clusterFilter !== 'all',
    categoryFilter !== 'all',
    dateFilter !== 'all',
  ].filter(Boolean).length;

  const renderWorkflowProgress = () => (
    <div className="loc-workflow-progress">
      {workflowSteps.map((step, index) => {
        const status = getStepStatus(step.id);
        return (
          <React.Fragment key={step.id}>
            <div 
              className={`loc-workflow-step ${status}`}
              onClick={() => status === 'completed' && setCurrentStep(step.id)}
            >
              <div className="loc-workflow-step-indicator">
                {status === 'completed' ? (
                  <CheckCircle size={20} />
                ) : status === 'current' ? (
                  <Circle size={20} className="current-circle" />
                ) : (
                  <Lock size={16} />
                )}
              </div>
              <span className="loc-workflow-step-label">{step.label}</span>
            </div>
            {index < workflowSteps.length - 1 && (
              <div className={`loc-workflow-connector ${status === 'completed' ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderCategoryStep = () => (
    <div className="loc-step-content">
      <h3 className="loc-step-title">Select Category</h3>
      <p className="loc-step-description">Choose a product category to begin the localization process.</p>
      <div className="loc-category-grid">
        {categories.map(cat => (
          <div 
            key={cat.id}
            className={`loc-category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
            onClick={() => handleCategorySelect(cat.id)}
          >
            <div className="loc-category-icon">{cat.icon}</div>
            <div className="loc-category-info">
              <h4>{cat.name}</h4>
              <span>{cat.pogCount} POGs available</span>
            </div>
            {selectedCategory === cat.id && <CheckCircle size={20} className="loc-category-check" />}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCorporateStep = () => {
    const pogs = categoryPOGs;
    return (
      <div className="loc-step-content">
        <h3 className="loc-step-title">Select Corporate Standard</h3>
        <p className="loc-step-description">Choose a planogram from this category to localize.</p>
        
        {/* POG Selection Grid */}
        <div className="loc-pog-selection-grid">
          {pogs.map(pog => (
            <div 
              key={pog.id}
              className={`loc-pog-select-card ${selectedPOG?.id === pog.id ? 'selected' : ''}`}
              onClick={() => handlePOGSelect(pog)}
            >
              <div className="loc-pog-select-preview">
                <img src={pog.image} alt={pog.name} />
              </div>
              <div className="loc-pog-select-info">
                <h5>{pog.name}</h5>
                <div className="loc-pog-select-meta">
                  <span>{pog.version}</span>
                  <span>{pog.sectionSize}</span>
                  <span>{pog.shelfCount} shelves</span>
                </div>
              </div>
              {selectedPOG?.id === pog.id && <CheckCircle size={18} className="loc-pog-select-check" />}
            </div>
          ))}
        </div>

        {/* Selected POG Details */}
        {selectedPOG && (
          <div className="loc-corporate-panel">
            <div className="loc-pog-preview">
              <img src={selectedPOG.image} alt={selectedPOG.name} />
            </div>
            <div className="loc-pog-details">
              <h4>{selectedPOG.name}</h4>
              <div className="loc-pog-metadata">
                <div className="loc-metadata-item">
                  <span className="loc-metadata-label">Version</span>
                  <span className="loc-metadata-value">{selectedPOG.version}</span>
                </div>
                <div className="loc-metadata-item">
                  <span className="loc-metadata-label">Section Size</span>
                  <span className="loc-metadata-value">{selectedPOG.sectionSize}</span>
                </div>
                <div className="loc-metadata-item">
                  <span className="loc-metadata-label">Shelf Count</span>
                  <span className="loc-metadata-value">{selectedPOG.shelfCount}</span>
                </div>
              </div>
              
              <div className="loc-agentic-insights">
                <div className="loc-agentic-header">
                  <Sparkles size={16} />
                  <span>AI-Interpreted Structure</span>
                </div>
                <div className="loc-insight-tags">
                  {selectedPOG.insights.map((insight: string, idx: number) => (
                    <span key={idx} className="loc-insight-tag">{insight}</span>
                  ))}
                </div>
              </div>

              {/* Rules Section */}
              <div className="loc-rules-section">
                <div className="loc-rules-header">
                  <ShieldCheck size={16} />
                  <span>Applicable Rules</span>
                </div>
                <div className="loc-rules-list">
                  {selectedPOG.rules.map((rule, idx) => (
                    <div key={idx} className={`loc-rule-item ${rule.status.toLowerCase()}`}>
                      <span className="loc-rule-name">{rule.name}</span>
                      <span className="loc-rule-type">{rule.type}</span>
                      <span className={`loc-rule-status ${rule.status.toLowerCase()}`}>
                        {rule.status === 'Warning' && <AlertCircle size={12} />}
                        {rule.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <button 
          className="loc-continue-btn" 
          onClick={() => transitionToStep('storeGroup')}
          disabled={!selectedPOG}
        >
          Continue to Store Group <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  const renderStoreGroupStep = () => {
    const selectedGroup = storeGroups.find(g => g.id === selectedStoreGroup);
    
    return (
      <div className="loc-step-content">
        <h3 className="loc-step-title">Select Store Group</h3>
        <p className="loc-step-description">Choose the store cluster for localization.</p>
        
        <div className="loc-store-group-grid">
          {storeGroups.map(group => (
            <div 
              key={group.id}
              className={`loc-store-group-card ${selectedStoreGroup === group.id ? 'selected' : ''}`}
              onClick={() => setSelectedStoreGroup(group.id)}
            >
              <div className="loc-store-group-header">
                <Store size={20} />
                <h4>{group.name}</h4>
                {selectedStoreGroup === group.id && <CheckCircle size={18} className="loc-group-check" />}
              </div>
              <p className="loc-store-group-desc">{group.description}</p>
              <div className="loc-store-group-meta">
                <Users size={14} />
                <span>{group.storeCount} stores</span>
              </div>
              <div className="loc-store-group-tags">
                {group.tags.map((tag, idx) => (
                  <span key={idx} className="loc-group-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Assortment Distribution */}
        {selectedGroup && (
          <>
            <div className="loc-assortment-panel">
              <div className="loc-assortment-header">
                <PieChart size={18} />
                <h4>Assortment Distribution</h4>
              </div>
              <div className="loc-assortment-grid">
                <div className="loc-assortment-item">
                  <span className="loc-assortment-value">{selectedGroup.assortment.totalSKUs}</span>
                  <span className="loc-assortment-label">Total SKUs</span>
                </div>
                <div className="loc-assortment-item premium">
                  <span className="loc-assortment-value">{selectedGroup.assortment.premium}</span>
                  <span className="loc-assortment-label">Premium</span>
                  <span className="loc-assortment-pct">{Math.round(selectedGroup.assortment.premium / selectedGroup.assortment.totalSKUs * 100)}%</span>
                </div>
                <div className="loc-assortment-item core">
                  <span className="loc-assortment-value">{selectedGroup.assortment.core}</span>
                  <span className="loc-assortment-label">Core</span>
                  <span className="loc-assortment-pct">{Math.round(selectedGroup.assortment.core / selectedGroup.assortment.totalSKUs * 100)}%</span>
                </div>
                <div className="loc-assortment-item value">
                  <span className="loc-assortment-value">{selectedGroup.assortment.value}</span>
                  <span className="loc-assortment-label">Value</span>
                  <span className="loc-assortment-pct">{Math.round(selectedGroup.assortment.value / selectedGroup.assortment.totalSKUs * 100)}%</span>
                </div>
                <div className="loc-assortment-item new">
                  <span className="loc-assortment-value">{selectedGroup.assortment.newItems}</span>
                  <span className="loc-assortment-label">New Items</span>
                </div>
              </div>
            </div>

            <div className="loc-agentic-insight-banner">
              <Zap size={18} />
              <span>{storeGroupInsights[selectedStoreGroup!]}</span>
            </div>

            <button className="loc-continue-btn" onClick={() => transitionToStep('engine')}>
              Continue to Engine <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
    );
  };

  const renderEngineStep = () => (
    <div className="loc-step-content">
      <h3 className="loc-step-title">Localization Engine</h3>
      <p className="loc-step-description">Run the AI-powered localization engine to adapt the corporate planogram.</p>
      
      <div className="loc-engine-panel">
        <div className="loc-engine-stages">
          {engineStages.map((stage) => (
            <div key={stage.id} className={`loc-engine-stage ${stage.status}`}>
              <div className="loc-stage-header">
                <div className="loc-stage-icon">
                  {stage.status === 'running' ? (
                    <Loader2 size={20} className="spinning" />
                  ) : stage.status === 'completed' ? (
                    <CheckCircle size={20} />
                  ) : (
                    stage.icon
                  )}
                </div>
                <div className="loc-stage-info">
                  <h5>{stage.name}</h5>
                  {stage.status === 'running' && (
                    <span className="loc-stage-status">Processing...</span>
                  )}
                  {stage.status === 'completed' && stage.reasoning && (
                    <span className="loc-stage-reasoning">{stage.reasoning}</span>
                  )}
                </div>
              </div>
              {stage.status === 'completed' && stage.details && (
                <div className="loc-stage-details">
                  {stage.details.map((detail, idx) => (
                    <div key={idx} className="loc-stage-detail-item">
                      <ChevronRight size={14} />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {isEngineRunning && (
          <div className="loc-engine-live-status">
            <div className="loc-live-indicator" />
            <span>Engine is analyzing and optimizing...</span>
          </div>
        )}

        {!localizationResult && !isEngineRunning && (
          <button className="loc-run-engine-btn" onClick={runLocalizationEngine}>
            <Play size={18} />
            Run Localization Engine
          </button>
        )}

        {localizationResult && (
          <div className="loc-engine-complete">
            <CheckCircle size={24} />
            <div>
              <strong>Localization Complete</strong>
              <p>View results in the Published Results tab</p>
            </div>
            <button className="loc-view-results-btn" onClick={() => setActiveTab('results')}>
              View Results <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderRunLocalization = () => (
    <div className="loc-run-container">
      {renderWorkflowProgress()}
      <div className="loc-main-panel">
        {isStepLoading ? (
          <div className="loc-step-loading">
            <Loader2 size={32} className="spinning" />
            <h4>Loading next step...</h4>
            <p>Preparing data and validating selections</p>
          </div>
        ) : (
          <>
            {currentStep === 'category' && renderCategoryStep()}
            {currentStep === 'corporate' && renderCorporateStep()}
            {currentStep === 'storeGroup' && renderStoreGroupStep()}
            {currentStep === 'engine' && renderEngineStep()}
          </>
        )}
      </div>
    </div>
  );

  const renderResultDetail = (result: LocalizationResult) => {
    const corpPOG = allCorporatePOGs.find(p => p.id === result.corporatePOGId);
    
    return (
      <div className="loc-result-detail">
        <div className="loc-result-detail-header">
          <button className="loc-back-btn" onClick={() => setSelectedResultId(null)}>
            <ChevronRight size={16} className="rotated" /> Back to List
          </button>
          <div className="loc-result-actions">
            <button className="loc-action-btn"><Download size={16} /> Download</button>
            <button className="loc-action-btn"><Share2 size={16} /> Share</button>
          </div>
        </div>

        <div className="loc-results-header">
          <div className="loc-results-title-section">
            <h3>{result.corporatePOG} → {result.cluster}</h3>
            <div className="loc-results-tags">
              <span className="loc-tag category">{result.category}</span>
              <span className="loc-tag cluster">{result.cluster}</span>
              <span className="loc-tag version">{result.version}</span>
              <span className={`loc-tag status ${result.status.toLowerCase()}`}>{result.status}</span>
            </div>
          </div>
        </div>

        <div className="loc-results-grid">
          <div className="loc-results-left">
            <div className="loc-pog-viewer-card">
              <div className="loc-viewer-header">
                <h4>Planogram Comparison</h4>
                <div className="loc-viewer-toggle">
                  <button className={!showCorporateView ? 'active' : ''} onClick={() => setShowCorporateView(false)}>
                    Localized
                  </button>
                  <button className={showCorporateView ? 'active' : ''} onClick={() => setShowCorporateView(true)}>
                    Corporate
                  </button>
                </div>
              </div>
              <div className="loc-pog-viewer">
                <img src={corpPOG?.image || '/planograms/beverage-cooler-standard.svg'} alt="Planogram" className={showCorporateView ? 'corporate' : 'localized'} />
                {!showCorporateView && (
                  <div className="loc-pog-overlay-badge"><Sparkles size={14} /> Localized for {result.cluster}</div>
                )}
              </div>
              {/* Diff Highlights */}
              <div className="loc-diff-highlights">
                <h5><TrendingUp size={14} /> Key Changes from Corporate</h5>
                <div className="loc-diff-tags">
                  {result.diffHighlights.map((diff, idx) => (
                    <span key={idx} className="loc-diff-tag">{diff}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="loc-why-changed-card">
              <h4><Info size={18} /> Why This Changed</h4>
              <div className="loc-why-list">
                {result.whyChanged.map((item, idx) => (
                  <div key={idx} className="loc-why-item">
                    <div className="loc-why-header" onClick={() => toggleReasonExpand(item.title)}>
                      <ChevronDown size={16} className={expandedReasons.includes(item.title) ? 'expanded' : ''} />
                      <span>{item.title}</span>
                    </div>
                    {expandedReasons.includes(item.title) && <p className="loc-why-reason">{item.reason}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="loc-results-right">
            <div className="loc-confidence-card">
              <div className="loc-confidence-header">
                <h4>Localization Confidence</h4>
                <span className="loc-confidence-score">{result.confidenceScore}%</span>
              </div>
              <div className="loc-confidence-bar">
                <div className="loc-confidence-fill" style={{ width: `${result.confidenceScore}%` }} />
              </div>
              <div className="loc-agentic-summary">
                {result.agenticSummary.map((item, idx) => (
                  <span key={idx} className="loc-summary-tag"><CheckCircle size={12} />{item}</span>
                ))}
              </div>
            </div>

            <div className="loc-change-summary-card">
              <h4>Change Summary</h4>
              <div className="loc-change-grid">
                <div className="loc-change-item">
                  <div className="loc-change-icon facings"><Target size={18} /></div>
                  <div className="loc-change-info">
                    <span className="loc-change-value">{result.changes.facingsAdjusted}</span>
                    <span className="loc-change-label">Facings Adjusted</span>
                  </div>
                </div>
                <div className="loc-change-item">
                  <div className="loc-change-icon premium"><ArrowUpRight size={18} /></div>
                  <div className="loc-change-info">
                    <span className="loc-change-value">{result.changes.premiumShift}</span>
                    <span className="loc-change-label">Premium Shift</span>
                  </div>
                </div>
                <div className="loc-change-item">
                  <div className="loc-change-icon value"><ArrowDownRight size={18} /></div>
                  <div className="loc-change-info">
                    <span className="loc-change-value">{result.changes.valuePLShift}</span>
                    <span className="loc-change-label">Value / PL Shift</span>
                  </div>
                </div>
                <div className="loc-change-item">
                  <div className="loc-change-icon tasks"><FileText size={18} /></div>
                  <div className="loc-change-info">
                    <span className="loc-change-value">{result.changes.tasksGenerated}</span>
                    <span className="loc-change-label">Tasks Generated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="loc-output-summary-card">
              <h4>Output Summary</h4>
              <div className="loc-output-details">
                <div className="loc-output-row">
                  <span className="loc-output-label">Derived From</span>
                  <span className="loc-output-value">{result.corporatePOG}</span>
                </div>
                <div className="loc-output-row">
                  <span className="loc-output-label">Store Group</span>
                  <span className="loc-output-value">{result.storeGroup}</span>
                </div>
                <div className="loc-output-row">
                  <span className="loc-output-label">Created</span>
                  <span className="loc-output-value">{result.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="loc-execution-card">
              <div className="loc-execution-header">
                <h4>Execution Readiness</h4>
                <span className={`loc-execution-status ${result.status.toLowerCase()}`}>{result.status}</span>
              </div>
              <p>{result.changes.tasksGenerated} store-level tasks ready for deployment</p>
              {result.status === 'Ready' && (
                <button className="loc-publish-btn" onClick={() => handlePublish(result.id)}>Publish to Stores</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPublishedResults = () => {
    if (selectedResultId) {
      const result = publishedResults.find(r => r.id === selectedResultId);
      if (result) return renderResultDetail(result);
    }

    return (
      <div className="loc-results-container">
        {/* Toolbar */}
        <div className="loc-results-toolbar">
          <div className="loc-results-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by cluster, POG, or category..." 
              value={resultsSearch}
              onChange={(e) => setResultsSearch(e.target.value)}
            />
          </div>
          <div className="loc-results-filters">
            <button 
              className={`loc-filter-btn ${resultsFilter === 'all' ? 'active' : ''}`}
              onClick={() => setResultsFilter('all')}
            >
              All ({publishedResults.length})
            </button>
            <button 
              className={`loc-filter-btn ${resultsFilter === 'Ready' ? 'active' : ''}`}
              onClick={() => setResultsFilter('Ready')}
            >
              Ready ({publishedResults.filter(r => r.status === 'Ready').length})
            </button>
            <button 
              className={`loc-filter-btn ${resultsFilter === 'Published' ? 'active' : ''}`}
              onClick={() => setResultsFilter('Published')}
            >
              Published ({publishedResults.filter(r => r.status === 'Published').length})
            </button>
          </div>
          <button 
            className={`loc-filter-toggle-btn ${showFilters ? 'active' : ''} ${activeFilterCount > 0 ? 'has-filters' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Store size={16} />
            Filters
            {activeFilterCount > 0 && <span className="loc-filter-count">{activeFilterCount}</span>}
          </button>
          <div className="loc-results-actions-toolbar">
            <button className="loc-toolbar-btn"><Download size={16} /> Export All</button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="loc-advanced-filters">
            <div className="loc-filter-group">
              <label>Cluster</label>
              <select value={clusterFilter} onChange={(e) => setClusterFilter(e.target.value)}>
                <option value="all">All Clusters</option>
                {uniqueClusters.map(cluster => (
                  <option key={cluster} value={cluster}>{cluster}</option>
                ))}
              </select>
            </div>
            <div className="loc-filter-group">
              <label>Category</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="loc-filter-group">
              <label>Date</label>
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                <option value="all">All Dates</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button className="loc-clear-filters-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Results List */}
        {filteredResults.length === 0 ? (
          <div className="loc-no-results">
            <FileText size={48} />
            <h3>No Results Found</h3>
            <p>{publishedResults.length === 0 ? 'Run the localization engine to generate results.' : 'Try adjusting your search or filters.'}</p>
            {publishedResults.length === 0 && (
              <button className="loc-go-run-btn" onClick={() => setActiveTab('run')}>Go to Run Localization</button>
            )}
          </div>
        ) : (
          <div className="loc-results-list">
            {filteredResults.map(result => (
              <div key={result.id} className="loc-result-card" onClick={() => setSelectedResultId(result.id)}>
                <div className="loc-result-card-left">
                  <div className="loc-result-card-preview">
                    <img src={allCorporatePOGs.find(p => p.id === result.corporatePOGId)?.image || '/planograms/beverage-cooler-standard.svg'} alt="" />
                  </div>
                  <div className="loc-result-card-info">
                    <h4>{result.corporatePOG}</h4>
                    <p>Localized for <strong>{result.cluster}</strong></p>
                    <div className="loc-result-card-meta">
                      <span><Calendar size={12} /> {result.createdAt}</span>
                      <span className="loc-result-card-category">{result.category}</span>
                    </div>
                  </div>
                </div>
                <div className="loc-result-card-right">
                  <div className="loc-result-card-stats">
                    <div className="loc-result-stat">
                      <span className="loc-stat-value">{result.confidenceScore}%</span>
                      <span className="loc-stat-label">Confidence</span>
                    </div>
                    <div className="loc-result-stat">
                      <span className="loc-stat-value">{result.changes.facingsAdjusted}</span>
                      <span className="loc-stat-label">Changes</span>
                    </div>
                  </div>
                  <span className={`loc-result-status ${result.status.toLowerCase()}`}>{result.status}</span>
                  <div className="loc-result-card-actions">
                    <button className="loc-card-action" onClick={(e) => { e.stopPropagation(); }}><Eye size={14} /></button>
                    <button className="loc-card-action" onClick={(e) => { e.stopPropagation(); }}><Download size={14} /></button>
                    <button className="loc-card-action" onClick={(e) => { e.stopPropagation(); }}><Share2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="loc-engine-container">
      <div className="loc-engine-header">
        <div>
          <h1 className="loc-engine-title">Localization Engine</h1>
          <p className="loc-engine-subtitle">
            Adapt corporate planograms into store-specific layouts using demand signals and rule validation
          </p>
        </div>
      </div>

      <div className="loc-engine-tabs">
        <div className="loc-tabs-container">
          <button 
            className={`loc-tab ${activeTab === 'run' ? 'active' : ''}`}
            onClick={() => setActiveTab('run')}
          >
            Run Localization
          </button>
          <button 
            className={`loc-tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Published Results
            {localizationResult && <span className="loc-tab-badge">1</span>}
          </button>
        </div>
      </div>

      <div className="loc-engine-content">
        {activeTab === 'run' ? renderRunLocalization() : renderPublishedResults()}
      </div>
    </div>
  );
};

export default POGLocalizationEngine;
