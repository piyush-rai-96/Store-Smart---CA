import { useState, useEffect, useMemo } from 'react';
import { Broadcast, BroadcastFilters } from '../types/broadcast';
import { User } from '../types';
import { MOCK_BROADCASTS } from '../constants/broadcasts';

const BROADCAST_STORAGE_KEY = 'ia_storesmart_broadcasts';

interface BroadcastState {
  [broadcastId: string]: {
    isRead: boolean;
    isAcknowledged: boolean;
    acknowledgedAt?: Date;
  };
}

export const useBroadcasts = (user: User | null) => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [filters, setFilters] = useState<BroadcastFilters>({
    priority: 'all',
    categories: [],
    searchQuery: '',
  });

  // Load broadcast state from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem(BROADCAST_STORAGE_KEY);
    const state: BroadcastState = storedState ? JSON.parse(storedState) : {};

    // Merge mock data with stored state
    const mergedBroadcasts = MOCK_BROADCASTS.map(broadcast => ({
      ...broadcast,
      isRead: state[broadcast.id]?.isRead || broadcast.isRead,
      isAcknowledged: state[broadcast.id]?.isAcknowledged || broadcast.isAcknowledged,
    }));

    setBroadcasts(mergedBroadcasts);
  }, []);

  // Filter broadcasts based on user role and assignment
  const userBroadcasts = useMemo(() => {
    if (!user) return [];

    return broadcasts.filter(broadcast => {
      // Check if broadcast is expired
      if (new Date() > new Date(broadcast.expiresAt)) return false;

      // Check role targeting
      const { targetAudience } = broadcast;
      if (targetAudience.roles && !targetAudience.roles.includes(user.role)) {
        return false;
      }

      // Check district targeting
      if (targetAudience.districts && user.districtId) {
        if (!targetAudience.districts.includes(user.districtId) && 
            !targetAudience.districts.includes(user.district || '')) {
          return false;
        }
      }

      // Check store targeting
      if (targetAudience.stores && user.storeId) {
        if (!targetAudience.stores.includes(user.storeId)) {
          return false;
        }
      }

      return true;
    });
  }, [broadcasts, user]);

  // Apply filters
  const filteredBroadcasts = useMemo(() => {
    let filtered = [...userBroadcasts];

    // Priority filter
    if (filters.priority === 'unread') {
      filtered = filtered.filter(b => !b.isRead);
    } else if (filters.priority !== 'all') {
      filtered = filtered.filter(b => b.priority === filters.priority);
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(b => filters.categories.includes(b.category));
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.message.toLowerCase().includes(query)
      );
    }

    // Sort: unread first, then by priority, then by date
    return filtered.sort((a, b) => {
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      
      const priorityOrder = { critical: 0, high: 1, standard: 2, info: 3 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [userBroadcasts, filters]);

  // Get critical unacknowledged broadcasts
  const criticalBroadcasts = useMemo(() => {
    return userBroadcasts.filter(
      b => b.priority === 'critical' && !b.isAcknowledged
    );
  }, [userBroadcasts]);

  // Get unread count
  const unreadCount = useMemo(() => {
    return userBroadcasts.filter(b => !b.isRead).length;
  }, [userBroadcasts]);

  // Mark as read
  const markAsRead = (broadcastId: string) => {
    setBroadcasts(prev => {
      const updated = prev.map(b =>
        b.id === broadcastId ? { ...b, isRead: true } : b
      );
      
      // Save to localStorage
      const state: BroadcastState = JSON.parse(
        localStorage.getItem(BROADCAST_STORAGE_KEY) || '{}'
      );
      state[broadcastId] = {
        ...state[broadcastId],
        isRead: true,
      };
      localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(state));
      
      return updated;
    });
  };

  // Acknowledge broadcast
  const acknowledgeBroadcast = (broadcastId: string) => {
    setBroadcasts(prev => {
      const updated = prev.map(b =>
        b.id === broadcastId
          ? { ...b, isRead: true, isAcknowledged: true }
          : b
      );
      
      // Save to localStorage
      const state: BroadcastState = JSON.parse(
        localStorage.getItem(BROADCAST_STORAGE_KEY) || '{}'
      );
      state[broadcastId] = {
        isRead: true,
        isAcknowledged: true,
        acknowledgedAt: new Date(),
      };
      localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(state));
      
      return updated;
    });
  };

  return {
    broadcasts: filteredBroadcasts,
    criticalBroadcasts,
    unreadCount,
    filters,
    setFilters,
    markAsRead,
    acknowledgeBroadcast,
  };
};
