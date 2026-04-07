import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TrendingUp
} from 'lucide-react';
import { useExecutionTasks, ExecutionTask } from '../context/ExecutionTasksContext';
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
  rules: { name: string; type: string; status: 'Active' | 'Warning'; description?: string }[];
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
  { id: 'beverages', name: 'Beverages', icon: <Coffee size={24} />, pogCount: 3 },
  { id: 'holiday', name: 'Holiday Decor', icon: <Home size={24} />, pogCount: 2 },
];

// Mapping of corporate POG images to their localized versions
const localizedImageMap: Record<string, string> = {
  '/assets/Beverage Cooler (Standard).png': '/assets/Localized - Beverage Cooler (Standard).png',
  '/assets/Beverage Aisle - Premium.png': '/assets/Localized -Beverage Aisle - Premium.png',
  '/assets/Beverage End Cap - Large Format.png': '/assets/Localized - Beverage End Cap - Large Format.png',
  '/assets/Home Accent Shelf - End Cap.png': '/assets/Localized - Home Accent Shelf - End Cap.png',
};

const allCorporatePOGs: CorporatePOG[] = [
  {
    id: 'bev-corp-001',
    name: 'Beverage Cooler - Standard',
    version: 'v2.1',
    sectionSize: '8ft',
    shelfCount: 5,
    image: '/assets/Beverage Cooler (Standard).png',
    insights: ['Energy at premium position', 'Cola-led core structure', 'Private label interspersed'],
    categoryId: 'beverages',
    rules: [
      { name: 'Product Fit & Placement', type: 'Product Fit & Placement', status: 'Active', description: 'Place small single-serve drinks on top shelves, medium bottles in the middle, and large bottles or multipacks on bottom shelves or base.' },
      { name: 'Facing Rules', type: 'Facing', status: 'Active', description: 'Ensure high-demand beverages have multiple front facings and shelves are fully stocked with no empty gaps.' },
      { name: 'Priority Placement', type: 'Priority', status: 'Active', description: 'Keep top-selling drinks and core categories like soda and sports drinks at eye level.' },
      { name: 'Space Allocation', type: 'Space Allocation', status: 'Active', description: 'Divide shelf space clearly between soda, water, and energy drinks based on demand.' },
      { name: 'Capacity / Fit', type: 'Capacity / Fit', status: 'Active', description: 'Do not exceed shelf capacity. Products must fit within shelf space without overlapping.' },
      { name: 'Price Tier Rules', type: 'Price Tier', status: 'Active', description: 'Place value drinks on lower shelves and premium drinks on upper or eye-level shelves.' },
      { name: 'Temperature Compliance', type: 'Compliance', status: 'Active', description: 'Only chilled beverages should be placed in the cooler. Do not mix ambient products.' },
      { name: 'Label Visibility', type: 'Visual', status: 'Active', description: 'Ensure all product labels face forward and are clearly visible to customers.' },
    ],
  },
  {
    id: 'bev-corp-002',
    name: 'Beverage Aisle - Premium',
    version: 'v1.5',
    sectionSize: '12ft',
    shelfCount: 6,
    image: '/assets/Beverage Aisle - Premium.png',
    insights: ['Premium-first layout', 'Craft beverages highlighted', 'Impulse zone at checkout'],
    categoryId: 'beverages',
    rules: [
      { name: 'Product Fit & Placement', type: 'Product Fit & Placement', status: 'Active', description: 'Arrange smaller bottles and premium drinks on upper shelves and larger packs on lower shelves.' },
      { name: 'Facing Rules', type: 'Facing', status: 'Active', description: 'Maintain moderate spacing while ensuring key products have enough visibility.' },
      { name: 'Brand Blocking', type: 'Brand Blocking', status: 'Active', description: 'Group products of the same brand together in a continuous block.' },
      { name: 'Adjacency Rules', type: 'Adjacency', status: 'Active', description: 'Place similar beverage types together such as water with water and juice with juice.' },
      { name: 'Price Tier Rules', type: 'Price Tier', status: 'Active', description: 'Ensure premium products are placed at eye level and value products are positioned lower.' },
      { name: 'Visual Balance', type: 'Visual', status: 'Active', description: 'Maintain a clean and organized shelf with balanced spacing across all products.' },
      { name: 'Shelf Alignment', type: 'Compliance', status: 'Active', description: 'All products must be aligned uniformly with no tilted or misaligned items.' },
    ],
  },
  {
    id: 'bev-corp-003',
    name: 'Beverage End Cap',
    version: 'v3.0',
    sectionSize: '4ft',
    shelfCount: 4,
    image: '/assets/Beverage End Cap - Large Format.png',
    insights: ['High-velocity items', 'Promotional focus', 'Seasonal rotation'],
    categoryId: 'beverages',
    rules: [
      { name: 'Priority Placement', type: 'Priority', status: 'Active', description: 'Place promotional and top-selling beverages in top and eye-level shelves.' },
      { name: 'Facing Rules', type: 'Facing', status: 'Active', description: 'Use high-density placement with multiple facings to create strong visual impact.' },
      { name: 'Space Allocation', type: 'Space Allocation', status: 'Active', description: 'Allocate more space to high-demand or promotional products.' },
      { name: 'Performance Rules', type: 'Performance', status: 'Active', description: 'Increase space for top-selling products and reduce space for slower-moving items.' },
      { name: 'Capacity / Fit', type: 'Capacity / Fit', status: 'Active', description: 'Ensure bulk packs are placed on lower shelves or base without exceeding limits.' },
      { name: 'Promotion Visibility', type: 'Visual', status: 'Active', description: 'Ensure promotional products are clearly visible and not blocked by other items.' },
      { name: 'Symmetry', type: 'Visual', status: 'Active', description: 'Maintain a balanced layout across left and right sides for better visual appeal.' },
    ],
  },
  {
    id: 'hol-corp-001',
    name: 'Holiday Decor - Compact',
    version: 'v1.3',
    sectionSize: '6ft',
    shelfCount: 4,
    image: '/assets/holiday-decor-display-compact.jpg',
    insights: ['Seasonal items at eye-level', 'Gift sets prominently placed', 'Value items at bottom'],
    categoryId: 'holiday',
    rules: [
      { name: 'Product Fit & Placement', type: 'Product Fit & Placement', status: 'Active', description: 'Place small decor on top shelves, medium items in the middle, and larger items on bottom or base.' },
      { name: 'Pack Behavior', type: 'Pack Behavior', status: 'Active', description: 'Hang ornaments and garlands on peg hooks and place boxed decor on shelves.' },
      { name: 'Adjacency Rules', type: 'Adjacency', status: 'Active', description: 'Group similar decor items such as ornaments with lights and candles together.' },
      { name: 'Assortment Rules', type: 'Assortment', status: 'Active', description: 'Ensure a mix of ornaments, lights, candles, and decor items without overcrowding.' },
      { name: 'Visual Merchandising', type: 'Visual', status: 'Active', description: 'Maintain clean spacing and group items by color or theme.' },
      { name: 'Theme Consistency', type: 'Visual', status: 'Active', description: 'Ensure decor items follow a consistent festive theme or color grouping.' },
      { name: 'Accessibility', type: 'Compliance', status: 'Active', description: 'Ensure frequently picked items are placed within easy reach for customers.' },
    ],
  },
  {
    id: 'hol-corp-002',
    name: 'Home Accent - End Cap',
    version: 'v2.0',
    sectionSize: '4ft',
    shelfCount: 3,
    image: '/assets/Home Accent Shelf - End Cap.png',
    insights: ['Premium gift focus', 'Impulse purchase zone', 'Cross-category bundling'],
    categoryId: 'holiday',
    rules: [
      { name: 'Product Fit & Placement', type: 'Product Fit & Placement', status: 'Active', description: 'Place small decor items on upper shelves, medium items at eye level, and large items on the base.' },
      { name: 'Adjacency Rules', type: 'Adjacency', status: 'Active', description: 'Place related items together such as frames with wall decor and candles with holders.' },
      { name: 'Brand / Theme Blocking', type: 'Brand Blocking', status: 'Active', description: 'Group products by style or theme such as modern or rustic.' },
      { name: 'Price Tier Rules', type: 'Price Tier', status: 'Active', description: 'Place premium items on top shelves and value items on lower shelves.' },
      { name: 'Visual Merchandising', type: 'Visual', status: 'Active', description: 'Maintain clean spacing and avoid clutter.' },
      { name: 'Stability', type: 'Compliance', status: 'Active', description: 'Ensure all items are placed securely and cannot easily fall or tip over.' },
      { name: 'Visibility', type: 'Visual', status: 'Active', description: 'Ensure all products are clearly visible and not hidden behind others.' },
    ],
  },
];

