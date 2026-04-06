import React, { useState, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  ChevronRight,
  ChevronLeft,
  FileText,
  Check,
  Circle,
  Upload,
  ChevronDown,
  Ruler,
  LayoutGrid,
  Layers,
  ArrowLeftRight,
  PackageCheck,
  PackageX,
  Star,
  Box,
  Building2
} from 'lucide-react';
import './POGRuleManagement.css';

// Types
type RuleType = 'Dimensional' | 'Facing' | 'Brand Blocking' | 'Adjacency' | 'Mandatory SKU' | 'Prohibited SKU' | 'Priority' | 'Fixture-Specific' | 'Cluster-Specific';
type RuleStatus = 'Active' | 'Inactive' | 'Draft';

interface RuleMapping {
  categories: string[];
  clusters: string[];
  fixtures: string[];
}

interface Rule {
  id: string;
  name: string;
  description: string;
  types: RuleType[];
  mapping: RuleMapping;
  lastUpdated: string;
  status: RuleStatus;
  definition: Record<string, any>;
  completedSteps: number[];
}

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

const wizardSteps: WizardStep[] = [
  { id: 1, title: 'Basic Info', description: 'Name and description' },
  { id: 2, title: 'Rule Types', description: 'Select one or more rule types' },
  { id: 3, title: 'Rule Definition', description: 'Configure rule parameters' },
  { id: 4, title: 'Mapping', description: 'Apply to categories, clusters, fixtures' },
];

const ruleTypeIcons: Record<RuleType, React.ReactNode> = {
  'Dimensional': <Ruler size={20} />,
  'Facing': <LayoutGrid size={20} />,
  'Brand Blocking': <Layers size={20} />,
  'Adjacency': <ArrowLeftRight size={20} />,
  'Mandatory SKU': <PackageCheck size={20} />,
  'Prohibited SKU': <PackageX size={20} />,
  'Priority': <Star size={20} />,
  'Fixture-Specific': <Box size={20} />,
  'Cluster-Specific': <Building2 size={20} />,
};

const ruleTypeOptions: { value: RuleType; label: string; description: string }[] = [
  { value: 'Dimensional', label: 'Dimensional', description: 'Size constraints' },
  { value: 'Facing', label: 'Facing', description: 'Product facings' },
  { value: 'Brand Blocking', label: 'Brand Blocking', description: 'Group by brand' },
  { value: 'Adjacency', label: 'Adjacency', description: 'Placement rules' },
  { value: 'Mandatory SKU', label: 'Mandatory SKU', description: 'Required SKUs' },
  { value: 'Prohibited SKU', label: 'Prohibited SKU', description: 'Excluded SKUs' },
  { value: 'Priority', label: 'Priority', description: 'Eye-level placement' },
  { value: 'Fixture-Specific', label: 'Fixture-Specific', description: 'Fixture rules' },
  { value: 'Cluster-Specific', label: 'Cluster-Specific', description: 'Cluster rules' },
];

const allCategories = [
  'Beverages', 'Carbonated Drinks', 'Energy Drinks', 'Juices', 'Water',
  'Holiday Decor & Home Accent', 'Snacks', 'Chips', 'Cookies', 'Crackers',
  'Dairy', 'Milk', 'Cheese', 'Yogurt', 'Frozen', 'Ice Cream', 'Frozen Meals',
  'Personal Care', 'Shampoo', 'Soap', 'Household', 'Cleaning', 'Paper Products'
];

const allSKUs = [
  { id: 'SKU-001', name: 'Coca Cola 500ml', category: 'Beverages' },
  { id: 'SKU-002', name: 'Pepsi 500ml', category: 'Beverages' },
  { id: 'SKU-003', name: 'Sprite 500ml', category: 'Beverages' },
  { id: 'SKU-004', name: 'Fanta 500ml', category: 'Beverages' },
  { id: 'SKU-005', name: 'Mountain Dew 500ml', category: 'Beverages' },
  { id: 'SKU-006', name: 'Store Brand Cola 500ml', category: 'Beverages' },
  { id: 'SKU-007', name: 'Diet Coke 500ml', category: 'Beverages' },
  { id: 'SKU-008', name: 'Pepsi Zero 500ml', category: 'Beverages' },
  { id: 'SKU-009', name: 'Red Bull 250ml', category: 'Energy Drinks' },
  { id: 'SKU-010', name: 'Monster Energy 500ml', category: 'Energy Drinks' },
  { id: 'SKU-011', name: 'Lays Classic 150g', category: 'Snacks' },
  { id: 'SKU-012', name: 'Doritos Nacho 180g', category: 'Snacks' },
  { id: 'SKU-013', name: 'Oreo Original 150g', category: 'Cookies' },
  { id: 'SKU-014', name: 'Whole Milk 1L', category: 'Dairy' },
  { id: 'SKU-015', name: 'Greek Yogurt 500g', category: 'Dairy' },
];

