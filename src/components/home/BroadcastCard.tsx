import React from 'react';
import { Badge, Button, Card } from 'impact-ui';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import { Broadcast } from '../../types/home';
import './BroadcastCard.css';

interface BroadcastCardProps {
  broadcast: Broadcast;
  onView: (id: string) => void;
  onAcknowledge: (id: string) => void;
  onFollowUp?: (id: string) => void;
}

export const BroadcastCard: React.FC<BroadcastCardProps> = ({
  broadcast,
  onView,
  onAcknowledge,
  onFollowUp,
}) => {
  const getPriorityColor = (priority: string): 'error' | 'warning' | 'info' | 'success' => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'info';
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.toUpperCase();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card size="small" sx={{ maxWidth: '100%', minHeight: 0, padding: 0, position: 'relative', borderLeft: !broadcast.isRead ? `4px solid var(--ia-color-primary)` : undefined }}>
      <div className={`broadcast-card-inner ${!broadcast.isRead ? 'broadcast-card-unread' : ''}`}>
      <div className="broadcast-card-header">
        <Badge
          label={getPriorityLabel(broadcast.priority)}
          color={getPriorityColor(broadcast.priority)}
          size="small"
        />
        {!broadcast.isRead && <div className="broadcast-card-unread-dot" />}
        {broadcast.isAcknowledged && (
          <div className="broadcast-card-acknowledged">
            <CheckCircleOutlined sx={{ fontSize: 14 }} />
            <span>Acknowledged</span>
          </div>
        )}
      </div>

      <h3 className="broadcast-card-title">{broadcast.title}</h3>
      <p className="broadcast-card-description">{broadcast.description}</p>

      <div className="broadcast-card-meta">
        <div className="broadcast-card-meta-item">
          <PersonOutlined sx={{ fontSize: 14 }} />
          <span>{broadcast.sender}</span>
          {broadcast.senderRole && <span className="broadcast-card-role">• {broadcast.senderRole}</span>}
        </div>
        <div className="broadcast-card-meta-item">
          <AccessTimeOutlined sx={{ fontSize: 14 }} />
          <span>{formatTime(broadcast.timestamp)}</span>
        </div>
        {broadcast.category && (
          <div className="broadcast-card-category">{broadcast.category}</div>
        )}
      </div>

      <div className="broadcast-card-actions">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<VisibilityOutlined sx={{ fontSize: 16 }} />}
          onClick={() => onView(broadcast.id)}
        >
          View
        </Button>
        {!broadcast.isAcknowledged && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={() => onAcknowledge(broadcast.id)}
          >
            Acknowledge
          </Button>
        )}
        {onFollowUp && (
          <Button
            variant="text"
            size="small"
            startIcon={<FlagOutlined sx={{ fontSize: 16 }} />}
            onClick={() => onFollowUp(broadcast.id)}
          >
            Follow-up
          </Button>
        )}
      </div>
      </div>
    </Card>
  );
};
