'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

export function useMonitoring(autoRefresh = true, interval = 5000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitoringData = useCallback(async () => {
    try {
      setError(null);
      // Fetch all monitoring data sesuai INTEGRASI.md
      // apiRequest() sudah normalize response via extractApiResponse()
      const [resources, network, services, system, pm2] = await Promise.all([
        apiRequest('/admin/monitoring/resources'),
        apiRequest('/admin/monitoring/network'),
        apiRequest('/admin/monitoring/services'),
        apiRequest('/admin/monitoring/system'),
        apiRequest('/admin/monitoring/pm2')
      ]);
      
      // Monitoring endpoints biasanya return data langsung tanpa nested structure
      // Tapi extractApiResponse() sudah handle jika ada nested structure
      // Convert dari format INTEGRASI.md ke format yang digunakan komponen
      setData({
        // New format (sesuai INTEGRASI.md)
        resources: resources,
        network: network,
        services: services,
        system: system,
        pm2: pm2,
        
        // Legacy format untuk backward compatibility dengan komponen yang ada
        cpu: {
          usage: resources.cpu?.value,
          percentage: resources.cpu?.value,
          status: resources.cpu?.value >= 90 ? 'critical' : resources.cpu?.value >= 70 ? 'warning' : 'healthy'
        },
        ram: {
          used: resources.ram?.used,
          total: resources.ram?.total,
          percentage: resources.ram?.value,
          status: resources.ram?.value >= 90 ? 'critical' : resources.ram?.value >= 70 ? 'warning' : 'healthy'
        },
        disk: {
          used: resources.disk?.used,
          total: resources.disk?.total,
          percentage: resources.disk?.value,
          status: resources.disk?.value >= 90 ? 'critical' : resources.disk?.value >= 70 ? 'warning' : 'healthy'
        },
        load_average: {
          value: resources.load?.value,
          status: resources.load?.value >= 3 ? 'critical' : resources.load?.value >= 2 ? 'warning' : 'healthy'
        },
        network: {
          incoming: network.incoming,
          outgoing: network.outgoing,
          incoming_percentage: 0, // Calculate if needed
          outgoing_percentage: 0, // Calculate if needed
          packet_loss: network.packetLoss,
          latency: network.latency,
          // Alias untuk backward compatibility
          packetLoss: network.packetLoss
        },
        service: {
          imuii_server: { status: services.serverStatus },
          api_response_time: services.responseTime,
          error_rate: services.errorRate,
          queue_status: services.queueStatus
        },
        system: {
          uptime: system.uptime,
          last_reboot: system.lastReboot,
          os_info: system.osInfo ? `${system.osInfo.name} ${system.osInfo.version}` : '--',
          time_sync: system.timeSync
        }
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitoringData();

    if (autoRefresh) {
      const intervalId = setInterval(fetchMonitoringData, interval);
      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, interval, fetchMonitoringData]);

  return {
    data,
    loading,
    error,
    refetch: fetchMonitoringData,
  };
}
