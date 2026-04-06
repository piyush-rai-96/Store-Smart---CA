import React from 'react';
import { VoCDistribution as VoCDistributionType } from '../../types/district';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './VoCDistribution.css';

interface VoCDistributionProps {
  data: VoCDistributionType;
  onIssueClick: (issue: string, stores: string[]) => void;
}

export const VoCDistribution: React.FC<VoCDistributionProps> = ({ data, onIssueClick }) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp size={14} />;
    if (trend === 'down') return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    // For VoC issues, 'up' is bad (more complaints)
    if (trend === 'up') return '#dc3545';
    if (trend === 'down') return '#28a745';
    return '#6c757d';
  };

  return (
    <div className="voc-distribution-container">
      <div className="voc-distribution-header">
        <h3 className="voc-distribution-title">VoC Distribution</h3>
        <p className="voc-distribution-subtitle">Voice of Customer Sentiment Analysis</p>
      </div>

      {/* Sentiment Distribution */}
      <div className="voc-sentiment-section">
        <h4 className="voc-section-title">Customer Sentiment</h4>
        <div className="voc-sentiment-bars">
          <div className="voc-sentiment-bar">
            <div className="voc-sentiment-label">
              <span className="voc-sentiment-name">Satisfied</span>
              <span className="voc-sentiment-percent">{data.satisfied}%</span>
            </div>
            <div className="voc-sentiment-track">
              <div 
                className="voc-sentiment-fill voc-sentiment-satisfied"
                style={{ width: `${data.satisfied}%` }}
              ></div>
            </div>
          </div>

          <div className="voc-sentiment-bar">
            <div className="voc-sentiment-label">
              <span className="voc-sentiment-name">Neutral</span>
              <span className="voc-sentiment-percent">{data.neutral}%</span>
            </div>
            <div className="voc-sentiment-track">
              <div 
                className="voc-sentiment-fill voc-sentiment-neutral"
                style={{ width: `${data.neutral}%` }}
              ></div>
            </div>
          </div>

          <div className="voc-sentiment-bar">
            <div className="voc-sentiment-label">
              <span className="voc-sentiment-name">Dissatisfied</span>
              <span className="voc-sentiment-percent">{data.dissatisfied}%</span>
            </div>
            <div className="voc-sentiment-track">
              <div 
                className="voc-sentiment-fill voc-sentiment-dissatisfied"
                style={{ width: `${data.dissatisfied}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Issues */}
      <div className="voc-issues-section">
        <h4 className="voc-section-title">Top Issues</h4>
        <div className="voc-issues-list">
          {data.topIssues.map((issue, index) => (
            <div
              key={index}
              className="voc-issue-card"
              onClick={() => onIssueClick(issue.category, issue.affectedStores)}
            >
              <div className="voc-issue-header">
                <div className="voc-issue-rank">#{index + 1}</div>
                <div className="voc-issue-info">
                  <div className="voc-issue-category">{issue.category}</div>
                  <div className="voc-issue-stores">
                    {issue.affectedStores.length} stores affected
                  </div>
                </div>
                <div className="voc-issue-percentage">{issue.percentage}%</div>
              </div>
              
              <div className="voc-issue-bar">
                <div 
                  className="voc-issue-fill"
                  style={{ width: `${issue.percentage}%` }}
                ></div>
              </div>

              <div className="voc-issue-trend" style={{ color: getTrendColor(issue.trend) }}>
                {getTrendIcon(issue.trend)}
                <span>
                  {issue.trend === 'up' ? '+' : issue.trend === 'down' ? '-' : ''}
                  {Math.abs(issue.trendValue)}% MoM
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
