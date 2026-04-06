import { useMemo } from 'react';
import { UserRole } from '../types';
import { QuickAccessCard } from '../types/quickAccess';
import { QUICK_ACCESS_CARDS } from '../constants/quickAccess';

export const useQuickAccess = (userRole: UserRole | undefined): { cards: QuickAccessCard[] } => {
  const cards = useMemo(() => {
    if (!userRole) return [];

    return QUICK_ACCESS_CARDS
      .filter(card => card.roles.includes(userRole))
      .sort((a, b) => a.order - b.order);
  }, [userRole]);

  return { cards };
};
