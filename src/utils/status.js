export function getProjectStatusColor(status) {
  const statusColors = {
    pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    initialized: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    building: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    deployed: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  
  return statusColors[status?.toLowerCase()] || statusColors.inactive;
}

export function getProjectStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    initialized: 'Initialized',
    building: 'Building',
    deployed: 'Deployed',
    failed: 'Failed',
    inactive: 'Inactive',
  };
  
  return labels[status?.toLowerCase()] || status || 'Unknown';
}

export function getPortfolioStatusColor(status) {
  const statusColors = {
    draft: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    deployed: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  
  return statusColors[status?.toLowerCase()] || statusColors.draft;
}

export function getPortfolioStatusLabel(status) {
  const labels = {
    draft: 'Draft',
    deployed: 'Deployed',
  };
  
  return labels[status?.toLowerCase()] || status || 'Unknown';
}

export function getEventStatusColor(status) {
  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  
  return statusColors[status?.toLowerCase()] || statusColors.inactive;
}

export function getEventStatusLabel(status) {
  const labels = {
    active: 'Active',
    inactive: 'Inactive',
    upcoming: 'Upcoming',
    completed: 'Completed',
  };
  
  return labels[status?.toLowerCase()] || status || 'Unknown';
}
