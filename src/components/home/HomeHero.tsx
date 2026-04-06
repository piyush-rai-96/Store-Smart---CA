import React from 'react';
import { Badge } from 'impact-ui/dist/components';
import { Calendar, MapPin } from 'lucide-react';
import './HomeHero.css';

interface HomeHeroProps {
  userName: string;
  userRole: string;
  roleName: string;
  assignment: string;
  region?: string;
  lastSync?: Date;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  userName,
  roleName,
  assignment,
  region,
  lastSync,
}) => {
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="home-hero">
      <div className="home-hero-gradient" />
      <div className="home-hero-content">
        <div className="home-hero-main">
          <div className="home-hero-greeting">
            <h1 className="home-hero-title">
              Welcome back, <span className="home-hero-name">{userName}</span>
            </h1>
            <p className="home-hero-subtitle">Here's what needs your attention today</p>
          </div>
          
          <div className="home-hero-meta">
            <div className="home-hero-badges">
              <Badge label={roleName} color="info" size="medium" />
              <div className="home-hero-assignment">
                <MapPin size={16} />
                <span>{assignment}</span>
                {region && <span className="home-hero-region">• {region}</span>}
              </div>
            </div>
            
            <div className="home-hero-context">
              <div className="home-hero-date">
                <Calendar size={14} />
                <span>{formatDate()}</span>
              </div>
              {lastSync && (
                <div className="home-hero-sync">
                  Last synced: {formatTime(lastSync)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
