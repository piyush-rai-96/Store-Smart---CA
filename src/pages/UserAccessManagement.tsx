import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Search,
  X,
  Send,
  ChevronDown,
  Check,
  AlertCircle,
  User as UserIcon,
  Mail,
  Briefcase,
  MapPin,
  Monitor,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User, UserRole, ROLE_LABELS, ROLE_ACCESS, ScreenAccess } from '../types';
import './UserAccessManagement.css';

const SCREEN_LABELS: Record<ScreenAccess, string> = {
  home: 'Home',
  district_intelligence: 'District Intelligence',
  store_deep_dive: 'Store Deep Dive',
  master_pog_management: 'Master POG Management',
  pog_rule_management: 'POG Rule Management',
  pog_localization_engine: 'POG Localization Engine',
  ai_copilot: 'AI Copilot',
  operations_queue: 'Operations Queue',
  communications: 'Communications',
  user_access_management: 'User Access Management',
};

const SCOPE_OPTIONS: Record<UserRole, { label: string; options: string[] }> = {
  SM: { label: 'Assign Store', options: ['Store #2341 - Nashville', 'Store #1142 - Memphis', 'Store #3021 - Knoxville', 'Store #1587 - Chattanooga'] },
  DM: { label: 'Assign District', options: ['District 14 - Tennessee', 'District 08 - Georgia', 'District 22 - Carolina', 'District 11 - Florida'] },
  HQ: { label: 'Assign Region', options: ['North America', 'Southeast', 'Midwest', 'West Coast'] },
  ADMIN: { label: 'Scope', options: ['Global (Full Access)'] },
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SM: 'Store-level operations & inventory',
  DM: 'District oversight & performance',
  HQ: 'Enterprise merchandising & strategy',
  ADMIN: 'Full platform access & configuration',
};

