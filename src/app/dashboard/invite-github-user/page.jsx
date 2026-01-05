'use client';

import dynamicImport from 'next/dynamic';

const InviteGithubUser = dynamicImport(
  () => import('@/pages/InviteGithubUser'),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    ),
  }
);

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function InviteGithubUserPage() {
  return <InviteGithubUser />;
}
