import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar as ImpactSidebar } from 'impact-ui';
import {
  Building2,
  Layers,
  Radio,
  Settings,
  Home,
  MapPin,
  Store,
  Bot,
  ListChecks,
  MessagesSquare,
  Users,
  ClipboardList,
  Boxes,
  Sparkles,
} from 'lucide-react';
import { User, ScreenAccess } from '../../../types';
import './AppSidebar.css';

interface AppSidebarProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

interface SidebarRoute {
  value: string;
  label: string;
  icon: React.ReactNode;
  link?: string;
  children?: SidebarRoute[];
}

const SUB_MODULE_ACCESS: Record<string, ScreenAccess> = {
  'store-ops-home': 'home',
  'district-intelligence': 'district_intelligence',
  'store-deep-dive': 'store_deep_dive',
  'master-pog': 'master_pog_management',
  'rule-management': 'pog_rule_management',
  'localization-engine': 'pog_localization_engine',
  'ai-copilot': 'ai_copilot',
  'operations-queue': 'operations_queue',
  communications: 'communications',
  'user-access': 'user_access_management',
};

const ALL_MODULES: SidebarRoute[] = [
  {
    value: 'store-operations',
    label: 'Store Operations Hub',
    icon: <Building2 size={20} />,
    children: [
      { value: 'store-ops-home', label: 'Home', icon: <Home size={18} />, link: '/store-operations/home' },
      { value: 'district-intelligence', label: 'District Intelligence', icon: <MapPin size={18} />, link: '/store-operations/district-intelligence' },
      { value: 'store-deep-dive', label: 'Store Deep Dive', icon: <Store size={18} />, link: '/store-operations/store-deep-dive' },
    ],
  },
  {
    value: 'planogram',
    label: 'Planogram Intelligence',
    icon: <Layers size={20} />,
    children: [
      { value: 'master-pog', label: 'Master POG Management', icon: <Boxes size={18} />, link: '/planogram/master-pog' },
      { value: 'rule-management', label: 'POG Rule Management', icon: <ClipboardList size={18} />, link: '/planogram/rule-management' },
      { value: 'localization-engine', label: 'POG Localization Engine', icon: <Sparkles size={18} />, link: '/planogram/localization-engine' },
    ],
  },
  {
    value: 'command-center',
    label: 'Command Center',
    icon: <Radio size={20} />,
    children: [
      { value: 'ai-copilot', label: 'AI Copilot', icon: <Bot size={18} />, link: '/command-center/ai-copilot' },
      { value: 'operations-queue', label: 'Operations Queue', icon: <ListChecks size={18} />, link: '/command-center/operations-queue' },
      { value: 'communications', label: 'Communications', icon: <MessagesSquare size={18} />, link: '/command-center/communications' },
    ],
  },
  {
    value: 'app-config',
    label: 'Application Configuration',
    icon: <Settings size={20} />,
    children: [
      { value: 'user-access', label: 'User Access Management', icon: <Users size={18} />, link: '/app-config/user-access' },
    ],
  },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({ user, isOpen, setIsOpen, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const filteredRoutes = useMemo<SidebarRoute[]>(() => {
    return ALL_MODULES
      .map(module => {
        if (!module.children) return module;
        const allowed = module.children.filter(sub => {
          const screenKey = SUB_MODULE_ACCESS[sub.value];
          return screenKey ? user.accessRoutes.includes(screenKey) : true;
        });
        return allowed.length > 0 ? { ...module, children: allowed } : null;
      })
      .filter((m): m is SidebarRoute => m !== null);
  }, [user.accessRoutes]);

  const { parentActive, childActive } = useMemo(() => {
    for (const m of filteredRoutes) {
      for (const c of m.children || []) {
        if (c.link && location.pathname.startsWith(c.link)) {
          return { parentActive: m.value, childActive: c.value };
        }
      }
    }
    return { parentActive: '', childActive: '' };
  }, [filteredRoutes, location.pathname]);

  const handleParentRouteChange = (item: SidebarRoute) => {
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleChildRouteChange = (_parent: SidebarRoute, child: SidebarRoute) => {
    if (child.link) {
      navigate(child.link);
    }
  };

  return (
    <div className="app-sidebar-host">
      <ImpactSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleClose={() => setIsOpen(!isOpen)}
        routes={filteredRoutes}
        actionRoutes={[]}
        parentActive={parentActive}
        childActive={childActive}
        handleParentRouteChange={handleParentRouteChange}
        handleChildRouteChange={handleChildRouteChange}
        handleLogOut={onLogout}
        isCloseWhenClickOutside={false}
        isMemoryRouter={false}
      />
    </div>
  );
};
