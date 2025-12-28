'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectTable from '@/components/project/ProjectTable';
import ProjectFilters from '@/components/project/ProjectFilters';
import ProjectDetailModal from '@/components/project/ProjectDetailModal';
import { useProjects } from '@/hooks/useProjects';
import Button from '@/components/ui/Button';

export default function ProjectManagement() {
  const { projects, loading, error, fetchProjects } = useProjects();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = !search || 
        project.name?.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesSource = sourceFilter === 'all' || project.source?.toLowerCase() === sourceFilter.toLowerCase();
      const matchesOwner = !ownerFilter || 
        project.owner?.email?.toLowerCase().includes(ownerFilter.toLowerCase()) ||
        project.owner?.name?.toLowerCase().includes(ownerFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesSource && matchesOwner;
    });
  }, [projects, search, statusFilter, sourceFilter, ownerFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSourceFilter('all');
    setOwnerFilter('');
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project) => {
    // TODO: Implement delete functionality
    console.log('Delete project:', project);
    fetchProjects(); // Refresh list
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--border)]/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full gradient-primary" />
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                Project Management
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              View and delete projects. Editing is restricted to project owners.
            </p>
          </div>
          <div className="ml-4">
            <Button 
              variant="primary" 
              onClick={fetchProjects} 
              disabled={loading}
              loading={loading}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <ProjectFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
          ownerFilter={ownerFilter}
          onOwnerFilterChange={setOwnerFilter}
          onClear={handleClearFilters}
        />

        {/* Table */}
        <ProjectTable
          projects={filteredProjects}
          loading={loading}
          onView={handleView}
          onDelete={handleDelete}
        />

        {/* Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
