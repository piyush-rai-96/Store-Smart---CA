// Premium Home Screen Type Definitions

export interface InsightMetric {
  id: string;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon?: string;
  actionHint?: string; // e.g., "2 need attention"
  linkTo?: string; // Navigation path
  onClick?: () => void;
}

export interface CriticalAlert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high';
  timestamp: Date;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

export type BroadcastCategory = 'Safety' | 'Operations' | 'Audit' | 'Merchandising' | 'HR' | 'General';
export type BroadcastScope = 'District' | 'Store' | 'Region' | 'Company';
export type AcknowledgementType = 'Required' | 'Optional';
export type BroadcastState = 'unread' | 'read' | 'acknowledged' | 'overdue';

export interface Broadcast {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  sender: string;
  senderRole: string;
  timestamp: Date;
  dueDate?: Date;
  expiresAt?: Date;
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgementType: AcknowledgementType;
  category: BroadcastCategory;
  scope: BroadcastScope;
  scopeDetails?: string; // e.g., "District 14" or "Store #1234"
  attachments?: number;
  hasFollowUp?: boolean;
}

export interface QuickAccessItem {
  id: string;
  label: string;
  icon: string;
  description?: string;
  badge?: string | number;
  onClick: () => void;
  roles?: string[];
}

export interface RecommendedAction {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  icon?: string;
  onClick: () => void;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string | number;
  roles?: string[];
  isActive?: boolean;
}
