import { Broadcast, BroadcastPriority, BroadcastCategory } from '../types/broadcast';

// Priority display configuration
export const PRIORITY_CONFIG: Record<BroadcastPriority, { label: string; color: string; icon: string }> = {
  critical: { label: 'Critical', color: '#f44336', icon: '🔴' },
  high: { label: 'High', color: '#ff9800', icon: '🟠' },
  standard: { label: 'Standard', color: '#ffc107', icon: '🟡' },
  info: { label: 'Info', color: '#2196f3', icon: '🔵' },
};

// Category display configuration
export const CATEGORY_CONFIG: Record<BroadcastCategory, { label: string; color: string }> = {
  operations: { label: 'Operations', color: '#1976d2' },
  safety: { label: 'Safety', color: '#d32f2f' },
  planogram: { label: 'Planogram', color: '#7b1fa2' },
  promotion: { label: 'Promotion', color: '#f57c00' },
  hr: { label: 'HR', color: '#388e3c' },
  training: { label: 'Training', color: '#0288d1' },
  general: { label: 'General', color: '#616161' },
};

// Mock broadcast data
export const MOCK_BROADCASTS: Broadcast[] = [
  {
    id: 'b1',
    title: 'Immediate Safety Protocol Update',
    message: 'New safety protocol effective immediately - All stores must implement updated fire safety procedures by end of day. This includes checking all fire extinguishers, updating emergency exit signage, and conducting a brief team safety meeting.',
    priority: 'critical',
    category: 'safety',
    sender: {
      role: 'Regional Director',
      name: 'Sarah Johnson',
    },
    targetAudience: {
      roles: ['DM', 'SM'],
      districts: ['District 14'],
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    requiresAcknowledgment: true,
    isRead: false,
    isAcknowledged: false,
  },
  {
    id: 'b2',
    title: 'New POG Rollout - Spring 2026',
    message: 'All stores must implement the new spring planogram by April 15, 2026. The updated layout focuses on seasonal items and improved customer flow. Training materials and setup guides are attached.',
    priority: 'high',
    category: 'planogram',
    sender: {
      role: 'District Manager',
      name: 'Michael Chen',
    },
    targetAudience: {
      roles: ['SM'],
      districts: ['District 14'],
    },
    linkedEntity: {
      type: 'pog',
      id: 'POG-2026-S1',
      label: 'Spring 2026 POG',
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    requiresAcknowledgment: true,
    isRead: false,
    isAcknowledged: false,
    attachments: [
      {
        name: 'POG_Setup_Guide.pdf',
        url: '/attachments/pog-setup.pdf',
        type: 'application/pdf',
        size: 2048000,
      },
    ],
  },
  {
    id: 'b3',
    title: 'Monthly Safety Training Reminder',
    message: 'Reminder: Monthly safety training session scheduled for April 8, 2026 at 10:00 AM. All store managers and associates should attend. Topics include workplace safety, customer service protocols, and emergency procedures.',
    priority: 'standard',
    category: 'training',
    sender: {
      role: 'District Manager',
      name: 'Michael Chen',
    },
    targetAudience: {
      roles: ['SM', 'DM'],
      districts: ['District 14'],
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    requiresAcknowledgment: false,
    isRead: true,
    isAcknowledged: false,
  },
  {
    id: 'b4',
    title: 'Easter Promotion Launch',
    message: 'Easter promotional campaign starts April 1st. Ensure all promotional materials are displayed prominently. Focus on seasonal candy, decorations, and family essentials. Expected sales lift: 15-20%.',
    priority: 'high',
    category: 'promotion',
    sender: {
      role: 'Regional Director',
      name: 'Sarah Johnson',
    },
    targetAudience: {
      roles: ['DM', 'SM'],
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    requiresAcknowledgment: false,
    isRead: true,
    isAcknowledged: false,
  },
  {
    id: 'b5',
    title: 'Q1 Performance Review Complete',
    message: 'Q1 performance reviews have been completed. District 14 achieved 103% of sales target with excellent customer satisfaction scores. Detailed reports available in the analytics dashboard.',
    priority: 'info',
    category: 'operations',
    sender: {
      role: 'Regional Director',
      name: 'Sarah Johnson',
    },
    targetAudience: {
      roles: ['DM'],
      districts: ['District 14'],
    },
    linkedEntity: {
      type: 'kpi',
      id: 'Q1-2026',
      label: 'Q1 2026 Report',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    requiresAcknowledgment: false,
    isRead: true,
    isAcknowledged: false,
  },
  {
    id: 'b6',
    title: 'New Hire Onboarding Process Update',
    message: 'Updated onboarding process for new hires now includes digital training modules. All store managers should review the new process and ensure compliance. Contact HR for questions.',
    priority: 'standard',
    category: 'hr',
    sender: {
      role: 'HR Department',
      name: 'Jessica Martinez',
    },
    targetAudience: {
      roles: ['SM', 'DM'],
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    requiresAcknowledgment: false,
    isRead: false,
    isAcknowledged: false,
  },
];
