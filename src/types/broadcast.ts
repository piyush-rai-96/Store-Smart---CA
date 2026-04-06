// Broadcast priority levels
export type BroadcastPriority = 'critical' | 'high' | 'standard' | 'info';

// Broadcast categories
export type BroadcastCategory = 
  | 'operations' 
  | 'safety' 
  | 'planogram' 
  | 'promotion' 
  | 'hr' 
  | 'training' 
  | 'general';

// Linked entity types
export type LinkedEntityType = 'pog' | 'store' | 'audit' | 'kpi';

// Linked entity interface
export interface LinkedEntity {
  type: LinkedEntityType;
  id: string;
  label: string;
}

// Attachment interface
export interface BroadcastAttachment {
  name: string;
  url: string;
  type: string;
  size?: number;
}

// Sender information
export interface BroadcastSender {
  role: string;
  name: string;
  id?: string;
}

// Target audience
export interface TargetAudience {
  roles?: string[];
  districts?: string[];
  stores?: string[];
}

// Main Broadcast interface
export interface Broadcast {
  id: string;
  title: string;
  message: string;
  priority: BroadcastPriority;
  category: BroadcastCategory;
  sender: BroadcastSender;
  targetAudience: TargetAudience;
  linkedEntity?: LinkedEntity;
  createdAt: Date;
  expiresAt: Date;
  requiresAcknowledgment: boolean;
  isRead: boolean;
  isAcknowledged: boolean;
  attachments?: BroadcastAttachment[];
}

// Broadcast filter state
export interface BroadcastFilters {
  priority: BroadcastPriority | 'all' | 'unread';
  categories: BroadcastCategory[];
  searchQuery: string;
}
