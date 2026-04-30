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
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';
import RotateLeftOutlined from '@mui/icons-material/RotateLeftOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import {
  Button, Badge, Card,
  Toast, Avatar, EmptyState, Tooltip,
  Input, Switch, Checkbox, Stepper, Modal, Select, Tag,
} from 'impact-ui';
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
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; scope?: string }>({});

  // Scope — Impact UI Select state
  const [scopeIsOpen, setScopeIsOpen] = useState(false);
  const [scopeCurrentOptions, setScopeCurrentOptions] = useState<{ label: string; value: string }[]>(
    () => SCOPE_OPTIONS['SM'].options.map(o => ({ label: o, value: o }))
  );
  const [scopeSelectedOptions, setScopeSelectedOptions] = useState<{ label: string; value: string }[]>([]);

  const handleScopeChange = (options: { label: string; value: string }[] | { label: string; value: string } | null) => {
    const opts = Array.isArray(options) ? options : options ? [options] : [];
    setScopeSelectedOptions(opts);
    const val = opts[0]?.value || '';
    setNewScope(val);
    if (val) setFieldErrors(prev => ({ ...prev, scope: undefined }));
  };
  const [customizeAccess, setCustomizeAccess] = useState(false);
  const [customAccess, setCustomAccess] = useState<ScreenAccess[]>([]);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    setScopeIsOpen(false);
    setScopeCurrentOptions(SCOPE_OPTIONS['SM'].options.map(o => ({ label: o, value: o })));
    setScopeSelectedOptions([]);
    setCustomizeAccess(false);
    setCustomAccess([]);
    setCurrentStep(1);
  };

  const effectiveAccess: ScreenAccess[] = customizeAccess && customAccess.length > 0 ? customAccess : ROLE_ACCESS[newRole];

  // ── Step completion state (used by step indicator) ──

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
          <Button variant="contained" size="medium" onClick={() => { resetForm(); setShowCreateModal(true); }} startIcon={<PersonAddAlt1Outlined sx={{ fontSize: 15 }}/>}>
            Create User
          </Button>
        </div>
      </div>

      {/* Success / delete toasts — Impact UI Toast */}
      <Toast
        isOpen={!!inviteSuccess}
        message={`Invitation sent successfully to ${inviteSuccess ?? ''}`}
        variant="success"
        position="top-right"
        autoHideDuration={4000}
        onClose={() => setInviteSuccess(null)}
      />
      <Toast
        isOpen={!!deleteSuccess}
        message={`${deleteSuccess ?? ''} was removed`}
        variant="error"
        position="top-right"
        autoHideDuration={2800}
        onClose={() => setDeleteSuccess(null)}
      />

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

      {/* ── Search toolbar — Impact UI Input ── */}
      <div className="uam-table-toolbar">
        <div className="uam-search-bar">
          <Input
            leftIcon={<SearchOutlined sx={{ fontSize: 15 }}/>}
            rightIcon={searchQuery ? <CloseOutlined sx={{ fontSize: 13 }}/> : undefined}
            rightIconClick={() => setSearchQuery('')}
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            size="small"
          />
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
                      <Avatar
                        type="withoutPicture"
                        size="small"
                        label={u.name}
                        className={`uam-avatar--${u.role.toLowerCase()}`}
                      />
                      <div className="uam-user-details">
                        <span className="uam-user-name">{u.name}</span>
                        <span className="uam-user-email">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge
                      label={ROLE_LABELS[u.role]}
                      variant="subtle"
                      color={u.role === 'SM' ? 'primary' : u.role === 'DM' ? 'info' : u.role === 'HQ' ? 'warning' : 'error'}
                      size="small"
                    />
                  </td>
                  <td>
                    <span className="uam-scope-text">{getUserScope(u)}</span>
                  </td>
                  <td>
                    <Badge
                      label={u.status === 'active' ? 'Active' : 'Invited'}
                      variant="subtle"
                      color={u.status === 'active' ? 'success' : 'warning'}
                      size="small"
                    />
                  </td>
                  <td className="uam-td-screens">
                    <Badge
                      label={`${u.accessRoutes.length} screens`}
                      variant="subtle"
                      color="primary"
                      size="small"
                    />
                  </td>
                  <td className="uam-td-actions" onClick={e => e.stopPropagation()}>
                    {currentUser?.id === u.id ? (
                      <Tooltip title="You can't remove your own account" orientation="top">
                        <span className="uam-action-self">You</span>
                      </Tooltip>
                    ) : (
                      <Tooltip title={`Remove ${u.name}`} orientation="top">
                        <Button
                          variant="text"
                          size="small"
                          className="uam-action-delete"
                          onClick={() => setConfirmDelete(u)}
                          aria-label={`Remove ${u.name}`}
                        >
                          <DeleteOutlined sx={{ fontSize: 14 }}/>
                        </Button>
                      </Tooltip>
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
                            <Tag
                              key={screen}
                              label={SCREEN_LABELS[screen]}
                              variant="stroke"
                              size="small"
                            />
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
                  <EmptyState
                    heading="No users found"
                    description={searchQuery ? 'No users match your search. Try adjusting the query.' : 'No users have been added yet.'}
                    emptyStateIcon={<SearchOutlined sx={{ fontSize: 40 }}/>}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========== Create User — Impact UI Modal (large) ========== */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="medium"
        footerOptions={
          <div className="uam-m-footer">
            <Button variant="outlined" className="uam-m-cancel" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <div className="uam-m-footer-right">
              {currentStep > 1 && (
                <Button variant="outlined" className="uam-m-back" onClick={goBack} startIcon={<KeyboardArrowLeft sx={{ fontSize: 14 }}/>}>
                  Back
                </Button>
              )}
              {currentStep < 3 ? (
                <Button variant="contained" className="uam-m-submit" onClick={goNext} endIcon={<KeyboardArrowRight sx={{ fontSize: 14 }}/>}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
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
        }
      >
        {/* Modal subtitle */}
        <div className="uam-m-subtitle">
          <PersonAddAlt1Outlined sx={{ fontSize: 16 }}/>
          <span>Add a team member and configure their access</span>
        </div>

        {/* Stepper — Impact UI Stepper */}
        <div className="uam-m-stepper">
          <Stepper
            variant="default"
            orientation="horizontal"
            activeStep={currentStep - 1}
            handleStep={idx => {
              const step = (idx + 1) as 1 | 2 | 3;
              if (step < currentStep) setCurrentStep(step);
            }}
            steps={[
              { label: 'Identity' },
              { label: 'Role & Scope' },
              { label: 'Screen Access' },
            ]}
          />
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
                    <Input
                      label="Full Name"
                      isRequired
                      placeholder="Sarah Johnson"
                      value={newName}
                      isError={!!fieldErrors.name}
                      isHelperText={!!fieldErrors.name}
                      helperText={fieldErrors.name}
                      onChange={e => { setNewName(e.target.value); if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined })); }}
                      onBlur={() => { if (!newName.trim()) setFieldErrors(prev => ({ ...prev, name: 'Full name is required' })); }}
                      size="large"
                    />
                  </div>
                  <div className="uam-m-field">
                    <Input
                      label="Email Address"
                      isRequired
                      leftIcon={<MailOutlined sx={{ fontSize: 14 }}/>}
                      type="email"
                      placeholder="sarah.johnson@company.co"
                      value={newEmail}
                      isError={!!fieldErrors.email}
                      isHelperText={!!fieldErrors.email}
                      helperText={fieldErrors.email}
                      onChange={e => { setNewEmail(e.target.value); if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                      onBlur={() => {
                        if (!newEmail.trim()) setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
                        else if (!EMAIL_REGEX.test(newEmail.trim())) setFieldErrors(prev => ({ ...prev, email: 'Enter a valid email address' }));
                      }}
                      size="large"
                    />
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
                        onClick={() => { setShowRoleDropdown(!showRoleDropdown); setScopeIsOpen(false); }}
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
                                setScopeIsOpen(false);
                                setScopeCurrentOptions(SCOPE_OPTIONS[r].options.map(o => ({ label: o, value: o })));
                                setScopeSelectedOptions([]);
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
                    {newRole === 'ADMIN' ? (
                      <Input
                        label={SCOPE_OPTIONS[newRole].label}
                        value="Global (Full Access)"
                        isDisabled
                        leftIcon={<PlaceOutlined sx={{ fontSize: 14 }}/>}
                        size="large"
                      />
                    ) : (
                      <Select
                        label={SCOPE_OPTIONS[newRole].label}
                        isRequired
                        placeholder="Select assignment..."
                        isOpen={scopeIsOpen}
                        setIsOpen={setScopeIsOpen}
                        initialOptions={SCOPE_OPTIONS[newRole].options.map(o => ({ label: o, value: o }))}
                        currentOptions={scopeCurrentOptions}
                        setCurrentOptions={opts => setScopeCurrentOptions(Array.isArray(opts) ? opts : [])}
                        selectedOptions={scopeSelectedOptions}
                        setSelectedOptions={handleScopeChange as (opts: { label: string; value: string }[] | { label: string; value: string } | null) => void}
                        setIsSelectAll={() => {}}
                        isError={!!fieldErrors.scope}
                        helperText={fieldErrors.scope}
                        width="100%"
                      />
                    )}
                    {fieldErrors.scope && newRole !== 'ADMIN' && (
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
                  <Switch
                    value={customizeAccess}
                    rightLabel="Customize Access"
                    onChange={e => {
                      const on = e.target.checked;
                      setCustomizeAccess(on);
                      if (on) setCustomAccess([...ROLE_ACCESS[newRole]]);
                      else setCustomAccess([]);
                    }}
                  />
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
                      <div key={screen} className={`uam-m-access-item uam-m-access-item--interactive ${isChecked ? 'uam-m-access-item--checked' : ''}`}>
                        <Checkbox
                          label={
                            <span className="uam-m-access-checkbox-label">
                              {SCREEN_LABELS[screen]}
                              {isAutoAssigned && <span className="uam-m-access-default" title="Default for this role">default</span>}
                            </span>
                          }
                          checked={isChecked}
                          onChange={() => toggleCustomScreen(screen)}
                        />
                      </div>
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
      </Modal>

      {/* ========== Confirm Delete — Impact UI Modal (small) ========== */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Remove user?"
        size="small"
        footerOptions={
          <div className="uam-confirm-actions">
            <Button variant="outlined" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="destructive"
              onClick={handleConfirmDelete}
              startIcon={<DeleteOutlined sx={{ fontSize: 13 }}/>}
            >
              Remove user
            </Button>
          </div>
        }
      >
        <div className="uam-confirm-body">
          <div className="uam-confirm-icon">
            <WarningAmberOutlined sx={{ fontSize: 28 }}/>
          </div>
          <p className="uam-confirm-text">
            You're about to permanently remove <strong>{confirmDelete?.name}</strong>
            {' '}({confirmDelete?.email}). They will lose access to StoreHub immediately.
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};
