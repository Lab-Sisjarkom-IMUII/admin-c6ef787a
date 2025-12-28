'use client';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProjectFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sourceFilter,
  onSourceFilterChange,
  ownerFilter,
  onOwnerFilterChange,
  onClear,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search by project name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="initialized">Initialized</option>
          <option value="building">Building</option>
          <option value="deployed">Deployed</option>
          <option value="failed">Failed</option>
          <option value="inactive">Inactive</option>
        </select>
        
        <select
          value={sourceFilter}
          onChange={(e) => onSourceFilterChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Sources</option>
          <option value="cli">CLI</option>
          <option value="web">Web</option>
        </select>
        
        <Input
          type="text"
          placeholder="Filter by owner..."
          value={ownerFilter}
          onChange={(e) => onOwnerFilterChange(e.target.value)}
          className="w-48"
        />
        
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
