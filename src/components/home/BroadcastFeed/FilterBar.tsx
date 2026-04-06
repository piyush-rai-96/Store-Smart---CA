import React from 'react';
import { Search } from 'lucide-react';
import { Input } from 'impact-ui/dist/components';
import { BroadcastFilters, BroadcastPriority, BroadcastCategory } from '../../../types/broadcast';
import { CATEGORY_CONFIG } from '../../../constants/broadcasts';
import './FilterBar.css';

interface FilterBarProps {
  filters: BroadcastFilters;
  onFiltersChange: (filters: BroadcastFilters) => void;
  unreadCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  unreadCount,
  totalCount,
}) => {
  const priorityOptions: Array<{ value: BroadcastPriority | 'all' | 'unread'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: `Unread (${unreadCount})` },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'standard', label: 'Standard' },
  ];

  const categoryOptions: BroadcastCategory[] = [
    'operations',
    'safety',
    'planogram',
    'promotion',
    'hr',
    'training',
  ];

  const handlePriorityChange = (priority: BroadcastPriority | 'all' | 'unread') => {
    onFiltersChange({ ...filters, priority });
  };

  const handleCategoryToggle = (category: BroadcastCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchQuery: e.target.value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <h2 className="filter-bar-title">📢 Broadcasts ({totalCount})</h2>
      </div>

      <div className="filter-bar-row">
        {/* Priority Filters */}
        <div className="filter-priority-group">
          {priorityOptions.map(option => (
            <button
              key={option.value}
              className={`filter-priority-button ${
                filters.priority === option.value ? 'filter-priority-button-active' : ''
              }`}
              onClick={() => handlePriorityChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="filter-search">
          <Input
            placeholder="Search broadcasts..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            leftIcon={<Search size={16} />}
            size="small"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="filter-category-row">
        {categoryOptions.map(category => {
          const config = CATEGORY_CONFIG[category];
          const isActive = filters.categories.includes(category);
          return (
            <button
              key={category}
              className={`filter-category-chip ${isActive ? 'filter-category-chip-active' : ''}`}
              onClick={() => handleCategoryToggle(category)}
              style={{
                borderColor: isActive ? config.color : '#ddd',
                backgroundColor: isActive ? `${config.color}15` : 'white',
                color: isActive ? config.color : '#666',
              }}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
