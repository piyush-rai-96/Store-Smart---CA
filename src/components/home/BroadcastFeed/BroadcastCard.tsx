import React from 'react';
import { Clock, User } from 'lucide-react';
import { Button, Card } from 'impact-ui';
import { Broadcast } from '../../../types/broadcast';
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../../../constants/broadcasts';
import './BroadcastCard.css';

interface BroadcastCardProps {
  broadcast: Broadcast;
  onViewDetails: (broadcast: Broadcast) => void;
  onAcknowledge: (broadcastId: string) => void;
  onMarkAsRead: (broadcastId: string) => void;
}

export const BroadcastCard: React.FC<BroadcastCardProps> = ({
  broadcast,
  onViewDetails,
  onAcknowledge,
  onMarkAsRead,
}) => {
  const priorityConfig = PRIORITY_CONFIG[broadcast.priority];
  const categoryConfig = CATEGORY_CONFIG[broadcast.category];

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCardClick = () => {
    if (!broadcast.isRead) {
      onMarkAsRead(broadcast.id);
    }
  };

  return (
    <Card size="medium" className={`broadcast-card ${!broadcast.isRead ? 'broadcast-card-unread' : ''}`}>
      <div
        className="broadcast-card-content"
        onClick={handleCardClick}
        style={{
          borderLeft: !broadcast.isRead ? `4px solid ${priorityConfig.color}` : 'none',
        }}
      >
        {/* Header Row */}
        <div className="broadcast-card-header">
          <div className="broadcast-priority-badge" style={{ backgroundColor: priorityConfig.color }}>
            <span>{priorityConfig.icon}</span>
            <span>{priorityConfig.label.toUpperCase()}</span>
          </div>
          <div className="broadcast-timestamp">
            <Clock size={14} />
            <span>{getTimeAgo(broadcast.createdAt)}</span>
          </div>
        </div>

        {/* Title Row */}
        <div className="broadcast-title">
          {!broadcast.isRead && <span className="broadcast-unread-dot">●</span>}
          <h3>{broadcast.title}</h3>
        </div>

        {/* Meta Row */}
        <div className="broadcast-meta">
          <div className="broadcast-sender">
            <User size={14} />
            <span>From: {broadcast.sender.role}</span>
          </div>
          <span className="broadcast-meta-separator">•</span>
          <span className="broadcast-expiry">Expires: {formatDate(broadcast.expiresAt)}</span>
        </div>

        {/* Tags Row */}
        {(broadcast.linkedEntity || broadcast.category) && (
          <div className="broadcast-tags">
            {broadcast.linkedEntity && (
              <span className="broadcast-tag broadcast-tag-entity">
                {broadcast.linkedEntity.label}
              </span>
            )}
            <span
              className="broadcast-tag broadcast-tag-category"
              style={{ backgroundColor: `${categoryConfig.color}15`, color: categoryConfig.color }}
            >
              {categoryConfig.label}
            </span>
          </div>
        )}

        {/* Message Preview */}
        <p className="broadcast-message">
          {broadcast.message.length > 200
            ? `${broadcast.message.substring(0, 200)}...`
            : broadcast.message}
        </p>

        {/* Actions */}
        <div className="broadcast-actions">
          <Button
            variant="outlined"
            size="small"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onViewDetails(broadcast);
            }}
          >
            View Details
          </Button>
          {broadcast.requiresAcknowledgment && !broadcast.isAcknowledged && (
            <Button
              variant="contained"
              size="small"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onAcknowledge(broadcast.id);
              }}
            >
              Acknowledge
            </Button>
          )}
          {broadcast.isAcknowledged && (
            <span className="broadcast-acknowledged">✓ Acknowledged</span>
          )}
        </div>
      </div>
    </Card>
  );
};
