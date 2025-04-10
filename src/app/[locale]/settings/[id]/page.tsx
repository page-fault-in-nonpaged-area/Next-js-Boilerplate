import { getSettings } from '@/mockdata/settings-data'; // You'll need to create this
import { Suspense } from 'react';
import SettingsClient from './client';
import { NavigationPathUpdater } from './path';
import '@/styles/zrx/loading.css';

// Simple loading component for the entire settings page
function Loading() {
  return (
    <div className="min-h-screen mx-auto py-12 px-4 sm:px-6 lg:max-w-6xl lg:px-8">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-12 zrx-skeleton rounded mb-6 w-1/3" />
      </div>

      {/* Settings section skeletons */}
      {[1, 2, 3].map(i => (
        <div key={i} className="mb-12">
          <div className="h-8 zrx-skeleton rounded mb-6 w-1/4" />
          <div className="h-6 zrx-skeleton rounded mb-8 w-1/2" />

          <div className="space-y-4 mb-6">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="h-10 zrx-skeleton rounded w-1/2" />
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <div className="h-10 zrx-skeleton rounded w-24" />
            <div className="h-10 zrx-skeleton rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Main settings page component - combining both data fetching and rendering
async function SettingsPageContent() {
  // Fetch settings data
  const settings = await getSettings('system');

  return (
    <main className="p-6">
      <div className="min-h-screen p-6 mx-auto max-w-screen-lg">
        {/* Settings header */}
        <div className="mb-10">
          <h1 className="zrx-h1 mt-8">Settings</h1>
        </div>

        {/* Client component for interactive parts */}
        <SettingsClient initialSettings={settings} />
      </div>
    </main>
  );
}

// Export the page with navigation updater and suspense boundary
export default function SettingsPage() {
  return (
    <>
      {/* Navigation path updater - runs immediately before any suspense or data fetching */}
      <NavigationPathUpdater />
      {/* Content with suspense boundary */}
      <Suspense fallback={<Loading />}>
        <SettingsPageContent />
      </Suspense>
    </>
  );
}
