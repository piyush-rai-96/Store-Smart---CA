import React, { useState, useRef, useEffect } from 'react';
import { Upload, Search, Eye, Edit, Trash2, Clock, CheckCircle, ChevronDown, ChevronUp, Check } from 'lucide-react';
import './MasterPOGManagement.css';
import WomensWallStandard from '../assets/C&A_WOMENS_WALL_STANDARD.png';
import MensDenimWall from '../assets/C&A_MENS_DENIM_WALL.png';
import KidsColorBlockWall from '../assets/C&A_KIDS_COLOR_BLOCK_WALL.png';
import AccessoriesEndcap from '../assets/C&A_ACCESSORIES_ENDCAP.png';
import SeasonalPromoTable from '../assets/C&A_SEASONAL_PROMO_TABLE.png';

interface POGItem {
  id: string;
  name: string;
  category: string;
  lastModified: string;
  status: 'active' | 'draft' | 'archived';
  version: string;
  clusters: number;
  planogramImage: string;
}

interface POGRule {
  name: string;
  type: string;
  status: 'Active' | 'Warning';
  description: string;
  icon: string;
}

interface POGClusterMapping {
  clusters: string[];
  count: number;
}

const pogRulesMapping: Record<string, POGRule[]> = {
  '1': [ // Women's Wall Display
    { name: 'Product Fit & Placement', type: 'Placement', status: 'Active', description: 'Place folded items on shelves, hanging items on rails, and accessories on display hooks.', icon: '📍' },
    { name: 'Size Sequencing', type: 'Priority', status: 'Active', description: 'Arrange sizes from small to large, left to right on each rail or shelf.', icon: '⭐' },
    { name: 'Color Blocking', type: 'Visual', status: 'Active', description: 'Group items by color family for visual appeal and easy navigation.', icon: '🎨' },
    { name: 'Capacity Rules', type: 'Capacity', status: 'Active', description: 'Do not overcrowd rails. Maintain spacing between hangers for easy browsing.', icon: '📊' },
    { name: 'Seasonal Rotation', type: 'Compliance', status: 'Active', description: 'Feature current season items prominently and phase out previous season stock.', icon: '🔄' },
  ],
  '2': [ // Men's Denim Wall
    { name: 'Fit Grouping', type: 'Placement', status: 'Active', description: 'Group by fit (slim, regular, relaxed) in distinct sections.', icon: '📍' },
    { name: 'Wash Sequencing', type: 'Visual', status: 'Active', description: 'Arrange washes from light to dark within each fit section.', icon: '🎨' },
    { name: 'Size Availability', type: 'Priority', status: 'Active', description: 'Ensure full size range is visible and accessible for each style.', icon: '⭐' },
    { name: 'Visual Balance', type: 'Visual', status: 'Active', description: 'Maintain even stack heights and consistent folding across the display.', icon: '📐' },
  ],
  '3': [ // Kids Color Block Wall
    { name: 'Age Grouping', type: 'Placement', status: 'Active', description: 'Organize by age group with toddler items at lower heights.', icon: '📍' },
    { name: 'Color Blocking', type: 'Visual', status: 'Active', description: 'Create vibrant color blocks to attract attention and aid navigation.', icon: '🎨' },
    { name: 'Safety Compliance', type: 'Compliance', status: 'Active', description: 'Ensure displays are stable and items are within safe reach for children.', icon: '🛡️' },
  ],
  '4': [ // Accessories End Cap
    { name: 'Category Grouping', type: 'Placement', status: 'Active', description: 'Group by type: bags, belts, scarves, jewelry in distinct sections.', icon: '📍' },
    { name: 'Trend Highlighting', type: 'Priority', status: 'Active', description: 'Feature current trend items at eye level with clear trend signage.', icon: '⭐' },
    { name: 'Gift Presentation', type: 'Visual', status: 'Active', description: 'Display gift-ready items with packaging visible and price tags accessible.', icon: '🎁' },
    { name: 'Impulse Optimization', type: 'Compliance', status: 'Active', description: 'Position grab-and-go items at checkout-adjacent locations.', icon: '⚡' },
  ],
  '5': [ // Seasonal Promo Table
    { name: 'Promotional Focus', type: 'Placement', status: 'Active', description: 'Feature current promotional items prominently with clear pricing.', icon: '📍' },
    { name: 'Bundle Display', type: 'Visual', status: 'Active', description: 'Create outfit or gift bundles to encourage multi-item purchases.', icon: '🎨' },
    { name: 'Urgency Signage', type: 'Compliance', status: 'Active', description: 'Include limited-time messaging to drive immediate purchase decisions.', icon: '⏰' },
  ],
};