const storeGroups: StoreGroup[] = [
  { 
    id: 'campus', 
    name: 'Campus Pulse', 
    description: 'Younger shoppers. Impulse-driven trips. Single-serve and apartment-scale.', 
    storeCount: 184, 
    tags: ['High Impulse', 'Functional', 'Single-serve', 'Trend-driven'],
    assortment: { totalSKUs: 156, premium: 45, core: 78, value: 23, newItems: 10 }
  },
  { 
    id: 'family', 
    name: 'Family Stock-Up', 
    description: 'Larger baskets. Replenishment missions. Household-led purchasing.', 
    storeCount: 612, 
    tags: ['Bulk-friendly', 'Value-led', 'Replenishment', 'Multi-format'],
    assortment: { totalSKUs: 198, premium: 32, core: 95, value: 56, newItems: 15 }
  },
  { 
    id: 'rural', 
    name: 'Rural Core', 
    description: 'Essentials-heavy. Simpler assortment. Value orientation.', 
    storeCount: 452, 
    tags: ['Essentials-first', 'Value dominant', 'Community-anchored', 'Steady demand'],
    assortment: { totalSKUs: 112, premium: 18, core: 62, value: 28, newItems: 4 }
  },
  { 
    id: 'transit', 
    name: 'Value Transit', 
    description: 'Quick-stop trips. High visual readability. Impulse missions.', 
    storeCount: 148, 
    tags: ['Quick-stop', 'Impulse', 'Fast-fill', 'High readability'],
    assortment: { totalSKUs: 134, premium: 28, core: 72, value: 24, newItems: 10 }
  },
];

