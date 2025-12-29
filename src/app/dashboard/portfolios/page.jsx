'use client';

import dynamicImport from 'next/dynamic';

const PortfolioManagement = dynamicImport(
  () => import('@/pages/PortfolioManagement'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
);

// Force dynamic rendering - prevent static generation
// Mirip dengan pendekatan SPA seperti imuii-portal
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
// Note: revalidate tidak bisa digunakan di client components

export default function PortfolioManagementPage() {
  return <PortfolioManagement />;
}
