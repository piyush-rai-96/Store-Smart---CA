import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar as ImpactSidebar } from 'impact-ui';
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import RouterOutlined from '@mui/icons-material/RouterOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import StoreOutlined from '@mui/icons-material/StoreOutlined';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import PlaylistAddCheckOutlined from '@mui/icons-material/PlaylistAddCheckOutlined';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import WarehouseOutlined from '@mui/icons-material/WarehouseOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
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
    icon: <ApartmentOutlined sx={{ fontSize: 20 }} />,
    children: [
      { value: 'store-ops-home', label: 'Home', icon: <HomeOutlined sx={{ fontSize: 18 }} />, link: '/store-operations/home' },
      { value: 'district-intelligence', label: 'District Intelligence', icon: <PlaceOutlined sx={{ fontSize: 18 }} />, link: '/store-operations/district-intelligence' },
      { value: 'store-deep-dive', label: 'Store Deep Dive', icon: <StoreOutlined sx={{ fontSize: 18 }} />, link: '/store-operations/store-deep-dive' },
    ],
  },
  {
    value: 'planogram',
    label: 'Planogram Intelligence',
    icon: <LayersOutlined sx={{ fontSize: 20 }} />,
    children: [
      { value: 'master-pog', label: 'Master POG Management', icon: <WarehouseOutlined sx={{ fontSize: 18 }} />, link: '/planogram/master-pog' },
      { value: 'rule-management', label: 'POG Rule Management', icon: <AssignmentOutlined sx={{ fontSize: 18 }} />, link: '/planogram/rule-management' },
      { value: 'localization-engine', label: 'POG Localization Engine', icon: <AutoAwesomeOutlined sx={{ fontSize: 18 }} />, link: '/planogram/localization-engine' },
    ],
  },
  {
    value: 'command-center',
    label: 'Command Center',
    icon: <RouterOutlined sx={{ fontSize: 20 }} />,
    children: [
      { value: 'ai-copilot', label: 'AI Copilot', icon: <SmartToyOutlined sx={{ fontSize: 18 }} />, link: '/command-center/ai-copilot' },
      { value: 'operations-queue', label: 'Operations Queue', icon: <PlaylistAddCheckOutlined sx={{ fontSize: 18 }} />, link: '/command-center/operations-queue' },
      { value: 'communications', label: 'Communications', icon: <ForumOutlined sx={{ fontSize: 18 }} />, link: '/command-center/communications' },
    ],
  },
  {
    value: 'app-config',
    label: 'Application Configuration',
    icon: <SettingsOutlined sx={{ fontSize: 20 }} />,
    children: [
      { value: 'user-access', label: 'User Access Management', icon: <GroupOutlined sx={{ fontSize: 18 }} />, link: '/app-config/user-access' },
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