// POG to Store Group mapping - which clusters each POG is mapped to
const pogClusterMapping: Record<string, string[]> = {
  'bev-corp-001': ['campus', 'family', 'transit'],           // Beverage Cooler - 3 clusters
  'bev-corp-002': ['campus', 'family'],                       // Beverage Aisle Premium - 2 clusters
  'bev-corp-003': ['campus', 'transit', 'family', 'rural'],  // Beverage End Cap - 4 clusters
  'hol-corp-001': ['family', 'rural'],                        // Holiday Decor - 2 clusters
  'hol-corp-002': ['family', 'rural', 'transit'],            // Home Accent - 3 clusters
};

// Store group insights for business context
const _storeGroupInsights: Record<string, string> = {
  campus: 'High impulse store → prioritize single-serve and premium beverages',
  family: 'Family-oriented → emphasize multi-packs and value bundles',
  rural: 'Essential-focused → optimize for core SKUs and everyday value',
  transit: 'Quick-stop trips → focus on grab-and-go and impulse items',
};
void _storeGroupInsights; // Reserved for future use

// Category Demand Index data per category and cluster
interface DemandIndexItem {
  name: string;
  value: number;
}

const categoryDemandIndex: Record<string, Record<string, DemandIndexItem[]>> = {
  beverages: {
    campus: [
      { name: 'Energy', value: 145 },
      { name: 'Sports', value: 125 },
      { name: 'Functional', value: 115 },
      { name: 'Cola', value: 100 },
      { name: 'Water', value: 85 },
      { name: 'Juice', value: 70 },
      { name: 'Tea', value: 55 },
    ],
    family: [
      { name: 'Cola', value: 130 },
      { name: 'Water', value: 120 },
      { name: 'Juice', value: 115 },
      { name: 'Sports', value: 105 },
      { name: 'Energy', value: 90 },
      { name: 'Tea', value: 85 },
      { name: 'Functional', value: 75 },
    ],
    rural: [
      { name: 'Cola', value: 135 },
      { name: 'Water', value: 125 },
      { name: 'Tea', value: 110 },
      { name: 'Juice', value: 100 },
      { name: 'Sports', value: 80 },
      { name: 'Energy', value: 65 },
      { name: 'Functional', value: 50 },
    ],
    transit: [
      { name: 'Energy', value: 155 },
      { name: 'Functional', value: 130 },
      { name: 'Sports', value: 120 },
      { name: 'Water', value: 110 },
      { name: 'Cola', value: 95 },
      { name: 'Juice', value: 60 },
      { name: 'Tea', value: 45 },
    ],
  },
  holiday: {
    campus: [
      { name: 'Ornaments', value: 90 },
      { name: 'Lights', value: 85 },
      { name: 'Candles', value: 110 },
      { name: 'Gift Sets', value: 120 },
      { name: 'Decor', value: 95 },
    ],
    family: [
      { name: 'Ornaments', value: 135 },
      { name: 'Lights', value: 130 },
      { name: 'Gift Sets', value: 125 },
      { name: 'Decor', value: 115 },
      { name: 'Candles', value: 100 },
    ],
    rural: [
      { name: 'Lights', value: 125 },
      { name: 'Ornaments', value: 120 },
      { name: 'Candles', value: 110 },
      { name: 'Decor', value: 95 },
      { name: 'Gift Sets', value: 80 },
    ],
    transit: [
      { name: 'Gift Sets', value: 140 },
      { name: 'Candles', value: 125 },
      { name: 'Ornaments', value: 100 },
      { name: 'Lights', value: 85 },
      { name: 'Decor', value: 70 },
    ],
  },
};

