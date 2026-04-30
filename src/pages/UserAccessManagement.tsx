import React, { useState } from 'react';
import GppGoodOutlined from '@mui/icons-material/GppGoodOutlined';
import PersonAddAlt1Outlined from '@mui/icons-material/PersonAddAlt1Outlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Check from '@mui/icons-material/Check';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import MailOutlined from '@mui/icons-material/MailOutlined';
import WorkOutlined from '@mui/icons-material/WorkOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import MonitorOutlined from '@mui/icons-material/MonitorOutlined';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import RotateLeftOutlined from '@mui/icons-material/RotateLeftOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import { Button, Card } from 'impact-ui';
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
  const { allUsers, addUser, removeUser, user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    const removedName = confirmDelete.name;
    removeUser(confirmDelete.id);
    setConfirmDelete(null);
    setExpandedRow(prev => prev === confirmDelete.id ? null : prev);
    setDeleteSuccess(removedName);
    setTimeout(() => setDeleteSuccess(null), 2800);
  };

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('SM');
  const [newScope, setNewScope] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; scope?: string }>({});
  const [customizeAccess, setCustomizeAccess] = useState(false);
  const [customAccess, setCustomAccess] = useState<ScreenAccess[]>([]);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (v: string) => v.trim().length > 0 && EMAIL_REGEX.test(v.trim());

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
    setFieldErrors({});
    setShowRoleDropdown(false);
    setShowScopeDropdown(false);
    setCustomizeAccess(false);
    setCustomAccess([]);
    setCurrentStep(1);
  };

  const effectiveAccess: ScreenAccess[] = customizeAccess && customAccess.length > 0 ? customAccess : ROLE_ACCESS[newRole];

  // ── Step completion state (used by step indicator) ──
  const stepState = {
    identity: newName.trim().length > 0 && validateEmail(newEmail),
    roleScope: newRole === 'ADMIN' || newScope.length > 0,
    access: effectiveAccess.length > 0,
  };

  const toggleCustomScreen = (screen: ScreenAccess) => {
    setCustomAccess(prev =>
      prev.includes(screen) ? prev.filter(s => s !== screen) : [...prev, screen]
    );
  };

  // Validate a specific step; writes fieldErrors and returns true/false
  const validateStep = (step: 1 | 2 | 3): boolean => {
    if (step === 1) {
      const errors: { name?: string; email?: string } = {};
      if (!newName.trim()) errors.name = 'Full name is required';
      if (!newEmail.trim()) errors.email = 'Email is required';
      else if (!EMAIL_REGEX.test(newEmail.trim())) errors.email = 'Enter a valid email address';
      else if (allUsers.some(u => u.email.toLowerCase() === newEmail.trim().toLowerCase())) {
        errors.email = 'A user with this email already exists';
      }
      if (Object.keys(errors).length > 0) {
        setFieldErrors(prev => ({ ...prev, ...errors }));
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (newRole !== 'ADMIN' && !newScope) {
        setFieldErrors(prev => ({ ...prev, scope: 'Please select a scope assignment' }));
        return false;
      }
      return true;
    }
    // step === 3
    if (customizeAccess && customAccess.length === 0) return false;
    return effectiveAccess.length > 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 3) setCurrentStep((currentStep + 1) as 2 | 3);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as 1 | 2);
  };

  const handleCreateUser = () => {
    // Re-validate all steps before submitting
    if (!validateStep(1)) { setCurrentStep(1); return; }
    if (!validateStep(2)) { setCurrentStep(2); return; }
    if (!validateStep(3)) { setCurrentStep(3); return; }

    const user: User = {
      id: `user-${Date.now()}`,
      email: newEmail.trim(),
      name: newName.trim(),
      role: newRole,
      accessRoutes: effectiveAccess,
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
      {/* ── Header (mirrors District Intelligence Center) ── */}
      <div className="district-intel-header uam-di-header">
        <div className="header-left">
          <div className="header-title">
            <GppGoodOutlined sx={{ fontSize: 24 }}/>
            <h1>User Access Management</h1>
          </div>
          <div className="header-meta">
            <span className="district-badge">
              <SecurityOutlined sx={{ fontSize: 14 }}/>
              Team Directory
            </span>
            <span className="district-badge uam-meta-pill">
              <PersonOutlined sx={{ fontSize: 14 }}/>
              {statCounts.total} members
            </span>
            <span className="uam-meta-updated">Manage roles, scope &amp; platform access</span>
          </div>
        </div>
        <div className="uam-header-right">
          <Button variant="contained" color="primary" size="medium" className="uam-create-btn" onClick={() => { resetForm(); setShowCreateModal(true); }} startIcon={<PersonAddAlt1Outlined sx={{ fontSize: 15 }}/>}>
            Create User
          </Button>
        </div>
      </div>

      {/* Success toast */}
      {inviteSuccess && (
        <div className="uam-toast">
          <div className="uam-toast-icon"><Check sx={{ fontSize: 14 }}/></div>
          <span>Invitation sent successfully to <strong>{inviteSuccess}</strong></span>
        </div>
      )}

      {/* Delete success toast */}
      {deleteSuccess && (
        <div className="uam-toast uam-toast--danger">
          <div className="uam-toast-icon uam-toast-icon--danger"><DeleteOutlined sx={{ fontSize: 14 }}/></div>
          <span><strong>{deleteSuccess}</strong> was removed</span>
        </div>
      )}

      {/* ── Stats Strip (DI bca-overview-grid pattern) ── */}
      <Card size="extraSmall" sx={{ maxWidth: '100%', minHeight: 0, padding: 0, overflow: 'hidden', margin: '0 16px 16px' }}>
        <div className="bca-overview-grid uam-stats-grid">
          <div className="bca-kpi-card">
            <span className="bca-kpi-label">Total Users</span>
            <span className="bca-kpi-value">{statCounts.total}</span>
            <span className="bca-kpi-context">across all roles</span>
          </div>
          <div className="bca-kpi-card">
            <span className="bca-kpi-label">Active</span>
            <span className="bca-kpi-value">{statCounts.active}</span>
            <span className="bca-kpi-context">currently signed in</span>
          </div>
          <div className="bca-kpi-card">
            <span className="bca-kpi-label">Pending</span>
            <span className="bca-kpi-value">{statCounts.invited}</span>
            <span className="bca-kpi-context">invite not accepted</span>
          </div>
          <div className="bca-kpi-card">
            <span className="bca-kpi-label">Roles</span>
            <span className="bca-kpi-value">{statCounts.roles}</span>
            <span className="bca-kpi-context">distinct role types</span>
          </div>
          <div className="bca-kpi-card">
            <span className="bca-kpi-label">Filtered</span>
            <span className="bca-kpi-value">{filteredUsers.length}</span>
            <span className="bca-kpi-context">matching search</span>
          </div>
        </div>
      </Card>

      {/* ── Search toolbar (above table, mirrors DI Leaderboard) ── */}
      <div className="uam-table-toolbar">
        <div className="uam-search-bar">
          <SearchOutlined sx={{ fontSize: 15 }}/>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="uam-search-clear" onClick={() => setSearchQuery('')}>
              <CloseOutlined sx={{ fontSize: 13 }}/>
            </button>
          )}
        </div>
        <span className="uam-toolbar-count">{filteredUsers.length} of {allUsers.length} users</span>
      </div>

      {/* ── Users Table ── */}
      <div className="uam-table-card uam-table-card--modern">
        <table className="uam-table wow-table">
          <thead>
            <tr>
              <th className="uam-th-name">User</th>
              <th>Role</th>
              <th>Scope</th>
              <th>Status</th>
              <th className="uam-th-screens">Access</th>
              <th className="uam-th-actions">Actions</th>
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
                      <MonitorOutlined sx={{ fontSize: 12 }}/>
                      <span>{u.accessRoutes.length}</span>
                    </div>
                  </td>
                  <td className="uam-td-actions" onClick={e => e.stopPropagation()}>
                    {currentUser?.id === u.id ? (
                      <span className="uam-action-self" title="You can't remove your own account">You</span>
                    ) : (
                      <button
                        type="button"
                        className="uam-action-delete"
                        title={`Remove ${u.name}`}
                        onClick={() => setConfirmDelete(u)}
                      >
                        <DeleteOutlined sx={{ fontSize: 14 }}/>
                      </button>
                    )}
                  </td>
                </tr>
                {/* Expanded detail row */}
                {expandedRow === u.id && (
                  <tr className="uam-expand-row">
                    <td colSpan={6}>
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
                <td colSpan={6} className="uam-empty">
                  <SearchOutlined sx={{ fontSize: 20 }}/>
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
                <PersonAddAlt1Outlined sx={{ fontSize: 18 }}/>
              </div>
              <div className="uam-m-header-text">
                <h3>Create New User</h3>
                <p>Add a team member and configure their access</p>
              </div>
              <button className="uam-m-close" onClick={() => setShowCreateModal(false)}>
                <CloseOutlined sx={{ fontSize: 16 }}/>
              </button>
            </div>

            {/* Step indicator */}
            <div className="uam-m-steps">
              {[
                { num: 1 as const, key: 'identity', label: 'Identity', done: stepState.identity, icon: <PersonOutlined sx={{ fontSize: 13 }}/> },
                { num: 2 as const, key: 'roleScope', label: 'Role & Scope', done: stepState.roleScope, icon: <WorkOutlined sx={{ fontSize: 13 }}/> },
                { num: 3 as const, key: 'access', label: 'Screen Access', done: stepState.access, icon: <SecurityOutlined sx={{ fontSize: 13 }}/> },
              ].map((step, idx, arr) => {
                const isActive = currentStep === step.num;
                const isComplete = currentStep > step.num;
                return (
                  <React.Fragment key={step.key}>
                    <div className={`uam-m-step ${isActive ? 'uam-m-step--active' : ''} ${isComplete ? 'uam-m-step--done' : ''}`}>
                      <span className="uam-m-step-num">
                        {isComplete ? <TaskAltOutlined sx={{ fontSize: 14 }}/> : step.num}
                      </span>
                      <span className="uam-m-step-label">
                        {step.icon}
                        {step.label}
                      </span>
                    </div>
                    {idx < arr.length - 1 && <span className={`uam-m-step-divider ${isComplete ? 'uam-m-step-divider--done' : ''}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Modal body */}
            <div className="uam-m-body">
              {/* Section: Identity (Step 1) */}
              {currentStep === 1 && (
              <div className="uam-m-section">
                <div className="uam-m-section-label">
                  <PersonOutlined sx={{ fontSize: 13 }}/>
                  <span>Identity</span>
                </div>
                <div className="uam-m-fields-row">
                  <div className="uam-m-field">
                    <label>Full Name <span className="uam-m-req">*</span></label>
                    <input
                      type="text"
                      className={fieldErrors.name ? 'uam-m-input--error' : ''}
                      placeholder="Sarah Johnson"
                      value={newName}
                      onChange={e => { setNewName(e.target.value); if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined })); }}
                      onBlur={() => { if (!newName.trim()) setFieldErrors(prev => ({ ...prev, name: 'Full name is required' })); }}
                    />
                    {fieldErrors.name && (
                      <span className="uam-m-field-error"><ErrorOutlined sx={{ fontSize: 12 }}/>{fieldErrors.name}</span>
                    )}
                  </div>
                  <div className="uam-m-field">
                    <label>Email Address <span className="uam-m-req">*</span></label>
                    <div className={`uam-m-input-icon ${fieldErrors.email ? 'uam-m-input-icon--error' : ''}`}>
                      <MailOutlined sx={{ fontSize: 14 }}/>
                      <input
                        type="email"
                        placeholder="sarah.johnson@company.co"
                        value={newEmail}
                        onChange={e => { setNewEmail(e.target.value); if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                        onBlur={() => {
                          if (!newEmail.trim()) setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
                          else if (!EMAIL_REGEX.test(newEmail.trim())) setFieldErrors(prev => ({ ...prev, email: 'Enter a valid email address' }));
                        }}
                      />
                    </div>
                    {fieldErrors.email && (
                      <span className="uam-m-field-error"><ErrorOutlined sx={{ fontSize: 12 }}/>{fieldErrors.email}</span>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Section: Role & Scope (Step 2) */}
              {currentStep === 2 && (
              <div className="uam-m-section">
                <div className="uam-m-section-label">
                  <WorkOutlined sx={{ fontSize: 13 }}/>
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
                        <KeyboardArrowDown sx={{ fontSize: 14 }} className="uam-dd-chevron"/>
                      </button>
                      {showRoleDropdown && (
                        <div className="uam-dd-menu">
                          {roleOptions.map(r => (
                            <button
                              key={r}
                              className={`uam-dd-item ${r === newRole ? 'uam-dd-item--active' : ''}`}
                              onClick={() => {
                                setNewRole(r);
                                setNewScope('');
                                setShowRoleDropdown(false);
                                setFieldErrors(prev => ({ ...prev, scope: undefined }));
                                // Reset custom access when role changes
                                setCustomizeAccess(false);
                                setCustomAccess([]);
                              }}
                            >
                              <div className="uam-dd-item-left">
                                <span className={`uam-dd-role-dot uam-dd-role-dot--${r.toLowerCase()}`} />
                                <div className="uam-dd-item-text">
                                  <span className="uam-dd-item-name">{ROLE_LABELS[r]}</span>
                                  <span className="uam-dd-item-desc">{ROLE_DESCRIPTIONS[r]}</span>
                                </div>
                              </div>
                              {r === newRole && <Check sx={{ fontSize: 14 }}/>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="uam-m-field">
                    <label>{SCOPE_OPTIONS[newRole].label} {newRole !== 'ADMIN' && <span className="uam-m-req">*</span>}</label>
                    <div className="uam-dd-wrap">
                      <button
                        className={`uam-dd-trigger ${fieldErrors.scope ? 'uam-dd-trigger--error' : ''}`}
                        onClick={() => {
                          if (newRole === 'ADMIN') return;
                          setShowScopeDropdown(!showScopeDropdown);
                          setShowRoleDropdown(false);
                        }}
                        disabled={newRole === 'ADMIN'}
                      >
                        <PlaceOutlined sx={{ fontSize: 14 }} className="uam-dd-icon-muted"/>
                        <span>{newRole === 'ADMIN' ? 'Global (Full Access)' : newScope || 'Select assignment...'}</span>
                        {newRole !== 'ADMIN' && <KeyboardArrowDown sx={{ fontSize: 14 }} className="uam-dd-chevron"/>}
                      </button>
                      {showScopeDropdown && (
                        <div className="uam-dd-menu">
                          {SCOPE_OPTIONS[newRole].options.map(opt => (
                            <button
                              key={opt}
                              className={`uam-dd-item ${opt === newScope ? 'uam-dd-item--active' : ''}`}
                              onClick={() => { setNewScope(opt); setShowScopeDropdown(false); setFieldErrors(prev => ({ ...prev, scope: undefined })); }}
                            >
                              <span>{opt}</span>
                              {opt === newScope && <Check sx={{ fontSize: 14 }}/>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {fieldErrors.scope && (
                      <span className="uam-m-field-error"><ErrorOutlined sx={{ fontSize: 12 }}/>{fieldErrors.scope}</span>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Section: Screen Access (Step 3) */}
              {currentStep === 3 && (
              <div className="uam-m-section uam-m-section--access">
                <div className="uam-m-section-label">
                  <SecurityOutlined sx={{ fontSize: 13 }}/>
                  <span>Screen Access</span>
                  <span className="uam-m-access-count">
                    {effectiveAccess.length} screen{effectiveAccess.length === 1 ? '' : 's'}{' '}
                    {customizeAccess ? 'selected' : 'auto-assigned'}
                  </span>
                  <label className="uam-m-customize-toggle">
                    <input
                      type="checkbox"
                      checked={customizeAccess}
                      onChange={e => {
                        const on = e.target.checked;
                        setCustomizeAccess(on);
                        if (on) setCustomAccess([...ROLE_ACCESS[newRole]]);
                        else setCustomAccess([]);
                      }}
                    />
                    <TuneOutlined sx={{ fontSize: 12 }}/>
                    <span>Customize Access</span>
                  </label>
                </div>

                {customizeAccess && (
                  <div className="uam-m-customize-hint">
                    <span>Toggle any screen on or off. Auto-assigned defaults are pre-selected.</span>
                    <button
                      type="button"
                      className="uam-m-reset-btn"
                      onClick={() => setCustomAccess([...ROLE_ACCESS[newRole]])}
                    >
                      <RotateLeftOutlined sx={{ fontSize: 11 }}/>
                      Reset to role defaults
                    </button>
                  </div>
                )}

                <div className="uam-m-access-grid">
                  {(Object.keys(SCREEN_LABELS) as ScreenAccess[]).map(screen => {
                    const isAutoAssigned = ROLE_ACCESS[newRole].includes(screen);
                    const isChecked = customizeAccess ? customAccess.includes(screen) : isAutoAssigned;

                    if (!customizeAccess && !isAutoAssigned) return null;

                    return customizeAccess ? (
                      <label
                        key={screen}
                        className={`uam-m-access-item uam-m-access-item--interactive ${isChecked ? 'uam-m-access-item--checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCustomScreen(screen)}
                        />
                        <span className="uam-m-access-check">
                          {isChecked && <Check sx={{ fontSize: 11 }}/>}
                        </span>
                        <span>{SCREEN_LABELS[screen]}</span>
                        {isAutoAssigned && <span className="uam-m-access-default" title="Default for this role">default</span>}
                      </label>
                    ) : (
                      <div key={screen} className="uam-m-access-item">
                        <Check sx={{ fontSize: 12 }}/>
                        <span>{SCREEN_LABELS[screen]}</span>
                      </div>
                    );
                  })}
                </div>

                {customizeAccess && customAccess.length === 0 && (
                  <span className="uam-m-field-error"><ErrorOutlined sx={{ fontSize: 12 }}/>Select at least one screen</span>
                )}
              </div>
              )}
            </div>

            {/* Modal footer — step-aware navigation */}
            <div className="uam-m-footer">
              <Button variant="outlined" color="primary" className="uam-m-cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <div className="uam-m-footer-right">
                {currentStep > 1 && (
                  <Button variant="outlined" color="primary" className="uam-m-back" onClick={goBack} startIcon={<KeyboardArrowLeft sx={{ fontSize: 14 }}/>}>
                    Back
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button variant="contained" color="primary" className="uam-m-submit" onClick={goNext} endIcon={<KeyboardArrowRight sx={{ fontSize: 14 }}/>}>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className="uam-m-submit"
                    onClick={handleCreateUser}
                    disabled={customizeAccess && customAccess.length === 0}
                    startIcon={<SendOutlined sx={{ fontSize: 13 }}/>}
                  >
                    Send Invite
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== Confirm Delete Modal ========== */}
      {confirmDelete && (
        <div className="uam-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="uam-confirm" onClick={e => e.stopPropagation()}>
            <div className="uam-confirm-icon">
              <WarningAmberOutlined sx={{ fontSize: 22 }}/>
            </div>
            <h3 className="uam-confirm-title">Remove user?</h3>
            <p className="uam-confirm-text">
              You're about to permanently remove <strong>{confirmDelete.name}</strong>
              {' '}({confirmDelete.email}). They will lose access to StoreHub immediately.
              This action cannot be undone.
            </p>
            <div className="uam-confirm-actions">
              <Button variant="outlined" color="primary" className="uam-m-cancel" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button variant="contained" color="error" className="uam-confirm-delete-btn" onClick={handleConfirmDelete} startIcon={<DeleteOutlined sx={{ fontSize: 13 }}/>}>
                Remove user
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
