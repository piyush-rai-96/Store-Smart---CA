import React, { useState } from 'react';
import { Upload, Search, Eye, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';
import './MasterPOGManagement.css';

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

const mockPOGData: POGItem[] = [
  { id: '1', name: 'Beverage Cooler - Standard', category: 'Beverages', lastModified: '2024-03-15', status: 'active', version: 'v2.1', clusters: 12, planogramImage: '/planograms/beverage-cooler-standard.svg' },
  { id: '2', name: 'Beverage Aisle - Premium', category: 'Beverages', lastModified: '2024-03-14', status: 'active', version: 'v1.5', clusters: 8, planogramImage: '/planograms/beverage-aisle-premium.svg' },
  { id: '3', name: 'Holiday Decor Display - Compact', category: 'Holiday Decor & Home Accent', lastModified: '2024-03-12', status: 'draft', version: 'v3.0', clusters: 5, planogramImage: '/planograms/holiday-decor-display.svg' },
  { id: '4', name: 'Beverage End Cap - Large Format', category: 'Beverages', lastModified: '2024-03-10', status: 'active', version: 'v1.2', clusters: 15, planogramImage: '/planograms/beverage-end-cap.svg' },
  { id: '5', name: 'Home Accent Shelf - End Cap', category: 'Holiday Decor & Home Accent', lastModified: '2024-03-08', status: 'archived', version: 'v2.0', clusters: 3, planogramImage: '/planograms/home-accent-shelf.svg' },
];

interface Filters {
  category: string;
  status: string;
  fixtureType: string;
  cluster: string;
  lastUpdated: string;
  createdBy: string;
}

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
              <div className="pog-filter-item">
                <label className="pog-filter-label">Category</label>
                <select 
                  className="pog-filter-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Holiday Decor & Home Accent">Holiday Decor & Home Accent</option>
                </select>
              </div>
              <div className="pog-filter-item">
                <label className="pog-filter-label">Status</label>
                <select 
                  className="pog-filter-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="pog-filter-item">
                <label className="pog-filter-label">Fixture Type</label>
                <select 
                  className="pog-filter-select"
                  value={filters.fixtureType}
                  onChange={(e) => handleFilterChange('fixtureType', e.target.value)}
                >
                  <option value="">All Fixtures</option>
                  <option value="cooler">Cooler</option>
                  <option value="shelf">Shelf</option>
                  <option value="endcap">End Cap</option>
                  <option value="gondola">Gondola</option>
                </select>
              </div>
              <div className="pog-filter-item">
                <label className="pog-filter-label">Cluster</label>
                <select 
                  className="pog-filter-select"
                  value={filters.cluster}
                  onChange={(e) => handleFilterChange('cluster', e.target.value)}
                >
                  <option value="">All Clusters</option>
                  <option value="1-5">1-5 Clusters</option>
                  <option value="6-10">6-10 Clusters</option>
                  <option value="11-15">11-15 Clusters</option>
                  <option value="15+">15+ Clusters</option>
                </select>
              </div>
              <div className="pog-filter-item">
                <label className="pog-filter-label">Last Updated</label>
                <select 
                  className="pog-filter-select"
                  value={filters.lastUpdated}
                  onChange={(e) => handleFilterChange('lastUpdated', e.target.value)}
                >
                  <option value="">Any Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
              <div className="pog-filter-item">
                <label className="pog-filter-label">Created By</label>
                <select 
                  className="pog-filter-select"
                  value={filters.createdBy}
                  onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                >
                  <option value="">All Users</option>
                  <option value="me">Me</option>
                  <option value="team">My Team</option>
                </select>
              </div>
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
                      <span className="pog-cluster-number">{selectedPOG.clusters}</span>
                      <span className="pog-cluster-label">Total Clusters</span>
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
                  <div className="pog-rules-list">
                    <div className="pog-rule-item">
                      <div className="pog-rule-icon facing">🔢</div>
                      <div className="pog-rule-info">
                        <span className="pog-rule-name">Minimum Facing - Beverages</span>
                        <span className="pog-rule-source">Source: Category</span>
                      </div>
                    </div>
                    <div className="pog-rule-item">
                      <div className="pog-rule-icon mandatory">✅</div>
                      <div className="pog-rule-info">
                        <span className="pog-rule-name">Mandatory SKU - Coca Cola</span>
                        <span className="pog-rule-source">Source: Category + Cluster</span>
                      </div>
                    </div>
                    <div className="pog-rule-item">
                      <div className="pog-rule-icon brand">🏷️</div>
                      <div className="pog-rule-info">
                        <span className="pog-rule-name">Brand Blocking - Cola Products</span>
                        <span className="pog-rule-source">Source: Fixture</span>
                      </div>
                    </div>
                    <div className="pog-rule-item">
                      <div className="pog-rule-icon priority">⭐</div>
                      <div className="pog-rule-info">
                        <span className="pog-rule-name">Eye-Level Priority - Store Brand</span>
                        <span className="pog-rule-source">Source: Global</span>
                      </div>
                    </div>
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
