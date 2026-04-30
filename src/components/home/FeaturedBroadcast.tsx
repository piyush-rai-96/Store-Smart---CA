import React from 'react';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Button } from 'impact-ui';
import { BroadcastScope, BroadcastCategory } from '../../types/home';
import './FeaturedBroadcast.css';

interface FeaturedBroadcastProps {
  title: string;
  message: string;
  severity: string;
  sender: string;
  senderRole: string;
  postedTime: Date;
  scope: BroadcastScope;
  scopeDetails?: string;
  dueTime: Date;
  category: BroadcastCategory;
  onViewDetails: () => void;
  onAcknowledge: () => void;
}

export const FeaturedBroadcast: React.FC<FeaturedBroadcastProps> = ({
  title,
  message,
  severity,
  sender,
  senderRole,
  postedTime,
  scope: _scope,
  scopeDetails,
  dueTime,
  category,
  onViewDetails,
  onAcknowledge,
}) => {
  const getSeverityClass = () => {
    switch (severity) {
      case 'critical':
        return 'featured-broadcast-critical';
      case 'high':
        return 'featured-broadcast-high';
      default:
        return 'featured-broadcast-normal';
    }
  };

  const getSeverityLabel = () => {
    switch (severity) {
      case 'critical':
        return 'CRITICAL ALERT';
      case 'high':
        return 'HIGH PRIORITY';
      default:
        return 'IMPORTANT';
    }
  };

  return (
    <div className={`featured-broadcast ${getSeverityClass()}`}>
      <div className="featured-broadcast-accent" />
      
      <div className="featured-broadcast-content">
        <div className="featured-broadcast-header">
          <div className="featured-broadcast-header-top">
            <div className="featured-broadcast-badge">
              <WarningAmberOutlined sx={{ fontSize: 16 }} />
              <span>{getSeverityLabel()}</span>
            </div>
            <div className="featured-broadcast-required-badge">
              <CheckCircleOutlined sx={{ fontSize: 14 }} />
              <span>ACKNOWLEDGEMENT REQUIRED</span>
            </div>
          </div>
          
          <div className="featured-broadcast-meta-row">
            <div className="featured-broadcast-meta-item">
              <span className="featured-broadcast-meta-label">Category:</span>
              <span>{category}</span>
            </div>
            <div className="featured-broadcast-meta-item">
              <span className="featured-broadcast-meta-label">Scope:</span>
              <GroupOutlined sx={{ fontSize: 14 }} />
              <span>{scopeDetails}</span>
            </div>
            <div className="featured-broadcast-meta-item">
              <AccessTimeOutlined sx={{ fontSize: 14 }} />
              <span>Posted {postedTime.toLocaleString()}</span>
            </div>
            <div className="featured-broadcast-meta-item featured-broadcast-due">
              <AccessTimeOutlined sx={{ fontSize: 14 }} />
              <span>Due: {dueTime.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="featured-broadcast-body">
          <h2 className="featured-broadcast-title">{title}</h2>
          <p className="featured-broadcast-message">{message}</p>
          
          <div className="featured-broadcast-sender">
            From: <strong>{sender}</strong> ({senderRole})
          </div>
        </div>

        <div className="featured-broadcast-actions">
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            startIcon={<VisibilityOutlined sx={{ fontSize: 18 }} />}
            onClick={onViewDetails}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            color="success"
            size="medium"
            startIcon={<CheckCircleOutlined sx={{ fontSize: 18 }} />}
            onClick={onAcknowledge}
          >
            Acknowledge Now
          </Button>
        </div>
      </div>
    </div>
  );
};
