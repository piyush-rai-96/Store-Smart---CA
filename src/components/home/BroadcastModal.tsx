import React from 'react';
import { Modal, Button } from 'impact-ui/dist/components';
import { Clock, User, Calendar } from 'lucide-react';
import { Broadcast } from '../../types/broadcast';
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../../constants/broadcasts';
import './BroadcastModal.css';

interface BroadcastModalProps {
  broadcast: Broadcast | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (broadcastId: string) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  broadcast,
  isOpen,
  onClose,
  onAcknowledge,
}) => {
  if (!broadcast) return null;

  const priorityConfig = PRIORITY_CONFIG[broadcast.priority];
  const categoryConfig = CATEGORY_CONFIG[broadcast.category];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAcknowledge = () => {
    onAcknowledge(broadcast.id);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={broadcast.title}
      size="large"
    >
      <div className="broadcast-modal-content">
        {/* Priority and Category */}
        <div className="broadcast-modal-badges">
          <div
            className="broadcast-modal-priority"
            style={{ backgroundColor: priorityConfig.color }}
          >
            {priorityConfig.icon} {priorityConfig.label.toUpperCase()}
          </div>
          <div
            className="broadcast-modal-category"
            style={{
              backgroundColor: `${categoryConfig.color}15`,
              color: categoryConfig.color,
            }}
          >
            {categoryConfig.label}
          </div>
        </div>

        {/* Meta Information */}
        <div className="broadcast-modal-meta">
          <div className="broadcast-modal-meta-item">
            <User size={16} />
            <span>From: {broadcast.sender.role} - {broadcast.sender.name}</span>
          </div>
          <div className="broadcast-modal-meta-item">
            <Clock size={16} />
            <span>Posted: {formatDate(broadcast.createdAt)}</span>
          </div>
          <div className="broadcast-modal-meta-item">
            <Calendar size={16} />
            <span>Expires: {formatDate(broadcast.expiresAt)}</span>
          </div>
        </div>

        {/* Linked Entity */}
        {broadcast.linkedEntity && (
          <div className="broadcast-modal-linked">
            <strong>Related:</strong> {broadcast.linkedEntity.label}
          </div>
        )}

        {/* Message */}
        <div className="broadcast-modal-message">
          <p>{broadcast.message}</p>
        </div>

        {/* Attachments */}
        {broadcast.attachments && broadcast.attachments.length > 0 && (
          <div className="broadcast-modal-attachments">
            <h4>Attachments:</h4>
            <ul>
              {broadcast.attachments.map((attachment, index) => (
                <li key={index}>
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                    {attachment.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="broadcast-modal-actions">
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          {broadcast.requiresAcknowledgment && !broadcast.isAcknowledged && (
            <Button variant="contained" onClick={handleAcknowledge}>
              Acknowledge
            </Button>
          )}
          {broadcast.isAcknowledged && (
            <span className="broadcast-modal-acknowledged">✓ Acknowledged</span>
          )}
        </div>
      </div>
    </Modal>
  );
};
