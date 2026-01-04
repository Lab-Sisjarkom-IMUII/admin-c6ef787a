'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest } from '@/utils/api';

const DEFAULT_LIMIT = 200;

export function useServerLogs(autoRefresh = true, interval = 5000) {
  const [logs, setLogs] = useState([]);
  const [cursor, setCursor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cursorRef = useRef('');

  const fetchLogs = useCallback(async ({ reset = false } = {}) => {
    try {
      setError(null);

      const params = new URLSearchParams();
      params.set('limit', DEFAULT_LIMIT.toString());
      if (!reset && cursorRef.current) {
        params.set('cursor', cursorRef.current);
      }

      const response = await apiRequest(`/admin/monitoring/logs?${params.toString()}`);
      const nextLogs = Array.isArray(response?.logs) ? response.logs : [];
      const nextCursor = response?.cursor || cursorRef.current;

      cursorRef.current = nextCursor;
      setCursor(nextCursor);
      setLogs((prev) => {
        const merged = reset ? nextLogs : [...prev, ...nextLogs];
        if (merged.length > DEFAULT_LIMIT) {
          return merged.slice(merged.length - DEFAULT_LIMIT);
        }
        return merged;
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs({ reset: true });

    if (autoRefresh) {
      const intervalId = setInterval(() => fetchLogs(), interval);
      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, interval, fetchLogs]);

  const clearLogs = () => {
    setLogs([]);
  };

  return {
    logs,
    cursor,
    loading,
    error,
    refetch: fetchLogs,
    clearLogs,
  };
}