const pogClusterMapping: Record<string, POGClusterMapping> = {
  '1': { clusters: ['Urban Flagship', 'Family Center', 'Mall Anchor'], count: 3 },
  '2': { clusters: ['Urban Flagship', 'Family Center', 'Outlet Value'], count: 3 },
  '3': { clusters: ['Family Center', 'Mall Anchor', 'Outlet Value'], count: 3 },
  '4': { clusters: ['Urban Flagship', 'Mall Anchor'], count: 2 },
  '5': { clusters: ['Urban Flagship', 'Family Center', 'Mall Anchor', 'Outlet Value'], count: 4 },
};

const mockPOGData: POGItem[] = [
  { id: '1', name: "Women's Wall Display - Standard", category: 'Apparel', lastModified: '2024-03-15', status: 'active', version: 'v2.1', clusters: 12, planogramImage: WomensWallStandard },
  { id: '2', name: "Men's Denim Wall Display", category: 'Apparel', lastModified: '2024-03-14', status: 'active', version: 'v1.5', clusters: 8, planogramImage: MensDenimWall },
  { id: '3', name: "Kids Color Block Wall", category: 'Apparel', lastModified: '2024-03-12', status: 'draft', version: 'v3.0', clusters: 5, planogramImage: KidsColorBlockWall },
  { id: '4', name: 'Accessories End Cap', category: 'Accessories', lastModified: '2024-03-10', status: 'active', version: 'v1.2', clusters: 15, planogramImage: AccessoriesEndcap },
  { id: '5', name: 'Seasonal Promo Table', category: 'Seasonal', lastModified: '2024-03-08', status: 'archived', version: 'v2.0', clusters: 3, planogramImage: SeasonalPromoTable },
];

interface Filters {
  category: string;
  status: string;
  fixtureType: string;
  cluster: string;
  lastUpdated: string;
  createdBy: string;
}

