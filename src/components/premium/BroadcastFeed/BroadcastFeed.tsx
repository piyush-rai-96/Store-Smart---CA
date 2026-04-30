import React, { useState } from 'react';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import { Broadcast } from '../../../types/home';
import { BroadcastCard } from '../BroadcastCard/BroadcastCard';
import './BroadcastFeed.css';

interface BroadcastFeedProps {
  broadcasts: Broadcast[];
  onViewBroadcast: (broadcast: Broadcast) => void;
  onAcknowledge: (id: string) => void;
}

export const BroadcastFeed: React.FC<BroadcastFeedProps> = ({ 
  broadcasts,
  onViewBroadcast,
  onAcknowledge
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'high' | 'medium'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBroadcasts = broadcasts.filter(b => {
    if (filter === 'unread' && b.isRead) return false;
    if (filter !== 'all' && filter !== 'unread' && b.priority !== filter) return false;
    if (searchQuery && !b.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = broadcasts.filter(b => !b.isRead).length;

  return (
    <div className="broadcast-feed">
      <div className="broadcast-feed-header">
        <h2 className="broadcast-feed-title">
          📢 Broadcasts ({broadcasts.length})
        </h2>
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
        <button
          className={`broadcast-filter ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`broadcast-filter ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button
          className={`broadcast-filter ${filter === 'critical' ? 'active' : ''}`}
          onClick={() => setFilter('critical')}
        >
          Critical
        </button>
        <button
          className={`broadcast-filter ${filter === 'high' ? 'active' : ''}`}
          onClick={() => setFilter('high')}
        >
          High
        </button>
        <button
          className={`broadcast-filter ${filter === 'medium' ? 'active' : ''}`}
          onClick={() => setFilter('medium')}
        >
          Medium
        </button>
      </div>

      <div className="broadcast-feed-list">
        {filteredBroadcasts.length > 0 ? (
          filteredBroadcasts.map(broadcast => (
            <BroadcastCard
              key={broadcast.id}
              broadcast={broadcast}
              onView={() => onViewBroadcast(broadcast)}
              onAcknowledge={() => onAcknowledge(broadcast.id)}
            />
          ))
        ) : (
          <div className="broadcast-feed-empty">
            <FilterListOutlined sx={{ fontSize: 48 }} />
            <p>No broadcasts match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
