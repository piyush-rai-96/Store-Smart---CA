import React from 'react';
import { Clock, User, CheckCircle } from 'lucide-react';
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
    <div className={`broadcast-card ${getPriorityClass()} ${!broadcast.isRead ? 'broadcast-card-unread' : ''}`}>
      <div className="broadcast-card-header">
        <div className="broadcast-card-priority-badge">
          {broadcast.priority}
        </div>
        {!broadcast.isRead && <div className="broadcast-card-unread-dot" />}
      </div>

      <h3 className="broadcast-card-title">{broadcast.title}</h3>
      <p className="broadcast-card-description">{broadcast.description}</p>

      <div className="broadcast-card-meta">
        <div className="broadcast-card-sender">
          <User size={14} />
          <span>{broadcast.sender} • {broadcast.senderRole}</span>
        </div>
        <div className="broadcast-card-time">
          <Clock size={14} />
          <span>{formatTime(broadcast.timestamp)}</span>
        </div>
      </div>

      <div className="broadcast-card-actions">
        <button className="broadcast-card-action-primary" onClick={onView}>
          View Details
        </button>
        {onAcknowledge && !broadcast.isAcknowledged && (
          <button className="broadcast-card-action-secondary" onClick={onAcknowledge}>
            <CheckCircle size={16} />
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};
