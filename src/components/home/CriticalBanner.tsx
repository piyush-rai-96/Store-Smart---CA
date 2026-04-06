import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from 'impact-ui/dist/components';
import { Broadcast } from '../../types/broadcast';
import './CriticalBanner.css';

interface CriticalBannerProps {
  broadcasts: Broadcast[];
  onViewDetails: (broadcast: Broadcast) => void;
  onAcknowledge: (broadcastId: string) => void;
  onDismiss: (broadcastId: string) => void;
}

export const CriticalBanner: React.FC<CriticalBannerProps> = ({
  broadcasts,
  onViewDetails,
  onAcknowledge,
  onDismiss,
}) => {
  if (broadcasts.length === 0) return null;

  return (
    <div className="critical-banner-container">
      {broadcasts.map(broadcast => (
        <div key={broadcast.id} className="critical-banner">
          <div className="critical-banner-content">
            <div className="critical-banner-header">
              <div className="critical-banner-title">
                <AlertCircle size={20} />
                <span>CRITICAL: {broadcast.title}</span>
              </div>
              <button
                className="critical-banner-close"
                onClick={() => onDismiss(broadcast.id)}
                aria-label="Dismiss"
              >
                <X size={20} />
              </button>
            </div>

            <p className="critical-banner-message">
              {broadcast.message.length > 150
                ? `${broadcast.message.substring(0, 150)}...`
                : broadcast.message}
            </p>

            <div className="critical-banner-actions">
              <Button
                variant="outlined"
                size="small"
                onClick={() => onViewDetails(broadcast)}
                className="critical-banner-button critical-banner-button-outlined"
              >
                View Details
              </Button>
              {broadcast.requiresAcknowledgment && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onAcknowledge(broadcast.id)}
                  className="critical-banner-button critical-banner-button-filled"
                >
                  Acknowledge
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
