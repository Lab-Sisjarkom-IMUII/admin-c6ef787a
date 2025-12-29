'use client';

// Force dynamic rendering - prevent static generation for all dashboard pages
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
// Note: revalidate tidak bisa digunakan di client components
// dynamic = 'force-dynamic' sudah cukup untuk mencegah static generation

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}

