'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AlertModal from '@/components/ui/AlertModal';
import { apiRequest } from '@/utils/api';

const githubUsernamePattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export default function InviteGithubUser() {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userError, setUserError] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });

  const fetchUsers = async (search = '') => {
    setUsersLoading(true);
    setUserError(null);
    try {
      const query = search ? `&q=${encodeURIComponent(search)}` : '';
      const response = await apiRequest(`/admin/users?page=1&limit=50${query}`);
      const list = response.users || response.data?.users || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setUserError(err.message || 'Gagal memuat daftar user.');
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const trimmedUserId = userId.trim();
    if (!trimmedUserId) {
      setError('User ID wajib diisi atau dipilih.');
      return;
    }

    const trimmedUsername = githubUsername.trim();
    if (!trimmedUsername) {
      setError('GitHub username wajib diisi.');
      return;
    }
    if (!githubUsernamePattern.test(trimmedUsername)) {
      setError('Format GitHub username tidak valid.');
      return;
    }

    const payload = {
      username: trimmedUsername,
      role: role === 'admin' ? 'admin' : 'direct_member',
      user_id: trimmedUserId,
    };

    setLoading(true);
    try {
      const response = await apiRequest('/organization/invite', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const message =
        response?.message ||
        `Invitation sent to "${trimmedUsername}". User perlu accept invitation di GitHub.`;

      setAlert({
        isOpen: true,
        title: 'Invite Terkirim',
        message,
        variant: 'success',
      });
      setGithubUsername('');
      setRole('member');
      setUserId('');
    } catch (err) {
      setError(err.message || 'Gagal mengirim undangan GitHub.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--border)]/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full gradient-primary" />
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                Invite GitHub User
              </h1>
            </div>
            <p className="text-[var(--foreground)]/60 text-lg ml-4">
              Kirim undangan ke GitHub organization menggunakan pipeline yang sama
              dengan `npx imuii invite`.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <Card glass className="w-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/20 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                  <Input
                    label="Cari User (email / nama / GitHub)"
                    placeholder="contoh: user@imuii.id"
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    disabled={usersLoading || loading}
                  />
                </div>
                <div className="md:w-32">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fetchUsers(userSearch)}
                    loading={usersLoading}
                  >
                    Cari
                  </Button>
                </div>
              </div>

              {userError && (
                <p className="mt-3 text-sm text-red-400">{userError}</p>
              )}

              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                  Pilih User
                </label>
                <select
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  disabled={usersLoading || loading}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]/60"
                >
                  <option value="">-- Pilih user --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || 'User'} | {user.email} | {user.github_username || 'no-gh'}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-[var(--foreground)]/50">
                  User ID akan terisi otomatis dari pilihan ini.
                </p>
              </div>
            </div>

            <div>
              <Input
                label="GitHub Username"
                placeholder="contoh: octocat"
                value={githubUsername}
                onChange={(event) => setGithubUsername(event.target.value)}
                disabled={loading}
              />
              <p className="mt-2 text-xs text-[var(--foreground)]/50">
                Username hanya boleh berisi huruf, angka, dan tanda strip (-).
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
                Role di Organization
              </label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]/60"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <p className="mt-2 text-xs text-[var(--foreground)]/50">
                Role "Member" akan dikirim sebagai `direct_member` ke API.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={loading}>
                Kirim Invite
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        title={alert.title}
        message={alert.message}
        variant={alert.variant}
      />
    </DashboardLayout>
  );
}
