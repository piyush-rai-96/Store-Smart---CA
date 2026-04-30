import React from 'react';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Badge, Button, Card } from 'impact-ui';
import { Broadcast } from '../../../types/home';
import './BroadcastCard.css';

interface BroadcastCardProps {
  broadcast: Broadcast;
  onView: () => void;
  onAcknowledge?: () => void;
}

export const BroadcastCard: React.FC<BroadcastCardProps> = ({ 
  broadcast, 
  onView,
  onAcknowledge 
}) => {
  const getPriorityClass = () => {
    return `broadcast-card-${broadcast.priority}`;
  };

  const priorityBadgeColor = (): 'error' | 'warning' | 'info' => {
    if (broadcast.priority === 'critical') return 'error';
    if (broadcast.priority === 'high') return 'warning';
    return 'info';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <Card size="small" sx={{ maxWidth: '100%', minHeight: 0, padding: 0 }}>
      <div className={`broadcast-card-inner ${getPriorityClass()} ${!broadcast.isRead ? 'broadcast-card-unread' : ''}`}>
      <div className="broadcast-card-header">
        <Badge label={broadcast.priority.toUpperCase()} color={priorityBadgeColor()} size="small" className="broadcast-card-priority-badge" />
        {!broadcast.isRead && <div className="broadcast-card-unread-dot" />}
      </div>

      <h3 className="broadcast-card-title">{broadcast.title}</h3>
      <p className="broadcast-card-description">{broadcast.description}</p>

      <div className="broadcast-card-meta">
        <div className="broadcast-card-sender">
          <PersonOutlined sx={{ fontSize: 14 }} />
          <span>{broadcast.sender} • {broadcast.senderRole}</span>
        </div>
        <div className="broadcast-card-time">
          <AccessTimeOutlined sx={{ fontSize: 14 }} />
          <span>{formatTime(broadcast.timestamp)}</span>
        </div>
      </div>

      <div className="broadcast-card-actions">
        <Button variant="contained" color="primary" size="small" className="broadcast-card-action-primary" onClick={onView} startIcon={<VisibilityOutlined sx={{ fontSize: 16 }} />}>
          View Details
        </Button>
        {onAcknowledge && !broadcast.isAcknowledged && (
          <Button variant="outlined" color="primary" size="small" className="broadcast-card-action-secondary" onClick={onAcknowledge} startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}>
            Acknowledge
          </Button>
        )}
      </div>
      </div>
    </Card>
  );
};