const clusterOptions = ['Urban Cluster', 'Suburban Cluster', 'Rural Cluster', 'Store #102', 'Store #105', 'Store #110', 'Premium Stores', 'Value Stores'];
const fixtureOptions = ['4ft Shelf', '6ft Shelf', '8ft Shelf', 'Cooler', 'End Cap', 'Gondola', 'Checkout Display', 'Floor Stand'];
const brandOptions = ['Coca-Cola', 'Pepsi', 'Nestle', 'Kraft', 'Unilever', 'P&G', 'Store Brand', 'Local Brand'];

const initialMockRules: Rule[] = [
  {
    id: 'RULE-001',
    name: 'Minimum Facing - Beverages',
    description: 'Ensure minimum product visibility for beverage category',
    types: ['Facing'],
    mapping: { categories: ['Beverages'], clusters: ['Urban Cluster', 'Suburban Cluster'], fixtures: ['6ft Shelf', 'Cooler'] },
    lastUpdated: '2024-03-15',
    status: 'Active',
    definition: { Facing: { minFacings: 2, maxFacings: 6 } },
    completedSteps: [1, 2, 3, 4],
  },
  {
    id: 'RULE-002',
    name: 'Brand Blocking & Priority - Cola',
    description: 'Group cola products and prioritize store brand',
    types: ['Brand Blocking', 'Priority'],
    mapping: { categories: ['Beverages'], clusters: [], fixtures: ['6ft Shelf'] },
    lastUpdated: '2024-03-14',
    status: 'Active',
    definition: { 
      'Brand Blocking': { brand: 'Coca-Cola', blockingType: 'Vertical', minProducts: 3 },
      'Priority': { target: 'Store Brand', placement: 'Eye-level', priority: 'High' }
    },
    completedSteps: [1, 2, 3, 4],
  },
  {
    id: 'RULE-003',
    name: 'Mandatory & Prohibited SKUs',
    description: 'Require Coca Cola, exclude competitor in premium stores',
    types: ['Mandatory SKU', 'Prohibited SKU'],
    mapping: { categories: ['Beverages'], clusters: ['Premium Stores'], fixtures: [] },
    lastUpdated: '2024-03-12',
    status: 'Active',
    definition: { 
      'Mandatory SKU': { skus: ['SKU-001'], minQuantity: 2 },
      'Prohibited SKU': { skus: ['SKU-002'], reason: 'Competitor exclusion' }
    },
    completedSteps: [1, 2, 3, 4],
  },
  {
    id: 'RULE-004',
    name: 'Draft - New Combined Rule',
    description: 'Work in progress',
    types: ['Adjacency'],
    mapping: { categories: [], clusters: [], fixtures: [] },
    lastUpdated: '2024-03-18',
    status: 'Draft',
    definition: {},
    completedSteps: [1, 2],
  },
];

interface Filters {
  ruleType: string;
  category: string;
  mappingStatus: string;
  ruleStatus: string;
}

const emptyRule: Partial<Rule> = {
  name: '',
  description: '',
  types: [],
  mapping: { categories: [], clusters: [], fixtures: [] },
  status: 'Draft',
  definition: {},
  completedSteps: [],
};

