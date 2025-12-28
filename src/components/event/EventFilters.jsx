'use client';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function EventFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClear,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search by event name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
        
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
