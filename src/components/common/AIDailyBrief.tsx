import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Star,
  X,
} from 'lucide-react';

export type BriefSectionIcon = 'triage' | 'performance' | 'ops' | 'customer' | 'recommendations';

export interface BriefSection {
  title: string;
  icon: BriefSectionIcon;
  bullets: string[];
}

export interface AIDailyBriefData {
  greeting: string;
  sections: BriefSection[];
  closing: string;
}

interface AIDailyBriefProps {
  brief: AIDailyBriefData;
  userName?: string;
  metaSuffix?: string; // e.g. "3 triage items" or "5 priority actions"
  heightStyle?: React.CSSProperties;
  defaultCollapsed?: boolean;
}

const renderIcon = (icon: BriefSectionIcon) => {
  switch (icon) {
    case 'triage':
      return <AlertTriangle size={14} />;
    case 'performance':
      return <TrendingUp size={14} />;
    case 'ops':
      return <CheckCircle2 size={14} />;
    case 'customer':
      return <Star size={14} />;
    case 'recommendations':
      return <Sparkles size={14} />;
    default:
      return null;
  }
};

const greetingPrefix = () => {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
};

const BriefSummary: React.FC<{ brief: AIDailyBriefData; userName?: string }> = ({ brief, userName }) => (
  <div className="di-brief-summary">
    <p className="di-brief-paragraph">
      Good {greetingPrefix()}, {userName || 'Manager'}. {brief.greeting}
    </p>
    {brief.sections.map((section, idx) => (
      <div key={idx} className="di-brief-section">
        <h3 className="di-brief-section-title">
          {renderIcon(section.icon)}
          {section.title}
        </h3>
        <ul className="di-brief-bullets">
          {section.bullets.map((bullet, bIdx) => (
            <li key={bIdx} dangerouslySetInnerHTML={{ __html: bullet }} />
          ))}
        </ul>
      </div>
    ))}
    <p className="di-brief-closing">{brief.closing}</p>
  </div>
);

export const AIDailyBrief: React.FC<AIDailyBriefProps> = ({
  brief,
  userName,
  metaSuffix,
  heightStyle,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [showModal, setShowModal] = useState(false);
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <div className="di-ai-daily-brief" style={heightStyle}>
        <div className="di-brief-header-bar" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="di-brief-header-left">
            <div className={`di-brief-toggle ${isCollapsed ? 'collapsed' : ''}`}>
              <ChevronDown size={14} />
            </div>
            <div className="di-brief-header">
              <div className="di-brief-badge">
                <Sparkles size={16} />
                <span>AI Daily Brief</span>
              </div>
            </div>
          </div>
          <div className="di-brief-meta">
            <span>Today, {time}</span>
            {metaSuffix && (
              <>
                <span className="meta-sep">•</span>
                <span>{metaSuffix}</span>
              </>
            )}
          </div>
        </div>
        <div className="di-brief-body-wrapper">
          <div className={`di-brief-body ${isCollapsed ? 'collapsed' : ''}`}>
            <BriefSummary brief={brief} userName={userName} />
          </div>
          {!isCollapsed && <div className="di-brief-scroll-fade" />}
          {!isCollapsed && (
            <button className="di-brief-read-more" onClick={() => setShowModal(true)}>
              <span>Read Full Brief</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="di-brief-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="di-brief-modal" onClick={(e) => e.stopPropagation()}>
            <div className="di-brief-modal-header">
              <div className="di-brief-modal-title">
                <Sparkles size={18} />
                <h2>AI Daily Brief</h2>
              </div>
              <button className="di-brief-modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="di-brief-modal-content">
              <BriefSummary brief={brief} userName={userName} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
