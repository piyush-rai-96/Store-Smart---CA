import React from 'react';
import { ShieldCheck, Lock, Users, UserCog } from 'lucide-react';
import './UserAccessManagement.css';

export const UserAccessManagement: React.FC = () => {
  return (
    <div className="uam-container">
      <div className="uam-content">
        <div className="uam-icon">
          <ShieldCheck size={48} />
        </div>
        <h1 className="uam-title">User Access Management</h1>
        <p className="uam-subtitle">Coming Soon</p>
        <p className="uam-desc">
          Role-based access control, user provisioning, and permission management for your store operations platform.
        </p>
        <div className="uam-features">
          <div className="uam-feature">
            <Users size={20} />
            <div>
              <h4>Team Management</h4>
              <p>Add, remove, and organize team members across stores and districts</p>
            </div>
          </div>
          <div className="uam-feature">
            <Lock size={20} />
            <div>
              <h4>Role-Based Permissions</h4>
              <p>Define granular access levels for managers, associates, and administrators</p>
            </div>
          </div>
          <div className="uam-feature">
            <UserCog size={20} />
            <div>
              <h4>Audit Trail</h4>
              <p>Track all access changes with detailed logs for compliance reporting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
