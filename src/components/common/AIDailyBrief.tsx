import React, { useState } from 'react';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import StarBorderOutlined from '@mui/icons-material/StarBorderOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';

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
      return <WarningAmberOutlined sx={{ fontSize: 14 }} />;
    case 'performance':
      return <TrendingUpOutlined sx={{ fontSize: 14 }} />;
    case 'ops':
      return <TaskAltOutlined sx={{ fontSize: 14 }} />;
    case 'customer':
      return <StarBorderOutlined sx={{ fontSize: 14 }} />;
    case 'recommendations':
      return <AutoAwesomeOutlined sx={{ fontSize: 14 }} />;
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
      <div key={idx} className={`di-brief-section${section.icon === 'recommendations' ? ' di-brief-section--suggestions' : ''}`}>
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

  return (
    <>
      <div className="di-ai-daily-brief" style={heightStyle}>
        <div className="di-brief-header-bar" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="di-brief-header-left">
            <div className={`di-brief-toggle ${isCollapsed ? 'collapsed' : ''}`}>
              <KeyboardArrowDown sx={{ fontSize: 14 }} />
            </div>
            <div className="di-brief-header">
              <div className="di-brief-badge">
                <AutoAwesomeOutlined sx={{ fontSize: 16 }} />
                <span>AI Daily Brief</span>
              </div>
            </div>
          </div>
          {metaSuffix && (
            <div className="di-brief-meta">
              <span>{metaSuffix}</span>
            </div>
          )}
        </div>
        <div className="di-brief-body-wrapper">
          <div className={`di-brief-body ${isCollapsed ? 'collapsed' : ''}`}>
            <BriefSummary brief={brief} userName={userName} />
          </div>
          {!isCollapsed && <div className="di-brief-scroll-fade" />}
          {!isCollapsed && (
            <button className="di-brief-read-more" onClick={() => setShowModal(true)}>
              <span>Read Full Brief</span>
              <KeyboardArrowRight sx={{ fontSize: 14 }} />
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="di-brief-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="di-brief-modal" onClick={(e) => e.stopPropagation()}>
            <div className="di-brief-modal-header">
              <div className="di-brief-modal-title">
                <AutoAwesomeOutlined sx={{ fontSize: 18 }} />
                <h2>AI Daily Brief</h2>
              </div>
              <button className="di-brief-modal-close" onClick={() => setShowModal(false)}>
                <CloseOutlined sx={{ fontSize: 20 }} />
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
