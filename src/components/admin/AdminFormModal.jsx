'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminFormModal({ isOpen, onClose, onSubmit, loading }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [formError, setFormError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!username || username.length < 3) {
      setFormError('Username minimal 3 karakter.');
      return;
    }
    if (!email || !email.includes('@')) {
      setFormError('Email tidak valid.');
      return;
    }
    if (!password || password.length < 6) {
      setFormError('Password minimal 6 karakter.');
      return;
    }

    const result = await onSubmit({ username, email, password, role });
    if (!result?.success) {
      setFormError(
        result?.error ||
          'Gagal membuat admin baru. Kemungkinan endpoint backend untuk create admin belum tersedia.'
      );
      return;
    }

    // Reset dan tutup modal
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card glass className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Tambah Admin Baru
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-[var(--foreground)]/60 mb-4">
          Buat akun admin baru yang dapat mengakses IMUII Admin. Backend perlu
          menambahkan endpoint manajemen admin agar data ini benar-benar tersimpan
          di database.
        </p>

        {formError && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]/70 mb-1">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]/70 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@imuii.id"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]/70 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]/70 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/60 focus:border-[var(--primary)]/60"
            >
              <option value="admin">Admin</option>
              {/* Future: tambahkan role lain jika diperlukan */}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Simpan Admin
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}


