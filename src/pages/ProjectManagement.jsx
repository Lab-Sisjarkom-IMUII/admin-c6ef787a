'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectTable from '@/components/project/ProjectTable';
import ProjectFilters from '@/components/project/ProjectFilters';
import ProjectDetailModal from '@/components/project/ProjectDetailModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AlertModal from '@/components/ui/AlertModal';
import { useProjects } from '@/hooks/useProjects';
import Button from '@/components/ui/Button';

export default function ProjectManagement() {
  const { projects, loading, error, fetchProjects, deployProject } = useProjects();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeployConfirmOpen, setIsRedeployConfirmOpen] = useState(false);
  const [projectToRedeploy, setProjectToRedeploy] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });

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

  // Handle re-deploy
  const handleRedeploy = (project) => {
    setProjectToRedeploy(project);
    setIsRedeployConfirmOpen(true);
  };

  const handleConfirmRedeploy = async () => {
    if (!projectToRedeploy) return;
    
    setIsDeploying(true);
    try {
      // Use default values for commit_sha and branch
      // Server will handle "latest" or fetch from GitHub
      const result = await deployProject(projectToRedeploy.id, "latest", "main");

      if (!result.success) {
        throw new Error(result.message || result.error || "Gagal trigger deployment");
      }

      // Close confirm modal
      setIsRedeployConfirmOpen(false);
      setProjectToRedeploy(null);

      // Refresh project list to show updated status
      await fetchProjects();

      // Show success alert
      setAlertModal({
        isOpen: true,
        title: "Berhasil",
        message: `Deployment berhasil di-trigger untuk project "${projectToRedeploy.name}"! Status akan update secara otomatis.`,
        variant: "success",
      });
    } catch (err) {
      console.error("Error deploying project:", err);
      setAlertModal({
        isOpen: true,
        title: "Error",
        message: err.message || "Gagal trigger deployment",
        variant: "error",
      });
    } finally {
      setIsDeploying(false);
    }
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
              View, redeploy, and delete projects. Admin can redeploy any project from any user.
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
          onRedeploy={handleRedeploy}
          isDeploying={isDeploying}
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

        {/* Redeploy Confirm Modal */}
        <ConfirmModal
          isOpen={isRedeployConfirmOpen}
          onClose={() => {
            if (!isDeploying) {
              setIsRedeployConfirmOpen(false);
              setProjectToRedeploy(null);
            }
          }}
          onConfirm={handleConfirmRedeploy}
          title="Konfirmasi Redeploy"
          message={
            projectToRedeploy
              ? `Apakah Anda yakin ingin melakukan redeploy untuk project "${projectToRedeploy.name}"? Deployment akan menggunakan commit terbaru dari branch main.`
              : 'Apakah Anda yakin ingin melakukan redeploy?'
          }
          confirmText="Ya, Redeploy"
          cancelText="Batal"
          variant="info"
          loading={isDeploying}
        />

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
          title={alertModal.title}
          message={alertModal.message}
          variant={alertModal.variant}
        />
      </div>
    </DashboardLayout>
  );
}
