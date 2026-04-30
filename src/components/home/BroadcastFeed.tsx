import React, { useState } from 'react';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { Chips } from 'impact-ui';
import { Broadcast } from '../../types/home';
import { BroadcastCard } from './BroadcastCard';
import './BroadcastFeed.css';

interface BroadcastFeedProps {
  broadcasts: Broadcast[];
  onView: (id: string) => void;
  onAcknowledge: (id: string) => void;
  onFollowUp?: (id: string) => void;
}

type FilterType = 'all' | 'unread' | 'critical';

export const BroadcastFeed: React.FC<BroadcastFeedProps> = ({
  broadcasts,
  onView,
  onAcknowledge,
  onFollowUp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const unreadCount = broadcasts.filter(b => !b.isRead).length;
  const criticalCount = broadcasts.filter(b => b.priority === 'critical').length;

  const filteredBroadcasts = broadcasts.filter(broadcast => {
    // Apply search filter
    const matchesSearch = 
      broadcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broadcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broadcast.sender.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Apply tab filter
    switch (activeFilter) {
      case 'unread':
        return !broadcast.isRead;
      case 'critical':
        return broadcast.priority === 'critical';
      default:
        return true;
    }
  });

  return (
    <div className="broadcast-feed">
      <div className="broadcast-feed-header">
        <div className="broadcast-feed-search">
          <SearchOutlined sx={{ fontSize: 16 }} />
          <input
            type="text"
            placeholder="Search broadcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="broadcast-feed-filters">
        <Chips
          label="All"
          variant={activeFilter === 'all' ? 'filled' : 'outlined'}
          color={activeFilter === 'all' ? 'primary' : undefined}
          size="small"
          onClick={() => setActiveFilter('all')}
        />
        <Chips
          label={`Unread (${unreadCount})`}
          variant={activeFilter === 'unread' ? 'filled' : 'outlined'}
          color={activeFilter === 'unread' ? 'primary' : undefined}
          size="small"
          onClick={() => setActiveFilter('unread')}
        />
        <Chips
          label={`Critical (${criticalCount})`}
          variant={activeFilter === 'critical' ? 'filled' : 'outlined'}
          color={activeFilter === 'critical' ? 'primary' : undefined}
          size="small"
          onClick={() => setActiveFilter('critical')}
        />
      </div>

      <div className="broadcast-feed-list">
        {filteredBroadcasts.length > 0 ? (
          filteredBroadcasts.map(broadcast => (
            <BroadcastCard
              key={broadcast.id}
              broadcast={broadcast}
              onView={onView}
              onAcknowledge={onAcknowledge}
              onFollowUp={onFollowUp}
            />
          ))
        ) : (
          <div className="broadcast-feed-empty">
            <p>No broadcasts found</p>
          </div>
        )}
      </div>
    </div>
  );
};
