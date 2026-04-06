import React from 'react';
import { Sales2x2Point } from '../../types/district';
import './Sales2x2Matrix.css';

interface Sales2x2MatrixProps {
  data: Sales2x2Point[];
  onStoreClick: (storeNumber: string) => void;
}

export const Sales2x2Matrix: React.FC<Sales2x2MatrixProps> = ({ data, onStoreClick }) => {
  // Calculate min/max for scaling
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  const minX = Math.min(...xValues) - 5;
  const maxX = Math.max(...xValues) + 5;
  const minY = Math.min(...yValues) - 2;
  const maxY = Math.max(...yValues) + 2;

  // Scale functions
  const scaleX = (value: number) => ((value - minX) / (maxX - minX)) * 100;
  const scaleY = (value: number) => 100 - ((value - minY) / (maxY - minY)) * 100;
  const scaleSize = (value: number) => Math.max(20, Math.min(50, (value / 300) * 40));

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'growth-engines': return '#28a745';
      case 'critical': return '#dc3545';
      case 'struggling': return '#ffc107';
      case 'stable': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className="sales-2x2-container">
      <div className="sales-2x2-header">
        <h3 className="sales-2x2-title">Sales 2×2 Matrix</h3>
        <p className="sales-2x2-subtitle">Performance vs Growth</p>
      </div>
      
      <div className="sales-2x2-chart">
        {/* Quadrant backgrounds */}
        <div className="sales-2x2-quadrants">
          <div className="sales-2x2-quadrant quadrant-tl">
            <span className="quadrant-label">Growth Engines</span>
          </div>
          <div className="sales-2x2-quadrant quadrant-tr">
            <span className="quadrant-label">High Performers</span>
          </div>
          <div className="sales-2x2-quadrant quadrant-bl">
            <span className="quadrant-label">Struggling</span>
          </div>
          <div className="sales-2x2-quadrant quadrant-br">
            <span className="quadrant-label">Critical</span>
          </div>
        </div>

        {/* Axes */}
        <div className="sales-2x2-axis sales-2x2-axis-x">
          <span className="axis-label-start">Low Performance</span>
          <span className="axis-label-end">High Performance</span>
        </div>
        <div className="sales-2x2-axis sales-2x2-axis-y">
          <span className="axis-label-top">High Growth</span>
          <span className="axis-label-bottom">Negative Growth</span>
        </div>

        {/* Data points */}
        <div className="sales-2x2-points">
          {data.map((point) => (
            <div
              key={point.storeNumber}
              className="sales-2x2-bubble"
              style={{
                left: `${scaleX(point.x)}%`,
                top: `${scaleY(point.y)}%`,
                width: `${scaleSize(point.size)}px`,
                height: `${scaleSize(point.size)}px`,
                backgroundColor: getQuadrantColor(point.quadrant),
              }}
              onClick={() => onStoreClick(point.storeNumber)}
              title={`${point.storeName} - DPI: ${point.x}, Growth: ${point.y}%`}
            >
              <span className="bubble-label">{point.storeNumber}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="sales-2x2-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
          <span>Growth Engines</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#17a2b8' }}></div>
          <span>Stable</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#dc3545' }}></div>
          <span>Critical</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffc107' }}></div>
          <span>Struggling</span>
        </div>
      </div>
    </div>
  );
};