export const UserAccessManagement: React.FC = () => {
  const { allUsers, addUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('SM');
  const [newScope, setNewScope] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const [formError, setFormError] = useState('');

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ROLE_LABELS[u.role].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserScope = (u: User) => {
    if (u.role === 'ADMIN') return 'Global';
    if (u.store) return u.store;
    if (u.district) return u.district;
    if (u.region) return u.region;
    return '—';
  };

  const resetForm = () => {
    setNewName('');
    setNewEmail('');
    setNewRole('SM');
    setNewScope('');
    setFormError('');
    setShowRoleDropdown(false);
    setShowScopeDropdown(false);
  };

  const handleCreateUser = () => {
    if (!newName.trim() || !newEmail.trim()) {
      setFormError('Name and email are required');
      return;
    }
    if (allUsers.some(u => u.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      setFormError('A user with this email already exists');
      return;
    }
    if (newRole !== 'ADMIN' && !newScope) {
      setFormError('Please select a scope assignment');
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email: newEmail.trim(),
      name: newName.trim(),
      role: newRole,
      accessRoutes: ROLE_ACCESS[newRole],
      status: 'invited',
      ...(newRole === 'SM' && { store: newScope, storeId: newScope.match(/#(\d+)/)?.[1] || '' }),
      ...(newRole === 'DM' && { district: newScope, districtId: newScope.match(/District (\d+)/)?.[1] ? `D${newScope.match(/District (\d+)/)?.[1]}` : '' }),
      ...(newRole === 'HQ' && { region: newScope }),
      ...(newRole === 'ADMIN' && { region: 'Global' }),
    };

    addUser(user);
    setShowCreateModal(false);
    resetForm();
    setInviteSuccess(user.name);
    setTimeout(() => setInviteSuccess(null), 4000);
  };

  const roleOptions: UserRole[] = ['SM', 'DM', 'HQ', 'ADMIN'];

  const statCounts = {
    total: allUsers.length,
    active: allUsers.filter(u => u.status === 'active').length,
    invited: allUsers.filter(u => u.status === 'invited').length,
    roles: [...new Set(allUsers.map(u => u.role))].length,
  };

  return (
    <div className="uam-page">
      {/* Premium Header */}
      <div className="uam-header-card">
        <div className="uam-header-accent" />
        <div className="uam-header-inner">
          <div className="uam-header-left">
            <div className="uam-header-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="uam-page-title">User Access Management</h1>
              <p className="uam-page-subtitle">Manage team members, roles, and platform access</p>
            </div>
          </div>
          <button className="uam-create-btn" onClick={() => { resetForm(); setShowCreateModal(true); }}>
            <UserPlus size={15} />
            <span>Create User</span>
          </button>
        </div>

        {/* Stat pills */}
        <div className="uam-stats-row">
          <div className="uam-stat">
            <span className="uam-stat-value">{statCounts.total}</span>
            <span className="uam-stat-label">Total Users</span>
          </div>
          <div className="uam-stat-divider" />
          <div className="uam-stat">
            <span className="uam-stat-dot uam-stat-dot--active" />
            <span className="uam-stat-value">{statCounts.active}</span>
            <span className="uam-stat-label">Active</span>
          </div>
          <div className="uam-stat-divider" />
          <div className="uam-stat">
            <span className="uam-stat-dot uam-stat-dot--invited" />
            <span className="uam-stat-value">{statCounts.invited}</span>
            <span className="uam-stat-label">Pending</span>
          </div>
          <div className="uam-stat-divider" />
          <div className="uam-stat">
            <span className="uam-stat-value">{statCounts.roles}</span>
            <span className="uam-stat-label">Roles</span>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {inviteSuccess && (
        <div className="uam-toast">
          <div className="uam-toast-icon"><Check size={14} /></div>
          <span>Invitation sent successfully to <strong>{inviteSuccess}</strong></span>
        </div>
      )}

      {/* Search bar */}
      <div className="uam-toolbar">
        <div className="uam-search-bar">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="uam-search-clear" onClick={() => setSearchQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>
        <div className="uam-result-count">
          {filteredUsers.length} of {allUsers.length} users
        </div>
      </div>

      {/* Premium Table */}
      <div className="uam-table-card">
        <table className="uam-table wow-table">
          <thead>
            <tr>
              <th className="uam-th-name">User</th>
              <th>Role</th>
              <th>Scope</th>
              <th>Status</th>
              <th className="uam-th-screens">Access</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <React.Fragment key={u.id}>
                <tr
                  className={`uam-row ${expandedRow === u.id ? 'uam-row--expanded' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}
                >
                  <td className="uam-td-user">
                    <div className="uam-user-info">
                      <div className={`uam-avatar uam-avatar--${u.role.toLowerCase()}`}>
                        {u.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="uam-user-details">
                        <span className="uam-user-name">{u.name}</span>
                        <span className="uam-user-email">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`uam-role-tag uam-role--${u.role.toLowerCase()}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td>
                    <span className="uam-scope-text">{getUserScope(u)}</span>
                  </td>
                  <td>
                    <div className={`uam-status uam-status--${u.status}`}>
                      <span className="uam-status-dot" />
                      <span>{u.status === 'active' ? 'Active' : 'Invited'}</span>
                    </div>
                  </td>
                  <td className="uam-td-screens">
                    <div className="uam-screen-badge">
                      <Monitor size={12} />
                      <span>{u.accessRoutes.length}</span>
                    </div>
                  </td>
                </tr>
                {/* Expanded detail row */}
                {expandedRow === u.id && (
                  <tr className="uam-expand-row">
                    <td colSpan={5}>
                      <div className="uam-expand-content">
                        <div className="uam-expand-label">Screen Access</div>
                        <div className="uam-expand-chips">
                          {u.accessRoutes.map(screen => (
                            <span key={screen} className="uam-expand-chip">{SCREEN_LABELS[screen]}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="uam-empty">
                  <Search size={20} />
                  <span>No users match your search</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========== Create User Modal ========== */}
      {showCreateModal && (
        <div className="uam-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="uam-modal" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="uam-m-header">
              <div className="uam-m-header-icon">
                <UserPlus size={18} />
              </div>
              <div className="uam-m-header-text">
                <h3>Create New User</h3>
                <p>Add a team member and configure their access</p>
              </div>
              <button className="uam-m-close" onClick={() => setShowCreateModal(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="uam-m-body">
              {formError && (
                <div className="uam-m-error">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Section: Identity */}
              <div className="uam-m-section">
                <div className="uam-m-section-label">
                  <UserIcon size={13} />
                  <span>Identity</span>
                </div>
                <div className="uam-m-fields-row">
                  <div className="uam-m-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Sarah Johnson"
                      value={newName}
                      onChange={e => { setNewName(e.target.value); setFormError(''); }}
                    />
                  </div>
                  <div className="uam-m-field">
                    <label>Email Address</label>
                    <div className="uam-m-input-icon">
                      <Mail size={14} />
                      <input
                        type="email"
                        placeholder="sarah.johnson@company.co"
                        value={newEmail}
                        onChange={e => { setNewEmail(e.target.value); setFormError(''); }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Role & Scope */}
              <div className="uam-m-section">
                <div className="uam-m-section-label">
                  <Briefcase size={13} />
                  <span>Role & Scope</span>
                </div>
                <div className="uam-m-fields-row">
                  <div className="uam-m-field">
                    <label>Role</label>
                    <div className="uam-dd-wrap">
                      <button
                        className="uam-dd-trigger"
                        onClick={() => { setShowRoleDropdown(!showRoleDropdown); setShowScopeDropdown(false); }}
                      >
                        <span className={`uam-dd-role-dot uam-dd-role-dot--${newRole.toLowerCase()}`} />
                        <span>{ROLE_LABELS[newRole]}</span>
                        <ChevronDown size={14} className="uam-dd-chevron" />
                      </button>
                      {showRoleDropdown && (
                        <div className="uam-dd-menu">
                          {roleOptions.map(r => (
                            <button
                              key={r}
                              className={`uam-dd-item ${r === newRole ? 'uam-dd-item--active' : ''}`}
                              onClick={() => { setNewRole(r); setNewScope(''); setShowRoleDropdown(false); setFormError(''); }}
                            >
                              <div className="uam-dd-item-left">
                                <span className={`uam-dd-role-dot uam-dd-role-dot--${r.toLowerCase()}`} />
                                <div className="uam-dd-item-text">
                                  <span className="uam-dd-item-name">{ROLE_LABELS[r]}</span>
                                  <span className="uam-dd-item-desc">{ROLE_DESCRIPTIONS[r]}</span>
                                </div>
                              </div>
                              {r === newRole && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="uam-m-field">
                    <label>{SCOPE_OPTIONS[newRole].label}</label>
                    <div className="uam-dd-wrap">
                      <button
                        className="uam-dd-trigger"
                        onClick={() => {
                          if (newRole === 'ADMIN') return;
                          setShowScopeDropdown(!showScopeDropdown);
                          setShowRoleDropdown(false);
                        }}
                        disabled={newRole === 'ADMIN'}
                      >
                        <MapPin size={14} className="uam-dd-icon-muted" />
                        <span>{newRole === 'ADMIN' ? 'Global (Full Access)' : newScope || 'Select assignment...'}</span>
                        {newRole !== 'ADMIN' && <ChevronDown size={14} className="uam-dd-chevron" />}
                      </button>
                      {showScopeDropdown && (
                        <div className="uam-dd-menu">
                          {SCOPE_OPTIONS[newRole].options.map(opt => (
                            <button
                              key={opt}
                              className={`uam-dd-item ${opt === newScope ? 'uam-dd-item--active' : ''}`}
                              onClick={() => { setNewScope(opt); setShowScopeDropdown(false); setFormError(''); }}
                            >
                              <span>{opt}</span>
                              {opt === newScope && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Access Preview */}
              <div className="uam-m-section uam-m-section--access">
                <div className="uam-m-section-label">
                  <Shield size={13} />
                  <span>Screen Access</span>
                  <span className="uam-m-access-count">{ROLE_ACCESS[newRole].length} screens auto-assigned</span>
                </div>
                <div className="uam-m-access-grid">
                  {ROLE_ACCESS[newRole].map(screen => (
                    <div key={screen} className="uam-m-access-item">
                      <Check size={12} />
                      <span>{SCREEN_LABELS[screen]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="uam-m-footer">
              <button className="uam-m-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="uam-m-submit" onClick={handleCreateUser}>
                <Send size={13} />
                <span>Send Invite</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
