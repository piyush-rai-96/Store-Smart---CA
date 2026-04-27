import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  FolderKanban,
  Building2,
  Radio,
  Settings
} from 'lucide-react';
import { User, ScreenAccess } from '../../../types';
import './SidebarNew.css';

// Map sidebar sub-module IDs to ScreenAccess identifiers
const SUB_MODULE_ACCESS: Record<string, ScreenAccess> = {
  'store-ops-home': 'home',
  'district-intelligence': 'district_intelligence',
  'store-deep-dive': 'store_deep_dive',
  'master-pog': 'master_pog_management',
  'rule-management': 'pog_rule_management',
  'localization-engine': 'pog_localization_engine',
  'ai-copilot': 'ai_copilot',
  'operations-queue': 'operations_queue',
  'communications': 'communications',
  'user-access': 'user_access_management',
};

interface SubModule {
  id: string;
  label: string;
  path: string;
}

interface NavigationModule {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  subModules?: SubModule[];
}

interface SidebarNewProps {
  user: User;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarNew: React.FC<SidebarNewProps> = ({ user, isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState<string[]>(['store-operations', 'planogram', 'command-center', 'app-config']);

  const navigationModules: NavigationModule[] = [
    {
      id: 'store-operations',
      label: 'Store Operations Hub',
      icon: <Building2 size={20} />,
      subModules: [
        {
          id: 'store-ops-home',
          label: 'Home',
          path: '/store-operations/home',
        },
        {
          id: 'district-intelligence',
          label: 'District Intelligence',
          path: '/store-operations/district-intelligence',
        },
        {
          id: 'store-deep-dive',
          label: 'Store Deep Dive',
          path: '/store-operations/store-deep-dive',
        },
      ],
    },
    {
      id: 'planogram',
      label: 'Planogram Intelligence',
      icon: <Layers size={20} />,
      subModules: [
        {
          id: 'master-pog',
          label: 'Master POG Management',
          path: '/planogram/master-pog',
        },
        {
          id: 'rule-management',
          label: 'POG Rule Management',
          path: '/planogram/rule-management',
        },
        {
          id: 'localization-engine',
          label: 'POG Localization Engine',
          path: '/planogram/localization-engine',
        },
      ],
    },
    {
      id: 'command-center',
      label: 'Command Center',
      icon: <Radio size={20} />,
      subModules: [
        {
          id: 'ai-copilot',
          label: 'AI Copilot',
          path: '/command-center/ai-copilot',
        },
        {
          id: 'operations-queue',
          label: 'Operations Queue',
          path: '/command-center/operations-queue',
        },
        {
          id: 'communications',
          label: 'Communications',
          path: '/command-center/communications',
        },
      ],
    },
    {
      id: 'app-config',
      label: 'Application Configuration',
      icon: <Settings size={20} />,
      subModules: [
        {
          id: 'user-access',
          label: 'User Access Management',
          path: '/app-config/user-access',
        },
      ],
    },
  ];

  // Filter navigation based on user's accessRoutes
  const filteredModules = navigationModules
    .map(module => {
      if (!module.subModules) return module;
      const allowedSubs = module.subModules.filter(sub => {
        const screenKey = SUB_MODULE_ACCESS[sub.id];
        return screenKey ? user.accessRoutes.includes(screenKey) : true;
      });
      return allowedSubs.length > 0 ? { ...module, subModules: allowedSubs } : null;
    })
    .filter((m): m is NavigationModule => m !== null);

  const toggleModule = (moduleId: string) => {
    if (isCollapsed) {
      onToggle();
      setExpandedModules([moduleId]);
      return;
    }
    
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isModuleActive = (module: NavigationModule) => {
    if (module.path && location.pathname === module.path) return true;
    if (module.subModules) {
      return module.subModules.some(sub => location.pathname.startsWith(sub.path));
    }
    return false;
  };

  const isSubModuleActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar-new ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-new-header">
        <button 
          className="sidebar-new-toggle"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-new-nav">
        {filteredModules.map(module => {
          const isExpanded = expandedModules.includes(module.id);
          const isActive = isModuleActive(module);
          const hasSubModules = module.subModules && module.subModules.length > 0;

          return (
            <div key={module.id} className="sidebar-new-module">
              <button
                className={`sidebar-new-module-btn ${isActive ? 'active' : ''}`}
                onClick={() => hasSubModules ? toggleModule(module.id) : module.path && handleNavigation(module.path)}
                title={isCollapsed ? module.label : undefined}
              >
                <span className="sidebar-new-module-icon">
                  {module.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="sidebar-new-module-label">{module.label}</span>
                    {hasSubModules && (
                      <span className="sidebar-new-module-chevron">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    )}
                  </>
                )}
              </button>

              {hasSubModules && !isCollapsed && isExpanded && (
                <div className="sidebar-new-submodules">
                  {module.subModules!.map(subModule => (
                    <button
                      key={subModule.id}
                      className={`sidebar-new-submodule-btn ${isSubModuleActive(subModule.path) ? 'active' : ''}`}
                      onClick={() => handleNavigation(subModule.path)}
                    >
                      <FolderKanban size={16} />
                      <span>{subModule.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="sidebar-new-footer">
          <div className="sidebar-new-user">
            <div className="sidebar-new-user-avatar">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="sidebar-new-user-info">
              <div className="sidebar-new-user-name">{user.name}</div>
              <div className="sidebar-new-user-email">{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