// Helper to get demand index color
const getDemandIndexColor = (value: number): string => {
  if (value >= 120) return 'high';
  if (value >= 80) return 'neutral';
  return 'low';
};

// Helper to generate implication from demand index
const generateDemandImplication = (indexData: DemandIndexItem[]): string => {
  if (!indexData || indexData.length === 0) return '';
  const sorted = [...indexData].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 2).map(i => i.name.toLowerCase());
  const low = sorted.slice(-2).map(i => i.name.toLowerCase());
  return `Shift assortment toward ${top.join(' and ')}; reduce emphasis on ${low.join(' and ')}.`;
};

// Mock Published Results (reserved for demo/testing)
const _mockPublishedResults: LocalizationResult[] = [
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
void _mockPublishedResults; // Reserved for demo/testing

export const POGLocalizationEngine: React.FC = () => {
  const navigate = useNavigate();
  const { addTasks } = useExecutionTasks();
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
  const [publishedResults, setPublishedResults] = useState<LocalizationResult[]>([]);
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
    
    // Get context for business-specific changes
    const storeGroup = storeGroups.find(g => g.id === selectedStoreGroup);
    const _categoryName = categories.find(c => c.id === selectedCategory)?.name || 'Beverages';
    void _categoryName; // Reserved for future use
    const demandData = categoryDemandIndex[selectedCategory!]?.[selectedStoreGroup!] || [];
    const topDemand = [...demandData].sort((a, b) => b.value - a.value)[0];
    const lowDemand = [...demandData].sort((a, b) => a.value - b.value)[0];
    
    // Generate business-specific stage data based on context
    const stageReasonings = selectedCategory === 'beverages' ? {
      geometry: {
        reasoning: `Configured ${selectedPOG?.sectionSize} section for ${storeGroup?.name} store format`,
        details: [
          `Adjusted shelf depth to ${storeGroup?.id === 'campus' ? '14"' : '16"'} for ${storeGroup?.id === 'campus' ? 'grab-and-go' : 'family pack'} accessibility`,
          `Set ${selectedPOG?.shelfCount} shelf heights for optimal ${storeGroup?.id === 'campus' ? 'single-serve' : 'multi-pack'} visibility`,
          `Configured cooler door zones for ${storeGroup?.id === 'rural' ? 'bulk hydration' : 'impulse beverages'}`
        ],
      },
      demand: {
        reasoning: `Increased ${topDemand?.name || 'Energy'} facings by ${Math.round((topDemand?.value || 120) - 100)}% based on ${storeGroup?.name} velocity`,
        details: [
          `${topDemand?.name || 'Energy'} expanded to ${Math.round((topDemand?.value || 120) / 10)} facings (demand index: ${topDemand?.value || 120})`,
          `${storeGroup?.id === 'campus' ? 'Single-serve premium' : 'Family-size value'} moved to eye-level shelf`,
          `${lowDemand?.name || 'Water'} reduced by ${Math.round(100 - (lowDemand?.value || 85))}% to reallocate space`
        ],
      },
      policy: {
        reasoning: `Validated against ${selectedPOG?.rules.length || 5} category merchandising rules`,
        details: [
          `Brand blocking: ${storeGroup?.id === 'family' ? 'National brands grouped by segment' : 'Competitive brands separated'}`,
          `Adjacency rule: ${storeGroup?.id === 'campus' ? 'Energy adjacent to sports drinks' : 'Cola brands blocked together'}`,
          `Min facing rule: All SKUs meet ${storeGroup?.id === 'rural' ? '2-facing' : '1-facing'} minimum`
        ],
      },
      execution: {
        reasoning: `Generated ${Math.round((storeGroup?.storeCount || 50) * 0.4)} store-level execution tasks`,
        details: [
          `${Math.round((storeGroup?.storeCount || 50) * 0.25)} shelf label updates required`,
          `${Math.round((storeGroup?.storeCount || 50) * 0.1)} product relocations across sections`,
          `${Math.round((storeGroup?.storeCount || 50) * 0.05)} cooler door reconfigurations`
        ],
      },
    } : {
      geometry: {
        reasoning: `Adapted ${selectedPOG?.sectionSize} holiday display for ${storeGroup?.name} traffic patterns`,
        details: [
          `Configured ${storeGroup?.id === 'family' ? 'family browsing' : 'quick-shop'} aisle flow`,
          `Set feature display heights for ${storeGroup?.id === 'rural' ? 'bulk seasonal' : 'curated gift'} presentation`,
          `Allocated ${storeGroup?.id === 'campus' ? 'compact' : 'expanded'} endcap zones`
        ],
      },
      demand: {
        reasoning: `Prioritized ${topDemand?.name || 'Premium Decor'} based on ${storeGroup?.name} seasonal trends`,
        details: [
          `${topDemand?.name || 'Premium Decor'} featured at ${storeGroup?.id === 'family' ? 'family eye-level' : 'impulse zones'}`,
          `${storeGroup?.id === 'value' ? 'Value bundles' : 'Gift sets'} positioned for ${storeGroup?.id === 'value' ? 'deal seekers' : 'convenience'}`,
          `${lowDemand?.name || 'Basic Decor'} consolidated to ${storeGroup?.id === 'rural' ? 'bulk bins' : 'lower shelves'}`
        ],
      },
      policy: {
        reasoning: `Validated seasonal merchandising and safety compliance`,
        details: [
          `Height restriction: All displays under ${storeGroup?.id === 'campus' ? '5ft' : '6ft'} threshold`,
          `Fire safety: Aisle clearance maintained at 36" minimum`,
          `ADA compliance: Feature displays accessible from main aisle`
        ],
      },
      execution: {
        reasoning: `Generated ${Math.round((storeGroup?.storeCount || 50) * 0.5)} seasonal reset tasks`,
        details: [
          `${Math.round((storeGroup?.storeCount || 50) * 0.3)} feature display builds`,
          `${Math.round((storeGroup?.storeCount || 50) * 0.15)} endcap resets`,
          `${Math.round((storeGroup?.storeCount || 50) * 0.05)} signage installations`
        ],
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

    // Calculate dynamic metrics based on context
    const facingsChanged = Math.round((topDemand?.value || 120) / 8);
    const tasksCount = Math.round((storeGroup?.storeCount || 50) * 0.4);
    const premiumShiftPct = storeGroup?.id === 'campus' ? '+18%' : storeGroup?.id === 'family' ? '+8%' : '+12%';
    const valueShiftPct = storeGroup?.id === 'value' ? '+5%' : '-8%';

    const result: LocalizationResult = {
      id: `loc-${Date.now()}`,
      cluster: storeGroup?.name || 'Unknown',
      version: 'v1.0',
      status: 'Ready',
      confidenceScore: Math.round(88 + Math.random() * 8),
      corporatePOG: selectedPOG?.name || '',
      corporatePOGId: selectedPOG?.id || '',
      storeGroup: storeGroup?.name || '',
      category: categories.find(c => c.id === selectedCategory)?.name || '',
      createdAt: new Date().toISOString().split('T')[0],
      changes: {
        facingsAdjusted: facingsChanged,
        premiumShift: premiumShiftPct,
        valuePLShift: valueShiftPct,
        tasksGenerated: tasksCount,
      },
      whyChanged: selectedCategory === 'beverages' ? [
        { 
          title: `${topDemand?.name || 'Energy'} moved to eye-level`, 
          reason: `${storeGroup?.name} shoppers show ${Math.round((topDemand?.value || 120) - 100)}% higher demand index for ${topDemand?.name || 'Energy'} vs. corporate average` 
        },
        { 
          title: `${lowDemand?.name || 'Water'} allocation reduced`, 
          reason: `Lower velocity (index: ${lowDemand?.value || 85}) allows space reallocation to higher-margin ${storeGroup?.id === 'campus' ? 'single-serve' : 'multi-pack'} SKUs` 
        },
        { 
          title: `${storeGroup?.id === 'campus' ? 'Grab-and-go' : 'Family pack'} zone expanded`, 
          reason: `${storeGroup?.name} trip mission data shows ${storeGroup?.id === 'campus' ? '73% impulse' : '62% stock-up'} purchase behavior` 
        },
        { 
          title: 'Brand blocking optimized', 
          reason: `Adjacency rules applied to maintain competitive separation while maximizing ${storeGroup?.id === 'family' ? 'brand loyalty' : 'trial rate'}` 
        },
      ] : [
        { 
          title: `${topDemand?.name || 'Premium Decor'} featured prominently`, 
          reason: `${storeGroup?.name} seasonal trends show ${Math.round((topDemand?.value || 115) - 100)}% lift in ${topDemand?.name || 'Premium Decor'} category` 
        },
        { 
          title: 'Gift-ready displays prioritized', 
          reason: `${storeGroup?.id === 'family' ? 'Family gifting' : 'Convenience gifting'} behavior drives ${storeGroup?.id === 'family' ? '45%' : '28%'} of holiday purchases` 
        },
        { 
          title: `${lowDemand?.name || 'Basic Decor'} consolidated`, 
          reason: `Lower demand index (${lowDemand?.value || 80}) allows consolidation to ${storeGroup?.id === 'rural' ? 'bulk display' : 'value section'}` 
        },
        { 
          title: 'Seasonal compliance verified', 
          reason: 'All displays meet height, safety, and accessibility requirements for holiday traffic' 
        },
      ],
      agenticSummary: [
        `${selectedPOG?.rules.length || 5} policies validated`, 
        `${tasksCount} execution tasks ready`, 
        `${topDemand?.name || 'Top category'} optimized for ${storeGroup?.name}`
      ],
      diffHighlights: selectedCategory === 'beverages' ? [
        `${topDemand?.name || 'Energy'} +${Math.round((topDemand?.value || 120) / 30)} facings`,
        `${lowDemand?.name || 'Water'} -${Math.round((100 - (lowDemand?.value || 85)) / 10)} facings`,
        `${storeGroup?.id === 'campus' ? 'Single-serve' : 'Multi-pack'} to shelf 2`,
        `${storeGroup?.id === 'value' ? 'Value tier expanded' : 'Premium tier prioritized'}`
      ] : [
        `${topDemand?.name || 'Premium'} +${Math.round((topDemand?.value || 115) / 25)} displays`,
        `${lowDemand?.name || 'Basic'} consolidated`,
        `Gift section ${storeGroup?.id === 'family' ? 'expanded' : 'optimized'}`,
        `Seasonal endcaps configured`
      ],
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
    const result = publishedResults.find(r => r.id === resultId);
    if (!result) return;

    // Generate human-readable execution tasks based on the localization result
    const generatedTasks: ExecutionTask[] = [];
    const timestamp = new Date().toISOString();
    const storeGroup = storeGroups.find(g => g.name === result.storeGroup);
    const _storeCount = storeGroup?.storeCount || 50;
    void _storeCount; // Reserved for future use

    // Task 1: Shelf Reset for high-demand subcategories
    generatedTasks.push({
      id: `task-${resultId}-1`,
      type: 'Reset Shelf',
      title: `Reset ${result.category} section for ${result.storeGroup} stores`,
      description: `Complete shelf reset required to implement localized planogram. Remove all products from shelves 1-${Math.min(5, storeGroup?.storeCount ? 4 : 3)}, clean fixtures, and restock according to new layout specifications.`,
      priority: 'High',
      reason: `Localization engine identified ${result.changes.facingsAdjusted} facing adjustments needed to optimize for ${result.storeGroup} shopper behavior`,
      impact: `Expected ${result.changes.premiumShift} improvement in premium tier visibility and sales conversion`,
      status: 'Pending',
      assignedTo: null,
      dueDate: null,
      storeName: `All ${result.storeGroup} stores`,
      storeGroup: result.storeGroup,
      pogName: result.corporatePOG,
      category: result.category,
      createdAt: timestamp,
      localizationId: resultId,
    });

    // Task 2: Move high-velocity items to eye-level
    const topChange = result.diffHighlights[0] || 'Premium items';
    generatedTasks.push({
      id: `task-${resultId}-2`,
      type: 'Move',
      title: `Relocate ${topChange.split(' ')[0]} products to eye-level shelf`,
      description: `Move ${topChange.split(' ')[0]} category products from current position to Shelf 2 (eye-level, 48-60 inches from floor). Ensure brand blocking is maintained and price tags are updated.`,
      fromPosition: 'Current shelf location',
      toPosition: 'Shelf 2 (Eye-level)',
      priority: 'High',
      reason: `${result.storeGroup} demand index shows ${topChange.includes('+') ? 'higher' : 'adjusted'} velocity for this subcategory`,
      impact: `Projected +12-18% sales lift from improved visibility and accessibility`,
      status: 'Pending',
      assignedTo: null,
      dueDate: null,
      storeName: `All ${result.storeGroup} stores`,
      storeGroup: result.storeGroup,
      pogName: result.corporatePOG,
      category: result.category,
      createdAt: timestamp,
      localizationId: resultId,
    });

    // Task 3: Adjust facings based on demand
    generatedTasks.push({
      id: `task-${resultId}-3`,
      type: 'Adjust Facing',
      title: `Adjust product facings across ${result.category} section`,
      description: `Increase facings for high-demand SKUs and reduce facings for slower-moving items. Total of ${result.changes.facingsAdjusted} facing changes required. Refer to localized planogram for specific SKU-level instructions.`,
      fromFacings: Math.round(result.changes.facingsAdjusted * 0.6),
      toFacings: result.changes.facingsAdjusted,
      priority: 'Medium',
      reason: `Demand rebalancing analysis identified space optimization opportunities for ${result.storeGroup} shopping patterns`,
      impact: `Reduces out-of-stock risk by 25% while improving space productivity`,
      status: 'Pending',
      assignedTo: null,
      dueDate: null,
      storeName: `All ${result.storeGroup} stores`,
      storeGroup: result.storeGroup,
      pogName: result.corporatePOG,
      category: result.category,
      createdAt: timestamp,
      localizationId: resultId,
    });

    // Task 4: Update shelf labels and price tags
    generatedTasks.push({
      id: `task-${resultId}-4`,
      type: 'Update Label',
      title: `Update shelf labels and price tags for relocated items`,
      description: `Print and install new shelf labels for all relocated products. Ensure UPC codes are visible, prices are current, and promotional tags are properly positioned. Remove outdated labels from previous locations.`,
      priority: 'Medium',
      reason: `Product relocations require updated shelf labeling for customer navigation and checkout accuracy`,
      impact: `Maintains pricing accuracy and reduces checkout errors by 15%`,
      status: 'Pending',
      assignedTo: null,
      dueDate: null,
      storeName: `All ${result.storeGroup} stores`,
      storeGroup: result.storeGroup,
      pogName: result.corporatePOG,
      category: result.category,
      createdAt: timestamp,
      localizationId: resultId,
    });

    // Task 5: Verify compliance with planogram
    generatedTasks.push({
      id: `task-${resultId}-5`,
      type: 'Add',
      title: `Verify planogram compliance and capture photo evidence`,
      description: `After completing all shelf changes, verify the section matches the localized planogram. Capture photos of each shelf and upload to the compliance system. Flag any discrepancies or missing products.`,
      priority: 'Low',
      reason: `Compliance verification ensures execution accuracy and enables performance tracking`,
      impact: `Enables ${result.confidenceScore}% confidence score validation and continuous improvement`,
      status: 'Pending',
      assignedTo: null,
      dueDate: null,
      storeName: `All ${result.storeGroup} stores`,
      storeGroup: result.storeGroup,
      pogName: result.corporatePOG,
      category: result.category,
      createdAt: timestamp,
      localizationId: resultId,
    });

    // Add tasks to the shared context
    addTasks(generatedTasks);

    // Update the result status to Published
    setPublishedResults(prev => prev.map(r => 
      r.id === resultId ? { ...r, status: 'Published' as const } : r
    ));

    // Navigate to Store Execution Task List
    navigate('/planogram/store-execution');
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
              <div className="loc-rules-section premium">
                <div className="loc-rules-header">
                  <ShieldCheck size={16} />
                  <span>Applicable Rules ({selectedPOG.rules.length})</span>
                </div>
                <div className="loc-rules-list-premium">
                  {selectedPOG.rules.map((rule, idx) => (
                    <div key={idx} className="loc-rule-card">
                      <div className="loc-rule-card-header">
                        <span className="loc-rule-name">{rule.name}</span>
                        <div className="loc-rule-badges">
                          <span className="loc-rule-type-badge">{rule.type}</span>
                          <span className={`loc-rule-status-badge ${rule.status.toLowerCase()}`}>
                            {rule.status === 'Warning' && <AlertCircle size={10} />}
                            {rule.status}
                          </span>
                        </div>
                      </div>
                      {rule.description && (
                        <p className="loc-rule-description">{rule.description}</p>
                      )}
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
    // Filter store groups based on selected POG's cluster mapping
    const availableGroups = selectedPOG 
      ? storeGroups.filter(g => pogClusterMapping[selectedPOG.id]?.includes(g.id))
      : storeGroups;
    
    return (
      <div className="loc-step-content">
        <h3 className="loc-step-title">Select Store Group</h3>
        <p className="loc-step-description">Select the store group this planogram should be localized for. Each group has a distinct shopper profile, basket behavior, and space footprint.</p>
        
        <div className="loc-store-group-grid">
          {availableGroups.map(group => (
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

        {/* Category Demand Index */}
        {selectedGroup && selectedCategory && (
          <>
            <div className="loc-demand-index-panel">
              <div className="loc-demand-index-header">
                <div className="loc-demand-index-title">
                  <BarChart3 size={18} />
                  <h4>Category Demand Index</h4>
                  <div className="loc-demand-index-tooltip" title="Index shows how strongly a category performs in this store group compared to average stores. Values above 100 indicate higher demand.">
                    <Info size={14} />
                  </div>
                </div>
                <span className="loc-demand-index-subtitle">Relative demand vs average store (100 = baseline)</span>
              </div>
              <div className="loc-demand-index-bars">
                {(categoryDemandIndex[selectedCategory]?.[selectedStoreGroup!] || [])
                  .sort((a, b) => b.value - a.value)
                  .map((item, idx) => {
                    const maxValue = 160;
                    const barWidth = Math.min((item.value / maxValue) * 100, 100);
                    const colorClass = getDemandIndexColor(item.value);
                    const isTop = idx < 2;
                    return (
                      <div key={item.name} className={`loc-demand-bar-row ${isTop ? 'highlight' : ''}`}>
                        <span className="loc-demand-bar-label">{item.name}</span>
                        <div className="loc-demand-bar-track">
                          <div 
                            className={`loc-demand-bar-fill ${colorClass}`} 
                            style={{ width: `${barWidth}%` }}
                          />
                          <div className="loc-demand-bar-baseline" style={{ left: `${(100/maxValue)*100}%` }} />
                        </div>
                        <span className={`loc-demand-bar-value ${colorClass}`}>{item.value}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="loc-agentic-insight-banner">
              <Zap size={18} />
              <span>
                <strong>Implication:</strong> {generateDemandImplication(categoryDemandIndex[selectedCategory]?.[selectedStoreGroup!] || [])}
              </span>
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
                <img 
                  src={showCorporateView 
                    ? (corpPOG?.image || '/planograms/beverage-cooler-standard.svg')
                    : (localizedImageMap[corpPOG?.image || ''] || corpPOG?.image || '/planograms/beverage-cooler-standard.svg')
                  } 
                  alt="Planogram" 
                  className={showCorporateView ? 'corporate' : 'localized'} 
                />
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
