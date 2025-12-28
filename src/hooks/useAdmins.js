'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/utils/api';

// NOTE BACKEND:
// Saat ini imuii-server BELUM menyediakan endpoint manajemen admin (list/create).
// Hook ini sudah disiapkan dengan asumsi endpoint berikut akan ditambah di backend:
// - GET  /api/v1/admin/admins      -> List semua admin
// - POST /api/v1/admin/admin/admins -> Create admin baru
//
// Struktur response yang direkomendasikan backend (supaya cocok dengan hook ini):
// GET:
// {
//   "success": true,
//   "message": "Admins retrieved successfully",
//   "data": {
//     "admins": [
//       {
//         "id": "uuid",
//         "username": "admin",
//         "email": "admin@imuii.id",
//         "role": "admin",
//         "last_login_at": "2024-01-15T10:00:00Z",
//         "created_at": "...",
//         "updated_at": "..."
//       }
//     ]
//   }
// }
//
// POST:
// {
//   "success": true,
//   "message": "Admin created successfully",
//   "data": {
//     "id": "uuid",
//     "username": "new-admin",
//     "email": "new-admin@imuii.id",
//     "role": "admin",
//     "last_login_at": null,
//     "created_at": "...",
//     "updated_at": "..."
//   }
// }

export function useAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/admin/admins');
      // apiRequest sudah menormalisasi nested response
      // Harapan: response = { success: true, admins: [...] } ATAU { admins: [...] }
      const list = response.admins || response.data?.admins || [];
      setAdmins(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch admins (kemungkinan endpoint belum ada di backend):', err);
      setError(
        'Gagal memuat daftar admin. Kemungkinan endpoint manajemen admin belum diimplementasikan di backend.'
      );
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAdmin = useCallback(
    async ({ username, email, password, role = 'admin' }) => {
      setLoading(true);
      setError(null);
      try {
        // Payload rekomendasi untuk backend, sesuai schema Admins Table:
        // { username, email, password, role }
        const payload = { username, email, password, role };
        const response = await apiRequest('/admin/admins', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        // Harapan: response.data atau response berisi admin baru
        const created =
          response.data ||
          response.admin ||
          response;

        await fetchAdmins();
        return { success: true, data: created };
      } catch (err) {
        console.error('Failed to create admin (kemungkinan endpoint belum ada di backend):', err);
        const message =
          err.message ||
          'Gagal membuat admin baru. Kemungkinan endpoint manajemen admin belum diimplementasikan di backend.';
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [fetchAdmins]
  );

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    createAdmin,
  };
}


