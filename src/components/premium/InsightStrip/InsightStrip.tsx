import React from 'react';
import { InsightMetric } from '../../../types/home';
import { InsightCard } from '../InsightCard/InsightCard';
import './InsightStrip.css';

interface InsightStripProps {
  metrics: InsightMetric[];
}

export const InsightStrip: React.FC<InsightStripProps> = ({ metrics }) => {
  return (
    <div className="insight-strip">
      {metrics.map(metric => (
        <InsightCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};
