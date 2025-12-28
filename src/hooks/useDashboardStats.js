'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateStats = useCallback((projects, portfolios, events, subdomains, monitoring) => {
    // Calculate stats from real API data

    // Projects breakdown
    const projectsByStatus = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    
    const projectsBySource = projects.reduce((acc, p) => {
      acc[p.source] = (acc[p.source] || 0) + 1;
      return acc;
    }, {});

    // Portfolios breakdown
    const portfoliosByStatus = portfolios.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    // Events breakdown
    const eventsByStatus = events.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {});

    // Subdomains breakdown
    const subdomainsBySource = subdomains.reduce((acc, s) => {
      acc[s.source] = (acc[s.source] || 0) + 1;
      return acc;
    }, {});

    const activeSubdomains = subdomains.filter(s => s.status === 'active').length;

    return {
      monitoring: {
        cpu: monitoring.cpu.percentage,
        ram: monitoring.ram.percentage,
        disk: monitoring.disk.percentage,
        serviceStatus: monitoring.service.imuii_server.status,
      },
      projects: {
        total: projects.length,
        byStatus: projectsByStatus,
        bySource: projectsBySource,
        recent: projects.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      },
      portfolios: {
        total: portfolios.length,
        byStatus: portfoliosByStatus,
        recent: portfolios.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      },
      events: {
        total: events.length,
        byStatus: eventsByStatus,
        upcoming: events.filter(e => e.status === 'upcoming' || e.status === 'active').slice(0, 3),
        topEvents: events.sort((a, b) => (b.project_count || 0) - (a.project_count || 0)).slice(0, 3),
      },
      subdomains: {
        total: subdomains.length,
        active: activeSubdomains,
        bySource: subdomainsBySource,
        recent: subdomains.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      },
    };
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch semua data dari API sebenarnya
      const [projectsRes, portfoliosRes, eventsRes, subdomainsRes, monitoringRes, servicesRes] = await Promise.allSettled([
        apiRequest('/admin/projects/all'),
        apiRequest('/admin/portfolios/all'),
        apiRequest('/admin/events/all'),
        apiRequest('/admin/subdomains/active'),
        apiRequest('/admin/monitoring/resources'),
        apiRequest('/admin/monitoring/services'),
      ]);

      // Extract data dari response
      const projects = projectsRes.status === 'fulfilled' ? (projectsRes.value.projects || []) : [];
      const portfolios = portfoliosRes.status === 'fulfilled' ? (portfoliosRes.value.portfolios || []) : [];
      const events = eventsRes.status === 'fulfilled' ? (eventsRes.value.events || []) : [];
      const subdomains = subdomainsRes.status === 'fulfilled' ? (subdomainsRes.value.subdomains || []) : [];
      
      // Monitoring data
      const monitoring = {
        cpu: { 
          percentage: monitoringRes.status === 'fulfilled' ? (monitoringRes.value.cpu?.value || 0) : 0 
        },
        ram: { 
          percentage: monitoringRes.status === 'fulfilled' ? (monitoringRes.value.ram?.value || 0) : 0 
        },
        disk: { 
          percentage: monitoringRes.status === 'fulfilled' ? (monitoringRes.value.disk?.value || 0) : 0 
        },
        service: { 
          imuii_server: { 
            status: servicesRes.status === 'fulfilled' ? (servicesRes.value.serverStatus || 'unknown') : 'unknown' 
          } 
        },
      };

      // Calculate stats dari data real
      const calculatedStats = calculateStats(projects, portfolios, events, subdomains, monitoring);
      setStats(calculatedStats);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard stats:', err);
      // Set empty stats instead of mock data
      setStats({
        monitoring: { cpu: 0, ram: 0, disk: 0, serviceStatus: 'unknown' },
        projects: { total: 0, byStatus: {}, bySource: {}, recent: [] },
        portfolios: { total: 0, byStatus: {}, recent: [] },
        events: { total: 0, byStatus: {}, upcoming: [], topEvents: [] },
        subdomains: { total: 0, active: 0, bySource: {}, recent: [] },
      });
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