// Custom Dropdown Component
interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="pog-filter-item" ref={dropdownRef}>
      <label className="pog-filter-label">{label}</label>
      <div className="custom-dropdown">
        <button 
          className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className={value ? 'has-value' : ''}>{selectedOption?.label || options[0]?.label}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {isOpen && (
          <div className="custom-dropdown-menu">
            {options.map((option) => (
              <button
                key={option.value}
                className={`custom-dropdown-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                type="button"
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={16} className="check-icon" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MasterPOGManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'workspace'>('library');
  const [selectedPOG, setSelectedPOG] = useState<POGItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: '',
    status: '',
    fixtureType: '',
    cluster: '',
    lastUpdated: '',
    createdBy: '',
  });

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      status: '',
      fixtureType: '',
      cluster: '',
      lastUpdated: '',
      createdBy: '',
    });
    setSearchQuery('');
  };

  const handlePOGSelect = (pog: POGItem) => {
    setSelectedPOG(pog);
    setActiveTab('workspace');
  };

  const filteredPOGs = mockPOGData.filter(pog => {
    const matchesSearch = pog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pog.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filters.category || pog.category === filters.category;
    const matchesStatus = !filters.status || pog.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: POGItem['status']) => {
    const statusConfig = {
      active: { label: 'Active', className: 'status-active' },
      draft: { label: 'Draft', className: 'status-draft' },
      archived: { label: 'Archived', className: 'status-archived' },
    };
    const config = statusConfig[status];
    return <span className={`pog-status-badge ${config.className}`}>{config.label}</span>;
  };

  return (
    <div className="master-pog-container">
      <div className="master-pog-header">
        <div className="master-pog-title-section">
          <h1 className="master-pog-title">Master POG Management</h1>
          <p className="master-pog-subtitle">Manage and organize your planogram library</p>
        </div>
      </div>

      <div className="master-pog-tabs">
        <div className="pog-tabs-container">
          <button 
            className={`pog-tab ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            POG Library
          </button>
          <button 
            className={`pog-tab ${activeTab === 'workspace' ? 'active' : ''}`}
            onClick={() => selectedPOG && setActiveTab('workspace')}
            disabled={!selectedPOG}
          >
            POG Workspace
          </button>
        </div>
      </div>

      <div className="master-pog-content">
        {activeTab === 'library' && (
          <div className="pog-library">
            <div className="pog-library-toolbar">
              <div className="pog-search-wrapper">
                <Search size={18} className="pog-search-icon" />
                <input
                  type="text"
                  placeholder="Search planograms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pog-search-input"
                />
              </div>
              <div className="pog-toolbar-actions">
                <button className="pog-toolbar-btn primary">
                  <Upload size={16} />
                  <span>Upload POG</span>
                </button>
              </div>
            </div>

            {/* Filter Stripe */}
            <div className="pog-filter-stripe">
              <CustomDropdown
                label="Category"
                value={filters.category}
                options={[
                  { value: '', label: 'All Categories' },
                  { value: 'Apparel', label: 'Apparel' },
                  { value: 'Accessories', label: 'Accessories' },
                  { value: 'Seasonal', label: 'Seasonal' },
                ]}
                onChange={(value) => handleFilterChange('category', value)}
              />
              <CustomDropdown
                label="Status"
                value={filters.status}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'archived', label: 'Archived' },
                ]}
                onChange={(value) => handleFilterChange('status', value)}
              />
              <CustomDropdown
                label="Fixture Type"
                value={filters.fixtureType}
                options={[
                  { value: '', label: 'All Fixtures' },
                  { value: 'wall', label: 'Wall Display' },
                  { value: 'table', label: 'Table' },
                  { value: 'endcap', label: 'End Cap' },
                ]}
                onChange={(value) => handleFilterChange('fixtureType', value)}
              />
              <CustomDropdown
                label="Cluster"
                value={filters.cluster}
                options={[
                  { value: '', label: 'All Clusters' },
                  { value: 'urban', label: 'Urban Flagship' },
                  { value: 'family', label: 'Family Center' },
                  { value: 'outlet', label: 'Outlet Value' },
                  { value: 'mall', label: 'Mall Anchor' },
                ]}
                onChange={(value) => handleFilterChange('cluster', value)}
              />
              <CustomDropdown
                label="Last Updated"
                value={filters.lastUpdated}
                options={[
                  { value: '', label: 'Any Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                  { value: 'quarter', label: 'This Quarter' },
                ]}
                onChange={(value) => handleFilterChange('lastUpdated', value)}
              />
              <CustomDropdown
                label="Created By"
                value={filters.createdBy}
                options={[
                  { value: '', label: 'All Users' },
                  { value: 'me', label: 'Me' },
                  { value: 'team', label: 'My Team' },
                ]}
                onChange={(value) => handleFilterChange('createdBy', value)}
              />
              <button className="pog-filter-clear" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>

            <div className="pog-library-grid">
              {filteredPOGs.map(pog => (
                <div 
                  key={pog.id} 
                  className="pog-card"
                  onClick={() => handlePOGSelect(pog)}
                >
                  <div className="pog-card-header">
                    <div className="pog-card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </div>
                    {getStatusBadge(pog.status)}
                  </div>
                  <div className="pog-card-body">
                    <span className="pog-card-id">POG-{pog.id.padStart(3, '0')}</span>
                    <h3 className="pog-card-name">{pog.name}</h3>
                    <p className="pog-card-category">{pog.category}</p>
                  </div>
                  <div className="pog-card-footer">
                    <div className="pog-card-meta">
                      <span className="pog-card-version">{pog.version}</span>
                      <span className="pog-card-clusters">{pog.clusters} clusters</span>
                    </div>
                    <div className="pog-card-date">
                      <Clock size={12} />
                      <span>{pog.lastModified}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workspace' && selectedPOG && (
          <div className="pog-workspace">
            <div className="pog-workspace-header">
              <div className="pog-workspace-info">
                <h2 className="pog-workspace-name">{selectedPOG.name}</h2>
                <div className="pog-workspace-meta">
                  {getStatusBadge(selectedPOG.status)}
                  <span className="pog-workspace-version">{selectedPOG.version}</span>
                  <span className="pog-workspace-category">{selectedPOG.category}</span>
                </div>
              </div>
              <div className="pog-workspace-actions">
                <button className="pog-action-btn">
                  <Eye size={16} />
                  <span>Preview</span>
                </button>
                <button className="pog-action-btn">
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button className="pog-action-btn danger">
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <div className="pog-workspace-content">
              <div className="pog-workspace-viewer">
                <img 
                  src={selectedPOG.planogramImage} 
                  alt={`Planogram: ${selectedPOG.name}`}
                  className="pog-viewer-image"
                />
              </div>

              <div className="pog-workspace-sidebar">
                <div className="pog-sidebar-section">
                  <h4 className="pog-sidebar-title">Version Control</h4>
                  <div className="pog-version-list">
                    <div className="pog-version-item active">
                      <CheckCircle size={14} />
                      <span>v2.1 - Current</span>
                    </div>
                    <div className="pog-version-item">
                      <Clock size={14} />
                      <span>v2.0 - Mar 10, 2024</span>
                    </div>
                    <div className="pog-version-item">
                      <Clock size={14} />
                      <span>v1.5 - Feb 28, 2024</span>
                    </div>
                  </div>
                </div>

                <div className="pog-sidebar-section">
                  <h4 className="pog-sidebar-title">Cluster Mapping</h4>
                  <div className="pog-cluster-info">
                    <div className="pog-cluster-stat">
                      <span className="pog-cluster-number">{pogClusterMapping[selectedPOG.id]?.count || 0}</span>
                      <span className="pog-cluster-label">Total Clusters</span>
                    </div>
                    <div className="pog-cluster-names">
                      {pogClusterMapping[selectedPOG.id]?.clusters.map((cluster, idx) => (
                        <span key={idx} className="pog-cluster-tag">{cluster}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pog-sidebar-section">
                  <h4 className="pog-sidebar-title">Quick Actions</h4>
                  <div className="pog-quick-actions">
                    <button className="pog-quick-action-btn">Clone POG</button>
                    <button className="pog-quick-action-btn">Export</button>
                    <button className="pog-quick-action-btn">Share</button>
                  </div>
                </div>

                <div className="pog-sidebar-section pog-applied-rules">
                  <h4 className="pog-sidebar-title">Applied Rules</h4>
                  <p className="pog-rules-description">Rules dynamically applied based on category, cluster, and fixture mappings.</p>
                  <div className="pog-rules-list premium">
                    {pogRulesMapping[selectedPOG.id]?.map((rule, idx) => (
                      <div key={idx} className="pog-rule-card">
                        <div className="pog-rule-card-header">
                          <div className={`pog-rule-icon-badge ${rule.type.toLowerCase()}`}>
                            <span>{rule.icon}</span>
                          </div>
                          <div className="pog-rule-card-title">
                            <span className="pog-rule-name">{rule.name}</span>
                            <span className="pog-rule-type-tag">{rule.type}</span>
                          </div>
                          <span className={`pog-rule-status ${rule.status.toLowerCase()}`}>{rule.status}</span>
                        </div>
                        <p className="pog-rule-description">{rule.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
