import React from 'react';
import { Broadcast, BroadcastFilters } from '../../../types/broadcast';
import { FilterBar } from './FilterBar';
import { BroadcastCard } from './BroadcastCard';
import './BroadcastFeed.css';

interface BroadcastFeedProps {
  broadcasts: Broadcast[];
  filters: BroadcastFilters;
  onFiltersChange: (filters: BroadcastFilters) => void;
  unreadCount: number;
  onViewDetails: (broadcast: Broadcast) => void;
  onAcknowledge: (broadcastId: string) => void;
  onMarkAsRead: (broadcastId: string) => void;
}

export const BroadcastFeed: React.FC<BroadcastFeedProps> = ({
  broadcasts,
  filters,
  onFiltersChange,
  unreadCount,
  onViewDetails,
  onAcknowledge,
  onMarkAsRead,
}) => {
  return (
    <div className="broadcast-feed">
      <FilterBar
        filters={filters}
        onFiltersChange={onFiltersChange}
        unreadCount={unreadCount}
        totalCount={broadcasts.length}
      />

      <div className="broadcast-feed-list">
        {broadcasts.length === 0 ? (
          <div className="broadcast-feed-empty">
            <p>No broadcasts match your filters.</p>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          broadcasts.map(broadcast => (
            <BroadcastCard
              key={broadcast.id}
              broadcast={broadcast}
              onViewDetails={onViewDetails}
              onAcknowledge={onAcknowledge}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};
