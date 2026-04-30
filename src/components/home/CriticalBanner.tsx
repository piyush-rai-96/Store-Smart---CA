import React from 'react';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { Button } from 'impact-ui';
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
                <ErrorOutlined sx={{ fontSize: 20 }} />
                <span>CRITICAL: {broadcast.title}</span>
              </div>
              <Button
                variant="text"
                size="small"
                className="critical-banner-close"
                onClick={() => onDismiss(broadcast.id)}
                aria-label="Dismiss"
              >
                <CloseOutlined sx={{ fontSize: 20 }} />
              </Button>
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
