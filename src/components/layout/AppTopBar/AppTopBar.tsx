import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header as ImpactHeader, Button } from 'impact-ui';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import AssignmentTurnedInOutlined from '@mui/icons-material/AssignmentTurnedInOutlined';
import InventoryOutlined from '@mui/icons-material/InventoryOutlined';
import { User } from '../../../types';
import { APP_CONFIG } from '../../../constants/app';
import './AppTopBar.css';

interface AppTopBarProps {
  user: User;
  onLogout: () => void;
}

type NotifType = 'warning' | 'info' | 'success';

interface NotifItem {
  id: number;
  icon: React.ReactNode;
  text: string;
  time: string;
  type: NotifType;
}

const MOCK_NOTIFICATIONS: NotifItem[] = [
  { id: 1, icon: <WarningAmberOutlined sx={{ fontSize: 14 }} />, text: 'Store #5678 Pine Grove audit overdue', time: '12 min ago', type: 'warning' },
  { id: 2, icon: <CampaignOutlined sx={{ fontSize: 14 }} />, text: 'New broadcast from HQ: Weekly priorities', time: '1h ago', type: 'info' },
  { id: 3, icon: <AssignmentTurnedInOutlined sx={{ fontSize: 14 }} />, text: 'SEA compliance updated for District 14', time: '2h ago', type: 'success' },
  { id: 4, icon: <InventoryOutlined sx={{ fontSize: 14 }} />, text: 'Inbound shipment delayed — Cologne East', time: '3h ago', type: 'warning' },
];

export const AppTopBar: React.FC<AppTopBarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const notificationCount = MOCK_NOTIFICATIONS.length;

  useEffect(() => {
    if (!showNotifications) return;
    const onClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showNotifications]);

  const firstName = user.name.split(' ')[0];

  const dropMenuOptions = [
    {
      label: firstName,
      onClick: () => {},
      isDisabled: true,
    },
    {
      label: 'Log out',
      onClick: onLogout,
      isDisabled: false,
    },
  ];

  return (
    <div className="app-topbar-host">
      <ImpactHeader
        title={APP_CONFIG.name}
        userName={user.name}
        showHelpIcon
        showNotificationIcon
        notificationIndicator={notificationCount > 0}
        showMessageIcon={false}
        showChatBotIcon={false}
        handleLogoClick={() => navigate('/store-operations/home')}
        handleHelpClick={() => window.open('https://impactanalytics.co', '_blank')}
        handleNotificationClick={() => setShowNotifications(prev => !prev)}
        dropMenuOptions={dropMenuOptions}
        avatarType="withoutPicture"
        avatarProps={{ label: user.name }}
      />
      {showNotifications && (
        <div className="app-topbar-notif-panel" ref={notifRef} role="dialog" aria-label="Notifications">
          <div className="app-topbar-notif-header">
            <span className="app-topbar-notif-title">Notifications</span>
            <span className="app-topbar-notif-count">{notificationCount} new</span>
          </div>
          <div className="app-topbar-notif-list">
            {MOCK_NOTIFICATIONS.map(n => (
              <div key={n.id} className={`app-topbar-notif-item app-topbar-notif-${n.type}`}>
                <div className="app-topbar-notif-icon">{n.icon}</div>
                <div className="app-topbar-notif-body">
                  <span className="app-topbar-notif-text">{n.text}</span>
                  <span className="app-topbar-notif-time">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="app-topbar-notif-footer">
            <Button
              variant="text"
              color="primary"
              size="small"
              className="app-topbar-notif-cta"
              onClick={() => setShowNotifications(false)}
            >
              Mark all as read
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
