import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { CriticalAlert } from '../../../types/home';
import './CriticalAlertBanner.css';

interface CriticalAlertBannerProps {
  alert: CriticalAlert;
  onDismiss?: () => void;
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ 
  alert, 
  onDismiss 
}) => {
  return (
    <div className={`critical-alert-banner critical-alert-${alert.severity}`}>
      <div className="critical-alert-icon">
        <AlertTriangle size={20} />
      </div>
      <div className="critical-alert-content">
        <div className="critical-alert-title">{alert.title}</div>
        <div className="critical-alert-message">{alert.message}</div>
      </div>
      <div className="critical-alert-actions">
        {alert.actions?.map((action, index) => (
          <button
            key={index}
            className="critical-alert-action-button"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
      </div>
      {onDismiss && (
        <button 
          className="critical-alert-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