// Searchable Dropdown Component
const SearchableDropdown: React.FC<{
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  allowUpload?: boolean;
  onUpload?: (items: string[]) => void;
}> = ({ options, selected, onChange, placeholder, allowUpload, onUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase()) && !selected.includes(opt)
  );

  const handleSelect = (item: string) => {
    onChange([...selected, item]);
    setSearch('');
  };

  const handleRemove = (item: string) => {
    onChange(selected.filter(s => s !== item));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const items = text.split(/[\n,]/).map(s => s.trim()).filter(s => s.length > 0);
        if (onUpload) onUpload(items);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="searchable-dropdown">
      <div className="dropdown-selected-items">
        {selected.map(item => (
          <span key={item} className="dropdown-tag">
            {item}
            <button onClick={() => handleRemove(item)}><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="dropdown-input-wrapper">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length === 0 ? placeholder : 'Add more...'}
          className="dropdown-search-input"
        />
        <ChevronDown size={16} className="dropdown-chevron" />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {filteredOptions.length > 0 ? (
            filteredOptions.slice(0, 10).map(opt => (
              <div key={opt} className="dropdown-item" onClick={() => handleSelect(opt)}>
                {opt}
              </div>
            ))
          ) : (
            <div className="dropdown-empty">No matches found</div>
          )}
          {filteredOptions.length > 10 && (
            <div className="dropdown-more">+{filteredOptions.length - 10} more items</div>
          )}
        </div>
      )}
      {allowUpload && (
        <div className="dropdown-upload">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.txt" style={{ display: 'none' }} />
          <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
            <Upload size={14} /> Upload CSV/TXT
          </button>
        </div>
      )}
      {isOpen && <div className="dropdown-backdrop" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export const POGRuleManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'builder'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [rules, setRules] = useState<Rule[]>(initialMockRules);
  const [filters, setFilters] = useState<Filters>({ ruleType: '', category: '', mappingStatus: '', ruleStatus: '' });
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<Rule | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [builderForm, setBuilderForm] = useState<Partial<Rule>>(emptyRule);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const isMapped = (rule: Rule | Partial<Rule>): boolean => {
    const mapping = rule.mapping;
    if (!mapping) return false;
    return mapping.categories.length > 0 || mapping.clusters.length > 0 || mapping.fixtures.length > 0;
  };

  const unmappedCount = rules.filter(r => !isMapped(r) && r.status !== 'Draft').length;
  const draftCount = rules.filter(r => r.status === 'Draft').length;

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearAllFilters = () => {
    setFilters({ ruleType: '', category: '', mappingStatus: '', ruleStatus: '' });
    setSearchQuery('');
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) || rule.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filters.ruleType || rule.types.includes(filters.ruleType as RuleType);
    const matchesCategory = !filters.category || rule.mapping.categories.includes(filters.category);
    const matchesMappingStatus = !filters.mappingStatus || 
      (filters.mappingStatus === 'Mapped' && isMapped(rule)) ||
      (filters.mappingStatus === 'Unmapped' && !isMapped(rule));
    const matchesRuleStatus = !filters.ruleStatus || rule.status === filters.ruleStatus;
    return matchesSearch && matchesType && matchesCategory && matchesMappingStatus && matchesRuleStatus;
  });

  const handleViewRule = (rule: Rule) => setSelectedRule(rule);

  const handleEditRule = (rule: Rule) => {
    setBuilderForm({ ...rule });
    setIsEditing(true);
    setEditingRuleId(rule.id);
    setCurrentStep(rule.status === 'Draft' ? Math.max(...rule.completedSteps, 1) : 1);
    setActiveTab('builder');
  };

  const handleDeleteClick = (rule: Rule) => {
    setRuleToDelete(rule);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      setRules(prev => prev.filter(r => r.id !== ruleToDelete.id));
      setShowDeleteModal(false);
      setRuleToDelete(null);
    }
  };

  const handleCreateNew = () => {
    setBuilderForm({ ...emptyRule });
    setIsEditing(false);
    setEditingRuleId(null);
    setCurrentStep(1);
    setActiveTab('builder');
  };

  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 1: return !!builderForm.name && builderForm.name.length > 0;
      case 2: return (builderForm.types?.length || 0) > 0;
      case 3: return Object.keys(builderForm.definition || {}).length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const canProceedToStep = (stepId: number): boolean => {
    for (let i = 1; i < stepId; i++) {
      if (!isStepComplete(i)) return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep < 4 && isStepComplete(currentStep)) {
      const newCompletedSteps = [...(builderForm.completedSteps || [])];
      if (!newCompletedSteps.includes(currentStep)) newCompletedSteps.push(currentStep);
      setBuilderForm(prev => ({ ...prev, completedSteps: newCompletedSteps }));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSaveDraft = () => {
    const newCompletedSteps = [...(builderForm.completedSteps || [])];
    if (isStepComplete(currentStep) && !newCompletedSteps.includes(currentStep)) newCompletedSteps.push(currentStep);
    const draftRule: Rule = {
      id: editingRuleId || `RULE-${String(rules.length + 1).padStart(3, '0')}`,
      name: builderForm.name || 'Untitled Rule',
      description: builderForm.description || '',
      types: builderForm.types || [],
      mapping: builderForm.mapping || { categories: [], clusters: [], fixtures: [] },
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Draft',
      definition: builderForm.definition || {},
      completedSteps: newCompletedSteps,
    };
    if (isEditing && editingRuleId) {
      setRules(prev => prev.map(r => r.id === editingRuleId ? draftRule : r));
    } else {
      setRules(prev => [...prev, draftRule]);
    }
    setActiveTab('library');
    resetBuilder();
  };

  const handleSaveRule = () => {
    if (!builderForm.name || !builderForm.types?.length) return;
    const newRule: Rule = {
      id: editingRuleId || `RULE-${String(rules.length + 1).padStart(3, '0')}`,
      name: builderForm.name,
      description: builderForm.description || '',
      types: builderForm.types,
      mapping: builderForm.mapping || { categories: [], clusters: [], fixtures: [] },
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Active',
      definition: builderForm.definition || {},
      completedSteps: [1, 2, 3, 4],
    };
    if (isEditing && editingRuleId) {
      setRules(prev => prev.map(r => r.id === editingRuleId ? newRule : r));
    } else {
      setRules(prev => [...prev, newRule]);
    }
    setActiveTab('library');
    resetBuilder();
  };

  const resetBuilder = () => {
    setBuilderForm({ ...emptyRule });
    setIsEditing(false);
    setEditingRuleId(null);
    setCurrentStep(1);
  };

  const handleTypeToggle = (type: RuleType) => {
    const currentTypes = builderForm.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    const newDefinition = { ...builderForm.definition };
    if (!newTypes.includes(type)) delete newDefinition[type];
    setBuilderForm(prev => ({ ...prev, types: newTypes, definition: newDefinition }));
  };

  const handleMappingChange = (field: keyof RuleMapping, values: string[]) => {
    setBuilderForm(prev => ({ ...prev, mapping: { ...prev.mapping!, [field]: values } }));
  };

  const renderMappingBadges = (items: string[], max: number = 2) => {
    if (items.length === 0) return <span className="rule-no-mapping">—</span>;
    const displayed = items.slice(0, max);
    const remaining = items.length - max;
    return (
      <div className="rule-mapping-badges">
        {displayed.map(item => (<span key={item} className="rule-mapping-badge">{item}</span>))}
        {remaining > 0 && <span className="rule-mapping-more">+{remaining}</span>}
      </div>
    );
  };

  const getTypeBadgeClass = (type: RuleType): string => {
    const typeMap: Record<RuleType, string> = {
      'Dimensional': 'type-dimensional', 'Facing': 'type-facing', 'Brand Blocking': 'type-brand-blocking',
      'Adjacency': 'type-adjacency', 'Mandatory SKU': 'type-mandatory-sku', 'Prohibited SKU': 'type-prohibited-sku',
      'Priority': 'type-priority', 'Fixture-Specific': 'type-fixture', 'Cluster-Specific': 'type-cluster',
    };
    return typeMap[type] || '';
  };

  const updateDefinition = (type: RuleType, field: string, value: any) => {
    setBuilderForm(prev => ({
      ...prev,
      definition: {
        ...prev.definition,
        [type]: { ...(prev.definition?.[type] || {}), [field]: value }
      }
    }));
  };

  const renderDefinitionForType = (type: RuleType) => {
    const def = builderForm.definition?.[type] || {};
    
    switch (type) {
      case 'Facing':
        return (
          <div className="type-definition-card">
            <h4>🔢 Facing Rules</h4>
            <div className="wizard-field-row">
              <div className="wizard-field-group">
                <label>Min Facings</label>
                <input type="number" min="1" value={def.minFacings || ''} onChange={(e) => updateDefinition(type, 'minFacings', parseInt(e.target.value) || 0)} placeholder="2" />
              </div>
              <div className="wizard-field-group">
                <label>Max Facings</label>
                <input type="number" min="1" value={def.maxFacings || ''} onChange={(e) => updateDefinition(type, 'maxFacings', parseInt(e.target.value) || 0)} placeholder="6" />
              </div>
            </div>
          </div>
        );
      case 'Dimensional':
        return (
          <div className="type-definition-card">
            <h4>📐 Dimensional Rules</h4>
            <div className="wizard-field-row">
              <div className="wizard-field-group"><label>Min Width (in)</label><input type="number" value={def.minWidth || ''} onChange={(e) => updateDefinition(type, 'minWidth', parseInt(e.target.value) || 0)} /></div>
              <div className="wizard-field-group"><label>Max Width (in)</label><input type="number" value={def.maxWidth || ''} onChange={(e) => updateDefinition(type, 'maxWidth', parseInt(e.target.value) || 0)} /></div>
              <div className="wizard-field-group"><label>Min Height (in)</label><input type="number" value={def.minHeight || ''} onChange={(e) => updateDefinition(type, 'minHeight', parseInt(e.target.value) || 0)} /></div>
              <div className="wizard-field-group"><label>Max Height (in)</label><input type="number" value={def.maxHeight || ''} onChange={(e) => updateDefinition(type, 'maxHeight', parseInt(e.target.value) || 0)} /></div>
            </div>
          </div>
        );
      case 'Brand Blocking':
        return (
          <div className="type-definition-card">
            <h4>🏷️ Brand Blocking Rules</h4>
            <div className="wizard-field-row">
              <div className="wizard-field-group">
                <label>Brand</label>
                <select value={def.brand || ''} onChange={(e) => updateDefinition(type, 'brand', e.target.value)}>
                  <option value="">Select Brand</option>
                  {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="wizard-field-group">
                <label>Blocking Type</label>
                <select value={def.blockingType || ''} onChange={(e) => updateDefinition(type, 'blockingType', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Vertical">Vertical</option>
                  <option value="Horizontal">Horizontal</option>
                  <option value="Block">Block</option>
                </select>
              </div>
              <div className="wizard-field-group"><label>Min Products</label><input type="number" value={def.minProducts || ''} onChange={(e) => updateDefinition(type, 'minProducts', parseInt(e.target.value) || 0)} /></div>
            </div>
          </div>
        );
      case 'Adjacency':
        return (
          <div className="type-definition-card">
            <h4>↔️ Adjacency Rules</h4>
            <div className="wizard-field-row">
              <div className="wizard-field-group"><label>Category/Product A</label><input type="text" value={def.categoryA || ''} onChange={(e) => updateDefinition(type, 'categoryA', e.target.value)} placeholder="e.g., Cola" /></div>
              <div className="wizard-field-group">
                <label>Condition</label>
                <select value={def.condition || ''} onChange={(e) => updateDefinition(type, 'condition', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Must Be Adjacent">Must Be Adjacent</option>
                  <option value="Not Adjacent">Must NOT Be Adjacent</option>
                </select>
              </div>
              <div className="wizard-field-group"><label>Category/Product B</label><input type="text" value={def.categoryB || ''} onChange={(e) => updateDefinition(type, 'categoryB', e.target.value)} placeholder="e.g., Diet Cola" /></div>
            </div>
          </div>
        );
      case 'Mandatory SKU':
        return (
          <div className="type-definition-card">
            <h4>✅ Mandatory SKU Rules</h4>
            <div className="wizard-field-group">
              <label>Select SKUs (search or upload)</label>
              <SearchableDropdown
                options={allSKUs.map(s => `${s.id} - ${s.name}`)}
                selected={def.skus || []}
                onChange={(skus) => updateDefinition(type, 'skus', skus)}
                placeholder="Search SKUs..."
                allowUpload
                onUpload={(items) => updateDefinition(type, 'skus', [...(def.skus || []), ...items])}
              />
            </div>
            <div className="wizard-field-group" style={{ maxWidth: '200px', marginTop: '12px' }}>
              <label>Min Quantity</label>
              <input type="number" min="1" value={def.minQuantity || ''} onChange={(e) => updateDefinition(type, 'minQuantity', parseInt(e.target.value) || 1)} placeholder="1" />
            </div>
          </div>
        );
      case 'Prohibited SKU':
        return (
          <div className="type-definition-card prohibited">
            <h4>🚫 Prohibited SKU Rules</h4>
            <div className="wizard-field-group">
              <label>Select SKUs to Prohibit (search or upload)</label>
              <SearchableDropdown
                options={allSKUs.map(s => `${s.id} - ${s.name}`)}
                selected={def.skus || []}
                onChange={(skus) => updateDefinition(type, 'skus', skus)}
                placeholder="Search SKUs to prohibit..."
                allowUpload
                onUpload={(items) => updateDefinition(type, 'skus', [...(def.skus || []), ...items])}
              />
            </div>
            <div className="wizard-field-group" style={{ marginTop: '12px' }}>
              <label>Reason</label>
              <input type="text" value={def.reason || ''} onChange={(e) => updateDefinition(type, 'reason', e.target.value)} placeholder="e.g., Competitor exclusion" />
            </div>
          </div>
        );
      case 'Priority':
        return (
          <div className="type-definition-card">
            <h4>⭐ Priority Rules</h4>
            <div className="wizard-field-row">
              <div className="wizard-field-group">
                <label>Target</label>
                <select value={def.target || ''} onChange={(e) => updateDefinition(type, 'target', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Store Brand">Store Brand</option>
                  <option value="High Margin">High Margin</option>
                  <option value="Promotion">Promotional</option>
                  <option value="New Products">New Products</option>
                </select>
              </div>
              <div className="wizard-field-group">
                <label>Placement</label>
                <select value={def.placement || ''} onChange={(e) => updateDefinition(type, 'placement', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Eye-level">Eye-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Bottom">Bottom</option>
                </select>
              </div>
              <div className="wizard-field-group">
                <label>Priority</label>
                <select value={def.priority || ''} onChange={(e) => updateDefinition(type, 'priority', e.target.value)}>
                  <option value="">Select</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'Fixture-Specific':
        return (
          <div className="type-definition-card">
            <h4>🗄️ Fixture-Specific Rules</h4>
            <div className="wizard-field-row">
              <div className="wizard-field-group">
                <label>Target Fixture</label>
                <select value={def.targetFixture || ''} onChange={(e) => updateDefinition(type, 'targetFixture', e.target.value)}>
                  <option value="">Select</option>
                  {fixtureOptions.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="wizard-field-group"><label>Max SKUs</label><input type="number" value={def.maxSKUs || ''} onChange={(e) => updateDefinition(type, 'maxSKUs', parseInt(e.target.value) || 0)} /></div>
              <div className="wizard-field-group"><label>Max Shelves</label><input type="number" value={def.maxShelves || ''} onChange={(e) => updateDefinition(type, 'maxShelves', parseInt(e.target.value) || 0)} /></div>
            </div>
          </div>
        );
      case 'Cluster-Specific':
        return (
          <div className="type-definition-card">
            <h4>🏪 Cluster-Specific Rules</h4>
            <div className="wizard-field-group">
              <label>Target Cluster</label>
              <select value={def.targetCluster || ''} onChange={(e) => updateDefinition(type, 'targetCluster', e.target.value)}>
                <option value="">Select</option>
                {clusterOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="wizard-field-group" style={{ marginTop: '12px' }}>
              <label>Special Instructions</label>
              <textarea value={def.instructions || ''} onChange={(e) => updateDefinition(type, 'instructions', e.target.value)} placeholder="Enter instructions..." rows={3} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderWizardContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="wizard-step-content">
            <h3 className="wizard-step-title">Basic Information</h3>
            <p className="wizard-step-description">Start by providing a name and description for your rule.</p>
            <div className="wizard-form-fields">
              <div className="wizard-field-group">
                <label>Rule Name <span className="required">*</span></label>
                <input type="text" value={builderForm.name || ''} onChange={(e) => setBuilderForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter a descriptive name for this rule" />
              </div>
              <div className="wizard-field-group">
                <label>Description</label>
                <textarea value={builderForm.description || ''} onChange={(e) => setBuilderForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe what this rule does and when it should be applied" rows={4} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="wizard-step-content">
            <h3 className="wizard-step-title">Select Rule Types</h3>
            <p className="wizard-step-description">Choose one or more rule types to combine in this rule. You can select multiple types to create a comprehensive rule.</p>
            <div className="wizard-rule-type-grid">
              {ruleTypeOptions.map(rt => (
                <div key={rt.value} className={`wizard-rule-type-card ${builderForm.types?.includes(rt.value) ? 'selected' : ''}`} onClick={() => handleTypeToggle(rt.value)}>
                  <span className="wizard-rule-type-icon">{ruleTypeIcons[rt.value]}</span>
                  <div className="wizard-rule-type-info">
                    <h4>{rt.label}</h4>
                    <p>{rt.description}</p>
                  </div>
                  {builderForm.types?.includes(rt.value) && <CheckCircle size={20} className="wizard-rule-type-check" />}
                </div>
              ))}
            </div>
            {(builderForm.types?.length || 0) > 0 && (
              <div className="wizard-selected-types">
                <strong>Selected:</strong> {builderForm.types?.map(t => ruleTypeOptions.find(r => r.value === t)?.label).join(', ')}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="wizard-step-content">
            <h3 className="wizard-step-title">Rule Definition</h3>
            <p className="wizard-step-description">Configure the parameters for each selected rule type.</p>
            {(builderForm.types?.length || 0) === 0 ? (
              <div className="wizard-warning-card"><AlertTriangle size={18} /><div>Please go back and select at least one rule type.</div></div>
            ) : (
              <div className="wizard-definitions-list">
                {builderForm.types?.map(type => (
                  <React.Fragment key={type}>{renderDefinitionForType(type)}</React.Fragment>
                ))}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="wizard-step-content">
            <h3 className="wizard-step-title">Rule Mapping</h3>
            <p className="wizard-step-description">Map this rule to categories, clusters/stores, and fixtures. Use the search to filter or upload a CSV/TXT file.</p>
            <div className="wizard-mapping-sections">
              <div className="wizard-mapping-group">
                <h4>Categories</h4>
                <SearchableDropdown
                  options={allCategories}
                  selected={builderForm.mapping?.categories || []}
                  onChange={(cats) => handleMappingChange('categories', cats)}
                  placeholder="Search categories..."
                  allowUpload
                  onUpload={(items) => handleMappingChange('categories', [...(builderForm.mapping?.categories || []), ...items.filter(i => allCategories.includes(i))])}
                />
              </div>
              <div className="wizard-mapping-group">
                <h4>Clusters / Stores</h4>
                <SearchableDropdown
                  options={clusterOptions}
                  selected={builderForm.mapping?.clusters || []}
                  onChange={(clusters) => handleMappingChange('clusters', clusters)}
                  placeholder="Search clusters/stores..."
                />
              </div>
              <div className="wizard-mapping-group">
                <h4>Fixtures</h4>
                <SearchableDropdown
                  options={fixtureOptions}
                  selected={builderForm.mapping?.fixtures || []}
                  onChange={(fixtures) => handleMappingChange('fixtures', fixtures)}
                  placeholder="Search fixtures..."
                />
              </div>
            </div>
            {!isMapped(builderForm) && (
              <div className="wizard-warning-card"><AlertTriangle size={18} /><div><strong>No Mapping Selected</strong><p>This rule will be saved but marked as Unmapped.</p></div></div>
            )}
            {isMapped(builderForm) && (
              <div className="wizard-success-card"><CheckCircle size={18} /><div><strong>Rule Will Be Applied To:</strong>
                <ul>
                  {(builderForm.mapping?.categories?.length || 0) > 0 && <li>Categories: {builderForm.mapping?.categories.join(', ')}</li>}
                  {(builderForm.mapping?.clusters?.length || 0) > 0 && <li>Clusters: {builderForm.mapping?.clusters.join(', ')}</li>}
                  {(builderForm.mapping?.fixtures?.length || 0) > 0 && <li>Fixtures: {builderForm.mapping?.fixtures.join(', ')}</li>}
                </ul>
              </div></div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rule-management">
      <div className="rule-management-header">
        <div className="rule-management-title-section">
          <h1 className="rule-management-title">POG Rule Management</h1>
          <p className="rule-management-subtitle">Create and manage centralized planogram rules</p>
        </div>
      </div>

      <div className="rule-management-tabs">
        <button className={`rule-tab ${activeTab === 'library' ? 'active' : ''}`} onClick={() => { setActiveTab('library'); resetBuilder(); }}>Rule Library</button>
        <button className={`rule-tab ${activeTab === 'builder' ? 'active' : ''}`} onClick={() => setActiveTab('builder')}>
          Rule Builder {isEditing && <span className="tab-badge">Editing</span>}
        </button>
      </div>

      {activeTab === 'library' && (
        <div className="rule-library">
          {(unmappedCount > 0 || draftCount > 0) && (
            <div className="rule-alerts">
              {unmappedCount > 0 && <div className="rule-warning-banner"><AlertTriangle size={18} /><span>You have <strong>{unmappedCount}</strong> unmapped rule{unmappedCount > 1 ? 's' : ''}</span></div>}
              {draftCount > 0 && <div className="rule-draft-banner"><FileText size={18} /><span>You have <strong>{draftCount}</strong> draft rule{draftCount > 1 ? 's' : ''}</span></div>}
            </div>
          )}
          <div className="rule-toolbar">
            <div className="rule-search"><Search size={18} className="rule-search-icon" /><input type="text" placeholder="Search rules..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rule-search-input" /></div>
            <button className="rule-create-btn" onClick={handleCreateNew}><Plus size={18} /><span>Create Rule</span></button>
          </div>
          <div className="rule-filters">
            <div className="rule-filter-item"><label className="rule-filter-label">Rule Type</label><select className="rule-filter-select" value={filters.ruleType} onChange={(e) => handleFilterChange('ruleType', e.target.value)}><option value="">All Types</option>{ruleTypeOptions.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}</select></div>
            <div className="rule-filter-item"><label className="rule-filter-label">Mapping Status</label><select className="rule-filter-select" value={filters.mappingStatus} onChange={(e) => handleFilterChange('mappingStatus', e.target.value)}><option value="">All</option><option value="Mapped">Mapped</option><option value="Unmapped">Unmapped</option></select></div>
            <div className="rule-filter-item"><label className="rule-filter-label">Status</label><select className="rule-filter-select" value={filters.ruleStatus} onChange={(e) => handleFilterChange('ruleStatus', e.target.value)}><option value="">All</option><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Draft">Draft</option></select></div>
            <button className="rule-filter-clear" onClick={clearAllFilters}>Clear All</button>
          </div>
          <div className="rule-table-container">
            <table className="rule-table">
              <thead><tr><th>Rule ID</th><th>Rule Name</th><th>Types</th><th>Categories</th><th>Clusters</th><th>Fixtures</th><th>Mapping</th><th>Updated</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredRules.map(rule => {
                  const mapped = isMapped(rule);
                  const isDraft = rule.status === 'Draft';
                  return (
                    <tr key={rule.id} className={`${!mapped && !isDraft ? 'unmapped-row' : ''} ${isDraft ? 'draft-row' : ''}`}>
                      <td><button className="rule-id-link" onClick={() => handleViewRule(rule)}>{rule.id}</button></td>
                      <td className="rule-name-cell"><div className="rule-name-wrapper">{rule.name}{isDraft && <span className="rule-draft-indicator"><Circle size={8} />{rule.completedSteps.length}/4</span>}</div></td>
                      <td><div className="rule-types-cell">{rule.types.slice(0, 2).map(t => <span key={t} className={`rule-type-badge ${getTypeBadgeClass(t)}`}>{t}</span>)}{rule.types.length > 2 && <span className="rule-mapping-more">+{rule.types.length - 2}</span>}</div></td>
                      <td>{renderMappingBadges(rule.mapping.categories)}</td>
                      <td>{renderMappingBadges(rule.mapping.clusters)}</td>
                      <td>{renderMappingBadges(rule.mapping.fixtures)}</td>
                      <td>{isDraft ? <span className="mapping-status draft"><FileText size={14} />Draft</span> : mapped ? <span className="mapping-status mapped"><CheckCircle size={14} />Mapped</span> : <span className="mapping-status unmapped"><AlertTriangle size={14} />Unmapped</span>}</td>
                      <td>{rule.lastUpdated}</td>
                      <td><span className={`rule-status-badge ${rule.status.toLowerCase()}`}>{rule.status}</span></td>
                      <td><div className="rule-actions"><button className="rule-action-btn" onClick={() => handleViewRule(rule)} title="View"><Eye size={16} /></button><button className="rule-action-btn" onClick={() => handleEditRule(rule)} title="Edit"><Edit size={16} /></button><button className="rule-action-btn danger" onClick={() => handleDeleteClick(rule)} title="Delete"><Trash2 size={16} /></button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="rule-builder-wizard">
          <div className="wizard-progress">
            {wizardSteps.map((step, index) => {
              const isCompleted = builderForm.completedSteps?.includes(step.id) || isStepComplete(step.id);
              const isCurrent = currentStep === step.id;
              const isAccessible = canProceedToStep(step.id);
              return (
                <React.Fragment key={step.id}>
                  <div className={`wizard-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isAccessible ? 'accessible' : ''}`} onClick={() => isAccessible && setCurrentStep(step.id)}>
                    <div className="wizard-step-number">{isCompleted && !isCurrent ? <Check size={16} /> : step.id}</div>
                    <div className="wizard-step-info"><span className="wizard-step-label">{step.title}</span><span className="wizard-step-desc">{step.description}</span></div>
                  </div>
                  {index < wizardSteps.length - 1 && <div className={`wizard-step-connector ${isCompleted ? 'completed' : ''}`} />}
                </React.Fragment>
              );
            })}
          </div>
          <div className="wizard-content">{isEditing && builderForm.status === 'Draft' && <div className="wizard-draft-banner"><FileText size={18} /><span>Continuing draft rule</span></div>}{renderWizardContent()}</div>
          <div className="wizard-actions">
            <div className="wizard-actions-left">{currentStep > 1 && <button className="wizard-btn secondary" onClick={handlePrevStep}><ChevronLeft size={18} />Previous</button>}</div>
            <div className="wizard-actions-right">
              <button className="wizard-btn outline" onClick={() => { setActiveTab('library'); resetBuilder(); }}>Cancel</button>
              <button className="wizard-btn secondary" onClick={handleSaveDraft}><Save size={18} />Save Draft</button>
              {currentStep < 4 ? (
                <button className="wizard-btn primary" onClick={handleNextStep} disabled={!isStepComplete(currentStep)}>Next<ChevronRight size={18} /></button>
              ) : (
                <button className="wizard-btn primary" onClick={handleSaveRule} disabled={!builderForm.name || !builderForm.types?.length}><CheckCircle size={18} />{isEditing ? 'Update' : 'Create'} Rule</button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedRule && (
        <div className="rule-modal-overlay" onClick={() => setSelectedRule(null)}>
          <div className="rule-modal" onClick={e => e.stopPropagation()}>
            <div className="rule-modal-header"><div><h2>{selectedRule.name}</h2><span className="rule-modal-id">{selectedRule.id}</span></div><button className="rule-modal-close" onClick={() => setSelectedRule(null)}><X size={20} /></button></div>
            <div className="rule-modal-content">
              <div className="rule-modal-row"><span className="rule-modal-label">Types:</span><div className="rule-types-cell">{selectedRule.types.map(t => <span key={t} className={`rule-type-badge ${getTypeBadgeClass(t)}`}>{t}</span>)}</div></div>
              <div className="rule-modal-row"><span className="rule-modal-label">Status:</span><span className={`rule-status-badge ${selectedRule.status.toLowerCase()}`}>{selectedRule.status}</span></div>
              <div className="rule-modal-row"><span className="rule-modal-label">Mapping:</span>{isMapped(selectedRule) ? <span className="mapping-status mapped"><CheckCircle size={14} />Mapped</span> : <span className="mapping-status unmapped"><AlertTriangle size={14} />Unmapped</span>}</div>
              {selectedRule.description && <div className="rule-modal-section"><h4>Description</h4><p>{selectedRule.description}</p></div>}
              <div className="rule-modal-section"><h4>Rule Definition</h4><pre className="rule-definition-preview">{JSON.stringify(selectedRule.definition, null, 2)}</pre></div>
              <div className="rule-modal-section"><h4>Mappings</h4><div className="rule-modal-mappings"><div><strong>Categories:</strong> {selectedRule.mapping.categories.length > 0 ? selectedRule.mapping.categories.join(', ') : 'None'}</div><div><strong>Clusters:</strong> {selectedRule.mapping.clusters.length > 0 ? selectedRule.mapping.clusters.join(', ') : 'None'}</div><div><strong>Fixtures:</strong> {selectedRule.mapping.fixtures.length > 0 ? selectedRule.mapping.fixtures.join(', ') : 'None'}</div></div></div>
            </div>
            <div className="rule-modal-actions"><button className="rule-modal-edit-btn" onClick={() => { setSelectedRule(null); handleEditRule(selectedRule); }}><Edit size={16} />Edit Rule</button></div>
          </div>
        </div>
      )}

      {showDeleteModal && ruleToDelete && (
        <div className="rule-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="rule-modal delete-modal" onClick={e => e.stopPropagation()}>
            <div className="rule-modal-header"><h2>Delete Rule</h2><button className="rule-modal-close" onClick={() => setShowDeleteModal(false)}><X size={20} /></button></div>
            <div className="rule-modal-content"><p>Are you sure you want to delete this rule?</p><p className="delete-rule-name">"{ruleToDelete.name}"</p><p className="delete-warning">This action cannot be undone.</p></div>
            <div className="rule-modal-actions"><button className="rule-cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button><button className="rule-delete-confirm-btn" onClick={confirmDelete}><Trash2 size={16} />Delete</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POGRuleManagement;
