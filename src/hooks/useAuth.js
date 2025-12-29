'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  // useAuthContext sudah memiliki runtime check untuk SSR/build time
  return useAuthContext();
}
